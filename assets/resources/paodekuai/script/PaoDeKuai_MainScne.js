
cc.Class({
    extends: cc.Component,

    properties: {
        
        cardsAtlas:cc.SpriteAtlas,
        emjoAtlas:cc.SpriteAtlas,
        tableAtlas:cc.SpriteAtlas,
        yinxiAtlas:cc.SpriteAtlas,
        _gameCount:0,

    },

    start () {
        Global.autoAdaptDevices(false);
        Global.starBatteryReceiver();

        this.initUI();

        this.node.addComponent("PaoDeKuai_Card").init(this.cardsAtlas);
        this.node.addComponent("PaoDeKuai_Menu");

        let conf = cc.vv.gameData.getRoomConf();
        for(let i = 0; i < cc.vv.gameData.RoomSeat; ++i){
            this.node.addComponent("PaoDeKuai_ShowCard").init(i,conf.seat);
            this.node.addComponent("PaoDeKuai_Player").init(i,conf.seat,this.emjoAtlas);
            this.node.addComponent("PaoDeKuai_OutCard").init(i,conf.seat);
            this.node.addComponent("PaoDeKuai_OperatePai").init(i,conf.seat);
            this.node.addComponent("PaoDeKuai_HandCard").init(i,conf.seat);
        }
        this.node.addComponent("PaoDeKuai_HandCard").init();
        this.node.addComponent("PaoDeKuai_Operate");
        this.node.addComponent("PaoDeKuai_Tips");
        this.node.addComponent("PaoDeKuai_Action");
        this.node.addComponent("PaoDeKuai_RemainCard");
        this.node.addComponent("PaoDeKuai_RoundOver").init(this.tableAtlas);
        this.node.addComponent("PaoDeKuai_GameOver").init(this.tableAtlas,this.yinxiAtlas);
        this.node.addComponent("PaoDeKuai_Sound");
        this.node.addComponent("PaoDeKuai_Chat");
        this.node.addComponent("PaoDeKuai_Setting");

        Global.registerEvent(EventId.BATTERY_CHANGE_NOTIFY, this.onRcvBatteryChangeNotify,this);
        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvOverRound,this);
    },

    initUI(){
        this.txt_date = cc.find("scene/bg_top/txt_date",this.node);
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
        let roomId = cc.find("scene/bg_top/txt_room_id",this.node);
        roomId.getComponent(cc.Label).string = "房号:"+conf.deskId;

        this._gameCount = conf.gamenum;
        this.updateCount(cc.vv.gameData.getDeskInfo().round);

        let str = "";
        let list = cc.vv.gameData.getWanFa();
        for(let i=0;i<list.length;++i){
            str += list[i];
            if(i===2) str += "\n";
        }
        let desc = cc.find("scene/bg_top/txt_game_desc",this.node);
        desc.getComponent(cc.Label).string = str;

        cc.find("scene/spr_cards" ,this.node).active = false;

        cc.find("scene/bg_top/node_play/play_2player",this.node).active = (2 == conf.seat);
        cc.find("scene/bg_top/node_play/play_3player",this.node).active = (3 == conf.seat);

        let btnMsg = cc.find("scene/operate_btn_view/btn_msg",this.node);
        Global.btnClickEvent(btnMsg,this.onShowMsg,this);
    },

    onRcvBatteryChangeNotify(data){
        let spr_battery = cc.find("scene/bg_top/bg_battery/spr_battery",this.node);
        spr_battery.scaleX = parseInt(data.detail) / 100;
    },

    onRecvHandCard(data){
        data = data.detail;
        this.updateCount(data.round);
    },

    updateCount(count){
        let round = cc.find("scene/bg_top/txt_round_num",this.node);
        round.getComponent(cc.Label).string = "("+count+"/"+this._gameCount+"局)";

        if (3 == cc.vv.gameData.getRoomConf().seat) {
            cc.find("scene/spr_cards" ,this.node).active = true;
        }
    },

    recvOverRound(){
        if (3 == cc.vv.gameData.getRoomConf().seat) {
            cc.find("scene/spr_cards" ,this.node).active = false;
        }
    },

    onShowMsg(){
        Global.dispatchEvent(EventId.SHOW_CHAT);
    },

    onDestroy(){
        this.txt_date.stopAllActions();
    },
    // update (dt) {},
});
