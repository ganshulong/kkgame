
cc.Class({
    extends: cc.Component,

    properties: {
        _deskInfo:null,
        _seatIndex:-1,
        _playerNum:4,           // 每局玩的人数限制
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

    //下0 右1 上2 左3
    getUISeatBylocalSeat(localSeat){
        let localSeatToUISeatArr = [[-1,-1,-1,-1],[-1,-1,-1,-1],[0,1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]];
        let maxSeat = cc.vv.gameData.getRoomConf().seat;
        return localSeatToUISeatArr[maxSeat][localSeat];
    },

    getLocalSeatByUISeat(UISeat){
        let localSeatToUISeatArr = [[-1,-1,-1,-1],[-1,-1,-1,-1],[0,1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]];
        let maxSeat = cc.vv.gameData.getRoomConf().seat;
        return localSeatToUISeatArr[maxSeat][UISeat];
    },

    init(data){
        this.RoomSeat = 2;
        this.OPERATETYPE={
            GU0     :1, // 过
            PUT     :2, // 打牌
            MOPAI   :3, // 摸牌
            PENG    :4, // 碰
            MGANG   :5, // 明杠
            AGANG   :6, // 暗杠
            JGANG   :7, // 接杠
            FGANG   :8, // 放杠
            HU      :9, // 胡牌
            wait    :10,// 等待别人操作
            GANG    :11,// 明杠
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

        cc.vv.NetManager.registerMsg(MsgId.SENDCARD, this.recvHandCard, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_OUTCARD, this.recvOutCardNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_MOPAI, this.recvMoPaiNotify, this);

        cc.vv.NetManager.registerMsg(MsgId.NOTICE_PLAYER_ENTER, this.onRcvPlayerComeNotice, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTICE_PLAYER_EXIT, this.onRcvPlayerExitNotice, this);
        cc.vv.NetManager.registerMsg(MsgId.OUTCARD, this.onRcvOutCardReslut, this);

        cc.vv.NetManager.registerMsg(MsgId.CHI, this.onRcvChiResult, this);
        cc.vv.NetManager.registerMsg(MsgId.PENG, this.onRcvPengResult, this);
        cc.vv.NetManager.registerMsg(MsgId.GANG, this.onRcvGangResult, this);
        cc.vv.NetManager.registerMsg(MsgId.GUO, this.onRcvGuoResult, this);

        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HZ_PAO, this.onRcvPaoNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HZ_KAN, this.onRcvKanNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HZ_TILONG, this.onRcvLongNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_CHI, this.onRcvChiNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_PENG, this.recvPengNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_GANG, this.recvGangNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_GUO, this.recvGuoNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HU, this.recvRoundOverNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_GAME_OVER, this.onRcvGameOverNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.CHAT_NOTIFY, this.onRcvChatNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTICE_READY, this.onRcvReadyNotice, this);
        cc.vv.NetManager.registerMsg(MsgId.OFFLINE_NOTIFY, this.onRcvOfflineNotice, this);
        cc.vv.NetManager.registerMsg(MsgId.PLAYER_DISTANCE_DATA, this.onRcvPlayersDistanceData, this);
        cc.vv.NetManager.registerMsg(MsgId.GPS_TIPS_NOTIFY, this.onRcvGpsTipsNotify, this);

        cc.vv.NetManager.registerMsg(MsgId.APPLY_DISMISS_NOTIFY, this.onRcvDismissNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.AGREE_DISMISS_NOTIFY, this.onRcvDismissNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.REFUSE_DISMISS_NOTIFY, this.onRcvDismissNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.SUCCESS_DISMISS_NOTIFY, this.onRcvDismissNotify, this);

        cc.vv.NetManager.registerMsg(MsgId.GAME_SWITCH_CLUB, this.onRcvNetExitRoom, this);
        cc.vv.NetManager.registerMsg(MsgId.UPDATE_TABLE_INFO, this.onRcvUpdateTableInfo, this);
    },

    unregisterMsg() {
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_LEVELROOM, this.onRcvNetExitRoom, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_RECONNECT_DESKINFO, this.onRecvNetReconnectDeskinfo, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_KICK, this.onRcvNetKickNotice, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.MONEY_CHANGED,this.onRcvNetMoneyChanged, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.SENDCARD,this.recvHandCard, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_OUTCARD,this.recvOutCardNotify, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_PLAYER_ENTER, this.onRcvPlayerComeNotice,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_PLAYER_EXIT, this.onRcvPlayerExitNotice, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.OUTCARD, this.onRcvOutCardReslut , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.CHI, this.onRcvChiResult , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.PENG, this.onRcvPengResult , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.GANG, this.onRcvGangResult , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.GUO, this.onRcvGuoResult , false,this);

        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HZ_PAO, this.onRcvPaoNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HZ_KAN, this.onRcvKanNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HZ_TILONG, this.onRcvLongNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_CHI, this.onRcvChiNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_PENG, this.recvPengNotify , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_GANG, this.recvGangNotify , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_GUO, this.recvGuoNotify , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_MOPAI, this.recvMoPaiNotify , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HU, this.recvRoundOverNotify , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_GAME_OVER, this.onRcvGameOverNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.CHAT_NOTIFY, this.onRcvChatNotify, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_READY, this.onRcvReadyNotice,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.OFFLINE_NOTIFY, this.onRcvOfflineNotice,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.PLAYER_DISTANCE_DATA, this.onRcvPlayersDistanceData,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.GPS_TIPS_NOTIFY, this.onRcvGpsTipsNotify,false,this);

        cc.vv.NetManager.unregisterMsg(MsgId.APPLY_DISMISS_NOTIFY, this.onRcvDismissNotify, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.AGREE_DISMISS_NOTIFY, this.onRcvDismissNotify, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.REFUSE_DISMISS_NOTIFY, this.onRcvDismissNotify, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.SUCCESS_DISMISS_NOTIFY, this.onRcvDismissNotify, false,this);

        cc.vv.NetManager.unregisterMsg(MsgId.GAME_SWITCH_CLUB, this.onRcvNetExitRoom, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.UPDATE_TABLE_INFO, this.onRcvUpdateTableInfo, false, this);
    },

    onRcvUpdateTableInfo(msg){
        if(msg.code == 200){
            cc.vv.NetManager.unregisterMsg(MsgId.UPDATE_TABLE_INFO, this.onRcvUpdateTableInfo, false, this);
            this._deskInfo = msg.deskInfo;
            // cc.vv.SceneMgr.enterScene(cc.director.getScene().name);
            Global.dispatchEvent(EventId.UPDATE_PLAYER_INFO)
        }
    },

    onRcvDismissNotify(msg){
        if(msg.code == 200){
            if (0 == msg.isShowJieSuan) {
                this.exitGame();
                cc.vv.FloatTip.show("房间超时已解散");
            } else {
                Global.dispatchEvent(EventId.DISMISS_NOTIFY,msg)
            }
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
        list.push(["不抓鸟 ","抓2鸟 ","抓4鸟 ","抓6鸟 "][conf.param1/2]);
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

    getWanFaStrSimple(){
        let wanFaStr = "";
        let conf = this._deskInfo.conf;
        wanFaStr += (conf.gamenum+"局 ");
        wanFaStr += (conf.seat+ "人 ");
        wanFaStr += (["不抓鸟 ","抓2鸟 ","抓4鸟 ","抓6鸟 "][conf.param1/2]);
        wanFaStr += (conf.score+ "倍 ");
        if(conf.speed === 1){
            wanFaStr += ("快速 ");
        }
        if(conf.trustee){
            wanFaStr += ("托管 ");
        }
        wanFaStr += (["禁止解散 ","允许解散 "][conf.isdissolve]);
        return wanFaStr;
    },

    getWanFaStrDetail(){
        let wanFaStr = this.getWanFaStrSimple();
        let conf = this._deskInfo.conf;
        if(conf.ipcheck){
            wanFaStr += ("同IP禁止进入 "); 
        } 
        if(conf.distance){
            wanFaStr += ("距离相近200米禁止加入 "); 
        } 
        return wanFaStr;
    },

    onRcvGameOverNotfiy(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.GAMEOVER,msg);
        }
    },

    getGreyCardArrCount(cards){
        let tempList = cards.slice(0);
        tempList.sort((a,b)=>{
            return a-b;
        });
        let greyCardArrCount = 0;
        for(let i = 0; i < tempList.length - 2; ++i){
            if (tempList[i] == tempList[i+1] && tempList[i+1] == tempList[i+2]) {
                ++greyCardArrCount;
                i+=2;
            }
        }
        return greyCardArrCount;
    },

    // 
    // 手牌排序 红中最左，从小到大，返回值大于0则互换位置
    sortCard(cards){
        cards.sort((a,b)=>{
            if (35 === a) {
                return -1;
            } else if (35 === b) {
                return 1;
            } else {
                return (a-b);
            }
        });
        return cards;
    },

    getCard2DList(cards){
        let card2DList = [];
        for (let i = 0; i <= 20; i++) {
            card2DList.push([]);
        }
        for (let i = 0; i < cards.length; i++) {
            let cardIndex = (200 > cards[i]) ? cards[i] % 100 : cards[i] % 100 + 10;
            card2DList[cardIndex].push(cards[i]);
        }
        return card2DList;
    }, 

    // 胡牌通知
    recvRoundOverNotify(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.HU_NOTIFY,msg);
        }
    },

    // 摸牌
    recvMoPaiNotify(msg){
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
    recvPengNotify(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.PENG_NOTIFY,msg);
        }
    },

    // 通知杠
    recvGangNotify(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.GANG_NOTIFY,msg);
        }
    },

    // 通知过
    recvGuoNotify(msg){
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

    // 杠结果
    onRcvGangResult(msg){
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
        if(msg.code === 200 && msg.tingPaiInfo){
            Global.dispatchEvent(EventId.OUTCARD_RESULT,msg.tingPaiInfo);
        }
    },

    // 出牌通知
    recvOutCardNotify(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.OUTCARD_NOTIFY,msg);
        }
    },

    recvHandCard(msg){
        if(msg.code === 200){
            Global.dispatchEvent(EventId.HANDCARD,msg);
        }
    },

    onRecvNetReconnectDeskinfo(msg){
        if (msg.code === 200) {
            this._deskInfo = msg.deskInfo;
            cc.vv.SceneMgr.enterScene(cc.director.getScene().name);
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
                    Global.curRoomID = (msg.c == MsgId.GAME_SWITCH_CLUB) ? this._deskInfo.conf.deskId : "";
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

    setCurRound(curRound){
        this._deskInfo.round = curRound;
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
    
    // 胡
    hu(){
        var req = { c: MsgId.HU };
        cc.vv.NetManager.send(req);
    },

    // 杠
    gang(){
        var req = { c: MsgId.GANG };
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
