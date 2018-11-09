// import '@babel/polyfill';

const path = require('path');
const glob = require('glob-all');

// plugins
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

// module.exports = {

// 	module: {
// 		loaders: [
// 			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
// 		]
// 	}

// };

module.exports = {
	// entry: glob.sync([
	// 	'!./_tmp/src/**/*.config.js', // select modules declarations first
	// 	'./_tmp/src/app.js',
	// 	'./_tmp/src/config/*.js',
	// 	'./_tmp/src/**/*.js',
	// 	'./_tmp/src/**/*.config.js', // select modules config
	// 	'./_tmp/src/**/*.run.js', // select modules run
	// 	'./_tmp/src/legacy.js'
	// ]),
	output: {
		// path: path.resolve(__dirname, 'dist'),
		filename: 'app.min.bundle.js',
		// sourceMap: true,
		// sourceMapFilename: 'app.min.js.map',
	},
	// devtool: 'source-map',
	optimization: {
		minimize: false,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					sourceMap: true,
					mangle: false,
					compress: {
						// inline: 5
					}
				}
			})
		]
	},
	plugins: [
		new webpack.SourceMapDevToolPlugin({
			filename: 'app.min.bundle.js.map'
		})
	],
	module: {
		rules: [

			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},

			{
				test: /\.js$/,
				use: ['source-map-loader'],
				enforce: 'pre'
			}

		]
	}
};
