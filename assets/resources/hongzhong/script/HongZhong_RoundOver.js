
cc.Class({
    extends: cc.Component,

    properties: {
    
        _layer:null,
        _show:false,
        _isOver:false,
        _OverScoreNode:null,
        // _zhuang:-1,
    },

    start () {
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOverNotify,this);
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.GAMEOVER,this.recvGameOver,this);
        // Global.registerEvent(EventId.HANDCARD,this.recvHandCard,this);
        // Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);

        this._OverScoreNode = cc.find("scene/over_score",this.node);
        this._OverScoreNode.active = false;
    },

    // recvHandCard(data){
    //   data = data.detail;
    //   this._zhuang = data.bankerInfo.seat;

    // },

    // recvDeskInfoMsg(){
    //     this._zhuang = cc.vv.gameData.getDeskInfo().bankerInfo.seat;
    // },

    init(atlas){
        this._atlas = atlas;
    },

    createType(type, bInHandCards = false){
        let node = new cc.Node();
        let spr = node.addComponent(cc.Sprite);
        let sprName = "";
        if(type === cc.vv.gameData.OPERATETYPE.CHI) sprName = "penghu_onwer-table-imgs-wz_chi";
        else if(type === cc.vv.gameData.OPERATETYPE.KAN && bInHandCards) sprName = "penghu_onwer-table-imgs-wz_kan";
        else if(type === cc.vv.gameData.OPERATETYPE.KAN && !bInHandCards) sprName = "penghu_onwer-table-imgs-wz_sao";
        else if(type === cc.vv.gameData.OPERATETYPE.PAO) sprName = "penghu_onwer-table-imgs-wz_pao";
        else if(type === cc.vv.gameData.OPERATETYPE.LONG) sprName = "penghu_onwer-table-imgs-wz_tilong";
        else if(type === cc.vv.gameData.OPERATETYPE.PENG) sprName = "penghu_onwer-table-imgs-wz_peng";
        spr.spriteFrame = this._atlas.getSpriteFrame(sprName);
        return node;
    },

    recvGameOver(){
        this._isOver = true;
    },

    recvRoundOverNotify(data){
        data = data.detail;
        if(this._layer === null){
            cc.loader.loadRes("common/prefab/HongZhong_round_over_view",(err,prefab)=>{
                if(err === null){
                    this._layer = cc.instantiate(prefab);
                    this._layer.parent = this.node.getChildByName("scene");
                    this._layer.scaleX = this.node.width / this._layer.width;
                    this._layer.scaleY = this.node.height / this._layer.height;
                    this._layer.zIndex = 3;
                    this._layer.active = false;
                    this._layer.x = this.node.width/2;
                    this._layer.y = this.node.height/2;
                    this.initRoomInfo(data);
                    this.showRoundInfo(data);
                    
                    let self = this;
                    this.scheduleOnce(()=>{
                        self._layer.active = true;
                    },2);
                }
            })
        }

        this._OverScoreNode.active = true;
        for(let i=0;i<data.users.length;++i){
            let chairId = cc.vv.gameData.getLocalChair(data.users[i].seat);
            let score = this._OverScoreNode.getChildByName("score"+chairId);
            score.getComponent(cc.Label).string = data.users[i].roundScore;
            score.color = data.users[i].roundScore>0?(new cc.Color(236,187,111)):(new cc.Color(209,114,96));
        }
        this._OverScoreNode.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(()=>{
            this._OverScoreNode.active = false;
        })))

    },

    showRoundInfo(data){
        this._layer.getChildByName("spr_draw").active = (0 > data.hupaiType && 0 == data.smallState);
        let panle_playerInfo = this._layer.getChildByName("panle_playerInfo");
        panle_playerInfo.active = (0 < data.hupaiType || 0 < data.smallState);
        if (panle_playerInfo.active) {
            for(let i = 0; i < data.users.length; ++i){
                let chairId = cc.vv.gameData.getLocalChair(data.users[i].seat);
                let player = panle_playerInfo.getChildByName("player" + chairId);

                player.getChildByName("bg_other").active = (data.users[i].uid != cc.vv.UserManager.uid)
                player.getChildByName("bg_self").active = (data.users[i].uid === cc.vv.UserManager.uid)
                
                let spr_head = cc.find("head/radio_mask/spr_head",player);
                Global.setHead(spr_head, data.users[i].usericon);
                player.getChildByName("spr_banker").active = (data.buck ==- data.users[i].uid);
                player.getChildByName("text_name").getComponent(cc.Label).string = data.users[i].playername;

                player.getChildByName("spr_huType").active = (data.seat === data.users[i].seat && 0 < data.hupaiType);
                player.getChildByName("mask_lastCardHu").active = (data.seat === data.users[i].seat && 0 < data.hupaiType);
                if (data.seat === data.users[i].seat) {
                    let node = this.node.getComponent("HongZhong_Card").createCard(data.hcard);
                    node.parent = player.getChildByName("lastCard");
                }

                let handCard = player.getChildByName("handCard");
                let curPosX = 0;
                let cardWidth = 43;
                //杠牌
                for(let j = 0; j < data.users[i].gangpai.length; ++j){
                    for (let k = 0; k < 4; k++) {
                        let node = this.node.getComponent("HongZhong_Card").createCard(data.users[i].gangpai[j]);
                        node.parent = handCard;
                        if (3 > k) {
                            node.x = curPosX;
                            curPosX += cardWidth;
                        } else if (3 == k){
                            node.x = curPosX - cardWidth * 2;
                            node.y = node.height/4;
                        }
                    }
                    curPosX += 25;
                }
                //碰牌
                for(let j = 0; j < data.users[i].pengpai.length; ++j){
                    for (let k = 0; k < 3; k++) {
                        let node = this.node.getComponent("HongZhong_Card").createCard(data.users[i].pengpai[j]);
                        node.parent = handCard;
                        node.x = curPosX;
                        curPosX += cardWidth;
                    }
                    curPosX += 25;
                }
                //手牌
                for(let j = 0; j < data.users[i].handInCards.length; ++j){
                    let node = this.node.getComponent("HongZhong_Card").createCard(data.users[i].handInCards[j]);
                    node.parent = handCard;
                    node.x = curPosX;
                    curPosX += cardWidth;
                }

                if (0 <= data.users[i].roundScore) {
                    player.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = ('/' + Math.abs(data.users[i].roundScore));
                    player.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = '';
                } else {
                    player.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = '';
                    player.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = ('/' + Math.abs(data.users[i].roundScore));
                }
            }
        }

        let bg_zhongNiao = this._layer.getChildByName("bg_zhongNiao");
        bg_zhongNiao.active = (0 < data.hupaiType && 0 < data.smallState);
        if (bg_zhongNiao.active) {
            let zhongNiaoCard = bg_zhongNiao.getChildByName("zhongNiaoCard");
            for (let i = 0; i < data.bird.length; i++) {
                let node = this.node.getComponent("HongZhong_Card").createCard(data.bird[i]);
                node.parent = zhongNiaoCard;
                node.x = node.width * i;
            }
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


    initRoomInfo(data){
        let conf = cc.vv.gameData.getRoomConf();
        let roomId = cc.find("roomInfoNode/txt_room_id",this._layer);
        roomId.getComponent(cc.Label).string = "房间号:" + conf.deskId;

        let roundNum = cc.find("roomInfoNode/txt_round_num",this._layer);
        roundNum.getComponent(cc.Label).string = "局数:" + cc.vv.gameData.getDeskInfo().round + "/" + conf.gamenum;

        let txt_date = cc.find("roomInfoNode/txt_date",this._layer);
        txt_date.getComponent(cc.Label).string = data.overTime;

        let txt_game_desc = cc.find("roomInfoNode/txt_game_desc",this._layer);
        txt_game_desc.getComponent(cc.Label).string = cc.vv.gameData.getWanFaStrDetail();

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
                let node = this.node.getComponent("HongZhong_Card").createCard(tempList[i][j],false);
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
                let node = this.node.getComponent("HongZhong_Card").createCard(menzilist[j],false);
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
            this.node.getComponent("HongZhong_Card").changCardBg(bgNode,source===0);
            let cardNode = this.node.getComponent("HongZhong_Card").createCard(card,false);
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
            cc.loader.releaseRes("common/prefab/HongZhong_round_over_view",cc.Prefab);
        }
    }
    // update (dt) {},
});
