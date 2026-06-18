import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import babel from '@rolldown/plugin-babel'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const allowedHosts = ['.ngrok-free.dev'];

  if (env.VITE_ALLOWED_HOSTS) {
    allowedHosts.push(...env.VITE_ALLOWED_HOSTS.split(','));
  }

  return defineConfig({
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      allowedHosts,
      port: 5173,
      host: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  });
};
