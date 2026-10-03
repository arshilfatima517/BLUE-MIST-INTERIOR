Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const {
      roomType,
      roomSize,
      preferredStyle,
      preferredColors,
      budget,
      furnitureRequirements,
    } = await req.json();

    if (!roomType || !preferredStyle || !budget) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: roomType, preferredStyle, budget" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert interior designer with 15+ years of experience in luxury residential and commercial design. You generate personalized interior design recommendations based on user preferences. Always respond with valid JSON only, no markdown or extra text.`;

    const userPrompt = `Generate a personalized interior design recommendation for the following space. Return ONLY a JSON object with this exact structure:

{
  "recommendedStyle": "string - the recommended interior style name",
  "styleDescription": "string - 1-2 sentence description of why this style works",
  "colorPalette": [{"name": "string", "hex": "string"}],
  "furnitureSuggestions": ["string"],
  "lightingSuggestions": ["string"],
  "decorationSuggestions": ["string"],
  "estimatedBudget": "string - estimated budget range",
  "budgetBreakdown": [{"item": "string", "cost": "string"}],
  "imagePrompt": "string - a detailed visual description for an AI image generator to create a photorealistic interior design render"
}

Space details:
- Room type: ${roomType}
- Room size: ${roomSize}
- Preferred style: ${preferredStyle}
- Preferred colors: ${preferredColors}
- Budget: ${budget}
- Furniture requirements: ${furnitureRequirements}

Provide 4-5 furniture suggestions, 3-4 lighting suggestions, 3-4 decoration suggestions, 4 color palette colors, 5-6 budget breakdown items, and a detailed image prompt for generating a photorealistic render of this room design.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1800,
      }),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `AI service error: ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No response from AI service" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let designResult: { imagePrompt?: string; imageUrl?: string; [key: string]: unknown };
    try {
      designResult = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        designResult = JSON.parse(jsonMatch[0]);
      } else {
        return new Response(
          JSON.stringify({ error: "Invalid AI response format" }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Generate a real image using DALL-E 3
    const imagePrompt = designResult.imagePrompt || `Photorealistic interior design render of a ${preferredStyle} ${roomType}, featuring ${preferredColors}, professional architectural photography, high-end interior design magazine quality, natural lighting, 8k`;

    const imageResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      }),
    });

    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      const imageUrl = imageData.data?.[0]?.url;
      if (imageUrl) {
        designResult.imageUrl = imageUrl;
      }
    }

    return new Response(
      JSON.stringify(designResult),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
// trigger redeploy Tue Sep 22 17:16:08 UTC 2026
