import { DependenceInjectionContainer, IStore } from "packages/Core/src";

import Elysia from "elysia";
import { LoginRequestDoc } from "./auth.routes";
import { SchemaService } from "../services/Schema";

export const SchemaRoutes = (container: DependenceInjectionContainer) => {
    container.register<SchemaService>('SchemaService', () => {
        const cloudStore = container.resolve<IStore>('ClodStore')
        return new SchemaService(cloudStore);
    }, "singleton")

    const publicRoutes = new Elysia({ prefix: '/schema' })
        .decorate('di', container)
        .post('', async ({ body, di, set }) => {
            const schemaService = di.resolve<SchemaService>('SchemaService');
            const result = await schemaService.GetListOfDocumentGroups(body as any);
            set.status = typeof result === 'string' ? 403 : 200;
            return {
                success: typeof result === 'string' ? false : true,
                data: result
            }

        }//, //LoginRequestDoc(false)
        )
        .post('group/:id',async ({ body, di, set, params })=> {
            const schemaService = di.resolve<SchemaService>('SchemaService');
            const result = await schemaService.GetListDocumentTypesGroup(body as any, params.id as any);
            set.status = typeof result === 'string' ? 403 : 200;
            return {
                success: typeof result === 'string' ? false : true,
                data: result
            }
        }, LoginRequestDoc(false, true))
        .post('document-type/:id',async ({ body, di, set, params })=> {
            const schemaService = di.resolve<SchemaService>('SchemaService');
            const result = await schemaService.GetDocumentTypeSchema(body as any, params?.id as any);
            set.status = typeof result === 'string' ? 403 : 200;
            return {
                success: typeof result === 'string' ? false : true,
                data: result
            }
        }//, LoginRequestDoc(false, true)
    )
    return new Elysia()
        .use(publicRoutes)
}