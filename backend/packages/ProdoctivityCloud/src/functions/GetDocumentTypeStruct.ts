import { Credentials, Result, SchemaDocumentType } from '@schematransfer/core';
import { CloudDocumentTypeSchema } from '../types/CloudDocumentTypeSchema';
import { RequestManager } from 'packages/ProdoctivityCloud/RequestManager';

export const GetDocumentTypeStruct = async (
  credential: Credentials,
  documentTYpeId: string,
): Promise<Result<SchemaDocumentType, Error>> => {
  try {
    const rm = new RequestManager({ retries: 2, retryDelay: 1000, timeout: 60000 });
    const headers: Record<string, string> = {};
    headers['Content-Type'] = 'application/json';
    headers['Authorization'] = `Bearer ${credential.token}`;
    headers['x-api-key'] = credential.serverInformation.apiKey;
    headers['api-secret'] = credential.serverInformation.apiSecret;

    const result = await rm
      .build(credential.serverInformation.server, 'GET')
      .addHeaders(headers)
      .executeAsync<CloudDocumentTypeSchema>(
        `api/document-types/${documentTYpeId}?withFormLayout=false`,
      );

    if (!result.ok) {
      return result as Result<SchemaDocumentType, Error>;
    }

    const body = result.value;
    return {
      ok: true,
      value: {
        name: body.documentType.name,
        documentTypeId: body.documentType.documentTypeId,
        keywords: body.documentType.contextDefinition.fields.map((key) => ({
          name: key.name,
          label: key.humanName,
          dataType: key.properties.dataType,
          require: key.properties.minOccurs >= 1,
        })),
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error as Error,
    };
  }
};
