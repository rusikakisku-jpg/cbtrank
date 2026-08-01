// lib/d1.js - Universal Cloudflare D1 Helper for Local Dev & Production

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '38c7d789225e89652dd6bb111403db5d';
const DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID || 'fd29c541-3fd2-4fa8-8dc1-19809ab907c3';

export async function queryD1(sql, params = []) {
  // If native Cloudflare DB binding is available (Cloudflare Pages Workers Runtime)
  if (typeof process !== 'undefined' && process.env && process.env.DB && typeof process.env.DB.prepare === 'function') {
    try {
      const stmt = process.env.DB.prepare(sql);
      const bound = params.length > 0 ? stmt.bind(...params) : stmt;
      const res = await bound.all();
      return res.results || [];
    } catch (err) {
      console.error('Native Cloudflare D1 Error:', err);
    }
  }

  // Fallback to Cloudflare D1 REST API (Local Dev Server)
  if (!CLOUDFLARE_API_TOKEN) {
    return [];
  }

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql, params }),
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success && data.result && data.result[0]) {
      return data.result[0].results || [];
    } else {
      console.error('Cloudflare D1 REST API Error:', data.errors);
      return [];
    }
  } catch (error) {
    console.error('Cloudflare D1 Fetch Exception:', error);
    return [];
  }
}

export async function firstD1(sql, params = []) {
  const rows = await queryD1(sql, params);
  return rows && rows.length > 0 ? rows[0] : null;
}
