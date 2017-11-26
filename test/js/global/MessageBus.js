/**
 * 带有兼容 PC 客户端 api 的 MessageBus.js 版本
 */
var noop = require('./helper/noop');
var normalizeUserLogo = require('./helper/normalizeUserLogo');
var getAnchorInfo = require('./helper/getAnchorInfo');
var getCurrentUserInfo = require('./helper/getCurrentUserInfo');
var alert_callback_stack = [];
var webccFun;

if (ccapi.isWebCC) {
    webccFun = window.roomModules || window.parent && window.parent.roomModules;
}

function each(array, fn) {
    for(var i = 0; i < array.length; i++) {
        fn(array[i], i);
    }
}

function registerAlertHanlder(confirm, cancel) {
    alert_callback_stack.push([confirm || noop, cancel || noop]);
}

function clientAlert(option, confirm, cancel) {
    registerAlertHanlder(confirm, cancel);
    option.complete = option.complete || function (result) { };
    ccapi.alert(option);
}

function EventBus(sid, name) {
    console.log('EventBus init', sid, name);
    this.sid = sid;
    this.name = name;
    this.messages = {};
    this.registered_callbacks = {};
}

EventBus.prototype.sendMsg = function (cid, params) {
    console.log('EventBus sendMsg',this.sid, cid,params);
    if (!this.sid) return;
    params = params || {};
    var payload = {
        sid: this.sid,
        cid: cid,
        params: params,
        complete: noop
    };
    // ICC_SendPacket
    if (config_pt.dev) {
        console.log('------ [TCP] sendMsg sid[' + this.sid + ']' + (this.name ? ' name['+ this.name +']' : '')+ ' ------');
        console.log(payload);
    }

    if (ccapi.isCCPC) {
        return external.ICC_SendPacket(this.sid, cid, JSON.stringify(params));
    }

    ccapi.sendMsg(payload);
};

EventBus.prototype.on = function (name, callback, thisArg) {
    // 如果有未读的消息就先发出
    if (this.messages[name]) {
        callback.apply(thisArg, this.messages[name]);
        this.messages[name] = null;
    }

    this.registered_callbacks[name] = this.registered_callbacks[name] || [];
    this.registered_callbacks[name].push({fn: callback, ctx: thisArg});
};

EventBus.prototype.emit = function (name/*, ...*/) {
    var args = Array.prototype.slice.call(arguments, 1);
    // 没有监听这个事件者时，缓存下这个事件
    if (!this.registered_callbacks[name]) {
        this.messages[name] = args;
    } else {
        each(this.registered_callbacks[name], function (hander) {
            hander.fn.apply(hander.ctx, args);
        });
    }
};

EventBus.prototype.sendGift = function (num) {
    var giftParams = {
        giftId: num
    }
    ccapi.sendGift(giftParams);
};

EventBus.prototype.trigger = function (type) {
    var triggerParams = {
        triggerType: type
    }
    ccapi.trigger(triggerParams);
};



function handleQiemai(data) {
    var result = {};

    if (data.data.mic.length > 0) {
        result.aid = data.data.mic[0].uid;
        result.anick = data.data.mic[0].nick;
        result.alogo = normalizeUserLogo(data.data.mic[0].ptype, data.data.mic[0].purl);
    } else {
        result.aid = null;
    }

    return result;
}

var config_pt = null;

var bus_instants = {
    main: new EventBus()
};

