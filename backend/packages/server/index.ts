import { AuthRoutes } from './routes/auth.routes';
import { Elysia } from 'elysia';
import { SchemaRoutes } from './routes/schema.routes';
import { buildContainer } from './utils/injector';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';

const startApp = async () => {
  const container = await buildContainer();
  const app = new Elysia()
    .use(
      cors({
        origin: true, // Allow all origins
        credentials: true,
      }),
    )
    .use(
      swagger({
        documentation: {
          info: {
            title: 'schematransfer API',
            version: '1.0.0',
            description: '',
          },
          tags: [{ name: 'Auth', description: 'Rutas relacionadas con autenticación' }],
        },
        path: '/swagger', // Ruta donde estará disponible Swagger
      }),
    )
    .use(AuthRoutes(container))
    .use(SchemaRoutes(container))
    .get('/', () => ' Welcome Schematransfer API');

  app.listen(3000, () => {
    console.log('🦊 Elysia server running on http://localhost:3000');
  });
};

startApp().catch((error) => {
  console.error('Error starting the application:', error);
});
