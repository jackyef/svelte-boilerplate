import path from 'path';
import appRootDir from 'app-root-dir';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const mode = process.env.NODE_ENV || 'development';
const dir = process.env.DIR;
const prod = mode === 'production';
const entryPath = path.resolve(appRootDir.get(), dir, 'index.js');

export default {
	entry: {
		bundle: entryPath,
	},
	resolve: {
		extensions: ['.js', '.html']
	},
	output: {
		path: path.join(appRootDir.get(), './build/client'),
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						skipIntroByDefault: true,
						nestedTransitions: true,
						emitCss: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			}
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: prod ? '[hash].css' : '[name].css',
		})
	],
	devtool: prod ? false: 'source-map'
};