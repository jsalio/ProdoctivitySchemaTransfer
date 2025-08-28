import { DependenceInjectionContainer } from "packages/Core/src";
import { Elysia } from "elysia";

import { AuthService } from "../services/Auth";

export const AuthRoutes = (container: DependenceInjectionContainer) => {
    const publicRoutes = new Elysia({ prefix: '/auth' })
        .decorate('di', container)
        .post('', async ({ body, di, set }) => {
            const authService = di.resolve<AuthService>((body as any).store === "Cloud" ? 'AuthServiceCloud' : 'AuthServiceFluency');
            const result = await authService.LoginToStore(body as any);
            set.status = result === "" || result === undefined ? 403 : 200;
            return {
                success: result === "",
                data: !result ? "" : result
            }
        })
    return new Elysia()
        .use(publicRoutes)
}