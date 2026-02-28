export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const siteId = url.hostname; // e.g., site-375.webly-sites.pages.dev
    
    const { results } = await context.env.DB.prepare('SELECT * FROM leads WHERE site_id = ? ORDER BY created_at DESC LIMIT 50').bind(siteId).all();
    return new Response(JSON.stringify(results || []), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const url = new URL(context.request.url);
    const siteId = url.hostname;
    
    // 1. Сохраняем в D1 с привязкой к site_id
    const stmt = context.env.DB.prepare('INSERT INTO leads (site_id, data, created_at) VALUES (?, ?, datetime("now"))');
    await stmt.bind(siteId, JSON.stringify(data)).run();
    
    return new Response(JSON.stringify({ success: true, message: "Lead saved successfully" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}
