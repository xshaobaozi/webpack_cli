var MessageBus = require('../MessageBus');

/**
 * 将 model 的定义注入到 Vue 组件的定义中
 * state 注入到 data 的生成
 * events 注入到 mounted 里，用于监听 MessageBus 的消息
 */
module.exports = function InjectModel(models, app_define) {
    var old_mounted = app_define.mounted;
    var old_data = app_define.data;
    var events = [];

    var states = {};

    var namespace = '';

    for (var i = 0; i < models.length; i++) {
        namespace = models[i].namespace || '@@root';
        states[namespace] = states[namespace] || [];
        states[namespace].push(models[i].state);
        events.push(models[i].events);
    }

    function ComposedData() {
        var rootData = old_data ? old_data() : {};
        Object.keys(states).forEach((namespace) => {
            var data = (namespace === '@@root') ? rootData : (rootData[namespace] = (rootData[namespace] || {}));
            states[namespace].forEach((state) => {
                Object.assign(data, state);
            });
        });
        return rootData;
    }

    function ComposedMounted() {
        events.forEach((handlers) => {
            Object.keys(handlers).forEach((channelid) => {
                Object.keys(handlers[channelid]).forEach((subid) => {
                    var handler = handlers[channelid][subid];

                    // subid 支持用 | 分割，多个cid用同一个 handler
                    subid.split('|').forEach((cid) => {
                        MessageBus(channelid).on(cid.trim(), handler, this);
                    });
                });
            });
        });

        if (old_mounted) {
            old_mounted.call(this);
        }
    }

    app_define.data = ComposedData;
    app_define.mounted = ComposedMounted;
};