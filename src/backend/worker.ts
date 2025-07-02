import {app} from '@/backend/api/app';

const worker = {
    // Handle HTTP requests (main application)
    fetch: app.fetch,

    // Handle scheduled cron triggers
    async scheduled(controller: ScheduledController, _env: Env, _ctx: ExecutionContext) {
        console.log(`Cron trigger fired: ${controller.cron}`);

        try {
            switch (controller.cron) {
                case '0 * * * *': // Every hour
                    console.log('Running hourly scheduled task');
                    // Add your scheduled logic here
                    // Example: database cleanup, sending notifications, etc.
                    break;

                case '0 0 * * *': // Daily at midnight
                    console.log('Running daily scheduled task');
                    // Add your daily logic here
                    break;

                default:
                    console.warn(`Unknown cron pattern: ${controller.cron}`);
            }
        } catch (error) {
            console.error('Scheduled task failed:', error);
            // Don't throw to prevent cron job failures
        }
    },
};

export default worker;