import { createRootRouteWithContext, Outlet, Link } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';

// Define the router context type - matches main.tsx router context
interface RouterContext {
  queryClient: QueryClient;
  waitForAuth: () => Promise<{ user: any | null }>;
}

function RootComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Simple header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-primary">
              Workers Template
            </Link>
            <div className="flex gap-4">
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
              <Link to="/dashboard" className="hover:text-primary">
                Dashboard (Protected)
              </Link>
            </div>
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      {/* Simple footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm opacity-70">
          Full-stack Cloudflare Workers Template with React v19 + Hono + TanStack Router + Supabase
        </div>
      </footer>
    </div>
  );
}

/**
 * NotFound page component displayed when a route doesn't match any defined routes
 */
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-full max-w-md rounded-lg border border-border bg-secondary p-8">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-foreground">Page Not Found</h1>
        <p className="mb-6 text-secondary-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link 
          to="/"
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});