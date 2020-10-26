
cc.Class({
    extends: cc.Component,

    properties: {
        
        _handcardNode:null,
        _handCards:[],         // 手牌
        _num:0,
        _cardBox:[],
        // _selectCard:null,
        _outCardY:0,
        _startPosX:null,
        _canOutCard:false,      // 可以出牌
        _cardBoXPos:null,
        _handCardData:null,
        _canTouch:true,
    },

    init(index){
        if (0 === index) {
            let bg_view = cc.find("scene/bg_view",this.node);
            Global.btnClickEvent(bg_view,this.onClickBgResetCardState,this);

            this._handcardNode = cc.find("scene/handleCardView",this.node);

            this._chairId = cc.vv.gameData.getLocalSeatByUISeat(0);
            this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);

            this._operateNode = cc.find("scene/play_action_view",this.node);
            this.showOperateBtn(false);
            // 不出
            this.btn_noOut = this._operateNode.getChildByName("btn_noOut");
            Global.btnClickEvent(this.btn_noOut,this.onClickNoOut,this);
            // 出
            this.btn_outCard = this._operateNode.getChildByName("btn_outCard");
            Global.btnClickEvent(this.btn_outCard,this.onClickOutCard,this);

            this.TongHua_CardLogicJS = this.node.getComponent("TongHua_CardLogic");
        }

        if (cc.vv.gameData._isPlayBack && 0 < index) {
            this._handcardNode = cc.find("scene/playback_handle/player"+index,this.node);
            this._chairId = cc.vv.gameData.getLocalSeatByUISeat(index);
            this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);
        }

        let box = cc.find("scene/cardBox",this.node);
        this._cardBoXPos = box.parent.convertToWorldSpaceAR(box.position);
        this._cardBoXPos.x -= 8;
        this._cardBoXPos.y += 24;
    },

    start () {
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        // Global.registerEvent(EventId.CHI_NOTIFY,this.recvChiCard,this);
        Global.registerEvent(EventId.PLAYER_ENTER,this.recvPlayerEnter,this);
        Global.registerEvent(EventId.PLAYER_EXIT,this.recvPlayerExit,this);
        // Global.registerEvent(EventId.KAN_NOTIFY,this.recvKanAndKanNotify,this);
        // Global.registerEvent(EventId.PENG_NOTIFY,this.recvKanAndKanNotify,this);
        // Global.registerEvent(EventId.PAO_NOTIFY,this.recvPaoAndLongNotify,this);
        // Global.registerEvent(EventId.LONG_NOTIFY,this.recvPaoAndLongNotify,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        // Global.registerEvent(EventId.DEL_HANDCARD_NOTIFY,this.recvDelHandcardNotify,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);
        Global.registerEvent(EventId.OUT_CARD_NOTIFY,this.onRcvOutCardNotify,this);
        Global.registerEvent(EventId.GUO_NOTIFY,this.onRcvGuoCardNotify,this);
        Global.registerEvent(EventId.UPDATE_PLAYER_INFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.OUT_CARD_FAILD,this.onRcvOutCardFaild,this);

        this.recvDeskInfoMsg();
    },

    recvDeskInfoMsg(){
        let data = cc.vv.gameData.getDeskInfo();
        if((data.isReconnect || cc.vv.gameData._isPlayBack) && this._handcardNode) {
            for(let i=0;i<data.users.length;++i){
                if(this._seatIndex === data.users[i].seat && data.users[i].handInCards){
                    if (0 < data.users[i].handInCards.length) {
                        this.showHandCard(data.users[i].handInCards);
                    }

                    if (data.actionInfo.nextaction.seat === this._seatIndex && 0 < data.actionInfo.nextaction.type) {
                        // this.curaction = data.actionInfo.curaction;
                        this.showOperateBtn(true, data.actionInfo.waitList);
                    } else {
                        this.showOperateBtn(false);
                    }
                }
            }
        }
    },

    onRcvOutCardFaild(){
        if (0 === this._chairId && this.handcardNodeSortList) {
            this.onClickBgResetCardState();
        }
    },

    onRcvOutCardNotify(data){
        data = data.detail;
        if (data.actionInfo.curaction.seat === this._seatIndex) {
            let outCards = data.actionInfo.curaction.outCards;
            // this.initCardHintState();
            if (0 < outCards.length) {
                let handCards = this._handCards.slice(0);
                for (let o = 0; o < outCards.length; o++) {
                    for (let h = 0; h < handCards.length; h++) {
                        if (outCards[o] == handCards[h]) {
                            handCards.splice(h,1);
                            break;
                        }
                    }
                }
                this.showHandCard(handCards);
            }
        }
        if (data.actionInfo.nextaction.seat === this._seatIndex && 0 < data.actionInfo.nextaction.type) {
            // this.curaction = data.actionInfo.curaction;
            this.showOperateBtn(true, data.actionInfo.waitList);
        } else {
            this.showOperateBtn(false);
        }
    },

    onRcvGuoCardNotify(data){
        data = data.detail;
        if (data.actionInfo.nextaction.seat === this._seatIndex && 0 < data.actionInfo.nextaction.type) {
            // this.curaction = data.actionInfo.curaction;
            this.showOperateBtn(true, data.actionInfo.waitList);
        } else {
            this.showOperateBtn(false);
        }
    },

    // onClickTipCard(){
    //     if (0 < this.hintList.length) {
    //         this.initCardSelectState();
    //         ++this.hintIndex;
    //         this.hintIndex = this.hintIndex % this.hintList.length;
    //         this.popHintCards(this.hintList[this.hintIndex]);
    //     } else {
    //         cc.vv.FloatTip.show("本轮首出，无法提示");
    //     }
    // },

    // popHintCards(hintCards){
    //     for (let i = 0; i < hintCards.length; i++) {
    //         let finIndex = 0;
    //         for (let finIndex = 0; finIndex < this._handCards.length; finIndex++) {
    //             if (hintCards[i] == this._handCards[finIndex]) {
    //                 this._handcardNode.children[finIndex].isSelect = true;
    //                 this._handcardNode.children[finIndex].y = 50;
    //                 break;
    //             }
    //         }
    //     }
        
    // },

    onClickNoOut(){
        var req = {c: MsgId.GUO};
        cc.vv.NetManager.send(req);
        return;
    },

    onClickOutCard(){
        let cards = this.getSelectedCards();
        if (0 < cards.length) {
            let req = {c: MsgId.OUT_CARD};
            req.cards = cards;
            cc.vv.NetManager.send(req);
            return;
        }
    },

    showOperateBtn(bShow, list){
        if (cc.vv.gameData._isPlayBack || 0 != this._chairId) {
            return;
        }
        this._operateNode.active = bShow;
        if (bShow && list) {
            this.btn_noOut.active = false;
            this.btn_outCard.active = false;
            for (let i = 0; i < list.length; i++) {
                if (0 === list[i].type) {
                    this.btn_noOut.active = true;
                    this.btn_noOut.x = (1 == list.length) ? 0 : -150;
                } else if (1 === list[i].type) {
                    this.btn_outCard.active = true;
                    this.btn_outCard.x = (1 == list.length) ? 0 : 150;
                }
            }
        }
    },

    // getCardIsCanOutList(hint){
    //     let cardIsCanOutList = [];
    //     if (0 == hint.length) {
    //         for (let i = 0; i < 0x10; i++) {
    //             cardIsCanOutList[i] = true;
    //         }
    //         return cardIsCanOutList;
    //     }
    //     for (let i = 0; i < hint.length; i++) {
    //         if (3 == hint[i].length || 
    //             4 == hint[i].length || 
    //             (6 == hint[i].length && (hint[i][0] % 0x10 - 1) == hint[i][5] % 0x10)) {
    //             for (let i = 0; i < 0x10; i++) {
    //                 cardIsCanOutList[i] = true;
    //             }
    //             return cardIsCanOutList;
    //         }
    //         for (let j = 0; j < hint[i].length; j++) {
    //             cardIsCanOutList[hint[i][j] % 0x10] = true;
    //         }
    //     }
    //     return cardIsCanOutList;
    // },

    // getIsInitCardSelectState(cardIsCanOutList){
    //     for (let i = 0; i < this._handCards.length; i++) {
    //         if (this._handcardNode.children[i].isSelect && !cardIsCanOutList[this._handCards[i] % 0x10]) {
    //             return true;
    //         }
    //     }
    //     return false;
    // },

    // initCardSelectState(){
    //     for (let i = 0; i < this._handcardNode.children.length; i++) {
    //         if (this._handcardNode.children[i].isSelect) {
    //             this._handcardNode.children[i].isSelect = false;
    //             this._handcardNode.children[i].y =  0;
    //         }
    //     }
    // },

    // initCardHintState(){
    //     for (let i = 0; i < this._handcardNode.children.length; i++) {
    //         if (this._handcardNode.children[i].isNoCanOut) {
    //             this._handcardNode.children[i].isNoCanOut = false;
    //             this._handcardNode.children[i].color = new cc.Color(255,255,255);
    //         }
    //     }
    // },

    // setCardHintState(cardIsCanOutList){
    //     for (let i = 0; i < this._handCards.length; i++) {
    //         if (!cardIsCanOutList[this._handCards[i] % 0x10]) {
    //             this._handcardNode.children[i].isNoCanOut = true;
    //             this._handcardNode.children[i].color = new cc.Color(100,100,100);
    //         }
    //     }
    // },

    // // 检查是否可以出牌
    // checkCanOutCard(seat){
    //     if(this._chairId === 0){
    //         if(this._seatIndex === seat){
    //             this._canOutCard = true;
    //         } else {
    //             this._canOutCard = false;
    //         }
    //     }
    // },

    showHandCard(list, bShowMoveAni = false){
        this._handCards = list;
        this._handcardNode.removeAllChildren();
        this.handcardNodeSortList = [];
        if (0 == list.length) {
            return;
        }

        let cardGroupsInfo = this.TongHua_CardLogicJS.GetCardGroupsInfo(list);
        let cardGroups = cardGroupsInfo.card2DListEx;
        let self = this;
        let cardScale = 0.75;
        for (let i = 0; i < cardGroups.length; i++) {
            for (let j = 0; j < cardGroups[i].length; j++) {
                let node = this.node.getComponent("TongHua_Card").createCard(cardGroups[i][j]);
                node.parent = this._handcardNode;
                this.handcardNodeSortList.push(node);
                node.col = i;
                node.zIndex = this.handcardNodeSortList.length;
                let endPosX = node.width*cardScale/2 * i - (node.width*cardScale/2*(cardGroups.length-1))/2;
                let endPosY = node.height*cardScale/2 + node.height*cardScale/9* (cardGroups[i].length-1-j);
                node.posX = endPosX;
                node.posY = endPosY;
                node.isTongHua = (i < cardGroupsInfo.tongHuaNum);
                if (node.isTongHua) {
                    node.color = new cc.Color(255,220,220);
                }
                if ((4 <= cardGroups[i].length && j == (cardGroups[i].length-1))) {
                    node.getChildByName("cardNumText").getComponent(cc.Label).string = cardGroups[i].length;
                    node.getChildByName("cardTypeText").getComponent(cc.Label).string = node.isTongHua ? "同花" : "炸弹";
                    node.getChildByName("cardNumText").color = node.isTongHua ? (new cc.Color(255,0,0)) : (new cc.Color(0,0,255));
                    node.getChildByName("cardTypeText").color = node.isTongHua ? (new cc.Color(255,0,0)) : (new cc.Color(0,0,255));
                } else {
                    node.getChildByName("cardNumText").getComponent(cc.Label).string = "";
                    node.getChildByName("cardTypeText").getComponent(cc.Label).string = "";
                }
                if (bShowMoveAni) {
                    node.scale = 0;
                    node.position = cc.v2(0, this.node.height);
                    node.runAction(
                        cc.sequence(
                            cc.callFunc(()=>{
                                if (0 == i) {
                                   self._canTouch = false;
                                }
                            }), 
                            cc.delayTime(i * 0.05), 
                            cc.callFunc(()=>{
                                cc.vv.AudioManager.playEff("paodekuai/", "fapai",true);
                            }), 
                            cc.spawn(
                                cc.scaleTo(0.2, 1*cardScale), 
                                cc.moveTo(0.2, cc.v2(endPosX, endPosY))
                            ),
                            cc.scaleTo(0.02, 1.1*cardScale), 
                            cc.scaleTo(0.02, 1*cardScale), 
                            cc.callFunc(()=>{
                                if ((cardGroups.length-1) == i) {
                                   self._canTouch = true;
                                }
                            }), 
                        )
                    )
                } else {
                    if (cc.vv.gameData._isPlayBack && 0 < this._chairId) {
                        node.scale = cardScale*0.45;
                        if (1 == this._chairId) {   //右对齐
                            node.x = - node.width/2*(cardGroups.length-1)*node.scale + node.width/2 * i * node.scale;
                        }
                    } else {
                        node.x = endPosX;
                        node.scale = cardScale;
                    }
                    node.y = endPosY;
                }

                if (0 === this._chairId && !cc.vv.gameData._isPlayBack) {
                    node.addComponent(cc.Button);
                    node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
                    node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
                    node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
                    node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
                }
            }
        }
    },

    // showCard(list,len,showBg=false){
    //     for(let i=0;i<list.length;++i){
    //         let node = this.node.getComponent("TongHua_Card").createCard(list[i],this._chairId==0?1:2);
    //         node.name = "card";
    //         if(this._chairId === 0) {
    //             node.y = (node.height-22)*i+node.height*0.5-25;
    //             node.addComponent(cc.Button);
    //             node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
    //             node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
    //             node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
    //             node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);

    //             if(showBg){
    //                 let child = new cc.Node();
    //                 child.addComponent(cc.Sprite);
    //                 this.node.getComponent("TongHua_Card").createCard(0,1,true,child);
    //                 child.parent = node;
    //                 child.name = "bg";
    //             }
    //         }
    //         else node.y = node.height*i+node.height*0.5;
    //         if(this._chairId === 0){
    //             node.x = this._handcardNode.parent.width*0.5-len*0.5*node.width+node.width*this._num;
    //         } else if(this._chairId === 3){
    //             node.x = -node.width*this._num;
    //         } else {
    //             node.x = node.width*this._num;
    //         }
            
    //         node.parent = this._handcardNode;
    //         node.zIndex = 4-i;
    //         node.cardBoxIndex = this._num*4+i;
    //         node.cardValue = list[i];
    //         if(this._num<this._cardBox.length && i<this._cardBox[this._num].length){
    //             this._cardBox[this._num][i] = node;
    //         }

    //         if (this._num < this.greyCardArrCount) {
    //             node.color = new cc.Color(150,150,150);
    //         }
    //         node.isCanMove = (this._num >= this.greyCardArrCount);
    //     }
    //     ++this._num;

    // },

    onTouchStart(event){
        if(this._canTouch){
            this.setCardSelectState(event.target.col);
        }
    },

    setCardSelectState(col){
        for (let i = 0; i < this._handcardNode.children.length; i++) {
            let card = this._handcardNode.children[i];
            card.isSelected = (card.col == col && !card.isSelected) ? true : false;
            if (card.isSelected) {
                card.color = new cc.Color(100,100,100);
            } else {
                if (card.isTongHua) {
                    card.color = new cc.Color(255,220,220);
                } else {
                    card.color = new cc.Color(255,255,255);
                }
            }
        }
    },

    onTouchMove(event){
        if(this._canTouch && event.target.isSelected){
            this.touchCurPos = event.getLocation();
            this.touchCurPos.x -= this._handcardNode.x;
            this.touchCurPos.y -= this._handcardNode.y;
            this.setCardMoveState();
        }
    },

    setCardMoveState(){
        let moveCardCount = 0;
        for (let i = this.handcardNodeSortList.length-1; i >= 0; i--) {
            let card = this.handcardNodeSortList[i];
            if (card.isSelected) {
                card.x = this.touchCurPos.x;
                card.y = this.touchCurPos.y + card.height/10 * card.scale * moveCardCount++;
                card.getChildByName("cardNumText").active = false;
                card.getChildByName("cardTypeText").active = false;
            }
        }
    },

    onTouchCancel(event){
        if(this._canTouch){
            this.onTouchEnd(event);
        }
    },

    onTouchEnd(event){
        // let bFilter = (!this.curaction || cc.vv.gameData.CARDTYPE.ERROR_CARDS == this.curaction.cardType);
        // if (bFilter) {
        //     for (let i = 0; i < this._handcardNode.children.length; i++) {
        //         if (this._handcardNode.children[i].isSelect) {
        //             bFilter = false;
        //             break;
        //         }
        //     }
        // }
        // for (let i = 0; i < this._handcardNode.children.length; i++) {
        //     let card = this._handcardNode.children[i];
        //     if (card.isTouchSelect) {
        //         card.isTouchSelect = false;
        //         card.color = new cc.Color(255,255,255); 

        //         card.isSelect = !card.isSelect;
        //         card.y = card.isSelect ? 50 : 0;
        //     }
        // }
        // if (bFilter) {
        //     let cards = this.getSelectedCards();
        //     if (5 < cards.length) {
        //         this.curaction = {};
        //         this.curaction.cardType = cc.vv.gameData.CARDTYPE.ERROR_CARDS;
        //         this.curaction.outCards = [];
        //         let typeCards = this.TongHua_CardLogicJS.checkCardIsCanOut(cards, this._handCards.length, this.curaction);
        //         if (0 == typeCards.length) {
        //             let filterCards = this.TongHua_CardLogicJS.filterConnect(cards);
        //             if (0 < filterCards.length) {
        //                 this.setFilterCardState(filterCards);
        //             }
        //         }
        //     }
        // }

        if (this._operateNode.active) {
            for (let i = this.handcardNodeSortList.length-1; i >= 0; i--) {
                let card = this.handcardNodeSortList[i];
                if (card.isSelected) {
                    if (100 < (card.y - card.posY)) {
                        this.onClickOutCard();  
                        return;
                    } else {
                        break;
                    }
                }
            }   
        }

        this.resetCardPos();
    },

    resetCardPos(){
        for (var i = 0; i < this.handcardNodeSortList.length; i++) {
            let card = this.handcardNodeSortList[i];
            if (card.isSelected) {
                let pos = cc.v2(card.posX, card.posY);
                card.runAction(cc.moveTo(0.1, pos));
                card.getChildByName("cardNumText").active = true;
                card.getChildByName("cardTypeText").active = true;
            } 
        }
    },

    onClickBgResetCardState(){
        for (var i = 0; i < this.handcardNodeSortList.length; i++) {
            let card = this.handcardNodeSortList[i];
            if (card.isSelected) {
                card.isSelected = false;
                if (card.isTongHua) {
                    card.color = new cc.Color(255,220,220);
                } else {
                    card.color = new cc.Color(255,255,255);
                }
            } 
        }
    },

    // setFilterCardState(cards){
    //     for (let i = 0; i < this._handcardNode.children.length; i++) {
    //         let j = 0;
    //         for (j = 0; j < cards.length; j++) {
    //             if (this._handcardNode.children[i].cardValue == cards[j]) {
    //                 break;
    //             }
    //         }
    //         this._handcardNode.children[i].isSelect = (j < cards.length);
    //         this._handcardNode.children[i].y = (j < cards.length) ? 50 : 0;
    //     }
    // },

    getSelectedCards(){
        let list = [];
        for (let i = 0; i < this._handcardNode.children.length; i++) {
            if (this._handcardNode.children[i].isSelected) {
                list.push(this._handcardNode.children[i].cardValue);
            }
        }
        return list;
    },

    // outCard(){
    //     let pos = this._selectCard.parent.convertToWorldSpaceAR(this._selectCard.position);
    //     Global.dispatchEvent(EventId.OUTCARD,{card:this._selectCard.cardValue,pos:pos});
    //     cc.vv.gameData.outCard(this._selectCard.cardValue);
    //     this._canOutCard = false;
    //     this.showOutLine(this._canOutCard);
    //     this._selectCard.removeFromParent();
    //     this.clearSelectInCardBox();
    //     this.resetCardPos(true);
    //     this._selectCard = null;
    // },

    // // 插入在前面中间
    // resetBoxInsertFront(index){
    //     this.clearSelectInCardBox();
    //     for(let i=this._cardBox.length-1;i>0;--i){
    //         if(i>index){
    //             for(let j=0;j<4;++j){
    //                 this._cardBox[i][j] = this._cardBox[i-1][j];
    //             }
    //         }
    //     }
    //     this._cardBox[index+1][0] = this._selectCard;
    //     this._cardBox[index+1][1] = null;
    //     this._cardBox[index+1][2] = null;
    //     this._cardBox[index+1][3] = null;
    // },


    // clearSelectInCardBox(){
    //     let cardIndex = this._selectCard.cardBoxIndex;
    //     let x = parseInt(cardIndex/4);
    //     let y = cardIndex%4;
    //     this._cardBox[x][y] = null;
    //     this.moveCard(x,y);
    // },

    // // 在顶部添加
    // resetBoxAppendTop(index){
    //     this.clearSelectInCardBox();
    //     for(let j=0;j<4;++j){
    //         if(this._cardBox[index][j] === null){
    //             this._cardBox[index][j] = this._selectCard;
    //             break;
    //         }
    //     }
    // },


    // // 检查排的移动
    // checkMoveCard(){
    //     let insertX = -2;
    //     let cardIndex = this._selectCard.cardBoxIndex;
    //     let x = parseInt(cardIndex/4);
    //     let y = cardIndex%4;

    //     let bFind = false;
    //     for(let i=0;i<this._cardBox.length;++i){
    //         let card = this._cardBox[i][0];
    //         if(card){
    //             if(this._selectCard.x>card.x-card.width*0.5 && this._selectCard.x<=card.x+card.width*0.5){
    //                 bFind = true;
    //                 if(card === this._selectCard){
    //                     continue;
    //                 }
    //                 if(this._cardBox[i][2]===null && this._cardBox[i][3]===null){
    //                     insertX  = i;
    //                     if(x==0 && y===0 && this._cardBox[x][1] === null) insertX = 0;

    //                     // 在前面单独一列，而且这一列只有这一个牌
    //                     if(this._cardBox[x][1] === null && x<i){
    //                         insertX = i-1;
    //                     }
    //                     this.resetBoxAppendTop(insertX);
    //                     break;
    //                 }
    //                 else{
    //                     insertX = -1;
    //                     break;
    //                 }
    //             }
    //         }
    //     }

    //     if(!bFind){
    //         let card = this._cardBox[0][0];
    //         // 插在最前面
    //         if(this._selectCard.x<card.x){
    //             if(this._num<10){
    //                 insertX  = -1;
    //                 this.resetBoxInsertFront(insertX);
    //             }
    //         }
    //         else{
    //             if(this._num<10){
    //                 // 插在最后
    //                 this.clearSelectInCardBox();
    //                 for(let i=0;i<this._cardBox.length;++i){
    //                     if(this._cardBox[i][0] === null ){
    //                         this._cardBox[i][0] = this._selectCard;
    //                         break;
    //                     }
    //                 }
    //             }

    //         }
    //     }
    //     this.resetCardPos(true);
    //     this._selectCard.color = new cc.Color(255,255,255);
    //     this._selectCard = null;
    // },

    // resetCardPos(showAction=false){
    //     let len = 0;
    //     for(let i=0;i<this._cardBox.length;++i){
    //         if(this._cardBox[i][0]) ++len;
    //     }
    //     this._num = len;
    //     for(let i=0;i<this._cardBox.length;++i){
    //         for(let j=0;j<4;++j){
    //             if(this._cardBox[i][j] === null && j<3){
    //                 this._cardBox[i][j] = this._cardBox[i][j+1];
    //             }
    //             if(this._cardBox[i][j] ){

    //                 let endPos = cc.v2(this._handcardNode.parent.width*0.5-len*0.5*this._cardBox[i][j].width+
    //                     i*this._cardBox[i][j].width,(this._cardBox[i][j].height-22)*j+this._cardBox[i][j].height*0.5-25);
    //                 if(showAction){
    //                     this._cardBox[i][j].runAction(cc.moveTo(0.1,endPos));
    //                 }
    //                 else{
    //                     this._cardBox[i][j].position = endPos;
    //                 }
    //                 this._cardBox[i][j].cardBoxIndex = i*4+j;
    //                 this._cardBox[i][j].zIndex = 4-j;
    //             }
    //         }
    //     }
    //     // if(showAction){
    //     //     this._canTouch = false;
    //     //     this.scheduleOnce(()=>{
    //     //         this._canTouch = true;
    //     //     },0.1)
    //     // }
    // },

    // recvChiCard(data){
    //     data = data.detail;
    //     if(this._chairId === 0){
    //         // 轮到我自己出牌
    //         if(data.actionInfo.nextaction.seat === this._seatIndex &&
    //             data.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.PUT){
    //             this._canOutCard = true;
    //             this.showOutLine(this._canOutCard);
    //         }

    //         // 我当前吃牌
    //         if(data.actionInfo.curaction.seat === this._seatIndex){
    //             // 删除手里面的牌
    //             let list = data.chiInfo.chiData.slice(0);
    //             let card = data.actionInfo.curaction.card;
    //             let index = list.indexOf(card);
    //             if(index>=0){
    //                 list.splice(index,1);
    //                 this.delHandCard(list[0]);
    //                 this.delHandCard(list[1]);
    //                 if(data.chiInfo.luoData){
    //                     for(let i=0;i<data.chiInfo.luoData.length;++i){
    //                         for (var j = 0; j < data.chiInfo.luoData[i].length; j++) {
    //                             this.delHandCard(data.chiInfo.luoData[i][j]);
    //                         }
    //                     }
    //                 }
    //                 this.resetCardPos();
    //             }

    //         }
    //     }

    // },

    // delHandCard(card){
    //     let x = -1;
    //     let y = -1;
    //     for(let i=0;i<this._handcardNode.childrenCount;++i){
    //         let node = this._handcardNode.children[i];
    //         if(node.cardValue === card){
    //             let cardIndex = node.cardBoxIndex;
    //             x = parseInt(cardIndex/4);
    //             y = cardIndex%4;
    //             this._cardBox[x][y] = null;
    //             node.removeFromParent(true);
    //             break;
    //         }
    //     }
    //     if(x>-1 && y>-1){
    //         this.moveCard(x,y);
    //     }
    // },

    // moveCard(x,y){
    //     if(y<3){ // 移走的不是最顶上的
    //         if(this._cardBox[x][y+1]){
    //             for(let i=y;i<3;++i){
    //                 this._cardBox[x][i] = this._cardBox[x][i+1];
    //                 if(this._cardBox[x][i]) this._cardBox[x][i].cardBoxIndex = x*4+i;
    //             }
    //             this._cardBox[x][3] = null;
    //         }
    //         else{
    //             if(y===0){
    //                 // 这是列只有这一张牌，所以后面的牌都要往前移
    //                 for(let i=x;i<this._cardBox.length-1;++i){
    //                     for(let j=0;j<4;++j){
    //                         this._cardBox[i][j] = this._cardBox[i+1][j];
    //                         if(this._cardBox[i][j]) this._cardBox[i][j].cardBoxIndex = i*4+j;
    //                     }
    //                 }
    //                 this._cardBox[this._cardBox.length-1][0] = null;
    //                 this._cardBox[this._cardBox.length-1][1] = null;
    //                 this._cardBox[this._cardBox.length-1][2] = null;
    //                 this._cardBox[this._cardBox.length-1][3] = null;
    //             }
    //         }
    //     }
    // },

    onRecvHandCard(data){
        data = data.detail;
        if(this._seatIndex === data.seat && data.handInCards){
            this.clearDesk();
            this.showHandCard(data.handInCards, true)

            if (this._seatIndex == data.actionInfo.nextaction.seat && 0 < data.actionInfo.nextaction.type) {
                // this.curaction = data.actionInfo.curaction;
                this.showOperateBtn(true, data.actionInfo.waitList);
            } else {
                this.showOperateBtn(false);
            }

        //     this._handCardData = data;
        //     this._handCards = data.handInCards.slice(0);
        //     let list = data.handInCards.slice(0);
        //     for(let j=0;j<data.menzi.length;++j){
        //         let typeData = data.menzi[j];
        //         let num =0;
        //         if(typeData.type === cc.vv.gameData.OPERATETYPE.KAN ) // 坎
        //         {
        //             num = 3;
        //         }
        //         else if(typeData.type === cc.vv.gameData.OPERATETYPE.LONG || typeData.type === cc.vv.gameData.OPERATETYPE.SHE){
        //             num = 4;
        //         }
        //         for(let i=0;i<num;++i){
        //             list.push(typeData.card);
        //         }
        //     }
        //     // 随机洗下牌
        //     for(let i=0;i<10;++i){
        //         let index = parseInt(cc.random0To1()*1000)%10;
        //         let temp = list[i];
        //         list[i] = list[index];
        //         list[index] = temp;
        //     }
        //     this.showCard(list,list.length,true);
        //     let maxCol = 10 < list.length ? 10 : list.length;
        //     let startX = this._handcardNode.parent.width*0.5-maxCol*0.5*this._handcardNode.children[0].width;
        //     let startY =  this._handcardNode.children[0].height*0.5-20;

        //     for(let i=0;i<this._handcardNode.childrenCount;++i){
        //         let child = this._handcardNode.children[i];
        //         child.position = child.parent.convertToNodeSpaceAR(this._cardBoXPos);

        //         let bg = child.getChildByName("bg");
        //         child.opacity = 0;
        //         let endPos = cc.v2(startX+(i%10)*child.width,startY+parseInt(i/10)*(child.height-22));
        //         let delaytimeAction = cc.delayTime(i*0.05);
        //         let callFunc1 = cc.callFunc(()=>{
        //             bg.opacity = 200;
        //             child.getComponent(cc.Sprite).enabled = false;
        //             Global.playEff(Global.SOUNDS.send_card);
        //         });
        //         let callFunc2 = cc.callFunc(()=>{
        //             child.getComponent(cc.Sprite).enabled = true;
        //             bg.active = false;
        //         });
        //         let scaleAction1 = cc.scaleTo(0.2, 0, 1);
        //         let scaleAction2 = cc.scaleTo(0.2, 1, 1);

        //         let spaw = cc.spawn(cc.moveTo(0.1,endPos),cc.fadeTo(0.1,255));
        //         let seq = cc.sequence(delaytimeAction,callFunc1,spaw,scaleAction1,callFunc2,scaleAction2);
        //         if(i === this._handcardNode.childrenCount-1){
        //             seq = cc.sequence(delaytimeAction,callFunc1,spaw,scaleAction1,callFunc2,scaleAction2,cc.callFunc(()=>{
        //                 this.sortCard();
        //             }));
        //         }
        //         child.runAction(seq);
        //     }
        }
    },

    // sortCard(){
    //     this.checkCanOutCard(this._handCardData.bankerInfo.seat);
    //     let canOutCard = this._canOutCard;
    //     Global.dispatchEvent(EventId.SHOW_MENZI,this._handCardData);
    //     this.clearDesk();
    //     let list = cc.vv.gameData.sortCard(this._handCards);
    //     this.greyCardArrCount = cc.vv.gameData.getGreyCardArrCount(this._handCards);
    //     for(let i=0;i<list.length;++i){
    //         this.showCard(list[i],list.length);
    //     }
    //     this._canOutCard = canOutCard;
    //     this.showOutLine(this._canOutCard);
    // },

    // initCardBox(){
    //     for(let i=0;i<10;++i){
    //         this._cardBox.push([]);
    //         for(let j=0;j<4;++j){
    //             if(j==0) this._cardBox[i].push([]);
    //             this._cardBox[i][j]=null;
    //         }
    //     }
    // },

    clearDesk(){
        if(this._handcardNode) {
            this._handcardNode.removeAllChildren(true);
        }

        // this._handCardData = null;
        // if(this._chairId === 0){
        //     for(let i=0;i<10;++i){
        //         for(let j=0;j<4;++j){
        //             this._cardBox[i][j] = null;
        //         }
        //     }
        // }
        // this._selectCard = null;
        // this._canOutCard = false;
        // this._num = 0;
    },

    recvRoundOver(data){
    },

    // recvDelHandcardNotify(data){
    //     data = data.detail;
    //     if(data.seat === this._seatIndex){
    //         this.delHandCard(data.card);
    //         this.resetCardPos();
    //     }
    // },

    // // 收到跑或者龙
    // recvPaoAndLongNotify(data){
    //     data = data.detail;
    //     if(this._chairId === 0){
    //         if(data.actionInfo.curaction.seat === this._seatIndex){
    //             if (data.ishand) {
    //                 for (var i = 0; i < 3; i++) {
    //                     this.delHandCard(data.actionInfo.curaction.card);
    //                 }
    //                 this.resetCardPos();
    //             }
    //         }
    //         if(data.actionInfo.nextaction.seat === this._seatIndex){
    //             this._canOutCard = true;
    //             this.showOutLine(this._canOutCard);
    //         }
    //     }
    // },

    // // 收到坎
    // recvKanAndKanNotify(data){
    //     data = data.detail;
    //     if(this._chairId === 0){
    //         if(data.actionInfo.curaction.seat === this._seatIndex){
    //             this.delHandCard(data.actionInfo.curaction.card);
    //             this.delHandCard(data.actionInfo.curaction.card);
    //             this.resetCardPos();
    //         }
    //         this._canOutCard = data.actionInfo.nextaction.seat === this._seatIndex;
    //         this.showOutLine(this._canOutCard);
    //     }
    // },

    showOutLine(bShow){
        // this._outCardLineNode.active = bShow;
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
