import { Credentials, DocumentType, Result } from '@schematransfer/core';

import { CloudDocumentType } from '../types/CloudDocumentType';
import { RequestManager } from '@schematransfer/requestmanager';

export const GetDocumentTypeInGroup = async (
  credential: Credentials,
  documentGroupId: string,
): Promise<Result<Array<DocumentType>, Error>> => {
  try {
    const filterDocumentTypeByGroupId = (documentTypes: CloudDocumentType[]) => {
      return documentTypes.filter((document) => document.documentGroupId === documentGroupId);
    };

    const rm = new RequestManager({ retries: 2, retryDelay: 1000, timeout: 60000 });
    const headers: Record<string, string> = {};
    headers['Content-Type'] = 'application/json';
    headers['Authorization'] = `Bearer ${credential.token}`;
    headers['x-api-key'] = credential.serverInformation.apiKey;
    headers['api-secret'] = credential.serverInformation.apiSecret;

    const result = await rm
      .build(credential.serverInformation.server, 'GET')
      .addHeaders(headers)
      .executeAsync<{ documentTypes: CloudDocumentType[] }>('api/document-types/all');

    if (!result.ok) {
      return result as Result<Array<DocumentType>, Error>;
    }

    const body = result.value;

    return {
      ok: true,
      value: Array.from(
        new Set(
          filterDocumentTypeByGroupId(body.documentTypes).map((document) => ({
            documentTypeId: document.documentTypeId,
            documentTypeName: document.name,
          })),
        ),
      ),
    };
  } catch (error) {
    return {
      ok: false,
      error: error as Error,
    };
  }
};
