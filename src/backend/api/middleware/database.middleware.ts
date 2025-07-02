import { Context } from 'hono';
import { createDbConnection, createUserDbConnection, createAdminDbConnection } from '@/backend/infrastructure/database/connection';
import { AppContext } from '@/backend/shared/types/context';
import { HTTPException } from 'hono/http-exception';

/**
 * Database middleware that provides authenticated database connections
 * 
 * Connects to Supabase via Hyperdrive with proper RLS context
 */
export function withDatabase(role: 'authenticated' | 'service_role' = 'authenticated') {
  return async (c: Context<AppContext>, next: () => Promise<void>) => {
    const connectionString = c.env.HYPERDRIVE_URL || c.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new HTTPException(500, {
        message: 'Database connection string not configured',
      });
    }

    let dbConfig;
    
    try {
      if (role === 'service_role') {
        // Admin connection for system operations
        dbConfig = await createAdminDbConnection(connectionString);
      } else {
        // User connection with RLS context
        const userId = c.get('userId');
        if (userId) {
          dbConfig = await createUserDbConnection(connectionString, userId);
        } else {
          // Unauthenticated connection
          dbConfig = await createDbConnection(connectionString);
        }
      }

      // Set database in context for route handlers
      c.set('db', dbConfig.db);

      await next();
    } catch (error) {
      console.error('Database connection failed:', error);
      throw new HTTPException(500, {
        message: 'Database connection failed',
      });
    } finally {
      // Clean up connection
      if (dbConfig) {
        c.executionCtx.waitUntil(dbConfig.close());
      }
    }
  };
}