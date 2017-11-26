//import config from './common/config.js'
//if (process.env.NODE_ENV === 'development') {
    //require('./sdk-mock.js');
//}
//console.log(roomModules);
require('./common/ccapi.js');
//console.log(ccapi);

var config = {
    tcp: [
        {
            sid: 41511,
            cid: [1,2,3,4,5,6,7,8],
            alias: 'act_main'
        },
        {
            sid: 41344,
            cid: [561,562,563,564,553,554,557],
            alias: 'gamechdrum'
        }
    ],
    cgi: {
        //'act': '//game.combo.cc.163.com/gamesong/'
    },
    dev: 0 // 配置当前运行环境
};

var MessageBus = require('./MessageBus');
MessageBus.initCCapi(config);

//MessageBus['act_main'].sendMsg('1', {});

window.MessageBus = MessageBus;
/* export default MessageBus; 使用es6这个引入ie8会报错 */
module.exports = MessageBus;