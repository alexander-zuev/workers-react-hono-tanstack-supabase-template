import {defineConfig} from 'vitest/config';
import {defineWorkersProject} from '@cloudflare/vitest-pool-workers/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import {tanstackRouter} from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    test: {
        // Global coverage configuration for both frontend and backend
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                '**/*.test.{ts,tsx}',
                '**/*.spec.{ts,tsx}',
                'tests/**/*',
                '**/node_modules/**',
                '**/dist/**',
                '**/*.d.ts',
                'vitest.config.ts',
                'wrangler.json',
            ],
            reportsDirectory: './coverage',
        },

        // Multi-project setup: separate environments for backend (Workers) and frontend (jsdom)
        projects: [
            // Backend project: Tests run in Cloudflare Workers environment
            defineWorkersProject({
                plugins: [tsconfigPaths()],
                resolve: {
                    alias: {
                        // TODO: https://github.com/cloudflare/workers-sdk/issues/9719
                        // Special alias for postgres driver in Cloudflare Workers environment
                        postgres: path.join(
                            process.cwd(),
                            'node_modules/.pnpm/postgres@3.4.7/node_modules/postgres/cf/src/index.js'
                        ),
                    },
                },
                test: {
                    name: 'backend',
                    include: ['tests/backend/**/*.{test,spec}.ts'],
                    globals: true,
                    deps: {
                        optimizer: {
                            ssr: {
                                enabled: true,
                                // Include external dependencies that need SSR optimization
                                include: ['postgres'],
                                exclude: ['chai'],
                            },
                        },
                    },
                    poolOptions: {
                        workers: {
                            singleWorker: true, // Use single worker for consistent test execution
                            miniflare: {
                                // Compatibility flags for Cloudflare Workers features
                                compatibilityFlags: ['service_binding_extra_handlers', 'nodejs_compat'],
                                vars: {
                                    // Test environment variables
                                    SUPABASE_JWT_SECRET: 'test-jwt-secret-with-at-least-32-characters-long',
                                },
                            },
                            wrangler: {
                                configPath: './wrangler.json',
                            },
                        },
                    },
                },
            }),

            // Frontend project: Tests run in jsdom (browser-like) environment
            {
                plugins: [
                    react(),
                    tsconfigPaths(),
                    // Same TanStack Router config as main Vite config
                    tanstackRouter({
                        target: 'react',
                        autoCodeSplitting: true,
                        routesDirectory: 'src/frontend/routes',
                        generatedRouteTree: 'src/frontend/routeTree.gen.ts',
                    }),
                    tailwindcss(),
                ],
                test: {
                    name: 'frontend',
                    globals: true,
                    environment: 'jsdom', // Browser-like environment for React components
                    include: ['tests/frontend/**/*.{test,spec}.{ts,tsx}'],
                    exclude: ['node_modules'],
                },
            },
        ],
    },
});