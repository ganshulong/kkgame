
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

            this.panel_jiaoScore_btns = this._operateNode.getChildByName("panel_jiaoScore_btns");
            this.jiaoScoreList = [170,180,190,200,210];
            for (let i = 0; i < this.jiaoScoreList.length; i++) {
                let btn_score = this.panel_jiaoScore_btns.getChildByName("btn_score" + this.jiaoScoreList[i]);
                btn_score.score = this.jiaoScoreList[i];
                Global.btnClickEvent(btn_score,this.onClickJiaoScore,this);
            }
            let btn_cancel = this.panel_jiaoScore_btns.getChildByName("btn_cancel");
            Global.btnClickEvent(btn_cancel,this.onClickJiaoScoreCancel,this);
            let btn_sure = this.panel_jiaoScore_btns.getChildByName("btn_sure");
            Global.btnClickEvent(btn_sure,this.onClickJiaoScoreSure,this);

            this.panel_selectColor_btns = this._operateNode.getChildByName("panel_selectColor_btns");
            for (let i = 0; i < 4; i++) {
                let btn_color = this.panel_selectColor_btns.getChildByName("btn_color" + i);
                btn_color.cardColor = i;
                Global.btnClickEvent(btn_color,this.onClickColor,this);
            }
            this.panel_selectColor45_btns = this._operateNode.getChildByName("panel_selectColor45_btns");
            for (let i = 0; i < 6; i++) {
                let btn_color = this.panel_selectColor45_btns.getChildByName("btn_color" + i);
                btn_color.cardColor = i;
                Global.btnClickEvent(btn_color,this.onClickColor,this);
            }

            this.panel_maidi_btns = this._operateNode.getChildByName("panel_maidi_btns");
            this.text_curSelectNum = this.panel_maidi_btns.getChildByName("text_curSelectNum");
            this.btn_surrender = this.panel_maidi_btns.getChildByName("btn_surrender");
            Global.btnClickEvent(this.btn_surrender,this.onClickSurrender,this);
            this.btn_maidi = this.panel_maidi_btns.getChildByName("btn_maidi");
            Global.btnClickEvent(this.btn_maidi,this.onClickMaiDi,this);

            // 出
            this.btn_outCard = this._operateNode.getChildByName("btn_outCard");
            Global.btnClickEvent(this.btn_outCard,this.onClickOutCard,this);

            this.panel_checkDiCard = cc.find("scene/panel_checkDiCard",this.node);
            this.panel_checkDiCard.active = false;
            let panel_checkDiCard_mask = this.panel_checkDiCard.getChildByName("mask");
            Global.btnClickEvent(panel_checkDiCard_mask, this.onClickCheckDiCard,this);

            this.panel_checkCard = cc.find("scene/panel_checkCard",this.node);
            this.panel_checkCard.active = false;
            let panel_checkCard_mask = this.panel_checkCard.getChildByName("mask");
            Global.btnClickEvent(panel_checkCard_mask, this.onClickCheckCard,this);

            this.panel_checkScore = cc.find("scene/panel_checkScore",this.node);
            this.panel_checkScore.active = false;
            let panel_checkScore_mask = this.panel_checkScore.getChildByName("mask");
            Global.btnClickEvent(panel_checkScore_mask, this.onClickCheckScore,this);

            this.btn_diCard = cc.find("scene/operate_btn_view/btn_diCard",this.node);
            Global.btnClickEvent(this.btn_diCard,this.onClickCheckDiCard,this);
            this.btn_diCard.active = false;
            this.btn_checkCard = cc.find("scene/operate_btn_view/btn_checkCard",this.node);
            Global.btnClickEvent(this.btn_checkCard,this.onClickCheckCard,this);
            this.btn_checkCard.active = false;
            this.btn_checkScore = cc.find("scene/operate_btn_view/btn_checkScore",this.node);
            Global.btnClickEvent(this.btn_checkScore,this.onClickCheckScore,this);
            this.btn_checkScore.active = false;

            this.bg_right_top = cc.find("scene/bg_right_top",this.node);
            this.setTableJiaoZhu(-1);
            this.setTableJiaoScore(-1);
            this.setTableYuScore(0);
            this.setTableZhuaScore(0);
            this.setCurTableScore(0);
            this.showBankerOperateTips(0);

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
        if (this._handcardNode) {
            cc.vv.NetManager.registerMsg(MsgId.ERQIGUI_CHECK_SCORE, this.onRcvCheckScore, this);
            cc.vv.NetManager.registerMsg(MsgId.ERQIGUI_CHECK_CARD, this.onRcvCheckCard, this);
            cc.vv.NetManager.registerMsg(MsgId.ERQIGUI_CHECK_DI_CARD, this.onRcvCheckDiCard, this);
        }
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.PLAYER_ENTER,this.recvPlayerEnter,this);
        Global.registerEvent(EventId.PLAYER_EXIT,this.recvPlayerExit,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.OUT_CARD_NOTIFY,this.onRcvOutCardNotify,this);
        Global.registerEvent(EventId.UPDATE_PLAYER_INFO,this.recvDeskInfoMsg,this);

        Global.registerEvent(EventId.ERQIGUI_JIAO_SCORE_NOTIFY,this.onRcvJiaoScoreNotify,this);
        Global.registerEvent(EventId.ERQIGUI_SELECT_COLOR_NOTIFY,this.onRcvSelectColorNotify,this);
        Global.registerEvent(EventId.ERQIGUI_MAI_CARD_NOTIFY,this.onRcvMaiCardNotify,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);

        this.recvDeskInfoMsg();
    },

    recvDeskInfoMsg(){
        let data = cc.vv.gameData.getDeskInfo();
        if((data.isReconnect || cc.vv.gameData._isPlayBack) && this._handcardNode) {
            for(let i=0;i<data.users.length;++i){
                if(this._seatIndex === data.users[i].seat){
                    if (data.users[i].handInCards) {
                        this.showHandCard(data.users[i].handInCards);

                        if (data.actionInfo.nextaction.seat === this._seatIndex && 0 < data.actionInfo.nextaction.type) {
                            this.curaction = data.actionInfo.curaction;
                            this.showOperateBtn(true, data.actionInfo);
                        } else {
                            this.showOperateBtn(false);
                        }
                        if (0 === this._chairId && data.actionInfo.nextaction.seat != this._seatIndex) {
                            this.showBankerOperateTips(data.actionInfo.nextaction.type);
                        }

                        this.btn_checkCard.active = (4 == data.actionInfo.nextaction.type);
                        this.btn_checkScore.active = (4 == data.actionInfo.nextaction.type);
                        this.btn_diCard.active = (4 == data.actionInfo.nextaction.type && this._seatIndex == data.actionInfo.curaction.jiaoFen.maxJiaoSeat);

                        if (2 <= data.actionInfo.nextaction.type) {
                            this.setTableJiaoZhu(data.jiaoZhu);
                            this.setTableJiaoScore(data.actionInfo.curaction.jiaoFen.maxJiaoFen);
                        }
                        this.setTableZhuaScore(data.actionInfo.curaction.zhuafen);
                        this.setTableYuScore(data.actionInfo.curaction.yufen);
                        this.setCurTableScore(data.actionInfo.curaction.tablefen);
                    }
                }
            }
        }
    },

    recvRoundOver(){
        if (0 === this._chairId) { 
            this.btn_diCard.active = false;
            this.btn_checkCard.active = false;
            this.btn_checkScore.active = false;
            this.showOperateBtn(false);
        }
    },

    onRcvJiaoScoreNotify(data){
        data = data.detail;
        if (data.actionInfo.nextaction.seat === this._seatIndex && 0 < data.actionInfo.nextaction.type) {
            this.curaction = data.actionInfo.curaction;
            this.showOperateBtn(true, data.actionInfo);
        } else {
            this.showOperateBtn(false);
        }
        if (0 === this._chairId && data.actionInfo.nextaction.seat != this._seatIndex && 2 == data.actionInfo.nextaction.type) {
            this.showBankerOperateTips(2);
        }
        if (0 == this._chairId && 2 == data.actionInfo.nextaction.type) {
            this.setTableJiaoScore(data.actionInfo.curaction.jiaoFen.maxJiaoFen);
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
        }
        if (0 === this._chairId && data.actionInfo.nextaction.seat != this._seatIndex) {
            this.showBankerOperateTips(data.actionInfo.nextaction.type);
        }
        if (0 == this._chairId) {
            this.setTableJiaoZhu(data.jiaoZhu);
            this.showHandCard(this._handCards);
        }
    },

    onRcvMaiCardNotify(data){
        data = data.detail;
        if (data.actionInfo.nextaction.seat === this._seatIndex && 4 == data.actionInfo.nextaction.type) {
            this.curaction = data.actionInfo.curaction;
            this.showOperateBtn(true, data.actionInfo);

            for (let i = 0; i < data.diPai.length; i++) {
                for (let j = 0; i < this._handCards.length; j++) {
                    if (data.diPai[i] == this._handCards[j]) {
                        this._handCards.splice(j, 1);
                        break;
                    }
                }
            }
            this.showHandCard(this._handCards);
            
            this.btn_diCard.active = true;
        }
        if (0 == this._chairId) {
            this.btn_checkCard.active = true;
            this.btn_checkScore.active = true;
        }
        if (0 === this._chairId && data.actionInfo.nextaction.seat != this._seatIndex) {
            this.showBankerOperateTips(data.actionInfo.nextaction.type);
        }
    },

    onClickJiaoScore(event){
        this.curSelectScore = event.target.score;
        for (let i = 0; i < this.jiaoScoreList.length; i++) {
            let btn_score = this.panel_jiaoScore_btns.getChildByName("btn_score" + this.jiaoScoreList[i]);
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

    onClickCheckDiCard(){
        if (this.panel_checkDiCard.active) {
            this.panel_checkDiCard.active = false;
        } else {
            let req = {c: MsgId.ERQIGUI_CHECK_DI_CARD};
            cc.vv.NetManager.send(req);
        }
    },

    onClickCheckCard(){
        if (this.panel_checkCard.active) {
            this.panel_checkCard.active = false;
        } else {
            let req = {c: MsgId.ERQIGUI_CHECK_CARD};
            cc.vv.NetManager.send(req);
        }
    },

    onClickCheckScore(){
        if (this.panel_checkScore.active) {
            this.panel_checkScore.active = false;
        } else {
            let req = {c: MsgId.ERQIGUI_CHECK_SCORE};
            cc.vv.NetManager.send(req);
        }
    },

    onRcvCheckDiCard(msg){
        if (200 == msg.code) {
            let diPai = cc.vv.gameData.sortCard(msg.diPai)
            let node_dicards = this.panel_checkDiCard.getChildByName("node_dicards");
            node_dicards.removeAllChildren();
            let cardScale = cc.vv.gameData.CardScale;
            let cardOffsetX = cc.vv.gameData.CardWidth/2 * cardScale * 1.5;
            let cardStartPosX = -(cardOffsetX * (diPai.length-1))/2;
            for(let i = 0; i < diPai.length; ++i){
                let node = this.node.getComponent("ErQiGui_Card").createCard(diPai[i]);
                node.parent = node_dicards;
                node.scale = cardScale;
                node.x = cardStartPosX + cardOffsetX * i;
            }
            this.panel_checkDiCard.active = true;
        }
    },

    onRcvCheckCard(msg){
        if (200 == msg.code) {
            let cardScale = 0.25;
            let cardOffsetX = cc.vv.gameData.CardWidth/2 * cardScale;
            for (let i = 0; i < msg.chaPai.length; i++) {
                let playername = cc.vv.gameData.getUserInfo(msg.chaPai[i].seat).playername;
                cc.find("bg_player" + i + "/txt_name", this.panel_checkCard).getComponent(cc.Label).string = playername;

                let outCards = this.panel_checkCard.getChildByName("outCards"+i);
                outCards.removeAllChildren();
                let cardOffsetIndexX = 0;
                for (let j = 0; j < msg.chaPai[i].outCards.length; j++) {
                    for (let k = 0; k < msg.chaPai[i].outCards[j].length; k++) {
                        let cardValue = msg.chaPai[i].outCards[j][k];
                        let node = this.node.getComponent("ErQiGui_Card").createCard(cardValue);
                        if ((5 == (cardValue%0x10)) ||
                            (10 == (cardValue%0x10)) ||
                            (13 == (cardValue%0x10))) {
                            node.color = new cc.Color(255, 200, 200);
                        }
                        node.parent = outCards;
                        node.scale = cardScale;
                        node.x = cardOffsetX * cardOffsetIndexX++;
                    }
                    cardOffsetIndexX += 2;
                }
            }
            this.panel_checkCard.active = true;
        }
    },

    onRcvCheckScore(msg){
        if (200 == msg.code) {
            let cards = msg.chaFen.cards;
            let node_scoreCards = this.panel_checkScore.getChildByName("node_scoreCards");
            node_scoreCards.removeAllChildren();
            let cardScale = 0.65;
            let cardOffsetX = cc.vv.gameData.CardWidth/2 * cardScale;
            let cardStartPosX = -(cardOffsetX * (cards.length-1))/2;
            let allCardWidth = cardOffsetX * (cards.length + 1);
            if (node_scoreCards.width < allCardWidth) {
                cardOffsetX = node_scoreCards.width / (cards.length + 1);
                cardStartPosX = -(cardOffsetX * (cards.length-1))/2;
            }
            for(let i = 0; i < cards.length; ++i){
                let node = this.node.getComponent("ErQiGui_Card").createCard(cards[i]);
                node.parent = node_scoreCards;
                node.scale = cardScale;
                node.x = cardStartPosX + cardOffsetX * i;
            }
            this.panel_checkScore.active = true;
        }
    },

    setTableJiaoZhu(showType = -1){
        for (let i = 0; i <= 5; i++) {
            this.bg_right_top.getChildByName("spr_cardType"+i).active = (showType == i);
        }
    },

    setTableJiaoScore(score = -1){
        this.bg_right_top.getChildByName("text_jiaoScore").getComponent(cc.Label).string = (0 < score && score < 210) ? score : "";
        this.bg_right_top.getChildByName("spr_jiaoZhao").active = (210 == score);
    },

    setTableZhuaScore(score = -1){
        if (0 <= score) {
            this.bg_right_top.getChildByName("text_zhuaScore").getComponent(cc.Label).string = score;
        } else {
            this.bg_right_top.getChildByName("text_zhuaScore").getComponent(cc.Label).string = "";
        }
    },

    setTableYuScore(score = -1){
        if (0 <= score) {
            this.bg_right_top.getChildByName("text_yuScore").getComponent(cc.Label).string = score;
        } else {
            this.bg_right_top.getChildByName("text_yuScore").getComponent(cc.Label).string = "";
        }
    },

    setCurTableScore(score){
        cc.find("scene/curTableScore",this.node).getComponent(cc.Label).string = (0 < score) ? score : "";;
    },

    showBankerOperateTips(curOperateType = 0){
        cc.find("scene/curOperateType2",this.node).active = (2 == curOperateType);        
        cc.find("scene/curOperateType3",this.node).active = (3 == curOperateType);
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
        this.showOperateBtn(false);
        if (data.actionInfo.nextaction.seat === this._seatIndex && 4 == data.actionInfo.nextaction.type) {
            this.curaction = data.actionInfo.curaction;
            if (data.isOverRound) {
                let self = this;
                this.node.runAction(
                    cc.sequence(
                        cc.delayTime(1), 
                        cc.callFunc(()=>{
                            self.showOperateBtn(true, data.actionInfo);
                        }), 
                    )
                )
            } else {
                this.showOperateBtn(true, data.actionInfo);
            }
        }

        if (0 == this._chairId) {
            this.setTableYuScore(data.actionInfo.curaction.yufen);
            this.setCurTableScore(data.actionInfo.curaction.tablefen);
            if (data.isOverRound) {
                this.setTableZhuaScore(data.actionInfo.curaction.zhuafen);
            }
        }
    },

    onClickOutCard(){
        let cards = this.getSelectedCards();
        if (0 < cards.length) {
            let req = {c: MsgId.OUT_CARD};
            req.cards = cards;
            cc.vv.NetManager.send(req);
            return;
        }
        cc.vv.FloatTip.show("无效出牌");
    },

    showOperateBtn(bShow, actionInfo){
        if (cc.vv.gameData._isPlayBack || 0 != this._chairId) {
            return;
        }
        this._operateNode.active = bShow;
        if (bShow) {
            this.panel_jiaoScore_btns.active = false;
            this.panel_selectColor_btns.active = false;
            this.panel_selectColor45_btns.active = false;
            this.panel_maidi_btns.active = false;
            this.btn_outCard.active = false;
 
            let type = actionInfo.nextaction.type;
            if (1 == type) {
                this.curSelectScore = 0;
                for (let i = 0; i < this.jiaoScoreList.length; i++) {
                    let btn_score = this.panel_jiaoScore_btns.getChildByName("btn_score" + this.jiaoScoreList[i]);
                    btn_score.getComponent(cc.Button).interactable = (actionInfo.curaction.jiaoFen.maxJiaoFen < this.jiaoScoreList[i]);
                    btn_score.getChildByName("mask").active = false;
                }
                if (actionInfo.curaction.jiaoFen.curJiaoSeat) {
                    this.panel_jiaoScore_btns.active = true;
                } else {
                    let self = this;
                    this.node.runAction(
                        cc.sequence(
                            cc.delayTime(1), 
                            cc.callFunc(()=>{
                                self.panel_jiaoScore_btns.active = true;
                            }), 
                        )
                    )
                }

            } else if (2 == type) {
                let showPanel = null;
                if (cc.vv.gameData.getRoomConf().param2) {
                    this.panel_selectColor45_btns.active = true;
                    showPanel = this.panel_selectColor45_btns;

                    let btn_color5 = showPanel.getChildByName("btn_color5");
                    btn_color5.getChildByName("text_cardNum").getComponent(cc.Label).string = cc.vv.gameData.getCardColor5Num(this._handCards, i);
                    btn_color5.getChildByName("text_doubleNum").getComponent(cc.Label).string = cc.vv.gameData.getCardColor5DoubleNum(this._handCards, i) + "个对";

                } else {
                    this.panel_selectColor_btns.active = true;
                    showPanel = this.panel_selectColor_btns;
                }
                for (let i = 0; i < 4; i++) {
                    let btn_color = showPanel.getChildByName("btn_color" + i);
                    btn_color.getChildByName("text_cardNum").getComponent(cc.Label).string = cc.vv.gameData.getCardColorNum(this._handCards, i);
                    btn_color.getChildByName("text_doubleNum").getComponent(cc.Label).string = cc.vv.gameData.getCardColorDoubleNum(this._handCards, i) + "个对";
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
                this.panel_maidi_btns.active = true;

            } else if (4 == type) {
                if (0 < this._handcardNode.children.length) {
                    this.btn_outCard.active = true;
                    if (0 < actionInfo.curOutCardInfo.curRoundOutCards.length &&
                        cc.vv.gameData.getRoomConf().seat > actionInfo.curOutCardInfo.curRoundOutCards.length) {
                        let firstOutCards = actionInfo.curOutCardInfo.curRoundOutCards[0].cards;
                        this.checkCardCanOutState(firstOutCards);
                    }
                }
            }
        } else {
            this.curaction = null;
        }
    },

    initCardSelectState(){
        for (let i = 0; i < this._handcardNode.children.length; i++) {
            if (this._handcardNode.children[i].isSelect) {
                this._handcardNode.children[i].isSelect = false;
                this._handcardNode.children[i].y =  0;
            }
        }
    },

    updateCardSelectNum(){
        let cards = this.getSelectedCards();
        this.text_curSelectNum.getComponent(cc.Label).string = cards.length;
        this.btn_maidi.getComponent(cc.Button).interactable = (8 == cards.length);
    },


    checkCardCanOutState(firstOutCards){
        let cardColor = parseInt(firstOutCards[0]/0x10);
        let cardColorNum = cc.vv.gameData.getCardColorNum(this._handCards, cardColor);
        let isZhu = false;
        if (cc.vv.gameData.getIsZhuCard(firstOutCards[0])) {
            cardColorNum = cc.vv.gameData.getCardZhuNum(this._handCards);
            isZhu = true;
        }
        if (cardColorNum >= firstOutCards.length) {
            if (4 <= firstOutCards.length) {    //拖拉机
                if (isZhu) {
                    let cardZhuCompanyCards = cc.vv.gameData.getCardZhuCompanyCards(this._handCards, cardColor);
                    if (cardZhuCompanyCards.length*2 >= firstOutCards.length) {
                        this.setCardCanOutState(cardZhuCompanyCards);
                    } else {
                        this.setZhuCardCanOut();
                    }
                } else {
                    let cardColorCompanyCards = cc.vv.gameData.getCardColorCompanyCards(this._handCards, cardColor);
                    if (cardColorCompanyCards.length*2 >= firstOutCards.length) {
                        this.setCardCanOutState(cardColorCompanyCards);
                    } else {
                        this.setCardCanOutState([], cardColor);
                    }
                }

            } else if (2 == firstOutCards.length) {    //对子
                if (isZhu) {
                    let cardZhuDoubleCards = cc.vv.gameData.getCardZhuDoubleCards(this._handCards);
                    if (0 < cardZhuDoubleCards.length) {
                        this.setCardCanOutState(cardZhuDoubleCards);
                    } else {
                        this.setZhuCardCanOut();
                    }
                } else {
                    let cardColorDoubleCards = cc.vv.gameData.getCardColorDoubleCards(this._handCards, cardColor);
                    if (0 < cardColorDoubleCards.length) {
                        this.setCardCanOutState(cardColorDoubleCards);
                    } else {
                        this.setCardCanOutState([], cardColor);
                    }
                }
            } else {
                if (isZhu) {
                    this.setZhuCardCanOut();
                } else {
                    this.setCardCanOutState([], cardColor);
                }
            }
        }
    },

    setCardCanOutState(cardList = [], cardColor){
        if (0 < cardList.length) {
            for (let i = 0; i < this._handcardNode.children.length; i++) {
                let findIndex = -1;
                for (findIndex = 0; findIndex < cardList.length; findIndex++) {
                    if (this._handcardNode.children[i].cardValue == cardList[findIndex]) {
                        break;
                    }
                }
                if (cardList.length == findIndex) {
                    this.setCardCanOut(this._handcardNode.children[i]);
                }
            }
        } else {
            for (let i = 0; i < this._handcardNode.children.length; i++) {
                if ((cc.vv.gameData.getIsZhuCard(this._handcardNode.children[i].cardValue)) ||
                    (parseInt(this._handcardNode.children[i].cardValue/0x10) != cardColor)) {
                    this.setCardCanOut(this._handcardNode.children[i]);
                }
            }
        }
    },

    setZhuCardCanOut(){
        for (let i = 0; i < this._handcardNode.children.length; i++) {
            if (!cc.vv.gameData.getIsZhuCard(this._handcardNode.children[i].cardValue)) {
                this.setCardCanOut(this._handcardNode.children[i]);
            }
        }
    },

    setCardCanOut(node){
        node.isNoCanOut = true;
        node.color = cc.vv.gameData.CardNoCanOutColor;
        node.isSelect = false;
        node.y =  0;
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
        let diPai = cc.vv.gameData._deskInfo.buckPai.slice(0);
        for(let i = 0; i < this._handCards.length; ++i){
            let node = this.node.getComponent("ErQiGui_Card").createCard(this._handCards[i]);
            if (24 == this._handCards.length) {
                for (let j = 0; j < diPai.length; j++) {
                    if (diPai[j] == this._handCards[i]) {
                        diPai.splice(j, 1);
                        node.isDiPai = true;
                        node.color = cc.vv.gameData.CardNoCanOutColor;
                        break;
                    }
                }
            }
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
                            cc.vv.AudioManager.playEff("erqigui/", "fapai",true);
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
                    card.color = cc.vv.gameData.CardNoCanOutColor;
                } else {
                    card.isTouchSelect = false;
                    if (card.isDiPai) {
                        card.color = cc.vv.gameData.CardNoCanOutColor;
                    } else {
                        card.color = new cc.Color(255,255,255); 
                    }
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
                if (card.isDiPai) {
                    card.color = cc.vv.gameData.CardNoCanOutColor;
                } else {
                    card.color = new cc.Color(255,255,255); 
                }

                card.isSelect = !card.isSelect;
                card.y = card.isSelect ? 50 : 0;
            }
        }
        if (this.panel_maidi_btns.active) {
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

            this.setTableZhuaScore(data.actionInfo.curaction.zhuafen);
            this.setTableYuScore(data.actionInfo.curaction.yufen);
        }
    },

    clearDesk(){
        if(this._handcardNode) {
            this._handcardNode.removeAllChildren(true);
            this.setTableJiaoZhu(-1);
            this.setTableJiaoScore(-1);
            this.setTableYuScore(0);
            this.setTableZhuaScore(0);
            this.setCurTableScore(0);
            this.showBankerOperateTips(0);
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
    },

    onDestroy(){
        if (this._handcardNode) {
            cc.vv.NetManager.unregisterMsg(MsgId.ERQIGUI_CHECK_SCORE, this.onRcvCheckScore,false,this);
            cc.vv.NetManager.unregisterMsg(MsgId.ERQIGUI_CHECK_CARD, this.onRcvCheckCard,false,this);
            cc.vv.NetManager.unregisterMsg(MsgId.ERQIGUI_CHECK_DI_CARD, this.onRcvCheckDiCard,false,this);
        }
    }

    // update (dt) {},
});
