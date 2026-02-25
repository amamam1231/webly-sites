export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare('SELECT key, value FROM site_settings').all();
    const settings = {};
    if (results) {
      results.forEach(row => {
        settings[row.key] = row.value;
      });
    }
    return new Response(JSON.stringify(settings), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const statements = [];
    
    for (const [key, value] of Object.entries(data)) {
      statements.push(
        context.env.DB.prepare(
          'INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime("now")'
        ).bind(key, String(value))
      );
    }
    
    if (statements.length > 0) {
      await context.env.DB.batch(statements);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
