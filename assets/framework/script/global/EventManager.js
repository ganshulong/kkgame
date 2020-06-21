/*
** 事件管理器
** 因系统的事件只能冒泡处理
** 自己封装事件分发器
*/

cc.Class({
    extends: cc.Component,
    statics: {
        _listeners: null,

        //事件发送(透传后面所有参数)
        emit: function (eventName) {
            this._listeners = this._listeners || {};
            var args = [].slice.call(arguments,1);
            var listeners = this._listeners['$' + eventName];
            if (listeners) {
                listeners = listeners.slice(0);
                for (var i = listeners.length - 1; i >= 0; i--) {
                    if (listeners[i].tgt) {
                        listeners[i].cb.apply(listeners[i].tgt, args);
                    }
                    else {
                        listeners[i].cb.apply(args);
                    }
                }
            }
            cc.log('emit event (' + eventName + '): ', JSON.stringify(args));
        },

        //事件监听
        on: function (eventName, callback, target) {
            this._listeners = this._listeners || {};
            var listen = {cb:callback, tgt:target};
            (this._listeners['$' + eventName] = this._listeners['$' + eventName] || []).push(listen);
        },

        //注册事件监听处理一次，注销
        once: function (eventName, callback, target) {
            function on() {
                this.off(eventName, on);
                callback.apply(targtet, arguments);
            }
            on.fn = callback;
            this.on(eventName, on);
        },

        //注销时间
        off: function (eventName, callback) {
            this._listeners = this._listeners || {};

            // all
            if (0 == arguments.length) {
                this._listeners = {};
            }

            // specific event
            var callbacks = this._listeners['$' + eventName];
            if (!callbacks) return;

            //remove all handlers
            if (1 == arguments.length) {
                delete this._listeners['$' + eventName];
                return;
            }

            // remove specific handler
            var listen;
            for (var i=0; i < callbacks.length; i++) {
                listen = callbacks[i];
                if (listen.cb === callback || listen.cb.fn === callback) {
                    callbacks.splice(i,1);
                    break;
                }
            }
        },
    }
});
