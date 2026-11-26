[[...params]].js
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;

  if (method === "POST") {
    try {
      const data = await request.json();
      const type = url.searchParams.get("type");
      if (type === "info") {
        await env.KV.put("businessInfo", JSON.stringify(data));
      } else if (type === "services") {
        await env.KV.put("businessServices", JSON.stringify(data));
      }
      return new Response(JSON.stringify({ status: "success" }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 400 });
    }
  }

  if (method === "GET") {
    const info = await env.KV.get("businessInfo");
    const services = await env.KV.get("businessServices");
    return new Response(JSON.stringify({
      info: info ? JSON.parse(info) : {},
      services: services ? JSON.parse(services) : {}
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Method not allowed", { status: 405 });
}
