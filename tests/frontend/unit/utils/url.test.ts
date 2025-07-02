import {describe, it, expect} from 'vitest';

/**
 * Frontend Unit Test Example: Utility Functions
 *
 * Tests pure functions that don't require DOM or React components.
 * These run in jsdom environment for frontend-specific utilities.
 */

// Example utility function to test
function normalizeUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        // Remove trailing slash and convert to lowercase
        return urlObj.href.toLowerCase().replace(/\/$/, '');
    } catch {
        throw new Error('Invalid URL format');
    }
}

function getHostname(url: string): string {
    try {
        return new URL(url).hostname;
    } catch {
        throw new Error('Invalid URL format');
    }
}

describe('URL Utilities', () => {
    describe('normalizeUrl', () => {
        it('should normalize valid HTTPS URLs', () => {
            const input = 'https://EXAMPLE.com/Path/';
            const expected = 'https://example.com/path';

            expect(normalizeUrl(input)).toBe(expected);
        });

        it('should preserve path and query parameters', () => {
            const input = 'https://api.example.com/v1/users?page=1&limit=10';
            const expected = 'https://api.example.com/v1/users?page=1&limit=10';

            expect(normalizeUrl(input)).toBe(expected);
        });

        it('should throw error for invalid URLs', () => {
            const invalidUrls = [
                'not-a-url',
                'invalid-url-format',
                '',
            ];

            invalidUrls.forEach(url => {
                expect(() => normalizeUrl(url)).toThrow('Invalid URL format');
            });
        });
    });

    describe('getHostname', () => {
        it('should extract hostname from URL', () => {
            const testCases = [
                {url: 'https://www.example.com/path', expected: 'www.example.com'},
                {
                    url: 'http://subdomain.api.example.org:8080',
                    expected: 'subdomain.api.example.org'
                },
                {url: 'https://localhost:3000', expected: 'localhost'},
            ];

            testCases.forEach(({url, expected}) => {
                expect(getHostname(url)).toBe(expected);
            });
        });

        it('should handle edge cases', () => {
            expect(() => getHostname('invalid')).toThrow('Invalid URL format');
            expect(() => getHostname('')).toThrow('Invalid URL format');
        });
    });
});