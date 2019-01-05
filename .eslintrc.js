module.exports = {
  extends: ['eslint:recommended'],
  plugins: ['html', '@tivac/svelte'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  rules: {
    'no-console': 'off',
  },
  env: {
    node: true,
    amd: true,
    browser: true,
    commonjs: true,
    es6: true,
  },
};
