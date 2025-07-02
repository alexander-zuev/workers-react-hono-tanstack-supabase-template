import { defineConfig } from 'vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { cloudflare } from '@cloudflare/vite-plugin';

// React 19 Compiler configuration
const ReactCompilerConfig = {
  target: '19',
};

export default defineConfig({
  plugins: [
    // TanStack Router: File-based routing with automatic code splitting
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: 'src/frontend/routes',
      generatedRouteTree: 'src/frontend/routeTree.gen.ts',
    }),
    // Path resolution for TypeScript path aliases (@/*, @shared/*, etc.)
    tsconfigPaths(),
    // React plugin with React 19 Compiler for automatic optimizations
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
    // Tailwind CSS v4 integration
    tailwindcss(),
    // Cloudflare Workers integration for full-stack development
    cloudflare(),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    // Enable source maps in production if needed for debugging
    // sourcemap: true
  },
  server: {
    host: '127.0.0.1',
    open: false,
    cors: true,
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0'],
  },
  base: '/',
});