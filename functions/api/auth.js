// Simple Auth with Cloudflare D1
// NOTE: For a real production app, use proper session/JWT logic. 
// This is a minimal implementation for the "Mini-Lovable" admin panel.

export async function onRequestPost(context) {
  try {
    const { action, username, password } = await context.request.json();
    const url = new URL(context.request.url);
    const siteId = url.hostname;
    
    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password are required' }), { status: 400 });
    }

    // Hash password simply using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (action === 'register') {
      // Check if any user already exists for THIS site (we only allow 1 admin per site)
      const { results } = await context.env.DB.prepare('SELECT count(*) as count FROM admin_users WHERE site_id = ?').bind(siteId).all();
      
      if (results && results[0] && results[0].count > 0) {
        return new Response(JSON.stringify({ error: 'Admin already registered. Please login.' }), { status: 400 });
      }

      await context.env.DB.prepare(
        'INSERT INTO admin_users (site_id, username, password_hash) VALUES (?, ?, ?)'
      ).bind(siteId, username, hashHex).run();

      return new Response(JSON.stringify({ success: true, message: 'Admin created successfully' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'login') {
      const { results } = await context.env.DB.prepare(
        'SELECT id FROM admin_users WHERE site_id = ? AND username = ? AND password_hash = ?'
      ).bind(siteId, username, hashHex).all();

      if (results && results.length > 0) {
        // In a real app, generate a secure token here. We return a simple success flag for MVP.
        return new Response(JSON.stringify({ success: true, token: 'admin_auth_ok' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
      }
    }
    
    if (action === 'check_setup') {
        // checks if admin is setup
        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' }});
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestGet(context) {
   try {
      const url = new URL(context.request.url);
      const siteId = url.hostname;
      
      const { results } = await context.env.DB.prepare('SELECT count(*) as count FROM admin_users WHERE site_id = ?').bind(siteId).all();
      const isSetup = results && results[0] && results[0].count > 0;
      
      return new Response(JSON.stringify({ isSetup }), {
        headers: { 'Content-Type': 'application/json' }
      });
   } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
   }
}
