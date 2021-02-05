
cc.Class({
    extends: cc.Component,

    properties: {
    
        _layer:null,
        _show:false,
        _isOver:false,
        _OverScoreNode:null,
    },

    start () {
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOverNotify,this);
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.GAMEOVER,this.recvGameOver,this);

        this._OverScoreNode = cc.find("scene/over_score",this.node);
        this._OverScoreNode.active = false;
    },

    init(atlas){
        this._atlas = atlas;
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
                player.getChildByName("spr_banker").active = (data.buck === data.users[i].uid);
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

                if (0 > data.users[i].roundScore) {
                    player.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = '';
                    player.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = ('/' + Math.abs(data.users[i].roundScore).toFixed(1));
                } else if (0 == data.users[i].roundScore) {
                    player.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = (Math.abs(data.users[i].roundScore));
                    player.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = '';
                } else {
                    player.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = ('/' + Math.abs(data.users[i].roundScore).toFixed(1));
                    player.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = '';
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

    recvGameOver(){
        this._isOver = true;
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
});
