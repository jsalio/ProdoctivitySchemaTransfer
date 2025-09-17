import { Result } from '@schematransfer/core';

export const FromPromise = async <T>(promise: Promise<T>): Promise<Result<T, Error>> => {
  try {
    const value = await promise;
    return {
      ok: true,
      value,
    };
  } catch (error) {
    return {
      ok: false,
      error: error as Error,
    };
  }
};
