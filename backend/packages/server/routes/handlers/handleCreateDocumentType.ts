import { ElysiaContext } from "../types/ElysiaContext";
import { handleServiceResponse } from "../utils/handleServiceResponse";
import { resolveSchemaService } from "../utils/resolveSchemaService";

export const handleCreateDocumentType = async ({ body, di, set }: ElysiaContext) => {
    const { store } = body;
    const schemaService = resolveSchemaService(di, store);
    const result = await schemaService.CreateDocumentType(body as any);

    return handleServiceResponse(result, set);
};
