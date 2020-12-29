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
        cardsAtlas:cc.SpriteAtlas,
        emjoAtlas:cc.SpriteAtlas,
        tableAtlas:cc.SpriteAtlas,
        yinxiAtlas:cc.SpriteAtlas,
        tingAtlas:cc.SpriteAtlas,
        _gameCount:0,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        Global.autoAdaptDevices(false);

        this.txt_date = cc.find("scene/room_info/txt_date",this.node);
        let that = this;
        that.txt_date.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.callFunc(()=>{
                        let date = new Date();
                        let dateStr = "";
                        let month = date.getMonth() + 1;
                        dateStr += (10 > month) ? "0" : "";
                        dateStr += month + "月";
                        let day = date.getDate();
                        dateStr += (10 > day) ? "0" : "";
                        dateStr += day + "日";
                        dateStr += date.toTimeString().split(' ')[0];
                        that.txt_date.getComponent(cc.Label).string = dateStr;
                    }), 
                    cc.delayTime(1)
                )
            )
        )

        let conf = cc.vv.gameData.getRoomConf();
        let roomId = cc.find("scene/room_info/txt_room_id",this.node);
        roomId.getComponent(cc.Label).string = "游戏号:"+conf.deskId;

        this._gameCount = conf.gamenum;
        this.updateCount(cc.vv.gameData.getDeskInfo().round);

        let str = "";
        let list = cc.vv.gameData.getWanFa();
        for(let i=0;i<list.length;++i){
            str += list[i];
            if(i===2) str += "\n";
        }
        let desc = cc.find("scene/room_info/txt_game_desc",this.node);
        desc.getComponent(cc.Label).string = str;

        this.node.addComponent("PaoHuZi_Card").init(this.cardsAtlas);

        let btnMsg = cc.find("scene/operate_btn_view/btn_msg",this.node);
        Global.btnClickEvent(btnMsg,this.onShowMsg,this);
        btnMsg.getComponent(cc.Button).interactable = !conf.interact;

        cc.find("scene/panel_ting",this.node).active = false;

        let deskInfo = cc.vv.gameData.getDeskInfo();
        if(deskInfo.isReconnect){
            for(let i=0;i<deskInfo.users.length;++i){
                let chairId = cc.vv.gameData.getLocalChair(deskInfo.users[i].seat);
                let uiSeat = cc.vv.gameData.getUISeatBylocalSeat(chairId);
                if(0 == uiSeat && 0 < deskInfo.users[i].tingPaiInfo.length){
                    this.showTingCards(deskInfo.users[i].tingPaiInfo);
                }
            }
        }

        // this.node.addComponent("PaoHuZi_Menu");

        for(let i=0;i<3;++i){
            this.node.addComponent("PaoHuZi_ShowCard").init(i,conf.seat);
            this.node.addComponent("PaoHuZi_Player").init(i,conf.seat,this.emjoAtlas);
            this.node.addComponent("PaoHuZi_OutCard").init(i,conf.seat);
            this.node.addComponent("PaoHuZi_OperatePai").init(i,conf.seat);
            this.node.addComponent("PaoHuZi_HandCard").init(i,conf.seat);
        }
        // this.node.addComponent("PaoHuZi_HandCard").init();
        this.node.addComponent("PaoHuZi_Operate");
        this.node.addComponent("PaoHuZi_Tips");
        this.node.addComponent("PaoHuZi_Action");
        this.node.addComponent("PaoHuZi_RemainCard");
        this.node.addComponent("PaoHuZi_RoundOver").init(this.tableAtlas);
        this.node.addComponent("PaoHuZi_GameOver").init(this.tableAtlas,this.yinxiAtlas);
        this.node.addComponent("PaoHuZi_Sound");
        this.node.addComponent("PaoHuZi_Chat");
        this.node.addComponent("PaoHuZi_Setting");

        this.node.addComponent("TipGameContinue");

        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.BATTERY_CHANGE_NOTIFY, this.onRcvBatteryChangeNotify,this);
        Global.registerEvent(EventId.OUTCARD_RESULT, this.onRcvOutCardResult,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);
        Global.registerEvent(EventId.PLAY_BACK_MSG_LIST, this.onRcvPlayBackMsgList, this);

        Global.starBatteryReceiver();

        //回放
        this.deskInfo = deskInfo;
        if (this.deskInfo._isPlayBack) {
            btnMsg.active = false;
            cc.find("scene/operate_btn_view/btn_voice",this.node).active = false;

            this.playBackMsgList = [];
            this.playBackInterval = 2;
            this.playBackCountdown = this.playBackInterval;
            this.playBackMsgNextReqStartid = 2;
            this.playBackMsgIsCanReques = true;
            this.playBackMsgIsPause = false;
        }
        let panel_playBack = cc.find("scene/panel_playBack", this.node);
        panel_playBack.active = cc.vv.gameData._isPlayBack;
        if (panel_playBack.active) {
            this.btn_start = panel_playBack.getChildByName("btn_start");
            this.btn_start.active = false;
            Global.btnClickEvent(this.btn_start,this.onClickPlayBackStart,this);
            this.btn_pause = panel_playBack.getChildByName("btn_pause");
            Global.btnClickEvent(this.btn_pause,this.onClickPlayBackPause,this);
            let btn_next = panel_playBack.getChildByName("btn_next");
            Global.btnClickEvent(btn_next,this.onClickPlayBackNext,this);
            let btn_back = panel_playBack.getChildByName("btn_back");
            Global.btnClickEvent(btn_back,this.onClickPlayBackBack,this);
        }

        //防玩家同时进入，刷新桌子信息
        if (!deskInfo._isPlayBack) {
            let req = {c: MsgId.UPDATE_TABLE_INFO};
            cc.vv.NetManager.send(req);
        }
    },

    onClickPlayBackStart(){
        this.btn_start.active = false;
        this.btn_pause.active = true;
        this.playBackMsgIsPause = false;
    },

    onClickPlayBackPause(){
        this.btn_start.active = true;
        this.btn_pause.active = false;
        this.playBackMsgIsPause = true;
    },

    onClickPlayBackNext(){
        this.playBackCountdown = 0;
        this.onClickPlayBackStart();
    },

    onClickPlayBackBack(){
        cc.vv.UserManager.currClubId = this.deskInfo.conf.clubid;
        cc.vv.gameData.clear();
        Global.backRecordData = {};
        Global.backRecordData.clubid = this.deskInfo.clubid;
        Global.backRecordData.deskid = this.deskInfo.deskid;
        cc.vv.SceneMgr.enterScene(this.deskInfo.fromSence);
    },

    onRcvPlayBackMsgList(data){
        data = data.detail;
        this.playBackMsgList = data.data;
        this.playBackMsgNextReqStartid = data.startid + 10;
        this.playBackMsgIsCanReques = true;
    },

    update (dt) {
        if (this.deskInfo._isPlayBack && !this.playBackMsgIsPause) {
            this.playBackCountdown -= dt;
            if (0 < this.playBackMsgList.length) {
                if (0 > this.playBackCountdown) {
                    this.playBackCountdown = this.playBackInterval;
                    let msgItemData = this.playBackMsgList.shift();
                    let msgItem = JSON.parse(msgItemData.data);
                    cc.vv.NetManager.handleMsg(msgItem);
                }
            } else {
                if (this.playBackMsgIsCanReques) {
                    var req = { 'c': MsgId.PLAY_BACK_MSG_LIST};
                    req.fromSence = this.deskInfo.fromSence;
                    req.clubid = this.deskInfo.clubid;
                    req.deskid = this.deskInfo.deskid;
                    req.round = this.deskInfo.round;
                    req.startid = this.playBackMsgNextReqStartid;
                    req.endid = this.playBackMsgNextReqStartid + 9;
                    cc.vv.NetManager.send(req);
                    this.playBackMsgIsCanReques = false;
                }
            }
        }
    },

    onRcvOutCardResult(data){
        let tingPaiInfo = data.detail
        this.showTingCards(tingPaiInfo);
    },

    showTingCards(tingPaiInfo){
        cc.find("scene/panel_ting",this.node).active = 0 < tingPaiInfo.length;
        if (0 < tingPaiInfo.length) {
            let ting_cards = cc.find("scene/panel_ting/ting_cards",this.node);
            ting_cards.removeAllChildren();
            for (let i = 0; i < tingPaiInfo.length; i++) {
                let cardNode = new cc.Node();
                cardNode.addComponent(cc.Sprite);
                if (200 < tingPaiInfo[i]) {
                    tingPaiInfo[i] -= (200-16);
                } else {
                    tingPaiInfo[i] -= 100;
                }
                cardNode.getComponent(cc.Sprite).spriteFrame = this.tingAtlas.getSpriteFrame("hongheihu-imgs-ting-" + tingPaiInfo[i]);
                cardNode.parent = ting_cards;
                cardNode.x = i * (37 + 3);
            }
        }
    },

    recvRoundOver(data){
        cc.find("scene/panel_ting",this.node).active = false;
        if (this.deskInfo._isPlayBack){
            this.playBackMsgIsCanReques = false;
        }
    },

    onRcvBatteryChangeNotify(data){
        let spr_battery = cc.find("scene/room_info/bg_battery/spr_battery",this.node);
        spr_battery.scaleX = parseInt(data.detail) / 100;
    },

    onRecvHandCard(data){
        data = data.detail;
        this.updateCount(data.round);
    },

    updateCount(count){
        let round = cc.find("scene/room_info/txt_round_num",this.node);
        round.getComponent(cc.Label).string = "("+count+"/"+this._gameCount+"局)";
        cc.vv.gameData.setCurRound(count);
    },

    onShowMsg(){
        Global.dispatchEvent(EventId.SHOW_CHAT);
    },

    onDestroy(){
        this.txt_date.stopAllActions();
    },
});
