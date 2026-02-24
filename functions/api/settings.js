export async function onRequestGet(context) {
  const { env } = context

  try {
    const settings = await env.DB.prepare('SELECT key, value, type FROM site_settings').all()

    return new Response(JSON.stringify(settings.results), {
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