export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle /blog-api proxy route
    if (url.pathname === '/blog-api') {
      const apiUrl = new URL(env.BLOG_API_URL);
      url.searchParams.forEach((v, k) => apiUrl.searchParams.set(k, v));

      const res = await fetch(apiUrl.toString(), {
        headers: {
          'x-api-key': env.BLOG_API_KEY,
          'Content-Type': 'application/json',
        },
      });

      return new Response(await res.text(), {
        status: res.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Serve static assets for everything else
    return env.ASSETS.fetch(request);
  },
};
