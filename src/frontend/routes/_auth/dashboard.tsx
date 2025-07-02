import { createFileRoute, Outlet } from '@tanstack/react-router';

// Mock dashboard layout - in a real app this would use:
// import { SidebarInset, SidebarProvider } from '@/components/ui';
// import { AppSidebar } from '@/features/dashboard/components';
// import { DashboardLayout } from '@/components/layouts';

function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Mock sidebar */}
        <aside className="w-64 border-r border-border bg-secondary">
          <div className="p-4">
            <h2 className="font-semibold text-foreground">Dashboard</h2>
            <nav className="mt-4 space-y-2">
              <div className="p-2 text-sm text-secondary-foreground hover:bg-background rounded">
                📊 Overview
              </div>
              <div className="p-2 text-sm text-secondary-foreground hover:bg-background rounded">
                📝 Tasks
              </div>
              <div className="p-2 text-sm text-secondary-foreground hover:bg-background rounded">
                ⚙️ Settings
              </div>
            </nav>
          </div>
        </aside>
        
        {/* Main content area */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold mb-4">Protected Dashboard</h1>
            <div className="bg-secondary p-4 rounded-lg mb-6">
              <p className="text-secondary-foreground">
                🔒 This route is protected by authentication. In a real app, this would show user-specific content.
              </p>
            </div>
            
            {/* Nested route content */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/_auth/dashboard')({
  component: Dashboard,
});