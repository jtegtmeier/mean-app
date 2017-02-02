'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.npm_lifecycle_event;
const isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {

    let config = {};

    if (isProd) {
        config.entry = [
            './src/app/app.js'
        ];
    }
    else {
        config.entry = [
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
            './src/app/app.js'
        ];
    }

    config.output = {
        path: __dirname + '/dist',
        publicPath: 'https://mean-app-jtegtmeier.c9users.io:8080/',
        filename: isProd ? '[name].[hash].js' : '[name].bundle.js',
        chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
    };

    config.devtool = isProd ? 'source-map' : 'eval-source-map';

    config.module = {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader?presets[]=es2015'
        }, {
            test: /\.scss$/,
            loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        }, {
            test: /\.css$/,
            loader: ['style-loader', 'css-loader', 'postcss-loader']
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'file-loader'
        }, {
            test: /\.html$/,
            loader: 'raw-loader'
        }]
    };

    config.plugins = [
        new HtmlWebpackPlugin({
            template: './src/public/index.html',
            inject: 'body'
        }),
        new webpack.NoEmitOnErrorsPlugin()
    ];

    if (!isProd) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin())
    }

    config.devServer = {
        contentBase: './src/public',
        stats: 'minimal'
    };

    return config;
}();
