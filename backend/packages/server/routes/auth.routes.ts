import { AdditionalInfo, Credentials, DependenceInjectionContainer, IStore } from "packages/Core/src";
import { Elysia, t } from "elysia";

import { AuthService } from "../services/Auth";

export const LoginRequestDoc = (isLogin: boolean, defineParams?: boolean) => ({
    body: t.Object({
        username: t.String({}),
        password: t.String({}),
        serverInformation: t.Object({
            server: t.String(),
            apiKey: t.String(),
            apiSecret: t.String(),
            organization: t.String(),
            dataBase: t.String()
        }),
        store: isLogin ? t.Optional(t.String()) : t.String(),
        token: isLogin ? t.Optional(t.String()) : t.String()
    }),
    params: t.Object({
        id: t.Optional(t.String())
    }),
    response: {
        200: t.Object({
            success: t.Boolean(),
            data: t.Any()
        }),
        403: t.Object({
            success: t.Boolean(),
            data: t.Any({ description: 'Mensaje de error del servidor' }),
        }),
        500: t.Object({
            success: t.Boolean(),
            data: t.String({ description: 'Mensaje de error del servidor' }),
        }),
    },
    details: {
        summary: 'Iniciar sesión',
        description: 'Autentica a un usuario y devuelve un token JWT si las credenciales son válidas.',
        tags: ['auth'],
    }
})


export const AuthRoutes = (container: DependenceInjectionContainer) => {
    // container.register<AuthService>('AuthServiceCloud', () => {
    //     console.log('Run...')
    //     const store = container.resolve<IStore>('ClodStore')
    //     return new AuthService(store);
    // }, "singleton")
    // container.register<AuthService>('AuthServiceFluency', () => {
    //     console.log('Run...')
    //     const store = container.resolve<IStore>('FluencyStore')
    //     return new AuthService(store);
    // }, "singleton")


    const publicRoutes = new Elysia({ prefix: '/auth' })
        .decorate('di', container)
        .post('', async ({ body, di, set }) => {
            console.log(JSON.stringify(body))
            const authService = di.resolve<AuthService>((body as any).store === "Cloud" ? 'AuthServiceCloud' : 'AuthServiceFluency');
            console.log('Store to login:',(body as any)?.store)
            const result = await authService.LoginToStore(body as any);
            set.status = result === "" || result === undefined ? 403 : 200;
            return {
                success: result === "",
                data: !result ? "" : result
            }

        }//, LoginRequestDoc(true,false)
        )

    return new Elysia()
        .use(publicRoutes)
}