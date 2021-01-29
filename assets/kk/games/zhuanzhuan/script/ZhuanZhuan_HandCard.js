
cc.Class({
    extends: cc.Component,

    properties: {
        _num:0,
        _cardBox:[],
        _selectCard:null,
        _outCardY:0,
        _startPosX:null,
        _canOutCard:false,      // 可以出牌
        _cardBoXPos:null,
        _gangCards:[],         // 杠牌
        _pengCards:[],         // 碰牌
        _handCards:[],         // 手牌
        _handcardNode:null,
        _canTouch:true,
        _outCardLineNode:null,
        _bPlaying:true,
    },

    init(index,playerNum){
        this._handcardNode = cc.find("scene/hand_cards/hand_card"+index,this.node);
        this._playerNum = playerNum;
        this._chairId = cc.vv.gameData.getLocalSeatByUISeat(index);

        let box = cc.find("scene/cardBox",this.node);
        this._cardBoXPos = box.parent.convertToWorldSpaceAR(box.position);
        this._cardBoXPos.x -= 8;
        this._cardBoXPos.y += 24;

        this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);
        let deskInfo = cc.vv.gameData.getDeskInfo();
        if(-1 < this._seatIndex){
            for(let i=0; i<deskInfo.users.length; ++i){
                if(this._seatIndex === deskInfo.users[i].seat){
                    this._gangCards = deskInfo.users[i].gangpai;
                    this._pengCards = deskInfo.users[i].pengpai;
                    this._handCards = deskInfo.users[i].handInCards;
                    if (this._handCards && 0 < this._handCards.length) {
                        if (deskInfo.actionInfo.nextaction.seat === this._seatIndex && 
                            deskInfo.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.MOPAI) {
                            this.lastIsCurMoCard = true;
                        }
                        this.showAllCard();
                    }
                }
            }
        }

        if( 0 === this._chairId){
            this._outCardLineNode = cc.find("scene/sp_out_tips_line",this.node);
            this.spr_outCardTipsLine = cc.find("scene/spr_outCardTipsLine",this.node);
            this.outCardDirTips = this.spr_outCardTipsLine.getChildByName("outCardDirTips");

            let worldPos = this._outCardLineNode.parent.convertToWorldSpaceAR(this._outCardLineNode.position);
            this._outCardY = this._handcardNode.convertToNodeSpaceAR(worldPos).y;

            this._canOutCard = false;
            if(deskInfo.isReconnect){
                if(deskInfo.actionInfo.nextaction.seat === cc.vv.gameData.getMySeatIndex() &&
                   deskInfo.actionInfo.nextaction.type > 1){
                    this._canOutCard = true;
                }
            }
            this.showOutLine();
        }
    },

    start () {
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.HANDCARD,this.recvHandCard,this);
        Global.registerEvent(EventId.PLAYER_ENTER,this.recvPlayerEnter,this);
        Global.registerEvent(EventId.PLAYER_EXIT,this.recvPlayerExit,this);
        // Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOverNotify,this);
        Global.registerEvent(EventId.OUTCARD_NOTIFY,this.recvOutCardNotify,this);
        Global.registerEvent(EventId.MOPAI_NOTIFY,this.recvMoPaiNotify,this);
        Global.registerEvent(EventId.PENG_NOTIFY,this.recvPengNotify,this);
        Global.registerEvent(EventId.GANG_NOTIFY,this.recvGangNotify,this);
        Global.registerEvent(EventId.GUO_NOTIFY,this.recvGuoNotify,this);
        Global.registerEvent(EventId.UPDATE_PLAYER_INFO,this.recvDeskInfoMsg,this);

        // this.recvDeskInfoMsg();
    },

    recvDeskInfoMsg(){
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
        let deskInfo = cc.vv.gameData.getDeskInfo();
        if(-1 < this._seatIndex){
            for(let i=0; i<deskInfo.users.length; ++i){
                if(this._seatIndex === deskInfo.users[i].seat){
                    this._gangCards = deskInfo.users[i].gangpai;
                    this._pengCards = deskInfo.users[i].pengpai;
                    this._handCards = deskInfo.users[i].handInCards;
                    if (this._handCards && 0 < this._handCards.length) {
                        if (deskInfo.actionInfo.nextaction.seat === this._seatIndex && 
                            deskInfo.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.MOPAI) {
                            this.lastIsCurMoCard = true;
                        }
                        this.showAllCard();
                    }
                }
            }
        }

        if( 0 === this._chairId){
            this._canOutCard = false;
            if(deskInfo.isReconnect){
                if(deskInfo.actionInfo.nextaction.seat === cc.vv.gameData.getMySeatIndex() &&
                   deskInfo.actionInfo.nextaction.type > 1){
                    this._canOutCard = true;
                }
            }
            this.showOutLine();
        }
    },

    recvRoundOverNotify(data){
        data = data.detail;
        this._bPlaying = false;
        if(this._chairId === 0){
            this._canOutCard = false;
            this.showOutLine();
        } else {
            for(let i=0; i<data.users.length; ++i){
                if(this._seatIndex === data.users[i].seat){
                    this._gangCards = data.users[i].gangpai;
                    this._pengCards = data.users[i].pengpai;
                    this._handCards = data.users[i].handInCards;
                    this.showAllCard();
                }
            }
        }
    },

    recvOutCardNotify(data){
        data = data.detail;
        if (data.seat === this._seatIndex) {
            this.removeCardFromHand(data.actionInfo.curaction.card, 1);
            this._handCards = cc.vv.gameData.sortCard(this._handCards);
            this.showAllCard();

            if (0 === this._chairId) {
                this._canOutCard = false;
                this.showOutLine();
            }
        }
    },

    recvPengNotify(data){
        data = data.detail;
        if (data.seat === this._seatIndex) {
            this._pengCards.push(data.actionInfo.curaction.card);
            this.removeCardFromHand(data.actionInfo.curaction.card, 2);
            this.showAllCard();

            if (0 === this._chairId) {
                this._canOutCard = false;
                if (data.actionInfo.nextaction.seat === this._seatIndex && 
                    data.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.PUT) {
                    this._canOutCard = true;
                }
                this.showOutLine();
            }
        }
    },

    recvGangNotify(data){
        data = data.detail;
        if (data.seat === this._seatIndex) {
            for (let i = 0; i < this._pengCards.length; i++) {
                if (this._pengCards[i] == data.actionInfo.curaction.card) {
                    this._pengCards.splice(i,1);
                }
            }
            this._gangCards.push(data.actionInfo.curaction.card);
            let gangCardNum = this.getSelfGangCardNum(data.actionInfo.curaction.card);
            this.removeCardFromHand(data.actionInfo.curaction.card, gangCardNum);
            this.showAllCard();
        }
    },

    getSelfGangCardNum(card){
        let gangCardCount = 0;
        for(let i = this._handCards.length-1 ; i >= 0; --i){
            if (card === this._handCards[i]) {
                ++gangCardCount;
            }
        }
        return gangCardCount;
    },

    // 过
    recvGuoNotify(data){
        data = data.detail;
        if (data.seat === this._seatIndex && 0 === this._chairId) {
            this._canOutCard = false;
            if (data.actionInfo.nextaction.seat === this._seatIndex && 
                data.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.PUT) {
                this._canOutCard = true;
            }
            this.showOutLine();
        }
    },

    removeCardFromHand(card, removeCardNum){
        if (0 === this._chairId || cc.vv.gameData._isPlayBack) {
            let removeCount = 0;
            for(let i = this._handCards.length-1 ; i >= 0; --i){
                if (card === this._handCards[i]) {
                    this._handCards.splice(i,1);
                    if (removeCardNum <= ++removeCount) {
                        break;
                    }
                }
            }
        } else {
            this._handCards.splice(0,removeCardNum);
        }
    },

    recvMoPaiNotify(data){
        data = data.detail;
        if (data.seat === this._seatIndex) {
            this._handCards.push(data.actionInfo.curaction.card);
            this.lastIsCurMoCard = true;
            this.showAllCard();

            if (0 == this._chairId) {
                this._canOutCard = false;
                if (data.actionInfo.nextaction.seat === this._seatIndex && 
                    data.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.PUT) {
                    this._canOutCard = true;
                }
                this.showOutLine();
            }
        }
    },

    recvHandCard(data){
        data = data.detail;
        if (this._seatIndex === data.seat) {
            this.clearDesk();
            this._gangCards = [];
            this._pengCards = [];
            this._handCards = data.handInCards;
            this.showAllCard();
            
            if (0 == this._chairId && this._seatIndex == data.actionInfo.nextaction.seat && 1 < data.actionInfo.nextaction.type) {
                let self = this;
                this.node.runAction(
                    cc.sequence(
                        cc.delayTime(self._canOutCard ? 1 : 0), 
                        cc.callFunc(()=>{
                            self._canOutCard = true;
                            self.showOutLine();
                        })
                    )
                )
            }
        }
    },

    showAllCard(){
        let uiSeat = cc.vv.gameData.getUISeatBylocalSeat(this._chairId);
        this._handcardNode.removeAllChildren();
        let curPosX = 0;

        let cardWidth = (1 === uiSeat || 3 === uiSeat) ? 31 : 43;
        let cardHeight = (1 === uiSeat || 3 === uiSeat) ? 46 : 65;
        let dir = (1 === uiSeat || 2 === uiSeat) ? -1 : 1;
        //杠牌
        for(let i = 0; i < this._gangCards.length; ++i){
            curPosX += 25 * dir;
            for (let j = 0; j < 4; j++) {
                let node = this.node.getComponent("ZhuanZhuan_Card").createCard(this._gangCards[i]);
                node.parent = this._handcardNode;
                node.width = (cardWidth+2);
                node.height = cardHeight;
                if (3 > j) {
                    node.x = curPosX;
                    curPosX += cardWidth * dir;
                } else if (3 == j){
                    node.x = curPosX - cardWidth * dir * 2;
                    node.y = node.height/4;
                }
            }
        }
        //碰牌
        for(let i = 0; i < this._pengCards.length; ++i){
            curPosX += 25 * dir;;
            for (let j = 0; j < 3; j++) {
                let node = this.node.getComponent("ZhuanZhuan_Card").createCard(this._pengCards[i]);
                node.parent = this._handcardNode;
                node.width = (cardWidth+2);
                node.height = cardHeight;
                node.x = curPosX;
                curPosX += cardWidth * dir;
            }
        }
        if (0 < this._gangCards.length || 0 < this._pengCards.length) {
            curPosX -= cardWidth/2 * dir;
        }

        //手牌
        if (0 === this._chairId) {
            cardWidth = 66;
            cardHeight = 100;
        }
        if (0 < this._gangCards.length || 0 < this._pengCards.length) {
            curPosX += (25 + cardWidth/2) * dir;
        }
        for(let i = 0; i < this._handCards.length; ++i){
            let node = this.node.getComponent("ZhuanZhuan_Card").createCard(this._handCards[i], 0 === this._chairId);
            node.parent = this._handcardNode;
            node.width = (cardWidth+2);
            node.height = cardHeight;
            if (this.lastIsCurMoCard && this._handCards.length-1 === i) {       //当前摸牌
                curPosX += cardWidth * dir * 0.3;
                this.lastIsCurMoCard = false;
            }
            node.x = curPosX;
            curPosX += cardWidth * dir;
            if (0 === this._chairId && 35 != this._handCards[i]) {
                node.addComponent(cc.Button);
                node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
                node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
                node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
                node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
            }
        }
    },

    onTouchStart(event){
        if(this._canOutCard){
            this._selectCard = event.target;
            this._selectCardPos = this._selectCard.position;
        }
    },

    onTouchMove(event){
        if(this._canOutCard){
            let pos = event.getDelta();
            if(this._selectCard){
                this._selectCard.x += pos.x;
                this._selectCard.y += pos.y;
            }
        }
    },

    onTouchEnd(event){
        if(this._canOutCard && this._selectCard){
            if(this._selectCard.y > this._outCardY || this._selectCard.isSelected){
                this._selectCard.isSelected = false;
                // 出牌
                this.outCard();
            } else {
                this._selectCard.position = this._selectCardPos;
                this.initSelectState();
                this._selectCard.isSelected = true;
                this._selectCard.color = new cc.Color(150,150,150);
            }
        }
    },

    onTouchCancel(event){
        if(this._canTouch){
            this.onTouchEnd(event);
        }
    },

    initSelectState(){
        for(let i = 0 ; i < this._handcardNode.children.length; ++i){
            this._handcardNode.children[i].isSelected = false;
            this._handcardNode.children[i].color = new cc.Color(255,255,255);
        }
    },

    outCard(){
        let pos = this._selectCard.parent.convertToWorldSpaceAR(this._selectCard.position);
        Global.dispatchEvent(EventId.OUTCARD,{card:this._selectCard.cardValue,pos:pos});
        cc.vv.gameData.outCard(this._selectCard.cardValue);
    },

    clearDesk(){
        if(this._handcardNode) {
            this._handcardNode.removeAllChildren(true);
        }
        this._selectCard = null;
        this._num = 0;
    },

    showOutLine(){
        this._outCardLineNode.active = this._canOutCard;
        this.showOutCardTipsAni();
    },

    showOutCardTipsAni(){
        this.spr_outCardTipsLine.active = this._outCardLineNode.active;
        this.outCardDirTips.stopAllActions();
        if (this.spr_outCardTipsLine.active) {
            this.outCardDirTips.position = cc.v2(0, -115);
            this.outCardDirTips.runAction(
                    cc.repeatForever(
                        cc.sequence(
                            cc.moveTo(0.25,cc.v2(7.5, -63)),
                            cc.moveTo(0.25,cc.v2(40, -30)),
                            cc.moveTo(0.25,cc.v2(88, -15)),
                            cc.moveTo(0.5,cc.v2(0, -115)),
                        )
                    )
                )
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
});
