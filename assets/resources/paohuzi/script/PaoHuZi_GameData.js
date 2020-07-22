// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        _deskInfo:null,
        _seatIndex:-1,
        _playerNum:3,           // 每局玩的人数限制
        _actionTime:0.3,         // 动画时间
    },

    // onLoad () {},

    clear(){
        this.unregisterMsg();
        cc.vv.gameData = null;
    },

    getActionTime(){
        return this._actionTime;
    },

    // 座位转换
    getLocalChair:function(index){
        var seatIndex = this._seatIndex;
        if(seatIndex == -1)
        {
            seatIndex = 0;
        }
        var ret = (index - seatIndex + this._playerNum) % this._playerNum;
        return ret;
    },

    getUISeatBylocalSeat(localSeat){
        let localSeatToUISeatArr = [[-1,-1,-1,-1],[-1,-1,-1,-1],[0,1,-1,-1],[0,1,2,-1],[-1,-1,-1,-1]];
        let maxSeat = cc.vv.gameData.getRoomConf().seat;
        return localSeatToUISeatArr[maxSeat][localSeat];
    },

    init(data){
        this.OPERATETYPE={
            GU0:1,  // 过
            PUT:2,  // 打牌
            MOPAI:3,// 摸牌
            CHI:4,  // 吃
            PENG:5, // 碰
            KAN:6,  // 坎
            LONG:8, // 踢龙
            SHE:9,  // 蛇
            PAO:7,
            HU:10,
            PENGSAN:11, // 碰三
            KANSAN:12,  // 坎三
            PENGSI:13, // 碰四
            KANSI:14,  // 坎四
            CHI_LUO:15,  // 吃落
        },

        this.registerMsg();
        this._deskInfo = data;
        // 快速场
        if(this._deskInfo.conf.speed===1){
            this._actionTime = 0.15;
        }
        this._playerNum = this._deskInfo.conf.seat;
        for(let i=0;i<this._deskInfo.users.length;++i){
            if(this._deskInfo.users[i].uid === cc.vv.UserManager.uid){
                this._seatIndex = this._deskInfo.users[i].seat;
                break;
            }
        }
    },

    getPlayerNum(){
        return this._playerNum;
    },

    registerMsg() {
        cc.vv.NetManager.registerMsg(MsgId.GAME_LEVELROOM, this.onRcvNetExitRoom, this); //退出房间
        cc.vv.NetManager.registerMsg(MsgId.GAME_RECONNECT_DESKINFO, this.onRecvNetReconnectDeskinfo, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_KICK, this.onRcvNetKickNotice, this);
        //财富改变（金币改变）
        cc.vv.NetManager.registerMsg(MsgId.MONEY_CHANGED, this.onRcvNetMoneyChanged, this);
        cc.vv.NetManager.registerMsg(MsgId.SENDCARD, this.onRcvHandCard, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_OUTCARD, this.onRcvOutCardNotify, this);

        cc.vv.NetManager.registerMsg(MsgId.NOTICE_PLAYER_ENTER, this.onRcvPlayerComeNotice, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTICE_PLAYER_EXIT, this.onRcvPlayerExitNotice, this);
        cc.vv.NetManager.registerMsg(MsgId.OUTCARD, this.onRcvOutCardReslut, this);

        cc.vv.NetManager.registerMsg(MsgId.CHI, this.onRcvChiResult, this);
        cc.vv.NetManager.registerMsg(MsgId.PENG, this.onRcvPengResult, this);
        cc.vv.NetManager.registerMsg(MsgId.GUO, this.onRcvGuoResult, this);

        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HZ_PAO, this.onRcvPaoNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HZ_KAN, this.onRcvKanNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HZ_TILONG, this.onRcvLongNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_CHI, this.onRcvChiNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_PENG, this.onRcvPengNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_NOTIFY_GUO, this.onRcvGuoNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_MOPAI, this.onRcvMoPaiNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HU, this.onRcvHuNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_GAME_OVER, this.onRcvGameOverNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.CHAT_NOTIFY, this.onRcvChatNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.DEL_HANDCARD, this.onRcvDelHandcardNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTICE_READY, this.onRcvReadyNotice, this);
        cc.vv.NetManager.registerMsg(MsgId.OFFLINE_NOTIFY, this.onRcvOfflineNotice, this);
        cc.vv.NetManager.registerMsg(MsgId.PLAYER_DISTANCE_DATA, this.onRcvPlayersDistanceData, this);
        cc.vv.NetManager.registerMsg(MsgId.GPS_TIPS_NOTIFY, this.onRcvGpsTipsNotify, this);

        cc.vv.NetManager.registerMsg(MsgId.APPLY_DISMISS_NOTIFY, this.onRcvDismissNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.AGREE_DISMISS_NOTIFY, this.onRcvDismissNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.REFUSE_DISMISS_NOTIFY, this.onRcvDismissNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.SUCCESS_DISMISS_NOTIFY, this.onRcvDismissNotify, this);
    },

    unregisterMsg() {
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_LEVELROOM, this.onRcvNetExitRoom, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_RECONNECT_DESKINFO, this.onRecvNetReconnectDeskinfo, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_KICK, this.onRcvNetKickNotice, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.MONEY_CHANGED,this.onRcvNetMoneyChanged, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.SENDCARD,this.onRcvHandCard, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_OUTCARD,this.onRcvOutCardNotify, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_PLAYER_ENTER, this.onRcvPlayerComeNotice,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_PLAYER_EXIT, this.onRcvPlayerExitNotice, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.OUTCARD, this.onRcvOutCardReslut , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.CHI, this.onRcvChiResult , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.PENG, this.onRcvPengResult , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.GUO, this.onRcvPengResult , false,this);

        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HZ_PAO, this.onRcvPaoNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HZ_KAN, this.onRcvKanNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HZ_TILONG, this.onRcvLongNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_CHI, this.onRcvChiNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_PENG, this.onRcvPengNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_NOTIFY_GUO, this.onRcvGuoNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_MOPAI, this.onRcvMoPaiNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HU, this.onRcvHuNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_GAME_OVER, this.onRcvGameOverNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.CHAT_NOTIFY, this.onRcvChatNotify, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.DEL_HANDCARD, this.onRcvDelHandcardNotify, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_READY, this.onRcvReadyNotice,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.OFFLINE_NOTIFY, this.onRcvOfflineNotice,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.PLAYER_DISTANCE_DATA, this.onRcvPlayersDistanceData,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.GPS_TIPS_NOTIFY, this.onRcvGpsTipsNotify,false,this);

        cc.vv.NetManager.unregisterMsg(MsgId.APPLY_DISMISS_NOTIFY, this.onRcvDismissNotify, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.AGREE_DISMISS_NOTIFY, this.onRcvDismissNotify, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.REFUSE_DISMISS_NOTIFY, this.onRcvDismissNotify, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.SUCCESS_DISMISS_NOTIFY, this.onRcvDismissNotify, false,this);
    },

    onRcvDismissNotify(msg){
        if(msg.code == 200){
            Global.dispatchEvent(EventId.DISMISS_NOTIFY,msg)
        }
    },


    onRcvPlayersDistanceData(msg){
        if(msg.code == 200){
            Global.dispatchEvent(EventId.PLAYER_DISTANCE_DATA,msg)
        }
    },

    onRcvGpsTipsNotify(msg){
        if(msg.code == 200){
            Global.dispatchEvent(EventId.GPS_TIPS_NOTIFY,msg)
        }
    },

    // 掉线通知
    onRcvOfflineNotice(msg){
        if(msg.code == 200){
            Global.dispatchEvent(EventId.OFFLINE_NOTIFY,msg)
        }
    },

    onRcvReadyNotice(msg){
        if(msg.code == 200){
            Global.dispatchEvent(EventId.READY_NOTIFY,msg)
        }
    },

    // 删除手牌
    onRcvDelHandcardNotify(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.DEL_HANDCARD_NOTIFY,msg)
        }
    },

    onRcvChatNotify(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.CHAT_NOTIFY,msg)
        }
    },

     // 局数 人数 中庄 积分 速度 托管 禁止同IP 禁止
    // 获取玩法
    getWanFa(){
        let list = [];
        let conf = this._deskInfo.conf;
        list.push(conf.gamenum+"局 ");
        list.push(conf.seat+ "人 ");
        list.push(["蚂蚁上树 ","见三加一 ","见六加一 "][conf.scoreType-1]);
        list.push(conf.score+ "倍 ");
        if(conf.speed === 1){
            list.push("快速 ");
        }
        if(conf.trustee){
            list.push("托管 ");
        }
        list.push(["禁止解散 ","允许解散 "][conf.isdissolve]);
        if(conf.ipcheck){
            list.push("同IP禁止进入 "); 
        } 
        if(conf.distance){
            list.push("距离相近200米禁止加入 "); 
        } 
        return list;
    },


    onRcvGameOverNotfiy(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.GAMEOVER,msg);
        }
    },

    // 手牌排序
    sortCard(cards){
        let tempList1 = cards.slice(0);
        tempList1.sort((a,b)=>{
            return a-b;
        });

        let list = [];
        let value = -1;
        let temp = [];
        // 先查找相同的
        for(let i=0;i<tempList1.length;++i){
            if(value !== tempList1[i]){
                if(temp.length>2){
                    list.push(temp);
                    for(let j=1;j<=temp.length;++j){
                        tempList1[i-j] = -1;
                    }
                }
                temp = [tempList1[i]];
                value = tempList1[i];
            }
            else{
                temp.push(tempList1[i]);
            }
        }

        let tempList2 = [];
        for(let i=0;i<tempList1.length;++i){
            if(tempList1[i]>-1) tempList2.push(tempList1[i]);
        }

        tempList2.sort((a,b)=>{
            return ((a%100)-b%100);
        });

        value = -1;
        // 先查找数字相同的
        for(let i=0;i<tempList2.length;++i){
            if(value !== tempList2[i]%100){
                if(list.length<10){
                    temp = [tempList2[i]];
                }
                list.push(temp);
                value = tempList2[i]%100;
            }
            else
            {
                if(temp.length>2){
                    if(list.length<10){
                        temp = [tempList2[i]];
                    }
                    list.push(temp);
                }
                else temp.push(tempList2[i]);
            }
        }

        return list;
    },


    // 胡牌通知
    onRcvHuNotfiy(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.HU_NOTIFY,msg);
        }
    },

    // 摸牌
    onRcvMoPaiNotfiy(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.MOPAI_NOTIFY,msg);
        }
    },

    // 通知跑
    onRcvPaoNotfiy(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.PAO_NOTIFY,msg);
        }
    },

    // 通知坎
    onRcvKanNotfiy(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.KAN_NOTIFY,msg);
        }
    },

    // 通知龙
    onRcvLongNotfiy(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.LONG_NOTIFY,msg);
        }
    },

    // 通知吃
    onRcvChiNotfiy(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.CHI_NOTIFY,msg);
        }
    },

    // 通知碰
    onRcvPengNotfiy(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.PENG_NOTIFY,msg);
        }
    },

    // 通知过
    onRcvGuoNotfiy(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.GUO_NOTIFY,msg);
        }
    },


    // 吃结果
    onRcvChiResult(msg){
        if(msg.code === 200){
        }
    },

    // 碰结果
    onRcvPengResult(msg){
        if(msg.code === 200){
        }
    },

    // 过结果
    onRcvGuoResult(msg){
        if(msg.code === 200){
        }
    },

    // 出牌结果
    onRcvOutCardReslut(msg){
        if(msg.code === 200){
        }
    },

    // 出牌通知
    onRcvOutCardNotify(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.OUTCARD_NOTIFY,msg);
        }
    },

    onRcvHandCard(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.HANDCARD,msg);
        }
    },

    onRecvNetReconnectDeskinfo(msg){
        if (msg.code === 200) {
            this._deskInfo = msg.deskInfo;
            Global.dispatchEvent(EventId.GAME_RECONNECT_DESKINFO,msg);
        }
    },

    onRcvPlayerComeNotice(msg){
        if (msg.code === 200) {
            this._deskInfo.users.push(msg.user);
            Global.dispatchEvent(EventId.PLAYER_ENTER,msg.user);
        }
    },

    onRcvPlayerLeaveNotice(msg){
        if (msg.code === 200) {
            let users = this._deskInfo.users;
            for(let i=0;i<users.length;++i){
                if(msg.seat === users[i].seat){
                    users.splice(i,1);
                    break;
                }
            }
            Global.dispatchEvent(EventId.PLAYER_EXIT,msg.seat);
        }
    },

    onRcvPlayerExitNotice(msg){
        if (msg.code === 200) {

        }
    },

    onRcvNetKickNotice(msg){
        if (msg.code === 200) {

        }
    },


    onRcvNetExitRoom(msg) {
        if (msg.code === 200) {
            cc.vv.UserManager.currClubId = this._deskInfo.conf.clubid;

            this.clear();
            cc.vv.gameData = null;

            if (cc.vv.SceneMgr){
                if (cc.vv.UserManager.currClubId) {
                    cc.vv.SceneMgr.enterScene('club');
                } else {
                    cc.vv.SceneMgr.enterScene('lobby');
                }
            }
        }
    },

    getMySeatIndex(){
        return this._seatIndex;
    },

    getDeskInfo(){
        return this._deskInfo;
    },

    getUserInfo(seatIndex){
        for(let i=0;i<this._deskInfo.users.length;++i){
            if(this._deskInfo.users[i].seat === seatIndex){
                return this._deskInfo.users[i];
            }
        }
        return null;
    },

    getUsers(){
        return this._deskInfo.users;
    },

    getRoomConf(){
        return this._deskInfo.conf;
    },

    getUserSeatIndex(index){
        let seatIndex = -1;
        let users = this.getUsers();
        for(let i=0;i<users.length;++i){
            let chairId = cc.vv.gameData.getLocalChair(users[i].seat);
            if(chairId === index){
                seatIndex = users[i].seat;
                break;
            }
        }
        return seatIndex;
    },

    exitGame(){
        var req = { c: MsgId.GAME_LEVELROOM };
        req.deskid = this._deskInfo.conf.deskId;
        cc.vv.NetManager.send(req);
    },

    outCard(cardValue){
        var req = { c: MsgId.OUTCARD };
        req.card = cardValue;
        cc.vv.NetManager.send(req);
    },

    // 碰
    peng(){
        var req = { c: MsgId.PENG };
        cc.vv.NetManager.send(req);
    },

    // 过
    pass(){
        var req = { c: MsgId.GUO };
        cc.vv.NetManager.send(req);
    },


    // 吃
    chi(list){
        var req = { c: MsgId.CHI };
        req.chi = list;
        cc.vv.NetManager.send(req);
    },

    start () {

    },

    // update (dt) {},
});
