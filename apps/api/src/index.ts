/**
 * PrivyMint API — Server Entry Point
 *
 * Configures and starts the Express REST API server with:
 * - Security headers (Helmet)
 * - CORS for frontend integration
 * - Request logging (Morgan)
 * - Rate limiting per IP
 * - JSON body parsing
 * - All route modules
 * - Centralized error handling
 */

import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import offeringsRouter from './routes/offerings.js';
import proofsRouter from './routes/proofs.js';
import feedbackRouter from './routes/feedback.js';
import { errorHandler, notFoundHandler, sendSuccess } from './middleware/index.js';

const app = express();

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
const FRONTEND_URL = process.env['FRONTEND_URL'] ?? 'http://localhost:3000';
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────────────

// Security headers
app.use(helmet());

// CORS — allow only the PrivyMint frontend
app.use(cors({
  origin: NODE_ENV === 'production' ? FRONTEND_URL : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Request logging
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting — 100 requests per 15 minutes per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
}));

// Body parsing
app.use(express.json({ limit: '2mb' }));

// ─────────────────────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// Health check
app.get('/health', (_req, res) => {
  sendSuccess(res, {
    status: 'healthy',
    version: '0.1.0',
    network: process.env['MIDNIGHT_NETWORK'] ?? 'preprod',
    contractAddress: process.env['CONTRACT_ADDRESS'] ?? '<YOUR_DEPLOYED_CONTRACT_ADDRESS>',
  });
});

// API routes
app.use('/api/offerings', offeringsRouter);
app.use('/api/proofs', proofsRouter);
app.use('/api/feedback', feedbackRouter);

// ─────────────────────────────────────────────────────────────────────────────
// ERROR HANDLING (must be last)
// ─────────────────────────────────────────────────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🌙 PrivyMint API Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  Environment:  ${NODE_ENV}`);
  console.log(`  Port:         ${PORT}`);
  console.log(`  Network:      ${process.env['MIDNIGHT_NETWORK'] ?? 'preprod'}`);
  console.log(`  Contract:     ${process.env['CONTRACT_ADDRESS'] ?? '<not set>'}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

export default app;
