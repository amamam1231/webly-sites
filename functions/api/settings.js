export async function onRequestGet(context) {
  const { env } = context

  try {
    const { results } = await env.DB.prepare(
      "SELECT key, value FROM site_settings"
    ).all()

    const settings = {}
    results.forEach(row => {
      settings[row.key] = row.value
    })

    return new Response(JSON.stringify(settings), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}