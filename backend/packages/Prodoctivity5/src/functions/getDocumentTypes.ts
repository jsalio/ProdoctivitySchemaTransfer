import { Credentials, DocumentType, Result } from '@schematransfer/core';
import { FluencyDocumentType } from '../types/FluencyDocumentType';
import { RequestManager } from '@schematransfer/requestmanager';

/**
 * Fetches document types from the API and returns those matching the specified business line ID as a Set of DocumentType objects.
 * @param credential - The credentials for API authentication.
 * @param id - The business line ID to filter document types.
 * @returns A Promise resolving to a Set of DocumentType objects.
 * @throws Error if the API request fails or the response is invalid.
 */
export const getDocumentTypes = async (
  credential: Credentials,
  id: string,
): Promise<Result<Array<DocumentType>, Error>> => {
  const manager = new RequestManager({ retries: 3, retryDelay: 1000, timeout: 600000 });

  const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;
  const headers: Record<string, string> = {};
  headers['Authorization'] = `Basic ${btoa(basicAuthText)}`;
  headers['x-api-key'] = credential.serverInformation.apiKey;
  manager.addHeaders(headers);

  const result = await manager
    .build(credential.serverInformation.server, 'GET')
    .addHeaders(headers)
    .executeAsync<FluencyDocumentType[]>('site/api/v2/document-types');

  if (!result.ok) {
    return result as Result<Array<DocumentType>, Error>;
  }

  const body = result.value;
  if (!Array.isArray(body)) {
    return {
      ok: false,
      error: new Error('Expected an array of FluencyDocumentType objects in the response'),
    };
  }

  const isValidResponse = body.every(
    (item): item is FluencyDocumentType =>
      item != null &&
      typeof item === 'object' &&
      typeof item.id === 'number' &&
      typeof item.name === 'string' &&
      item.businessLine != null &&
      typeof item.businessLine === 'object' &&
      typeof item.businessLine.id === 'number' &&
      typeof item.businessLine.name === 'string',
  );

  if (!isValidResponse) {
    return {
      ok: false,
      error: new Error('Invalid FluencyDocumentType data in response'),
    };
  }

  const documentTypes = body
    .filter((x: FluencyDocumentType) => x.businessLine.id.toString() === id)
    .map(
      (x: FluencyDocumentType): DocumentType => ({
        documentTypeId: x.id.toString(),
        documentTypeName: x.name,
      }),
    );

  return {
    ok: true,
    value: documentTypes,
  };
};
