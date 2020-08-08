
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

        if(this._outCardNode){
            let pos = showCardNode.parent.convertToWorldSpaceAR(showCardNode.position);
            this._startPos = this._outCardNode.convertToNodeSpaceAR(pos);
            this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);
        }

        this.card_ani = cc.find("scene/out_cards/card_ani" + index, this.node);
        this.aircraft_ani = cc.find("scene/out_cards/aircraft_ani", this.node);
        this.aircraft_ani_Pos = this.aircraft_ani.position;

        this.bg_cardNum = cc.find("scene/out_cards/bg_cardNum" + index, this.node);
        this.bg_cardNum.active = false;
        this.ani_warn = cc.find("scene/out_cards/ani_warn" + index, this.node);
        this.ani_warn.active = false;
        this.ani_clock = cc.find("scene/out_cards/ani_clock" + index, this.node);
        this.setShowTimeCount(false);
    },

    getEndPos(cardsNum){
        let endPos = cc.v2(0,0);
        let y = parseInt(cardsNum/5);   //竖行
        let x = cardsNum%5;
        let width = 37;
        let height = 36;

        // 下
        if(this._UISeat === 0){
            endPos.x = width*x;
            endPos.y = height*y;

        //右
        } else if(this._UISeat === 1){
            endPos.y = height*x;
            endPos.x = -width*y;
        
        //上
        } else if(this._UISeat === 2){
            endPos.x = width*x;
            endPos.y = -height*y;
        
        //左
        } else if(this._UISeat === 3){
            endPos.y = height*x;
            endPos.x = width*y;
        }
        return endPos;
    },

    showCard(value,showAction = false){
        let node = this.node.getComponent("PaoDeKuai_Card").createCard(value,showAction?0:2);

        let endPos = this.getEndPos(this._cardsNum);


        if(showAction){
            this.showCardAction(node,cc.v2(this._startPos.x,this._startPos.y),cc.v2(endPos.x,endPos.y));
        }
        else{
            node.position = endPos;
        }
        node.parent = this._outCardNode;
        node.cardValue = value;
        ++this._cardsNum;

    },

    clearDesk(){
        this._outCardValue = null;
        this._cardsNum = 0;
        if(this._outCardNode) {
            this._outCardNode.removeAllChildren();
        }
        this.showNoOutCard(false);
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

        this.recvDeskInfoMsg();
    },

    recvDeskInfoMsg(){
        let data = cc.vv.gameData.getDeskInfo();
        if(data.isReconnect && this._outCardNode){
            let putCardsList = data.actionInfo.curaction.putCardsList;
            for (let i = 0; i < putCardsList.length; i++) {
                if (putCardsList[i].seat === this._seatIndex) {
                    this.showNoOutCard(putCardsList[i].isPass);
                    this.showOutCard(putCardsList[i].outCards);
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

    onRcvOutCardNotify(data){
        data = data.detail;
        if (data.actionInfo.curaction.seat === this._seatIndex) {
            let outCards = data.actionInfo.curaction.outCards;
            this.showNoOutCard(0 == outCards.length);
            this.showOutCard(outCards);
            this.setShowTimeCount(false);
            if (cc.vv.gameData.CARDTYPE.CONNECT_CARD <= data.actionInfo.curaction.cardType) {
                this.playCardAni(data.actionInfo.curaction.cardType);
            }
            this.showCardNum(data.cardsCnt);
        }
        if (data.actionInfo.nextaction.seat === this._seatIndex) {
            if (0 == this._UISeat) {
                this.showNoOutCard(false);
                this.showOutCard();
            }
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
        this.bg_cardNum.active = (0 < cardNum);
        this.bg_cardNum.getChildByName("text_cardNum").getComponent(cc.Label).string = cardNum;
        if (1 == cardNum) {
            this.ani_warn.active = true;
        }
    },

    playCardAni(cardType){
        if (cardType) {
            let cardAniNode = null;
            if (cardType == cc.vv.gameData.CARDTYPE.CONNECT_CARD || 
                cardType == cc.vv.gameData.CARDTYPE.COMPANY_CARD ||
                cardType == cc.vv.gameData.CARDTYPE.CHUN_TIAN) {
                if (cardType == cc.vv.gameData.CARDTYPE.CONNECT_CARD) {
                    cardAniNode = this.card_ani.getChildByName("connect_ani");
                } else if (cardType == cc.vv.gameData.CARDTYPE.COMPANY_CARD) {
                    cardAniNode = this.card_ani.getChildByName("company_ani");
                } else {
                    cardAniNode = this.card_ani.getChildByName("chuntian_ani");
                }
                cardAniNode.stopAllActions();
                cardAniNode.active = true;
                cardAniNode.scale = 0;
                cardAniNode.runAction(
                    cc.sequence(
                        cc.scaleTo(0.3, 1.2, 1.2),
                        cc.scaleTo(0.1, 0.8, 0.8),
                        cc.scaleTo(0.1, 1.1, 1.1),
                        cc.scaleTo(0.1, 1, 1),
                        cc.delayTime(0.2),
                        cc.callFunc(()=>{
                            cardAniNode.active = false;
                        })
                    )
                )

            } else if (cardType == cc.vv.gameData.CARDTYPE.AIRCRAFT) {
                this.aircraft_ani.stopAllActions();
                this.aircraft_ani.position = this.aircraft_ani_Pos;
                this.aircraft_ani.runAction(cc.moveTo(1, cc.v2(-this.aircraft_ani.position.x, -this.aircraft_ani.position.y)));

            } else if (cardType == cc.vv.gameData.CARDTYPE.BOMB_CARD) {
                cardAniNode = this.card_ani.getChildByName("bomb_ani");
                cardAniNode.stopAllActions();
                cardAniNode.active = true;
                cardAniNode.getComponent(cc.Animation).play("show");
                cardAniNode.runAction(
                    cc.sequence(
                        cc.delayTime(0.85),
                        cc.callFunc(()=>{
                            cardAniNode.active = false;
                        })
                    )
                )
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
        if (data.actionInfo.nextaction.seat === this._seatIndex) {
            if (0 == this._UISeat) {
                this.showNoOutCard(false);
                this.showOutCard();
            }
            if (0 < data.actionInfo.nextaction.type) {
                this.setShowTimeCount(true, data.actionInfo.nextaction.time);
            }
        }
    },

    showOutCard(list){
        this._outCardNode.removeAllChildren();
        if (list && 0 < list.length) {
            let cardScale = 0.5;
            let cardWidth = cc.vv.gameData.CardWidth * cardScale;
            let startPosX = 0;
            if(this._UISeat === 0){         // 下 居中
                startPosX = cardWidth/2 * i - (cardWidth/2*(list.length-1))/2;
            } else if(this._UISeat === 1){  //右 右对齐
                startPosX = - cardWidth/2*(list.length-1);
            } else if(this._UISeat === 2){  //左 左对齐
                startPosX = 0;
            }
            for (let i = 0; i < list.length; i++) {
                let node = this.node.getComponent("PaoDeKuai_Card").createCard(list[i]);
                node.scale = cardScale;
                node.parent = this._outCardNode;
                node.x = startPosX + cardWidth/2 * i;
            }
        }
    },

    showNoOutCard(bShow){
        this.mask_onOut.active = bShow;
    },

    recvRoundOver(data){
        data = data.detail;
        for(let i=0;i<data.users.length;++i){
            if(data.users[i].seat === this._seatIndex){    
                this.setShowTimeCount(false);
                this.ani_warn.active = false;     
                if (data.users[i].isChunTian) {
                    this.playCardAni(cc.vv.gameData.CARDTYPE.CHUN_TIAN);
                    break;
                }
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
            this.node.getComponent("PaoDeKuai_Card").createCard(node.cardValue,2,node.showBg,node);
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
