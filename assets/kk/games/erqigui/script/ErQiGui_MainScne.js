
cc.Class({
    extends: cc.Component,

    properties: {
        
        cardsAtlas:cc.SpriteAtlas,
        emjoAtlas:cc.SpriteAtlas,
        starSpr:cc.SpriteFrame,
        maxCardSpr:cc.SpriteFrame,
        _gameCount:0,

    },

    start () {
        Global.autoAdaptDevices(false);

        this.initUI();

        this.node.addComponent("ErQiGui_Card").init(this.cardsAtlas, this.starSpr, this.maxCardSpr);
        this.node.addComponent("ErQiGui_Menu");

        let conf = cc.vv.gameData.getRoomConf();
        for(let i = 0; i < cc.vv.gameData.RoomSeat; ++i){
            // this.node.addComponent("ErQiGui_ShowCard").init(i,conf.seat);
            this.node.addComponent("ErQiGui_Player").init(i,conf.seat,this.emjoAtlas);
            this.node.addComponent("ErQiGui_OutCard").init(i,conf.seat);
            // this.node.addComponent("ErQiGui_OperatePai").init(i,conf.seat);
            // this.node.addComponent("ErQiGui_HandCard").init(i,conf.seat);
            this.node.addComponent("ErQiGui_HandCard_Operate").init(i);
        }
        // this.node.addComponent("ErQiGui_HandCard_Operate").init(0);
        // this.node.addComponent("ErQiGui_Operate");
        // this.node.addComponent("ErQiGui_Tips");
        // this.node.addComponent("ErQiGui_Action");
        // this.node.addComponent("ErQiGui_RemainCard");
        this.node.addComponent("ErQiGui_RoundOver");
        this.node.addComponent("ErQiGui_GameOver");
        this.node.addComponent("ErQiGui_Sound");
        this.node.addComponent("ErQiGui_Chat");
        this.node.addComponent("ErQiGui_Setting");
        // this.node.addComponent("ErQiGui_CardLogic").init();

        Global.registerEvent(EventId.BATTERY_CHANGE_NOTIFY, this.onRcvBatteryChangeNotify,this);
        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);
        Global.registerEvent(EventId.PLAY_BACK_MSG_LIST, this.onRcvPlayBackMsgList, this);
        
        Global.starBatteryReceiver();

        //回放
        let deskInfo = cc.vv.gameData.getDeskInfo();
        this.deskInfo = deskInfo;
        if (this.deskInfo._isPlayBack) {
            cc.find("scene/operate_btn_view/btn_msg",this.node).active = false;
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

    initUI(){
        this.txt_date = cc.find("scene/bg_left_top/txt_date",this.node);
        let that = this;
        that.txt_date.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.callFunc(()=>{
                        let date = new Date();
                        let dateStr = date.getHours() + ":" + date.getMinutes();
                        that.txt_date.getComponent(cc.Label).string = dateStr;
                    }), 
                    cc.delayTime(1)
                )
            )
        )

        let conf = cc.vv.gameData.getRoomConf();
        let roomId = cc.find("scene/bg_left_top/txt_room_id",this.node);
        roomId.getComponent(cc.Label).string = "房号: "+conf.deskId;

        let str = "";
        let list = cc.vv.gameData.getWanFa();
        for(let i=0;i<list.length;++i){
            str += list[i];
        }
        let text_rule = cc.find("scene/panel_rule/text_rule",this.node);
        text_rule.getComponent(cc.Label).string = str;

        this._gameCount = conf.gamenum;
        this.updateCount(cc.vv.gameData.getDeskInfo().round);

        let btnMsg = cc.find("scene/operate_btn_view/btn_msg",this.node);
        Global.btnClickEvent(btnMsg,this.onShowMsg,this);
    },

    onRcvBatteryChangeNotify(data){
        let spr_battery = cc.find("scene/bg_left_top/bg_battery/spr_battery",this.node);
        spr_battery.scaleX = parseInt(data.detail) / 100;
    },

    onRecvHandCard(data){
        data = data.detail;
        this.updateCount(data.round);
    },

    updateCount(count){
        let round = cc.find("scene/bg_left_top/txt_round_num",this.node);
        round.getComponent(cc.Label).string = "局数: "+count+"/"+this._gameCount+"";
        cc.vv.gameData.setCurRound(count);
    },

    recvRoundOver(){
        if (this.deskInfo._isPlayBack){
            this.playBackMsgIsCanReques = false;
        }
    },

    onShowMsg(){
        Global.dispatchEvent(EventId.SHOW_CHAT);
    },

    onDestroy(){
        this.txt_date.stopAllActions();
    },
});
