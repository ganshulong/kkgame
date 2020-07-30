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
        _gameCount:0,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        Global.autoAdaptDevices(false);

        Global.starBatteryReceiver();
        // this.onRcvBatteryChangeNotify();

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

        let selectData = new Date();
        this.curData = {};
        this.curData.year = selectData.getFullYear();
        this.curData.month = selectData.getMonth();     //比实际小1
        this.curData.day = selectData.getDate();

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

        this.node.addComponent("LiuHuQiang_Card").init(this.cardsAtlas);

        let btnMsg = cc.find("scene/operate_btn_view/btn_msg",this.node);
        Global.btnClickEvent(btnMsg,this.onShowMsg,this);

        // this.node.addComponent("LiuHuQiang_Menu");

        for(let i = 0; i < 4; ++i){
            this.node.addComponent("LiuHuQiang_ShowCard").init(i,conf.seat);
            this.node.addComponent("LiuHuQiang_Player").init(i,conf.seat,this.emjoAtlas);
            this.node.addComponent("LiuHuQiang_OutCard").init(i,conf.seat);
            this.node.addComponent("LiuHuQiang_OperatePai").init(i,conf.seat);
            this.node.addComponent("LiuHuQiang_HandCard").init(i,conf.seat);
        }
        this.node.addComponent("LiuHuQiang_HandCard").init();
        this.node.addComponent("LiuHuQiang_Operate");
        this.node.addComponent("LiuHuQiang_Tips");
        this.node.addComponent("LiuHuQiang_Action");
        this.node.addComponent("LiuHuQiang_RemainCard");
        this.node.addComponent("LiuHuQiang_RoundOver").init(this.tableAtlas);
        this.node.addComponent("LiuHuQiang_GameOver").init(this.tableAtlas,this.yinxiAtlas);
        this.node.addComponent("LiuHuQiang_Sound");
        this.node.addComponent("LiuHuQiang_Chat");
        this.node.addComponent("LiuHuQiang_Setting");

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
    },

    onShowMsg(){
        Global.dispatchEvent(EventId.SHOW_CHAT);
    },

    onDestroy(){
        this.txt_date.stopAllActions();
    },
    // update (dt) {},
});
