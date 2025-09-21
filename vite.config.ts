import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: env.BASE_URL || '/',
    server: { 
      host: true, // Use HOST=0.0.0.0 for IPv4
      port: 8080, 
      strictPort: true 
    },
    plugins: [
      react(), 
      mode === 'development' && componentTagger()
    ].filter(Boolean),
    resolve: { 
      alias: { 
        '@': path.resolve(__dirname, './src') 
      } 
    },
    build: {
      target: 'es2020',
      sourcemap: mode !== 'production',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: ['react-router-dom', '@tanstack/react-query']
          }
        }
      },
      esbuild: {
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
      }
    }
  };
});