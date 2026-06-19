export async function onRequest(context) {
  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = context.env.SUPABASE_ANON_KEY;
  const slug = context.params.slug;

  // Fetch the single post matching this slug
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${slug}&published=eq.true&select=*`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );

  const posts = await res.json();

  // Return 404 if post not found or not published
  if (!posts || posts.length === 0) {
    return new Response("Post not found", { status: 404 });
  }

  const post = posts[0];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- SEO meta tags — Google reads these -->
  <title>${post.title} — Top Choice Roofing and Siding</title>
  <meta name="description" content="${post.excerpt || ""}" />

  <!-- Open Graph — controls how links look when shared on social media -->
  <meta property="og:title" content="${post.title}" />
  <meta property="og:description" content="${post.excerpt || ""}" />
  ${post.cover_image_url ? `<meta property="og:image" content="${post.cover_image_url}" />` : ""}
  <meta property="og:type" content="article" />

  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <main class="post">
    ${post.cover_image_url ? `<img class="post-cover" src="${post.cover_image_url}" alt="${post.title}" />` : ""}
    <h1>${post.title}</h1>
    <time>${new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
    <div class="post-body">
      ${post.body}
    </div>
  </main>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}
