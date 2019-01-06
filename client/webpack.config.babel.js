const path = require('path');
const appRootDir = require('app-root-dir');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsWebpackPlugin = require('assets-webpack-plugin');
const ifElse = require(path.resolve(appRootDir.get(), 'utils/logic/ifElse')).default;
const { normalizeCSS, criticalCSS } = require(path.resolve(appRootDir.get(), 'utils/html/critical-css'));

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';
const ifProd = ifElse(prod);
const dir = process.env.DIR;
const entryPath = path.resolve(appRootDir.get(), dir, 'index.js');
const buildPath = path.join(appRootDir.get(), './build/client');
const baseShellPath = path.resolve(appRootDir.get(), 'static', 'base-shell.ejs');
const host = process.env['CLIENT.HOST'] || 'localhost';
const port = process.env['CLIENT.PORT'] || 8081;
const publicPath = ifProd(process.env['PUBLIC_PATH'], `http://${host}:${port}/`);

const productionPlugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    title: 'My Svelte App',
    /**
     * We force this html to be loaded using ejs-loader
     * else, it will be handled by svelte-loader,
     *  because we defined it in baseConfig.modules.rules
     */
    template: `!!ejs-loader!${baseShellPath}`,
    normalizeCSS,
    criticalCSS,
    chunksSortMode: 'none',
  }),
];

module.exports.default = {
  entry: {
    bundle: entryPath,
  },
  resolve: {
    extensions: ['.js', '.html'],
  },
  target: 'web',
  output: {
    path: buildPath,
    filename: ifProd('[name].[hash].js', '[name].js'),
    chunkFilename: ifProd('chunk.[name].[id].[hash].js, chunk.[name].[id].js'),
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'svelte-loader',
            options: {
              skipIntroByDefault: true,
              nestedTransitions: true,
              emitCss: true,
							hotReload: true,
							hotOptions: {
								noPreserveState: true,
							},
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
    new MiniCssExtractPlugin({
      filename: ifProd('[name].[hash].css', '[name].css'),
      chunkFilename: ifProd('[id].[hash].css', '[id].css'),
    }),
    ...ifProd(productionPlugins, []).filter(Boolean),
    new AssetsWebpackPlugin({
      path: buildPath,
    }),
  ],
  devtool: ifProd(false, 'source-map'),
};
