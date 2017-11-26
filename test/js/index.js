//插件
// const Pagination = require('./global/helper/Pagination.js');
// require('./global/jquery.jscrollpane.min');
// require('./global/jquery.mousewheel');
// require('./js/global/tiger_game.js');
// const SDK = require('./global/sdk.js');)

require('./global/arttemplate');
require('./common/filters');
require("./../style/index.scss");

const Racequiz_modules = require('./modules/racequiz');
const Lottery_modules = require('./modules/lottery');
const Schedule_modules = require('./modules/schedule');
const Girl_modules = require('./modules/girl');
const Teamlist_modules = require('./modules/teamlist');

const util = require('./common/util');
const { getUrlParam, isIE } = util;

window.onload = init;

function init() {
    //判断是否开发环境
    const isPro = (location.host === 'cc.163.com');
    const _win = window;
    const href = _win.location.href;
    const iframeId = getUrlParam(href, 'moduleid');
    const h = $(document).height();
    const roomModules = {} || _win.parent.roomModules;
    const parentDoc = $(_win.parent.document);
    const iframe = parentDoc.find('#'+ iframeId);

    //不知道干嘛用的
    const gue = {};
    
    setConsole();
    if(isIE() < 9){
        setIframeH(483);
        $('.guess-btn-list, .guess-p').addClass('hide');
        $('.guess-cons-main')
            .find('ul')
            .html('<li class="noData">本页面暂不兼容ie8，请用chrome或者火狐浏览器</li>');
    }else {
        const racequiz = new Racequiz_modules();
        const lottery = new Lottery_modules();
        const schedule = new Schedule_modules();
        const teamlist = new Teamlist_modules();
        const girl = new Girl_modules();
    }

    //what? 房间信息 设置全局方法
    // _win.roomModules = {} || _win.parent.roomModules;
    // setIframeH(h);

    //设置iframe高度
    function setIframeH(h) {
        iframe.css({'height': h});
    }
    //改写console
    function setConsole() {
        //判断host改写console.log函数 what？
        if(location.host === 'cc.163.com'){
            if(!window.console){
                window.console = {log : function(){}};
            }else{
                window.console.log = function(){};
            }
        }else{
            if(!window.console){
                window.console = {log : function(){}};
            }
        };
    }
}
