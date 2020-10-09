
cc.Class({
    extends: cc.Component,

    properties: {
        cardsAtlas:cc.SpriteAtlas,
        emjoAtlas:cc.SpriteAtlas,
        tableAtlas:cc.SpriteAtlas,
        yinxiAtlas:cc.SpriteAtlas,
        tingAtlas:cc.SpriteAtlas,
        _gameCount:0,

    },

    start () {
        Global.autoAdaptDevices(false);

        this.txt_date = cc.find("scene/bg_view/room_info/txt_date",this.node);
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
        let roomId = cc.find("scene/bg_view/room_info/txt_room_id",this.node);
        roomId.getComponent(cc.Label).string = "房间号:"+conf.deskId;

        this._gameCount = conf.gamenum;
        this.updateCount(cc.vv.gameData.getDeskInfo().round);

        let txt_game_desc = cc.find("scene/bg_view/room_info/img_hear_bg/txt_game_desc",this.node);
        txt_game_desc.getComponent(cc.Label).string = cc.vv.gameData.getWanFaStrSimple();

        let txt_game_desc_detail = cc.find("scene/bg_view/room_info/img_hear_bg/txt_game_desc_detail",this.node);
        txt_game_desc_detail.getComponent(cc.Label).string = cc.vv.gameData.getWanFaStrDetail();


        let btnMsg = cc.find("scene/operate_btn_view/btn_msg",this.node);
        Global.btnClickEvent(btnMsg,this.onShowMsg,this);

        this.node.addComponent("HongZhong_Card").init();

        for(let i = 0; i < cc.vv.gameData.RoomSeat; ++i){
            // this.node.addComponent("HongZhong_ShowCard").init(i,conf.seat);
            this.node.addComponent("HongZhong_Player").init(i,conf.seat,this.emjoAtlas);
            this.node.addComponent("HongZhong_OutCard").init(i,conf.seat);
            this.node.addComponent("HongZhong_HandCard").init(i,conf.seat);
        }
        this.node.addComponent("HongZhong_Operate");
        this.node.addComponent("HongZhong_Tips");
        this.node.addComponent("HongZhong_Action");
        // this.node.addComponent("HongZhong_RemainCard");
        this.node.addComponent("HongZhong_RoundOver").init(this.tableAtlas);
        this.node.addComponent("HongZhong_GameOver").init(this.tableAtlas,this.yinxiAtlas);
        this.node.addComponent("HongZhong_Sound");
        this.node.addComponent("HongZhong_Chat");
        this.node.addComponent("HongZhong_Setting");

        Global.registerEvent(EventId.HANDCARD,this.recvHandCard,this);
        Global.registerEvent(EventId.BATTERY_CHANGE_NOTIFY, this.onRcvBatteryChangeNotify,this);

        Global.starBatteryReceiver();

        //防玩家同时进入，刷新桌子信息
        let deskInfo = cc.vv.gameData.getDeskInfo();
        if (!deskInfo._isPlayBack) {
            let req = {c: MsgId.UPDATE_TABLE_INFO};
            cc.vv.NetManager.send(req);
        }
    },

    onRcvBatteryChangeNotify(data){
        let spr_battery = cc.find("scene/bg_view/room_info/bg_battery/spr_battery",this.node);
        spr_battery.scaleX = parseInt(data.detail) / 100;
    },

    recvHandCard(data){
        data = data.detail;
        this.updateCount(data.round);
    },

    updateCount(count){
        let round = cc.find("scene/bg_view/room_info/txt_round_num",this.node);
        round.getComponent(cc.Label).string = "("+count+"/"+this._gameCount+"局)";
        cc.vv.gameData.setCurRound(count);
    },

    onShowMsg(){
        Global.dispatchEvent(EventId.SHOW_CHAT);
    },

    onDestroy(){
        this.txt_date.stopAllActions();
    },
    // update (dt) {},
});
