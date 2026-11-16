import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.port, () => {
  console.log(
    `[LG Semillas API] Servidor corriendo en http://localhost:${env.port}${env.apiPrefix} (entorno: ${env.nodeEnv})`
  );
});

