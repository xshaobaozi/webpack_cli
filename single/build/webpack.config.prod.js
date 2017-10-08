const 
    webpack = require('webpack'),
    Path = require('./base_config/basePath'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    baseConfig = require('./base_config/webpack.config.base'),
    extractTextWebpackPlugin = require('extract-text-webpack-plugin'),
    merge = require('webpack-merge'),
    CleanWebpackPlugin = require('clean-webpack-plugin');

const PLUGINS = {
    plugins: [
        new webpack.DefinePlugin({
             '__DEV__': false
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            filename: '[name].bundle.js'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            alwaysWriteToDisk: true,
            minify: {
                removeComments:false,
                collapseWhitespace:false 
            }
        }),
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