import { Credentials, DocumentGroup, Result } from '@schematransfer/core';
// import { generateShortGuid } from "./utils/random-guid";
import { DocumentGroupOptions } from '../types/DocumentGroupOptions';
import { FluencyDocumentGroupResponse } from '../types/FluencyDocumentGroupResponse';
import { RequestManager } from '@schematransfer/requestmanager';

const DEFAULT_OPTIONS: Required<DocumentGroupOptions> = {
  defaultWorkflowConfigurationId: 1,
  status: 'Active',
  comments: 'Created by Schema Transfer App',
  type: '',
};

/**
 * Creates a new document group in the Prodoctivity system
 * @param credential - Authentication credentials for the Prodoctivity API
 * @param name - Name of the document group to create
 * @param options - Optional configuration for the document group
 * @returns A Result containing the created DocumentGroup or an Error
 */
export const createDocumentGroup = async (
  credential: Credentials,
  name: string,
  options: DocumentGroupOptions = {},
): Promise<Result<DocumentGroup, Error>> => {
  // console.log('request:', JSON.stringify({credential, name, options}, null, 2))
  if (!name?.trim()) {
    return {
      ok: false,
      error: new Error('Document group name cannot be empty'),
    };
  }

  const manager = new RequestManager({ retries: 3, retryDelay: 1000, timeout: 600000 });

  const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;
  const headers: Record<string, string> = {};
  headers['Content-Type'] = 'application/json';
  headers['Authorization'] = `Basic ${btoa(basicAuthText)}`;
  headers['x-api-key'] = credential.serverInformation.apiKey;
  manager.addHeaders(headers);

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const requestBody = {
    description: name,
    name: name.trim(),
    ...mergedOptions,
  };

  const result = await manager
    .build(credential.serverInformation.server, 'POST')
    .addHeaders(headers)
    .addBody(requestBody)
    .executeAsync<FluencyDocumentGroupResponse>('Site/api/v0.1/business-functions');

  if (!result.ok) {
    return result;
  }

  const body = result.value;

  return {
    ok: true,
    value: {
      documentTypesCounter: 0,
      groupId: body.id.toString(),
      groupName: body.name || name,
    },
  };
};
