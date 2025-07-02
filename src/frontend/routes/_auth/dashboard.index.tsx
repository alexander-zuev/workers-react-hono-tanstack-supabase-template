import { createFileRoute } from '@tanstack/react-router';

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
        <p className="text-secondary-foreground">
          Welcome to your dashboard. Build your application features here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-secondary p-6 rounded-lg">
          <h3 className="font-medium mb-2">Feature 1</h3>
          <p className="text-sm text-secondary-foreground">
            Add your first feature here. This could be a data table, chart, or any UI component.
          </p>
        </div>

        <div className="bg-secondary p-6 rounded-lg">
          <h3 className="font-medium mb-2">Feature 2</h3>
          <p className="text-sm text-secondary-foreground">
            Add your second feature here. Connect to your Supabase database and build powerful features.
          </p>
        </div>

        <div className="bg-secondary p-6 rounded-lg">
          <h3 className="font-medium mb-2">Feature 3</h3>
          <p className="text-sm text-secondary-foreground">
            Add your third feature here. Use TanStack Query for efficient API state management.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          🚀 Getting Started
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Create features in <code>src/frontend/features/</code></li>
          <li>• Add API routes in <code>src/backend/api/</code></li>
          <li>• Define schemas in <code>src/shared/api-schemas/</code></li>
          <li>• Use Drizzle ORM for database operations</li>
          <li>• Test with the dual-environment setup</li>
        </ul>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/_auth/dashboard/')({
  component: DashboardPage,
});