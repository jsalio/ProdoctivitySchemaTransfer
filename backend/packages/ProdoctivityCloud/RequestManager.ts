import { HttpMethod, IRequestManager, Result } from '@schematransfer/core';

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class RequestManager implements IRequestManager {
  private urlBase: string = '';
  private method: HttpMethod = 'GET';
  private headers = new Headers();
  private requestOptions: RequestInit = {};
  private config: RequestConfig = {
    timeout: 30000,
    retries: 0,
    retryDelay: 1000,
  };

  constructor(config?: RequestConfig) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  build = (urlBase: string, method: HttpMethod = 'GET') => {
    if (!urlBase || typeof urlBase !== 'string') {
      throw new Error('URL base debe ser una cadena válida');
    }
    this.urlBase = urlBase.replace(/\/$/, '');
    this.method = method;

    this.requestOptions = {
      method,
      redirect: 'follow',
      signal: AbortSignal.timeout(this.config.timeout!),
    };

    // Configurar headers por defecto según el método
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      this.headers.set('Content-Type', 'application/json');
    }

    return this;
  };

  addHeader = (key: string, value: string): this => {
    if (!key || !value) {
      throw new Error('Key y value son requeridos para agregar un header');
    }
    this.headers.set(key, value); // Usar set en lugar de append para evitar duplicados
    return this;
  };

  addHeaders = (headers: Record<string, string>): this => {
    Object.entries(headers).forEach(([key, value]) => {
      this.addHeader(key, value);
    });
    return this;
  };

  addBody = <TBody>(body: TBody): this => {
    if (!this.requestOptions) {
      throw new Error('Debe llamar build() antes de agregar el body');
    }

    // Verificar que el método soporte body
    if (!['POST', 'PUT', 'PATCH'].includes(this.method)) {
      throw new Error(`El método ${this.method} no soporta body`);
    }

    // Manejar diferentes tipos de body
    if (body instanceof FormData) {
      this.requestOptions.body = body;
      this.headers.delete('Content-Type'); // Dejar que el navegador establezca el boundary
    } else if (typeof body === 'string') {
      this.requestOptions.body = body;
    } else {
      this.requestOptions.body = JSON.stringify(body);
    }

    return this;
  };

  private async executeWithRetry<TResponse>(
    url: string,
    options: RequestInit,
    attempt: number = 0,
  ): Promise<Response> {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (attempt < this.config.retries!) {
        await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay!));
        return this.executeWithRetry(url, options, attempt + 1);
      }
      throw error;
    }
  }

  executeAsync = async <TResponse>(resource: string): Promise<Result<TResponse, Error>> => {
    try {
      // Validaciones
      if (!this.urlBase) {
        return {
          ok: false,
          error: new Error('URL base no configurada. Llame build() primero'),
        };
      }

      if (!resource || typeof resource !== 'string') {
        return {
          ok: false,
          error: new Error('Resource debe ser una cadena válida'),
        };
      }

      // Limpiar resource (remover slash inicial si existe)
      const cleanResource = resource.replace(/^\//, '');
      const url = `${this.urlBase}/${cleanResource}`;

      // Configurar headers finales
      this.requestOptions.headers = this.headers;

      // Ejecutar petición con reintentos
      const response = await this.executeWithRetry<TResponse>(url, this.requestOptions);

      // Manejo mejorado de errores HTTP
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          // Intentar obtener más detalles del error del servidor
          const errorBody = await response.text();
          if (errorBody) {
            errorMessage += ` - ${errorBody}`;
          }
        } catch (e) {
          // Ignorar errores al leer el body de error
        }

        return {
          ok: false,
          error: new Error(errorMessage),
        };
      }

      // Verificar si la respuesta tiene contenido
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0') {
        return {
          ok: true,
          value: null as unknown as TResponse,
        };
      }

      // Intentar parsear JSON
      let responseBody: TResponse;
      try {
        responseBody = await response.json();
      } catch (error) {
        return {
          ok: false,
          error: new Error('Respuesta del servidor no es JSON válido'),
        };
      }

      return {
        ok: true,
        value: responseBody,
      };
    } catch (error) {
      // Manejo de errores de red, timeout, etc.
      let errorMessage = 'Error desconocido';

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = `Timeout después de ${this.config.timeout}ms`;
        } else {
          errorMessage = error.message;
        }
      }

      return {
        ok: false,
        error: new Error(errorMessage),
      };
    }
  };

  // Métodos de conveniencia para diferentes tipos de petición
  get = <TResponse>(resource: string): Promise<Result<TResponse, Error>> => {
    this.build(this.urlBase, 'GET');
    return this.executeAsync<TResponse>(resource);
  };

  post = <TBody, TResponse>(resource: string, body?: TBody): Promise<Result<TResponse, Error>> => {
    this.build(this.urlBase, 'POST');
    if (body !== undefined) {
      this.addBody(body);
    }
    return this.executeAsync<TResponse>(resource);
  };

  put = <TBody, TResponse>(resource: string, body?: TBody): Promise<Result<TResponse, Error>> => {
    this.build(this.urlBase, 'PUT');
    if (body !== undefined) {
      this.addBody(body);
    }
    return this.executeAsync<TResponse>(resource);
  };

  delete = <TResponse>(resource: string): Promise<Result<TResponse, Error>> => {
    this.build(this.urlBase, 'DELETE');
    return this.executeAsync<TResponse>(resource);
  };

  reset = (): this => {
    this.urlBase = '';
    this.method = 'GET';
    this.headers = new Headers();
    this.requestOptions = {};
    return this;
  };

  //   build = (urlBase: string, method: HttpMethod = 'GET') => {
  //     this.urlBase = urlBase;
  //     this.method = method;
  //     this.requestOptions = {
  //       method: 'POST',
  //       redirect: 'follow',
  //     };
  //   };

  //   addHeader = (key: string, value: string) => {
  //     this.headers.append(key, value);
  //   };

  //   addBody = <TBody>(body: TBody) => {
  //     if (!this.requestOptions) {
  //       return;
  //     }
  //     this.requestOptions.body = JSON.stringify(body);
  //   };

  //   executeAsync = async <TResponse>(resource: string): Promise<Result<TResponse, Error>> => {
  //     if (!this.requestOptions) {
  //       return {
  //         ok: false,
  //         error: new Error('Options is undefined'),
  //       };
  //     }
  //     this.requestOptions.headers = this.headers;
  //     const response = await fetch(`${this.urlBase}/${resource}`, this.requestOptions);
  //     if (response.status < 200 || response.status >= 300) {
  //       return {
  //         ok: false,
  //         error: new Error('Invalid request from server'),
  //       };
  //     }

  //     const responseBody: TResponse = await response.json();

  //     return {
  //       ok: true,
  //       value: responseBody,
  //     };
  //   };
}
