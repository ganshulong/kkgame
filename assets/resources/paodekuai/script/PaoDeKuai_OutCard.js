
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
    },

    start () {
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.PLAYER_ENTER,this.recvPlayerEnter,this);
        Global.registerEvent(EventId.PLAYER_EXIT,this.recvPlayerExit,this);
        // Global.registerEvent(EventId.PENG_NOTIFY,this.recvPengNotify,this);x
        // Global.registerEvent(EventId.MOPAI_NOTIFY,this.recvMoPaiNotify,this);
        // Global.registerEvent(EventId.CHI_NOTIFY,this.recvChiCard,this);
        // Global.registerEvent(EventId.PAO_NOTIFY,this.recvPaoNotify,this);
        // Global.registerEvent(EventId.LONG_NOTIFY,this.showOutCard,this);
        // Global.registerEvent(EventId.KAN_NOTIFY,this.showOutCard,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.showOutCard,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.OUT_CARD_NOTIFY,this.onRcvOutCardNotify,this);
        Global.registerEvent(EventId.GUO_NOTIFY,this.onRcvGuoCardNotify,this);

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
        }
    },

    onRcvOutCardNotify(data){
        data = data.detail;
        if (data.actionInfo.curaction.seat === this._seatIndex) {
            let outCards = data.actionInfo.curaction.outCards;
            this.showNoOutCard(0 == outCards.length);
            this.showOutCard(outCards);
            if (cc.vv.gameData.CARDTYPE.CONNECT_CARD <= data.actionInfo.curaction.cardType) {
                this.playCardAni(data.actionInfo.curaction.cardType);
            }
        }
        if (data.actionInfo.nextaction.seat === this._seatIndex) {
            this.showNoOutCard(false);
            this.showOutCard();
        }
    },

    playCardAni(cardType){
        if (cardType) {
            let cardAniNode = null;
            if (cardType == cc.vv.gameData.CARDTYPE.CONNECT_CARD || cardType == cc.vv.gameData.CARDTYPE.COMPANY_CARD) {
                if (cardType == cc.vv.gameData.CARDTYPE.CONNECT_CARD) {
                    cardAniNode = this.card_ani.getChildByName("connect_ani");
                } else {
                    cardAniNode = this.card_ani.getChildByName("company_ani");
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
        }
        if (data.actionInfo.nextaction.seat === this._seatIndex) {
            this.showNoOutCard(false);
            this.showOutCard();
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

    // 要不起
    recvGuoNotify(data){
        data = data.detail;
        if (true) {
            this.showNoOutCard(true);
        }

        // data = data.detail;
        // this.showOutCard();
        // if(data.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.MOPAI){
        //     if(data.actionInfo.curaction.seat === this._seatIndex){
        //         let card = data.actionInfo.curaction.card;
        //         this.putOutCard(card);
        //     }
        // }
    },

    // 吃
    // recvChiCard(data){
    //     data = data.detail;
    //     this.showOutCard();
    //     if(data.actionInfo.curaction.seat === this._seatIndex && data.luoData){
    //         for(let i=0;i<data.luoData.length;++i){
    //             this.showCard(data.luoData[i],true);
    //         }
    //     }
    // },

    // recvMoPaiNotify(data){
    //     data = data.detail;
    //     this.showOutCard();
    // },


    putOutCard(card){
        this._outCardValue = [];
        this._outCardValue.push(card);
    },

    // recvPaoNotify(data){
    //     data = data.detail;
    //     if (this._outCardValue) {
    //         for (let j = 0; j < this._outCardValue.length; j++) {
    //             if (data.actionInfo.curaction.card == this._outCardValue[j]) {
    //                 this._outCardValue.splice(j,1)
    //             }
    //         }
    //     }
    //     if(data.delQiPaiSeat === this._seatIndex){
    //         let card = data.delQiPaiCard;
    //         let node = null;
    //         let num = 0;
    //         for(let i=0;i<this._outCardNode.childrenCount;++i){
    //             let child = this._outCardNode.children[i];
    //             if(child.cardValue === card){
    //                 node = child;
    //             }
    //             else {
    //                 if(node){
    //                     let pos = this.getEndPos(num);
    //                     this._outCardNode.children[i].position = pos;
    //                 }
    //                 ++num;
    //             }
    //         }
    //         if(node) {
    //             this._cardsNum = num;
    //             node.removeFromParent();
    //         }
    //     }
    // },

    // recvPengNotify(data){
    //     data = data.detail;
    //     if(data.actionInfo.curaction.source === this._seatIndex){
    //         // this.putOutCard(data.actionInfo.curaction.card);
    //         // this.showOutCard();
    //     }
    // },

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
