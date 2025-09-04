import { ElysiaContext } from '../types/ElysiaContext';
import { handleServiceResponse } from '../utils/handleServiceResponse';
import { resolveSchemaService } from '../utils/resolveSchemaService';

export const handleCreateDocumentGroup = async ({ body, di, set }: ElysiaContext) => {
  const { store } = body;
  const schemaService = resolveSchemaService(di, store);
  const result = await schemaService.createDocumentGroup(body as any);

  return handleServiceResponse(result, set);
};
