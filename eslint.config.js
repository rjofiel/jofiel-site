import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';

const noComments = {
  meta: {
    type: 'suggestion',
    messages: { comment: 'No comments: name things so the code explains itself, and put the why in CLAUDE.md.' }
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) context.report({ loc: comment.loc, messageId: 'comment' });
      }
    };
  }
};

export default tseslint.config(
  { ignores: ['dist', '.react-router'] },
  { linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: 'error' } },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, sonarjs.configs.recommended],
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      local: { rules: { 'no-comments': noComments } }
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      'sonarjs/cognitive-complexity': ['error', 8],
      'sonarjs/todo-tag': 'off',
      'sonarjs/fixme-tag': 'off',
      'local/no-comments': 'error'
    }
  },
  {
    files: ['app/components/FloatingDecorations.tsx'],
    rules: { 'sonarjs/pseudo-random': 'off' }
  },
  {
    files: ['app/pages/HeavenSent.tsx'],
    rules: { 'sonarjs/code-eval': 'off' }
  }
);
