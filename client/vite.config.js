import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const devPort = Number.parseInt(env.VITE_DEV_PORT || '5580', 10) || 5580;
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://localhost:4580';

  return {
    plugins: [react()],
    server: {
      port: devPort,
      host: true,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  };
});

