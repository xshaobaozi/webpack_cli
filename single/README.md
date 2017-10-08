# WebPack插件

clean-webpack-plugin 
    编译的时候删除文件
css-hot-loader
    暂时不明
css-loader
    允许使用这种方法导入文件
    import css from 'file.css';
expose-loader
    允许把第三方库加入webpack的编译
    ```
        module: {
            loaders: [
                { 
                    test: require.resolve("jquery"), 
                    loader: "expose-loader?$!expose-loader?jQuery" 
                },
            ]
        }
    ```
express
    web框架
extract-text-webpack-plugin
    把文本从包从提取出来
    通常用于把css从js中提取出来
    ```
        use:指需要什么样的loader去编译文件,这里由于源文件是.css所以选择css-loader
        fallback:编译后用什么loader来提取css文件
        publicfile:用来覆盖项目路径,生成该css文件的文件路径
    ```
file-loader
    指示webpack将所需对象作为文件发出，并返回其公共URL
    ```
        import img from './file.png'
        rules: [
        {
            test: /\.(png|jpg|gif)$/,
            use: [
            {
                loader: 'file-loader',
                options: {}  
            }
            ]
        }
        ]
    ```
html-loader
    把html文件压缩
    貌似还有其他很吊的功能 待研究
html-webpack-plugin
    帮你生成一个html文件
    或者 多个入口
    ```
        var webpackConfig = {
            entry: 'index.js',
            output: {
                path: __dirname + '/dist',
                filename: 'index_bundle.js'
            },
            plugins: [new HtmlWebpackPlugin()]
        };

        new HtmlWebpackPlugin(), // Generates default index.html
        new HtmlWebpackPlugin({  // Also generate a test.html
        filename: 'test.html',
        template: 'src/assets/test.html'
        })
    ```
node-sass
    大概就是一个能帮你快速编译sass的工具?
postcss-loader
    ```
        就是post-css
    ```
sass-loader
    就是sass的loader
shelljs
    ```
        就是让你可以用js写shell
    ```
source-map
    排查问题的时候 可以使用源代码
style-loader
    添加link标签到html
url-loader
    把文件转换为base64
webpack-dev-middleware
    中间件
    只用于开发
webpack-dev-server
    使用webpack与提供实时重新加载的开发服务器。这只能用于开发。
    它使用webpack-dev-middleware，它提供了对webpack资源的快速内存访问
webpack-hot-middleware
    热更新中间件
webpack-merge
    合并webpack配置
http-proxy-middleware
    http代理
connect-history-api-fallback
    根据请求更改页面
morgan
    http请求记录器