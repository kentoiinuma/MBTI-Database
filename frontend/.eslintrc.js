// .eslintrc.js

module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true, // Jest's environment added
  },
  extends: ['plugin:react/recommended', 'standard', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'camelcase': 'off',
    'react/prop-types': 'off',
    // その他のカスタムルール
  },
  settings: {
    react: {
      version: 'detect', // React version set to auto-detect
    },
  },
};
