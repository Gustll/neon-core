import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

delete globals.browser["AudioWorkletGlobalScope "];

export default [
    ...compat
        .extends(
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
            'prettier',
        )
        .map((config) => ({
            ...config,
            files: ['**/*.ts'],
        })),
    {
        files: ['**/*.ts'],

        plugins: {
            '@typescript-eslint': typescriptEslint,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },

        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],

            curly: ['error', 'all'],
            'array-callback-return': 'error',
            'no-await-in-loop': 'error',
            'no-constant-binary-expression': 'error',
            'no-constructor-return': 'error',
            'no-duplicate-imports': 'error',
            'no-unused-private-class-members': 'error',

            complexity: [
                'error',
                {
                    max: 7,
                },
            ],

            eqeqeq: 'error',
            'max-depth': 'error',
            'no-unneeded-ternary': 'error',
            'no-unused-expressions': 'error',
            'no-var': 'error',
            'no-multi-assign': 'error',
        },
    },
];
