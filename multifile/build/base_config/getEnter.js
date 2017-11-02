const PATH = require('./basePath');
const fs = require('fs');

const arr = fs.readdirSync(PATH.input);
const list = [];

arr.forEach(item => {
    const stat = fs.statSync(`${PATH.input}/${item}`);
    if(stat.isDirectory()){
        list.push(item)
    }
})

module.exports = list;