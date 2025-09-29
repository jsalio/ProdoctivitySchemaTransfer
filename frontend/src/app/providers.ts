/**
 * @file providers.ts
 * @description This file contains provider configurations for dependency injection in the Angular application.
 * It defines factory providers for different repository services used throughout the application.
 */

import { Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './services/backend/BaseService';
import { HttpRepository } from './services/backend/http-repository.service';
import { SCHEMA_REPOSITORY } from './types/tokens/SCHEMA_REPOSITORY';
import { AUTH_REPOSITORY } from './types/tokens/AUTH_REPOSITORY';

/**
 * Factory provider for creating a repository instance for schema-related operations.
 * This provider creates an instance of HttpRepository configured for the 'schema' endpoint.
 *
 * @type {Provider}
 * @property {symbol} provide - The injection token for the schema repository.
 * @property {Function} useFactory - Factory function that creates the repository instance.
 * @property {Array} deps - Dependencies required by the factory function.
 */
export const schemaRepositoryProvider: Provider = {
  provide: SCHEMA_REPOSITORY,
  useFactory: (http: HttpClient, baseUrl: string) =>
    new HttpRepository<object>(http, baseUrl, 'schema'),
  deps: [HttpClient, API_BASE_URL],
};

/**
 * Factory provider for creating a repository instance for authentication operations.
 * This provider creates an instance of HttpRepository configured for the 'auth' endpoint.
 *
 * @type {Provider}
 * @property {symbol} provide - The injection token for the auth repository.
 * @property {Function} useFactory - Factory function that creates the repository instance.
 * @property {Array} deps - Dependencies required by the factory function.
 */
export const authRepositoryProvider: Provider = {
  provide: AUTH_REPOSITORY,
  useFactory: (http: HttpClient, baseUrl: string) =>
    new HttpRepository<object>(http, baseUrl, 'auth'),
  deps: [HttpClient, API_BASE_URL],
};
