
cc.Class({
    extends: cc.Component,

    properties: {
        
        _outCardNode:null,
        _chairId:-1,
        _seatIndex:-1,
        _UISeat:-1,
        _playerNum:0,
        _startPos:null,
        _angle:0,
        _cardsNum:0,
        _outCardValue:null,
    },

    init(index,playerNum){
        let outCardNode

        let showCardNode = cc.find("scene/out_cards/show_card"+index,this.node);

        this._playerNum = playerNum;

        this._chairId = cc.vv.gameData.getLocalSeatByUISeat(index);
        this._UISeat = index;
        this._outCardNode = cc.find("scene/out_cards/out_card"+index,this.node);
        this.mask_onOut = cc.find("scene/out_cards/mask_onOut"+index,this.node);
        this.mask_onOut.active = false;
        this.mask_shangYou = cc.find("scene/out_cards/mask_shangYou"+index,this.node);
        this.showShangYou(false);

        if(this._outCardNode){
            let pos = showCardNode.parent.convertToWorldSpaceAR(showCardNode.position);
            this._startPos = this._outCardNode.convertToNodeSpaceAR(pos);
            this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);
        }

        this.card_ani = cc.find("scene/out_cards/card_ani" + index, this.node);

        this.aircraft_ani = cc.find("scene/out_cards/aircraft_ani", this.node);
        this.aircraft_ani_Pos = cc.v2(this.node.width/2+this.aircraft_ani.width/2, 150);
        this.aircraft_ani.position = this.aircraft_ani_Pos;

        this.bg_cardNum = cc.find("scene/out_cards/bg_cardNum" + index, this.node);
        this.bg_cardNum.active = false;
        this.ani_warn = cc.find("scene/out_cards/ani_warn" + index, this.node);
        this.ani_warn.active = false;
        this.ani_clock = cc.find("scene/out_cards/ani_clock" + index, this.node);
        this.setShowTimeCount(false);
    },

    clearDesk(){
        this._outCardValue = null;
        this._cardsNum = 0;
        if(this._outCardNode) {
            this._outCardNode.removeAllChildren();
        }
        this.showNoOutCard(false);
        this.showShangYou(false);
        this.showOutCard();
    },

    start () {
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.PLAYER_ENTER,this.recvPlayerEnter,this);
        Global.registerEvent(EventId.PLAYER_EXIT,this.recvPlayerExit,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.OUT_CARD_NOTIFY,this.onRcvOutCardNotify,this);
        Global.registerEvent(EventId.GUO_NOTIFY,this.onRcvGuoCardNotify,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);
        Global.registerEvent(EventId.UPDATE_PLAYER_INFO,this.onRcvUpdatePlayerInfo,this);

        this.recvDeskInfoMsg();
    },

    onRcvUpdatePlayerInfo(){
        if (0 >= this._seatIndex) {
            let users = cc.vv.gameData.getUsers();
            for(let i=0;i<users.length;++i){
                let chairId = cc.vv.gameData.getLocalChair(users[i].seat);
                if(chairId === this._chairId){
                    this._seatIndex = users[i].seat;
                    break;
                }
            }
        }
        this.recvDeskInfoMsg();
    },
    
    recvDeskInfoMsg(){
        let data = cc.vv.gameData.getDeskInfo();
        if(data.isReconnect && this._outCardNode){
            let outCards = data.actionInfo.curaction.outCards;
            if (data.actionInfo.curaction.seat === this._seatIndex) {
                if (!(data.actionInfo.nextaction.seat === this._seatIndex && 0 < data.actionInfo.nextaction.type)) {    //非当前出牌玩家才显示出牌情况
                    this.showNoOutCard(0 == outCards.length);
                    this.showOutCard(outCards, data.actionInfo.curaction.cardType);
                }
            }
            for(let i=0;i<data.users.length;++i){
                if(this._seatIndex === data.users[i].seat){
                    this.showCardNum(data.users[i].cardsCnt);
                }
            }
            if (data.actionInfo.nextaction.seat === this._seatIndex) {
                if (0 < data.actionInfo.nextaction.type) {
                    this.setShowTimeCount(true, data.actionInfo.nextaction.time);
                }
            }
        }
    },

    // 轮到谁出牌谁上一轮出的牌或者要不起就隐藏，但是在压死之后大家都要不起又轮到他出牌的时候，这时候好像上一轮的牌要等他出完牌才隐藏‘’
    onRcvOutCardNotify(data){
        data = data.detail;
        if (data.actionInfo.curaction.seat === this._seatIndex) {
            let outCards = data.actionInfo.curaction.outCards;
            this.showNoOutCard(0 == outCards.length);
            this.showOutCard(outCards, data.actionInfo.curaction.cardType);
            this.setShowTimeCount(false);
            this.showCardNum(data.cardsCnt);
            if (1 == data.cardsCnt) {
                cc.vv.AudioManager.playEff("paodekuai/", "alarm",true);
            }
            if (1 == data.isYiYou) {
                this.showShangYou(true);
            }
        }
        //同花只有2人场 不是出牌玩家就是下轮出牌玩家
        if (data.actionInfo.nextaction.seat === this._seatIndex) {
            this.showNoOutCard(false);
            this.showOutCard();
            if (0 < data.actionInfo.nextaction.type) {
                this.setShowTimeCount(true, data.actionInfo.nextaction.time);
            }
        }
    },

    onRcvGuoCardNotify(data){
        data = data.detail;
        if (data.seat === this._seatIndex) {
            this.showNoOutCard(true);
            this.showOutCard();
            this.setShowTimeCount(false);
        }
        //同花只有2人场 不是出牌玩家就是下轮出牌玩家
        if (data.actionInfo.nextaction.seat === this._seatIndex) {
            this.showNoOutCard(false);
            this.showOutCard();
            if (0 < data.actionInfo.nextaction.type) {
                this.setShowTimeCount(true, data.actionInfo.nextaction.time);
            }
        }
    },

    onRecvHandCard(data){
        data = data.detail;
        if(this._seatIndex === data.seat){
            this.showCardNum(data.cardsCnt);
        }
        if (this._seatIndex == data.actionInfo.nextaction.seat) {
            if (0 < data.actionInfo.nextaction.type) {
                this.setShowTimeCount(true, data.actionInfo.nextaction.time);
            }
        } 
    },

    setShowTimeCount(bShow, time){
        this.ani_clock.active = bShow;
        if (bShow) {
            let text_clockNum = this.ani_clock.getChildByName("text_clockNum");
            text_clockNum.getComponent(cc.Label).string = time;
            if(0 < time){
                text_clockNum.stopAllActions();
                text_clockNum.runAction(
                    cc.repeatForever(
                        cc.sequence(
                            cc.delayTime(1), 
                            cc.callFunc(()=>{
                                text_clockNum.getComponent(cc.Label).string = --time;
                                if (0 == time) {
                                    text_clockNum.stopAllActions();
                                }
                            })
                        )
                    )
                )
            }
        }
    },

    showCardNum(cardNum){
        let isShowCardNum = cc.vv.gameData.getRoomConf().param2;
        if (isShowCardNum) {
            this.bg_cardNum.active = (0 < cardNum);
            this.bg_cardNum.getChildByName("text_cardNum").getComponent(cc.Label).string = cardNum;
            this.ani_warn.active = (1 == cardNum);
        }
    },

    showOutCard(list, cardType){
        this._outCardNode.removeAllChildren();
        if (list && 0 < list.length) {
            let cardScale = 0.65;
            let cardWidth = cc.vv.gameData.CardWidth * cardScale;
            let startPosX = - (cardWidth/2*(list.length-1))/2;
            for (let i = 0; i < list.length; i++) {
                let node = this.node.getComponent("TongHua_Card").createCard(list[i]);
                node.scale = cardScale;
                node.parent = this._outCardNode;
                node.x = startPosX + cardWidth/2 * i;
                if (list.length-1 == i && 1 < cardType) {
                    node.getChildByName("cardNumText").getComponent(cc.Label).string = list.length;
                    node.getChildByName("cardTypeText").getComponent(cc.Label).string = (3 == cardType) ? "同花" : "炸弹";
                    node.getChildByName("cardNumText").color = (3 == cardType) ? (new cc.Color(255,0,0)) : (new cc.Color(0,0,255));
                    node.getChildByName("cardTypeText").color = (3 == cardType) ? (new cc.Color(255,0,0)) : (new cc.Color(0,0,255));
                }
            }
        }
    },

    showNoOutCard(bShow){
        this.mask_onOut.active = bShow;
    },

    showShangYou(bShow){
        this.mask_shangYou.active = bShow;
    },

    recvRoundOver(data){
        data = data.detail;
        for(let i=0;i<data.users.length;++i){
            if(data.users[i].seat === this._seatIndex){    
                this.setShowTimeCount(false);
                this.ani_warn.active = false;     
            }
        }
    },

    recvPlayerEnter(data){
        data = data.detail;
        let chairId = cc.vv.gameData.getLocalChair(data.seat);
        if(chairId === this._chairId){
            this._seatIndex = data.seat;
        }
    },

    showCardAction(node,startPos,endPos){
        node.position = startPos;
        node.scale = 1;

        let time = cc.vv.gameData.getActionTime();
        node.opacity = 255;

        node.runAction(cc.sequence(cc.spawn(cc.moveTo(time,endPos),cc.scaleTo(time,0.48),cc.fadeTo(time,50)),cc.callFunc(()=>{
            this.node.getComponent("TongHua_Card").createCard(node.cardValue,2,node.showBg,node);
            node.scale = 1;
            node.rotation = 0;
            node.opacity = 255;
        })))
    },

    recvPlayerExit(data){
        data = data.detail;
        if(data === this._seatIndex){
            this._seatIndex = -1;
        }
    }

    // update (dt) {},
});
