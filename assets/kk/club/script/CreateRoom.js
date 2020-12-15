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
            TongHua:7
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
        this.gamePanelStr = ["panel_penghu","panel_paohuzi","panel_hongheihu","panel_liuhuqiang","panel_paodekuai","panel_hongzhong","panel_shihuka","panel_tonghua"];
    },

    showGamePanel(){
        for (var i = 0; i < this.content_gameBtns.children.length; i++) {
            let gameBtn = this.content_gameBtns.children[i];
            gameBtn.getChildByName("selected_bg").active = (this.curGameIndex === gameBtn.id);
        }

        for (let i = 0; i < this.gamePanels.length; i++) {
            if (this.gamePanels[i]) {
                this.gamePanels[i].active = (this.curGameIndex === this.gamePanels[i].gameIndex);
            }
        } 

        if (!this.gamePanels[this.curGameIndex]) {
            cc.loader.loadRes("common/prefab/gameCreatePanel/" + this.gamePanelStr[this.curGameIndex], cc.Prefab,(err,prefab)=>{
                if(err === null){
                    let panel = cc.instantiate(prefab);
                    panel.parent = this._createLayer.getChildByName("img_bg");
                    panel.gameIndex = this.curGameIndex;

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
                        toggle.round = roundItemData[0];
                        toggle.getChildByName("txt_inning_eight").getComponent(cc.Label).string = roundItemData[0] + "局";
                        toggle.getChildByName("txt_dou1").getComponent(cc.Label).string = "(房卡x"+ roundItemData[1] +")";
                        if (9 < roundItemData[0]) {
                            toggle.getChildByName("txt_dou1").x += 8;
                        }
                        toggle.active = true;
                    }
                    for (let j = roundData.length; j < 4; j++) {
                        let toggle = round.getChildByName("toggle" + j);
                        if (toggle) {
                            toggle.active = false;
                        }
                    }

                    let bg_score = cc.find("right_bg/scrollview/content/bg_score", panel);

                    let multList = JSON.parse(gameRuleInfo.mult);
                    let text_score = bg_score.getChildByName("text_score");
                    if (0.1 > multList[0]) {
                        text_score.getComponent(cc.Label).string = multList[0].toFixed(2);
                    } else if (1 > multList[0]) {
                        text_score.getComponent(cc.Label).string = multList[0].toFixed(1);
                    } else {
                        text_score.getComponent(cc.Label).string = multList[0].toFixed(0);
                    }

                    let btn_deduction = bg_score.getChildByName("btn_deduction");
                    btn_deduction.multList = multList;
                    btn_deduction.curIndex = 0;
                    Global.btnClickEvent(btn_deduction,this.onClickScoreDedution,this);

                    let btn_add = bg_score.getChildByName("btn_add");
                    btn_add.multList = multList;
                    btn_add.curIndex = 0;
                    Global.btnClickEvent(btn_add,this.onClickScoreAdd,this);

                    let btn_create_room = cc.find("right_bg/btn_create_room", panel);
                    btn_create_room.id = gameRuleInfo.id;
                    Global.btnClickEvent(btn_create_room,this.onCreateGame,this);

                    cc.find("left_bg/btn_selectedGame/label_selectedGame", panel).getComponent(cc.Label).string = gameRuleInfo.title;

                    let content = cc.find("right_bg/scrollview/content", panel);

                    if ("panel_liuhuqiang" === panel.name || "panel_shihuka" === panel.name || "panel_tonghua" === panel.name) {
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

    onClickScoreDedution(event){
        if (0 < event.target.curIndex) {
            --event.target.curIndex;
            --event.target.parent.getChildByName("btn_add").curIndex;

            let mult = event.target.multList[event.target.curIndex];
            let text_score = cc.find("right_bg/scrollview/content/bg_score/text_score",this.gamePanels[this.curGameIndex]);
            if (0.1 > mult) {
                text_score.getComponent(cc.Label).string = mult.toFixed(2);
            } else if (1 > mult) {
                text_score.getComponent(cc.Label).string = mult.toFixed(1);
            } else {
                text_score.getComponent(cc.Label).string = mult.toFixed(0);
            }
        }
    },

    onClickScoreAdd(event){
        if (event.target.multList.length - 1 > event.target.curIndex) {
            ++event.target.curIndex;
            ++event.target.parent.getChildByName("btn_deduction").curIndex;

            let mult = event.target.multList[event.target.curIndex];
            let text_score = cc.find("right_bg/scrollview/content/bg_score/text_score",this.gamePanels[this.curGameIndex]);
            if (0.1 > mult) {
                text_score.getComponent(cc.Label).string = mult.toFixed(2);
            } else if (1 > mult) {
                text_score.getComponent(cc.Label).string = mult.toFixed(1);
            } else {
                text_score.getComponent(cc.Label).string = mult.toFixed(0);
            }
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
        let layer = cc.find("right_bg/scrollview/content",this.gamePanels[this.curGameIndex]);
        let id = event.target.id;

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
            optionList.push({option:"param1",           valueList:[0,1,2]});
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

        } else if (this.gameTypeIndex.TongHua == id) {
            req.gameid = this._isClubRoom ? 15 : 16;
            optionList.push({option:"player_num",       valueList:[2]});
            optionList.push({option:"param1",           valueList:[8,9,10,12,13,14,15,16]});
            optionList.push({option:"param2",           valueList:[0,1]});
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
                req.gamenum = parseInt(toggle.round);
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
        req.score = Number(text_score.getComponent(cc.Label).string);

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
            req.shrink = [];
            for (let i = 0; i < 3; i++) {
                let chouShuiValue = layer.getChildByName("input_chouShuiValue"+i).getComponent(cc.EditBox).string;
                chouShuiValue = parseInt(chouShuiValue) || 0;
                let chouShuiRangeMin = layer.getChildByName("input_chouShuiRangeMin"+i).getComponent(cc.EditBox).string;
                chouShuiRangeMin = parseInt(chouShuiRangeMin) || 0;
                let chouShuiRangeMax = layer.getChildByName("input_chouShuiRangeMax"+i).getComponent(cc.EditBox).string;
                chouShuiRangeMax = parseInt(chouShuiRangeMax) || 0;
                if (chouShuiValue <= chouShuiRangeMin && chouShuiRangeMin <= chouShuiRangeMax) {
                    req.shrink[i] = [chouShuiValue,chouShuiRangeMin,chouShuiRangeMax];
                } else {
                    cc.vv.FloatTip.show("请输入有效的扣钻值与扣钻区间!");
                    return;
                }
            }
            let minEnterValue = layer.getChildByName("input_minEnterValue").getComponent(cc.EditBox).string;
            minEnterValue = parseInt(minEnterValue) || 0;
            req.tiredsill = minEnterValue;
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
        for (let i = 0; i < 3; i++) {
            layer.getChildByName("input_chouShuiValue"+i).active = this._isClubRoom;
            layer.getChildByName("input_chouShuiRangeMin"+i).active = this._isClubRoom;
            layer.getChildByName("input_chouShuiRangeMax"+i).active = this._isClubRoom;
            if (this._isClubRoom) {
                layer.getChildByName("input_chouShuiValue"+i).getComponent(cc.EditBox).string = "";
                layer.getChildByName("input_chouShuiRangeMin"+i).getComponent(cc.EditBox).string = "";
                layer.getChildByName("input_chouShuiRangeMax"+i).getComponent(cc.EditBox).string = "";
            }
        }
        layer.getChildByName("label_minEnter").active = this._isClubRoom;
        layer.getChildByName("input_minEnterValue").active = this._isClubRoom;
        if (this._isClubRoom) {
            layer.getChildByName("input_minEnterValue").getComponent(cc.EditBox).string = "0";
        }

        if (!this._isClubRoom) {
            cc.find("label_other", layer).y += 280;
            sameIP.y += 280;
            distance.y += 280;
            layer.height -= 280;
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
