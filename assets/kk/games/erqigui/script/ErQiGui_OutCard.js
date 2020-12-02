
cc.Class({
    extends: cc.Component,

    properties: {
        
        _outCardNode:null,
        _chairId:-1,
        _seatIndex:-1,
        _UISeat:-1,
        _playerNum:0,
        _angle:0,
        _cardsNum:0,
        _outCardValue:null,
    },

    init(index,playerNum){
        this._playerNum = playerNum;

        this._chairId = cc.vv.gameData.getLocalSeatByUISeat(index);
        this._UISeat = index;
        this._outCardNode = cc.find("scene/out_cards/out_card"+index,this.node);
        this.mask_onOut = cc.find("scene/out_cards/mask_onOut"+index,this.node);
        this.mask_onOut.active = false;

        if(this._outCardNode){
            this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);
        }

        this.card_ani = cc.find("scene/out_cards/card_ani" + index, this.node);

        // this.aircraft_ani = cc.find("scene/out_cards/aircraft_ani", this.node);
        // this.aircraft_ani_Pos = cc.v2(this.node.width/2+this.aircraft_ani.width/2, 150);
        // this.aircraft_ani.position = this.aircraft_ani_Pos;

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

    clearDesk(){
        this._outCardValue = null;
        this._cardsNum = 0;
        if(this._outCardNode) {
            this._outCardNode.removeAllChildren();
        }
        // this.showNoOutCard(false);
        this.showOutCard();
    },

    start () {
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.PLAYER_ENTER,this.recvPlayerEnter,this);
        Global.registerEvent(EventId.PLAYER_EXIT,this.recvPlayerExit,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.OUT_CARD_NOTIFY,this.onRcvOutCardNotify,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);
        Global.registerEvent(EventId.UPDATE_PLAYER_INFO,this.onRcvUpdatePlayerInfo,this);

        Global.registerEvent(EventId.ERQIGUI_JIAO_SCORE_NOTIFY,this.onRcvJiaoScoreNotify,this);
        Global.registerEvent(EventId.ERQIGUI_SELECT_COLOR_NOTIFY,this.onRcvSelectColorNotify,this);
        Global.registerEvent(EventId.ERQIGUI_MAI_CARD_NOTIFY,this.onRcvMaiCardNotify,this);        

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
            let curRoundOutCards = data.actionInfo.curOutCardInfo.curRoundOutCards;
            for (let i = 0; i < curRoundOutCards.length; i++) {
                if (curRoundOutCards[i].seat === this._seatIndex) {
                    let isMaxOutCard = (this._seatIndex == data.actionInfo.curOutCardInfo.curMaxSeat);
                    this.showOutCard(curRoundOutCards[i].cards, isMaxOutCard);
                }
            }
            if (data.actionInfo.nextaction.seat === this._seatIndex) {
                if (0 < data.actionInfo.nextaction.type) {
                    this.setShowTimeCount(true, data.actionInfo.nextaction.time);
                }
            }
        }
    },

    onRcvJiaoScoreNotify(data){
        data = data.detail;
        if (data.actionInfo.nextaction.seat === this._seatIndex && 0 < data.actionInfo.nextaction.type) {
            this.setShowTimeCount(true, data.actionInfo.nextaction.time);
        } else {
            this.setShowTimeCount(false);
        }
    },

    onRcvSelectColorNotify(data){
        data = data.detail;
        if (data.actionInfo.nextaction.seat === this._seatIndex && 3 == data.actionInfo.nextaction.type) {
            this.setShowTimeCount(true, data.actionInfo.nextaction.time);
        }
    },

    onRcvMaiCardNotify(data){
        data = data.detail;
        if (data.actionInfo.nextaction.seat === this._seatIndex && 4 == data.actionInfo.nextaction.type) {
            this.setShowTimeCount(true, data.actionInfo.nextaction.time);
        }
    },

    // 轮到谁出牌谁上一轮出的牌或者要不起就隐藏，但是在压死之后大家都要不起又轮到他出牌的时候，这时候好像上一轮的牌要等他出完牌才隐藏‘’
    onRcvOutCardNotify(data){
        data = data.detail;
        let isMaxOutCard = (data.actionInfo.curaction.seat == data.actionInfo.curOutCardInfo.curMaxSeat);
        if (data.actionInfo.curaction.seat === this._seatIndex) {
            let outCards = data.actionInfo.curaction.outCards;
            // this.showNoOutCard(0 == outCards.length);
            this.showOutCard(outCards, isMaxOutCard);
            this.setShowTimeCount(false);
            if (cc.vv.gameData.CARDTYPE.CONNECT_CARD <= data.actionInfo.curaction.cardType) {
                this.playCardAni(data.actionInfo.curaction.cardType);
            }
            // this.showCardNum(data.cardsCnt);
            if (1 == data.cardsCnt) {
                cc.vv.AudioManager.playEff("paodekuai/", "alarm",true);
            }
        } else {
            if (isMaxOutCard && 0 < this._outCardNode.children.length) {
                this._outCardNode.children[this._outCardNode.children.length-1].getChildByName("maxCardSpr").active = false;
            }
        }
        if (data.actionInfo.nextaction.seat === this._seatIndex) {
            if (0 < data.actionInfo.nextaction.type) {
                this.setShowTimeCount(true, data.actionInfo.nextaction.time);
            }
        }
        if (data.isOverRound) {
            let self = this;
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(0.5), 
                    cc.callFunc(()=>{
                        self.showOutCard();
                    }), 
                )
            )
        }
    },

    onRecvHandCard(data){
        data = data.detail;
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

            // } else if (cardType == cc.vv.gameData.CARDTYPE.AIRCRAFT) {
            //     this.aircraft_ani.stopAllActions();
            //     this.aircraft_ani.position = this.aircraft_ani_Pos;
            //     this.aircraft_ani.runAction(cc.moveTo(1, cc.v2(-this.aircraft_ani_Pos.x, -this.aircraft_ani_Pos.y)));

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

    showOutCard(list, isMaxOutCard = false){
        this._outCardNode.removeAllChildren();
        if (list && 0 < list.length) {
            let cardScale = 0.4;
            let cardOffsetX = cc.vv.gameData.CardWidth/2 * cardScale;
            let startPosX = 0;
            if(0 == this._UISeat || 2 == this._UISeat){         // 上下 居中
                startPosX = - (cardOffsetX * (list.length-1))/2;
            } else if(this._UISeat === 1){  //右 右对齐
                startPosX = - cardOffsetX * (list.length-1);
            } else if(this._UISeat === 2){  //左 左对齐
                startPosX = 0;
            }
            for (let i = 0; i < list.length; i++) {
                let node = this.node.getComponent("ErQiGui_Card").createCard(list[i]);
                if (list.length - 1 == i) {
                    node.getChildByName("maxCardSpr").active = isMaxOutCard;
                }
                node.scale = cardScale;
                node.parent = this._outCardNode;
                node.x = startPosX + cardOffsetX * i;
            }
        }
    },

    // showNoOutCard(bShow){
    //     this.mask_onOut.active = bShow;
    // },

    recvRoundOver(data){
        data = data.detail;
        for(let i=0;i<data.users.length;++i){
            if(data.users[i].seat === this._seatIndex){    
                this.setShowTimeCount(false);
                // this.ani_warn.active = false;     
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

    recvPlayerExit(data){
        data = data.detail;
        if(data === this._seatIndex){
            this._seatIndex = -1;
        }
    }

    // update (dt) {},
});
