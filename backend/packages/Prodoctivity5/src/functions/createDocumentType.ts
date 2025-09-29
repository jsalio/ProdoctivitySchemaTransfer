import { Credentials, Result, DocumentType } from 'packages/Core/src';
import { getDocumentTypes } from './getDocumentTypes';
import { DocumentTypeOptions } from '../types/DocumentTypeOptions';
import { RequestManager } from '@schematransfer/requestmanager';

const DEFAULT_OPTIONS: Required<DocumentTypeOptions> = {
  status: 'Active',
  isTemplate: false,
  useFullTextSearch: false,
  icon: {
    id: 'fa-archive',
  },
  format: 'PDF',
};

export const createDocumentType = async (
  credential: Credentials,
  createDocumentTypeRequest: {
    name: string;
    businessFunctionId: string;
  },
  options: DocumentTypeOptions = {},
): Promise<Result<DocumentType, Error>> => {
  if (!createDocumentTypeRequest.name?.trim()) {
    return {
      ok: false,
      error: new Error('Document type name cannot be empty'),
    };
  }

  if (!createDocumentTypeRequest.businessFunctionId?.trim()) {
    return {
      ok: false,
      error: new Error('Business function ID cannot be empty'),
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
    name: createDocumentTypeRequest.name.trim(),
    businessLine: {
      id: createDocumentTypeRequest.businessFunctionId,
    },
    ...mergedOptions,
  };

  const result = await manager
    .build(credential.serverInformation.server, 'POST')
    .addHeaders(headers)
    .addBody(requestBody)
    .executeAsync<any>('site/api/v0.1/document-types?infoOnly=true');

  if (!result.ok) {
    return result;
  }

  let documentTypes = await getDocumentTypes(
    credential,
    createDocumentTypeRequest.businessFunctionId,
  );
  if (!documentTypes.ok) {
    return {
      ok: false,
      error: new Error('Not determinated if document type is created'),
    };
  }
  let dt: DocumentType | undefined;
  documentTypes.value.forEach((x) => {
    if (x.documentTypeName === createDocumentTypeRequest.name) {
      dt = {
        documentTypeId: x.documentTypeId,
        documentTypeName: x.documentTypeName,
      };
    }
  });
  if (!dt) {
    return {
      ok: false,
      error: new Error('Document type not created'),
    };
  }
  return {
    ok: true,
    value: dt,
  };
};
