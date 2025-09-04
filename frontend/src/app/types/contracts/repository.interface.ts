// repository.interface.ts
import { Observable } from 'rxjs';

export interface Repository<T> {
  post<R>(subPath: string, body: any, queryParams?: Record<string, any>): Observable<R>;
}
