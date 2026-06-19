export async function onRequest(context) {
  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = context.env.SUPABASE_ANON_KEY;

  // Fetch all published posts from Supabase, newest first
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?published=eq.true&order=published_at.desc&select=title,slug,excerpt,cover_image_url,published_at`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );

  const posts = await res.json();

  const postCards = posts.length
    ? posts
        .map(
          (p) => `
      <article class="post-card">
        ${p.cover_image_url ? `<img src="${p.cover_image_url}" alt="${p.title}" />` : ""}
        <h2><a href="/blog/${p.slug}">${p.title}</a></h2>
        ${p.excerpt ? `<p>${p.excerpt}</p>` : ""}
        <a href="/blog/${p.slug}" class="read-more">Read more →</a>
      </article>`
        )
        .join("")
    : `<p>No posts yet. Check back soon.</p>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Blog — Top Choice Roofing and Siding</title>
  <meta name="description" content="Latest news and updates from Top Choice Roofing and Siding." />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <main>
    <h1>Blog</h1>
    <div class="post-list">
      ${postCards}
    </div>
  </main>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}
