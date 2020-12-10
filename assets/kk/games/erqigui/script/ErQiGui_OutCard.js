
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
        // this.mask_onOut = cc.find("scene/out_cards/mask_onOut"+index,this.node);
        // this.mask_onOut.active = false;

        if(this._outCardNode){
            this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);
        }

        this.card_ani = cc.find("scene/out_cards/card_ani" + index, this.node);
        for (var i = 0; i < this.card_ani.children.length; i++) {
            this.card_ani.children[i].getChildByName("skeleton").active = false;
        }
        this.card_ani.active = true;

        this.ani_clock = cc.find("scene/out_cards/ani_clock" + index, this.node);
        this.setShowTimeCount(false);
    },

    clearDesk(){
        this._outCardValue = null;
        this._cardsNum = 0;
        if(this._outCardNode) {
            this._outCardNode.removeAllChildren();
        }
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
        if(this._outCardNode){
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
            this.showOutCard(outCards, isMaxOutCard);
            this.setShowTimeCount(false);

            if (1 == data.audioType || 2 == data.audioType || 6 == data.audioType) {
                this.playCardAni(data.audioType);
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
                    cc.delayTime(1), 
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
        let skeletonNode = cc.find("" + cardType + "/skeleton", this.card_ani);
        skeletonNode.active = true;
        let skeletonCom = skeletonNode.getComponent(sp.Skeleton);
        skeletonCom.clearTrack(0);
        let showTime = 0.6;
        if (1 == cardType) {
            skeletonCom.setAnimation(0, "bile", false);
        } else if (2 == cardType) {
            skeletonCom.setAnimation(0, "gaibi", false);
        } else if (6 == cardType) {
            if (1 == this._UISeat) {
                skeletonCom.setAnimation(0, "shuaipaib", false);
            } else {
                skeletonCom.setAnimation(0, "shuaipai", false);
            }
            showTime = 1;
        }
        skeletonNode.runAction(
            cc.sequence(
                cc.delayTime(showTime), 
                cc.callFunc(()=>{
                    skeletonNode.active = false;
                }), 
            )
        )
    },

    showOutCard(list, isMaxOutCard = false){
        this._outCardNode.removeAllChildren();
        if (list && 0 < list.length) {
            let cardScale = 0.5;
            let cardOffsetX = cc.vv.gameData.CardWidth/2 * cardScale;
            let startPosX = 0;
            if(0 == this._UISeat){         // 下 居中
                startPosX = - (cardOffsetX * (list.length-1))/2;
            } else if(1 == this._UISeat){  //右 右对齐
                startPosX = - cardOffsetX * (list.length-1);
            } else if(2 == this._UISeat || 3 == this._UISeat){  //左 左对齐
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

    recvRoundOver(data){
        data = data.detail;
        for(let i=0;i<data.users.length;++i){
            if(data.users[i].seat === this._seatIndex){    
                this.setShowTimeCount(false);
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
