const Webpack = require("webpack");
const Express = require('express');
const app = Express();
const path = require('path');
const log = require('./base_config/chalk-log.js');
const shell = require('shelljs');
const webpackConfig = require("./webpack.config.dev");

const webpackDevMiddleware = require('webpack-dev-middleware');
const httpProxyMiddleware = require('http-proxy-middleware');
const morgan = require('morgan');  

const devClient = path.resolve(__dirname, 'base_config/dev-client')
const config = require('./base_config/base_local_config');
const proxy = require('./base_config/proxy');

// webpackConfig.entry.main = [devClient].concat(webpackConfig.entry.main);

Object.keys(webpackConfig.entry).forEach(item => {
    webpackConfig.entry[item] = [devClient].concat(webpackConfig.entry[item]);
})

console.log(webpackConfig)
const compiler = Webpack(webpackConfig);


app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true
    }
}))

// webpack-hot-middleware
var hotMiddleware = require('webpack-hot-middleware')(compiler)

//更改文件后刷新页面
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

app.use(hotMiddleware);
Object.keys(proxy).forEach(c => {
    app.use(c, httpProxyMiddleware(proxy[c]));
});
app.use(morgan());

app.listen(config.port,function(err) {
    if(err){
        console.log(err)
    }else{
        let sin = `
                Exia，驱逐目标！ \n
                请打开下面的链接 追逐梦想吧!!!\n
                http://localhost:${config.port}`
                
        shell.exec('clear',function(){
            log(sin, 'magenta');
        });
        
    }
});