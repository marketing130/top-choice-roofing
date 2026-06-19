export async function onRequest(context) {
  const API_URL = context.env.BLOG_API_URL;
  const API_KEY = context.env.BLOG_API_KEY;

  if (!API_URL || !API_KEY) {
    return new Response(JSON.stringify({ error: "API not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(API_URL);
  // Forward any query params from the browser (e.g. ?published=true)
  new URL(context.request.url).searchParams.forEach((v, k) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    method: context.request.method,
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
  });

  const data = await res.text();

  return new Response(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
