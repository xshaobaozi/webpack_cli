// 判断user-agent
var browser = {
    versions: function() {
        var u = navigator.userAgent;
        return {
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1,
            weixin: u.indexOf('MicroMessenger') > -1,
            qq: u.indexOf('QQ') > -1,
            yixin: u.indexOf('yixin') > -1
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

// url查参
var urlPath = {
    query: function(name) {
        //获取url中的参数
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
};

// 对象扩展
var extend = function() {
    var _extend = function me(dest, source) {
        for (var name in dest) {
            if (dest.hasOwnProperty(name)) {
                //当前属性是否为对象,如果为对象，则进行递归
                if ((dest[name] instanceof Object) && (source[name] instanceof Object)) {
                    me(dest[name], source[name]);
                }
                //检测该属性是否存在
                if (source.hasOwnProperty(name)) {
                    continue;
                } else {
                    source[name] = dest[name];
                }
            }
        }
    };

    var _result = {},
        arr = arguments;

    if (!arr.length) return {};

    for (var i = arr.length - 1; i >= 0; i--) {
        _extend(arr[i], _result);
    }
    arr[0] = _result;
    return _result;
};

var addClass = function(obj, cls) {
    var obj_class = obj.className;
    blank = (obj_class != '') ? ' ' : '';
    var added = obj_class + blank + cls;
    obj.className = added;
};

var removeClass = function(obj, cls) {
    var obj_class = ' ' + obj.className + ' ';
    obj_class = obj_class.replace(/(\s+)/gi, ' ');
    var removed = obj_class.replace(' ' + cls + ' ', ' ');
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');
    obj.className = removed;
};

var hasClass = function(obj, cls) {
    var obj_class = obj.className;
    var obj_class_lst = obj_class.split(/\s+/);
    var x = 0;
    for (x in obj_class_lst) {
        if (obj_class_lst[x] == cls) {
            return true;
        }
    }
    return false;
};

Array.prototype.indexOf = function(obj) {
    var result = -1,
        length = this.length,
        i = length - 1;
    for (; i >= 0; i--) {
        if (this[i] == obj) {
            result = i;
            break;
        }
    }
    return result;
};

Array.prototype.contains = function(obj) {
    return (this.indexOf(obj) >= 0)
};

Array.prototype.append = function(obj, nodup) {
    if (!(nodup && this.contains(obj))) {
        this[this.length] = obj;
    }
};

Array.prototype.remove = function(obj) {
    var index = this.indexOf(obj);
    if (!index) return;
    return this.splice(index, 1);
};

var addEvent = function(element, type, fun) {
    if (!element.events) element.events = {};
    var handlers = element.events[type];
    if (!handlers) {
        handlers = element.events[type] = [];
        if (element['on' + type]) {
            handlers[0] = element['on' + type];
        }
    }
    handlers.append(fun, true);
    element['on' + type] = handleEvent;
};

var removeEvent = function(element, type, fun) {
    if (element.events && element.events[type]) {
        element.events[type].remove(fun);
    }
};

var handleEvent = function(event) {
    var returnValue = true,
        i = 0;
    event = event || fixEvent(window.event);
    var handlers = this.events[event.type],
        length = handlers.length;
    for (; i < length; i++) {
        if (handlers[i].call(this, event) === false) {
            returnValue = false;
        }
    }
    return returnValue;
};

function fixEvent(event) {
    event.preventDefault = fixEvent.preventDefault;
    event.stopPropagation = fixEvent.stopPropagation;
    return event;
}

fixEvent.preventDefault = function() {
    this.returnValue = false;
};

fixEvent.stopPropagation = function() {
    this.cancelBubble = true;
};

// $.fn.scrollTo = function(scrollTo, time) {
//     var scrollFrom = parseInt(document.body.scrollTop),
//         i = 0,
//         runEvery = 5; // run every 5ms
//     var scrollTo = parseInt(scrollTo);
//     var time = time / runEvery;
//     var interval = setInterval(function() {
//         i++;
//         document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;
//         if (i >= time) {
//             clearInterval(interval);
//         }
//     }, runEvery);
// }

// var pageDeal = {
//     hideMenu: function() {
//         if (document.getElementsByClassName('activity-menu').length) {
//             var menu = document.getElementsByClassName('activity-menu')[0];
//             var height = menu.offsetHeight;
//             setTimeout(function() {
//                 $("body").scrollTo(height, 200);
//             }, 500);
//         }
//     }
// };

const util = {
    browser: browser,
    path: urlPath,
    extend: extend,
    addClass: addClass,
    hasClass: hasClass,
    removeClass: removeClass,
    addEvent: addEvent,
    removeEvent: removeEvent,
    handleEvent: handleEvent,
    // pageDeal: pageDeal
};

export default util;
