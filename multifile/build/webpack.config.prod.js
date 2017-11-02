const webpack = require('webpack');
const Path = require('./base_config/basePath');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./base_config/webpack.config.base');
const extractTextWebpackPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const entryList = require('./base_config/getEnter');

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
        chunks: [item]
    })
})

const PLUGINS = {
    plugins: [
        new webpack.DefinePlugin({
             '__DEV__': false
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     filename: '[name]/[name].bundle.js'
        // }),
        ...HtmlWebPackPluginConfig,
        new extractTextWebpackPlugin('[name]_[contenthash:10].css'),
        new CleanWebpackPlugin(['dist'],{
            root: Path.root,
            verbose: true,
            dry: false

        })
    ]
}

const config = merge(baseConfig, PLUGINS);

module.exports = config