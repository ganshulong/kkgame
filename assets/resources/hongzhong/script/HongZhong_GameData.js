
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
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HU, this.onRcvHuNotfiy, this);
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
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HU, this.onRcvHuNotfiy , false,this);
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
            // if (35 === a) {
            //     return -1;
            // } else if (35 === b) {
            //     return 1;
            // } else {
                return (a-b);
            // }
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
    onRcvHuNotfiy(msg){
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


/*
** Define the messge id 
*/

// var GlobalMsgId = cc.Class({
//     extends: cc.Component,

//     statics: {
//     },
// });
// window.MsgId = GlobalMsgId;

// GlobalMsgId.HEARTBEAT = 11, //服务端主动检测心跳

// //大厅共用协议
// GlobalMsgId.LOGIN = 1; //登录游戏
// GlobalMsgId.LOGIN_USERID = 2; //ID登录
// GlobalMsgId.RELOGIN_USERID = 3; //断线重登陆
// GlobalMsgId.LOGIN_OUT = 12, //登出
// GlobalMsgId.SYNC_COIN = 29  ,//客户端主动同步金币
// GlobalMsgId.GAME_FIELDS_LIST = 30; //获取指定游戏的场次列表

// //大厅UI弹框协议
// GlobalMsgId.BIND_INVITE_CODE = 28; //绑定邀请码
// GlobalMsgId.PURCHASE_AGENT_LIST = 50; //获取代理（银商）列表
// GlobalMsgId.PURCHASE_GOODS_LIST = 51; //获取充值列表
// GlobalMsgId.FEEDBACK_COMMIT = 52; //提交反馈(type类型, memo反馈内容)
// GlobalMsgId.MESSAGE_SYSTEM = 53; //系统消息
// GlobalMsgId.MODIFY_INFO = 54; //修改信息（nickname昵称 memo备注）
// GlobalMsgId.IDENTITY_PERSONAL = 55; //个人认证(realname姓名 idcard身份证)
// GlobalMsgId.TOTAL_RANK_LIST = 56; //总金币排行榜
// GlobalMsgId.HALL_SPEAKER_LIST = 59; //获取喇叭跑马灯消息
// GlobalMsgId.EMAIL_LIST = 60; //获取邮件列表
// GlobalMsgId.EMAIL_READ = 61; //读取邮件
// GlobalMsgId.PERSIONAL_INFO = 62; //获取个人信息
// GlobalMsgId.EMAIL_RECEIVE = 63; //领取邮件
// GlobalMsgId.COMMIT_REPORT = 64; //提交举报
// GlobalMsgId.AC_RESERVE_COIN = 72; //获取备用金
// GlobalMsgId.AC_RESERVE_TAKE_LIMIT = 73; //备用金提取额度
// GlobalMsgId.BIND_ACCOUNT = 74; //绑定账号
// GlobalMsgId.GET_BOUNS = 75; //领取在线奖励
// GlobalMsgId.GET_ONLINE_BOUNS_STATUS = 76;       // 领取状态
// GlobalMsgId.GET_TASK_LIST = 77; //获取任务列表
// GlobalMsgId.RECEIVE_REWARD = 78; //领取奖励
// GlobalMsgId.TODAY_RANK_LIST = 79; //今日金币排行榜
// GlobalMsgId.ACTIVITY_LIST = 80; //活动列表
// GlobalMsgId.ACTIVITY_GET_FIVE_STAR = 81; //获取五星好评信息
// GlobalMsgId.ACT_COMMIT_FIVE_STAR = 82; //提交五星好评
// GlobalMsgId.ACT_INVITE_GIFT_LIST = 83; //获取邀请有礼列表
// GlobalMsgId.MODIFY_NICKNAME = 84;      // 修改昵称
// GlobalMsgId.SEND_CHAT = 85; //发送聊天内容
// GlobalMsgId.GET_CHAT_LIST = 86; //获取聊天内容
// GlobalMsgId.BIND_ACCOUNT_WX = 87; //游客绑定微信
// GlobalMsgId.BIG_CHARGE_ANGENT = 88; //代理大额充值信息
// GlobalMsgId.BIG_CHARGE_BACKLIST = 89; //代理大额充值返利档位
// GlobalMsgId.BIG_CHARGE_ORDER = 90; //代理大额充值下单
// GlobalMsgId.BIG_CHARGE_REBACKWARD = 91; //代理大额充值提现
// GlobalMsgId.BIG_CHARGE_REWARD_CORD= 92; //代理大额充值提现记录
// GlobalMsgId.AGENT_REWARD_DATA= 93; //下级代理水费数据
// GlobalMsgId.AGENT_REWARD_REBACKWARD= 94; //下级代理水费提现
// GlobalMsgId.HALL_VERSOIN = 96;           //获取大厅最新的版本号
// GlobalMsgId.AGENT_REWARD_STATIC= 97; //代理查询


// // GlobalMsgId.BANK_LOGIN = 100; //银行登录（进入）
// GlobalMsgId.BANK_HALL_INFO = 101; //获取银行大厅信息
// GlobalMsgId.BANK_SAVE_COIN =102; //存入银行
// GlobalMsgId.BANK_TAKE_COIN = 103; //取款从银行
// GlobalMsgId.BANK_RECORD_LIST = 104; //银行记录
// GlobalMsgId.BANK_MODIFY_PW = 105; //修改银行密码
// GlobalMsgId.BANK_EXIT = 106; //退出银行
// GlobalMsgId.BANK_TAKE_INGAME = 107; //游戏内银行取款

// GlobalMsgId.NICKNAME_INCLUCE_ILLEGAL_CHARACTER = 1073; //您的昵称包含非法字，请重新修改
// GlobalMsgId.NICKNAME_HAD_USED = 1074;                   //昵称已经被使用

// GlobalMsgId.RECONNECT = 68;
// GlobalMsgId.PURCHASE_GET_ORDER = 70; //获取充值订单号
// GlobalMsgId.PURCHASE_CHECK_ORDER = 71; //充值成功，发送服务端是否有效的订单
// GlobalMsgId.PURCHASE_RECHARGE_SUC = 1035; //充值成功推送
// GlobalMsgId.REWARD_ONLINE = 1036;         //在线奖励通知
// GlobalMsgId.TASK_FINISH_NOTICE = 1037;     //任务完成通知
// GlobalMsgId.POP_FIVE_STAR_NOTICE = 1038;   //五星好评通知

// GlobalMsgId.MONEY_CHANGED = 1010; //财产变化（主要是金币变化）


// GlobalMsgId.GAME_REMOTE_LOGIN = 1017; //异地登录
// GlobalMsgId.GAME_NEED_RESTART = 801; //必须重启app


// //游戏相关协议        
// GlobalMsgId.GAME_FIELDS_LIST_ROOMLIST = 34; //展示指定游戏的全部房间列表
// GlobalMsgId.GAME_CREATEROOM = 31; //创建房间
// GlobalMsgId.GAME_JOINROOM = 32; //加入房间
// GlobalMsgId.GAME_LEVELROOM = 40; //离开房间
// GlobalMsgId.GAME_ENTER_MATCH = 43; //加入匹配场
// GlobalMsgId.RELIEF_FUND = 99;      // 救济金
// GlobalMsgId.ENTER_CASINO = 120;    // 进入真人视讯
// GlobalMsgId.EXIT_CASINO = 121;     // 退出真人视讯

// GlobalMsgId.NOTIFY_SYS_MAINTENANCE = 100049; //维护公告
// GlobalMsgId.NOTIFY_SYS_KICK_HALL = 100050; //房间解散，T回大厅
// GlobalMsgId.NOTIFY_SYS_KICK_LOGIN = 100054; //系统T人，T回登录界面

// GlobalMsgId.GLOBAL_SPEAKER_NOTIFY = 100055;  //全局喇叭通知
// GlobalMsgId.SEND_CHAT_NOTICE = 100056; //发送聊天通知
// GlobalMsgId.PLAYER_LEAVE = 1016         //有玩家离开
// GlobalMsgId.SYNC_PLAYER_INFO = 100057; //同步玩家信息


// //客户端自定义网络消息ID从99000开始
// //游戏断线重连，桌子信息
// GlobalMsgId.GAME_RECONNECT_DESKINFO = 99000;
// GlobalMsgId.GAME_ENTER_BACKGROUND = 9900;

// GlobalMsgId.SCORE_LOG = 27;                 // 上下分记录
// GlobalMsgId.MODIFY_PSW = 26;                // 修改密码
// GlobalMsgId.GAME_LIST = 100059;             // 游戏列表
// GlobalMsgId.JACKTPOT_HALL = 121202;         // 大厅奖池
// GlobalMsgId.JACKPOT_GAME = 121203;          // 游戏奖池
// GlobalMsgId.NOTIFY_KICK = 100906;           //踢出房间
// GlobalMsgId.REQ_REDPACK = 7100;           //请求幸运红包
// GlobalMsgId.OPEN_REDPACK = 7101;           //拆开1个幸运红包
// GlobalMsgId.REQ_LUCKRAIN = 7102;           //请求红包雨
// GlobalMsgId.REQ_GROWUPDATA = 130;          //请求玩家成长值数据
// GlobalMsgId.REQ_LUCKBOX = 131;             //请求玩家成长值奖励详情
// GlobalMsgId.REQ_LUCKBOX_REWARD = 132;      //请求领取玩家成长值奖励
// GlobalMsgId.REQ_AGENT_INFO = 135;          // 代理信息
// GlobalMsgId.REQ_TRANSFER = 142;            // 转账
// GlobalMsgId.REQ_MODIFY_CHARGE_PSW = 136;   // 修改支付密码
// GlobalMsgId.REQ_WITHDRAWAL = 137;          // 提现
// GlobalMsgId.REQ_WITHDRAWAL_RECORD = 138;   // 提现记录
// GlobalMsgId.REQ_AGENTLIST = 139;           // 玩家列表
// GlobalMsgId.REQ_TRANSFER_RECORD = 140;     // 转账记录
// GlobalMsgId.REQ_FAV_CHANGE = 150;     // 收藏通知服务端
// GlobalMsgId.RESET_PSW = 143;              // 重置下级默认密码

// GlobalMsgId.GAME_SITDOWN = 901;             //坐下
// GlobalMsgId.GAME_SITDOWN_NOTICE = 100901;   //通知坐下
// GlobalMsgId.GAME_STANDUP = 52;              //站起来
// GlobalMsgId.GAME_STANDUP_NOTICE = 100908;   //通知站起来
// GlobalMsgId.GAME_BET = 37;                  // 下注
// GlobalMsgId.GAME_BET_NOTICE = 100505;       // 下注通知
// GlobalMsgId.NOTIFY_TIGER_START  = 100500;   // 开始游戏
// GlobalMsgId.NOTIFY_TIGER_START_BET = 100501;   // 开始下注
// GlobalMsgId.NOTIFY_TIGER_STOP_BET  = 100502;   // 停止下注
// GlobalMsgId.NOTIFY_TIGER_OPEN_CARD = 100503;   // 开牌
// GlobalMsgId.NOTIFY_TIGER_OVER_GAME = 100504;   // 计算信息
// GlobalMsgId.TABLE_LIST = 54;                   // 获取桌子列表
// GlobalMsgId.CHANGE_TABLE = 55;                 // 换桌
// GlobalMsgId.ROOM_LIST = 56;                    // 获取房间列表
// GlobalMsgId.HISTORY_LIST = 57;                 // 获取回放列表
// GlobalMsgId.CHAT = 112;                        // 聊天
// GlobalMsgId.CHAT_NOTICE = 100112;              // 聊天通知
// GlobalMsgId.GET_PLAYINFO = 113;                // 获取玩家信息
// GlobalMsgId.GET_EXCHANGE = 133;                // 获取兑换信息
// GlobalMsgId.DS_CONTROL = 114;                  // 单双控制
// GlobalMsgId.DS_CONTROL_NOTIFY=100510;          // 推送控制消息
// GlobalMsgId.DS_PLAYERLIST = 122;               // 获取玩家列表
// GlobalMsgId.DS_OPEN_REDPACKET = 115;           // 开红包
// GlobalMsgId.DS_SHOW_REDPACKET = 123;           // 显示红包
// // GlobalMsgId.BIND_MOBILE = 124;                 // 绑定手机号
// GlobalMsgId.ROOM_LEAVE = 63;                   // 离开房间
// GlobalMsgId.NN_ROOM_LIST = 64;                 // nn列表
// GlobalMsgId.ENVELOPEGET = 152;                 // 红包提取
// GlobalMsgId.ENVELOPEGETNOTES = 153;            // 红包提取记录
// GlobalMsgId.ENVELOPEINFO = 154;                // 红包信息
// GlobalMsgId.GETBANKANDCOIN = 155;              // 登陆银行系统
// GlobalMsgId.BANKCASH = 156;                    // 银行存款
// GlobalMsgId.BANKDEBITS = 157;                  // 银行取款
// GlobalMsgId.ALTERBANKPASSWD = 158;             // 修改银行密码
// GlobalMsgId.BANK_RECORD = 159;                 // 银行记录
// GlobalMsgId.SHOP_INFO = 160;                   // 商城信息
// GlobalMsgId.BUY_GOODS = 161;                   // 购买商品
// GlobalMsgId.WATCH_AD = 162;                    // 观看广告奖励

// GlobalMsgId.CREATECULB = 8801;                 // 创建俱乐部
// GlobalMsgId.JOINCULB = 8802;                   // 加入俱乐部
// GlobalMsgId.AGREECULB = 8803;                  // 同意加入俱乐部
// GlobalMsgId.GETCLUBEONLINEUSERS = 8804;        // 创建俱乐部
// GlobalMsgId.ADDGAME = 8805;                    // 俱乐部创建游戏
// // GlobalMsgId.MODIFGAME = 8806;                  // 俱乐部修改游戏
// GlobalMsgId.ENTERCLUB = 8807;                  // 进入俱乐部
// GlobalMsgId.GETCLUBLIST = 8808;                // 获取俱乐部列表
// GlobalMsgId.CLUBNOTICE = 8809;                 // 获取俱乐部列表
// GlobalMsgId.ALLAGREE = 8810;                   // 全部同意
// GlobalMsgId.REJECTJOINCLUB = 8811;             // 拒绝申请加入
// GlobalMsgId.SEATDOWN = 8812;                   // 坐下
// GlobalMsgId.READY = 35;

// GlobalMsgId.NOTICE_JOINCLUB = 18803;           // 通知加入俱乐部
// GlobalMsgId.NOTICE_ADDNEWTABLE = 18804;        // 新桌子加入
// GlobalMsgId.NOTICE_TABLEINFO = 18805;        // 新桌子加入
// GlobalMsgId.NOTICE_READY = 2000;               // 准备通知
// GlobalMsgId.NOTICE_PLAYER_ENTER = 1003;        // 有玩家加入
// GlobalMsgId.NOTICE_PLAYER_EXIT = 1016;         // 有玩家离开
// GlobalMsgId.SENDCARD = 1006;                   // 发送手牌

// GlobalMsgId.OUTCARD = 1401;                  // 出牌操作
// GlobalMsgId.MOPAI = 1402;                    // 摸牌操作
// GlobalMsgId.PENG = 1403;                     // 碰牌操作
// GlobalMsgId.GANG = 1404;                     // 杠牌
// GlobalMsgId.HU = 1405;                       // 胡牌
// GlobalMsgId.GUO = 1407;                      // 过
// GlobalMsgId.CANCELTUOGUAN = 1408;            // 取消托管
// GlobalMsgId.CHI = 1409;                      // 吃

// GlobalMsgId.NOTIFY_SHOW_ACTION = 101400;     // --通知玩家显示出碰或者杠或者胡牌的按钮
// GlobalMsgId.NOTIFY_OUTCARD = 101401;         // 出牌通知
// GlobalMsgId.NOTIFY_MOPAI = 101402;           // 摸牌通知
// GlobalMsgId.NOTIFY_PENG = 101403;            // 碰牌通知
// GlobalMsgId.NOTIFY_GANG = 101404;            // 杠牌通知
// GlobalMsgId.NOTIFY_HU = 101405;              // 胡牌通知
// GlobalMsgId.NOTIFY_OUTCARD_ERROR = 101406;   //出牌出错了，同步手牌，出牌
// GlobalMsgId.NOTIFY_HZ_LIUJU =  101407;            //流局通知
// GlobalMsgId.NOTIFY_GUO = 101408;           // 过通知
// GlobalMsgId.NOTIFY_TUOGUAN_SUCEESS = 101409;      // 取消托管通知
// GlobalMsgId.NOTIFY_HZ_PAO = 101411;         // 通知玩家跑起
// GlobalMsgId.NOTIFY_HZ_KAN = 101412;         // 通知玩家扫
// GlobalMsgId.NOTIFY_HZ_TILONG  = 101413;     // 通知玩家踢龙
// GlobalMsgId.NOTIFY_CHI = 101410;            // 通知吃
// GlobalMsgId.NOTIFY_GAME_OVER = 101415;      // 大结算
// GlobalMsgId.NOTIFY_DELETE_TABLE = 18808;    // 删除桌子
// GlobalMsgId.DEL_HANDCARD = 101416;          // 删除手牌
// GlobalMsgId.CHAT = 112;                     // 聊天
// GlobalMsgId.CHAT_NOTIFY = 2006;             // 聊天通知
// GlobalMsgId.OFFLINE_NOTIFY = 2009;          // 掉线通知通知

// GlobalMsgId.SELF_GPS_DATA = 163;            // 发送定位数据
// GlobalMsgId.PLAYER_DISTANCE_DATA = 8813;    // 玩家距离数据
// GlobalMsgId.GPS_TIPS_NOTIFY = 18809;        // 玩家距离提示通知

// GlobalMsgId.GAME_RECORD = 165;              // 大局战绩
// GlobalMsgId.ROUND_RECORD = 166;             // 小局战绩

// GlobalMsgId.APPLY_DISMISS = 65;             // 发起解散
// GlobalMsgId.AGREE_DISMISS = 66;             // 同意解散
// GlobalMsgId.REFUSE_DISMISS = 67;            // 拒绝解散
// GlobalMsgId.APPLY_DISMISS_NOTIFY = 1019;    // 发起解散通知
// GlobalMsgId.AGREE_DISMISS_NOTIFY  = 1020;   // 同意解散通知
// GlobalMsgId.REFUSE_DISMISS_NOTIFY  = 1021;  // 拒绝解散通知
// GlobalMsgId.SUCCESS_DISMISS_NOTIFY = 1023;  // 成功解散通知

// GlobalMsgId.GER_PHONE_CODE = 164;           // 获取验证码
// GlobalMsgId.BIND_PHONE = 124;               // 绑定手机

// GlobalMsgId.FREEZE_CLUB = 8814;             // 冻结俱乐部
// GlobalMsgId.DISMISS_CLUB = 8815;            // 解散俱乐部
// GlobalMsgId.EXIT_CLUB_APPLY = 8816;                 // 退出俱乐部

// GlobalMsgId.CLUB_EXIT_APPLY_NOTIFY = 18812; // 俱乐部申请退出通知

// GlobalMsgId.CLUB_EXIT_APPLY_LIST = 8817;    // 获取俱乐部申请退出列表
// GlobalMsgId.CLUB_REFUSE_EXIT = 8818;        // 拒绝退出俱乐部
// GlobalMsgId.CLUB_ALL_AGREE_EXIT = 8819;     // 全部同意退出俱乐部
// GlobalMsgId.CLUB_AGREE_EXIT = 8820;         // 同意退出俱乐部

// GlobalMsgId.CLUB_MEMBER_LIST = 8821;        // 俱乐部成员列表

// GlobalMsgId.TICKOUT_CLUB_MEMBER = 8822;     // 踢出俱乐部成员

// GlobalMsgId.FREEZE_CLUB_NOTIFY = 18811;     // 冻结/解冻俱乐部通知
// GlobalMsgId.DISMISS_CLUB_NOTIFY = 18810;    // 解散俱乐部通知

// GlobalMsgId.WARN_5_FU = 167;                //5福警报

// //跑得快
// GlobalMsgId.OUT_CARD = 1410;                //出牌
// GlobalMsgId.OUT_CARD_NOTIFY = 101417;       //出牌提示通知
// GlobalMsgId.SCORE_UPDATE_NOTIFY = 18814;    //得分更新

// GlobalMsgId.CLUB_DELETE_TABLE = 8806;       // 俱乐部删除桌子

// GlobalMsgId.GAME_SWITCH_CLUB = 168;         // 从游戏切换至俱乐部
// GlobalMsgId.CLUB_SWITCH_GAME = 18815;       // 从俱乐部切换至游戏

// GlobalMsgId.UPDATE_TABLE_INFO = 100;        // 刷新桌子信息
