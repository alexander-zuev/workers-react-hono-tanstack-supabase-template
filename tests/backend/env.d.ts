import type { Env } from '@/backend/shared/types/context';

/**
 * Test environment types for backend tests
 * 
 * WHY NEEDED: This extends the cloudflare:test module with our application's 
 * Env interface so backend tests have proper type safety when accessing 
 * environment variables via `import("cloudflare:test").env`
 */
declare module 'cloudflare:test' {
  // ProvidedEnv controls the type of `import("cloudflare:test").env`
  interface ProvidedEnv extends Env {
    // Test-specific environment variables can be added here if needed
  }
}