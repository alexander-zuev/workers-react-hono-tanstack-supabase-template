import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { HTTPException } from 'hono/http-exception';

// Define your app context type (extend as needed)
type AppContext = {
  Bindings: Env;
  Variables: {
    userId?: string;
  };
};

export const app = new Hono<AppContext>()
  .basePath('/api/v1')
  
  // Global error handler
  .onError((err, c) => {
    console.error('Unhandled error:', err);
    
    if (err instanceof HTTPException) {
      return err.getResponse();
    }
    
    return c.json({ error: 'Internal server error' }, 500);
  })
  
  // Request logging middleware
  .use(logger())
  
  // Health check endpoint
  .get('/health', (c) => {
    return c.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  })
  
  // Example API endpoint
  .get('/tasks', (c) => {
    // Dummy tasks data
    const tasks = [
      { id: 1, title: 'Sample Task 1', completed: false },
      { id: 2, title: 'Sample Task 2', completed: true },
    ];
    
    return c.json({ data: tasks });
  })
  
  // Example POST endpoint
  .post('/tasks', async (c) => {
    try {
      const body = await c.req.json();
      
      // Basic validation
      if (!body.title) {
        throw new HTTPException(400, { message: 'Title is required' });
      }
      
      // Dummy response - in real app you'd save to database
      const newTask = {
        id: Date.now(),
        title: body.title,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      
      return c.json({ data: newTask }, 201);
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }
      
      throw new HTTPException(500, { message: 'Failed to create task' });
    }
  });