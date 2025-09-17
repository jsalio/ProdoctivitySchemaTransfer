import { Credentials } from 'packages/Core/src';
import { RequestManager } from 'packages/RequestManager';

export const createRequestManagerWithHeaders = (
  credential: Credentials,
  options?: {
    retries: 3;
    retryDelay: 1000;
    timeout: 600000;
  },
): RequestManager => {
  const manager = new RequestManager(options);

  const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;

  const headers: Record<string, string> = {};
  headers['Content-Type'] = 'application/json';
  headers['Authorization'] = `Basic ${btoa(basicAuthText)}`;
  headers['x-api-key'] = credential.serverInformation.apiKey;
  manager.addHeaders(headers);

  manager.addHeaders(headers);

  return manager;
};
