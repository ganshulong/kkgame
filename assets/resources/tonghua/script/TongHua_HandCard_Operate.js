
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
        }

        this.TongHua_CardLogicJS = this.node.getComponent("TongHua_CardLogic");

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
        Global.registerEvent(EventId.PLAYER_ENTER,this.recvPlayerEnter,this);
        Global.registerEvent(EventId.PLAYER_EXIT,this.recvPlayerExit,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
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
                        this.showOperateBtn(true, data.actionInfo.waitList);
                    } else {
                        this.showOperateBtn(false);
                    }
                }
            }
        }
    },

    onRcvOutCardFaild(){
        if (0 === this._chairId) {
            this.onClickBgResetCardState();
        }
    },

    onRcvOutCardNotify(data){
        data = data.detail;
        if (data.actionInfo.curaction.seat === this._seatIndex) {
            let outCards = data.actionInfo.curaction.outCards;
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
            this.showOperateBtn(true, data.actionInfo.waitList);
        } else {
            this.showOperateBtn(false);
        }
    },

    onRcvGuoCardNotify(data){
        data = data.detail;
        if (data.actionInfo.nextaction.seat === this._seatIndex && 0 < data.actionInfo.nextaction.type) {
            this.showOperateBtn(true, data.actionInfo.waitList);
        } else {
            this.showOperateBtn(false);
        }
    },

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
        let cardOffsetY = 18;
        let cardScale = 0.9;
        let cardOffsetX = cc.vv.gameData.CardWidth * cardScale / 2;
        let cardStartPosX = -(cardOffsetX * (cardGroups.length-1))/2;
        let allCardWidth = cardOffsetX * (cardGroups.length + 1);
        if (this._handcardNode.width < allCardWidth) {
            cardOffsetX = this._handcardNode.width / (cardGroups.length + 1);
            cardStartPosX = -(cardOffsetX * (cardGroups.length-1))/2;
        }
        if (cc.vv.gameData._isPlayBack && 0 < this._chairId) {
            cardOffsetY = 9;
            cardScale = 0.45;
            cardOffsetX = cc.vv.gameData.CardWidth * cardScale / 2;
            cardStartPosX = -(cardOffsetX * (cardGroups.length-1))/2 + 380;
        }
        for (let i = 0; i < cardGroups.length; i++) {
            for (let j = 0; j < cardGroups[i].length; j++) {
                let node = this.node.getComponent("TongHua_Card").createCard(cardGroups[i][j]);
                node.parent = this._handcardNode;
                this.handcardNodeSortList.push(node);
                node.col = i;
                node.zIndex = this.handcardNodeSortList.length;
                let endPosX = cardStartPosX + cardOffsetX * i;
                let endPosY = node.height*cardScale/2 + cardOffsetY * (cardGroups[i].length-1-j);
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
                    node.x = endPosX;
                    node.y = endPosY;
                    node.scale = cardScale;
                }

                if ((cardGroups[i].length-1) == j && 0 === this._chairId && !cc.vv.gameData._isPlayBack) {
                    node.addComponent(cc.Button);
                    node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
                    node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
                    node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
                    node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
                }
            }
        }
    },

    onTouchStart(event){
        if(this._canTouch){
            this.setCardSelectState(event.target.col);
            this.moveCards = [];
            for (let i = this.handcardNodeSortList.length-1; i >= 0; i--) {
                if (this.handcardNodeSortList[i].isSelected) {
                    this.moveCards.push(this.handcardNodeSortList[i]);
                }
            }
        }
    },

    setCardSelectState(col){
        let cardNum = cc.vv.gameData.getRoomConf().param1;
        for (let i = 0; i < this._handcardNode.children.length; i++) {
            let card = this._handcardNode.children[i];
            if (card.col == col) {
                card.isSelected = !card.isSelected;
            } else {
                if (card.isSelected && 15 <= cardNum) {    //15,16副，只能单出一列
                    card.isSelected = false;
                } else {
                    continue;
                }
            }
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
        let cardOffsetY = 20;
        for (let i = 0; i < this.moveCards.length; i++) {
            this.moveCards[i].x = this.touchCurPos.x;
            this.moveCards[i].y = this.touchCurPos.y + cardOffsetY * i;
        }
    },

    onTouchCancel(event){
        if(this._canTouch){
            this.onTouchEnd(event);
        }
    },

    onTouchEnd(event){
        if (this.handcardNodeSortList) {
            for (let i = this.handcardNodeSortList.length-1; i >= 0; i--) {
                let card = this.handcardNodeSortList[i];
                if (card.isSelected) {
                    if (100 < (card.y - card.posY)) {
                        if (this._operateNode.active) {
                            this.onClickOutCard();
                        } else {
                            this.onClickBgResetCardState();
                        }  
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
            } 
        }
    },

    onClickBgResetCardState(){
        if (this.handcardNodeSortList) {
            for (var i = 0; i < this.handcardNodeSortList.length; i++) {
                let card = this.handcardNodeSortList[i];
                if (card.isSelected) {
                    card.isSelected = false;
                    if (card.isTongHua) {
                        card.color = new cc.Color(255,220,220);
                    } else {
                        card.color = new cc.Color(255,255,255);
                    }
                    let pos = cc.v2(card.posX, card.posY);
                    card.runAction(cc.moveTo(0.1, pos));
                } 
            }
        }
    },

    getSelectedCards(){
        let list = [];
        for (let i = 0; i < this._handcardNode.children.length; i++) {
            if (this._handcardNode.children[i].isSelected) {
                list.push(this._handcardNode.children[i].cardValue);
            }
        }
        return list;
    },

    onRecvHandCard(data){
        data = data.detail;
        if(this._seatIndex === data.seat && data.handInCards){
            this.clearDesk();
            this.showHandCard(data.handInCards, true)

            if (this._seatIndex == data.actionInfo.nextaction.seat && 0 < data.actionInfo.nextaction.type) {
                this.showOperateBtn(true, data.actionInfo.waitList);
            } else {
                this.showOperateBtn(false);
            }
        }
    },

    clearDesk(){
        if(this._handcardNode) {
            this._handcardNode.removeAllChildren(true);
        }
    },

    recvRoundOver(data){
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
