import { DependenceInjectionContainer } from "packages/Core/src";

import Elysia from "elysia";
import { SchemaService } from "../services/Schema";

const resolveSchemaService = (di: DependenceInjectionContainer, store?: string): SchemaService => {
    const serviceKey = store === "Cloud" ? 'SchemaCloudService' : 'SchemaFluencyService';
    return di.resolve<SchemaService>(serviceKey);
};

const handleServiceResponse = <T>(result: T, set: any) => {
    const isError = typeof result === 'string';
    set.status = isError ? 403 : 200;
    return {
        success: !isError,
        data: result
    };
};


export const SchemaRoutes = (container: DependenceInjectionContainer) => {
    const publicRoutes = new Elysia({ prefix: '/schema' })
        .decorate('di', container)
        .post('', async ({ body, di, set }) => {
            const schemaService = resolveSchemaService(di, (body as any)?.store);
            console.log('Store to login:', (body as any)?.store)
            const result = await schemaService.GetListOfDocumentGroups(body as any);
            return handleServiceResponse(result, set);

        })
        .post('group/:id', async ({ body, di, set, params }) => {
            const schemaService = resolveSchemaService(di, (body as any)?.store);
            const result = await schemaService.GetListDocumentTypesGroup(body as any, params.id as any);
            return handleServiceResponse(result, set);
        })
        .post('document-type/:id', async ({ body, di, set, params }) => {
            const schemaService = resolveSchemaService(di, (body as any)?.store);
            const result = await schemaService.GetDocumentTypeSchema(body as any, params?.id as any);
            return handleServiceResponse(result, set);
        }).post('data-elements', async ({ body, di, set, params }) => {
            const schemaService = resolveSchemaService(di, (body as any)?.store);
            console.log('Store to login:', (body as any)?.store)
            const result = await schemaService.GetSystemDataElements(body as any);
            return handleServiceResponse(result, set);
        })
        .post('create-data-element', async ({ body, di, set }) => {
            const schemaService = resolveSchemaService(di, (body as any)?.store);
            const result = await schemaService.CreateDataElement(body as any);
            return handleServiceResponse(result, set);
        })
        .post('create-document-group', async ({ body, di, set }) => {
            const schemaService = resolveSchemaService(di, (body as any)?.store);
            const result = await schemaService.CreateDocumentGroup(body as any);
            return handleServiceResponse(result, set);
        })
        .post('create-document-type', async ({ body, di, set }) => {
            const schemaService = resolveSchemaService(di, (body as any)?.store);
            const result = await schemaService.CreateDocumentType(body as any);
            return handleServiceResponse(result, set);
        })
        .post('assign-data-element', async ({ body, di, set }) => {
            const schemaService = resolveSchemaService(di, (body as any)?.store);
            const result = await schemaService.AssignDataElementToDocumentType(body as any);
            return handleServiceResponse(result, set);
        })
        .post('assign-data-element', async ({ body, di, set }) => {
           
            const schemaService = resolveSchemaService(di, (body as any)?.store);
            const result = await schemaService.AssignDataElementToDocumentType(body as any);
            return handleServiceResponse(result, set);
        })
    return new Elysia()
        .use(publicRoutes)
}