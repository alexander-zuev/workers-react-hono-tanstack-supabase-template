import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  // Auth guard: Check authentication before loading protected routes
  beforeLoad: async ({ location, context }) => {
    console.debug('Checking auth for protected route');

    // Wait for auth initialization (Supabase auth check)
    const { user } = await context.waitForAuth();

    // Redirect to home if not authenticated
    if (!user) {
      console.debug('Not authenticated - redirecting to homepage');
      // Store intended destination for post-login redirect
      localStorage.setItem('auth_redirect', location.href);
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      });
    }
    console.log('User authenticated - allowing access to protected route');
  },
  // Simple layout for protected routes
  component: () => <Outlet />,
});