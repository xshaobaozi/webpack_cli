const fs = require('fs');
const log = require('./base_config/chalk-log');
const Path = require('./base_config/basePath');
const webpack = require('./base_config/webpack.config.base');

const prePath = webpack.output.publice;

console.log(prePath)
function fixPath(fixPath, preFix){
    const static = [{
        type: 'img',
        attr: 'src'
    },{
        type: 'link',
        attr: 'href'
    },{
        type: 'script',
        attr: 'src'
    }];

     fs.readFile(fixPath, 'utf-8', (err, data) => {
         
     })

}

fixPath(Path.output + '/index.html', prePath)