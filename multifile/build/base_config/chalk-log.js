const chalk = require('chalk');

module.exports = function log(txt,type){
    console.log(chalk[type](txt))
}