import { IRequest, ValidationError } from 'packages/Core/src';

export class BaseService {
  buildRequest = <TBody>(request: any): IRequest<TBody> => {
    return {
      build: () => request,
    };
  };

  checkValidation = <TRequest, TResponse>(errors: ValidationError<TRequest>[]): string => {
    if (errors.length === 0) {
      return '';
    }
    let errorMessageFormatter = '';
    errors.forEach((error) => {
      errorMessageFormatter += `Error on ${error.field as unknown} details ${error.message} `;
    });
    return errorMessageFormatter;
  };
}
