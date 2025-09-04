// providers.ts
import { InjectionToken, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './services/backend/BaseService';
import { HttpRepository } from './services/backend/http-repository.service';
import { Repository } from './types/contracts/repository.interface';
export const SCHEMA_REPOSITORY = new InjectionToken<Repository<any>>('SchemaRepository');

export const schemaRepositoryProvider: Provider = {
  provide: SCHEMA_REPOSITORY,
  useFactory: (http: HttpClient, baseUrl: string) =>
    new HttpRepository<any>(http, baseUrl, 'schema'),
  deps: [HttpClient, API_BASE_URL],
};
