import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { schemaRepositoryProvider } from './providers';
import { catchError, throwError } from 'rxjs';

const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);
      return throwError(() => new Error('Error en la solicitud'));
    }),
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    schemaRepositoryProvider,
  ],
};
