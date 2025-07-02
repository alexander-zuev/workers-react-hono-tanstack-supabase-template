import { describe, it, expect, beforeAll } from 'vitest';
import { SELF } from 'cloudflare:test';

/**
 * Backend Integration Test Example: API Endpoints
 * 
 * Tests actual HTTP endpoints running in the Workers environment.
 * Uses SELF from cloudflare:test to make requests to the worker.
 */

describe('Health Check API', () => {
  beforeAll(async () => {
    // Setup can include database seeding, environment configuration, etc.
    console.log('Setting up integration test environment');
  });

  it('should return health status', async () => {
    const response = await SELF.fetch('http://localhost/api/v1/health');
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toMatchObject({
      status: 'ok',
      timestamp: expect.any(String),
    });
  });

  it('should handle invalid routes with 404', async () => {
    const response = await SELF.fetch('http://localhost/api/v1/nonexistent');
    
    expect(response.status).toBe(404);
  });

  it('should handle OPTIONS requests', async () => {
    const response = await SELF.fetch('http://localhost/api/v1/health', {
      method: 'OPTIONS',
    });
    
    // In a real app, you'd configure CORS middleware in Hono
    expect(response.status).toBeGreaterThanOrEqual(200);
  });
});