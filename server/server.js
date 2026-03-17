// Penzana del Merel — Order Logging Server
// Production: Turso (libSQL) for persistent storage
// Local dev: JSON file fallback when TURSO_URL is not set

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3003;
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const ADMIN_FILE = path.join(__dirname, 'public', 'ordini.html');

// Never let an unhandled error kill the process
process.on('uncaughtException', (err) => {
  console.error('[FATAL] uncaughtException:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('[FATAL] unhandledRejection:', err);
});

const ALLOWED_ORIGINS = [
  'https://micmer-git.github.io',
  'http://localhost:4321',
  'http://localhost:3000',
];

// ---- Storage abstraction ----

let db = null;
let useTurso = false;

async function initStorage() {
  if (process.env.TURSO_URL && process.env.TURSO_AUTH_TOKEN) {
    try {
      const { createClient } = await import('@libsql/client');
      // Ensure URL uses libsql:// protocol for HTTP transport
      let url = process.env.TURSO_URL;
      if (url.startsWith('libsql://')) {
        url = url.replace('libsql://', 'https://');
      }
      db = createClient({
        url,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      await db.execute(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          timestamp TEXT NOT NULL,
          customer_name TEXT NOT NULL DEFAULT 'Anonimo',
          order_mode TEXT NOT NULL DEFAULT 'table',
          table_id TEXT,
          delivery_address TEXT,
          delivery_time TEXT,
          items TEXT NOT NULL DEFAULT '[]',
          total_price REAL NOT NULL DEFAULT 0,
          pizza_count INTEGER NOT NULL DEFAULT 0,
          notes TEXT DEFAULT ''
        )
      `);
      useTurso = true;
      console.log('[OK] Storage: Turso (persistent) — connected to', process.env.TURSO_URL);
    } catch (err) {
      console.error('[WARN] Turso init failed, falling back to JSON:', err.message);
      db = null;
      useTurso = false;
    }
  } else {
    console.log('[OK] Storage: JSON file (local dev)');
  }
}

// ---- Data helpers (JSON file) ----

function readOrdersFile() {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveOrdersFile(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

// ---- Data helpers (Turso) ----

function rowToOrder(row) {
  return {
    id: row.id,
    timestamp: row.timestamp,
    customerName: row.customer_name,
    orderMode: row.order_mode,
    tableId: row.table_id,
    deliveryAddress: row.delivery_address,
    deliveryTime: row.delivery_time,
    items: JSON.parse(row.items || '[]'),
    totalPrice: row.total_price,
    pizzaCount: row.pizza_count,
    notes: row.notes || '',
  };
}

async function readOrders() {
  if (!useTurso) return readOrdersFile();
  try {
    const result = await db.execute('SELECT * FROM orders ORDER BY timestamp DESC');
    return result.rows.map(rowToOrder);
  } catch (err) {
    console.error('[ERR] Turso readOrders:', err.message);
    return [];
  }
}

async function saveOrder(order) {
  if (!useTurso) {
    const orders = readOrdersFile();
    orders.unshift(order);
    saveOrdersFile(orders);
    return;
  }
  await db.execute({
    sql: `INSERT INTO orders (id, timestamp, customer_name, order_mode, table_id, delivery_address, delivery_time, items, total_price, pizza_count, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      order.id, order.timestamp, order.customerName, order.orderMode,
      order.tableId || '', order.deliveryAddress || '', order.deliveryTime || '',
      JSON.stringify(order.items), order.totalPrice, order.pizzaCount, order.notes || '',
    ],
  });
}

async function deleteOrder(id) {
  if (!useTurso) {
    const orders = readOrdersFile();
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return false;
    orders.splice(idx, 1);
    saveOrdersFile(orders);
    return true;
  }
  const result = await db.execute({ sql: 'DELETE FROM orders WHERE id = ?', args: [id] });
  return result.rowsAffected > 0;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ---- CORS ----

function setCors(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ---- Request handling ----

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  console.log(`[REQ] ${req.method} ${pathname}`);

  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  try {
    // ---- Health check (first — fast response for Render) ----
    if (req.method === 'GET' && pathname === '/health') {
      return sendJson(res, 200, { ok: true, storage: useTurso ? 'turso' : 'json', uptime: process.uptime() });
    }

    // ---- POST /api/orders ----
    if (req.method === 'POST' && pathname === '/api/orders') {
      const data = await parseBody(req);
      const order = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        customerName: data.customerName || 'Anonimo',
        orderMode: data.orderMode || 'table',
        tableId: data.tableId || null,
        deliveryAddress: data.deliveryAddress || null,
        deliveryTime: data.deliveryTime || null,
        items: (data.items || []).map(item => ({
          name: item.name,
          qty: item.qty || 1,
          price: item.price || 0,
          size: item.size || null,
          removed: item.removed || [],
          added: item.added || [],
          note: item.note || '',
          isPizza: !!item.isPizza,
        })),
        totalPrice: data.totalPrice || 0,
        pizzaCount: data.pizzaCount || 0,
        notes: data.notes || '',
      };

      await saveOrder(order);
      console.log(`[ORDER] ${order.customerName} — ${order.pizzaCount} pizzas`);
      return sendJson(res, 201, { ok: true, id: order.id, pizzaCount: order.pizzaCount });
    }

    // ---- GET /api/orders ----
    if (req.method === 'GET' && pathname === '/api/orders') {
      const orders = await readOrders();
      return sendJson(res, 200, orders);
    }

    // ---- GET /api/stats ----
    if (req.method === 'GET' && pathname === '/api/stats') {
      const orders = await readOrders();
      const totalPizzas = orders.reduce((s, o) => s + (o.pizzaCount || 0), 0);
      const totalOrders = orders.length;

      const byCustomer = {};
      for (const o of orders) {
        const key = o.customerName || 'Anonimo';
        if (!byCustomer[key]) byCustomer[key] = { name: key, pizzas: 0, orders: 0, totalSpent: 0 };
        byCustomer[key].pizzas += o.pizzaCount || 0;
        byCustomer[key].orders += 1;
        byCustomer[key].totalSpent += o.totalPrice || 0;
      }
      const ranking = Object.values(byCustomer).sort((a, b) => b.pizzas - a.pizzas);

      return sendJson(res, 200, { totalPizzas, totalOrders, ranking });
    }

    // ---- DELETE /api/orders/:id ----
    if (req.method === 'DELETE' && pathname.startsWith('/api/orders/')) {
      const id = pathname.split('/').pop();
      const deleted = await deleteOrder(id);
      if (!deleted) return sendJson(res, 404, { ok: false, error: 'Not found' });
      return sendJson(res, 200, { ok: true });
    }

    // ---- Admin dashboard ----
    if (req.method === 'GET' && (pathname === '/' || pathname === '/ordini')) {
      const html = fs.readFileSync(ADMIN_FILE, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error(`[ERR] ${req.method} ${pathname}:`, err.message);
    if (!res.headersSent) {
      sendJson(res, 500, { error: err.message });
    }
  }
});

// Keep alive — prevent Render free tier from aggressive spin-down
setInterval(() => {
  console.log(`[ALIVE] uptime=${Math.round(process.uptime())}s storage=${useTurso ? 'turso' : 'json'}`);
}, 4 * 60 * 1000); // every 4 min

initStorage().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[OK] Penzana Order Server on port ${PORT}`);
    console.log(`[OK] Admin: http://localhost:${PORT}/ordini`);
    console.log(`[OK] Storage: ${useTurso ? 'Turso' : 'JSON file'}`);
  });
}).catch(err => {
  console.error('[FATAL] Init failed:', err);
  process.exit(1);
});
