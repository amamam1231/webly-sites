export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const body = await request.json()
    const { name, phone, service, message } = body

    if (!name || !phone) {
      return new Response(JSON.stringify({ error: 'Name and phone required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    await env.DB.prepare(
      'INSERT INTO leads (name, phone, service, message, source) VALUES (?, ?, ?, ?, ?)'
    ).bind(name, phone, service || '', message || '', 'website').run()

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}