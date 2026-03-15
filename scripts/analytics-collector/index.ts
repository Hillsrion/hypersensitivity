interface Env {
  ANALYTICS: AnalyticsEngineDataset;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const body = await request.json() as { event: string, properties: Record<string, any> };
      const { event, properties } = body;

      if (!event) {
        return new Response("Missing event name", { status: 400 });
      }

      // Write to Analytics Engine
      // Blobs: event name, relevant strings
      // Doubles: numeric properties
      env.ANALYTICS.writeDataPoint({
        blobs: [
          event,
          JSON.stringify(properties || {}),
          request.headers.get("cf-ipcountry") || "unknown",
        ],
        doubles: [
          properties?.score ?? 0,
          properties?.energy ?? 0,
        ],
      });

      return new Response("OK", {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      });
    } catch (err) {
      return new Response("Invalid JSON", { status: 400 });
    }
  },
};
