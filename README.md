# Full-stack Cloudflare Workers Template: React v19 + Hono + TanStack Router + Supabase

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![React](https://img.shields.io/badge/React_v19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TanStack](https://img.shields.io/badge/TanStack_Router-FF4154?style=for-the-badge&logo=react-router&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

<div align="center">

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/alexander-zuev/workers-react-hono-tanstack-supabase-template)

</div>

> A production-ready full-stack application template built on Cloudflare Workers, housing both React
> SPA and Hono API on a single worker. It covers the nitty-gritty stuff you won't find on Cloudflare
> docs so that the day you see grey hair is as far as possible.

## What's Included

- ⚡ **Cloudflare Workers** - Backend API + static assets served from edge locations globally
- ⚛️ **React v19** - Latest React with compiler for automatic optimizations
- 🗄️ **Hyperdrive + Supabase** - Connection pooling for Postgres + built-in auth
- 🛠️ **Drizzle ORM** - Type-safe queries, edge-compatible, no build step needed
- 🚀 **Hono** - Fast 20KB framework designed for Workers (vs 200KB+ Express)
- 📱 **TanStack Router** - File-based routing with full TypeScript support
- 🎨 **Tailwind v4 + Radix UI + Shadcn** - Utility-first CSS with accessible components
- ✅ **Testing Setup** - Vitest with dual environments: Workers pool for backend, jsdom for frontend
- 📦 **Monorepo Structure** - Shared types between frontend/backend, no duplication

## How to Use This Repository

This repository serves two purposes:

1. **As a template** - Clone and build your own app on this foundation
2. **As a reference** - Learn how to integrate these technologies properly

> **Note**: This guide assumes you can access official Cloudflare / Hono / Supabase docs so it
> focuses on the non-obvious integration points and gotchas specific to this stack.

## Quick Start

```bash
# 1. Click "Use this template" button on GitHub
# 2. Clone your new repository:
git clone https://github.com/<your-github-username>/<your-new-repo-name>.git
cd <your-new-repo-name>
pnpm install

# 3. Set up environment variables:
cp .env.example .env
cp .dev.vars.example .dev.vars
# Update with your actual values
```

## Architecture Overview

This template creates **two Vite environments** in a single application:

1. **Frontend Environment**: React SPA with Vite dev server + HMR
2. **Backend Environment**: Cloudflare Workers with Vite for bundling + local preview

Unlike traditional setups, your React frontend and API backend are **bundled and
deployed together** as a single Cloudflare Worker. The worker serves both static assets (React) and
API routes (Hono) from the edge.

## Organize Your Code

> **Note**: `src/backend` and `src/frontend` should never import from each other. Place
> shared logic (types, API schemas) in `src/shared`.

```
├── src/
│   ├── backend/                 # Cloudflare Workers API
│   │   ├── api/                # HTTP routes and middleware
│   │   ├── application/        # Use cases and application logic
│   │   ├── domain/             # Core business logic (DDD pattern)
│   │   ├── infrastructure/     # Database, external services
│   │   ├── shared/             # Backend utilities
│   │   └── worker.ts           # Workers entry point
│   ├── frontend/               # React SPA
│   │   ├── components/         # UI components (atomic design)
│   │   ├── features/           # Feature modules
│   │   ├── api-client/         # Type-safe API client
│   │   ├── shared/             # Frontend utilities
│   │   └── main.tsx           # Frontend entry point
│   └── shared/                 # Shared types, schemas, routes
│       ├── api-routes.ts       # Route definitions
│       ├── api-schemas/        # Zod validation schemas
│       └── types/              # Common TypeScript types
├── .env.example                # Frontend environment variables (Vite)
├── .env.production.example     # Production frontend variables
├── .dev.vars.example           # Workers environment variables (local)
├── drizzle.config.ts          # Database schema configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # Root TypeScript config
├── tsconfig.app.json          # Frontend-specific config
├── tsconfig.node.json         # Backend-specific config
├── tsconfig.worker.json       # Workers-specific config
├── vite.config.ts             # Build configuration
├── vitest.config.ts           # Test runner configuration
└── wrangler.json              # Cloudflare Workers deployment config
```

## Configure Key Integrations

### 1. Drizzle + Supabase + Hyperdrive

**PostgreSQL Schema Path Issue**: Hyperdrive connections require explicit schema path configuration. Without setting `search_path`, queries fail with `relation does not exist` errors because PostgreSQL cannot locate tables in Supabase's default `public` schema.

