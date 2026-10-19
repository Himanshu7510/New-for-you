import { redis, isAdmin, sendError } from './_lib.js';

const KEY = 'mediamozak:leads';
const MAX_LEADS = 2000;

const clip = (v, n) => String(v ?? '').trim().slice(0, n);

export default async function handler(req, res) {
  try {
    // Website visitors submit the contact form
    if (req.method === 'POST') {
      const b = req.body || {};
      const lead = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: clip(b.name, 120),
        email: clip(b.email, 200),
        phone: clip(b.phone, 40),
        service: clip(b.service, 120),
        message: clip(b.message, 3000),
        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        status: 'New',
      };
      if (!lead.name || !lead.email) return sendError(res, 400, 'Name and email are required.');
      await redis('LPUSH', KEY, JSON.stringify(lead));
      await redis('LTRIM', KEY, 0, MAX_LEADS - 1);
      return res.status(200).json({ ok: true });
    }

    // Everything below is admin only
    if (!isAdmin(req)) return sendError(res, 401, 'Please log in again.');

    if (req.method === 'GET') {
      const items = (await redis('LRANGE', KEY, 0, -1)) || [];
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ leads: items.map((s) => JSON.parse(s)) });
    }

    if (req.method === 'DELETE') {
      const id = String(req.query.id || '');
      const items = (await redis('LRANGE', KEY, 0, -1)) || [];
      const match = items.find((s) => String(JSON.parse(s).id) === id);
      if (match) await redis('LREM', KEY, 1, match);
      return res.status(200).json({ ok: true });
    }

    sendError(res, 405, 'Method not allowed');
  } catch (err) {
    sendError(res, 500, err.message);
  }
}
