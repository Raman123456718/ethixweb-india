import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Enquiry from '../models/Enquiry.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { message: 'Too many login attempts. Try again later.' }
});

router.post('/login', loginLimiter, async (req, res) => {
  const { email = '', password = '' } = req.body || {};
  const configuredEmail = process.env.ADMIN_EMAIL || '';
  const configuredPassword = process.env.ADMIN_PASSWORD || '';
  if (!configuredEmail || !configuredPassword || !process.env.JWT_SECRET) {
    return res.status(503).json({ message: 'Admin login is not configured on the server.' });
  }
  const emailMatches = String(email).trim().toLowerCase() === configuredEmail.trim().toLowerCase();
  // Supports a bcrypt hash in ADMIN_PASSWORD, while allowing a local plain env password.
  const isHash = configuredPassword.startsWith('$2a$') || configuredPassword.startsWith('$2b$') || configuredPassword.startsWith('$2y$');
  const passwordMatches = isHash
    ? await bcrypt.compare(String(password), configuredPassword)
    : String(password) === configuredPassword;
  if (!emailMatches || !passwordMatches) return res.status(401).json({ message: 'Invalid email or password.' });
  const token = jwt.sign({ role: 'admin', email: configuredEmail }, process.env.JWT_SECRET, { expiresIn: '2h', issuer: 'ethixweb' });
  return res.json({ token, expiresIn: 7200 });
});

router.get('/enquiries', requireAdmin, async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(500).lean();
    res.json({ enquiries });
  } catch (err) { next(err); }
});

router.patch('/enquiries/:id', requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!['New', 'Contacted', 'Qualified', 'Closed'].includes(status)) return res.status(400).json({ message: 'Invalid lead status.' });
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found.' });
    res.json({ enquiry });
  } catch (err) { next(err); }
});

router.delete('/enquiries/:id', requireAdmin, async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found.' });
    res.json({ message: 'Enquiry deleted.' });
  } catch (err) { next(err); }
});

export default router;