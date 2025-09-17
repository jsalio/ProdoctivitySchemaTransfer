import { Credentials, Result } from '@schematransfer/core';
import { RequestManager } from '@schematransfer/requestmanager';

/**
 *
 * @param credential
 * @returns
 */
export const LoginToProdoctivity = async (
  credential: Credentials,
): Promise<Result<string, Error>> => {
  const manager = new RequestManager({ retries: 3, retryDelay: 1000, timeout: 600000 });

  const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;
  const headers: Record<string, string> = {};
  headers['Authorization'] = `Basic ${btoa(basicAuthText)}`;
  headers['x-api-key'] = credential.serverInformation.apiKey;
  manager.addHeaders(headers);

  const result = await manager
    .build(credential.serverInformation.server, 'POST')
    .addHeaders(headers)
    .executeAsync<any>('site/api/v1/auth/session');

  if (!result.ok) {
    return result as Result<string, Error>;
  }

  return {
    ok: true,
    value: 'ok',
  };
};
