const
    extractTextWebpackPlugin = require('extract-text-webpack-plugin'),
    autoprefixer = require('autoprefixer'),
    Path = require('./basePath');

const config = {
    entry: {
        main: [Path.input + '/js/index.js']
    },
    output: {
        path: Path.output,
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: ['css-hot-loader'].concat(extractTextWebpackPlugin.extract({
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
                                options: {
                                    plugins: [
                                        autoprefixer({
                                            browsers: [
                                                'Android >= 4',
                                                'Chrome >= 30',
                                                'iOS >= 6',
                                                'ie>=6',
                                                'Firefox >= 20',
                                                'Safari >= 5'
                                            ]
                                        })
                                    ]
                                }
                            },
                            'sass-loader'
                        ],
                    })
                )
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: './images/[hash:8].[name].[ext]'
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: './fonts/[hash:8].[name].[ext]'
                    }
                }
            },
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "babel-loader" 
            },
        ]
    }
}

module.exports = config