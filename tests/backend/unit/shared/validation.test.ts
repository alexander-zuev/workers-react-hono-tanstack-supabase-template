import { describe, it, expect } from 'vitest';
import { CreateTaskSchema, TaskQuerySchema } from '@shared/api-schemas/tasks.schemas';

/**
 * Backend Unit Test Example: Schema Validation
 * 
 * Tests Zod schemas that are shared between frontend and backend.
 * These run in the Workers environment to ensure compatibility.
 */

describe('Task Schema Validation', () => {
  describe('CreateTaskSchema', () => {
    it('should accept valid task data', () => {
      const validTask = {
        title: 'Complete project',
        description: 'Finish the task management feature',
        priority: 'high' as const,
        dueDate: '2024-12-31T23:59:59Z',
      };

      const result = CreateTaskSchema.parse(validTask);
      
      expect(result.title).toBe('Complete project');
      expect(result.priority).toBe('high');
      expect(result.dueDate).toBe('2024-12-31T23:59:59Z');
    });

    it('should reject empty title', () => {
      const invalidTask = {
        title: '',
        priority: 'medium' as const,
      };

      expect(() => CreateTaskSchema.parse(invalidTask)).toThrow();
    });

    it('should apply default priority', () => {
      const taskWithoutPriority = {
        title: 'Simple task',
      };

      const result = CreateTaskSchema.parse(taskWithoutPriority);
      
      expect(result.priority).toBe('medium');
    });
  });

  describe('TaskQuerySchema', () => {
    it('should coerce string numbers to numbers', () => {
      const queryParams = {
        page: '2',
        limit: '50',
        status: 'completed' as const,
      };

      const result = TaskQuerySchema.parse(queryParams);
      
      expect(result.page).toBe(2);
      expect(result.limit).toBe(50);
      expect(result.status).toBe('completed');
    });

    it('should apply default values', () => {
      const emptyQuery = {};

      const result = TaskQuerySchema.parse(emptyQuery);
      
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.status).toBe('all');
    });
  });
});