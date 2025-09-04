// http-repository.service.ts
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repository } from '../../types/contracts/repository.interface';
import { API_BASE_URL, BaseService } from './BaseService';
// import { BaseService } from './base.service';
// import { Repository } from './repository.interface';

export const REPOSITORY_PATH = new InjectionToken<string>('RepositoryPath');

@Injectable()
export class HttpRepository<T> extends BaseService implements Repository<T> {
  private readonly resource: string;

  constructor(
    http: HttpClient,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string,
    @Optional() @Inject(REPOSITORY_PATH) resource?: string,
  ) {
    super(http, baseUrl);
    this.resource = resource.replace(/^\/+|\/+$/g, ''); // Normalizar el recurso
  }

  post<R>(subPath: string, body: any, queryParams?: Record<string, any>): Observable<R> {
    const url = this.buildUrl(this.resource, subPath, queryParams);
    return this.http.post<R>(url, body);
  }
}
