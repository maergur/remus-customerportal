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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { step } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration is missing");
    }

    // Create Supabase client with service role key for storage access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const fileName = `step-${step}.png`;

    // Check if image already exists in storage
    console.log(`Checking cache for step ${step}...`);
    const { data: existingFile } = await supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    // Try to verify the file actually exists by checking if we can list it
    const { data: fileList } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', { search: fileName });

    if (fileList && fileList.length > 0 && fileList.some(f => f.name === fileName)) {
      console.log(`Cache hit! Returning cached illustration for step ${step}`);
      return new Response(JSON.stringify({ 
        imageUrl: existingFile.publicUrl, 
        step,
        cached: true 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate new illustration
    const prompt = stepPrompts[step] || stepPrompts[1];
    console.log(`Cache miss. Generating illustration for step ${step}...`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Failed to generate illustration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const base64ImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!base64ImageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "No image generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract base64 data and convert to binary
    const base64Data = base64ImageUrl.replace(/^data:image\/\w+;base64,/, '');
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Upload to Supabase Storage
    console.log(`Uploading illustration for step ${step} to storage...`);
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, bytes, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      // Still return the base64 image even if storage fails
      return new Response(JSON.stringify({ imageUrl: base64ImageUrl, step, cached: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    console.log(`Successfully generated and cached illustration for step ${step}`);

    return new Response(JSON.stringify({ 
      imageUrl: publicUrlData.publicUrl, 
      step,
      cached: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating illustration:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
