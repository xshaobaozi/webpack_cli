const 
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    baseConfig = require('./base_config/webpack.config.base'),
    extractTextWebpackPlugin = require('extract-text-webpack-plugin'),
    merge = require('webpack-merge');

const PLUGINS = {
    plugins: [
        new webpack.DefinePlugin({
             '__DEV__': true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            filename: '[name].bundle.js'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            minify: {
                removeComments:false,
                collapseWhitespace:false 
            }
        }),
        new extractTextWebpackPlugin({
            filename: '[name].[contenthash].css'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.NoErrorsPlugin()
    ]
}

const config = merge(baseConfig, PLUGINS);

module.exports = config