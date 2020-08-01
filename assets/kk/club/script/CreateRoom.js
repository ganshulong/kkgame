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
        _createLayer:null,
        _isClubRoom:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    /*gameInfo.clubid
    gameInfo.gameid :1
    gameInfo.seat :人数
    gameInfo.gamenum: 局数
    gameInfo.param1 --中庄家方式
     gameInfo.ipcheck 同ip
     gameInfo.distance 距离
     gameInfo.score 积分
     gameInfo.speed 速度
     gameInfo.tname // 桌名
     gameInfo.trustee // 托管
     */

    start () {
        cc.vv.NetManager.registerMsg(MsgId.ADDGAME, this.onRcvAddGameResult, this);

        Global.registerEvent(EventId.GAME_CREATEROOM,this.showCreateRoom,this);
    },

    showCreateRoom(isClubRoo, index){
        this._isClubRoom = isClubRoo;
        this.curGameIndex = index ? index : 0;
        if(this._createLayer === null){
            cc.loader.loadRes("common/prefab/create_room",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._createLayer = cc.instantiate(prefab);
                    this._createLayer.setContentSize(cc.size(this.node.width, this.node.height));
                    this._createLayer.parent = this.node;
                    this._createLayer.zIndex = 1;
                    this._createLayer.x = this.node.width/2 - this.node.x;
                    this._createLayer.y = this.node.height/2 - this.node.y;

                    this.initUI();
                    this.showGameType();
                }
            })
        }
        else{
            this._createLayer.active = true;
            this.showGameType();
        }
    },

    initUI(){
        this.gameTypeIndex = {
            PengHu:0,
            PaoHuZi:1,
            HongHeiHu:2,
            LiuHuQiang:3,
            PaoDeKuai:4
        };

        let btn_back = this._createLayer.getChildByName("btn_back");
        Global.btnClickEvent(btn_back,this.onClose,this);

        this.gameBtns = this._createLayer.getChildByName("gameBtns");
        for (var i = 0; i < this.gameBtns.children.length; i++) {
            this.gameBtns.children[i].index = i;
            Global.btnClickEvent(this.gameBtns.children[i],this.onClickGameType,this);
        }

        //碰胡
        let panel_penghu = cc.find("img_bg/panel_penghu",this._createLayer);
        let btn_create_room_penghu = cc.find("right_bg/btn_create_room", panel_penghu);
        Global.btnClickEvent(btn_create_room_penghu,this.onCreatePengHu,this);

        //跑胡子
        let panel_paohuzi = cc.find("img_bg/panel_paohuzi",this._createLayer);
        let btn_create_room_paohuzi = cc.find("right_bg/btn_create_room", panel_paohuzi);
        Global.btnClickEvent(btn_create_room_paohuzi,this.onCreatePaoHuZi,this);

        //红黑胡
        let panel_hongheihu = cc.find("img_bg/panel_hongheihu",this._createLayer);
        let btn_create_room_hongheihu = cc.find("right_bg/btn_create_room", panel_hongheihu);
        Global.btnClickEvent(btn_create_room_hongheihu,this.onCreateHongHeiHu,this);

        //六胡抢
        let panel_liuhuqiang = cc.find("img_bg/panel_liuhuqiang",this._createLayer);
        let btn_create_room_liuhuqiang = cc.find("right_bg/btn_create_room", panel_liuhuqiang);
        Global.btnClickEvent(btn_create_room_liuhuqiang,this.onCreateLiuHuQiang,this);

        //跑得快
        let panel_paodekuai = cc.find("img_bg/panel_paodekuai",this._createLayer);
        let btn_create_room_paodekuai = cc.find("right_bg/btn_create_room", panel_paodekuai);
        Global.btnClickEvent(btn_create_room_paodekuai,this.onCreatePaoDeKuai,this);

        this.gamePanels = [panel_penghu, panel_paohuzi, panel_hongheihu, panel_liuhuqiang, panel_paodekuai];

        for (let i = 0; i < this.gamePanels.length; i++) {
            let bg_score = cc.find("right_bg/scrollview/content/bg_score", this.gamePanels[i]);
            let btn_deduction = bg_score.getChildByName("btn_deduction");
            Global.btnClickEvent(btn_deduction,this.onClickScoreDedution,this);
            let btn_add = bg_score.getChildByName("btn_add");
            Global.btnClickEvent(btn_add,this.onClickScoreAdd,this);
        }

        this.clearPengHu();
        this.clearPaoHuZi();
        this.clearHongHeiHu();
        this.clearLiuHuQiang();
        this.clearPaoDeKuai();
    },

    showGameType(){
        for (var i = 0; i < this.gameBtns.children.length; i++) {
            let toggle = this.gameBtns.getChildByName("toggle" + i);
            toggle.getComponent(cc.Toggle).isChecked = (this.curGameIndex === i);
            this.gamePanels[i].active = (this.curGameIndex === i);
        }
    },

    onClickGameType(event){
        this.curGameIndex = event.target.index;
        this.showGameType();
    },

    onClickScoreDedution(){
        let text_score = cc.find("right_bg/scrollview/content/bg_score/text_score",this.gamePanels[this.curGameIndex]);
        let score = parseInt(text_score.getComponent(cc.Label).string);
        if (1 < score) {
            --score;
            text_score.getComponent(cc.Label).string = score;
        }
    },

    onClickScoreAdd(){
        let text_score = cc.find("right_bg/scrollview/content/bg_score/text_score",this.gamePanels[this.curGameIndex]);
        let score = parseInt(text_score.getComponent(cc.Label).string);
        if (10 > score) {
            ++score;
            text_score.getComponent(cc.Label).string = score;
        }
    },

    onClose(){
        this._createLayer.active = false;
    },

    onRcvAddGameResult(msg){
        if(msg.code === 200){
            this.onClose();
            cc.vv.FloatTip.show("创建桌子成功!");
        }
    },

    //创建游戏 共同部分
    onCreateCommom(layer, optionList, req){
        let roomNameStr = "";
        if (this._isClubRoom) {
            req.clubid = cc.vv.UserManager.currClubId;

            roomNameStr = layer.getChildByName("input_roomName").getComponent(cc.EditBox).string;
            if(roomNameStr.length===0){
                cc.vv.FloatTip.show("请输入桌子名称!");
                return;
            }
        }
        req.tname = roomNameStr;

        for (let i = 0; i < optionList.length; i++) {
            let option = layer.getChildByName(optionList[i].option);
            for (let j = 0; j < optionList[i].valueList.length; j++) {
                let toggle = option.getChildByName("toggle" + j);
                if (toggle.getComponent(cc.Toggle).isChecked) {
                    if ("round" == optionList[i].option) {
                        req.gamenum = optionList[i].valueList[j]
                    } else if ("player_num" == optionList[i].option) {
                        req.seat = optionList[i].valueList[j]
                    } else {
                        req.param1 = optionList[i].valueList[j];
                    }
                    break;
                }
            }
        }

        // 算分倍数
        let text_score = cc.find("bg_score/text_score",layer);
        req.score = parseInt(text_score.getComponent(cc.Label).string);

        // 速度
        let speed = cc.find("speed/toggle0",layer);
        req.speed = speed.getComponent(cc.Toggle).isChecked ? 0 : 1;

        // 托管
        let trusteeship = cc.find("trusteeship/toggle0",layer);
        req.trustee = trusteeship.getComponent(cc.Toggle).isChecked ? 1 : 0;

        // 解散
        let dismiss = cc.find("dismiss/toggle0",layer);
        req.isdissolve = dismiss.getComponent(cc.Toggle).isChecked ? 1 : 0;

        // 同IP
        let sameIP = cc.find("sameIP/toggle0",layer);
        req.ipcheck = sameIP.getComponent(cc.Toggle).isChecked ? 1 : 0;

        // 距离
        let distance = cc.find("distance/toggle0",layer);
        req.distance = distance.getComponent(cc.Toggle).isChecked ? 1 : 0;

        var data = {};
        data.c = this._isClubRoom ? MsgId.ADDGAME : MsgId.GAME_CREATEROOM;
        data.gameInfo = req;
        cc.vv.NetManager.send(data);
    },

    // 初始化游戏 共同部分
    onClearCommom(layer, optionList){
        for (let i = 0; i < optionList.length; i++) {
            let option = layer.getChildByName(optionList[i]);
            for (let j = 0; j < option.children.length; j++) {
                let toggle = option.getChildByName("toggle" + j);
                toggle.getComponent(cc.Toggle).isChecked = (j === 0);
                break;
            }
        }

        //算分倍数
        let text_score = cc.find("bg_score/text_score",layer);
        text_score.getComponent(cc.Label).string = 1;

        let trusteeship = cc.find("trusteeship/toggle0",layer);
        trusteeship.getComponent(cc.Toggle).isChecked = false;

        let dismiss = cc.find("dismiss/toggle0",layer);
        dismiss.getComponent(cc.Toggle).isChecked = true;

        layer.getChildByName("input_roomName").getComponent(cc.EditBox).string = "";
        layer.getChildByName("input_roomName").active = this._isClubRoom;
        
        let sameIP = cc.find("sameIP/toggle0",layer);
        sameIP.getComponent(cc.Toggle).isChecked = false;

        let distance = cc.find("distance/toggle0",layer);
        distance.getComponent(cc.Toggle).isChecked = false;
    },

    // 创建碰胡
    onCreatePengHu(){
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[this.gameTypeIndex.PengHu]);

        let optionList = [];
        optionList.push({option:"round",          valueList:[8,16,24]});
        optionList.push({option:"player_num",     valueList:[2,4]});
        optionList.push({option:"zhongzhuang",    valueList:[0,1,2]});

        let req = {};
        req.gameid = this._isClubRoom ? 1 : 3;
        this.onCreateCommom(layer, optionList, req);
    },

    clearPengHu(){
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[this.gameTypeIndex.PengHu]);
        let optionList = ["round","player_num","zhongzhuang","speed"];
        this.onClearCommom(layer, optionList);
    },

    // 创建跑胡子
    onCreatePaoHuZi(){
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[this.gameTypeIndex.PaoHuZi]);

        let optionList = [];
        optionList.push({option:"round",          valueList:[8,16]});
        optionList.push({option:"player_num",     valueList:[2,3]});
        optionList.push({option:"wanfa",          valueList:[1,2,3]});

        let req = {};
        req.gameid = this._isClubRoom ? 2 : 4;
        this.onCreateCommom(layer, optionList, req);
    },

    clearPaoHuZi(){
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[this.gameTypeIndex.PaoHuZi]);
        let optionList = ["round","player_num","wanfa","speed"];
        this.onClearCommom(layer, optionList);
    },

    // 创建红黑胡
    onCreateHongHeiHu(){
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[this.gameTypeIndex.HongHeiHu]);

        let optionList = [];
        optionList.push({option:"round",          valueList:[8,16]});
        optionList.push({option:"player_num",     valueList:[2,3]});
        optionList.push({option:"baseScore",      valueList:[0,1,2,3,4,5]});

        let req = {};
        req.gameid = this._isClubRoom ? 5 : 6;
        this.onCreateCommom(layer, optionList, req);
    },

    clearHongHeiHu(){
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[this.gameTypeIndex.HongHeiHu]);
        let optionList = ["round","player_num","baseScore","speed"];

        this.onClearCommom(layer, optionList);
    },

    // 创建六胡抢
    onCreateLiuHuQiang(){
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[this.gameTypeIndex.LiuHuQiang]);

        let optionList = [];
        optionList.push({option:"round",          valueList:[8,16,24]});
        optionList.push({option:"player_num",     valueList:[2,3,4]});
        optionList.push({option:"countScore",     valueList:[0,1]});

        let req = {};
        req.gameid = this._isClubRoom ? 7 : 8;
        this.onCreateCommom(layer, optionList, req);
    },

    clearLiuHuQiang(){
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[this.gameTypeIndex.LiuHuQiang]);
        let optionList = ["round","player_num","countScore","speed"];

        this.onClearCommom(layer, optionList);
    },

    // 创建跑得快
    onCreatePaoDeKuai(){
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[this.gameTypeIndex.PaoDeKuai]);

        let optionList = [];
        optionList.push({option:"round",          valueList:[5,10]});
        optionList.push({option:"player_num",     valueList:[2,3]});
        optionList.push({option:"zhaniao",        valueList:[0,1,2,3]});

        let req = {};
        req.gameid = this._isClubRoom ? 9 : 10;
        this.onCreateCommom(layer, optionList, req);
    },

    clearPaoDeKuai(){
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[this.gameTypeIndex.PaoDeKuai]);
        let optionList = ["round","player_num","zhaniao","speed"];

        this.onClearCommom(layer, optionList);
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.ADDGAME, this.onRcvAddGameResult,false,this);
        if(this._createLayer){
            cc.loader.releaseRes("common/prefab/create_room",cc.Prefab);
        }
    },
    // update (dt) {},
});
