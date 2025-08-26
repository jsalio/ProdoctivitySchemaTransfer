import { DependenceInjectionContainer, IStore } from "packages/Core/src";

import Elysia from "elysia";
import { LoginRequestDoc } from "./auth.routes";
import { SchemaService } from "../services/Schema";

export const SchemaRoutes = (container: DependenceInjectionContainer) => {
    const publicRoutes = new Elysia({ prefix: '/schema' })
        .decorate('di', container)
        .post('', async ({ body, di, set }) => {
            const schemaService = di.resolve<SchemaService>((body as any).store === "Cloud" ? 'SchemaCloudService' : 'SchemaFluencyService');
            console.log('Store to login:', (body as any)?.store)
            const result = await schemaService.GetListOfDocumentGroups(body as any);
            set.status = typeof result === 'string' ? 403 : 200;
            return {
                success: typeof result === 'string' ? false : true,
                data: result
            }

        }//, //LoginRequestDoc(false)
        )
        .post('group/:id', async ({ body, di, set, params }) => {
            const schemaService = di.resolve<SchemaService>((body as any).store === "Cloud" ? 'SchemaCloudService' : 'SchemaFluencyService');
            const result = await schemaService.GetListDocumentTypesGroup(body as any, params.id as any);
            set.status = typeof result === 'string' ? 403 : 200;
            return {
                success: typeof result === 'string' ? false : true,
                data: result
            }
        }, LoginRequestDoc(false, true))
        .post('document-type/:id', async ({ body, di, set, params }) => {
            const schemaService = di.resolve<SchemaService>((body as any).store === "Cloud" ? 'SchemaCloudService' : 'SchemaFluencyService');
            const result = await schemaService.GetDocumentTypeSchema(body as any, params?.id as any);
            set.status = typeof result === 'string' ? 403 : 200;
            return {
                success: typeof result === 'string' ? false : true,
                data: result
            }
        }//, LoginRequestDoc(false, true)
        ).post('data-elements', async ({ body, di, set, params }) => {
            const schemaService = di.resolve<SchemaService>((body as any).store === "Cloud" ? 'SchemaCloudService' : 'SchemaFluencyService');
            console.log('Store to login:', (body as any)?.store)
            const result = await schemaService.GetSystemDataElements(body as any);
            set.status = typeof result === 'string' ? 403 : 200;
            return {
                success: typeof result === 'string' ? false : true,
                data: result
            }
        })
        .post('create-data-element', async ({ body, di, set }) => {
            const schemaService = di.resolve<SchemaService>((body as any).store === "Cloud" ? 'SchemaCloudService' : 'SchemaFluencyService');
            const result = await schemaService.CreateDataElement(body as any);
            set.status = typeof result === 'string' ? 403 : 200;
            return {
                success: typeof result === 'string' ? false : true,
                data: result
            }
        })
        .post('create-document-group', async ({ body, di, set }) => {
            const schemaService = di.resolve<SchemaService>((body as any).store === "Cloud" ? 'SchemaCloudService' : 'SchemaFluencyService');
            const result = await schemaService.CreateDocumentGroup(body as any);
            set.status = typeof result === 'string' ? 403 : 200;
            return {
                success: typeof result === 'string' ? false : true,
                data: result
            }
        })
        .post('create-document-type', async ({ body, di, set }) => {
            const schemaService = di.resolve<SchemaService>((body as any).store === "Cloud" ? 'SchemaCloudService' : 'SchemaFluencyService');
            const result = await schemaService.CreateDocumentType(body as any);
            set.status = typeof result === 'string' ? 403 : 200;
            return {
                success: typeof result === 'string' ? false : true,
                data: result
            }
        })
        .post('assign-data-element', async ({ body, di, set }) => {
            const schemaService = di.resolve<SchemaService>((body as any).store === "Cloud" ? 'SchemaCloudService' : 'SchemaFluencyService');
            const result = await schemaService.AssignDataElementToDocumentType(body as any);
            set.status = typeof result === 'string' ? 403 : 200;
            return {
                success: typeof result === 'string' ? false : true,
                data: result
            }
        })
    return new Elysia()
        .use(publicRoutes)
}