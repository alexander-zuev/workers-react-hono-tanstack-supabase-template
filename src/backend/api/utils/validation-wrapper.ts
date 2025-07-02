import {ZodType} from 'zod/v4';
import type {ValidationTargets} from 'hono';
import {zValidator as zv} from '@hono/zod-validator';

export const zValidator = <T extends ZodType, Target extends keyof ValidationTargets>(
    target: Target,
    schema: T
) =>
    zv(target, schema, (result, c) => {
        if (!result.success) {
            console.error('Input validation failed', {
                operation: 'input-validation',
                target,
                inputType: typeof result.data,
                issues: result.error.issues.map(issue => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                    code: issue.code,
                })),
            });

            const issues = result.error.issues.map(issue => ({
                message: issue.message,
                code: issue.code,
                property: issue.path,
            }));

            return c.json(
                {
                    success: false,
                    error: {
                        issues,
                        name: 'ZodError',
                    },
                },
                400
            );
        }
    });