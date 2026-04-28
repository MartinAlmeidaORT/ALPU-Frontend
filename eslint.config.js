import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'prefer-const': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  {
    files: ['**/*.svelte'],
    plugins: {
      svelte: sveltePlugin,
    },
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
      },
    },
    rules: {
      ...sveltePlugin.configs.recommended.rules,
    },
  },
  prettierConfig,
  {
    ignores: ['.svelte-kit/**', 'build/**', 'dist/**'],
  },
];
