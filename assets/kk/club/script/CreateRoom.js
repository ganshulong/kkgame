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

    showCreateRoom(isClubRoo){
        this._isClubRoom = isClubRoo;
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
                    this.initShow();
                }
            })
        }
        else{
            this._createLayer.active = true;
            this.initShow();
        }
    },

    initUI(){
        this.gameTypeIndex = {
            PengHu:0,
            PaoHuZi:1
        };

        let btn_back = this._createLayer.getChildByName("btn_back");
        Global.btnClickEvent(btn_back,this.onClose,this);

        this.toggle_gameBtns = this._createLayer.getChildByName("toggle_gameBtns");
        for (var i = 0; i < this.toggle_gameBtns.children.length; i++) {
            Global.btnClickEvent(this.toggle_gameBtns.children[i],this.onClickGameType,this);
        }

        let panel_penghu = cc.find("img_bg/panel_penghu",this._createLayer);
        let btn_create_room_penghu = cc.find("right_bg/btn_create_room", panel_penghu);
        Global.btnClickEvent(btn_create_room_penghu,this.onCreatePengHu,this);

        let panel_paohuzi = cc.find("img_bg/panel_paohuzi",this._createLayer);
        let btn_create_room_paohuzi = cc.find("right_bg/btn_create_room", panel_paohuzi);
        Global.btnClickEvent(btn_create_room_paohuzi,this.onCreatePaoHuZi,this);

        this.gamePanels = [panel_penghu, panel_paohuzi];

        this.clearPengHu();
        this.clearPaoHuZi();
    },

    initShow(){
        this.curGameIndex = this.gameTypeIndex.PaoHuZi;
        for (var i = 0; i < this.toggle_gameBtns.children.length; i++) {
            let toggle = this.toggle_gameBtns.getChildByName("toggle" + i);
            toggle.getComponent(cc.Toggle).isChecked = (this.curGameIndex === i);
            this.gamePanels[i].active = (this.curGameIndex === i);
        }
    },

    onClickGameType(){
        for (var i = 0; i < this.toggle_gameBtns.children.length; i++) {
            let toggle = this.toggle_gameBtns.getChildByName("toggle" + i);
            if (toggle.getComponent(cc.Toggle).isChecked) {
                this.curGameIndex = i;
            }
            this.toggle_gameBtns.children[i].getChildByName("selected_bg").active = toggle.getComponent(cc.Toggle).isChecked;
            this.gamePanels[i].active = toggle.getComponent(cc.Toggle).isChecked;
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

    // 创建碰胡
    onCreatePengHu(){
        let layer = cc.find("img_bg/panel_penghu/right_bg/scrollview/content",this._createLayer);

        let roomNameStr = "";
        if (this._isClubRoom) {
            roomNameStr = layer.getChildByName("input_roomName").getComponent(cc.EditBox).string;
            if(roomNameStr.length===0){
                cc.vv.FloatTip.show("请输入桌子名称!");
                return;
            }
        }
        let req = {};
        if (this._isClubRoom) {
            req.clubid = cc.vv.UserManager.currClubId;
        }
        req.gameid = this._isClubRoom ? 1 : 3;
        req.gamenum = 8;
        req.param1 = 0;
        req.score = 1;
        req.seat = 4;
        req.speed = 0;
        for(let i=1;i<4;++i){
            // 局数
            let round = cc.find("round/toggle"+i,layer);
            if(round.getComponent(cc.Toggle).isChecked){
                if(i===1) req.gamenum = 8;
                else if(i === 2) req.gamenum = 16;
                else  req.gamenum = 24;
            }


            // 中庄
            let zhongzhuang = cc.find("zhongzhuang/toggle"+i,layer);
            if(zhongzhuang.getComponent(cc.Toggle).isChecked){
                if(i===1) req.param1 = 0;
                else if(i === 2) req.param1 = 1;
                else  req.param1 = 2;
            }

            // 积分
            let jifen = cc.find("score/toggle"+i,layer);
            if(jifen.getComponent(cc.Toggle).isChecked){
                if(i===1) req.score = 1;
                else if(i === 2) req.score = 2;
                else  req.score = 4;
            }

            if(i<3){
                let player_num = cc.find("player_num/toggle"+i,layer);
                if(player_num.getComponent(cc.Toggle).isChecked){
                    if(i===1) req.seat = 4;
                    else if(i === 2) req.seat = 2;
                }

                let speed = cc.find("speed/toggle"+i,layer);
                if(speed.getComponent(cc.Toggle).isChecked){
                    if(i===1) req.speed = 0;
                    else if(i === 2) req.speed = 1;
                }
            }
        }


        // 托管
        let trusteeship = cc.find("force/toggle1",layer);
        req.trustee = trusteeship.getComponent(cc.Toggle).isChecked?1:0;

        // 解散
        let dismiss = cc.find("dismiss/toggle1",layer);
        req.isdissolve = dismiss.getComponent(cc.Toggle).isChecked?1:0;

        // 同IP
        let sameIP = cc.find("other/toggle1",layer);
        req.ipcheck = sameIP.getComponent(cc.Toggle).isChecked?1:0;

        // 距离
        let distance = cc.find("other/toggle2",layer);
        req.distance = distance.getComponent(cc.Toggle).isChecked?1:0;

        req.tname = roomNameStr;

        var data = {};
        data.c = this._isClubRoom ? MsgId.ADDGAME : MsgId.GAME_CREATEROOM;
        data.gameInfo = req;
        cc.vv.NetManager.send(data);
    },

    clearPengHu(){
        let layer = cc.find("img_bg/panel_penghu/right_bg/scrollview/content",this._createLayer);
        for(let i=1;i<4;++i){
            // 局数
            let round = cc.find("round/toggle"+i,layer);
            round.getComponent(cc.Toggle).isChecked = i===1;

            // 中庄
            let zhongzhuang = cc.find("zhongzhuang/toggle"+i,layer);
            zhongzhuang.getComponent(cc.Toggle).isChecked = i===1;

            // 积分
            let jifen = cc.find("score/toggle"+i,layer);
            jifen.getComponent(cc.Toggle).isChecked = i===1;

            if(i<3){
                let player_num = cc.find("player_num/toggle"+i,layer);
                player_num.getComponent(cc.Toggle).isChecked = i===1;

                let speed = cc.find("speed/toggle"+i,layer);
                speed.getComponent(cc.Toggle).isChecked = true;
            }
        }

        // 托管
        let trusteeship = cc.find("force/toggle1",layer);
        trusteeship.getComponent(cc.Toggle).isChecked = false;

        // 同IP
        let sameIP = cc.find("other/toggle1",layer);
        sameIP.getComponent(cc.Toggle).isChecked = true;

        // 托管
        let distance = cc.find("other/toggle2",layer);
        distance.getComponent(cc.Toggle).isChecked = false;

        layer.getChildByName("input_roomName").getComponent(cc.EditBox).string = "";
        layer.getChildByName("input_roomName").active = this._isClubRoom;
    },

    // 创建跑胡子
    onCreatePaoHuZi(){
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[this.gameTypeIndex.PaoHuZi]);

        let req = {};
        let roomNameStr = "";
        if (this._isClubRoom) {
            roomNameStr = layer.getChildByName("input_roomName").getComponent(cc.EditBox).string;
            if(roomNameStr.length===0){
                cc.vv.FloatTip.show("请输入桌子名称!");
                return;
            }
        }
        req.tname = roomNameStr;

        if (this._isClubRoom) {
            req.clubid = cc.vv.UserManager.currClubId;
        }
        req.gameid = this._isClubRoom ? 2 : 4;

        let round = layer.getChildByName("round");
        for (var i = 0; i < round.children.length; i++) {
            let toggle = round.getChildByName("toggle" + i);
            if (toggle.getComponent(cc.Toggle).isChecked) {
                req.gamenum = [8,16][i]
                break;
            }
        }

        let player_num = layer.getChildByName("player_num");
        for (var i = 0; i < player_num.children.length; i++) {
            let toggle = player_num.getChildByName("toggle" + i);
            if (toggle.getComponent(cc.Toggle).isChecked) {
                req.seat = [3,2][i]
                break;
            }
        }

        let wanfa = cc.find("wanfa/toggle0",layer);
        req.isYiwushi = wanfa.getComponent(cc.Toggle).isChecked ? 1 : 0;

        let score = layer.getChildByName("score");
        for (var i = 0; i < score.children.length; i++) {
            let toggle = score.getChildByName("toggle" + i);
            if (toggle.getComponent(cc.Toggle).isChecked) {
                req.score = [1,2,4][i]
                break;
            }
        }

        let speed = cc.find("speed/toggle0",layer);
        req.speed = speed.getComponent(cc.Toggle).isChecked ? 0 : 1;

        let trusteeship = cc.find("trusteeship/toggle0",layer);
        req.trustee = trusteeship.getComponent(cc.Toggle).isChecked ? 1 : 0;

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

    clearPaoHuZi(){
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[this.gameTypeIndex.PaoHuZi]);
        
        let defaulCheckIndex = 0;

        let round = layer.getChildByName("round");
        for (var i = 0; i < round.children.length; i++) {
            let toggle = round.getChildByName("toggle" + i);
            toggle.getComponent(cc.Toggle).isChecked = (i === defaulCheckIndex);
            break;
        }

        let player_num = layer.getChildByName("player_num");
        for (var i = 0; i < player_num.children.length; i++) {
            let toggle = player_num.getChildByName("toggle" + i);
            toggle.getComponent(cc.Toggle).isChecked = (i === defaulCheckIndex);
            break;
        }

        let wanfa = cc.find("wanfa/toggle0",layer);
        wanfa.getComponent(cc.Toggle).isChecked = true;

        let score = layer.getChildByName("score");
        for (var i = 0; i < score.children.length; i++) {
            let toggle = score.getChildByName("toggle" + i);
            toggle.getComponent(cc.Toggle).isChecked = (i === defaulCheckIndex);
            break;
        }

        let speed = layer.getChildByName("speed");
        for (var i = 0; i < speed.children.length; i++) {
            let toggle = speed.getChildByName("toggle" + i);
            toggle.getComponent(cc.Toggle).isChecked = (i === defaulCheckIndex);
            break;
        }

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

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.ADDGAME, this.onRcvAddGameResult,false,this);
        if(this._createLayer){
            cc.loader.releaseRes("common/prefab/create_room",cc.Prefab);
        }
    },
    // update (dt) {},
});
