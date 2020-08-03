
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
        // this.onRcvBatteryChangeNotify();

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

        cc.find("scene/bg_top/node_play/play_2player",this.node).active = (2 == conf.seat);
        cc.find("scene/bg_top/node_play/play_3player",this.node).active = (3 == conf.seat);

        this.node.addComponent("PaoDeKuai_Card").init(this.cardsAtlas);

        let btnMsg = cc.find("scene/operate_btn_view/btn_msg",this.node);
        Global.btnClickEvent(btnMsg,this.onShowMsg,this);

        // this.node.addComponent("PaoDeKuai_Menu");

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

        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.BATTERY_CHANGE_NOTIFY, this.onRcvBatteryChangeNotify,this);

        //  let data ={notyScoreChang:[{seat:2,roundScore:6},{seat:1,roundScore:-6}],
        //      c:101405,code:200,seat:2,gameid:1,hcard:203,hupaiType:1,
        //      users:[{qipai:[206],menzi:[{card:208,type:6},
        //          {card:205,type:6},{card:108,type:6}],
        //          roundScore:6,usericon:6,zhongZhangCount:0,
        //          ip:"",cluster_info:{address:121,server:""},
        //          huPaiCount:1,playername:"q111111",dianPaoCount:0,curTime:0,seat:2,
        //          notChiPai:[206,206],time:0,ofline:0,state:2,uid:110002,autoc:0,sex:1,
        //          handInCards:[209,103,109,109,203],notPengPai:[],score:6,
        //          notHuPai:[206]},{qipai:[],menzi:[{card:105,type:6},{card:103,type:6}],
        //          roundScore:-6,usericon:10,zhongZhangCount:0,ip:"",
        //          cluster_info:{address:120,server:""},huPaiCount:0,playername:"G18295",
        //          dianPaoCount:1,curTime:0,seat:1,notChiPai:[203],time:0,ofline:0,state:2,uid:110028,autoc:0,sex:1,
        //          handInCards:[104,104,203,205,206,208,208,108],notPengPai:[],score:-6,notHuPai:[203]}],source:1,diPai:[103,103]}
        // // let data2 = {actionInfo:{waitList:[],iswait:0,prioritySeat:0,nextaction:{seat:1,type:2},curaction:{type:7,time:500,card:101,seat:2,source:0}},
        // //     notyScoreChang:[{seat:2,roundScore:-6},{seat:1,roundScore:6}],delQiPaiSeat:1,code:200,seat:1,gameid:1,delQiPaiCard:101,c:101411}
        // //
        // let index = 0;
        // this.schedule(()=>{
        //     ++index;
        //     if(index === 1){
        //         Global.dispatchEvent(EventId.HU_NOTIFY,data);
        //
        //
        //     }
        //     // else if(index === 2){
        //     //     Global.dispatchEvent(EventId.PAO_NOTIFY,data2);
        //     // }
        // },1,1,1)
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
    },

    onShowMsg(){
        Global.dispatchEvent(EventId.SHOW_CHAT);
    },

    onDestroy(){
        this.txt_date.stopAllActions();
    },
    // update (dt) {},
});
