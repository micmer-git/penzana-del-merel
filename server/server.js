// Penzana del Merel — Order Logging Server
// Zero dependencies, Node built-ins only. Stores orders in orders.json.
// Run: node server.js
// Admin dashboard: http://localhost:3003/

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3003;
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const ADMIN_FILE = path.join(__dirname, 'public', 'ordini.html');

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://micmer-git.github.io',
  'http://localhost:4321',
  'http://localhost:3000',
];

// ---- Data helpers ----

function readOrders() {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
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
    // Allow any origin in dev
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

  setCors(req, res);

  // Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // ---- POST /api/orders — Log a new order ----
  if (req.method === 'POST' && pathname === '/api/orders') {
    try {
      const data = await parseBody(req);
      const order = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        customerName: data.customerName || 'Anonimo',
        orderMode: data.orderMode || 'table', // 'table' | 'delivery'
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

      const orders = readOrders();
      orders.unshift(order); // newest first
      saveOrders(orders);

      return sendJson(res, 201, { ok: true, id: order.id, pizzaCount: order.pizzaCount });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // ---- GET /api/orders — List all orders ----
  if (req.method === 'GET' && pathname === '/api/orders') {
    const orders = readOrders();
    return sendJson(res, 200, orders);
  }

  // ---- GET /api/stats — Pizza stats for pizzometro ----
  if (req.method === 'GET' && pathname === '/api/stats') {
    const orders = readOrders();
    const totalPizzas = orders.reduce((s, o) => s + (o.pizzaCount || 0), 0);
    const totalOrders = orders.length;

    // Ranking by customer name
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

  // ---- DELETE /api/orders/:id — Remove single order ----
  if (req.method === 'DELETE' && pathname.startsWith('/api/orders/')) {
    const id = pathname.split('/').pop();
    const orders = readOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return sendJson(res, 404, { ok: false, error: 'Not found' });
    orders.splice(idx, 1);
    saveOrders(orders);
    return sendJson(res, 200, { ok: true });
  }

  // ---- Admin dashboard (serve HTML) ----
  if (req.method === 'GET' && (pathname === '/' || pathname === '/ordini')) {
    try {
      const html = fs.readFileSync(ADMIN_FILE, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Admin page not found');
    }
  }

  // 404
  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Penzana Order Server running on http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/ordini`);
});
