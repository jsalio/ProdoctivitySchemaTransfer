import { InjectionToken } from '@angular/core';
import { Repository } from '../contracts/repository.interface';

/**
 * Injection token for providing the Schema Repository service.
 *
 * This token is used to inject an implementation of the Repository interface
 * that handles schema-related operations throughout the application.
 *
 * @type {InjectionToken<Repository<object>>}
 * @example
 * // In a module or component:
 * providers: [
 *   { provide: SCHEMA_REPOSITORY, useClass: SchemaRepositoryService }
 * ]
 */
export const SCHEMA_REPOSITORY = new InjectionToken<Repository<object>>('SchemaRepository');
