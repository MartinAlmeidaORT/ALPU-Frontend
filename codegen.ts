import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:5116/graphql",
  documents: ["src/**/*.svelte", 'src/**/*.ts'],
  generates: {
    './src/lib/graphql/schema.ts': {
      config: {
        banner: '/* eslint-disable */\n// @ts-nocheck'
      },
      plugins: ['typescript']
    },
    "./src/lib/graphql/types/": {
      config: {
        banner: '/* eslint-disable */\n// @ts-nocheck',
        useTypeImports: true,
      },
      preset: "client",
      presetConfig: {
        fragmentMasking: false
      },
      plugins: []
    }
  },
  ignoreNoDocuments: true
};

export default config;
