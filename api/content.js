import { redis, isAdmin, sendError } from './_lib.js';

const KEY = 'mediamozak:content';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const raw = await redis('GET', KEY);
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ content: raw ? JSON.parse(raw) : null });
    }

    if (req.method === 'PUT') {
      if (!isAdmin(req)) return sendError(res, 401, 'Please log in again.');
      const content = req.body && req.body.content;
      if (!content || typeof content !== 'object') return sendError(res, 400, 'Missing content');
      // Leads and login details are never stored in public site content.
      delete content.leads;
      delete content.auth;
      await redis('SET', KEY, JSON.stringify(content));
      return res.status(200).json({ ok: true });
    }

    sendError(res, 405, 'Method not allowed');
  } catch (err) {
    sendError(res, 500, err.message);
  }
}
