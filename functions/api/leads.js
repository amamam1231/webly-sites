export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const data = await request.json()

    await env.DB.prepare(
      "INSERT INTO leads (name, email, message, created_at) VALUES (?, ?, ?, ?)"
    ).bind(
      data.name || '',
      data.email || '',
      data.message || '',
      new Date().toISOString()
    ).run()

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
}