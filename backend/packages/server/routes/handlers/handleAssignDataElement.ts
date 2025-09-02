import { ElysiaContext } from "../types/ElysiaContext";
import { handleServiceResponse } from "../utils/handleServiceResponse";
import { resolveSchemaService } from "../utils/resolveSchemaService";

export const handleAssignDataElement = async ({ body, di, set }: ElysiaContext) => {
    const { store } = body;
    const schemaService = resolveSchemaService(di, store);
    const result = await schemaService.assignDataElementToDocumentType(body as any);

    return handleServiceResponse(result, set);
};
