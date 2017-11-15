const 
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    baseConfig = require('./base_config/webpack.config.base'),
    extractTextWebpackPlugin = require('extract-text-webpack-plugin'),
    merge = require('webpack-merge');
const entryList = require('./base_config/getEnter');
const Path = require('./base_config/basePath');

const HtmlWebPackPluginConfig = entryList.map(item => {
    return new HtmlWebpackPlugin({
        filename: `${item}.html`,
        template: `${Path.input}/${item}/${item}.html`,
        hash: true,
        // minify: {
        //     removeComments: true,
        //     collapseWhitespace: true,
        //     removeStyleLinkTypeAttributes: true
        // },
        chunks: [item, 'vendor']
    })
})

const PLUGINS = {
    plugins: [
        new webpack.DefinePlugin({
             '__DEV__': true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            filename: '[name].bundle.js'
        }),
        // new HtmlWebpackPlugin({
        //     filename: 'index.html',
        //     template: './src/index/index.html',
        //     minify: {
        //         removeComments:false,
        //         collapseWhitespace:false 
        //     }
        // }),
        ...HtmlWebPackPluginConfig,
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