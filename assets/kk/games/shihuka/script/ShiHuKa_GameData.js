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
        _playerNum:4,           // 每局玩的人数限制
        _actionTime:0.3,         // 动画时间
        _isPlayBack:false,
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

    //下0 右1 左2
    getUISeatBylocalSeat(localSeat){
        let localSeatToUISeatArr = [[-1,-1,-1,-1],[-1,-1,-1,-1],[0,1,-1,-1],[0,1,2,-1],[-1,-1,-1,-1]];
        let maxSeat = cc.vv.gameData.getRoomConf().seat;
        return localSeatToUISeatArr[maxSeat][localSeat];
    },

    getLocalSeatByUISeat(UISeat){
        let localSeatToUISeatArr = [[-1,-1,-1,-1],[-1,-1,-1,-1],[0,1,-1,-1],[0,1,2,-1],[-1,-1,-1,-1]];
        let maxSeat = cc.vv.gameData.getRoomConf().seat;
        return localSeatToUISeatArr[maxSeat][UISeat];
    },

    init(data){
        this.RoomSeat = 3;
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
    },

    getPlayerNum(){
        return this._playerNum;
    },

    registerMsg() {
        cc.vv.NetManager.registerMsg(MsgId.GAME_LEVELROOM, this.onRcvNetExitRoom, this); //退出房间
        cc.vv.NetManager.registerMsg(MsgId.GAME_RECONNECT_DESKINFO, this.onRecvNetReconnectDeskinfo, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_KICK, this.onRcvNetKickNotice, this);
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
        cc.vv.NetManager.registerMsg(MsgId.TRUSTEE_NOTIFY, this.onRcvTrusteeNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.CANCEL_TRUSTEE, this.onRcvCancelTrustee, this);
        cc.vv.NetManager.registerMsg(MsgId.CANCEL_TRUSTEE_NOTIFY, this.onRcvCancelTrusteeNotify, this);
    },

    unregisterMsg() {
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_LEVELROOM, this.onRcvNetExitRoom, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_RECONNECT_DESKINFO, this.onRecvNetReconnectDeskinfo, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_KICK, this.onRcvNetKickNotice, false, this);
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
        cc.vv.NetManager.unregisterMsg(MsgId.TRUSTEE_NOTIFY, this.onRcvTrusteeNotify, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CANCEL_TRUSTEE, this.onRcvCancelTrustee, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CANCEL_TRUSTEE_NOTIFY, this.onRcvCancelTrusteeNotify, false, this);
    },

    onRcvCancelTrusteeNotify(msg){
        if(msg.code == 200){
            Global.dispatchEvent(EventId.CANCEL_TRUSTEE_NOTIFY, msg)
        }
    },

    onRcvCancelTrustee(msg){
        if(msg.code == 200){
        }
    },

    onRcvTrusteeNotify(msg){
        if(msg.code == 200){
            Global.dispatchEvent(EventId.TRUSTEE_NOTIFY, msg)
        }
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
        list.push(["一胡一分 ","三胡一分 "][conf.param1]);
        list.push(["不带醒 ","翻醒 ","随醒 "][conf.param2]);
        list.push(conf.score+ "倍 ");
        if (cc.vv.UserManager.currClubId) {
            list.push("最低入场" + conf.tiredsill + "分 ");
        }
        if(conf.speed === 1){
            list.push("快速 ");
        }
        list.push(["不托管 ","30秒托管 ","60秒托管 ","90秒托管 "][conf.trustee]);
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

    // 手牌排序
    sortCard(cards){
        let menziList = [];
        let card2DList = this.getCard2DList(cards);

        //二二二二
        for (let i = 1; i <= 20; i++) {
            if (4 == card2DList[i].length){
                menziList.push(card2DList[i]);
                card2DList[i] = [];
            }
        }
        //二二二
        for (let i = 1; i <= 20; i++) {
            if (3 == card2DList[i].length){
                menziList.push(card2DList[i]);
                card2DList[i] = [];
            }
        }
        //二二贰
        for (let i = 1; i <= 10; i++) {
            if (3 == (card2DList[i].length + card2DList[i+10].length)){
                menziList.push(card2DList[i+10]);
                for (var j = 0; j < card2DList[i].length; j++) {
                    menziList[menziList.length-1].push(card2DList[i][j]);
                }
                card2DList[i] = [];
                card2DList[i+10] = [];
            }
        }
        //二二+贰贰
        for (let i = 1; i <= 10; i++) {
            if (2 == card2DList[i].length && 2 == card2DList[i+10].length){
                menziList.push(card2DList[i]);
                card2DList[i] = [];
                menziList.push(card2DList[i+10]);
                card2DList[i+10] = [];
            }
        }
        //一二三
        for (let i = 1; i <= 10-2; i++) {
            if (card2DList[i].length && card2DList[i+1].length && card2DList[i+2].length) {
                let menzi = [];
                menzi.push(card2DList[i].shift());
                menzi.push(card2DList[i+1].shift());
                menzi.push(card2DList[i+2].shift());
                menziList.push(menzi);
            }
        }
        //壹贰叁
        for (let i = 11; i <= 20-2; i++) {
            if (card2DList[i].length && card2DList[i+1].length && card2DList[i+2].length) {
                let menzi = [];
                menzi.push(card2DList[i].shift());
                menzi.push(card2DList[i+1].shift());
                menzi.push(card2DList[i+2].shift());
                menziList.push(menzi);
            }
        }
        //二七十 贰柒拾
        let indesPair = [[2,7,10],[12,17,20]];
        for (var i = 0; i < indesPair.length; i++) {
            if (card2DList[indesPair[i][0]].length && card2DList[indesPair[i][1]].length && card2DList[indesPair[i][2]].length) {
                let menzi = [];
                menzi.push(card2DList[indesPair[i][0]].shift());
                menzi.push(card2DList[indesPair[i][1]].shift());
                menzi.push(card2DList[indesPair[i][2]].shift());
                menziList.push(menzi);
            }
        }
        //二二 贰贰
        for (let i = 1; i <= 10; i++) {
            if (2 == card2DList[i].length){
                menziList.push(card2DList[i]);
                card2DList[i] = [];
            }
            if (2 == card2DList[i+10].length) {
                menziList.push(card2DList[i+10]);
                card2DList[i+10] = [];
            }
        }
        //一二
        for (let i = 1; i <= 10-1; i++) {
            if (card2DList[i].length && card2DList[i+1].length) {
                let menzi = [];
                menzi.push(card2DList[i].shift());
                menzi.push(card2DList[i+1].shift());
                menziList.push(menzi);
            }
        }
        //壹贰
        for (let i = 11; i <= 20-1; i++) {
            if (card2DList[i].length && card2DList[i+1].length) {
                let menzi = [];
                menzi.push(card2DList[i].shift());
                menzi.push(card2DList[i+1].shift());
                menziList.push(menzi);
            }
        }
        //二贰
        for (let i = 1; i <= 10; i++) {
            if (1 == card2DList[i].length && 1 == card2DList[i+10].length){
                menziList.push([card2DList[i+10][0], card2DList[i][0]]);
                card2DList[i] = [];
                card2DList[i+10] = [];
            }
        }
        //一三
        for (let i = 1; i <= 10-2; i++) {
            if (card2DList[i].length && card2DList[i+2].length) {
                let menzi = [];
                menzi.push(card2DList[i].shift());
                menzi.push(card2DList[i+2].shift());
                menziList.push(menzi);
            }
        }
        //壹叁
        for (let i = 11; i <= 20-2; i++) {
            if (card2DList[i].length && card2DList[i+2].length) {
                let menzi = [];
                menzi.push(card2DList[i].shift());
                menzi.push(card2DList[i+2].shift());
                menziList.push(menzi);
            }
        }
        //2+7 7+10 2+10 
        indesPair = [[2,7],[2,10],[7,10],[12,17],[12,20],[17,20]];
        for (var i = 0; i < indesPair.length; i++) {
            if (card2DList[indesPair[i][0]].length && card2DList[indesPair[i][1]].length) {
                let menzi = [];
                menzi.push(card2DList[indesPair[i][0]].shift());
                menzi.push(card2DList[indesPair[i][1]].shift());
                menziList.push(menzi);
            }
        }
        //散牌
        for (let i = 1; i <= 20; i++) {
            if (card2DList[i].length) {
                if (10 > menziList.length) {
                    menziList.push(card2DList[i]);
                    card2DList[i] = [];
                } else {
                    for (let j = menziList.length-1; j >= 0; j--) {
                        let k = menziList[j].length;
                        for (k = menziList[j].length; k < 3; k++) {
                            menziList[j].push(card2DList[i][0]);
                            card2DList[i] = [];
                            break;
                        }
                        if (k < 3) {
                            break;
                        }
                    }
                }
            }
        }
        return menziList;
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
        if(msg.code === 200 && msg.tingPaiInfo){
            Global.dispatchEvent(EventId.OUTCARD_RESULT,msg.tingPaiInfo);
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

    // update (dt) {},
});
