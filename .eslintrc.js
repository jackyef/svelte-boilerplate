module.exports = {
  extends: ['eslint:recommended'],
  plugins: ['html', '@tivac/svelte', 'import'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  rules: {
    'no-console': 'off',
    'import/no-dynamic-require': 'off',
  },
  env: {
    node: true,
    amd: true,
    browser: true,
    commonjs: true,
    es6: true,
  },
};
