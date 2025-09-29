import { Credentials, DocumentGroup, Result } from '@schematransfer/core';
import { FluencyDocumentGroup } from '../types/FluencyDocumentGroup';
import { RequestManager } from '@schematransfer/requestmanager';

/**
 * Fetches business functions from the API and returns them as a Set of DocumentGroup objects.
 * @param credential - The credentials for API authentication.
 * @returns A Promise resolving to a Set of DocumentGroup objects.
 * @throws Error if the API request fails or the response is invalid.
 */
export const getBusinessFunctions = async (
  credential: Credentials,
): Promise<Result<Array<DocumentGroup>, Error>> => {
  const manager = new RequestManager({ retries: 3, retryDelay: 1000, timeout: 600000 });

  const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;
  const headers: Record<string, string> = {};
  headers['Authorization'] = `Basic ${btoa(basicAuthText)}`;
  headers['x-api-key'] = credential.serverInformation.apiKey;
  manager.addHeaders(headers);

  const result = await manager
    .build(credential.serverInformation.server, 'GET')
    .addHeaders(headers)
    .executeAsync<FluencyDocumentGroup[]>('site/api/v0.1/business-functions');

  if (!result.ok) {
    return result as Result<Array<DocumentGroup>, Error>;
  }

  const body = result.value;
  if (!Array.isArray(body)) {
    return {
      ok: false,
      error: new Error('Expected an array of FluencyDocumentGroup objects in the response'),
    };
  }

  const isValidResponse = body.every(
    (item): item is FluencyDocumentGroup =>
      item != null && typeof item === 'object' && typeof item.id === 'number' && typeof item.description === 'string',
  );

  if (!isValidResponse) {
    return {
      ok: false,
      error: new Error('Invalid FluencyDocumentGroup data in response'),
    };
  }

  const documentGroups = body.map(
    (x: FluencyDocumentGroup): DocumentGroup => ({
      groupName: x.description,
      groupId: x.id.toString(),
      documentTypesCounter: 0,
    }),
  );

  return {
    ok: true,
    value: documentGroups,
  };
};
