import { CreateDocumentGroupRequest } from 'packages/Core/src';
import { ElysiaContext } from '../types/ElysiaContext';
import { handleServiceResponse } from '../utils/handleServiceResponse';
import { resolveSchemaService } from '../utils/resolveSchemaService';

export const handleCreateDocumentGroup = async ({ body, di, set }: ElysiaContext) => {
  const { credentials } = body as CreateDocumentGroupRequest;
  const schemaService = resolveSchemaService(di, credentials.store);
  const result = await schemaService.createDocumentGroup(body as any);

  return handleServiceResponse(result, set);
};
