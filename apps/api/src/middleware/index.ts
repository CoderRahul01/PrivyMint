/**
 * PrivyMint API — Middleware
 *
 * Centralized response helpers and error handling utilities.
 */

import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types/index.js';
import { ZodError } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

export function sendError(res: Response, message: string, statusCode = 400): void {
  const response: ApiResponse<never> = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR HANDLING MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────────────

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    sendError(res, `Validation error: ${formatted}`, 422);
    return;
  }

  if (err instanceof Error) {
    console.error('[PrivyMint API Error]', err.message);
    sendError(res, 'Internal server error', 500);
    return;
  }

  sendError(res, 'Unknown error occurred', 500);
}

export function notFoundHandler(_req: Request, res: Response): void {
  sendError(res, 'Route not found', 404);
}