function initCCapi(params, type) {
    // 初始化过就不再初始化了
    if (config_pt) return;

    var pageType = type || 'activity';

    config_pt = params;

    config_pt.tcp.forEach(function (tcpDefine) {
        bus_instants[tcpDefine.sid] = new EventBus(tcpDefine.sid, tcpDefine.alias);

        if (tcpDefine.alias) {
            bus_instants[tcpDefine.alias] = bus_instants[tcpDefine.sid];
        }
    });

    ccapi.config({});
    ccapi.ready();
    ccapi.unregisterAllService({
        pageType: pageType
    });

    if (ccapi.isCCPC) {
        window.ClientCall = {
            listenMessageBack(sid, cid, state, data) {
                if (config_pt.dev) {
                    console.log('------ [TCP] [TcptoWeb] onRecvServiceData ------');
                    console.log(JSON.parse(JSON.stringify({
                        sid,
                        cid,
                        result: state,
                        data,
                    })));
                }

                if (sid === 6144 && cid === 7) {
                    bus_instants['main'].emit('qiemai', handleQiemai(data));
                } else {
                    if (state == 0) {
                        bus_instants[sid].emit('cid' + cid, data);
                    } else {
                        // 发生错误
                        bus_instants['main'].emit('error', {
                            _sid: sid,
                            _cid: cid,
                            data,
                            result: state
                        });
                        console.log(`[${sid} tcp error found]: ${state}`);
                    }
                }
            }
        };
    } else {
        ccapi.registerWebHandler('onRecvServiceData', function dispatchMsg(result) {
            var target_sid = null;

            if (typeof result === 'string') {
                result = JSON.parse(result);
            }

            for (var i = 0;i < config_pt.tcp.length; i++) {
                if (result.sid === config_pt.tcp[i].sid || result.sid === (config_pt.tcp[i].sid - 65536)) {
                    result.sid = config_pt.tcp[i].sid;
                    target_sid = result.sid;
                    break;
                }
            }

            if (config_pt.dev) {
                console.log('------ [TCP] [TcptoWeb] onRecvServiceData ------');
                console.log(JSON.parse(JSON.stringify(result)) , target_sid);
            }

            if (result.sid === 6144 && result.cid === 7 || result.sid === 517 && result.cid === 17) {
                bus_instants['main'].emit('qiemai', handleQiemai(result));
            } else if (target_sid) {
                if (result.data.result == 0) {
                    bus_instants[target_sid].emit('cid' + result.cid, result.data.data);
                } else {
                    // 发生错误
                    bus_instants['main'].emit('error', result.data);
                    console.log(`[${target_sid} tcp error found]: ${result.data.result}`);
                }
            }
        });
    }



    ccapi.registerWebHandler('onRecvWebViewData', function (result) {
        if (config_pt.dev) {
            console.log('------ [ApptoWeb] onRecvWebViewData ------');
            console.log(result);
        }
    });

    ccapi.registerWebHandler('onCallBack', function(res) {
        var result;

        if (typeof res === 'string') {
            result = JSON.parse(res);
        }

        if (config_pt.dev) {
            console.log('------ [ApptoWeb] onCallBack ------');
            console.log(result);
        }

        var listener = alert_callback_stack.pop();

        if (listener) {
            if (result && result.result && result.result.value == 1) {
                listener[0](result);
            } else {
                listener[1](result);
            }
        }
    });

    //监听上下麦信息
    ccapi.registerService({
        pageType: pageType,
        sid: 517,
        cid: 17
    });
    ccapi.registerService({
        pageType: pageType,
        sid: 6144,
        cid: 7
    });

    //注册协议
    for (var i = 0; i < config_pt.tcp.length; i++) {
        for (var j = 0; j < config_pt.tcp[i].cid.length; j++) {
            if (ccapi.isCCPC) {
                external.ICC_ListenMessage(config_pt.tcp[i].sid, config_pt.tcp[i].cid[j]);
            } else {
                ccapi.registerService({
                    pageType: pageType,
                    sid: config_pt.tcp[i].sid,
                    cid: config_pt.tcp[i].cid[j]
                });
            }
        }
    }

    getCurrentUserInfo(function(user) {
        bus_instants['main'].emit('user.update', user);
    });

    getAnchorInfo(function (anchor) {
        bus_instants['main'].emit('qiemai', anchor);
    });
}

function MessageBus(channelid) {
    channelid = channelid || 'main';
    return bus_instants[channelid];
}

MessageBus.initCCapi = initCCapi;
MessageBus.config = function (v) {
    if (config_pt) {
        config_pt.dev = !!v;
    }
};
MessageBus.clientAlert = clientAlert;

MessageBus.getJsonp = function (type, api, data, callback, thisArg) {
    MessageBus.jsonp(
        type,
        api,
        data,
        function (err, res) {
            if (res.code === 0) {
                if (res.data) {
                    callback.call(thisArg, null, res.data);
                } else {
                    callback.call(thisArg, null, res);
                }
            } else {
                callback.call(thisArg, res.code);
            }
        },
        thisArg
    );
};

MessageBus.jsonp = function (type, api, data, callback, thisArg) {
    var params = data || {};

    if (process.env.NODE_ENV === 'development' || process.env.PROJ_ENV === 'beta') {
        var getUrlParam = require('./helper/getUrlParam');
        params.test_rid = getUrlParam(location.href, 'room_id') || 0;
    }

    if (config_pt.dev) {
        console.log('------ [CGI] getCGI [' + api + '] ------');
        console.log({
            cgi: config_pt.cgi[type],
            api: api,
            params: params
        });
    }

    $.ajax({
        url: config_pt.cgi[type] + api,
        type: 'GET',
        data: params,
        cache: true,
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function (res) {
            if (config_pt.dev) {
                console.log('------ [CGI] RecvCGI' + ' [' + api + ']' + ' ------');
                console.log(JSON.parse(JSON.stringify(res)));
            }

            callback.call(thisArg, null, res);
        },
        error: function () {
            MessageBus('main').emit('alert', {text: '加载失败，请重新进入'});
        }
    });
};

module.exports = MessageBus;
