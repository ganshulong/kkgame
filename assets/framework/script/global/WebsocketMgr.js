/**
 * 网络连接状态
 */
let NetWorkState = {
    NetWorkState_NONE:1,
    NetWorkState_CONNECTING:2,
    NetWorkState_CONNECTED:3,
    NetWorkState_ERROR:4,
    NetWorkState_CLOSE:5,
    NetWorkState_TIMEOUT:6,
    NetWorkState_MAX:7
}

cc.Class({
    extends: cc.Component,
    statics: {
        m_cDstIP: "",
        m_pSocket: null,
        m_eNetWorkState: 1,
        m_vDelegates: [],
        m_bReciveHeadMsg: false,
        m_nHeartbeatNum: -1, // 心跳包句柄
        m_nConnectNum: -1, // 重连句柄
        m_bIsSendHeard: true,
        m_vMessageCallBack: [],
        m_nConnectCount: 0,//当前连接的次数（用于判断重连的提示，比如连接三次都没连接上就提示玩家检查网络）
        m_bIsHoldClose: false,//是否是手动关闭

        m_nforgroundCount: -1,
        m_nConnectGameServerNum: -1,//连接逻辑服务器的句柄
        m_nConnectGameServerNum_1: -1,//连接逻辑服务器的句柄
        m_conectCallback:null,
        m_handleResponeDataCallBack:null,
        _timeOut:5000,
        /**
         * 连接地址
         */
        socketIP: "ws://192.168.0.127:8080",


        getSocketIP() {
            return this.socketIP;
        },


        /**
         * 设置是否自动连接
         * @param is 是否自动连接
         */
        setAutoConnect(is){
            this.m_bIsAutoConnect = is;
        },

        forgroundConnect() {
            // if (this.m_nforgroundCount != -1) {
            //     clearTimeout(this.m_nforgroundCount);
            // }
            if(cc.vv.GameManager) cc.vv.GameManager.onEnterFront();
            // this.m_nforgroundCount = setTimeout(() => {
            //     cc.vv.GameManager.onEnterFront();
            // }, 0.1);
        },

        /**
         * 应用程序进入前台
         */
        applocationEnterForeground(){
            console.log("applocationEnterForeground");
            this.forgroundConnect();

        },

        /**
         * 应用程序进入后台
         */
        applocationEnterBackground(){
            cc.vv.NetManager.send({c:MsgId.LOGIN_OUT});
            console.log("applocationEnterBackground");
            this.closeNetWork(true);
        },


        init(callback)
        {
            this.m_eNetWorkState = NetWorkState.NetWorkState_NONE;
            this.m_bReciveHeadMsg = false;
            this.m_nHeartbeatNum = -1;
            this.m_nConnectNum = -1;
            this.m_handleResponeDataCallBack = callback;
            cc.game.on(cc.game.EVENT_SHOW, this.applocationEnterForeground, this);
            cc.game.on(cc.game.EVENT_HIDE, this.applocationEnterBackground, this);
        },

        /**
         * 获取当前重连的次数
         */
        getConnectCount()
        {
            return this.m_nConnectCount;
        },

        /**
         * 返回当前网络状态
         */
        getNetWorkState()
        {
            return this.m_eNetWorkState;
        },

        /**
         * 网络是否已经连接
         */
        isConnect()
        {
            return this.getNetWorkState() == NetWorkState.NetWorkState_CONNECTED;
        },


        /**
         * 把自己添加到队列里，用于接受消息，要实现
         * public onMsg(msg: any):boolean{....}方法才能接收到消息
         * 如果你确定这个消息只在你这处理，就return true;否则return false；
         * @param delegate 需要接收消息的本身
         */
        addDelegate(delegate)
        {
            this.m_vDelegates.push(delegate);
        },

        /**
         * 把自己从队列里移除
         * @param delegate 添加时传入的对象本身
         */
        removeDelegate(delegate)
        {
            for (let idx = 0; idx < this.m_vDelegates.length; idx++) {
                if (this.m_vDelegates[idx] == delegate) {
                    this.m_vDelegates.splice(idx, 1);
                    break;
                }
            }
        },

        /**
         * 手动关闭连接
         */
        closeNetWork(isHoldClose)
        {
            this.m_cDstIP = "";
            let state = this.getNetWorkState()
            console.log("手动关闭 state : ", state);
            this.m_bIsHoldClose = isHoldClose;
            if (this.m_pSocket) {
                this.m_pSocket.onopen = () => {
                };
                this.m_pSocket.onclose = () => {
                };
                this.m_pSocket.onerror = () => {
                };
                this.m_pSocket.onmessage = () => {
                };
                this.m_pSocket.close();
            }
            this.onClose(null);
        },


        /**
         * 延时重新连接
         */
        timeOutConnect()
        {
            this.m_pSocket && this.closeNetWork(false);
             if (!this.m_bIsHoldClose) {
                if (this.m_nConnectNum != -1) {
                    clearTimeout(this.m_nConnectNum);
                }
                this.m_nConnectNum = setTimeout(() => {
                    cc.vv.GameManager.onEnterFront();
                }, 0.1);
             }
        },


        /**
         * 开始连接并赋值ip
         * @param dstIP ip ws://127.0.0.1:8080/
         * @param isSendHeard 是否发送心跳包
         * @example
         * this.connect("ws://127.0.0.1:8080/", false);
         */
        connect(dstIP, isSendHeard,conectCallback)
        {
            this.m_conectCallback = conectCallback;
            this.m_cDstIP = dstIP;
            this.m_bIsSendHeard = isSendHeard;
            return this.doConnect();
        },

        /**
         * 使用上次ip继续连接
         */
        doConnect()
        {
            if (this.getNetWorkState() == NetWorkState.NetWorkState_CONNECTED || this.getNetWorkState() == NetWorkState.NetWorkState_CONNECTING) {
                cc.error("already connect to server. state = " + this.getNetWorkState());
                return false;
            }
            if (!(this.m_cDstIP && this.m_cDstIP.length > 0)) {
                cc.error("dstIP is null.");
                return false;
            }
            this.m_bIsHoldClose = false;
            console.log("connect to server. dstIP = " + this.m_cDstIP);
            this.m_nConnectCount++;
            this.m_eNetWorkState = NetWorkState.NetWorkState_CONNECTING;
            this.m_pSocket = new WebSocket(this.m_cDstIP);
            //this.m_pSocket.binaryType = "arraybuffer";//设置发送接收二进制
            this.m_pSocket.onopen = this.onOpen.bind(this);
            this.m_pSocket.onclose = this.onClose.bind(this);
            this.m_pSocket.onerror = this.onError.bind(this);
            this.m_pSocket.onmessage = this.onMessage.bind(this);
            if (this.m_nConnectGameServerNum_1 != -1) {
                clearTimeout(this.m_nConnectGameServerNum_1);
            }
            if (this.m_nConnectNum != -1) {
                clearTimeout(this.m_nConnectNum);
            }
            this.m_nConnectGameServerNum_1 = setTimeout(() => {
                if (!this.isConnect()) {
                    this.m_pSocket && this.closeNetWork(false);
                }
            }, this._timeOut);

            return true;
        },

        onOpen(ev)
        {
            console.log(" open ");

            if (this.m_nConnectGameServerNum_1 != -1) {
                clearTimeout(this.m_nConnectGameServerNum_1);
            }

            this.m_bIsOnConnectGameServer = false;
            this.m_nConnectCount = 0;
            this.m_eNetWorkState = NetWorkState.NetWorkState_CONNECTED;
            // let pEvent = new cc.Event.EventCustom(clientDefine.clientDefine_open, true);
            // cc.systemEvent.dispatchEvent(pEvent);
            if(this.m_conectCallback) this.m_conectCallback();

            this.m_bIsSendHeard && this.doSendHeadBet();

        },

        onClose(ev)
        {
            console.log(" close ");

            if (this.m_nConnectGameServerNum_1 != -1) {
                clearTimeout(this.m_nConnectGameServerNum_1);
            }

            this.m_pSocket = null;
            this.m_eNetWorkState = NetWorkState.NetWorkState_CLOSE;
            // let pEvent = new cc.Event.EventCustom(clientDefine.clientDefine_close, true);
            // cc.systemEvent.dispatchEvent(pEvent);
            this.timeOutConnect();
        },

        onError(ev)
        {
            console.log(" error ");

            if (this.m_nConnectGameServerNum_1 != -1) {
                clearTimeout(this.m_nConnectGameServerNum_1);
            }

            this.m_eNetWorkState = NetWorkState.NetWorkState_ERROR;
            // let pEvent = new cc.Event.EventCustom(clientDefine.clientDefine_failed, true);
            // cc.systemEvent.dispatchEvent(pEvent);
        },

        onMessage(event)
        {
            this.m_handleResponeDataCallBack(event.data);
        },

        /**
         * 发送消息
         * @param msgBody 需要发送的消息
         * @param command 消息ID
         */
        sendMsg(data)
        {
            if (this.isConnect()) {
                this.m_pSocket.send(data);
                return true;
            } else {
                console.log("send msg error. state = " + this.getNetWorkState());
            }
            return false;
        },

        setReceiveHeadMsg(){
            this.m_bReciveHeadMsg = true;
        },

        /**
         * 发送心跳包
         */
        doSendHeadBet()
        {
            if (!this.isConnect()) {
                cc.error("doSendHeadBet error. netWork state = " + this.getNetWorkState());
                this.timeOutConnect();
                return;
            }
            this.m_bReciveHeadMsg = false;

            cc.vv.NetManager.sendHeartbeat();

            if (this.m_nHeartbeatNum != -1) {
                clearTimeout(this.m_nHeartbeatNum);
            }
            this.m_nHeartbeatNum = setTimeout(() => {
                if (this.m_bReciveHeadMsg) {
                    this.doSendHeadBet();
                } else {
                    this.timeOutConnect();
                }
            }, this._timeOut);
        },
    },



});
