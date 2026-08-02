// lib/d1.js - Universal Cloudflare D1 Helper with Lightning Speed In-Memory & Revalidation Caching

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '38c7d789225e89652dd6bb111403db5d';
const DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID || 'fd29c541-3fd2-4fa8-8dc1-19809ab907c3';

// In-Memory Query Cache (120 Seconds TTL for Instant 0ms Read Responses)
const memoryCache = new Map();
const CACHE_TTL_MS = 120000;

export async function queryD1(sql, params = [], options = {}) {
  const isReadQuery = /^\s*SELECT/i.test(sql);
  const cacheKey = JSON.stringify({ sql, params });

  // Check in-memory cache for read queries
  if (isReadQuery && !options.skipCache) {
    const cached = memoryCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }
  }

  // Clear cache for write operations (INSERT, UPDATE, DELETE)
  if (!isReadQuery) {
    memoryCache.clear();
  }

  // If native Cloudflare DB binding is available (Cloudflare Pages Workers Runtime)
  if (typeof process !== 'undefined' && process.env && process.env.DB && typeof process.env.DB.prepare === 'function') {
    try {
      const stmt = process.env.DB.prepare(sql);
      const bound = params.length > 0 ? stmt.bind(...params) : stmt;
      const res = await bound.all();
      const results = res.results || [];
      if (isReadQuery) {
        memoryCache.set(cacheKey, { data: results, timestamp: Date.now() });
      }
      return results;
    } catch (err) {
      console.error('Native Cloudflare D1 Error:', err);
    }
  }

  // Fallback to Cloudflare D1 REST API (Local Dev Server)
  if (!CLOUDFLARE_API_TOKEN) {
    return [];
  }

  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql, params }),
      next: isReadQuery ? { revalidate: 120 } : { revalidate: 0 }
    };

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`, fetchOptions);
    const data = await res.json();
    if (data.success && data.result && data.result[0]) {
      const results = data.result[0].results || [];
      if (isReadQuery) {
        memoryCache.set(cacheKey, { data: results, timestamp: Date.now() });
      }
      return results;
    } else {
      console.error('Cloudflare D1 REST API Error:', data.errors);
      return [];
    }
  } catch (error) {
    console.error('Cloudflare D1 Fetch Exception:', error);
    return [];
  }
}

export async function firstD1(sql, params = [], options = {}) {
  const rows = await queryD1(sql, params, options);
  return rows && rows.length > 0 ? rows[0] : null;
}

export function clearD1Cache() {
  memoryCache.clear();
}
