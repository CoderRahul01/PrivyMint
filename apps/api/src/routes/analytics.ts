import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { aiTelemetryService } from '../services/ai-telemetry.js';
import { trackServerEvent } from '../services/posthog.js';
import { sendSuccess, sendError } from '../middleware/index.js';

const router = Router();

const TelemetryEventSchema = z.object({
  eventName: z.string().min(1),
  sessionId: z.string().min(1),
  commitment: z.string().optional(),
  payload: z.record(z.any()).default({}),
});

/**
 * GET /api/analytics/dau
 * Fetch real-time Daily Active Users (DAU), WAU, MAU, and cohort metrics.
 */
router.get('/dau', (_req, res, next) => {
  try {
    const metrics = aiTelemetryService.calculateDauMetrics();
    sendSuccess(res, metrics);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/ai/telemetry-insights
 * Behind-the-scenes AI Telemetry Service report & growth recommendations.
 */
router.get('/insights', (_req, res, next) => {
  try {
    const report = aiTelemetryService.generateAiTelemetryReport();
    sendSuccess(res, report);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/telemetry/event
 * Log a user action or telemetry event.
 */
router.post('/event', (req, res, next) => {
  try {
    const { eventName, sessionId, commitment, payload } = TelemetryEventSchema.parse(req.body);
    const eventRecord = db.recordTelemetryEvent(eventName, sessionId, payload, commitment);

    if (commitment) {
      trackServerEvent(commitment, eventName, payload);
    }

    sendSuccess(res, eventRecord, 201);
  } catch (err) {
    next(err);
  }
});

export default router;
