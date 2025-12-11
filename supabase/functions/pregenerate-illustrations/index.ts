import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stepPrompts: Record<number, string> = {
  1: "Minimalist flat illustration of a friendly person filling out a digital form on a tablet with green energy leaf symbols floating around, clean white background, modern corporate style, soft green accents, no text, 16:9 aspect ratio",
  2: "Minimalist flat illustration of a smartphone displaying a verification code with a green checkmark shield icon, security and trust theme, clean white background, soft green and blue accents, no text, 16:9 aspect ratio",
  3: "Minimalist flat illustration comparing different energy tariff options with solar panels and wind turbines in the background, eco-friendly color palette with greens and blues, clean white background, no text, 16:9 aspect ratio",
  4: "Minimalist flat illustration of identity documents and an electricity meter with official stamps, paperwork theme with green energy elements, clean white background, professional style, no text, 16:9 aspect ratio",
  5: "Minimalist flat illustration of a modern office building with a green energy certification badge and solar panels on roof, corporate sustainability theme, clean white background, no text, 16:9 aspect ratio",
  6: "Minimalist flat illustration of documents being uploaded to a cloud with camera and folder icons, digital transformation theme with green accents, clean white background, no text, 16:9 aspect ratio",
  7: "Minimalist flat illustration of a digital contract with an electronic signature pen and handshake symbol, trust and agreement theme, green energy accents, clean white background, no text, 16:9 aspect ratio",
  8: "Minimalist flat illustration of an application review process with a checklist showing green checkmarks, success and progress theme, celebratory confetti elements, clean white background, no text, 16:9 aspect ratio",
  99: "Minimalist flat illustration of an industrial factory with green energy solutions, wind turbines and solar panels, professional corporate contact theme, clean white background, no text, 16:9 aspect ratio",
};

const BUCKET_NAME = 'onboarding-illustrations';
const ALL_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 99];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Required environment variables are missing");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check which steps already have cached images
    const { data: existingFiles } = await supabase.storage
      .from(BUCKET_NAME)
      .list('');

    const existingSteps = new Set(
      existingFiles?.map(f => {
        const match = f.name.match(/step-(\d+)\.png/);
        return match ? parseInt(match[1]) : null;
      }).filter(Boolean) || []
    );

    const stepsToGenerate = ALL_STEPS.filter(step => !existingSteps.has(step));
    
    if (stepsToGenerate.length === 0) {
      return new Response(JSON.stringify({ 
        message: "All illustrations already cached",
        cached: ALL_STEPS.length,
        generated: 0
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Generating ${stepsToGenerate.length} illustrations...`);

    const results: { step: number; success: boolean; error?: string }[] = [];

    // Generate illustrations sequentially to avoid rate limits
    for (const step of stepsToGenerate) {
      try {
        console.log(`Generating illustration for step ${step}...`);
        
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [{ role: "user", content: stepPrompts[step] }],
            modalities: ["image", "text"]
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to generate step ${step}:`, errorText);
          results.push({ step, success: false, error: `API error: ${response.status}` });
          
          // If rate limited, wait a bit
          if (response.status === 429) {
            console.log("Rate limited, waiting 10 seconds...");
            await new Promise(resolve => setTimeout(resolve, 10000));
          }
          continue;
        }

        const data = await response.json();
        const base64ImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (!base64ImageUrl) {
          results.push({ step, success: false, error: "No image in response" });
          continue;
        }

        // Convert and upload
        const base64Data = base64ImageUrl.replace(/^data:image\/\w+;base64,/, '');
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(`step-${step}.png`, bytes, {
            contentType: 'image/png',
            upsert: true
          });

        if (uploadError) {
          results.push({ step, success: false, error: uploadError.message });
        } else {
          console.log(`Successfully generated and cached step ${step}`);
          results.push({ step, success: true });
        }

        // Small delay between requests to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        results.push({ step, success: false, error: errorMsg });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);

    return new Response(JSON.stringify({ 
      message: `Generated ${successful} of ${stepsToGenerate.length} illustrations`,
      cached: existingSteps.size,
      generated: successful,
      failed: failed.length > 0 ? failed : undefined,
      results
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in pregenerate-illustrations:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
