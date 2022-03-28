module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  parser: 'babel-eslint',
  extends: [
    'plugin:react/recomended',
    'airbnb-base',
    'prettier',
    'prettier/react',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: ['error', 4],
    'comma-spacing': ['error', { before: false, after: true }],
  },
};
