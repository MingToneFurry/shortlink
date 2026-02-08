/**
 * ShortLink Platform - Cloudflare Worker
 * 
 * Features:
 * - Short URL redirection with optional interstitial page
 * - Admin API for link management
 * - Analytics tracking
 * - Custom suffix support
 */

// ==================== Configuration ====================
const CONFIG = {
  // Default redirect delay in seconds (for interstitial page)
  DEFAULT_DELAY: 5,
  
  // Admin session expiration (hours)
  SESSION_EXPIRY: 24,
  
  // Analytics retention days
  ANALYTICS_RETENTION: 90,
  
  // Default path prefix for short links
  DEFAULT_PATH_PREFIX: '/s/',
  
  // Admin dashboard path
  ADMIN_PATH: '/admin',
  
  // API path
  API_PATH: '/api',
};

// ==================== HTML Templates ====================

/**
 * Interstitial page template with countdown
 */
function getInterstitialTemplate(url, delay, title, description) {
  const timestamp = new Date().toISOString();
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>即将跳转 - ${title || 'ShortLink'}</title>
  <style>
    :root {
      --bg: #e8ebef;
      --panel: #f5f6f8;
      --panel-strong: #ebedef;
      --border: #d8dce1;
      --text: #2c3e50;
      --muted: #64748b;
      --accent: #0f766e;
      --accent-strong: #0b5f57;
      --accent-soft: #e7f2f1;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: "SF Pro Text", "SF Pro Display", "SF Mono", "JetBrains Mono", "IBM Plex Mono", Menlo, Monaco, Consolas, ui-monospace, "PingFang SC", "Microsoft YaHei", sans-serif;
      background: var(--bg) url('https://api.furry.ist/furry-img') center/cover fixed no-repeat;
      color: var(--text);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
      overflow: auto;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: rgba(232, 235, 239, 0.86);
      backdrop-filter: blur(2px);
      z-index: 0;
    }

    .t {
      position: relative;
      z-index: 1;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 10px;
      max-width: 640px;
      width: 100%;
      box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12);
      animation: panel-in 360ms ease-out;
    }
    
    .h {
      background: var(--panel-strong);
      border-bottom: 1px solid var(--border);
      padding: 12px 20px;
      display: flex;
      gap: 8px;
      border-radius: 10px 10px 0 0;
      align-items: center;
    }
    
    .d {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #cbd5e1;
    }
    
    .d:nth-child(1) { background: #f59e0b; }
    .d:nth-child(2) { background: #22c55e; }
    .d:nth-child(3) { background: #0ea5a5; }
    
    .c {
      padding: 40px 32px;
    }
    
    .p {
      color: var(--accent);
      font-weight: 700;
      margin-bottom: 20px;
      font-size: 13px;
      letter-spacing: 0.4px;
    }
    
    .p::before { content: '> '; }
    
    .s {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 26px;
    }
    
    .i {
      width: 48px;
      height: 48px;
      border: 2px solid var(--accent);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
    }
    
    .i svg {
      width: 28px;
      height: 28px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
    }
    
    .e {
      font-size: 64px;
      font-weight: 700;
      color: var(--accent);
      line-height: 1;
    }
    
    .m {
      margin-bottom: 28px;
    }
    
    .m h1 {
      font-size: 20px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 10px;
    }
    
    .m p {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.6;
    }
    
    .data {
      background: #fff;
      border: 1px solid #e8ecef;
      border-radius: 6px;
      padding: 18px;
      margin-bottom: 24px;
    }
    
    .r {
      display: flex;
      padding: 10px 0;
      font-size: 13px;
    }
    
    .r:not(:last-child) { border-bottom: 1px solid #f1f3f5; }
    
    .k {
      color: #94a3b8;
      min-width: 110px;
    }
    
    .k::after { content: ':'; margin-right: 12px; }
    
    .v {
      color: var(--accent);
      word-break: break-all;
    }
    
    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      background: var(--accent);
      color: white;
      text-decoration: none;
      border-radius: 999px;
      font-weight: 600;
      border: 1px solid var(--accent);
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
    }
    
    .btn:hover {
      background: var(--accent-strong);
      border-color: var(--accent-strong);
    }
    
    .btn-skip {
      background: transparent;
      color: var(--accent);
    }
    
    .btn-skip:hover { background: var(--accent-soft); }
    
    .f {
      margin-top: 24px;
      font-size: 12px;
      color: var(--muted);
      text-align: right;
    }
    
    .f a { color: var(--accent); text-decoration: none; }
    
    .cur {
      display: inline-block;
      width: 8px;
      height: 2px;
      background: var(--accent);
      margin-left: 4px;
      animation: b 1s step-end infinite;
      vertical-align: text-top;
      transform: translateY(12px);
    }
    
    @keyframes b { 50% { opacity: 0; } }
    @keyframes panel-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @media (max-width: 480px) {
      body {
        padding: 0;
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100vh;
      }
      
      .t {
        border-radius: 0;
        border-left: 0;
        border-right: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }
      
      .c {
        padding: 32px 20px;
        flex: 1;
      }
      
      .s { flex-direction: column; align-items: flex-start; }
      .e { font-size: 48px; }
      .m h1 { font-size: 18px; }
      .r { flex-direction: column; gap: 4px; }
      .k { min-width: auto; }
      .f { text-align: right; }
      .actions { flex-direction: column; }
      .btn { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="t">
    <div class="h">
      <span class="d"></span>
      <span class="d"></span>
      <span class="d"></span>
    </div>
    <div class="c">
      <div class="p">REDIRECT_PENDING<span class="cur"></span></div>
      <div class="s">
        <div class="i">
          <svg viewBox="0 0 24 24">
            <path d="M5 12h10"/>
            <path d="M13 6l6 6-6 6"/>
          </svg>
        </div>
        <div class="e" id="countdown">${delay}</div>
      </div>
      <div class="m">
        <h1>${title || '即将跳转'}</h1>
        <p>${description || '您即将访问外部链接，请注意账号和资产安全'}</p>
      </div>
      <div class="data">
        <div class="r">
          <span class="k">target_url</span>
          <span class="v">${url}</span>
        </div>
        <div class="r">
          <span class="k">delay</span>
          <span class="v">${delay}s</span>
        </div>
        <div class="r">
          <span class="k">timestamp</span>
          <span class="v">${timestamp}</span>
        </div>
      </div>
      <div class="actions">
        <a href="${url}" class="btn" id="redirect-btn">立即跳转</a>
        <button class="btn btn-skip" onclick="skipCountdown()">跳过等待</button>
      </div>
      <div class="f">
        Powered by <a href="/">ShortLink Platform</a>
      </div>
    </div>
  </div>
  <script>
    let countdown = ${delay};
    const countdownEl = document.getElementById('countdown');

    function updateCountdown() {
      countdown = Math.max(0, countdown - 1);
      countdownEl.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(timer);
        window.location.href = '${url}';
      }
    }
    
    function skipCountdown() {
      window.location.href = '${url}';
    }
    
    const timer = setInterval(updateCountdown, 1000);
    
    document.getElementById('redirect-btn').addEventListener('click', function() {
      clearInterval(timer);
    });
  </script>
</body>
</html>`;
}

/**
 * Error page template
 */
function getErrorTemplate(message, code = 404) {
  const timestamp = new Date().toISOString();
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>错误 - ${code}</title>
  <style>
    :root {
      --bg: #e8ebef;
      --panel: #f5f6f8;
      --panel-strong: #ebedef;
      --border: #d8dce1;
      --text: #2c3e50;
      --muted: #64748b;
      --accent: #b45309;
      --accent-strong: #92400e;
      --accent-soft: #f3e8d6;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: "SF Pro Text", "SF Pro Display", "SF Mono", "JetBrains Mono", "IBM Plex Mono", Menlo, Monaco, Consolas, ui-monospace, "PingFang SC", "Microsoft YaHei", sans-serif;
      background: var(--bg);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: var(--text);
    }
    
    .t {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 10px;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12);
      animation: panel-in 360ms ease-out;
    }

    .h {
      background: var(--panel-strong);
      border-bottom: 1px solid var(--border);
      padding: 12px 20px;
      display: flex;
      gap: 8px;
      border-radius: 10px 10px 0 0;
      align-items: center;
    }

    .d {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #cbd5e1;
    }

    .d:nth-child(1) { background: #f59e0b; }
    .d:nth-child(2) { background: #22c55e; }
    .d:nth-child(3) { background: #0ea5a5; }

    .c {
      padding: 40px 32px;
    }

    .p {
      color: var(--accent);
      font-weight: 700;
      margin-bottom: 20px;
      font-size: 13px;
      letter-spacing: 0.4px;
    }

    .p::before { content: '> '; }

    .s {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 26px;
    }

    .i {
      width: 48px;
      height: 48px;
      border: 2px solid var(--accent);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
    }

    .i svg {
      width: 28px;
      height: 28px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
    }

    .e {
      font-size: 64px;
      font-weight: 700;
      color: var(--accent);
      line-height: 1;
    }

    .m {
      margin-bottom: 28px;
    }

    .m h1 {
      font-size: 20px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 10px;
    }

    .m p {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.6;
    }

    .data {
      background: #fff;
      border: 1px solid #e8ecef;
      border-radius: 6px;
      padding: 18px;
      margin-bottom: 24px;
    }

    .r {
      display: flex;
      padding: 10px 0;
      font-size: 13px;
    }

    .r:not(:last-child) { border-bottom: 1px solid #f1f3f5; }

    .k {
      color: #94a3b8;
      min-width: 110px;
    }

    .k::after { content: ':'; margin-right: 12px; }

    .v {
      color: var(--accent);
      word-break: break-all;
    }

    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      background: var(--accent);
      color: white;
      text-decoration: none;
      border-radius: 999px;
      font-weight: 600;
      border: 1px solid var(--accent);
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
    }

    .btn:hover {
      background: var(--accent-strong);
      border-color: var(--accent-strong);
    }

    .cur {
      display: inline-block;
      width: 8px;
      height: 2px;
      background: var(--accent);
      margin-left: 4px;
      animation: b 1s step-end infinite;
      vertical-align: text-top;
      transform: translateY(12px);
    }

    @keyframes b { 50% { opacity: 0; } }
    @keyframes panel-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 480px) {
      body { padding: 0; }
      .t {
        border-radius: 0;
        border-left: 0;
        border-right: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }
      .c { padding: 32px 20px; flex: 1; }
      .s { flex-direction: column; align-items: flex-start; }
      .e { font-size: 48px; }
      .m h1 { font-size: 18px; }
      .r { flex-direction: column; gap: 4px; }
      .k { min-width: auto; }
      .actions { flex-direction: column; }
      .btn { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="t">
    <div class="h">
      <span class="d"></span>
      <span class="d"></span>
      <span class="d"></span>
    </div>
    <div class="c">
      <div class="p">REQUEST_DENIED<span class="cur"></span></div>
      <div class="s">
        <div class="i">
          <svg viewBox="0 0 24 24">
            <path d="M12 2L4 6v5c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6z"/>
            <path d="M15 9l-6 6M9 9l6 6"/>
          </svg>
        </div>
        <div class="e">${code}</div>
      </div>
      <div class="m">
        <h1>请求失败</h1>
        <p>${message}</p>
      </div>
      <div class="data">
        <div class="r">
          <span class="k">error_code</span>
          <span class="v">${code}</span>
        </div>
        <div class="r">
          <span class="k">timestamp</span>
          <span class="v">${timestamp}</span>
        </div>
      </div>
      <div class="actions">
        <a href="/" class="btn">返回首页</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ==================== Utility Functions ====================

/**
 * Generate a random short code
 */
function generateShortCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate custom suffix format
 */
function isValidSuffix(suffix) {
  return /^[a-zA-Z0-9_-]+$/.test(suffix) && suffix.length >= 3 && suffix.length <= 32;
}

/**
 * Parse URL path to extract short code
 */
function parseShortCode(path, prefix = '/s/') {
  if (path.startsWith(prefix)) {
    return path.slice(prefix.length).split('/')[0];
  }
  return null;
}

/**
 * Get client IP from request
 */
function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') || 
         request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
         'unknown';
}

/**
 * Get country from request
 */
function getCountry(request) {
  return request.cf?.country || 'XX';
}

/**
 * Get user agent from request
 */
function getUserAgent(request) {
  return request.headers.get('User-Agent') || 'unknown';
}

/**
 * Parse user agent to get device info
 */
function parseUserAgent(ua) {
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  
  let browser = 'Other';
  if (/Chrome/i.test(ua)) browser = 'Chrome';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Safari/i.test(ua)) browser = 'Safari';
  else if (/Edge/i.test(ua)) browser = 'Edge';
  
  let os = 'Other';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iOS|iPhone|iPad/i.test(ua)) os = 'iOS';
  
  return {
    device: isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop'),
    browser,
    os
  };
}

/**
 * Base64 encode using TextEncoder (handles Unicode correctly)
 */
function base64Encode(str) {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return btoa(binString);
}

/**
 * Base64 decode using TextDecoder (handles Unicode correctly)
 */
function base64Decode(base64) {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Base64 URL-safe encode
 */
function base64UrlEncode(str) {
  const base64 = base64Encode(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Base64 URL-safe decode
 */
function base64UrlDecode(str) {
  // Restore padding
  const padding = 4 - (str.length % 4);
  if (padding !== 4) {
    str += '='.repeat(padding);
  }
  // Restore standard base64 characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  return base64Decode(str);
}

/**
 * Generate JWT-like token (simple implementation)
 */
async function generateToken(payload, secret) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmacSHA256(`${header}.${body}`, secret);
  return `${header}.${body}.${signature}`;
}

/**
 * Verify token
 */
async function verifyToken(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    if (!header || !body || !signature) return null;
    const expectedSig = await hmacSHA256(`${header}.${body}`, secret);
    if (signature !== expectedSig) return null;
    return JSON.parse(base64UrlDecode(body));
  } catch (e) {
    console.error('Token verification error:', e);
    return null;
  }
}

/**
 * Simple HMAC-SHA256 implementation (URL-safe base64)
 */
async function hmacSHA256(message, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  // Make URL-safe
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Hash password
 */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

/**
 * Verify Cloudflare Turnstile token (optional)
 */
async function verifyTurnstileToken(token, secret, ip) {
  if (!token || !secret) return false;
  const form = new URLSearchParams();
  form.append('secret', secret);
  form.append('response', token);
  if (ip && ip !== 'unknown') {
    form.append('remoteip', ip);
  }
  const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  const data = await resp.json();
  return data && data.success === true;
}

/**
 * JSON response helper
 */
function jsonResponse(data, status = 200, cors = true) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (cors) {
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  }
  return new Response(JSON.stringify(data), { status, headers });
}

/**
 * HTML response helper
 */
function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * Redirect response helper
 */
function redirectResponse(url, status = 302) {
  return Response.redirect(url, status);
}

/**
 * Serve admin SPA and static assets from the Worker
 */
async function serveAdminApp(request, env) {
  if (!env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
    if (env.ADMIN_DASHBOARD_URL) {
      return redirectResponse(env.ADMIN_DASHBOARD_URL);
    }
    return htmlResponse(getErrorTemplate('管理后台未配置', 500), 500);
  }

  const url = new URL(request.url);
  if (url.pathname.startsWith(CONFIG.ADMIN_PATH)) {
    const stripped = url.pathname.slice(CONFIG.ADMIN_PATH.length);
    url.pathname = stripped.startsWith('/') ? stripped : `/${stripped}`;
    if (url.pathname === '') {
      url.pathname = '/';
    }
  }

  let response = await env.ASSETS.fetch(new Request(url.toString(), request));
  if (response.status === 404) {
    url.pathname = '/index.html';
    response = await env.ASSETS.fetch(new Request(url.toString(), request));
  }

  return response;
}

// ==================== Database Operations ====================

/**
 * Get link from KV
 */
async function getLink(env, shortCode) {
  const data = await env.LINKS_KV.get(`link:${shortCode}`);
  return data ? JSON.parse(data) : null;
}

/**
 * Save link to KV
 */
async function saveLink(env, shortCode, linkData) {
  await env.LINKS_KV.put(`link:${shortCode}`, JSON.stringify(linkData));
}

/**
 * Delete link from KV
 */
async function deleteLink(env, shortCode) {
  await env.LINKS_KV.delete(`link:${shortCode}`);
}

/**
 * List all links
 */
async function listLinks(env, page = 1, limit = 50) {
  const list = await env.LINKS_KV.list({ prefix: 'link:' });
  const links = [];
  
  for (const key of list.keys) {
    const data = await env.LINKS_KV.get(key.name);
    if (data) {
      const link = JSON.parse(data);
      links.push({
        shortCode: key.name.replace('link:', ''),
        ...link
      });
    }
  }
  
  // Sort by created time desc
  links.sort((a, b) => b.createdAt - a.createdAt);
  
  const total = links.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    links: links.slice(start, end),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Record click analytics
 */
async function recordClick(env, shortCode, request) {
  const timestamp = Date.now();
  const date = new Date().toISOString().split('T')[0];
  const hour = new Date().getHours();
  
  const ip = getClientIP(request);
  const country = getCountry(request);
  const ua = getUserAgent(request);
  const deviceInfo = parseUserAgent(ua);
  
  const clickData = {
    timestamp,
    ip: await hashPassword(ip), // Hash IP for privacy
    country,
    ...deviceInfo,
    referrer: request.headers.get('Referer') || 'direct'
  };
  
  // Store click data
  const clickKey = `click:${shortCode}:${timestamp}`;
  await env.ANALYTICS_KV.put(clickKey, JSON.stringify(clickData), {
    expirationTtl: CONFIG.ANALYTICS_RETENTION * 86400
  });
  
  // Update daily stats
  const dailyKey = `stats:daily:${shortCode}:${date}`;
  const dailyStats = await env.ANALYTICS_KV.get(dailyKey);
  const daily = dailyStats ? JSON.parse(dailyStats) : { count: 0, countries: {}, devices: {}, browsers: {}, hours: {} };
  daily.count++;
  daily.countries[country] = (daily.countries[country] || 0) + 1;
  daily.devices[deviceInfo.device] = (daily.devices[deviceInfo.device] || 0) + 1;
  daily.browsers[deviceInfo.browser] = (daily.browsers[deviceInfo.browser] || 0) + 1;
  daily.hours[hour] = (daily.hours[hour] || 0) + 1;
  await env.ANALYTICS_KV.put(dailyKey, JSON.stringify(daily), {
    expirationTtl: CONFIG.ANALYTICS_RETENTION * 86400
  });
  
  // Update total clicks for link
  const link = await getLink(env, shortCode);
  if (link) {
    link.clicks = (link.clicks || 0) + 1;
    link.lastClickedAt = timestamp;
    await saveLink(env, shortCode, link);
  }
}

/**
 * Get analytics for a link
 */
async function getLinkAnalytics(env, shortCode, days = 30) {
  const clicks = [];
  const countries = {};
  const devices = {};
  const browsers = {};
  const dailyStats = {};
  const hourlyStats = {};
  
  // Get all clicks for this link
  const list = await env.ANALYTICS_KV.list({ prefix: `click:${shortCode}:` });
  
  const cutoffTime = Date.now() - (days * 86400000);
  
  for (const key of list.keys) {
    const data = await env.ANALYTICS_KV.get(key.name);
    if (data) {
      const click = JSON.parse(data);
      if (click.timestamp >= cutoffTime) {
        clicks.push(click);
        
        // Aggregate countries
        countries[click.country] = (countries[click.country] || 0) + 1;
        
        // Aggregate devices
        devices[click.device] = (devices[click.device] || 0) + 1;
        
        // Aggregate browsers
        browsers[click.browser] = (browsers[click.browser] || 0) + 1;
        
        // Daily stats
        const date = new Date(click.timestamp).toISOString().split('T')[0];
        dailyStats[date] = (dailyStats[date] || 0) + 1;
        
        // Hourly stats
        const hour = new Date(click.timestamp).getHours();
        hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
      }
    }
  }
  
  return {
    totalClicks: clicks.length,
    period: days,
    countries: Object.entries(countries).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    devices: Object.entries(devices).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    browsers: Object.entries(browsers).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    daily: Object.entries(dailyStats).map(([date, value]) => ({ date, value })).sort((a, b) => a.date.localeCompare(b.date)),
    hourly: Object.entries(hourlyStats).map(([hour, value]) => ({ hour: parseInt(hour), value })).sort((a, b) => a.hour - b.hour),
    recentClicks: clicks.slice(-10).reverse()
  };
}

/**
 * Get dashboard stats
 */
async function getDashboardStats(env) {
  const links = await listLinks(env, 1, 10000);
  
  const totalLinks = links.pagination.total;
  const totalClicks = links.links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  
  // Get today's clicks
  const today = new Date().toISOString().split('T')[0];
  let todayClicks = 0;
  
  for (const link of links.links) {
    const dailyKey = `stats:daily:${link.shortCode}:${today}`;
    const stats = await env.ANALYTICS_KV.get(dailyKey);
    if (stats) {
      todayClicks += JSON.parse(stats).count;
    }
  }
  
  // Get active links (clicked in last 7 days)
  const weekAgo = Date.now() - (7 * 86400000);
  const activeLinks = links.links.filter(link => link.lastClickedAt && link.lastClickedAt >= weekAgo).length;
  
  return {
    totalLinks,
    totalClicks,
    todayClicks,
    activeLinks
  };
}

// ==================== Admin Authentication ====================

/**
 * Initialize admin user
 */
async function initAdmin(env) {
  const adminExists = await env.ADMIN_KV.get('admin:initialized');
  const defaultUsername = 'MingTone';
  const defaultPasswordPlain = 'rvz4qgt9ckh3ank_JVT';
  const adminKey = `admin:user:${defaultUsername}`;
  const legacyKey = 'admin:user:default';
  const legacyData = await env.ADMIN_KV.get(legacyKey);

  if (!adminExists) {
    const defaultPassword = await hashPassword(defaultPasswordPlain);
    await env.ADMIN_KV.put(adminKey, JSON.stringify({
      username: defaultUsername,
      password: defaultPassword,
      createdAt: Date.now()
    }));
    await env.ADMIN_KV.put('admin:initialized', 'true');
    return;
  }

  const adminData = await env.ADMIN_KV.get(adminKey);
  if (!adminData && legacyData) {
    try {
      const legacyUser = JSON.parse(legacyData);
      if (legacyUser?.username === defaultUsername) {
        await env.ADMIN_KV.put(adminKey, legacyData);
      }
    } catch {
      // Ignore legacy data if it is not valid JSON or uses a different account.
    }
  }
}

/**
 * Authenticate admin
 */
async function authenticateAdmin(env, username, password) {
  const adminData = await env.ADMIN_KV.get(`admin:user:${username}`);
  if (!adminData) return false;
  
  const admin = JSON.parse(adminData);
  const hashedPassword = await hashPassword(password);
  return admin.password === hashedPassword;
}

/**
 * Verify admin token
 */
async function verifyAdminToken(env, request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.slice(7);
  const payload = await verifyToken(token, env.JWT_SECRET);
  
  if (!payload || payload.exp < Date.now()) {
    return null;
  }
  
  return payload;
}

// ==================== API Handlers ====================

/**
 * Handle admin login
 */
async function handleLogin(env, request) {
  const { username, password, turnstileToken } = await request.json();
  
  if (!username || !password) {
    return jsonResponse({ error: '用户名和密码不能为空' }, 400);
  }

  if (env.TURNSTILE_SECRET) {
    const ip = getClientIP(request);
    const verified = await verifyTurnstileToken(turnstileToken, env.TURNSTILE_SECRET, ip);
    if (!verified) {
      return jsonResponse({ error: '人机验证失败' }, 403);
    }
  }
  
  const isValid = await authenticateAdmin(env, username, password);
  if (!isValid) {
    return jsonResponse({ error: '用户名或密码错误' }, 401);
  }
  
  const token = await generateToken({
    username,
    exp: Date.now() + (CONFIG.SESSION_EXPIRY * 3600000)
  }, env.JWT_SECRET);
  
  return jsonResponse({ token, username });
}

/**
 * Handle create short link
 */
async function handleCreateLink(env, request) {
  const admin = await verifyAdminToken(env, request);
  if (!admin) {
    return jsonResponse({ error: '未授权' }, 401);
  }
  
  const { url, customSuffix, title, description, showInterstitial, delay, expiresAt } = await request.json();
  
  if (!url) {
    return jsonResponse({ error: 'URL不能为空' }, 400);
  }
  
  // Validate URL
  try {
    new URL(url);
  } catch (e) {
    return jsonResponse({ error: '无效的URL格式' }, 400);
  }
  
  let shortCode = customSuffix;
  
  // Generate random code if no custom suffix
  if (!shortCode) {
    shortCode = generateShortCode();
    // Ensure uniqueness
    while (await getLink(env, shortCode)) {
      shortCode = generateShortCode();
    }
  } else {
    // Validate custom suffix
    if (!isValidSuffix(shortCode)) {
      return jsonResponse({ error: '自定义后缀只能包含字母、数字、下划线和连字符，长度 1-32 位' }, 400);
    }
    
    // Check if suffix is available
    if (await getLink(env, shortCode)) {
      return jsonResponse({ error: '该后缀已被使用' }, 409);
    }
  }
  
  const linkData = {
    url,
    title: title || '',
    description: description || '',
    showInterstitial: showInterstitial !== false, // default true
    delay: delay || CONFIG.DEFAULT_DELAY,
    clicks: 0,
    createdAt: Date.now(),
    createdBy: admin.username,
    expiresAt: expiresAt || null
  };
  
  await saveLink(env, shortCode, linkData);
  
  return jsonResponse({
    shortCode,
    shortUrl: `${env.BASE_URL}/s/${shortCode}`,
    ...linkData
  });
}

/**
 * Handle update short link
 */
async function handleUpdateLink(env, request, shortCode) {
  const admin = await verifyAdminToken(env, request);
  if (!admin) {
    return jsonResponse({ error: '未授权' }, 401);
  }
  
  const link = await getLink(env, shortCode);
  if (!link) {
    return jsonResponse({ error: '短链接不存在' }, 404);
  }
  
  const { url, title, description, showInterstitial, delay, expiresAt, active } = await request.json();
  
  if (url) {
    try {
      new URL(url);
      link.url = url;
    } catch (e) {
      return jsonResponse({ error: '无效的URL格式' }, 400);
    }
  }
  
  if (title !== undefined) link.title = title;
  if (description !== undefined) link.description = description;
  if (showInterstitial !== undefined) link.showInterstitial = showInterstitial;
  if (delay !== undefined) link.delay = delay;
  if (expiresAt !== undefined) link.expiresAt = expiresAt;
  if (active !== undefined) link.active = active;
  
  link.updatedAt = Date.now();
  link.updatedBy = admin.username;
  
  await saveLink(env, shortCode, link);
  
  return jsonResponse({
    shortCode,
    ...link
  });
}

/**
 * Handle delete short link
 */
async function handleDeleteLink(env, request, shortCode) {
  const admin = await verifyAdminToken(env, request);
  if (!admin) {
    return jsonResponse({ error: '未授权' }, 401);
  }
  
  const link = await getLink(env, shortCode);
  if (!link) {
    return jsonResponse({ error: '短链接不存在' }, 404);
  }
  
  await deleteLink(env, shortCode);
  
  // Clean up analytics (optional, can be done asynchronously)
  const analyticsList = await env.ANALYTICS_KV.list({ prefix: `click:${shortCode}:` });
  for (const key of analyticsList.keys) {
    await env.ANALYTICS_KV.delete(key.name);
  }
  
  return jsonResponse({ success: true, message: '短链接已删除' });
}

/**
 * Handle get link details
 */
async function handleGetLink(env, request, shortCode) {
  const admin = await verifyAdminToken(env, request);
  if (!admin) {
    return jsonResponse({ error: '未授权' }, 401);
  }
  
  const link = await getLink(env, shortCode);
  if (!link) {
    return jsonResponse({ error: '短链接不存在' }, 404);
  }
  
  return jsonResponse({
    shortCode,
    ...link
  });
}

/**
 * Handle list links
 */
async function handleListLinks(env, request) {
  const admin = await verifyAdminToken(env, request);
  if (!admin) {
    return jsonResponse({ error: '未授权' }, 401);
  }
  
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 50;
  
  const result = await listLinks(env, page, limit);
  
  return jsonResponse(result);
}

/**
 * Handle get link analytics
 */
async function handleGetAnalytics(env, request, shortCode) {
  const admin = await verifyAdminToken(env, request);
  if (!admin) {
    return jsonResponse({ error: '未授权' }, 401);
  }
  
  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get('days')) || 30;
  
  const analytics = await getLinkAnalytics(env, shortCode, days);
  
  return jsonResponse(analytics);
}

/**
 * Handle get dashboard stats
 */
async function handleGetStats(env, request) {
  const admin = await verifyAdminToken(env, request);
  if (!admin) {
    return jsonResponse({ error: '未授权' }, 401);
  }
  
  const stats = await getDashboardStats(env);
  
  return jsonResponse(stats);
}

/**
 * Handle change password
 */
async function handleChangePassword(env, request) {
  const admin = await verifyAdminToken(env, request);
  if (!admin) {
    return jsonResponse({ error: '未授权' }, 401);
  }
  
  const { oldPassword, newPassword } = await request.json();
  
  if (!oldPassword || !newPassword) {
    return jsonResponse({ error: '请提供旧密码和新密码' }, 400);
  }
  
  if (newPassword.length < 6) {
    return jsonResponse({ error: '新密码长度至少 6 位' }, 400);
  }
  
  const isValid = await authenticateAdmin(env, admin.username, oldPassword);
  if (!isValid) {
    return jsonResponse({ error: '旧密码错误' }, 400);
  }
  
  const adminData = await env.ADMIN_KV.get(`admin:user:${admin.username}`);
  const adminUser = JSON.parse(adminData);
  adminUser.password = await hashPassword(newPassword);
  adminUser.updatedAt = Date.now();
  
  await env.ADMIN_KV.put(`admin:user:${admin.username}`, JSON.stringify(adminUser));
  
  return jsonResponse({ success: true, message: '密码修改成功' });
}

// ==================== Main Request Handler ====================

export default {
  async fetch(request, env, ctx) {
    // Initialize admin on first request
    await initAdmin(env);
    
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }
    
    // API routes
    if (path.startsWith(CONFIG.API_PATH)) {
      const apiPath = path.slice(CONFIG.API_PATH.length);
      
      // Auth routes
      if (apiPath === '/auth/login' && method === 'POST') {
        return handleLogin(env, request);
      }
      
      if (apiPath === '/auth/change-password' && method === 'POST') {
        return handleChangePassword(env, request);
      }
      
      // Link routes
      if (apiPath === '/links' && method === 'GET') {
        return handleListLinks(env, request);
      }
      
      if (apiPath === '/links' && method === 'POST') {
        return handleCreateLink(env, request);
      }
      
      // Single link routes
      const linkMatch = apiPath.match(/^\/links\/([^\/]+)$/);
      if (linkMatch) {
        const shortCode = linkMatch[1];
        
        if (method === 'GET') {
          return handleGetLink(env, request, shortCode);
        }
        
        if (method === 'PUT') {
          return handleUpdateLink(env, request, shortCode);
        }
        
        if (method === 'DELETE') {
          return handleDeleteLink(env, request, shortCode);
        }
      }
      
      // Analytics routes
      const analyticsMatch = apiPath.match(/^\/analytics\/([^\/]+)$/);
      if (analyticsMatch && method === 'GET') {
        const shortCode = analyticsMatch[1];
        return handleGetAnalytics(env, request, shortCode);
      }
      
      if (apiPath === '/stats' && method === 'GET') {
        return handleGetStats(env, request);
      }
      
      return jsonResponse({ error: 'API endpoint not found' }, 404);
    }
    
    // Short link redirect
    const shortCode = parseShortCode(path, CONFIG.DEFAULT_PATH_PREFIX);
    if (shortCode) {
      const link = await getLink(env, shortCode);
      
      if (!link) {
        return htmlResponse(getErrorTemplate('该短链接不存在或已过期', 404), 404);
      }
      
      // Check if expired
      if (link.expiresAt && Date.now() > link.expiresAt) {
        return htmlResponse(getErrorTemplate('该短链接已过期', 410), 410);
      }
      
      // Check if inactive
      if (link.active === false) {
        return htmlResponse(getErrorTemplate('该短链接已被禁用', 403), 403);
      }
      
      // Record click (fire and forget)
      ctx.waitUntil(recordClick(env, shortCode, request));
      
      // Show interstitial page or direct redirect
      if (link.showInterstitial) {
        return htmlResponse(getInterstitialTemplate(
          link.url,
          link.delay || CONFIG.DEFAULT_DELAY,
          link.title,
          link.description
        ));
      } else {
        return redirectResponse(link.url);
      }
    }
    
    // Serve admin dashboard and static assets (SPA fallback)
    return serveAdminApp(request, env);
  }
};


