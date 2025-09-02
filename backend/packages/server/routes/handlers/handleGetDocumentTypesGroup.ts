import { ElysiaContext } from "../types/ElysiaContext";
import { handleServiceResponse } from "../utils/handleServiceResponse";
import { HTTP_STATUS } from "../utils/HTTP_STATUS";
import { resolveSchemaService } from "../utils/resolveSchemaService";

export const handleGetDocumentTypesGroup = async ({ body, di, set, params }: ElysiaContext) => {
    if (!params?.id) {
        set.status = 400;
        return { success: false, data: 'Group ID is required' };
    }

    const { store } = body;
    const schemaService = resolveSchemaService(di, store);
    const result = await schemaService.getListDocumentTypesGroup(body as any, params.id);

    return handleServiceResponse(result, set);
};
