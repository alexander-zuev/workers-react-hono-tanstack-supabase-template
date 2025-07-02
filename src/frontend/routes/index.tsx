import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

function Home() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      // Test the health endpoint
      const healthResponse = await fetch('/api/v1/health');
      const healthData = await healthResponse.json();
      
      // Test the tasks endpoint
      const tasksResponse = await fetch('/api/v1/tasks');
      const tasksData = await tasksResponse.json();
      
      setResponse({
        health: healthData,
        tasks: tasksData,
      });
    } catch (error) {
      setResponse({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `New task created at ${new Date().toLocaleTimeString()}`,
        }),
      });
      
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Full-stack <span className="text-primary">Cloudflare Workers</span> Template
        </h1>
        <p className="text-xl text-secondary-foreground mb-8">
          Production-ready template with React v19, Hono, TanStack Router, and Supabase
        </p>
        
        {/* Stack badges */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[
            'TypeScript',
            'Cloudflare Workers', 
            'React v19',
            'Hono',
            'TanStack Router',
            'Supabase',
            'Drizzle ORM',
            'Tailwind v4',
            'Vitest'
          ].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full border border-primary/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* API Testing Section */}
      <div className="bg-secondary rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Test the API</h2>
        <p className="text-secondary-foreground mb-6">
          Try out the backend API endpoints to see the full-stack integration in action.
        </p>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={testAPI}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Fetch Data (GET)'}
          </button>
          
          <button
            onClick={createTask}
            disabled={loading}
            className="px-4 py-2 bg-secondary border border-border text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Create Task (POST)'}
          </button>
        </div>

        {/* Response Display */}
        {response && (
          <div className="bg-background rounded border p-4">
            <h3 className="font-semibold mb-2">API Response:</h3>
            <pre className="text-sm overflow-auto bg-primary/5 p-3 rounded border">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-secondary rounded-lg border">
          <div className="text-2xl mb-3">⚡</div>
          <h3 className="font-semibold mb-2">Edge Computing</h3>
          <p className="text-sm text-secondary-foreground">
            Deploy globally with Cloudflare Workers for sub-100ms response times worldwide.
          </p>
        </div>

        <div className="p-6 bg-secondary rounded-lg border">
          <div className="text-2xl mb-3">🔧</div>
          <h3 className="font-semibold mb-2">Type Safety</h3>
          <p className="text-sm text-secondary-foreground">
            End-to-end TypeScript with shared types between frontend and backend.
          </p>
        </div>

        <div className="p-6 bg-secondary rounded-lg border">
          <div className="text-2xl mb-3">🚀</div>
          <h3 className="font-semibold mb-2">Modern Stack</h3>
          <p className="text-sm text-secondary-foreground">
            Latest React 19 with compiler, Hono for lightweight APIs, and Supabase for data.
          </p>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: Home,
});