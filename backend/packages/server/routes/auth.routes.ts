import { AppCodeError, DependenceInjectionContainer } from "@schematransfer/core";
import { Elysia } from "elysia";

import { AuthService } from "../services/Auth";
// import { AppCodeError } from "packages/Core/src/domain/AppCodeError";

export const AuthRoutes = (container: DependenceInjectionContainer) => {
    const publicRoutes = new Elysia({ prefix: '/auth' })
        .decorate('di', container)
        .post('', async ({ body, di, set }) => {
            // console.log('Here', body)
            const authService = di.resolve<AuthService>((body as any).store === "Cloud" ? 'AuthServiceCloud' : 'AuthServiceFluency');
            const result = await authService.LoginToStore(body as any);
            // console.log(JSON.stringify(result))
            if (!result.ok){
                set.status = result.code === AppCodeError.UnmanagedError ? 500:400
                return{
                    success:result.ok,
                    data:result.error.message
                }
            }
            set.status = 200;
            return {
                success: result.ok,
                data: result.value
            }
        })
    return new Elysia()
        .use(publicRoutes)
}