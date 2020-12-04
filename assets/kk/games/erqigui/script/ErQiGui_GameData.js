
cc.Class({
    extends: cc.Component,

    properties: {
        _deskInfo:null,
        _seatIndex:-1,
        _playerNum:4,           // 每局玩的人数限制
        _actionTime:0.3,         // 动画时间
        _isPlayBack:false,
    },

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

    //下0 右1 左2
    getUISeatBylocalSeat(localSeat){
        let localSeatToUISeatArr = [[-1,-1,-1,-1],[-1,-1,-1,-1],[0,1,-1,-1],[-1,-1,-1,-1],[0,1,2,3]];
        let maxSeat = cc.vv.gameData.getRoomConf().seat;
        return localSeatToUISeatArr[maxSeat][localSeat];
    },

    getLocalSeatByUISeat(UISeat){
        let localSeatToUISeatArr = [[-1,-1,-1,-1],[-1,-1,-1,-1],[0,1,-1,-1],[-1,-1,-1,-1],[0,1,2,3]];
        let maxSeat = cc.vv.gameData.getRoomConf().seat;
        return localSeatToUISeatArr[maxSeat][UISeat];
    },

    init(data){
        this.CardNoCanOutColor = new cc.Color(150,150,150);
        this.CardWidth = 161;
        this.CardHeight = 227;
        this.CardScale = 0.8;
        this.RoomSeat = 4;
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
            HANDPAO:11, // 手牌的跑
            HANDLONG:12,  // 手牌的踢龙
            // PENGSAN:11, // 碰三
            // KANSAN:12,  // 坎三
            // PENGSI:13, // 碰四
            // KANSI:14,  // 坎四
            CHI_LUO:15,  // 吃落
        },
        this.CARDTYPE = {
            ERROR_CARDS     : 0,    //错误牌型
            SINGLE_CARD     : 1,    //单牌
            DOUBLE_CARD     : 2,    //对子
            THREE_CARD      : 3,    //3带0
            THREE_ONE_CARD  : 4,    //3带1
            THREE_TWO_CARD  : 5,    //3带2
            BOMB_ONE_CARD   : 6,    //四个带1张单牌
            BOMB_TWO_CARD   : 7,    //四个带2张单牌
            BOMB_THREE_CARD : 8,    //四个带3张单牌
            CONNECT_CARD    : 9,    //连牌
            COMPANY_CARD    : 10,   //连队
            AIRCRAFT        : 11,   //飞机
            BOMB_CARD       : 12,   //炸弹
            KINGBOMB_CARD   : 13,   //王炸
            CHUN_TIAN       : 14,   //春天
        };

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

        this._isPlayBack = this._deskInfo._isPlayBack;
        if (this._isPlayBack) {
            if (0 >= this._seatIndex) {
                this._seatIndex = this._deskInfo.users[this._deskInfo.users.length-1].seat;
            }
        }

        this.zhuColor = -1;
    },

    getPlayerNum(){
        return this._playerNum;
    },

    registerMsg() {
        cc.vv.NetManager.registerMsg(MsgId.GAME_LEVELROOM, this.onRcvNetExitRoom, this); //退出房间
        cc.vv.NetManager.registerMsg(MsgId.GAME_RECONNECT_DESKINFO, this.onRecvNetReconnectDeskinfo, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_KICK, this.onRcvNetKickNotice, this);
        cc.vv.NetManager.registerMsg(MsgId.SENDCARD, this.onRcvHandCard, this);

        cc.vv.NetManager.registerMsg(MsgId.NOTICE_PLAYER_ENTER, this.onRcvPlayerComeNotice, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTICE_PLAYER_EXIT, this.onRcvPlayerExitNotice, this);

        cc.vv.NetManager.registerMsg(MsgId.CHI, this.onRcvChiResult, this);
        cc.vv.NetManager.registerMsg(MsgId.PENG, this.onRcvPengResult, this);
        cc.vv.NetManager.registerMsg(MsgId.GUO, this.onRcvGuoResult, this);

        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HZ_PAO, this.onRcvPaoNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HZ_KAN, this.onRcvKanNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HZ_TILONG, this.onRcvLongNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_CHI, this.onRcvChiNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_PENG, this.onRcvPengNotfiy, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_GUO, this.onRcvGuoNotfiy, this);
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

        cc.vv.NetManager.registerMsg(MsgId.GAME_SWITCH_CLUB, this.onRcvNetExitRoom, this);
        cc.vv.NetManager.registerMsg(MsgId.UPDATE_TABLE_INFO, this.onRcvUpdateTableInfo, this);

        cc.vv.NetManager.registerMsg(MsgId.OUT_CARD_NOTIFY, this.onRcvOutCardNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.OUT_CARD, this.onRcvOutCard, this);
        cc.vv.NetManager.registerMsg(MsgId.SCORE_UPDATE_NOTIFY, this.onRcvScoreUpdateNotify,this);

        cc.vv.NetManager.registerMsg(MsgId.ERQIGUI_JIAO_SCORE_NOTIFY, this.onRcvJiaoScoreNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.ERQIGUI_SELECT_COLOR_NOTIFY, this.onRcvSelectColorNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.ERQIGUI_MAI_CARD_NOTIFY, this.onRcvMaiCardNotify, this);
    },

    unregisterMsg() {
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_LEVELROOM, this.onRcvNetExitRoom, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_RECONNECT_DESKINFO, this.onRecvNetReconnectDeskinfo, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_KICK, this.onRcvNetKickNotice, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.SENDCARD,this.onRcvHandCard, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_PLAYER_ENTER, this.onRcvPlayerComeNotice,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_PLAYER_EXIT, this.onRcvPlayerExitNotice, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.CHI, this.onRcvChiResult , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.PENG, this.onRcvPengResult , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.GUO, this.onRcvPengResult , false,this);

        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HZ_PAO, this.onRcvPaoNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HZ_KAN, this.onRcvKanNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HZ_TILONG, this.onRcvLongNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_CHI, this.onRcvChiNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_PENG, this.onRcvPengNotfiy , false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_GUO, this.onRcvGuoNotfiy , false,this);
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

        cc.vv.NetManager.unregisterMsg(MsgId.GAME_SWITCH_CLUB, this.onRcvNetExitRoom, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.UPDATE_TABLE_INFO, this.onRcvUpdateTableInfo, false, this);

        cc.vv.NetManager.unregisterMsg(MsgId.OUT_CARD_NOTIFY, this.onRcvOutCardNotify, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.OUT_CARD, this.onRcvOutCard, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.SCORE_UPDATE_NOTIFY, this.onRcvScoreUpdateNotify, false,this);

        cc.vv.NetManager.unregisterMsg(MsgId.ERQIGUI_JIAO_SCORE_NOTIFY, this.onRcvJiaoScoreNotify, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.ERQIGUI_SELECT_COLOR_NOTIFY, this.onRcvSelectColorNotify, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.ERQIGUI_MAI_CARD_NOTIFY, this.onRcvMaiCardNotify, false, this);
    },

    onRcvUpdateTableInfo(msg){
        if(msg.code == 200){
            // cc.vv.NetManager.unregisterMsg(MsgId.UPDATE_TABLE_INFO, this.onRcvUpdateTableInfo, false, this);
            if (this._deskInfo.isReconnect) {
                this._deskInfo = msg.deskInfo;
                this._deskInfo.isReconnect = true;
            } else {
                this._deskInfo = msg.deskInfo;
            }
            // cc.vv.SceneMgr.enterScene(cc.director.getScene().name);
            Global.dispatchEvent(EventId.UPDATE_PLAYER_INFO);
        }
    },

    onRcvJiaoScoreNotify(msg){
        if(msg.code == 200){
            Global.dispatchEvent(EventId.ERQIGUI_JIAO_SCORE_NOTIFY,msg)           
        }
    },

    onRcvSelectColorNotify(msg){
        if(msg.code == 200){
            this._deskInfo.jiaoZhu = msg.jiaoZhu;
            if (msg.actionInfo.nextaction.seat === this._seatIndex && 3 == msg.actionInfo.nextaction.type) {
                this._deskInfo.buckPai = msg.diPai;
            }
            Global.dispatchEvent(EventId.ERQIGUI_SELECT_COLOR_NOTIFY,msg)           
        }
    },

    onRcvMaiCardNotify(msg){
        if(msg.code == 200){
            Global.dispatchEvent(EventId.ERQIGUI_MAI_CARD_NOTIFY,msg)           
        }
    },

    onRcvScoreUpdateNotify(msg){
        if(msg.code == 200){
            Global.dispatchEvent(EventId.SCORE_UPDATE_NOTIFY,msg)
        }
    },

    onRcvOutCardNotify(msg){
        if(msg.code == 200){
            Global.dispatchEvent(EventId.OUT_CARD_NOTIFY,msg)
        }
    },

    onRcvOutCard(msg){
        if(msg.code == 200){
            Global.dispatchEvent(EventId.OUT_CARD,msg)
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
        list.push("筷子" + conf.param1 + "分 ");
        if (conf.param2) {
            list.push("五色四色 ");
        }
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

    // 通知要不起
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

    onRcvHandCard(msg){
        if(msg.code === 200){
            this._deskInfo.jiaoZhu = -1;
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

    onRcvPlayerExitNotice(msg){
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

    // 手牌排序  红桃7 > 7 > 红桃2 > 2 > 红桃 > 其他
    sortCard(cardlist){
        let tempList = cardlist.slice(0);
        for (let i = 0; i < tempList.length; i++) {
            if (this.getIsZhuCard(tempList[i])) {
                let resColor = parseInt(tempList[i]/0x10);
                let resValue = (tempList[i]%0x10);
                if (!(this._deskInfo.conf.param2 && 4 == this._deskInfo.jiaoZhu)) {
                    if (2 == resValue) {
                        tempList[i] += 0x200;
                    } else if (7 == resValue) {
                        tempList[i] += 0x700;
                    }
                }
                if (resColor == this._deskInfo.jiaoZhu) {
                    tempList[i] += 0x100;
                }
            }
        }
        tempList.sort((a,b)=>{
            return -(a - b);    //从大到小
        });
        for (let i = 0; i < tempList.length; i++) {
            tempList[i] %= 0x100;
        }
        return tempList;
    },

    getIsZhuCard(cardValue){
        let resColor = parseInt(cardValue/0x10);
        let resValue = (cardValue%0x10);
        if (2 == resValue || 7 == resValue) {
            if (this._deskInfo.conf.param2 && (4 == this._deskInfo.jiaoZhu)) {    //四五色玩法
                return false;
            } else {
                return true
            }
        } else {
            return (resColor == this._deskInfo.jiaoZhu);
        }
    },

    getCardColorNum(cardlist, cardColor){
        let count = 0;
        for (let i = 0; i < cardlist.length; i++) {
            if ((parseInt(cardlist[i]/0x10) == cardColor) && 
                (2 != (cardlist[i]%0x10)) &&
                (7 != (cardlist[i]%0x10))) {
                count++;
            }
        }
        return count;
    },

    getCardColorDoubleNum(cardlist, cardColor){
        let count = 0;
        for (let i = 0; i < cardlist.length - 1; i++) {
            if ((cardlist[i] == cardlist[i+1]) &&
                (parseInt(cardlist[i]/0x10) == cardColor) && 
                (2 != (cardlist[i]%0x10)) &&
                (7 != (cardlist[i]%0x10))) {
                count++;
                i++;
            }
        }
        return count;
    },

    getCardColor5Num(cardlist, cardColor){
        let count = 0;
        for (let i = 0; i < cardlist.length; i++) {
            if ((2 == (cardlist[i]%0x10)) || (7 == (cardlist[i]%0x10))) {
                count++;
            }
        }
        return count;
    },

    getCardColor5DoubleNum(cardlist, cardColor){
        let count = 0;
        for (let i = 0; i < cardlist.length - 1; i++) {
            if ((cardlist[i] == cardlist[i+1]) &&
                ((2 == (cardlist[i]%0x10)) || (7 == (cardlist[i]%0x10)))) {
                count++;
                i++;
            }
        }
        return count;
    },

    getCardZhuNum(cardlist){
        let count = 0;
        for (let i = 0; i < cardlist.length; i++) {
            if (this.getIsZhuCard(cardlist[i])) {
                count++;
            }
        }
        return count;
    },

    getCardColorDoubleCards(cardlist, cardColor){
        let cardColorDoubleCards = [];
        for (let i = 0; i < cardlist.length - 1; i++) {
            if ((!this.getIsZhuCard(cardlist[i])) &&
                (cardlist[i] == cardlist[i+1]) &&
                (parseInt(cardlist[i]/0x10) == cardColor)) {
                cardColorDoubleCards.push(cardlist[i]);
                i++;
            }
        }
        return cardColorDoubleCards;
    },

    getCardZhuDoubleCards(cardlist){
        let cardZhuDoubleCards = [];
        for (let i = 0; i < cardlist.length - 1; i++) {
            if (this.getIsZhuCard(cardlist[i]) &&
                (cardlist[i] == cardlist[i+1])) {
                cardZhuDoubleCards.push(cardlist[i]);
                i++;
            }
        }
        return cardZhuDoubleCards;
    }
});
