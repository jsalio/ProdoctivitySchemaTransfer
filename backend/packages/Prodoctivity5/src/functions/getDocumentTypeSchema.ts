///api/business-functions
import { Credentials, Result, SchemaDocumentType } from '@schematransfer/core';
import { FluencyDocumentTypeSchema } from '../types/FluencyDocumentTypeSchema';
import { RequestManager } from '@schematransfer/requestmanager';

/**
 *
 * @param credential
 * @returns
 */
export const getDocumentTypeSchema = async (
  credential: Credentials,
  documentTypeId: string,
): Promise<Result<SchemaDocumentType, Error>> => {
  const manager = new RequestManager({ retries: 3, retryDelay: 1000, timeout: 600000 });

  const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;
  const headers: Record<string, string> = {};
  headers['Authorization'] = `Basic ${btoa(basicAuthText)}`;
  headers['x-api-key'] = credential.serverInformation.apiKey;
  manager.addHeaders(headers);

  const result = await manager
    .build(credential.serverInformation.server, 'GET')
    .addHeaders(headers)
    .executeAsync<FluencyDocumentTypeSchema[]>('site/api/v2/document-types');

  if (!result.ok) {
    return result as Result<SchemaDocumentType, Error>;
  }

  const body: FluencyDocumentTypeSchema[] = result.value;
  if (Array.isArray(body)) {
    const targetDocumentType = body.filter((x) => x.id.toString() === documentTypeId)[0];
    if (!targetDocumentType) {
      return {
        ok: false,
        error: new Error('Document type not found'),
      };
    }

    const documentSchema: SchemaDocumentType = {
      name: targetDocumentType.name,
      documentTypeId: targetDocumentType.id.toString(),
      keywords: targetDocumentType.keywords.map((key) => ({
        name: key.name,
        label: key.humanName,
        dataType: key.definition.properties.dataType,
        require: false,
      })),
    };

    return {
      ok: true,
      value: documentSchema,
    };
  }
  return {
    ok: false,
    error: new Error('Invalid body response'),
  };
};
