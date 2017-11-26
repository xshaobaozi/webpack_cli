module.exports = function PCWebViewJavascriptBridge() {
    if (window.WebViewJavascriptBridge) { return }

    // 统一客户端接口调用方式
    function callHandler(api_name/*, ...*/) {
        var args = [];
        for (var i = 1; i < arguments.length; i++) {
            args[i] = arguments[i]
        }
        var targetApi = (window.external || {})[api_name];
        var result;

        try {
            if (!targetApi) {
                return console.log(api_name + ' is not defined');
            }

            switch (args.length) {
                case 0:
                    result = targetApi();
                    break;
                case 1:
                    result = targetApi(args[0]);
                    break;
                case 2:
                    result = targetApi(args[0], args[1]);
                    break;
                case 3:
                    result = targetApi(args[0], args[1], args[2]);
                    break;
                default:
                    result = targetApi.apply(null, args);
                    break;
            }

            return result;
        } catch (e) {
            console.log(e)
        }
    }

    function registerHandler(handlerName, handler) {
        window[handlerName] = handler;
    }

    window.WebViewJavascriptBridge = {
        registerHandler: registerHandler,
        callHandler: callHandler
    };

    var readyEvent = document.createEvent('Events');
    readyEvent.initEvent('WebViewJavascriptBridgeReady');
    readyEvent.bridge = WebViewJavascriptBridge;
    document.dispatchEvent(readyEvent);
}
