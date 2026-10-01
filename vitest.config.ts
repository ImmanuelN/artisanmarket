import { defineConfig } from 'vitest/config'

/**
 * Vitest is pinned to 0.34.x because this project is on Vite 4. Current Vitest
 * requires Vite 6 or newer, which cannot be installed here — the same upstream
 * constraint that blocks upgrading Vite itself (see docs/threat-model.md,
 * "Gate status"). Revisit when Vite is upgraded.
 *
 * A separate config rather than a `test` block in vite.config.ts, so the build
 * configuration stays independent of the test configuration.
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
