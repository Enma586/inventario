import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.js'],
    testTimeout: 15000,
    maxConcurrency: 1,        // ← un archivo a la vez, sin carreras
  },
});