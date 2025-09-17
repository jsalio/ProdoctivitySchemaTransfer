import { CoreResult, Credentials, Result } from '@schematransfer/core';
import { RequestManager } from '@schematransfer/requestmanager';

/**
 *
 * @param credential
 * @returns
 */
export const LoginToProdoctivity = async (
  credential: Credentials,
): Promise<Result<string, Error>> => {
  try {
    const request = {
      username: credential.username,
      password: credential.password,
      organizationId: credential.serverInformation.organization,
    };
    const rm = new RequestManager({ retries: 2, retryDelay: 1000, timeout: 60000 });
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    const result = await rm
      .build(credential.serverInformation.server, 'POST')
      .addHeaders(headers)
      .addBody(request)
      .executeAsync<{ token?: string }>('api/login');

    if (!result.ok) {
      return result as Result<string, Error>;
    }

    const body = result.value;
    if (body.token) {
      return {
        ok: true,
        value: body.token,
      };
    }

    return {
      ok: false,
      error: new Error('No token received in response'),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Error de llamada.'),
    };
  }
};
