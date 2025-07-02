import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // TypeScript schema definition - single source of truth for database structure
  schema: './src/backend/infrastructure/database/schema.ts',
  
  // Output directory for schema introspection (not used for migrations)
  out: './src/backend/infrastructure/database/migrations',
  
  dialect: 'postgresql',
  dbCredentials: {
    // Local Supabase connection string
    url: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
    ssl: true,
  },
  
  // Only pull schema from public and auth schemas
  schemaFilter: ['public', 'auth'],
  
  // Drizzle only pulls schema - Supabase manages actual migrations via supabase/migrations/
  extensionsFilters: [],
  strict: true,
  verbose: true,
});