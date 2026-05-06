import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
];
