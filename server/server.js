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
const MESSAGES_FILE = path.join(__dirname, 'messages.json');
const ADMIN_FILE = path.join(__dirname, 'public', 'ordini.html');
const TRACK_FILE = path.join(__dirname, 'public', 'track.html');

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

      // Migrate: add tracking_id, phone, status columns if missing
      try { await db.execute("ALTER TABLE orders ADD COLUMN tracking_id TEXT UNIQUE"); } catch {}
      try { await db.execute("ALTER TABLE orders ADD COLUMN phone TEXT DEFAULT ''"); } catch {}
      try { await db.execute("ALTER TABLE orders ADD COLUMN status TEXT DEFAULT 'pending'"); } catch {}

      // Create messages table
      await db.execute(`
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id TEXT NOT NULL,
          sender TEXT NOT NULL,
          text TEXT NOT NULL,
          created_at TEXT DEFAULT (datetime('now','localtime'))
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

// ---- Tracking ID generation ----

function generateTrackingId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return 'PNZ-' + code;
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

function readMessagesFile() {
  try {
    return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveMessagesFile(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
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
    trackingId: row.tracking_id || null,
    phone: row.phone || '',
    status: row.status || 'pending',
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
    sql: `INSERT INTO orders (id, timestamp, customer_name, order_mode, table_id, delivery_address, delivery_time, items, total_price, pizza_count, notes, tracking_id, phone, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      order.id, order.timestamp, order.customerName, order.orderMode,
      order.tableId || '', order.deliveryAddress || '', order.deliveryTime || '',
      JSON.stringify(order.items), order.totalPrice, order.pizzaCount, order.notes || '',
      order.trackingId || null, order.phone || '', order.status || 'pending',
    ],
  });
}

async function findOrderByTrackingId(trackingId) {
  if (!useTurso) {
    const orders = readOrdersFile();
    return orders.find(o => o.trackingId === trackingId) || null;
  }
  try {
    const result = await db.execute({ sql: 'SELECT * FROM orders WHERE tracking_id = ?', args: [trackingId] });
    if (result.rows.length === 0) return null;
    return rowToOrder(result.rows[0]);
  } catch (err) {
    console.error('[ERR] findOrderByTrackingId:', err.message);
    return null;
  }
}

async function findOrdersByPhone(phone) {
  if (!useTurso) {
    const orders = readOrdersFile();
    return orders.filter(o => o.phone === phone).map(o => ({
      trackingId: o.trackingId,
      status: o.status || 'pending',
      totalPrice: o.totalPrice,
      createdAt: o.timestamp,
    }));
  }
  try {
    const result = await db.execute({ sql: 'SELECT * FROM orders WHERE phone = ? ORDER BY timestamp DESC', args: [phone] });
    return result.rows.map(r => ({
      trackingId: r.tracking_id,
      status: r.status || 'pending',
      totalPrice: r.total_price,
      createdAt: r.timestamp,
    }));
  } catch (err) {
    console.error('[ERR] findOrdersByPhone:', err.message);
    return [];
  }
}

async function updateOrderStatus(id, status) {
  if (!useTurso) {
    const orders = readOrdersFile();
    const order = orders.find(o => o.id === id);
    if (!order) return false;
    order.status = status;
    saveOrdersFile(orders);
    return true;
  }
  const result = await db.execute({ sql: 'UPDATE orders SET status = ? WHERE id = ?', args: [status, id] });
  return result.rowsAffected > 0;
}

async function getMessages(orderId) {
  if (!useTurso) {
    const messages = readMessagesFile();
    return messages.filter(m => m.order_id === orderId);
  }
  try {
    const result = await db.execute({ sql: 'SELECT * FROM messages WHERE order_id = ? ORDER BY created_at ASC', args: [orderId] });
    return result.rows.map(r => ({
      id: r.id,
      order_id: r.order_id,
      sender: r.sender,
      text: r.text,
      created_at: r.created_at,
    }));
  } catch (err) {
    console.error('[ERR] getMessages:', err.message);
    return [];
  }
}

async function addMessage(orderId, sender, text) {
  const now = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Rome' }).replace(' ', 'T').slice(0, 19).replace('T', ' ');
  if (!useTurso) {
    const messages = readMessagesFile();
    const msg = { id: messages.length + 1, order_id: orderId, sender, text, created_at: now };
    messages.push(msg);
    saveMessagesFile(messages);
    return msg;
  }
  await db.execute({ sql: 'INSERT INTO messages (order_id, sender, text) VALUES (?, ?, ?)', args: [orderId, sender, text] });
  const result = await db.execute({ sql: 'SELECT * FROM messages WHERE order_id = ? ORDER BY id DESC LIMIT 1', args: [orderId] });
  return result.rows[0] ? { id: result.rows[0].id, order_id: result.rows[0].order_id, sender: result.rows[0].sender, text: result.rows[0].text, created_at: result.rows[0].created_at } : null;
}

async function getMessageCount(orderId) {
  if (!useTurso) {
    const messages = readMessagesFile();
    return messages.filter(m => m.order_id === orderId).length;
  }
  try {
    const result = await db.execute({ sql: 'SELECT COUNT(*) as cnt FROM messages WHERE order_id = ?', args: [orderId] });
    return Number(result.rows[0]?.cnt || 0);
  } catch {
    return 0;
  }
}

