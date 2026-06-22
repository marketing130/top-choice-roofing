export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Pass through root, anything with a file extension, and known site routes
  if (path === '/' || path.includes('.')) return context.next();

  const segment = path.slice(1).split('/')[0];
  const knownPrefixes = [
    'blog', 'about', 'contact', 'gallery', 'roofing', 'siding',
    'Media', 'posts', 'functions'
  ];

  if (knownPrefixes.some(p => segment === p || segment.startsWith(p + '-'))) {
    return context.next();
  }

  // Treat unknown root-level single-segment paths as blog slugs
  const res = await fetch(new URL('/blog-post.html', url.origin));
  const html = await res.text();
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=UTF-8' },
  });
}
