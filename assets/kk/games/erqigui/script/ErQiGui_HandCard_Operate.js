
cc.Class({
    extends: cc.Component,

    properties: {
        
        _handcardNode:null,
        _handCards:[],         // 手牌
        _num:0,
        _cardBox:[],
        _selectCard:null,
        _outCardY:0,
        _startPosX:null,
        _canOutCard:false,      // 可以出牌
        _cardBoXPos:null,
        _handCardData:null,
        _canTouch:true,
    },

    init(index){
        if (0 === index) {
            this._handcardNode = cc.find("scene/handleCardView",this.node);
            if (!cc.vv.gameData._isPlayBack) {
                this._handcardNode.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
                this._handcardNode.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
                this._handcardNode.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
                this._handcardNode.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
            }

            this._chairId = cc.vv.gameData.getLocalSeatByUISeat(0);
            this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);

            // 提示+出
            this._operateNode = cc.find("scene/play_action_view",this.node);
            this.showOperateBtn(false);

            this.panel_jiaoScore = this._operateNode.getChildByName("panel_jiaoScore");
            this.jiaoScoreList = [170,180,190,200,210];
            for (let i = 0; i < this.jiaoScoreList.length; i++) {
                let btn_score = this.panel_jiaoScore.getChildByName("btn_score" + this.jiaoScoreList[i]);
                btn_score.score = this.jiaoScoreList[i];
                Global.btnClickEvent(btn_score,this.onClickJiaoScore,this);
            }
            let btn_cancel = this.panel_jiaoScore.getChildByName("btn_cancel");
            Global.btnClickEvent(btn_cancel,this.onClickJiaoScoreCancel,this);
            let btn_sure = this.panel_jiaoScore.getChildByName("btn_sure");
            Global.btnClickEvent(btn_sure,this.onClickJiaoScoreSure,this);

            this.panel_selectColor = this._operateNode.getChildByName("panel_selectColor");
            for (let i = 0; i < 4; i++) {
                let btn_color = this.panel_selectColor.getChildByName("btn_color" + i);
                btn_color.cardColor = i;
                Global.btnClickEvent(btn_color,this.onClickColor,this);
            }
            this.panel_selectColor45 = this._operateNode.getChildByName("panel_selectColor45");
            for (let i = 0; i < 6; i++) {
                let btn_color = this.panel_selectColor45.getChildByName("btn_color" + i);
                btn_color.cardColor = i;
                Global.btnClickEvent(btn_color,this.onClickColor,this);
            }

            this.panel_maidi = this._operateNode.getChildByName("panel_maidi");
            this.text_curSelectNum = this.panel_maidi.getChildByName("text_curSelectNum");
            this.btn_surrender = this.panel_maidi.getChildByName("btn_surrender");
            Global.btnClickEvent(this.btn_surrender,this.onClickSurrender,this);
            this.btn_maidi = this.panel_maidi.getChildByName("btn_maidi");
            Global.btnClickEvent(this.btn_maidi,this.onClickMaiDi,this);

            // 提示
            // this.btn_tipCard = this._operateNode.getChildByName("btn_tipCard");
            // Global.btnClickEvent(this.btn_tipCard,this.onClickTipCard,this);
            // 出
            this.btn_outCard = this._operateNode.getChildByName("btn_outCard");
            Global.btnClickEvent(this.btn_outCard,this.onClickOutCard,this);

            this.ErQiGui_CardLogicJS = this.node.getComponent("ErQiGui_CardLogic");
            this.ErQiGui_CardLogicJS.init();
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
        Global.registerEvent(EventId.PLAYER_ENTER,this.recvPlayerEnter,this);
        Global.registerEvent(EventId.PLAYER_EXIT,this.recvPlayerExit,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.OUT_CARD_NOTIFY,this.onRcvOutCardNotify,this);
        Global.registerEvent(EventId.UPDATE_PLAYER_INFO,this.recvDeskInfoMsg,this);

        Global.registerEvent(EventId.ERQIGUI_JIAO_SCORE_NOTIFY,this.onRcvJiaoScoreNotify,this);
        Global.registerEvent(EventId.ERQIGUI_SELECT_COLOR_NOTIFY,this.onRcvSelectColorNotify,this);
        Global.registerEvent(EventId.ERQIGUI_MAI_CARD,this.onRcvMaiCard,this);
        Global.registerEvent(EventId.ERQIGUI_MAI_CARD_NOTIFY,this.onRcvMaiCardNotify,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);

        this.recvDeskInfoMsg();
    },

    recvDeskInfoMsg(){
        let data = cc.vv.gameData.getDeskInfo();
        if((data.isReconnect || cc.vv.gameData._isPlayBack) && this._handcardNode) {
            for(let i=0;i<data.users.length;++i){
                if(this._seatIndex === data.users[i].seat && data.users[i].handInCards){
                    this.showHandCard(data.users[i].handInCards);

                    if (data.actionInfo.nextaction.seat === this._seatIndex && 0 < data.actionInfo.nextaction.type) {
                        this.curaction = data.actionInfo.curaction;
                        this.showOperateBtn(true, data.actionInfo);
                    } else {
                        this.showOperateBtn(false);
                    }
                }
            }
        }
    },

    recvRoundOver(){
        this.showOperateBtn(false);
    },

    onRcvJiaoScoreNotify(data){
        data = data.detail;
        if (data.actionInfo.nextaction.seat === this._seatIndex && 0 < data.actionInfo.nextaction.type) {
            this.curaction = data.actionInfo.curaction;
            this.showOperateBtn(true, data.actionInfo);
        } else {
            this.showOperateBtn(false);
        }
    },

    onRcvSelectColorNotify(data){
        data = data.detail;
        if (data.actionInfo.nextaction.seat === this._seatIndex && 3 == data.actionInfo.nextaction.type) {
            this.curaction = data.actionInfo.curaction;
            this.showOperateBtn(true, data.actionInfo);
            for (let i = 0; i < data.diPai.length; i++) {
                this._handCards.push(data.diPai[i]);
            }
            this.showHandCard(this._handCards);
        }
    },

    onRcvMaiCard(data){
        if (0 == this._chairId) {
            data = data.detail;
            for (let i = 0; i < data.cards.length; i++) {
                for (let j = 0; i < this._handCards.length; j++) {
                    if (data.cards[i] == this._handCards[j]) {
                        this._handCards.splice(j, 1);
                        break;
                    }
                }
            }
            this.showHandCard(this._handCards);
        }
    },

    onRcvMaiCardNotify(data){
        data = data.detail;
        if (data.actionInfo.nextaction.seat === this._seatIndex && 4 == data.actionInfo.nextaction.type) {
            this.curaction = data.actionInfo.curaction;
            this.showOperateBtn(true, data.actionInfo);
        }
    },

    onClickJiaoScore(event){
        this.curSelectScore = event.target.score;
        for (let i = 0; i < this.jiaoScoreList.length; i++) {
            let btn_score = this.panel_jiaoScore.getChildByName("btn_score" + this.jiaoScoreList[i]);
            btn_score.getChildByName("mask").active = (this.curSelectScore == this.jiaoScoreList[i]);
        }
    },

    onClickJiaoScoreCancel(){
        let req = {c: MsgId.ERQIGUI_JIAO_SCORE};
        req.jiaoFen = -1;
        cc.vv.NetManager.send(req);
    },

    onClickJiaoScoreSure(){
        if (0 < this.curSelectScore) {
            let req = {c: MsgId.ERQIGUI_JIAO_SCORE};
            req.jiaoFen = this.curSelectScore;
            cc.vv.NetManager.send(req);
        }
    },

    onClickColor(event){
        let req = {c: MsgId.ERQIGUI_SELECT_COLOR};
        req.jiaoZhu = event.target.cardColor;
        cc.vv.NetManager.send(req);
    },

    onClickSurrender(){
        let req = {c: MsgId.ERQIGUI_SURRENDER};
        cc.vv.NetManager.send(req);
    },

    onClickMaiDi(event){
        let cards = this.getSelectedCards();
        if (8 == cards.length) {
            let req = {c: MsgId.ERQIGUI_MAI_CARD};
            req.cards = cards;
            cc.vv.NetManager.send(req);
        } else {
            cc.vv.FloatTip.show("必须埋牌8张");
        }
    },

    onRcvOutCardNotify(data){
        data = data.detail;
        if (data.actionInfo.curaction.seat === this._seatIndex) {
            let outCards = data.actionInfo.curaction.outCards;
            this.initCardHintState();
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
        if (data.actionInfo.nextaction.seat === this._seatIndex && 4 == data.actionInfo.nextaction.type) {
            this.curaction = data.actionInfo.curaction;
            this.showOperateBtn(true, data.actionInfo);
        } else {
            this.showOperateBtn(false);
        }
    },

    onClickTipCard(){
        if (0 < this.hintList.length) {
            this.initCardSelectState();
            ++this.hintIndex;
            this.hintIndex = this.hintIndex % this.hintList.length;
            this.popHintCards(this.hintList[this.hintIndex]);
        } else {
            cc.vv.FloatTip.show("本轮首出，无法提示");
        }
    },

    popHintCards(hintCards){
        for (let i = 0; i < hintCards.length; i++) {
            let finIndex = 0;
            for (let finIndex = 0; finIndex < this._handCards.length; finIndex++) {
                if (hintCards[i] == this._handCards[finIndex]) {
                    this._handcardNode.children[finIndex].isSelect = true;
                    this._handcardNode.children[finIndex].y = 50;
                    break;
                }
            }
        }
        
    },

    onClickOutCard(){
        let cards = this.getSelectedCards();
        if (0 < cards.length) {
            // let typeCards = this.ErQiGui_CardLogicJS.checkCardIsCanOut(cards, this._handCards.length, this.curaction);
            // if (0 < cards.length) {
                let req = {c: MsgId.OUT_CARD};
                req.cards = cards;
                cc.vv.NetManager.send(req);
                return;
            // }
        }
        cc.vv.FloatTip.show("无效出牌");
    },

    showOperateBtn(bShow, actionInfo){
        if (cc.vv.gameData._isPlayBack || 0 != this._chairId) {
            return;
        }
        this._operateNode.active = bShow;
        if (bShow) {
            this.panel_jiaoScore.active = false;
            this.panel_selectColor.active = false;
            this.panel_selectColor45.active = false;
            this.panel_maidi.active = false;
            this.btn_outCard.active = false;
 
            let type = actionInfo.nextaction.type;
            if (1 == type) {
                this.curSelectScore = 0;
                for (let i = 0; i < this.jiaoScoreList.length; i++) {
                    let btn_score = this.panel_jiaoScore.getChildByName("btn_score" + this.jiaoScoreList[i]);
                    btn_score.getComponent(cc.Button).interactable = (actionInfo.curaction.jiaoFen.maxJiaoFen < this.jiaoScoreList[i]);
                    btn_score.getChildByName("mask").active = false;
                }
                this.panel_jiaoScore.active = true;

            } else if (2 == type) {
                if (cc.vv.gameData.getRoomConf().param2) {
                    this.panel_selectColor45.active = true;
                } else {
                    this.panel_selectColor.active = true;
                }

            } else if (3 == type) {
                this.initCardSelectState();
                this.updateCardSelectNum();
                this.btn_surrender.active = (210 > actionInfo.curaction.jiaoFen.maxJiaoFen);
                if (this.btn_surrender.active) {
                    this.btn_maidi.x = 170;
                } else {
                    this.btn_maidi.x = 0;
                }
                this.panel_maidi.active = true;

            } else if (4 == type) {
                this.btn_outCard.active = true;


                // let cardIsCanOutList = this.getCardIsCanOutList(nextaction.hint);
                // if (this.getIsInitCardSelectState(cardIsCanOutList)) {
                //     this.initCardSelectState();
                // }
                // this.setCardHintState(cardIsCanOutList);
                // this.hintList = nextaction.hint;
                // this.hintIndex = -1;
            }
        } else {
            this.curaction = null;
        }
    },

    updateCardSelectNum(){
        let cards = this.getSelectedCards();
        this.text_curSelectNum.getComponent(cc.Label).string = cards.length;
    },

    getCardIsCanOutList(hint){
        let cardIsCanOutList = [];
        if (0 == hint.length) {
            for (let i = 0; i < 0x10; i++) {
                cardIsCanOutList[i] = true;
            }
            return cardIsCanOutList;
        }
        for (let i = 0; i < hint.length; i++) {
            if (3 == hint[i].length || 
                4 == hint[i].length || 
                (6 == hint[i].length && (hint[i][0] % 0x10 - 1) == hint[i][5] % 0x10)) {
                for (let i = 0; i < 0x10; i++) {
                    cardIsCanOutList[i] = true;
                }
                return cardIsCanOutList;
            }
            for (let j = 0; j < hint[i].length; j++) {
                cardIsCanOutList[hint[i][j] % 0x10] = true;
            }
        }
        return cardIsCanOutList;
    },

    getIsInitCardSelectState(cardIsCanOutList){
        for (let i = 0; i < this._handCards.length; i++) {
            if (this._handcardNode.children[i].isSelect && !cardIsCanOutList[this._handCards[i] % 0x10]) {
                return true;
            }
        }
        return false;
    },

    initCardSelectState(){
        for (let i = 0; i < this._handcardNode.children.length; i++) {
            if (this._handcardNode.children[i].isSelect) {
                this._handcardNode.children[i].isSelect = false;
                this._handcardNode.children[i].y =  0;
            }
        }
    },

    initCardHintState(){
        for (let i = 0; i < this._handcardNode.children.length; i++) {
            if (this._handcardNode.children[i].isNoCanOut) {
                this._handcardNode.children[i].isNoCanOut = false;
                this._handcardNode.children[i].color = new cc.Color(255,255,255);
            }
        }
    },

    setCardHintState(cardIsCanOutList){
        for (let i = 0; i < this._handCards.length; i++) {
            if (!cardIsCanOutList[this._handCards[i] % 0x10]) {
                this._handcardNode.children[i].isNoCanOut = true;
                this._handcardNode.children[i].color = new cc.Color(100,100,100);
            }
        }
    },

    // 检查是否可以出牌
    checkCanOutCard(seat){
        if(this._chairId === 0){
            if(this._seatIndex === seat){
                this._canOutCard = true;
            } else {
                this._canOutCard = false;
            }
        }
    },

    showHandCard(list, bShowMoveAni = false){
        this._handCards = cc.vv.gameData.sortCard(list);
        this._handcardNode.removeAllChildren();
        let self = this;
        let cardScale = cc.vv.gameData.CardScale;
        let cardOffsetX = cc.vv.gameData.CardWidth/2 * cardScale;
        let cardStartPosX = -(cardOffsetX * (this._handCards.length-1))/2;
        let allCardWidth = cardOffsetX * (this._handCards.length + 1);
        if (this._handcardNode.width < allCardWidth) {
            cardOffsetX = this._handcardNode.width / (this._handCards.length + 1);
            cardStartPosX = -(cardOffsetX * (this._handCards.length-1))/2;
        }
        if (cc.vv.gameData._isPlayBack && 0 < this._chairId) {
            cardScale /= 2;
            cardOffsetX /= 2;
            cardStartPosX /= 2;
        }
        for(let i = 0; i < this._handCards.length; ++i){
            let node = this.node.getComponent("ErQiGui_Card").createCard(this._handCards[i]);
            node.parent = this._handcardNode;
            node.cardOffsetX = cardOffsetX;
            let endPosX = cardStartPosX + cardOffsetX * i;
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
                            cc.scaleTo(0.2, 1 * cardScale), 
                            cc.moveTo(0.2, cc.v2(endPosX, 0))
                        ),
                        cc.scaleTo(0.02, 1.1 * cardScale), 
                        cc.scaleTo(0.02, 1 * cardScale), 
                        cc.callFunc(()=>{
                            if ((list.length-1) == i) {
                               self._canTouch = true;
                            }
                        }), 
                    )
                )
            } else {
                node.scale = cardScale;
                if (cc.vv.gameData._isPlayBack && 0 < this._chairId) {
                    if (1 == this._chairId) {   //右对齐
                        node.x = - cardOffsetX * (this._handCards.length-1) + cardOffsetX * i;
                    } else if (2 == this._chairId){ //中对齐
                        node.x = cardStartPosX + cardOffsetX * i;
                    } else if (3 == this._chairId){ //左对齐
                        node.x = 0 + cardOffsetX * i;
                    }
                } else {
                    node.x = endPosX;
                }
            }
        }
    },

    onTouchStart(event){
        if(this._canTouch){
            this.touchStartPosX = event.getLocationX();
            this.touchCurPosX = event.getLocationX();
            this.changeCardSelectState();
        }
    },

    onTouchMove(event){
        if(this._canTouch){
            this.touchCurPosX = event.getLocationX();
            this.changeCardSelectState();
        }
    },

    changeCardSelectState(){
        let touchLeftPosX = this.touchStartPosX < this.touchCurPosX ? this.touchStartPosX : this.touchCurPosX;
        touchLeftPosX -= this._handcardNode.x;
        let touchRightPosX = this.touchStartPosX < this.touchCurPosX ? this.touchCurPosX : this.touchStartPosX;
        touchRightPosX -= this._handcardNode.x;
        for (let i = 0; i < this._handcardNode.children.length; i++) {
            let card = this._handcardNode.children[i];
            if (!card.isNoCanOut) {
                let cardLeftPosX = card.x - card.width/2 * cc.vv.gameData.CardScale;
                let cardRightPosX = cardLeftPosX + card.cardOffsetX;
                if (i == this._handcardNode.children.length - 1) {  //最后一张
                    cardRightPosX = card.x + card.width/2 * cc.vv.gameData.CardScale;
                }
                if((touchLeftPosX < cardLeftPosX && touchRightPosX > cardLeftPosX) ||
                   (touchLeftPosX < cardRightPosX && touchRightPosX > cardRightPosX) ||
                   (cardLeftPosX < touchLeftPosX && cardRightPosX > touchLeftPosX)){
                    card.isTouchSelect = true;
                    card.color = new cc.Color(100,100,100);
                } else {
                    card.isTouchSelect = false;
                    card.color = new cc.Color(255,255,255); 
                }
            }
        }
    },

    onTouchCancel(event){
        if(this._canTouch){
            this.onTouchEnd(event);
        }
    },

    onTouchEnd(event){
        this.touchStartPosX = null;
        this.touchCurPosX = null;
        for (let i = 0; i < this._handcardNode.children.length; i++) {
            let card = this._handcardNode.children[i];
            if (card.isTouchSelect) {
                card.isTouchSelect = false;
                card.color = new cc.Color(255,255,255); 

                card.isSelect = !card.isSelect;
                card.y = card.isSelect ? 50 : 0;
            }
        }
        if (this.panel_maidi.active) {
            this.updateCardSelectNum();
        }
    },

    getSelectedCards(){
        let list = [];
        for (let i = 0; i < this._handcardNode.children.length; i++) {
            if (this._handcardNode.children[i].isSelect) {
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

            if (this._seatIndex == data.actionInfo.nextaction.seat && 1 == data.actionInfo.nextaction.type) {
                this.curaction = data.actionInfo.curaction;
                this.showOperateBtn(true, data.actionInfo);
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