```typescript
// src/backend/infrastructure/database/connection.ts
export async function createDbConnection(
    connectionString: string,
    jwtPayload?: { sub: string; role: string }
): Promise<DatabaseConfig> {
    const connection = postgres(connectionString, {max: 5});
    const db = drizzle(connection, {schema, casing: 'snake_case'});

    if (jwtPayload) {
        // Configure Row Level Security context
        await connection`SELECT set_config('request.jwt.claims', ${JSON.stringify(jwtPayload)}, TRUE)`;
        await connection`SET LOCAL ROLE ${sql.unsafe(jwtPayload.role)}`;

        // Required: Set schema search path for table resolution
        await connection`SET search_path TO public, extensions`;
    }

    return {db, close: () => connection.end()};
}
```

**Migration Strategy**: Supabase-first approach with Drizzle as type generator

```bash
# 1. Create migration in Supabase
supabase migration new create_tasks_table

# 2. Write SQL in the generated migration file
# supabase/migrations/20231201000000_create_tasks_table.sql

# 3. Apply migration to database
supabase db push

# 4. Generate TypeScript types from applied schema
pnpm db:pull  # Runs: drizzle-kit introspect

# 5. Use generated types in your application
```

**Key Points**:
- Supabase manages schema migrations and RLS policies
- Drizzle introspects the applied schema to generate TypeScript types
- Never use `drizzle-kit push` - it conflicts with Supabase's migration system
- Always apply schema changes through Supabase first, then pull types

### 2. Shared Type System

```typescript
// src/shared/api-schemas/tasks.schemas.ts
export const CreateTaskSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

// Automatically generates TypeScript types
export type CreateTaskRequest = z.infer<typeof CreateTaskSchema>;

// Used in backend for validation
app.post('/tasks', zValidator('json', CreateTaskSchema), async (c) => {
    const task = c.req.valid('json'); // Fully typed!
    // ...
});

// Used in frontend for type safety
const createTask = async (data: CreateTaskRequest) => {
    // ...
};
```

**Benefits:**

- Single source of truth for API contracts
- Compile-time safety between frontend/backend
- Runtime validation with Zod
- No API type drift

### 3. TanStack Router + Supabase Auth Integration

**The Challenge**: TanStack Router's `beforeLoad` is async, but auth stores need to be checked for
initialization state. This helper waits for auth to be ready:

```typescript
// main.tsx - Auth helper that waits for store initialization
export function waitForAuth(): Promise<{ user: User | null }> {
    const {user, isInitialized} = useAuthStore.getState();

    if (isInitialized) {
        return Promise.resolve({user});
    }

    return new Promise(resolve => {
        const unsub = useAuthStore.subscribe(state => {
            if (state.isInitialized) {
                unsub();
                resolve({user: state.user});
            }
        });
    });
}

// Router with auth context
const router = createRouter({
    routeTree,
    context: {
        queryClient,
        waitForAuth, // Function is passed directly, not called
    },
});
```

**Protected Routes Pattern:**

```typescript
// _auth/route.tsx - Protects all nested routes
export const Route = createFileRoute('/_auth')({
    beforeLoad: async ({location, context}) => {
        const {user} = await context.waitForAuth();

        if (!user) {
            localStorage.setItem('auth_redirect', location.href);
            throw redirect({
                to: '/',
                search: {redirect: location.href},
            });
        }
    },
    component: () => <Outlet / >,
});
```

## Environment Configuration

**Why Multiple Environment Files?**

- **`.env.example`**: Frontend variables template (copy to `.env`, prefixed with `VITE_`)
- **`.env.production.example`**: Production frontend variables template
- **`.dev.vars.example`**: Workers variables template (copy to `.dev.vars` for local development)
- **Production Workers**: Use `wrangler secret put` for sensitive values

```bash
# Frontend (.env) - Available in browser
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_public_anon_key
VITE_APP_ENV=development

# Workers (.dev.vars) - Server-side only
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
HYPERDRIVE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
SUPABASE_JWT_SECRET=your_secret_jwt_key

# Production Workers (use wrangler secret put)
wrangler secret put DATABASE_URL
wrangler secret put SUPABASE_JWT_SECRET
```

## Database Setup & RLS Configuration

### 1. Supabase Project Setup

```bash
# Initialize Supabase
npx supabase@latest init
npx supabase@latest start

# Create your schema in supabase/migrations/
# Example: tasks table with RLS
```

