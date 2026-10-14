import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Enquiry from '../models/Enquiry.js';

const router = Router();
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many enquiries from this connection. Please try again later.' }
});
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedServices = [
  'Website design & development', 'SEO & performance marketing',
  'Brand strategy & identity', 'E-commerce', 'Something else'
];

router.post('/', enquiryLimiter, async (req, res, next) => {
  try {
    const { name, email, phone = '', company = '', service, budget = '', message, website = '' } = req.body || {};
    // Honeypot: respond as if accepted, but do not save automated spam.
    if (String(website).trim()) return res.status(201).json({ message: 'Enquiry received.' });
    if (![name, email, service, message].every(v => typeof v === 'string')) {
      return res.status(400).json({ message: 'Please complete all required fields.' });
    }
    const clean = { name: name.trim(), email: email.trim().toLowerCase(), phone: String(phone).trim(),
      company: String(company).trim(), service: service.trim(), budget: String(budget).trim(), message: message.trim() };
    if (clean.name.length < 2 || clean.name.length > 100) return res.status(400).json({ message: 'Name must be between 2 and 100 characters.' });
    if (!emailPattern.test(clean.email) || clean.email.length > 150) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (!allowedServices.includes(clean.service)) return res.status(400).json({ message: 'Choose a valid service.' });
    if (clean.message.length < 10 || clean.message.length > 3000) return res.status(400).json({ message: 'Message must be between 10 and 3000 characters.' });
    if (clean.phone.length > 20 || clean.company.length > 150 || clean.budget.length > 80) return res.status(400).json({ message: 'One or more fields are too long.' });
    const enquiry = await Enquiry.create(clean);
    return res.status(201).json({ message: 'Enquiry received.', id: enquiry._id });
  } catch (err) { next(err); }
});

export default router;