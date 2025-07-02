import postgres from 'postgres';
import {drizzle} from 'drizzle-orm/postgres-js';
import * as schema from './schema';

export interface DatabaseConfig {
    db: ReturnType<typeof drizzle>;
    close: () => Promise<void>;
}

/**
 * Creates a database connection with proper Supabase RLS configuration
 *
 * CRITICAL: search_path must include 'public' for schema recognition
 * This is essential for Hyperdrive + Supabase integration
 */
export async function createDbConnection(
    connectionString: string,
    jwtPayload?: { sub: string; role: string }
): Promise<DatabaseConfig> {
    let connection: ReturnType<typeof postgres> | undefined;

    try {
        // Create postgres connection with connection pooling
        connection = postgres(connectionString, {
            max: 5, // Connection pool size
            prepare: false, // Required for some Supabase configurations
        });

        // Create Drizzle instance with schema
        const db = drizzle(connection, {
            schema,
            casing: 'snake_case' // Match Supabase naming convention
        });

        // Configure for authenticated requests
        if (jwtPayload) {
            await connection.begin(async (sql) => {
                // Set JWT claims for RLS
                await sql`SELECT set_config('request.jwt.claims', ${JSON.stringify(jwtPayload)}, TRUE)`;
                await sql`SELECT set_config('request.jwt.claim.sub', ${jwtPayload.sub}, TRUE)`;

                // Set role (authenticated, anon, service_role)
                await sql`SET LOCAL ROLE ${sql.unsafe(jwtPayload.role)}`;

                // CRITICAL: Set search path to include public schema
                // Without this, Hyperdrive won't find your tables
                await sql`SET search_path TO public, extensions`;
            });
        } else {
            // For unauthenticated requests, still set search path
            await connection`SET search_path TO public, extensions`;
        }

        console.log('Database connection established');

        return {
            db,
            close: () => connection!.end(),
        };
    } catch (error) {
        // Cleanup on error
        await connection?.end();
        console.error('Failed to establish database connection:', error);
        throw new Error('Database connection failed');
    }
}

/**
 * Utility to create admin connection (service_role)
 */
export async function createAdminDbConnection(
    connectionString: string
): Promise<DatabaseConfig> {
    return createDbConnection(connectionString, {
        sub: 'service',
        role: 'service_role'
    });
}

/**
 * Utility to create user connection with RLS
 */
export async function createUserDbConnection(
    connectionString: string,
    userId: string
): Promise<DatabaseConfig> {
    return createDbConnection(connectionString, {
        sub: userId,
        role: 'authenticated'
    });
}