import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

// Example table schema - replace with your own tables
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  priority: varchar('priority', { length: 10 }).notNull().default('medium'),
  completed: boolean('completed').notNull().default(false),
  dueDate: timestamp('due_date', { withTimezone: true }),
  userId: uuid('user_id').notNull(), // References auth.users
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Export schema for Drizzle
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;