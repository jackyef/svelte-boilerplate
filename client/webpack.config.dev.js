require('@babel/register');
require('ejs-loader');

const path = require('path');
const appRootDir = require('app-root-dir');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const WriteAssetsJsonPlugin = require('../utils/webpack/plugins/WriteAssetsJsonPlugin').default;
const baseConfig = require('./webpack.config.babel').default;
const { normalizeCSS, criticalCSS } = require(path.resolve(appRootDir.get(), 'utils/html/critical-css'));

const dir = process.env.DIR;
const buildPath = path.resolve(appRootDir.get(), 'build', dir);
const baseShellPath = path.resolve(appRootDir.get(), 'static', 'base-shell.ejs');

const webpackConfig = {
	...baseConfig,
	mode: 'development',
	devtool: 'inline-source-map',
	plugins: [
		...baseConfig.plugins,
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
		new WriteAssetsJsonPlugin({
			to: buildPath,
		}),
	],
	devServer: {
		contentBase: buildPath,
		host: process.env['CLIENT.HOST'] || 'localhost',
		port: process.env['CLIENT.PORT'] || 8081,
	}
};

module.exports = webpackConfig;
