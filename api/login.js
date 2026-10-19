import { checkCredentials, createToken, sendError } from './_lib.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed');
  if (!process.env.ADMIN_PASSWORD) {
    return sendError(res, 500, 'ADMIN_PASSWORD is not set in Vercel environment variables.');
  }
  const { username = '', password = '' } = req.body || {};
  if (!checkCredentials(username, password)) {
    return sendError(res, 401, 'Invalid username or password.');
  }
  res.status(200).json({ token: createToken() });
}
