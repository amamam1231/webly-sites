// Cloudflare Function to manage site settings
export async function onRequestGet(context) {
  const { env } = context;

  try {
    const { results } = await env.DB.prepare(
      'SELECT key, value, type, label FROM site_settings'
    ).all();

    const settings = {};
    results.forEach(row => {
      settings[row.key] = row.type === 'boolean' ? row.value === 'true' : row.value;
    });

    return new Response(JSON.stringify(settings), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPut(context) {
  const { request, env } = context;

  // Auth check
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${env.ADMIN_API_KEY}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const updates = await request.json();

    for (const [key, value] of Object.entries(updates)) {
      await env.DB.prepare(
        'UPDATE site_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?'
      ).bind(String(value), key).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}