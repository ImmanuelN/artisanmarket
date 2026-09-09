/**
 * Code-stage security ruleset (Section 4.3.2).
 *
 * Scoped deliberately: security-relevant rules are errors and fail the gate,
 * stylistic and correctness noise is downgraded so a red pipeline always means
 * a real finding. The `lint` script runs with --max-warnings 0, so anything set
 * to "warn" here must still be kept at zero — use "off" for rules that are not
 * worth enforcing on this codebase.
 *
 * Uses only plugins already present in package.json / package-lock.json, so
 * `npm ci` stays reproducible.
 */
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react-hooks', 'react-refresh'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'dev-dist/',
    'build/',
    'coverage/',
    '*.config.js',
    '*.config.ts',
    'postcss.config.js',
    'tailwind.config.js',
  ],
  rules: {
    // ---- Security: these fail the Code stage ----
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-proto': 'error',
    'no-caller': 'error',
    'no-extend-native': 'error',
    'no-iterator': 'error',
    'no-with': 'error',
    'no-new-wrappers': 'error',
    'no-unsafe-optional-chaining': 'error',

    'no-restricted-syntax': [
      'error',
      {
        selector: 'JSXAttribute[name.name="dangerouslySetInnerHTML"]',
        message:
          'dangerouslySetInnerHTML bypasses React escaping and is the delivery path for stored XSS (threat T2 in docs/threat-model.md). If it is genuinely required, sanitise the value first and justify it in review.',
      },
      {
        selector:
          'CallExpression[callee.object.name="localStorage"][callee.property.name="setItem"][arguments.0.value=/(token|jwt|secret|password|auth)/i]',
        message:
          'Storing credentials in localStorage exposes them to any XSS on the origin (threat T1 in docs/threat-model.md). Prefer an HttpOnly, Secure, SameSite cookie issued by the API.',
      },
      {
        selector: 'MemberExpression[property.name="innerHTML"]',
        message:
          'Assigning innerHTML bypasses React escaping and risks XSS. Render through JSX instead.',
      },
      {
        selector:
          'MemberExpression[object.object.name="import"][object.property.name="meta"] > Identifier[name=/SECRET|PRIVATE|_KEY$/]',
        message:
          'Every import.meta.env.VITE_* value is inlined into the public bundle (threat T3 in docs/threat-model.md). Only publishable keys belong here.',
      },
    ],

    // ---- Framework correctness ----
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'react-refresh/only-export-components': 'off',

    // ---- Downgraded: real but not security, and noisy on this codebase ----
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-unused-vars': 'off',
    'no-empty': 'off',
    'no-useless-escape': 'off',
    'no-case-declarations': 'off',
    'no-console': 'off',
  },
}
