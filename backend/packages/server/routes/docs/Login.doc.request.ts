import { Elysia, Static, t } from 'elysia';

const Credentials = t.Object({
  username: t.String({}),
  password: t.String({}),
  serverInformation: t.Object({
    server: t.String(),
    apiKey: t.String(),
    apiSecret: t.String(),
    organization: t.String(),
    dataBase: t.Optional(t.String()),
  }),
  store: t.Optional(t.String()),
  token: t.Optional(t.String()),
});

export type CredentialsSchema = Static<typeof Credentials>;

export const LoginRequestDoc = {
  body: Credentials,
  response: {
    200: t.Object({
      success: t.Boolean(),
      data: t.String(),
    }),
    403: t.Object({
      success: t.Boolean(),
      data: t.String({ description: 'Mensaje de error del servidor' }),
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
  },
};
