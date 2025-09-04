import { ElysiaContext } from '../types/ElysiaContext';
import { handleServiceResponse } from '../utils/handleServiceResponse';
import { HTTP_STATUS } from '../utils/HTTP_STATUS';
import { resolveSchemaService } from '../utils/resolveSchemaService';

export const handleGetDocumentTypeSchema = async ({ body, di, set, params }: ElysiaContext) => {
  if (!params?.id) {
    set.status = 400;
    return { success: false, data: 'Document type ID is required' };
  }

  const { store } = body;
  const schemaService = resolveSchemaService(di, store);
  const result = await schemaService.getDocumentTypeSchema(body as any, params.id);

  return handleServiceResponse(result, set);
};
