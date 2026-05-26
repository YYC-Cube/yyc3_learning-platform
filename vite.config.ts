import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

function figmaAssetPlugin(): Plugin {
  const virtualModuleId = 'figma:asset/';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'figma-asset-resolver',
    resolveId(source) {
      if (source.startsWith('figma:asset/')) {
        return resolvedVirtualModuleId + source.slice('figma:asset/'.length);
      }
    },
    load(id) {
      if (id.startsWith(resolvedVirtualModuleId)) {
        return `export default "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23020617' rx='8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%233b82f6' font-size='14'%3EYYC%C2%B3%3C/text%3E%3C/svg%3E";`;
      }
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), react(), figmaAssetPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@components': path.resolve(__dirname, 'components'),
      '@services': path.resolve(__dirname, 'services'),
      '@contexts': path.resolve(__dirname, 'contexts'),
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@types': path.resolve(__dirname, 'types'),
      '@data': path.resolve(__dirname, 'data'),
      '@constants': path.resolve(__dirname, 'constants'),
    },
  },
  server: {
    port: 3061,
    strictPort: true,
    host: 'localhost',
    fs: {
      strict: true,
      allow: [path.resolve(__dirname, '.')],
      deny: [
        '.env',
        '.env.local',
        '.env.*.local',
        '.git',
        'node_modules',
        '/etc/passwd',
        '/etc/shadow',
        '/.ssh',
        '~/.ssh',
      ],
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
    cors: false,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['motion', 'lucide-react'],
          charts: ['recharts'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'motion'],
  },
});
