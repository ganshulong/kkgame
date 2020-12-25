
cc.Class({
    extends: cc.Component,

    properties: {
        _createLayer:null,
        _isClubRoom:false,
    },

    start () {
        cc.vv.NetManager.registerMsg(MsgId.ADDGAME, this.onRcvAddGameResult, this);
    },

    preLoadPrefab(isClubRoom){
        this._isClubRoom = (isClubRoom === false) ? false : true;
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
                    this._createLayer.active = false;
                }
            })
        }
    },

    showCreateRoom(isClubRoom, showGameID){
        this._isClubRoom = (isClubRoom === false) ? false : true;
        this.curGameIndex = 0;
        if (undefined != showGameID) {
            this.curGameIndex = showGameID;
        } else if (0 < cc.vv.UserManager.gameList.length) {
            this.curGameIndex = cc.vv.UserManager.gameList[0].id;
        }
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
                    this.showGamePanel();
                }
            })
        } else{
            this._createLayer.active = true;
            this.showGamePanel();
        }
    },

    initUI(){
        this.gameTypeIndex = {
            PengHu:0,
            PaoHuZi:1,
            HongHeiHu:2,
            LiuHuQiang:3,
            PaoDeKuai:4,
            HongZhong:5,
            ShiHuKa:6,
            ErQiGui:7
        };

        let btn_back = this._createLayer.getChildByName("btn_back");
        Global.btnClickEvent(btn_back,this.onClose,this);

        //游戏按钮
        let prefabRes = this._createLayer.getChildByName("prefabRes");
        this.content_gameBtns = cc.find("scrollview_gameBtns/view/content",this._createLayer);
        this.content_gameBtns.removeAllChildren(true);
        let tempItem = cc.find("scrollview_gameBtns/view/item",this._createLayer);
        tempItem.active = false;
        for (var i = 0; i < cc.vv.UserManager.gameList.length; i++) {
            let item = cc.instantiate(tempItem);
            let prefabIcon = prefabRes.getChildByName(""+cc.vv.UserManager.gameList[i].id);
            item.getChildByName("gameIcon").getComponent(cc.Sprite).spriteFrame  = prefabIcon.getComponent(cc.Sprite).spriteFrame;
            item.x = item.width * i;
            item.parent = this.content_gameBtns;
            item.active = true;
            item.id = cc.vv.UserManager.gameList[i].id;
            Global.btnClickEvent(item,this.onClickGameBtn,this);
        }
        //更多按钮
        let item = cc.instantiate(tempItem);
        let prefabIcon = prefabRes.getChildByName("moreIcon");
        item.getChildByName("gameIcon").getComponent(cc.Sprite).spriteFrame  = prefabIcon.getComponent(cc.Sprite).spriteFrame;
        item.getChildByName("gameIcon").scale = 0.8;
        item.getChildByName("selected_bg").active = false;
        item.x = item.width * cc.vv.UserManager.gameList.length;
        item.parent = this.content_gameBtns;
        item.active = true;
        item.id = "moreIcon";
        Global.btnClickEvent(item,this.onClickMoreGame,this);

        this.content_gameBtns.width = tempItem.width * (cc.vv.UserManager.gameList.length+1);

        //游戏玩法选项页面
        this.gamePanels = [];
        this.gamePanelStr = ["panel_penghu","panel_paohuzi","panel_hongheihu","panel_liuhuqiang","panel_paodekuai","panel_hongzhong","panel_shihuka","panel_erqigui"];
    },

    showGamePanel(){
        for (let i = 0; i < this.content_gameBtns.children.length - 1; i++) {
            let gameBtn = this.content_gameBtns.children[i];
            gameBtn.getChildByName("selected_bg").active = (this.curGameIndex === gameBtn.id);
        }

        for (let i = 0; i < this.gamePanels.length; i++) {
            if (this.gamePanels[i]) {
                this.gamePanels[i].active = (this.curGameIndex === this.gamePanels[i].id);
            }
        } 

        if (!this.gamePanels[this.curGameIndex]) {
            cc.loader.loadRes("common/prefab/gameCreatePanel/" + this.gamePanelStr[this.curGameIndex], cc.Prefab,(err,prefab)=>{
                if(err === null){
                    let panel = cc.instantiate(prefab);
                    panel.parent = this._createLayer.getChildByName("img_bg");
                    panel.id = this.curGameIndex;

                    let gameRuleInfo = null;
                    for (let i = 0; i < cc.vv.UserManager.gameList.length; i++) {
                        if (this.curGameIndex == cc.vv.UserManager.gameList[i].id) {
                            gameRuleInfo = cc.vv.UserManager.gameList[i];
                            break;
                        }
                    }
                    let round = cc.find("right_bg/scrollview/content/round", panel);
                    let roundData = gameRuleInfo.data.split(';');
                    for (let j = 0; j < roundData.length; j++) {
                        let roundItemData = roundData[j].split(':');
                        let toggle = round.getChildByName("toggle" + j);
                        toggle.gamenum = roundItemData[0];
                        toggle.getChildByName("txt_inning_eight").getComponent(cc.Label).string = roundItemData[0] + "局";
                        toggle.getChildByName("txt_dou1").getComponent(cc.Label).string = "(房卡x"+ roundItemData[1] +")";
                        toggle.active = true;
                    }
                    for (let j = roundData.length; j < 3; j++) {
                        let toggle = round.getChildByName("toggle" + j);
                        if (toggle) {
                            toggle.active = false;
                        }
                    }

                    let bg_score = cc.find("right_bg/scrollview/content/bg_score", panel);
                    let btn_deduction = bg_score.getChildByName("btn_deduction");
                    Global.btnClickEvent(btn_deduction,this.onClickScoreDedution,this);
                    let btn_add = bg_score.getChildByName("btn_add");
                    Global.btnClickEvent(btn_add,this.onClickScoreAdd,this);

                    let btn_create_room = cc.find("right_bg/btn_create_room", panel);
                    btn_create_room.id = gameRuleInfo.id;
                    Global.btnClickEvent(btn_create_room,this.onCreateGame,this);

                    cc.find("left_bg/btn_selectedGame/label_selectedGame", panel).getComponent(cc.Label).string = gameRuleInfo.title;

                    let content = cc.find("right_bg/scrollview/content", panel);

                    if ("panel_liuhuqiang" === panel.name || "panel_shihuka" === panel.name) {
                        this.initGamePanelCommom(content, ["round","player_num","param1","param2","speed"]);
                    } else {
                        this.initGamePanelCommom(content, ["round","player_num","param1","speed"]);
                    }

                    this.gamePanels[this.curGameIndex] = panel;
                } else {
                    cc.vv.FloatTip.show("加载失败，请重新尝试");
                    this._createLayer.active = false;
                }
            })
        }
    },

    onClickGameBtn(event){
        this.curGameIndex = event.target.id;
        this.showGamePanel();
    },

    onClickMoreGame(event){
        cc.vv.AlertView.showTips("正在努力开发中喔");
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

    onCreateGame(event){
        let id = event.target.id;
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[id]);

        let req = {};
        let optionList = [];
        if (this.gameTypeIndex.PengHu == id) {
            req.gameid = this._isClubRoom ? 1 : 3;
            optionList.push({option:"player_num",       valueList:[2,4]});
            optionList.push({option:"param1",           valueList:[0,1,2]});

        } else if (this.gameTypeIndex.PaoHuZi == id) {
            req.gameid = this._isClubRoom ? 2 : 4;
            optionList.push({option:"player_num",       valueList:[2,3]});
            optionList.push({option:"param1",           valueList:[1,2,3]});

        } else if (this.gameTypeIndex.HongHeiHu == id) {
            req.gameid = this._isClubRoom ? 5 : 6;
            optionList.push({option:"player_num",       valueList:[2,3]});
            optionList.push({option:"param1",           valueList:[0,1,2,3,4,5]});

        } else if (this.gameTypeIndex.LiuHuQiang == id) {
            req.gameid = this._isClubRoom ? 7 : 8;
            optionList.push({option:"player_num",       valueList:[2,3,4]});
            optionList.push({option:"param1",           valueList:[0,1]});
            optionList.push({option:"param2",           valueList:[0,1,2]});

        } else if (this.gameTypeIndex.PaoDeKuai == id) {
            req.gameid = this._isClubRoom ? 9 : 10;
            optionList.push({option:"player_num",       valueList:[2,3]});
            optionList.push({option:"param1",           valueList:[0,1,2,3]});

        } else if (this.gameTypeIndex.HongZhong == id) {
            req.gameid = this._isClubRoom ? 11 : 12;
            optionList.push({option:"player_num",       valueList:[2]});
            optionList.push({option:"param1",           valueList:[0,2,4,6]});

        } else if (this.gameTypeIndex.ShiHuKa == id) {
            req.gameid = this._isClubRoom ? 13 : 14;
            optionList.push({option:"player_num",       valueList:[2,3]});
            optionList.push({option:"param1",           valueList:[0,1]});
            optionList.push({option:"param2",           valueList:[0,1,2]});

        } else if (this.gameTypeIndex.ErQiGui == id) {
            req.gameid = this._isClubRoom ? 17 : 18;
            req.param2 = 0;
            optionList.push({option:"player_num",       valueList:[4]});
            optionList.push({option:"param1",           valueList:[20,30]});
            optionList.push({option:"param2",           valueList:[1]});
        }

        this.onCreateCommom(layer, optionList, req);
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

        //局数
        let round = layer.getChildByName("round");
        for (let j = 0; j < round.children.length; j++) {
            let toggle = round.getChildByName("toggle" + j);
            if (toggle.getComponent(cc.Toggle).isChecked) {
                req.gamenum = parseInt(toggle.gamenum);
                break;
            }
        }

        //人数 玩法
        for (let i = 0; i < optionList.length; i++) {
            let option = layer.getChildByName(optionList[i].option);
            for (let j = 0; j < optionList[i].valueList.length; j++) {
                let toggle = option.getChildByName("toggle" + j);
                if (toggle.getComponent(cc.Toggle).isChecked) {
                    if ("player_num" == optionList[i].option) {
                        req.seat = optionList[i].valueList[j];
                    } else if ("param1" == optionList[i].option) {
                        req.param1 = optionList[i].valueList[j];
                    } else if ("param2" == optionList[i].option) {
                        req.param2 = optionList[i].valueList[j];
                    }
                    break;
                }
            }
        }

        // 算分倍数
        let text_score = cc.find("bg_score/text_score",layer);
        req.score = parseInt(text_score.getComponent(cc.Label).string);

        // 禁用表情文字
        let interact = cc.find("interact/toggle0",layer);
        req.interact = interact.getComponent(cc.Toggle).isChecked ? 1 : 0;

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

        if (this._isClubRoom) {
            let chouShuiValue = layer.getChildByName("input_chouShuiValue").getComponent(cc.EditBox).string;
            chouShuiValue = parseInt(chouShuiValue);
            let chouShuiCondition = layer.getChildByName("input_chouShuiCondition").getComponent(cc.EditBox).string;
            chouShuiCondition = parseInt(chouShuiCondition);
            if (0 <= chouShuiValue && 1000 >= chouShuiValue && chouShuiValue <= chouShuiCondition && 1000 >= chouShuiCondition ) {
                req.fuwus = chouShuiValue;
                req.fuwutj = chouShuiCondition;
            } else {
                cc.vv.FloatTip.show("请输入有效的扣钻值与扣钻条件!");
            }
        }

        var data = {};
        data.c = this._isClubRoom ? MsgId.ADDGAME : MsgId.GAME_CREATEROOM;
        data.gameInfo = req;
        cc.vv.NetManager.send(data);
    },

    // 初始化游戏 共同部分
    initGamePanelCommom(layer, optionList){
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

        // 禁用表情文字
        let interact = cc.find("interact/toggle0",layer);
        interact.getComponent(cc.Toggle).isChecked = false;

        let trusteeship = cc.find("trusteeship/toggle0",layer);
        trusteeship.getComponent(cc.Toggle).isChecked = false;

        let dismiss = cc.find("dismiss/toggle0",layer);
        dismiss.getComponent(cc.Toggle).isChecked = true;

        // layer.getChildByName("input_roomName").getComponent(cc.EditBox).string = "";
        layer.getChildByName("input_roomName").active = this._isClubRoom;
        
        let sameIP = cc.find("sameIP/toggle0",layer);
        sameIP.getComponent(cc.Toggle).isChecked = false;

        let distance = cc.find("distance/toggle0",layer);
        distance.getComponent(cc.Toggle).isChecked = false;

        layer.getChildByName("label_chouShui").active = this._isClubRoom;
        layer.getChildByName("input_chouShuiValue").active = this._isClubRoom;
        layer.getChildByName("input_chouShuiCondition").active = this._isClubRoom;
        if (this._isClubRoom) {
            layer.getChildByName("input_chouShuiValue").getComponent(cc.EditBox).string = "6";
            layer.getChildByName("input_chouShuiCondition").getComponent(cc.EditBox).string = "30";
        }
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.ADDGAME, this.onRcvAddGameResult,false,this);
        if(this._createLayer){
            cc.loader.releaseRes("common/prefab/create_room",cc.Prefab);
        }
    },
    // update (dt) {},
});
