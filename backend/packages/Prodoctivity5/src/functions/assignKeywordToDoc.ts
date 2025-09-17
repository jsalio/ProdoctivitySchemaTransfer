import { Credentials, Result } from 'packages/Core/src';
import { AssignResponse } from '../types/AssignResponse';
import { createRequestManagerWithHeaders } from './createRequestManagerWithHeaders';

export const assignKeywordToDoc = async (
  credential: Credentials,
  assignDataElementToDocumentTypeRequest: {
    documentTypeId: string;
    dataElement: {
      name: string;
      order: number;
    };
  },
): Promise<Result<boolean, Error>> => {
  const manager = createRequestManagerWithHeaders(credential);

  var result = await manager
    .build(credential.serverInformation.server, 'POST')
    .addBody({
      keyName: assignDataElementToDocumentTypeRequest.dataElement.name.trim(),
      order: assignDataElementToDocumentTypeRequest.dataElement.order + 1,
    })
    .executeAsync<AssignResponse>(
      `Site/api/v0.1/dictionary/data-elements/assign-old-schema/${assignDataElementToDocumentTypeRequest.documentTypeId}`,
    );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    value: result.value.result === 1 || result.value.result === 0,
  };
};
