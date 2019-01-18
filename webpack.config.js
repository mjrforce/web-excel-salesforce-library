const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        polyfill: 'babel-polyfill',
        app: './src/index.js',
        'function-file': './src/function-file/function-file.js'
    },
	output: { publicPath: '/' },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: 'html-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['polyfill', 'app']
        }),
        new HtmlWebpackPlugin({
            template: './src/function-file/function-file.html',
            filename: 'function-file/function-file.html',
            chunks: ['function-file']
        }),
		new CopyWebpackPlugin([
			{ from: './src/app.css' }
		]),
		new CopyWebpackPlugin([
			{ from: './src/callback.html' }
		])
    ]
};