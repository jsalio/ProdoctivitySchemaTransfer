// eslint-disable
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repository } from '../../types/contracts/repository.interface';
import { API_BASE_URL, BaseService } from './BaseService';
import { REPOSITORY_PATH } from '../../types/tokens/REPOSITORY_PATH';

@Injectable()
export class HttpRepository<T> extends BaseService implements Repository<T> {
  private readonly resource: string;

  constructor(
    // eslint-disable-next-line
    http: HttpClient,
    // eslint-disable-next-line
    @Optional() @Inject(API_BASE_URL) baseUrl?: string,
    // eslint-disable-next-line
    @Optional() @Inject(REPOSITORY_PATH) resource?: string,
  ) {
    super(http, baseUrl);
    this.resource = resource.replace(/^\/+|\/+$/g, ''); // Normalizar el recurso
  }
  // eslint-disable-next-line
  post<R>(subPath: string, body: any, queryParams?: Record<string, string>): Observable<R> {
    const url = this.buildUrl(this.resource, subPath, queryParams);
    return this.http.post<R>(url, body);
  }
}
