import { InjectionToken } from '@angular/core';
import { Repository } from '../contracts/repository.interface';

/**
 * Injection token for providing the Authentication Repository service.
 *
 * This token is used to inject an implementation of the Repository interface
 * that handles authentication-related operations such as login, logout, and
 * user session management throughout the application.
 *
 * @type {InjectionToken<Repository<object>>}
 * @example
 * // In a module or component:
 * providers: [
 *   { provide: AUTH_REPOSITORY, useClass: AuthRepositoryService }
 * ]
 */
export const AUTH_REPOSITORY = new InjectionToken<Repository<object>>('AuthRepository');
