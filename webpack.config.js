
// plugins
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	output: {
		filename: 'app.min.bundle.js'
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
	performance: {
		hints: false
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
