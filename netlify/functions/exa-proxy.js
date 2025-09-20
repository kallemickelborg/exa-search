const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow all origins for development, restrict in production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

exports.handler = async (event) => {
  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Get the path parameter from query string
    const path = event.queryStringParameters?.path;
    
    if (!path) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing 'path' parameter" }),
      };
    }

    // Validate the path
    const validPaths = ["search", "findSimilar"];
    if (!validPaths.includes(path)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: "Invalid path", 
          validPaths: validPaths 
        }),
      };
    }

    // Get API key from environment
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "EXA_API_KEY not configured" }),
      };
    }

    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};
    
    // Make request to Exa API
    const exaUrl = `https://api.exa.ai/${path}`;
    const upstream = await fetch(exaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    // Get response text
    const responseText = await upstream.text();
    
    // Return response with CORS headers
    return {
      statusCode: upstream.status,
      headers: {
        ...corsHeaders,
        "Content-Type": upstream.headers.get("content-type") || "application/json",
      },
      body: responseText,
    };
  } catch (err) {
    console.error("Proxy error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: "Proxy error", 
        detail: err.message || String(err) 
      }),
    };
  }
};
