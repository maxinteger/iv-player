var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        path: './public',
        filename: '/bundle.js'
    },
    devServer: {
        contentBase: 'public',
        inline: true,
        port: 3000,
        host: '0.0.0.0'
    },
	target: 'web',
	debug: true,
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_modules)/,
                loader: 'babel',
                query: {
                    presets: ['es2015-native-modules']
                }
            },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader') },

		]
    },
	plugins: [
		new ExtractTextPlugin('style.css', { allChunks: true }),
		/*new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),*/
	]
};
