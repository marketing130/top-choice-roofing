export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Only handle single-segment root paths with no file extension
  if (path === '/' || path.includes('.') || path.split('/').filter(Boolean).length !== 1) {
    return new Response('Not found', { status: 404 });
  }

  const segment = path.slice(1);

  // Pass through known non-blog routes
  const knownPrefixes = ['blog', 'about', 'contact', 'gallery', 'roofing', 'siding', 'Media', 'posts', 'functions'];
  if (knownPrefixes.some(p => segment === p || segment.startsWith(p + '-') || segment.startsWith(p + '.'))) {
    return new Response('Not found', { status: 404 });
  }

  // Serve blog-post.html for slug-shaped paths
  const res = await fetch(new URL('/blog-post.html', url.origin));
  if (!res.ok) return new Response('Not found', { status: 404 });

  const html = await res.text();
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=UTF-8' },
  });
}
