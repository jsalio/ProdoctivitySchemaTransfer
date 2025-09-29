// repository.interface.ts
import { Observable } from 'rxjs';
// eslint-disable-next-line
export interface Repository<T> {
  // eslint-disable-next-line
  post<R>(subPath: string, body: any, queryParams?: Record<string, any>): Observable<R>;
}
