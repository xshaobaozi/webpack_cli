module.exports = function AndroidWebViewJavascriptBridge() {
    if (window.WebViewJavascriptBridge) { return; }

    var messageHandlers = {};
    var responseCallbacks = {};
    var uniqueId = 1;

    window.WebViewJavascriptBridge = {
        registerHandler: registerHandler,
        callHandler: callHandler,
        _handleMessageFromJava: _handleMessageFromJava
    };

    function registerHandler(handlerName, handler) {
        messageHandlers[handlerName] = handler;
    }

    function callHandler(handlerName, data, responseCallback) {
        _doSend({ handlerName: handlerName, data: data }, responseCallback);
    }

    function _doSend(message, responseCallback) {
        if (responseCallback) {
            var callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime();
            responseCallbacks[callbackId] = responseCallback;
            message['callbackId'] = callbackId;
        }

        if (window._WebViewJavascriptBridge) {
            _WebViewJavascriptBridge._handleMessageFromJs(JSON.stringify(message.data) || null, message.responseId || null,
                message.responseData || null, message.callbackId || null, message.handlerName || null);
        }
    }

    function _parseResponseData(data) {
        return typeof data == 'string' ? JSON.parse(data) : data;
    }

    function _dispatchMessageFromJava(messageJSON) {
        var message = JSON.parse(messageJSON);
        var messageHandler;
        var responseCallback;

        if (message.responseId) {
            responseCallback = responseCallbacks[message.responseId];
            if (!responseCallback) { return; }

            responseCallback(_parseResponseData(message.responseData));
            delete responseCallbacks[message.responseId];
        } else {
            if (message.callbackId) {
                var callbackResponseId = message.callbackId;
                responseCallback = function(responseData) {
                    _doSend({ responseId: callbackResponseId, responseData: _parseResponseData(responseData) });
                };
            }

            var handler = messageHandlers[message.handlerName];

            if (!handler) {
                console.log('WebViewJavascriptBridge: WARNING: no handler for message from native: ', message);
            } else {
                handler(message.data, responseCallback);
            }
        }
    }

    function _handleMessageFromJava(messageJSON) {
        _dispatchMessageFromJava(messageJSON);
    }

    var readyEvent = document.createEvent('Events');
    readyEvent.initEvent('WebViewJavascriptBridgeReady', true, false);
    readyEvent.bridge = window.WebViewJavascriptBridge;
    document.dispatchEvent(readyEvent);
}
