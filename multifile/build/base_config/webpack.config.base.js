const extractTextWebpackPlugin = require('extract-text-webpack-plugin');
const Path = require('./basePath');
const autoprefixer = require('autoprefixer');
let entryList = require('./getEnter');

let entry = {};
const imageLoader = [];

entryList.forEach(item => {
    entry[item] = [`${Path.input}/${item}/js/${item}.js`];
    imageLoader.push({
        test: eval(`/\\/${item}[\\/|\\D|\\d]*\\.(jpe?g|png|gif|svg)$/`),
        use: {
            loader: 'url-loader',
            options: {
                limit: 8192,
                // name: `./${item}/images/[hash:8].[name].[ext]`
                name: `./images/${item}/[hash:8].[name].[ext]`
            }
        }
    })
});
const config = {
    entry: entry,
    output: {
        path: Path.output,
        filename: '[name]_[hash:10].js',
        publice: 'www.qiniu.com'
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: extractTextWebpackPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
                                    importLoaders: 1
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: (require('./postcss.config.js'))
                            },
                            'sass-loader'
                        ],
                    })
                
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: './[name]/fonts/[hash:8].[name].[ext]'
                    }
                }
            },
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "babel-loader" 
            },
            ...imageLoader
        ]
    }
}

module.exports = config