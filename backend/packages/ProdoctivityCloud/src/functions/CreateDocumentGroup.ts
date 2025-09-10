import { Credentials, DocumentGroup, Result } from '@schematransfer/core';
import { RequestManager } from 'packages/ProdoctivityCloud/RequestManager';

interface createDocumentGroupRequest {
  name: string;
  description: string;
  isContentLibrary: boolean;
}

interface createDocumentGroupResponse {
  documentGroupId: string;
}

export const createDocumentGroup = async (
  credential: Credentials,
  name: string,
): Promise<Result<DocumentGroup, Error>> => {
  const rm = new RequestManager({
    retries: 2,
    retryDelay: 1000,
    timeout: 60000,
  });
  const requestBody: createDocumentGroupRequest = {
    description: name,
    name: name,
    isContentLibrary: false,
  };

  const headers: Record<string, string> = {};

  headers['Content-Type'] = 'application/json';
  headers['Authorization'] = `Bearer ${credential.token}`;
  headers['x-api-key'] = credential.serverInformation.apiKey;
  headers['-api-secret'] = credential.serverInformation.apiSecret;

  var result = await rm
    .build(credential.serverInformation.server, 'POST')
    .addHeaders(headers)
    .addBody(requestBody)
    .executeAsync<createDocumentGroupResponse>('svc/api/ecm/document-groups');

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    value: {
      groupName: name,
      groupId: result.value.documentGroupId,
      documentTypesCounter: 0,
    },
  };

  // const headers = new Headers();
  // headers.append('Content-Type', 'application/json');
  // headers.append('Authorization', `Bearer ${credential.token}`);
  // headers.append('x-api-key', credential.serverInformation.apiKey);
  // headers.append('api-secret', credential.serverInformation.apiSecret);

  // const requestBody: createDocumentGroupRequest = {
  //   description: name,
  //   name: name,
  //   isContentLibrary: false,
  // };

  // const requestOptions: RequestInit = {
  //   method: 'POST',
  //   headers: headers,
  //   redirect: 'follow',
  //   body: JSON.stringify(requestBody),
  // };

  // const response = await fetch(
  //   `${credential.serverInformation.server}/api/svc/ecm/document-groups`,
  //   requestOptions,
  // );

  // if (response.status < 200 && response.status > 299) {
  //   return {
  //     ok: false,
  //     error: new Error(`Invalid response from server code :[${response.status}]`),
  //   };
  // }

  // const body: createDocumentGroupResponse = await response.json();

  // return {
  //   ok: true,
  //   value: {
  //     groupName: name,
  //     groupId: body.documentGroupId,
  //     documentTypesCounter: 0,
  //   },
  // };
};
