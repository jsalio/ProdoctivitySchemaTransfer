import { Result } from './Result';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IRequestManager {
  build: (urlBase: string, method: HttpMethod) => void;
  addHeader: (key: string, value: string) => void;
  addHeaders: (headers: Record<string, string>) => void;
  addBody: <TBody>(body: TBody) => void;
  executeAsync: <TResponse>(resource: string) => Promise<Result<TResponse, Error>>;
  reset: () => void;
}