### 2. Row Level Security (RLS) Setup

```sql
-- Enable RLS on your tables
ALTER TABLE tasks
    ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own tasks
CREATE POLICY "Users can view own tasks" ON tasks
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own tasks
CREATE POLICY "Users can insert own tasks" ON tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 3. Hyperdrive Configuration

```bash
# Create Hyperdrive in Cloudflare dashboard
wrangler hyperdrive create my-hyperdrive --connection-string="postgresql://..."

# Update wrangler.json with the Hyperdrive ID
```

## Development Workflow

```bash
# Start full-stack development
pnpm dev              # Both frontend and backend with HMR

# Database operations
pnpm db:pull          # Pull schema from Supabase + generate types

# Testing
pnpm test             # Run all tests with coverage
pnpm test:backend     # Backend tests (Workers environment)
pnpm test:frontend    # Frontend tests (jsdom environment)

# Deployment
pnpm deploy           # Build + deploy to Cloudflare Workers
```

## Testing Strategy

**Dual Environment Setup**: Tests run in their appropriate runtime environments with separate TypeScript configurations.

### Backend Tests (`tests/backend/`)

Run in **Cloudflare Workers environment** using `@cloudflare/vitest-pool-workers`. Examples include schema validation tests and API integration tests using `SELF.fetch()`.

**Configuration Files:**
- `tests/backend/tsconfig.json` - Extends root config + Workers types
- `tests/backend/env.d.ts` - Extends `cloudflare:test` with your `Env` interface

```typescript
// tests/backend/env.d.ts - WHY NEEDED: Type safety for test environment
declare module 'cloudflare:test' {
  interface ProvidedEnv extends Env {
    // Your environment variables are now typed in tests
  }
}
```

### Frontend Tests (`tests/frontend/`)

Run in **jsdom environment** for React components and browser APIs. Examples include utility function tests and component testing.

**Configuration Files:**
- `tests/frontend/tsconfig.json` - Extends app config for frontend tests
- `tests/frontend/unit/setup.tsx` - Mocks browser APIs + environment variables

```typescript
// tests/frontend/unit/setup.tsx - WHY NEEDED: Browser API mocks for jsdom
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
}));
```

### Vitest Configuration

```typescript
// vitest.config.ts - Dual project setup
projects: [
  // Backend: Actual Workers runtime simulation
  defineWorkersProject({
    test: {
      name: 'backend',
      include: ['tests/backend/**/*.{test,spec}.ts'],
      poolOptions: {
        workers: {
          miniflare: {
            compatibilityFlags: ['nodejs_compat'],
            vars: { SUPABASE_JWT_SECRET: 'test-secret' },
          },
        },
      },
    },
  }),
  
  // Frontend: jsdom environment
  {
    test: {
      name: 'frontend',
      environment: 'jsdom',
      include: ['tests/frontend/**/*.{test,spec}.{ts,tsx}'],
    },
  },
]
```

**Run Tests:**
```bash
pnpm test             # All tests with coverage
pnpm test:backend     # Workers environment only  
pnpm test:frontend    # jsdom environment only
```

## Dependency Injection Patterns

### Routes vs Scheduled Handlers

**Routes** (HTTP requests):

```typescript
// Middleware provides dependencies via context
app.use('*', async (c, next) => {
    const db = await createDbConnection(c.env.HYPERDRIVE_URL);
    c.set('db', db);
    await next();
});

app.get('/tasks', async (c) => {
    const db = c.get('db'); // Injected dependency
    // ...
});
```

**Scheduled Handlers** (cron jobs):

```typescript
// worker.ts
async scheduled(
    controller: ScheduledController, 
    env: Env, 
    ctx: ExecutionContext
) {
    // Manually create dependencies for scheduled context
    const db = await createDbConnection(env.HYPERDRIVE_URL);
    const taskService = new TaskService(db);

    switch (controller.cron) {
        case '0 * * * *':
            await taskService.processOverdueTasks();
            break;
    }

    await db.close();
}
```

## Deployment

### Cloudflare Workers (Full-stack)

```bash
# Deploy entire application (frontend + backend)
pnpm deploy

# Set production secrets
wrangler secret put DATABASE_URL
wrangler secret put SUPABASE_JWT_SECRET
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run `pnpm test` and `pnpm lint`
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Need help?** Open an issue for support and feature requests.