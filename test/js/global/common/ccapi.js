var WebCCJavascriptBridge = require('./libs/webcc');

let isWebCC = /[\?\&](moduleid=.+|w_from=webcc)/.test(location.href);
let roomModules;

function noop() {}

function FakeWebViewJavascriptBridge() {
    window.WebViewJavascriptBridge = {
        registerHandler: noop,
        callHandler: noop
    };
    if(document.createEvent){
        var readyEvent = document.createEvent('Events');
        readyEvent.initEvent('WebViewJavascriptBridgeReady', true, false);
        readyEvent.bridge = window.WebViewJavascriptBridge;
        document.dispatchEvent(readyEvent);
    } else {
        document.documentElement.WebViewJavascriptBridgeReady++;
    };
}

roomModules = window.parent && window.parent.roomModules;
//console.log('isCCPC', isCCPC, roomModules);
isWebCC = roomModules || false;
WebCCJavascriptBridge();
// 不支持的环境下使用个假的对象
isWebCC || FakeWebViewJavascriptBridge();


class CCAPI {
    constructor() {
        this.debug = false;
        this.bridge = window.WebViewJavascriptBridge;
    }

    config(options) {
        this.debug = options.debug;
    }

    ready(callback) {
        if (!callback) return;
        var self = this;

        function readyListener(event) {
            callback(event.bridge);
            self.bridge = event.bridge;
            document.removeEventListener('WebViewJavascriptBridgeReady', readyListener, false);
        }

        if (window.WebViewJavascriptBridge) {
            callback(window.WebViewJavascriptBridge);
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', readyListener, false);
        }
    }

    callHandler(handerName, data, responseCallback) {
        return this.bridge.callHandler(handerName, data, (response) => {
            if (responseCallback) {
                responseCallback(response);
            }
        });
    }

    registerWebHandler(handlerName, handler) {
        this.bridge.registerHandler(handlerName, handler);
    }

    // apis

    // 2.2 取消客户端App广播服务接口
    unregisterAllService({ pageType = '', complete = null}) {
        this.callHandler('unregisterAllService', { pageType }, complete);
    }

    // 2.1 注册客户端App广播服务接口
    registerService({ pageType = '', sid = 0, cid = 0, complete = null}) {
        //console.log(arguments);
        this.callHandler('registerService', { pageType, sid, cid }, complete);
    }

    // 2.4 发送TCP消息给服务端接口
    sendMsg({ sid = 0, cid = 0, params = {}, complete = null }) {
        this.callHandler('sendMsg', { sid, cid, params }, complete);
    }

    // 2.3 弹出/关闭原生键盘接口
    showKeyboard({ show = true, complete = null }) {
        this.callHandler('showKeyboard', { show }, complete);
    }

    // 3.1 获取当前登录用户状态接口
    getUserStatus({ complete = null }) {
        this.callHandler('getUserStatus', {}, complete);
    }

    // 3.2 刷新用户背包接口
    refreshPackage({ complete = null }) {
        this.callHandler('refreshPackage', {}, complete);
    }

    // 3.2 用户送礼接口
    sendGift({
        giftId = '0',
        count = 0,
        anchorUid = '0',
        activityId = '0',
        activityName = 'null',
        activityLocation = 'null',
        complete = null
    }) {
        this.callHandler('sendGift', {giftId, count, anchorUid, activityId, activityName, activityLocation}, complete);
    }

    // 1.0 通知webcc
    trigger({
        triggerType = 'lottery_end',
        complete = null
    }) {
        this.callHandler('trigger', {triggerType}, complete);
    }

    // 4.1 获取当前房间主播信息接口
    getAnchorInfo({ complete = null }) {
        this.callHandler('getAnchorInfo', {}, complete);
    }

    // 4.2 弹出活动送礼面板接口, cfg中有活动id，活动名称，是否横幅
    showGiftBoard({
        activityId = '0',
        activityName = 'null',
        activityLocation = 'null',
        complete = null
    }) {
        this.callHandler('showGiftBoard', {activityId, activityName, activityLocation}, complete);
    }

    // 4.2 弹出所有礼物面板接口
    showGiftDialog({
        activityId = '0',
        activityName = 'null',
        activityLocation = 'null',
        complete = null
    }) {
        this.callHandler('showGiftDialog', {activityId, activityName, activityLocation}, complete);
    }

    // 4.3 公屏活动插件跳转到指定活动接口
    jumpActivityPage({
        activityId = '0',
        complete = null
    }) {
        this.callHandler('jumpActivityPage', { activityId }, complete);
    }

    // 4.4 弹出登录面板
    showLoginView({
        complete = null
    }) {
        this.callHandler('showLoginView', {}, complete);
    }

    // 4.5 插件页跳转活动部分接口
    jumpPage({
        url = '',
        complete = null
    }) {
        this.callHandler('jumpPage', { url }, complete);
    }

    // 4.6 弹出原生弹窗
    alert({
        text = '',
        btn1 = '确定',
        btn2,
        complete = null
    }) {
        this.callHandler('alert', { text, btn1, btn2 }, complete);
    }

    // 4.7 一键分享页面
    sharePage({
        url,
        title,
        desc,
        complete = null
    }) {
        this.callHandler('sharePage', { url, title, desc }, complete);
    }

    // 4.8 获取当前显示的tab
    isPageBlur({
        complete = null
    }) {
        this.callHandler('isPageBlur', {}, complete);
    }

    // 4.9 插件页跳转全屏页
    openPage({
        url,
        complete = null
    }) {
        this.callHandler('openPage', { url }, complete);
    }

    // 4.10 插件页跳转活动页（新）
    openActivityPage({
        url,
        complete = null
    }) {
        this.callHandler('openActivityPage', { url }, complete);
    }

    // 5.1 获取设备系统信息接口
    getDeviceInfo({
        complete = null
    }) {
        this.callHandler('getDeviceInfo', {  }, complete);
    }

    // 6.1 强制刷新当前网页接口
    refreshPage({
        complete = null
    }) {
        this.callHandler('refreshPage', {  }, complete);
    }

    // 7.1 获取CC版本信息
    getVersion({
        complete = null
    }) {
        this.callHandler('getVersion', {  }, complete);
    }

    // webcc 登录框
    showLoginWin({
        complete = null
    }){
        this.callHandler('showLoginWin', {  }, complete);
    }
}

const ccapi = new CCAPI();

ccapi.isWebCC = isWebCC;
ccapi.roomModules = roomModules;
window.ccapi = ccapi;

module.exports = ccapi;
