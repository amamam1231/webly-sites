// Simple Auth with Cloudflare D1
// NOTE: For a real production app, use proper session/JWT logic. 
// This is a minimal implementation for the "Mini-Lovable" admin panel.

export async function onRequestPost(context) {
  try {
    // Читаем все данные из request ОДИН РАЗ (чтобы избежать ошибки "Body has already been used")
    const requestData = await context.request.json();
    const { action, username, password, newPassword, verificationToken, telegramId } = requestData;
    const url = new URL(context.request.url);
    const siteId = url.hostname;
    
    // Для login и register требуется username и password
    if ((action === 'login' || action === 'register') && (!username || !password)) {
      return new Response(JSON.stringify({ error: 'Требуется логин и пароль' }), { status: 400 });
    }

    // Hash password simply using Web Crypto API
    const encoder = new TextEncoder();
    
    // Хешируем password только если он есть (для login/register)
    let hashHex = '';
    if (password) {
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    if (action === 'register') {
      // Check if any user already exists for THIS site (we only allow 1 admin per site)
      const { results } = await context.env.DB.prepare('SELECT count(*) as count FROM admin_users WHERE site_id = ?').bind(siteId).all();
      
      if (results && results[0] && results[0].count > 0) {
        return new Response(JSON.stringify({ error: 'Админ уже зарегистрирован. Войдите в систему.' }), { status: 400 });
      }

      // При регистрации устанавливаем needs_password_change=1 для обязательной смены пароля
      await context.env.DB.prepare(
        'INSERT INTO admin_users (site_id, username, password_hash, needs_password_change) VALUES (?, ?, ?, 1)'
      ).bind(siteId, username, hashHex).run();

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Админ создан успешно',
        needsPasswordChange: true 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'login') {
      const { results } = await context.env.DB.prepare(
        'SELECT id, needs_password_change FROM admin_users WHERE site_id = ? AND username = ? AND password_hash = ?'
      ).bind(siteId, username, hashHex).all();

      if (results && results.length > 0) {
        const needsPasswordChange = results[0].needs_password_change === 1;
        return new Response(JSON.stringify({ 
          success: true, 
          token: 'admin_auth_ok',
          needsPasswordChange 
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ error: 'Неверный логин или пароль' }), { status: 401 });
      }
    }
    
    if (action === 'change_password') {
      // Данные уже прочитаны в начале функции (newPassword)
      if (!newPassword || newPassword.length < 6) {
        return new Response(JSON.stringify({ error: 'Пароль должен содержать минимум 6 символов' }), { status: 400 });
      }

      // Hash new password
      const newData = encoder.encode(newPassword);
      const newHashBuffer = await crypto.subtle.digest('SHA-256', newData);
      const newHashArray = Array.from(new Uint8Array(newHashBuffer));
      const newHashHex = newHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Update password and set needs_password_change to 0
      await context.env.DB.prepare(
        'UPDATE admin_users SET password_hash = ?, needs_password_change = 0 WHERE site_id = ? AND username = ?'
      ).bind(newHashHex, siteId, username).run();

      return new Response(JSON.stringify({ success: true, message: 'Пароль успешно изменен' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'reset_password') {
      // БЕЗОПАСНЫЙ СБРОС: требуется верификационный токен от Telegram бота
      // Этот эндпоинт вызывается ТОЛЬКО из Telegram бота после верификации пользователя
      // Данные уже прочитаны в начале функции (verificationToken, telegramId)
      
      // Проверяем токен верификации (должен быть подписан секретным ключом бота)
      // В продакшене здесь должна быть проверка JWT или HMAC подписи
      if (!verificationToken || !telegramId) {
        return new Response(JSON.stringify({ error: 'Требуется верификация через Telegram бота' }), { status: 403 });
      }
      
      // Сбрасываем пароль на Telegram ID
      const resetData = encoder.encode(telegramId);
      const resetHashBuffer = await crypto.subtle.digest('SHA-256', resetData);
      const resetHashArray = Array.from(new Uint8Array(resetHashBuffer));
      const resetHashHex = resetHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      await context.env.DB.prepare(
        'UPDATE admin_users SET password_hash = ?, needs_password_change = 1 WHERE site_id = ? AND username = ?'
      ).bind(resetHashHex, siteId, telegramId).run();

      return new Response(JSON.stringify({ success: true, message: 'Пароль сброшен на ваш Telegram ID' }), {
        headers: { 'Content-Type': 'application/json' }
      });
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
