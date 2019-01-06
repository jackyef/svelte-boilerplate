const path = require('path');
const appRootDir = require('app-root-dir');
const webpack = require('webpack');
const ifElse = require(path.resolve(appRootDir.get(), 'utils/logic/ifElse')).default;

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';
const ifProd = ifElse(prod);
const dir = process.env.DIR;
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

module.exports.default = {
  entry: {
    index: entryPath,
  },
  resolve: {
    extensions: ['.js', '.html'],
    modules: ['node_modules'],
  },
  target: 'node',
  output: {
    path: buildPath,
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
    publicPath,
    libraryTarget: 'commonjs2',
  },
  watch: !prod,
  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'svelte-loader',
            options: {
              generate: 'ssr',
              emitCss: false,
              css: false,
              // hotReload: true,
							// hotOptions: {
							// 	noPreserveState: true,
							// },
              // preprocess: require('svelte-preprocess')({
              //   transformers: {
              //     postcss: {
              //       plugins: [
              //         require('autoprefixer')({
              //           browsers: 'last 4 versions',
              //         }),
              //       ],
              //     },
              //   },
              // }),
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
  devtool: 'source-map',
};
