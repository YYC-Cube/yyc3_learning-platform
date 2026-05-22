// =============================================================================
// YYC3-Learning-Platform — Vitest Configuration
// =============================================================================
// Run: npx vitest           (watch mode)
//      npx vitest run       (single run)
//      npx vitest --coverage (with coverage report)
// =============================================================================

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // ─── Environment ─────────────────────────────────────────────────────
    environment: 'jsdom',

    // ─── Globals ─────────────────────────────────────────────────────────
    globals: true,

    // ─── Test File Pattern ───────────────────────────────────────────────
    include: ['tests/**/*.test.{ts,tsx}'],

    // ─── Setup Files ─────────────────────────────────────────────────────
    setupFiles: [],

    // ─── Coverage ────────────────────────────────────────────────────────
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      include: [
        'hooks/**/*.ts',
        'services/**/*.ts',
        'contexts/**/*.tsx',
        'components/ui/utils.ts',
        'constants/**/*.ts',
        'types/**/*.ts',
      ],
      exclude: [
        'node_modules',
        'tests',
        '**/*.test.*',
        'supabase/functions/server/kv_store.tsx',
        'components/figma/**',
      ],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },

    // ─── Timeouts ────────────────────────────────────────────────────────
    testTimeout: 10000,

    // ─── Module Resolution ───────────────────────────────────────────────
    alias: {
      // Handle figma:asset imports in test environment
      'figma:asset': path.resolve(__dirname, 'tests/__mocks__/figma-asset.ts'),
    },
  },

  resolve: {
    alias: {
      'figma:asset': path.resolve(__dirname, 'tests/__mocks__/figma-asset.ts'),
      'sonner@2.0.3': 'sonner',
    },
  },
});
