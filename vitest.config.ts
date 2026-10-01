import { defineConfig } from 'vitest/config'

/**
 * A separate config rather than a `test` block in vite.config.ts, so the build
 * configuration stays independent of the test configuration.
 *
 * Vitest was previously pinned to 0.34.x because the project was on Vite 4.
 * The Vite 7 upgrade lifted that, and both are now current.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      // lcov is what SonarQube reads; text gives a summary in the CI log.
      reporter: ['text-summary', 'lcov'],
      reportsDirectory: 'coverage',
      // Application code only. Generated output, entrypoints and type-only
      // files are excluded: counting them would understate coverage of the
      // code that actually makes decisions.
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/assets/**'
      ]
    }
  }
})
