/*
** Manager then game net
*/
var self = null;
cc.Class({
    extends: cc.Component,

    statics: {
        _address: "", //ip:port
        _hearBeatTimeout: 5000, //超时时间5秒
        _hearBeatInterval: 5*1000, //测试修改20秒
        _lastReplyInterval: 50, //最后回复间隔(默认50毫秒)
        _curReplyInterval: 0.0, //当前回复间隔
        _ws: null, //socket对象
        _hearBeatIntervalIdx:null, //心跳索引
        _nextAutoConnectDelay:0, //下次自动连接的时间
        _autoConnectCount: 0, //自动连接次数
        _autoConnectCountMax: 5, //最大自动连接次数（最多连三次）
        _curtime:0, //记录时间
        _fnDisconnect: null, //断线回调
        _handlers: {}, //消息处理器
        _handlersHigh: {}, //高优先级消息处理器
        _Http:require('Http'),
        _msgPack:require("msgpack.min"),
        _idx:0,
        _isClose:false,
        pingSpeed: 0,
        pingTime: 0,         // ping消息发送时间
        sendPingNum:0,
        _webSocketMgr : null,

        init: function () {
            self = this;

            var myDate = new Date();
            this._webSocketMgr = require('WebsocketMgr');
            this._webSocketMgr.init(this.handleResponeData.bind(this));
            this.registerMsg(MsgId.HEARTBEAT,this.pong.bind(this));
            //维持刷新，记录时间
            //0.02秒刷新一次
        },

         //注册消息
         //bHighpriority true/false高优先级：界面注册的消息是正常优先级，数据层的应该注册高优先级。先刷数据，再刷界面
         //target : 需要多处监听的消息，fn 需不用bind(this) 而是将this 赋值给target
         //示例：cc.vv.NetManager.registerMsg(MsgId.LOGIN, this.onRcvMsgLogin, this)
        registerMsg: function (cmd, fn, target, bHighpriority) {
            if (cmd == null || cmd == undefined) {
                AppLog.warn("cmd must be not null and not undefined");
                return;
            }
            if(fn == null || fn == undefined){
                AppLog.warn("fn must be not null and not undefined");
                return
            }
            var item = {_fn:fn,_tgt:target};
           
            var cmdKey = String(cmd);
            if(bHighpriority && typeof(bHighpriority) == 'boolean') {
                //高优先级消息注册
                this._handlersHigh[cmdKey] = this._handlersHigh[cmdKey] || [];
                
                for (let i=0; i < this._handlersHigh[cmdKey].length; i++) {
                    let itemTarget = this._handlersHigh[cmdKey][i]._tgt;
                    let cb = this._handlersHigh[cmdKey][i]._fn;
                    if (cb === fn && target === itemTarget) {
                        cc.warn("The Highcmd:"+ cmd + "==>fn has registered!");
                        return;
                    }
                }
                //cc.log("registerHighMsg: ", cmd);
                this._handlersHigh[cmdKey].push(item);
            }
            else {
                this._handlers[cmdKey] = this._handlers[cmdKey] || [];
                for (var i=0; i < this._handlers[cmdKey].length; i++) {
                    var cb = this._handlers[cmdKey][i]._fn;
                    var itemTarget = this._handlers[cmdKey][i]._tgt;
                    if ( cb === fn && target === itemTarget) {
                        cc.warn("The cmd:"+ cmd +"==>fn has registered!");
                        return;
                    }
                }
                //AppLog.log("registerMsg: ", cmd);
                this._handlers[cmdKey].push(item);
            }
        },

        // 查找相同消息上挂载多个继承同一个脚本，而且注册的事件相同，这种情况不知道到底注销哪个消息
        findSameFuncAdrr(handler,fn){
            let num = 0;
            for(let i=0;i<handler.length;++i){
                if(fn === handler[i]._fn) ++num;
            }
            return num;
        },

        //注销消息
        //fn : fn的形式如this.onNectCallback就好，不能this.onNectCallback.bind(this)否则无法注销
        //示例：cc.vv.NetManager.registerMsg(MsgId.LOGIN, this.onRcvMsgLogin)
        unregisterMsg: function (cmd, fn, bHighpriority=false,target) {
            if (cmd != null && cmd != undefined) {
                var cmdKey = String(cmd);
                if(bHighpriority && typeof(bHighpriority) == 'boolean') {
                    //注销高优先级的消息回调
                    if (fn && typeof(fn) == 'function' && this._handlersHigh[cmdKey]) {
                        let num = this.findSameFuncAdrr(this._handlersHigh[cmdKey],fn);

                        for (var i=0; i < this._handlersHigh[cmdKey].length; i++) {
                            var item = this._handlersHigh[cmdKey][i]
                            if ( item._fn === fn) {
                                if(num > 1) {
                                    if(target === null || target === undefined) {
                                        AppLog.err("请传入需要注销的消息的target");
                                    }
                                    else{
                                        var itemTarget = this._handlersHigh[cmdKey][i]._tgt;
                                        if(itemTarget === target){
                                            AppLog.log("unregisterHighMsg: ", cmd , '=>function');
                                            this._handlersHigh[cmdKey].splice(i,1);
                                            break;
                                        }
                                    }
                                }
                                else{
                                    AppLog.log("unregisterHighMsg: ", cmd , '=>function');
                                    this._handlersHigh[cmdKey].splice(i,1);
                                    break;
                                }

                            }
                        }
                    }
                    else {
                        AppLog.log("unregisterMsg: ", cmd);
                        delete this._handlersHigh[cmdKey];
                    }
                }
                else {
                    if (fn && typeof(fn) == 'function' && this._handlers[cmdKey]) {
                        let num = this.findSameFuncAdrr(this._handlers[cmdKey],fn);
                        for (var i=0; i < this._handlers[cmdKey].length; i++) {
                            var item = this._handlers[cmdKey][i];
                            if ( item._fn === fn) {
                                if(num> 1) {
                                    if(target === null || target === undefined) {
                                        AppLog.err("请传入需要注销的消息的target");
                                    }
                                    else{
                                        var itemTarget = this._handlers[cmdKey][i]._tgt;
                                        if(itemTarget === target){
                                            AppLog.log("unregisterHighMsg: ", cmd , '=>function');
                                            this._handlers[cmdKey].splice(i,1);
                                            break;
                                        }
                                    }
                                }
                                else{
                                    AppLog.log("unregisterHighMsg: ", cmd , '=>function');
                                    this._handlers[cmdKey].splice(i,1);
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        AppLog.log("unregisterMsg: ", cmd);
                        delete this._handlers[cmdKey];
                    }
                }
            }
        },

        //分发网络消息
        dispatchNetMsg: function (msg) {
            if (typeof(msg) == 'string') {
                msg = JSON.parse(msg);
            }
            this.handleMsg(msg);
            AppLog.log('客户端主动分发网络消息', JSON.stringify(msg));
        },

        //处理消息
        handleMsg: function (msgDic) {
            var cmd = msgDic.c
            if (cmd){
                var cmdKey = String(cmd);

                //优先处理高优先级的消息回调
                var cmdHandlersHigh = this._handlersHigh[cmdKey];
                if (cmdHandlersHigh) {
                    for (var i = cmdHandlersHigh.length - 1; i >= 0; i--) {
                        var item = cmdHandlersHigh[i]
                        if(item._tgt){
                            var cb = item._fn.bind(item._tgt)
                            if (cb(msgDic)) break; //若返回了true，则表示处理完成，不续传其他地方处理。
                        }
                        else{
                            if (item._fn(msgDic)) break; //若返回了true，则表示处理完成，不续传其他地方处理。
                        }
                        
                    }
                }
                
                var cmdHandlers = this._handlers[cmdKey];
                if (!cmdHandlers) {
                    if(!cmdHandlersHigh){ //高优先级的已经注册了，这里可以不用提示
                        AppLog.warn('Received msg cmd:' + (cmd) + ' has no handlers');
                    }
                    return;
                }
                for (var i = cmdHandlers.length - 1; i >= 0; i--) {
                    var item = cmdHandlers[i]
                    if(item._tgt){
                        var cb = item._fn.bind(item._tgt)
                        if (cb(msgDic)) break; //若返回了true，则表示处理完成，不续传其他地方处理。
                    }
                    else{
                        if (item._fn(msgDic)) break; //若返回了true，则表示处理完成，不续传其他地方处理。
                    }
                }

                if (msgDic.c != MsgId.HEARTBEAT && cc.vv.LoadingTip) { //隐藏屏蔽
                    cc.vv.LoadingTip.hide(0.5);
                }
                if(msgDic.code && msgDic.code != 200 && msgDic.code != 20000) {  //200正常处理，20000不予处理
                    if (!this.handleCommonErrorCode(msgDic.code)) {
                        if(msgDic.code===203)  Global.dispatchEvent(EventId.RELOGIN);
                        // 提示需要更新
                        if(msgDic.code === 214 ){
                            cc.vv.AlertView.showTips(cc.vv.Language[Global.code[msgDic.code.toString()]], function () {
                                Global.dispatchEvent(EventId.STOP_ACTION);
                                cc.vv.NetManager.close();
                                if(Global.isNative())cc.vv.SceneMgr.enterScene("hotupdate");
                            }.bind(this));
                        }
                        else{
                            if(cc.vv.Language[Global.code[msgDic.code.toString()]])
                                cc.vv.FloatTip.show(cc.vv.Language[Global.code[msgDic.code.toString()]]);
                            else{
                                let str = Global.code[msgDic.code.toString()];
                                if(str) cc.vv.FloatTip.show(str);
                                else cc.vv.FloatTip.show("error code:" + msgDic.code.toString());
                            }
                        }
                    }
                }
            }
            else {
                AppLog.warn('Received msg is has not the cmd！');
            }
        },

        //处理常用错误码
        handleCommonErrorCode: function ( errorCode ) {
            switch (errorCode) {
                case 415: //需要重新登录
                    cc.vv.FloatTip.show(cc.vv.Language.reconnect);
                    cc.vv.GameManager.reqReLogin(); //用户重登录登录服
                    break;
                case 500:
                    cc.vv.AlertView.show(cc.vv.Language.login_fail_again, ()=>{
                        // cc.vv.FloatTip.show("重新连接中...");
                        cc.vv.GameManager.reqReLogin(); //用户重登录登录服
                    }, ()=>{
                        Global.dispatchEvent(EventId.STOP_ACTION);
                        cc.vv.SceneMgr.enterScene('login', ()=>{
                            this.close(); //关闭网络
                        });
                    });
                    break;
                case 801: //必须重启
                    cc.vv.AlertView.showTips(cc.vv.Language.new_ver, () => {
                        cc.audioEngine.stopAll();
                        cc.game.restart();
                    });
                    break;
                case 803: //游戏维护中
                    this.no_need_reconnect = true //不需要重连了
                    Global.dispatchEvent(EventId.STOP_ACTION);
                    //
                    let curScene = cc.director.getScene()
                    if(curScene.name != 'login'){
                        cc.vv.GameManager.goBackLoginScene();
                        cc.vv.AlertView.showTips(cc.vv.Language.system_maintenance_tips);
                    }
                    else{
                        this.close()
                        cc.vv.AlertView.showTips(cc.vv.Language.system_maintenance_tips);
                    }
                   
                    break;
                case 804: //金币不足
                    Global.showAd();
                    Global.dispatchEvent(EventId.SHOW_SHOP);
                    break;
                case 211: //token无效 要重新登录
                    cc.vv.UserManager.setIsAutoLogin(false);
                    Global.dispatchEvent(EventId.RELOGIN);
                    cc.vv.AlertView.showTips(cc.vv.Language.invalid_token,()=>{
                        
                        cc.vv.SceneMgr.enterScene('login',()=>{
                            this.close();
                        })
                        
                        
                    });
                    break;
                // 账号密码不对
                case 425:
                case 203:
                    cc.vv.GameManager.clearLocalSaveAccout();
                    cc.vv.FloatTip.show(cc.vv.Language.err_id_psw);
                    break;
                case 931: //房间不存在，需要重连恢复正常
                    cc.vv.GameManager.reqReLogin();
                    break;    
                default:
                    return false; //表示未处理
                    break;
            };
            return true; //表示已处理
        },

        //处理回复数据(暂时没有考虑粘包的问题)
        handleResponeData: function (msgData) {

            var decodeArrayBuff = function (arrayBuf) {
                var dataview = new DataView(arrayBuf)
                var size = dataview.getUint8(0)*256 + dataview.getUint8(1);
                var headSize = 8;
                var uint8Array = new Uint8Array(arrayBuf.byteLength - headSize);

                for (var i = 0; i < uint8Array.length; i++) {
                    uint8Array[i] = dataview.getUint8(headSize + i);
                }

                var msgDic = self._msgPack.decode(uint8Array);
                if (Global.localVersion) {
                    //msgDic.cmd0x = msgDic.cmd.toString(16);
                    let  str = JSON.stringify(msgDic);
                    //cc.warn("Recieved: ", str);
                    str = str.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
                    AppLog.log("Recieved: ", str);
                }
                self.handleMsg(JSON.parse(msgDic));
                dataview = null; //释放对象
                uint8Array = null; //释放对象
            };

            if (window.FileReader && msgData instanceof Blob) {
                var reader = new FileReader();
                reader.addEventListener('loadend', function () {
                    decodeArrayBuff(reader.result);
                });
                reader.readAsArrayBuffer(msgData); //data是Blob类型数据;
            }
            else {
                AppLog.warn('Not supported FileReader by your browser or devices');
                decodeArrayBuff(msgData);
            }
        },

        //连接
        connect: function (serverAddress, callback) {
            var wsHead = 'ws://'
            let bUse = Global.isUserWSS()
            if(bUse){
                wsHead = 'wss://'
            }
            let adr = "";
            if(Global.isAndroid() && bUse){
                //android原生平台如果用wss的话，必须要传后两个参数，不然链接不上服务器
                //至于这个pem，我也是网上下载的。。。
                adr = wsHead + serverAddress + '/ws',[],cc.url.raw("resources/common/cert.pem");
            }
            else{
                adr = wsHead + serverAddress + '/ws';
            }
            this._webSocketMgr.connect(adr,true,callback);

            AppLog.log('连接服务' + this._address + '中...');
            cc.vv.LoadingTip.show(cc.vv.Language.network_connecting);
        },

        pong(){
            this._webSocketMgr.setReceiveHeadMsg();
        },

        isConnect()
        {
            return this._webSocketMgr.isConnect();
        },

        close(){
           this._webSocketMgr.closeNetWork(true);
        },
        // 获取ping等级
        getPingLevel:function()
        {
            if(this.pingSpeed == -1)
            {
                return 0 ;
            }
            else if(this.pingSpeed<50)
            {
                return 4;
            }
            else if(this.pingSpeed<150)
            {
                return 3;
            }
            else if(this.pingSpeed<300)
            {
                return 2;
            }
            else if(this.pingSpeed<500)
            {
                return 1;
            }
            else
            {
                return 0;
            }
            this.pingSpeed = -1;
        },

        sendHeartbeat(){
            this.send({'c':MsgId.HEARTBEAT}, true);
        },

        //发送消息
        send: function (msgDic, isNotShowShield=false) {
            if (this._webSocketMgr.getNetWorkState()==3) {
                if (msgDic != null && (typeof(msgDic) == 'string')) {
                    msgDic = JSON.parse(msgDic);
                    if (msgDic.c == null) {
                        AppLog.warn('The msg msgDic is lost cmd');
                        return;
                    }
                }
                msgDic.c_idx = this._idx++  //客户端记录的消息序号
                if (Global.playerData.uid) msgDic.uid = Global.playerData.uid;
                if (Global.localVersion) {
                    let  str = JSON.stringify(msgDic);
                    str = str.replace(/[\'\\\/\b\f\n\r\t]/g, '');
                    AppLog.log("send:: ", str);
                }
                

                var bodyData = this.pack(JSON.stringify(msgDic)); //实际是返回一个uint8Array
                var headData = this.generateHead(bodyData);
                var uint8Array = this.linkHeadBody(headData,bodyData);
                this._webSocketMgr.sendMsg(uint8Array);
                uint8Array = null; //释放对象

                // if (!isNotShowShield) {
                //     cc.vv.LoadingTip.show();
                // }
            }
            else {
                AppLog.warn('The WebSocket is not connected!');
            }
        },

        //发送Http请求
        requestHttp: function (path, data, handler, extraUrl,type="GET") {
            this._Http.sendReq(path, data, handler, extraUrl,type)
        },

        //数据打包
        pack: function (msgDic) {
            var bodyData = this._msgPack.encode(msgDic);
            return bodyData;
        },

        generateHead: function (bodyData) {
            var msgLen = bodyData.length;
            var len = Global.jsToCByShort(msgLen);
            var time = Global.jsToCByInt(Math.floor(this._curtime/1000)); //毫秒转秒
            var cmd = Global.jsToCByShort(bodyData.c);
            var checkSum = this.getCheckSum(time + cmd, msgLen, bodyData);

            var headData = "" + len + checkSum + time;
            return headData;
        },

        linkHeadBody: function (headData, bodyDataBuf) {
            var headLen = headData.length;
            var bodyLen = bodyDataBuf.length;
            var uint8Array = new Uint8Array(headLen + bodyLen);
            for (var i=0; i < headLen; i++) {
                uint8Array[i] = headData.charCodeAt(i)
            }
            for (var i=0; i < bodyLen; i++) {
                uint8Array[headLen + i] = bodyDataBuf[i];
            }
            return uint8Array
        },

        getCheckSum: function (time, msgLen, bodyData) {
            var src = '';
            var len = time.length + msgLen;
            if (len < 128) {
                src = Global.srcSum(time + bodyData, len);
            }
            else {
                src = Global.srcSum(time + bodyData, 128);
            }
            return Global.jsToCByShort(src)
        },

        //网络信号延迟时间间隔
        getNetworkInterval: function () {
            return this._lastReplyInterval;
        },

        //网络信号强弱等级(分4级别：0无信号 1弱 2有延迟 3很好)
        getNetworkLevel: function () {
            var networkLv = 0;
            if (this._lastReplyInterval <= 100) {
                networkLv = 3;
            }
            else if (this._lastReplyInterval <= 500) {
                networkLv = 2;
            }
            else if (this._lastReplyInterval <= 1000) {
                networkLv = 1;
            }
            return networkLv;
        },
    },
});
