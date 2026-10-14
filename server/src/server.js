import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import enquiriesRouter from './routes/enquiries.js';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;
app.disable('x-powered-by');
app.use(helmet());
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map(x => x.trim()).filter(Boolean);
app.use(cors({ origin(origin, callback) {
  if (!origin || origins.includes(origin)) return callback(null, true);
  return callback(new Error('Origin not allowed by CORS'));
}, methods: ['GET', 'POST', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '20kb' }));
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Ethixweb API is running successfully'
  });
});
app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/admin', adminRouter);

app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((err, _req, res, _next) => {
  console.error(err?.message || 'Unexpected server error');
  if (err?.name === 'ValidationError') return res.status(400).json({ message: 'Please check the submitted fields.' });
  if (err?.name === 'CastError') return res.status(400).json({ message: 'Invalid enquiry ID.' });
  if (err?.message === 'Origin not allowed by CORS') return res.status(403).json({ message: 'Origin not allowed.' });
  return res.status(500).json({ message: 'Something went wrong on the server.' });
});

try {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Copy .env.example to .env and configure it.');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Ethixweb API listening on port ${PORT}`));
} catch (err) {
  console.error(`Startup failed: ${err.message}`);
  process.exit(1);
}