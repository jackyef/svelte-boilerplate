const path = require('path');
const appRootDir = require('app-root-dir');
const webpack = require('webpack');
const fs = require('fs-extra');
const nodeExternals = require('webpack-node-externals');
const ifElse = require(path.resolve(appRootDir.get(), 'utils/logic/ifElse')).default;

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';
const ifProd = ifElse(prod);
const ifDev = ifElse(!prod);
const dir = process.env.DIR;
const contextPath = path.resolve(appRootDir.get(), dir);
const entryPath = path.resolve(appRootDir.get(), dir, ifProd('index.js', 'index.dev.js'));
const buildPath = path.join(appRootDir.get(), './build/server');
const host = process.env['SERVER.HOST'] || 'localhost';
const port = process.env['SERVER.PORT'] || 8080;
const publicPath = ifProd(process.env['PUBLIC_PATH'], `http://${host}:${port}/`);

const developmentPlugins = () => {
  if (!prod) {
    const StartServerPlugin = require('start-server-webpack-plugin');

    return [
      new StartServerPlugin('index.js'),
      new webpack.HotModuleReplacementPlugin(),
    ];
  }

  return [];
};

console.log(`> Cleaning path: ${buildPath}`);
fs.emptyDirSync(buildPath);

module.exports.default = {
  stats: {
    errorDetails: true,
    colors: true,
    reasons: true,
  },
  bail: true,
  context: contextPath,
  entry: {
    index: [ifDev('webpack/hot/poll?1000'), entryPath].filter(Boolean),
  },
  resolve: {
    extensions: ['.js', '.html'],
    modules: ['node_modules'],
  },
  target: 'node',
  output: {
    path: buildPath,
    filename: '[name].js',
    chunkFilename: 'chunk.[name].[id].js',
    publicPath,
    libraryTarget: 'commonjs2',
  },
  watch: !prod,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: [/node_modules/],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          cacheDirectory: true,
          cacheCompression: prod,
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  node: true,
                },
                useBuiltIns: 'entry',
              },
            ],
          ],
          plugins: [
            'babel-plugin-macros',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-export-namespace-from',
            ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-syntax-async-generators',
            '@babel/plugin-syntax-dynamic-import',
            ['@babel/plugin-transform-destructuring', { useBuiltIns: true }],
            ['@babel/plugin-transform-runtime', { helpers: false, regenerator: true }],
            ifDev('console'),
          ].filter(Boolean),
        },
      },
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'svelte-loader',
            options: {
              generate: 'ssr',
              hydratable: true,
              emitCss: false,
              css: false,
              // hotReload: true,
							// hotOptions: {
							// 	noPreserveState: true,
							// },
              preprocess: require('svelte-preprocess')({
                transformers: {
                  postcss: {
                    plugins: [
                      require('autoprefixer')({
                        browsers: 'last 4 versions',
                      }),
                    ],
                  },
                },
              }),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          // ifProd(MiniCssExtractPlugin.loader, 'style-loader'),
          'style-loader', // For now, let's use style-loader so the styles are injected in JS files
          'css-loader',
        ],
      },
    ],
  },
  mode,
  plugins: [
    ...developmentPlugins(),
  ],
  externals: [
    /**
     * Ignore node_modules being bundled
     * on server build
     */
    nodeExternals({
      whitelist: [
        ...ifDev(['webpack/hot/poll?1000'], []),
      ],
    }),
  ],
  devtool: 'source-map',
};
