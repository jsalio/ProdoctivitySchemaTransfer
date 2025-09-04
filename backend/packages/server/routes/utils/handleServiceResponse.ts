import { AppCodeError, CoreResult } from 'packages/Core/src';
import { ElysiaContext } from '../types/ElysiaContext';
import { ServiceResponse } from '../types/ServiceResponse';
import { HTTP_STATUS } from './HTTP_STATUS';

export const handleServiceResponse = <T>(
  result: CoreResult<T, AppCodeError, Error>,
  set: ElysiaContext['set'],
): ServiceResponse<T> => {
  if (!result.ok) {
    const statusCode = result.code === AppCodeError.UnmanagedError ? HTTP_STATUS.FORBIDDEN : 400;
    set.status = statusCode;
    return {
      success: false,
      data: undefined,
      error: result.error.message,
    };
  }
  return {
    success: true,
    data: result.value,
    error: undefined,
  };
};
