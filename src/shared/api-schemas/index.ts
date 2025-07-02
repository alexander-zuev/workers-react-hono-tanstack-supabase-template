// Export all API schemas for easy importing
export * from './tasks.schemas';

// Common response schemas
import { z } from 'zod';

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.record(z.any()).optional(),
});

export const ApiSuccessSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export const HealthCheckSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
  version: z.string(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ApiSuccess = z.infer<typeof ApiSuccessSchema>;
export type HealthCheck = z.infer<typeof HealthCheckSchema>;