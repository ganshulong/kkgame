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
        _layer:null,
        _show:false,
        _isOver:false,
        _OverScoreNode:null,
        _zhuang:-1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.GAMEOVER,this.recvGameOver,this);
        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);

        this._OverScoreNode = cc.find("scene/over_score",this.node);
        this._OverScoreNode.active = false;
    },

    onRecvHandCard(data){
      data = data.detail;
      this._zhuang = data.bankerInfo.seat;

    },

    recvDeskInfoMsg(){
        this._zhuang = cc.vv.gameData.getDeskInfo().bankerInfo.seat;
    },

    init(atlas){
        this._atlas = atlas;
    },

    createType(type){
        let node = new cc.Node();
        let spr = node.addComponent(cc.Sprite);
        let sprName = "";
        if(type === cc.vv.gameData.OPERATETYPE.CHI) sprName = "penghu_onwer-table-imgs-wz_chi";
        else if(type === cc.vv.gameData.OPERATETYPE.KAN) sprName = "penghu_onwer-table-imgs-wz_kan";
        else if(type === cc.vv.gameData.OPERATETYPE.PAO) sprName = "penghu_onwer-table-imgs-wz_pao";
        else if(type === cc.vv.gameData.OPERATETYPE.LONG) sprName = "penghu_onwer-table-imgs-wz_tilong";
        else if(type === cc.vv.gameData.OPERATETYPE.SAO) sprName = "penghu_onwer-table-imgs-wz_sao";
        else if(type === cc.vv.gameData.OPERATETYPE.PENG) sprName = "penghu_onwer-table-imgs-wz_peng";
        spr.spriteFrame = this._atlas.getSpriteFrame(sprName);
        return node;
    },

    recvGameOver(){
        this._isOver = true;
    },

    recvRoundOver(data){
        data = data.detail;
        if(this._layer === null){
            cc.loader.loadRes("common/prefab/Liuhuqiang_round_over_view",(err,prefab)=>{
                if(err === null){
                    this._layer = cc.instantiate(prefab);
                    this._layer.parent = this.node.getChildByName("scene");
                    this._layer.scaleX = this.node.width / this._layer.width;
                    this._layer.scaleY = this.node.height / this._layer.height;
                    this._layer.zIndex = 3;
                    this._layer.active = false;
                    this._layer.x = this.node.width/2;
                    this._layer.y = this.node.height/2;
                    this.showRoundInfo(data);
                    this.initPlayerInfo(data, data.users,data.seat,data.hcard,data.source,data.hupaiType);
                    this.initRoomInfo();
                    this.scheduleOnce(()=>{
                        this._layer.active = true;
                    },2);
                }
            })
        }

        this._OverScoreNode.active = true;
        for(let i=0;i<data.users.length;++i){
            let chairId = cc.vv.gameData.getLocalChair(data.users[i].seat);
            let score = this._OverScoreNode.getChildByName("score"+chairId);
            score.getComponent(cc.Label).string = data.users[i].roundHuXi + "胡息";
            score.color = data.users[i].roundScore>0?(new cc.Color(236,187,111)):(new cc.Color(209,114,96));
        }
        this._OverScoreNode.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(()=>{
            this._OverScoreNode.active = false;
        })))

    },

    showRoundInfo(data){
        this._layer.getChildByName("spr_draw").active = (0 >= data.huxi);
        let panel_CardInfo = this._layer.getChildByName("panel_CardInfo");
        panel_CardInfo.active = (0 < data.huxi);
        if (panel_CardInfo.active) {
            let winerInfo = null;
            for(let i = 0; i < data.users.length; ++i){
                if (data.users[i].uid == cc.vv.UserManager.uid) {
                    panel_CardInfo.getChildByName("spr_lose").active = (0 >= data.users[i].roundScore);
                    panel_CardInfo.getChildByName("spr_win").active = (0 < data.users[i].roundScore);
                }
                if (data.users[i].seat == data.seat) {
                    winerInfo = data.users[i];
                }
            }

            if (data.hcard) {
                let bgNode = new cc.Node();
                bgNode.addComponent(cc.Sprite);
                let cardNode = this.node.getComponent("LiuHuQiang_Card").createCard(data.hcard,0);
                cardNode.parent = bgNode;
                bgNode.parent = panel_CardInfo.getChildByName("card_last");
            }

            if (winerInfo) {
                let panel_cardArrs = panel_CardInfo.getChildByName("panel_cardArrs");
                let cardArrItemTemp = panel_cardArrs.getChildByName("cardArrItemTemp");

                for (let i = 0; i < winerInfo.menzi.length; i++) {
                    let cardArrItem = cc.instantiate(cardArrItemTemp);
                    cardArrItem.parent = panel_cardArrs;
                    cardArrItem.x = i * 70;

                    let cardArr = winerInfo.menzi[i].data;
                    if(winerInfo.menzi[i].type === cc.vv.gameData.OPERATETYPE.KAN ||
                       winerInfo.menzi[i].type === cc.vv.gameData.OPERATETYPE.PENG) {
                        cardArr=[winerInfo.menzi[i].card,winerInfo.menzi[i].card,winerInfo.menzi[i].card];

                    } else if(winerInfo.menzi[i].type === cc.vv.gameData.OPERATETYPE.LONG ||
                             winerInfo.menzi[i].type === cc.vv.gameData.OPERATETYPE.SHE ||
                             winerInfo.menzi[i].type === cc.vv.gameData.OPERATETYPE.PAO) {
                        cardArr=[winerInfo.menzi[i].card,winerInfo.menzi[i].card,winerInfo.menzi[i].card,winerInfo.menzi[i].card];
                    }

                    for(let j = 0; j < cardArr.length; ++j){
                        let node = this.node.getComponent("LiuHuQiang_Card").createCard(cardArr[j],2);
                        node.y = node.height * j;
                        node.parent = cardArrItem;
                    }

                    let typeNode = this.createType(winerInfo.menzi[i].type);
                    typeNode.y = 200;
                    typeNode.parent = cardArrItem;
                }

                for(let i=0; i < data.huCards.length; ++i){
                    let cardArrItem = cc.instantiate(cardArrItemTemp);
                    cardArrItem.parent = panel_cardArrs;
                    cardArrItem.x = (winerInfo.menzi.length + i) * 70;

                    for(let j = 0; j < data.huCards[i].length; ++j) {
                        let node = this.node.getComponent("LiuHuQiang_Card").createCard(data.huCards[i][j],2);
                        node.y = node.height * j;
                        node.parent = cardArrItem;
                    }
                }
            }
            cc.find("bg_score/text_score",panel_CardInfo).getComponent(cc.Label).string = data.roundScore
            panel_CardInfo.getChildByName("text_huxi").getComponent(cc.Label).string = ("胡息： " + data.huxi);

            let zimoHuTypeStr = "";
            if (data.isZimo) {
                zimoHuTypeStr += "自摸\n";
            }
            if (0 < data.source) {
                zimoHuTypeStr += "点跑胡\n";
            }
            if (0 < data.mingTangType) {
                zimoHuTypeStr += ["","红胡","一点红","黑胡"][data.mingTangType];
            }
            if ("" == zimoHuTypeStr) {
                zimoHuTypeStr += "平胡";
            }
            panel_CardInfo.getChildByName("text_zimo_huType").getComponent(cc.Label).string = zimoHuTypeStr;

            let tunFanStr = "囤数:" + (parseInt((data.huxi-6) / 3) + 1);
            if (data.isZimo || 0 < data.mingTangType) {
                tunFanStr += " 番数:2"; 
            } else {
                tunFanStr += " 番数:1"; 
            }
            panel_CardInfo.getChildByName("text_tun_fan").getComponent(cc.Label).string = tunFanStr;
        }
        let surplusCard = this._layer.getChildByName("surplusCard");
        for (let i = 0; i < data.diPai.length; i++) {
            let node = this.node.getComponent("LiuHuQiang_Card").createCard(data.diPai[i],2);
            node.x = (node.width + 5) * i;
            node.parent = surplusCard;
        }
    },

    initPlayerInfo(data){
        let bigWinerScore = 0;
        let bigWinerNode = null;
        for(let i = 0; i < data.users.length; ++i){
            let chairId = cc.vv.gameData.getLocalChair(data.users[i].seat);
            let player = this._layer.getChildByName("player" + chairId);

            let spr_head = cc.find("head/radio_mask/spr_head",player);
            Global.setHead(spr_head, data.users[i].usericon);

            player.getChildByName("spr_bigWiner").active = false;
            player.getChildByName("spr_banker").active = (data.buck == data.users[i].uid);

            player.getChildByName("text_name").getComponent(cc.Label).string = data.users[i].playername;
            player.getChildByName("text_id").getComponent(cc.Label).string = "ID:"+data.users[i].uid;
            if (0 <= data.users[i].roundScore) {
                player.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = ('/' + Math.abs(data.users[i].roundScore));
                player.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = '';
            } else {
                player.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = '';
                player.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = ('/' + Math.abs(data.users[i].roundScore));
            }
            if (bigWinerScore < data.users[i].roundScore) {
                bigWinerScore = data.users[i].roundScore;
                bigWinerNode = player;
            }
        }
        if (0 < bigWinerScore) {
            bigWinerNode.getChildByName("spr_bigWiner").active = true;
        }
        for (let i = data.users.length; i < 4; i++) {
            this._layer.getChildByName("player" + i).active = false;
        }
    },

    // normal = 1, --平胡
    // tianHu = 2, --天胡
    // diHu = 3, --地胡
    // tilongHu = 4, --踢龙胡
    // paoHu = 5, --跑胡
    // saoHu = 6, --扫胡
    // pengHu = 7,--碰胡
    // pengSanHu = 8, --碰三胡
    // saoSanHu = 9, --扫胡
    // pengSiHu = 10, --碰四胡
    // saoSiHu = 11, --扫四胡
    // shuangLongHu = 12, --双龙
    // xiaoQiDuiHu = 13, --小七对
    // paoDiHu = 14, --跑地胡
    // pengDiHu = 15, --碰地胡
    // pengDiHu = 16, --五福
    showHuType(type,huFlag){
        let sprName = "";
        if(type===1) sprName = "penghu_onwer-table-imgs-huflag_12";
        else if(type===2) sprName = "penghu_onwer-table-imgs-huflag_0";
        else if(type===3 || type === 14 || type === 15) sprName = "penghu_onwer-table-imgs-huflag_1";
        else if(type===4) sprName = "penghu_onwer-table-imgs-huflag_5";
        else if(type===5) sprName = "penghu_onwer-table-imgs-huflag_6";
        else if(type===6) sprName = "penghu_onwer-table-imgs-huflag_13";
        else if(type===7) sprName = "penghu_onwer-table-imgs-huflag_9";
        else if(type===8) sprName = "penghu_onwer-table-imgs-huflag_8";
        else if(type===9) sprName = "penghu_onwer-table-imgs-huflag_13";
        else if(type===10) sprName = "penghu_onwer-table-imgs-huflag_7";
        else if(type===11) sprName = "penghu_onwer-table-imgs-huflag_11";
        else if(type===12) sprName = "penghu_onwer-table-imgs-huflag_3";
        else if(type===13) sprName = "penghu_onwer-table-imgs-huflag_2";
        else if(type===16) sprName = "penghu_onwer-table-imgs-huflag_4";
        huFlag.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(sprName);
    },


    initRoomInfo(){
        let conf = cc.vv.gameData.getRoomConf();
        let roomId = cc.find("roomInfoNode/txt_room_id",this._layer);
        roomId.getComponent(cc.Label).string = "游戏号:" + conf.deskId;

        let roundNum = cc.find("roomInfoNode/txt_round_num",this._layer);
        roundNum.getComponent(cc.Label).string = "(" + cc.vv.gameData.getDeskInfo().round + "/" + conf.gamenum + "局)";

        let desc = cc.find("roomInfoNode/txt_game_desc",this._layer);
        let str = "";
        let list = cc.vv.gameData.getWanFa();
        for(let i=0;i<list.length;++i){
            str += list[i];
        }
        desc.getComponent(cc.Label).string = str;

        let okBtn = this._layer.getChildByName("btn_comfirm");
        Global.btnClickEvent(okBtn,this.onClose,this);
    },

    onClose(){
        let ndoe_fly_icon = this._layer.parent.getChildByName("ndoe_fly_icon");
        for(let i = 0; i < ndoe_fly_icon.children.length; ++i){
            ndoe_fly_icon.children[i].stopAllActions();
            ndoe_fly_icon.children[i].removeFromParent();
        }
        this._layer.removeFromParent(true);
        this._layer = null;
        this._show = false;
        if(this._isOver) Global.dispatchEvent(EventId.SHOW_GAMEOVER);
        else Global.dispatchEvent(EventId.CLOSE_ROUNDVIEW);
    },

    initHandCard(list,parent,menzi,card=null,source=null){
        let tempList = cc.vv.gameData.sortCard(list);
        let width=0;
        for(let i=0;i<tempList.length;++i){
            for(let j=0;j<tempList[i].length;++j) {
                let node = this.node.getComponent("LiuHuQiang_Card").createCard(tempList[i][j],1);
                node.scale = 0.5;
                node.y = (node.height-28)*j*node.scale+20;
                node.x = node.width*i*node.scale+20;
                node.zIndex=4-j;
                node.parent = parent;
                if(j ===0){
                    width = node.x+node.scale*node.width*0.5;
                }
            }
        }

        for(let i=0;i<menzi.length;++i){
            let menzilist = [];
            let typeData = menzi[i];
            let typeNode = this.createType(typeData.type);
            typeNode.parent = parent;
            typeNode.zIndex = 1;
            if(typeData.type === cc.vv.gameData.OPERATETYPE.KAN) // 坎
            {
                menzilist=[typeData.card,typeData.card,typeData.card];
            }
            else if(typeData.type === cc.vv.gameData.OPERATETYPE.LONG || typeData.type === cc.vv.gameData.OPERATETYPE.SHE||
                typeData.type === cc.vv.gameData.OPERATETYPE.PAO){
                menzilist=[typeData.card,typeData.card,typeData.card,typeData.card];
            }
            else if(typeData.type === cc.vv.gameData.OPERATETYPE.PENG){
                menzilist=[typeData.card,typeData.card,typeData.card];
            }
            else if(typeData.type === cc.vv.gameData.OPERATETYPE.CHI){
                menzilist=typeData.data;
            }
            let posX = 0;
            let PosY = 0;
            for(let j=0;j<menzilist.length;++j){
                let node = this.node.getComponent("LiuHuQiang_Card").createCard(menzilist[j],0);
                node.scale = 0.45;
                node.x = width+node.width*node.scale;
                node.y = 44;
                node.parent = parent;
                width += (node.width*node.scale);

                if(j===1){
                    PosY = node.height*node.scale*0.5+40;
                    if(menzilist.length===3) posX = node.x;
                    else if(menzilist.length===4){
                        posX = node.x+node.width*node.scale;
                    }
                    else if(menzilist.length===2){
                        posX = node.x-node.width*node.scale;
                    }
                }
            }
            typeNode.x = posX;
            typeNode.y = PosY;

            width += 10;

        }

        if(card){
            let bgNode = new cc.Node();
            bgNode.addComponent(cc.Sprite);
            this.node.getComponent("LiuHuQiang_Card").changCardBg(bgNode,source===0);
            let cardNode = this.node.getComponent("LiuHuQiang_Card").createCard(card,0);
            bgNode.y = 43;
            bgNode.x = width+60;
            bgNode.scale = 0.6;

            cardNode.parent = bgNode;
            bgNode.parent = parent;
        }
    },

    clearDesk(){
        this._num = 0;
        if(this._layer){
            this._layer.removeFromParent(true);
            this._layer = null;
        }
        this._show = false;
        this._OverScoreNode.active = false;
    },

    onDestroy(){
        if(this._layer){
            cc.loader.releaseRes("common/prefab/Liuhuqiang_round_over_view",cc.Prefab);
        }
    }
    // update (dt) {},
});
