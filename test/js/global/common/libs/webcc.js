//const web = window.parent;
if (/cc.163.com/.test(location.href)) {
    document.domain = '163.com';
}
const roomModules = window.roomModules || window.parent.roomModules;

const callbacks = {
    getUserStatus: [],
    getAnchorInfo: [],
    onServiceData: [],
    enterRoom: [],
    tcp: [],
    sendMsg: []
};
var onRecvServiceData = function(data) {
    var result = {
        sid: data.ccsid,
        cid: data.cccid,
        data: {
            result: typeof(data.result) === 'undefined' ? 0 : data.result,
            reason: data.reason,
            code: data.code || 0,
            data: data.data ? data.data : data
        }
    };
    //console.log('[webcc] onRecvServiceData', data, result);
    window.onRecvServiceData && window.onRecvServiceData.call(null, result);
};
var ready = false;

$(function() {
    var tmp;
    roomModules.onRoomEvent('enterroom', function() {
        //console.log("[webcc] enterroom", callbacks.enterRoom, callbacks.sendMsg);
        ready = true;
        while (callbacks.enterRoom.length) {
            tmp = callbacks.enterRoom.shift();
            tmp();
        }
        while (callbacks.sendMsg.length) {
            tmp = callbacks.sendMsg.shift();
            tmp();
        }
    });
})
const bridge = {
    unregisterAllService: function(data, complete) {
        // do nothing
    },
    /*
        pageType: pageType,
        sid: 6144,
        cid: 7
    */
    registerService: function(data) {
        // do nothing
        //console.log("[webcc] registerService wait", ready, data.sid, data.cid);
        var reg = function() {
            //console.log("[webcc] registerService", data.sid, data.cid);
            roomModules.tcp.listen(data.sid, data.cid, function(result) {
                //console.log('[webcc] tcp.listen', data.sid, data.cid, result);
                onRecvServiceData(result);
            });
        }
        ready ? reg() : callbacks.enterRoom.push(reg);
    },
    /*
    var user = {
        islogin: res.code,
    };

    if (user.islogin) {
        user.uid = parseInt(res.data.uid, 10);
        user.nickname = res.data.nickname;
        user.head = normalizeUserLogo(res.data.ptype, res.data.purl);
    }
    */
    getUserStatus: function(data, complete) {
        const info = roomModules.getUserInfo();
        //console.log('[webcc] getUserStatus',info);
        complete && complete(info ? {
            code: 1,
            data: {
                ccid: info.ccid,
                uid: info.uid,
                nickname: info.nick,
                purl: info.purl
            },
            originData: info
        } : {
            code: 0,
            data: null
        });
    },
    getAnchorInfo: function(data, complete) {
        const info = roomModules.getAnchorInfo();
        //console.log('[webcc] getAnchorInfo',info);
        complete && complete(info ? {
            code: 1,
            data: {
                uid: info.anchorId,
                nick: info.anchorName,
                purl: info.anchorPic,
            },
            originData: info
        } : {
            code: 0,
            data: null
        });
    },
    sendMsg: function(data, complete) {
        var send = function() {
            /* console.log('[webcc] sendMsg',{
                sid: data.sid,
                cid: data.cid,
                data: data.params
            },complete); */
            roomModules.tcp.send({
                sid: data.sid,
                cid: data.cid,
                data: data.params
            });
        };
        ready ? send() : callbacks.sendMsg.push(send);
        complete && complete({code: 1});
    },
    sendGift: function(data, complete) {
        var gift = function() {
            //console.log("[webcc] sendGift", data.giftId);
            roomModules.gift.send(data.giftId);
        }
        ready ? gift() : callbacks.enterRoom.push(gift);
    },
    trigger: function(event, complete) {
        var tri = function() {
            //console.log("[webcc] trigger", event);
            roomModules.emitter.trigger('gameroom_lucky_lottery', [
                {
                    type: 'lottery_end'
                }
            ]);
        }
        ready ? tri() : callbacks.enterRoom.push(tri);
    }
};

module.exports = function WebCCJavascriptBridge() {
    var enterroom = false,
        tcpHandler = {};
    if (window.WebViewJavascriptBridge) { return }

    // 统一客户端接口调用方式
    function callHandler(handlerName, data, responseCallback) {
        //this.callHandler('unregisterAllService', { pageType }, complete);
        if (bridge[handlerName]) {
            bridge[handlerName](data, responseCallback);
        }
        //console.log(arguments);
    }

    function registerHandler(handlerName, handler) {
        window[handlerName] = handler;
    }

    window.WebViewJavascriptBridge = {
        registerHandler: registerHandler,
        callHandler: callHandler
    };

    if(document.createEvent){
        var readyEvent = document.createEvent('Events');
        readyEvent.initEvent('WebViewJavascriptBridgeReady', true, false);
        readyEvent.bridge = WebViewJavascriptBridge;
        document.dispatchEvent(readyEvent);
    } else {
        document.documentElement.WebViewJavascriptBridgeReady++;
    };

    //window.addEventListener('message', (evt) => {

    //});
}
