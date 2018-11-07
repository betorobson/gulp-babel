// import '@babel/polyfill';

const path = require('path');

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
	entry: {
		main: [
			'./dist/app.min.js'
		]
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.min.bundle.js',
		sourceMapFilename: 'app.min.js.map',
	},
	optimization: {
		minimize: false,
		minimizer: [
			// new UglifyJsPlugin({
			// 	uglifyOptions: {
			// 		mangle: false
			// 	}
			// })
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
	// plugins: [
	// 	new webpack.SourceMapDevToolPlugin({})
	// ],
	module: {
		rules: [

			// {
			// 	test: /\.js$/,
			// 	exclude: /node_modules/,
			// 	use: {
			// 		loader: 'babel-loader'
			// 	}
			// },

			// {
			// 	test: /\.js$/,
			// 	use: ['source-map-loader'],
			// 	enforce: 'pre'
			// }

		]
	}
};
