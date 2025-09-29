import { InjectionToken } from '@angular/core';

/**
 * Injection token for providing the base path to API repository endpoints.
 *
 * This token is used to inject the base URL or path prefix that will be used
 * by repository services to construct full API endpoint URLs. This allows for
 * environment-specific configuration of API endpoints.
 *
 * @type {InjectionToken<string>}
 * @example
 * // In app.module.ts or environment files:
 * providers: [
 *   { provide: REPOSITORY_PATH, useValue: environment.apiBaseUrl }
 * ]
 */
export const REPOSITORY_PATH = new InjectionToken<string>('RepositoryPath');
