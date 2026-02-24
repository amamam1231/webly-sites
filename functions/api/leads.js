// Cloudflare Function to handle lead submissions
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.phone) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Name and phone are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert into D1 database
    await env.DB.prepare(
      `INSERT INTO leads (name, phone, service, date, time, message, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      data.name,
      data.phone,
      data.service || '',
      data.date || '',
      data.time || '',
      data.message || '',
      'new'
    ).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Lead created successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle GET request to fetch leads (for admin)
export async function onRequestGet(context) {
  const { env, request } = context;

  // Simple auth check - in production use proper authentication
  const url = new URL(request.url);
  const authKey = url.searchParams.get('key');

  if (authKey !== env.ADMIN_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM leads ORDER BY created_at DESC LIMIT 100'
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}