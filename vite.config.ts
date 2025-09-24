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
      sourcemap: false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            // Router
            if (id.includes('react-router')) {
              return 'router-vendor'
            }
            // UI libraries
            if (id.includes('@radix-ui') || id.includes('framer-motion')) {
              return 'ui-vendor'
            }
            // Charts and visualization
            if (id.includes('recharts') || id.includes('dagre') || id.includes('@xyflow')) {
              return 'charts-vendor'
            }
            // Date/utility libraries
            if (id.includes('date-fns') || id.includes('zod') || id.includes('emailjs')) {
              return 'utils-vendor'
            }
            // Other node_modules
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      },
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : []
      }
    }
  };
});