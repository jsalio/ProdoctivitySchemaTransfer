import { ElysiaContext } from "../types/ElysiaContext";
import { handleServiceResponse } from "../utils/handleServiceResponse";
import { logStore } from "../utils/logStore";
import { resolveSchemaService } from "../utils/resolveSchemaService";

// Route handlers
export const handleGetDocumentGroups = async ({ body, di, set }: ElysiaContext) => {
    const { store } = body;
    logStore(store);

    const schemaService = resolveSchemaService(di, store);
    const result = await schemaService.GetListOfDocumentGroups(body as any);

    return handleServiceResponse(result, set);
};
