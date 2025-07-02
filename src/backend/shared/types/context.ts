import { drizzle } from 'drizzle-orm/postgres-js';

// Environment variables for Cloudflare Workers
export interface Env {
  // Database
  DATABASE_URL: string;
  HYPERDRIVE_URL: string;
  
  // Supabase
  SUPABASE_JWT_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  
  // Other services (optional)
  RESEND_API_KEY?: string;
  SENTRY_DSN?: string;
}

// JWT payload from Supabase
export interface JWTPayload {
  sub: string; // User ID
  email?: string;
  role?: string;
  aud?: string;
  exp?: number;
  iat?: number;
}

// Hono context with typed environment and variables
export interface AppContext {
  Bindings: Env;
  Variables: {
    // Auth context
    jwtPayload?: JWTPayload;
    userId?: string;
    userRole?: string;
    
    // Database
    db?: ReturnType<typeof drizzle>;
  };
}