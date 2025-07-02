import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
    },
  },
});

// Auth helper that waits for store initialization
// WHY NEEDED: beforeLoad is async but needs to check if auth store is initialized
export function waitForAuth(): Promise<{ user: any | null }> {
  // TODO: Integrate with Supabase auth store
  // const { user, isInitialized } = useAuthStore.getState();
  // 
  // if (isInitialized) {
  //   return Promise.resolve({ user });
  // }
  // 
  // return new Promise(resolve => {
  //   const unsub = useAuthStore.subscribe(state => {
  //     if (state.isInitialized) {
  //       unsub();
  //       resolve({ user: state.user });
  //     }
  //   });
  // });
  
  // Mock: Always return no user (unauthenticated) for template
  return Promise.resolve({ user: null });
}

// Create router with auth context
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    queryClient,
    waitForAuth, // Function is passed directly, not called
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Mock auth initialization (would be real Supabase auth in production)
function AppWithAuth() {
  // TODO: Add real auth initialization
  // useNetworkStatus();
  // useAuthInitializer();
  
  return <RouterProvider router={router} />;
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        {/* TODO: Add theme provider, error boundaries, analytics */}
        {/* <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> */}
        {/*   <Toaster /> */}
        <AppWithAuth />
        {/* </ThemeProvider> */}
      </QueryClientProvider>
    </StrictMode>
  );
}