async function deleteOrder(id) {
  if (!useTurso) {
    const orders = readOrdersFile();
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return false;
    orders.splice(idx, 1);
    saveOrdersFile(orders);
    // Also remove messages for this order
    const messages = readMessagesFile();
    const filtered = messages.filter(m => m.order_id !== id);
    saveMessagesFile(filtered);
    return true;
  }
  await db.execute({ sql: 'DELETE FROM messages WHERE order_id = ?', args: [id] });
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
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
        trackingId: generateTrackingId(),
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
        phone: data.phone || '',
        status: 'pending',
      };

      await saveOrder(order);
      console.log(`[ORDER] ${order.customerName} — ${order.pizzaCount} pizzas — ${order.trackingId}`);
      return sendJson(res, 201, { ok: true, id: order.id, trackingId: order.trackingId, pizzaCount: order.pizzaCount });
    }

    // ---- GET /api/orders ----
    if (req.method === 'GET' && pathname === '/api/orders') {
      const orders = await readOrders();
      // Attach message count to each order
      const ordersWithMsgCount = await Promise.all(orders.map(async o => {
        const msgCount = await getMessageCount(o.id);
        return { ...o, messageCount: msgCount };
      }));
      return sendJson(res, 200, ordersWithMsgCount);
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

    // ---- PATCH /api/orders/:id/status ----
    if (req.method === 'PATCH' && /^\/api\/orders\/[^/]+\/status$/.test(pathname)) {
      const id = pathname.split('/')[3];
      const data = await parseBody(req);
      if (!data.status || !['pending', 'completed'].includes(data.status)) {
        return sendJson(res, 400, { ok: false, error: 'Invalid status' });
      }
      const updated = await updateOrderStatus(id, data.status);
      if (!updated) return sendJson(res, 404, { ok: false, error: 'Not found' });
      return sendJson(res, 200, { ok: true });
    }

    // ---- GET /api/orders/:id/messages ----
    if (req.method === 'GET' && /^\/api\/orders\/[^/]+\/messages$/.test(pathname)) {
      const id = pathname.split('/')[3];
      const messages = await getMessages(id);
      return sendJson(res, 200, messages);
    }

    // ---- POST /api/orders/:id/messages (admin reply) ----
    if (req.method === 'POST' && /^\/api\/orders\/[^/]+\/messages$/.test(pathname)) {
      const id = pathname.split('/')[3];
      const data = await parseBody(req);
      if (!data.text || !data.text.trim()) return sendJson(res, 400, { ok: false, error: 'Text required' });
      const msg = await addMessage(id, 'pizzeria', data.text.trim());
      return sendJson(res, 201, { ok: true, message: msg });
    }

    // ---- GET /api/track/:trackingId?phone=XXXXX ----
    if (req.method === 'GET' && /^\/api\/track\/[A-Z0-9-]+$/.test(pathname)) {
      const trackingId = pathname.split('/').pop();
      const phone = url.searchParams.get('phone') || '';
      const order = await findOrderByTrackingId(trackingId);
      if (!order) return sendJson(res, 404, { ok: false, error: 'Ordine non trovato' });
      if (!phone || order.phone !== phone) return sendJson(res, 403, { ok: false, error: 'Numero di telefono non corrispondente' });
      const messages = await getMessages(order.id);
      return sendJson(res, 200, {
        trackingId: order.trackingId,
        status: order.status || 'pending',
        customerName: order.customerName,
        orderMode: order.orderMode,
        tableId: order.tableId,
        deliveryAddress: order.deliveryAddress,
        deliveryTime: order.deliveryTime,
        items: order.items,
        totalPrice: order.totalPrice,
        timestamp: order.timestamp,
        notes: order.notes,
        messages,
      });
    }

    // ---- POST /api/track/:trackingId/messages (customer sends message) ----
    if (req.method === 'POST' && /^\/api\/track\/[A-Z0-9-]+\/messages$/.test(pathname)) {
      const trackingId = pathname.split('/')[3];
      const data = await parseBody(req);
      if (!data.phone || !data.text || !data.text.trim()) return sendJson(res, 400, { ok: false, error: 'Phone and text required' });
      const order = await findOrderByTrackingId(trackingId);
      if (!order) return sendJson(res, 404, { ok: false, error: 'Ordine non trovato' });
      if (order.phone !== data.phone) return sendJson(res, 403, { ok: false, error: 'Numero di telefono non corrispondente' });
      const msg = await addMessage(order.id, 'customer', data.text.trim());
      return sendJson(res, 201, { ok: true, message: msg });
    }

    // ---- GET /api/customer-orders?phone=XXXXX ----
    if (req.method === 'GET' && pathname === '/api/customer-orders') {
      const phone = url.searchParams.get('phone') || '';
      if (!phone) return sendJson(res, 400, { ok: false, error: 'Phone required' });
      const orders = await findOrdersByPhone(phone);
      return sendJson(res, 200, orders);
    }

    // ---- DELETE /api/orders/:id ----
    if (req.method === 'DELETE' && pathname.startsWith('/api/orders/')) {
      const id = pathname.split('/').pop();
      const deleted = await deleteOrder(id);
      if (!deleted) return sendJson(res, 404, { ok: false, error: 'Not found' });
      return sendJson(res, 200, { ok: true });
    }

    // ---- Tracking page ----
    if (req.method === 'GET' && (pathname === '/track' || pathname === '/track/')) {
      try {
        const html = fs.readFileSync(TRACK_FILE, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(html);
      } catch {
        return sendJson(res, 404, { error: 'Tracking page not found' });
      }
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
    console.log(`[OK] Track: http://localhost:${PORT}/track`);
    console.log(`[OK] Storage: ${useTurso ? 'Turso' : 'JSON file'}`);
  });
}).catch(err => {
  console.error('[FATAL] Init failed:', err);
  process.exit(1);
});
