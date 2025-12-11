import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { step } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = stepPrompts[step] || stepPrompts[1];
    
    console.log(`Generating illustration for step ${step} with prompt: ${prompt}`);

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
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "No image generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Successfully generated illustration for step ${step}`);

    return new Response(JSON.stringify({ imageUrl, step }), {
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
