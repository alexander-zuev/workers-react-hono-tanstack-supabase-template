import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { verify } from 'hono/jwt';
import { AppContext } from '@/backend/shared/types/context';

/**
 * Middleware to require authentication via Supabase JWT token
 * 
 * Validates Bearer token from Authorization header and sets user context
 */
export const requireAuth = async (c: Context<AppContext>, next: Next): Promise<void> => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new HTTPException(401, {
      message: 'Authorization header with Bearer token is required',
    });
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    throw new HTTPException(401, {
      message: 'JWT token is missing',
    });
  }

  try {
    // Verify the JWT token using Supabase secret
    const payload = await verify(token, c.env.SUPABASE_JWT_SECRET);
    const userId = payload?.sub;

    if (typeof userId !== 'string') {
      throw new HTTPException(401, {
        message: 'Invalid user identifier in token',
      });
    }

    // Set auth context for downstream handlers
    c.set('jwtPayload', payload);
    c.set('userId', userId);
    c.set('userRole', payload.role || 'authenticated');

    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    
    // JWT verification failed
    throw new HTTPException(401, {
      message: 'Invalid or expired JWT token',
    });
  }
};