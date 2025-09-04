// base.service.ts
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional, InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment.development';

export const API_BASE_URL = new InjectionToken<string>('ApiBaseUrl', {
  providedIn: 'root',
  factory: () => environment.backendApi,
});

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService {
  protected readonly baseUrl: string;

  constructor(
    protected http: HttpClient,
    @Optional() @Inject(API_BASE_URL) baseUrl: string = environment.backendApi,
  ) {
    this.baseUrl = this.normalizeUrl(baseUrl);
  }

  protected normalizeUrl(url: string): string {
    return url.endsWith('/') ? url : `${url}/`;
  }

  protected buildUrl(
    resource: string,
    subPath?: string,
    queryParams?: Record<string, any>,
  ): string {
    // Combinar el recurso base (por ejemplo, 'schema') con el subpath (por ejemplo, 'group/123')
    const cleanResource = resource.replace(/^\/+|\/+$/g, '');
    let url = `${this.baseUrl}${cleanResource}`;
    if (subPath) {
      url += `/${subPath.replace(/^\/+|\/+$/g, '')}`;
    }
    if (queryParams) {
      const params = new URLSearchParams(queryParams).toString();
      url += `?${params}`;
    }
    return url;
  }
}
