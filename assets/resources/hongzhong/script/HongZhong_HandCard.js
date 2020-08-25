
cc.Class({
    extends: cc.Component,

    properties: {
        _handcardNode:null,
        _num:0,
        _cardBox:[],
        _selectCard:null,
        _outCardY:0,
        _startPosX:null,
        _canOutCard:false,      // 可以出牌
        _cardBoXPos:null,
        _handCards:[],         // 手牌
        _handCardData:null,
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
        this.initCardBox();

        this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);
        let deskInfo = cc.vv.gameData.getDeskInfo();
        if(-1 < this._seatIndex){
            for(let i=0; i<deskInfo.users.length; ++i){
                if(this._seatIndex === deskInfo.users[i].seat){
                    this._handCards = cc.vv.gameData.sortCard(deskInfo.users[i].handInCards);
                    this.showAllCard();
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
                if(cc.vv.gameData.getMySeatIndex() === deskInfo.actionInfo.nextaction.seat &&
                    deskInfo.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.PUT){
                    this._canOutCard = true;
                }
            }
            this.showOutLine();
        }
    },

    start () {
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.CHI_NOTIFY,this.recvChiCard,this);
        Global.registerEvent(EventId.PLAYER_ENTER,this.recvPlayerEnter,this);
        Global.registerEvent(EventId.PLAYER_EXIT,this.recvPlayerExit,this);
        Global.registerEvent(EventId.KAN_NOTIFY,this.recvKanAndKanNotify,this);
        Global.registerEvent(EventId.PENG_NOTIFY,this.recvKanAndKanNotify,this);
        Global.registerEvent(EventId.PAO_NOTIFY,this.recvPaoAndLongNotify,this);
        Global.registerEvent(EventId.LONG_NOTIFY,this.recvPaoAndLongNotify,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.DEL_HANDCARD_NOTIFY,this.recvDelHandcardNotify,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvOverRound,this);
        Global.registerEvent(EventId.OUTCARD_NOTIFY,this.recvOutCardNotify,this);

        // this.recvDeskInfoMsg();
    },

    recvOutCardNotify(data){
        data = data.detail;
        if (data.seat === this._seatIndex) {
            for(let i = 0 ; i < this._handcardNode.children.length; ++i){
                if (data.card === this._handcardNode.children[i].cardValue && this._handcardNode.children[i].isSelected) {
                    this._handCards.splice(i,1);
                    this.showAllCard();
                    break;
                }
            }
        }
        if (0 == this._chairId) {
            this._canOutCard = false;
            if (data.actionInfo.nextaction.seat === this._seatIndex && 0 < data.actionInfo.nextaction.type) {
                this._canOutCard = true;
            }
            this.showOutLine();
        }
    },

    onRecvHandCard(data){
        data = data.detail;
        if (this._seatIndex === data.seat) {
            this.clearDesk();
            this._handCards = cc.vv.gameData.sortCard(data.handInCards);
            this.showAllCard();
            
            if (0 == this._chairId && this._seatIndex == data.actionInfo.nextaction.seat && 0 < data.actionInfo.nextaction.type) {
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
        //杠牌

        //碰牌

        //手牌
        this._handcardNode.removeAllChildren();
        for(let i = 0; i < this._handCards.length; ++i){
            let node = this.node.getComponent("HongZhong_Card").createCard(this._handCards[i], 0 === this._chairId);
            node.parent = this._handcardNode;
            if (0 === this._chairId) {      //下
                node.x = -(node.width*(this._handCards.length-1))/2 + node.width * i;
            } else if (1 === this._chairId) {  //上
                node.x = -node.width * i;
            }
            if (0 === this._chairId) {
                node.addComponent(cc.Button);
                node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
                node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
                node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
                node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
            }
        }

        //当前摸进牌
    },

    recvDeskInfoMsg(){
        if(this._handcardNode === null) return;
        let deskInfo = cc.vv.gameData.getDeskInfo();
        for(let i=0;i<deskInfo.users.length;++i){
            if(this._seatIndex === deskInfo.users[i].seat){
                let cards = deskInfo.users[i].handInCards;

                if(cards && cards.length !== this._handcardNode.childrenCount){
                    this.clearDesk();
                    let list = cc.vv.gameData.sortCard(cards);
                    this.greyCardArrCount = cc.vv.gameData.getGreyCardArrCount(cards);
                    for(let i=0;i<list.length;++i){
                        this.showCard(list[i],list.length);
                    }
                }

                let menziList = deskInfo.users[i].menzi;
                let pengKanCount = 0;
                for(let j = 0; j < menziList.length; ++j){
                    if(cc.vv.gameData.OPERATETYPE.KAN === menziList[j].type || cc.vv.gameData.OPERATETYPE.PENG === menziList[j].type) // 坎
                    {
                        ++pengKanCount;
                    }
                }
                if (4 == pengKanCount) {
                    this.isCanWarn = true;
                }

            }
        }
        if(deskInfo.isReconnect){
            if(cc.vv.gameData.getMySeatIndex() === deskInfo.actionInfo.nextaction.seat &&
                deskInfo.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.PUT){
                this._canOutCard = true;
                this.showOutLine();
            }
        }
    },

    // 检查是否可以出牌
    checkCanOutCard(seat){
        if(this._chairId === 0){
            if(cc.vv.gameData.getMySeatIndex() === seat){
                this._canOutCard = true;
            }
            else this._canOutCard = false;
            this._outCardLineNode.active = this._canOutCard;
            this.showOutCardTipsAni();
        }
    },

    showCard(list,len,showBg=false){
        for(let i=0;i<list.length;++i){
            let node = this.node.getComponent("HongZhong_Card").createCard(list[i],this._chairId==0?1:2);
            node.name = "card";
            if(this._chairId === 0) {
                node.y = (node.height-22)*i+node.height*0.5-25;
                node.addComponent(cc.Button);
                node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
                node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
                node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
                node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);

                if(showBg){
                    let child = new cc.Node();
                    child.addComponent(cc.Sprite);
                    this.node.getComponent("HongZhong_Card").createCard(0,1,true,child);
                    child.parent = node;
                    child.name = "bg";
                }
            }
            else node.y = node.height*i+node.height*0.5;
            if(this._chairId === 0){
                node.x = this._handcardNode.parent.width*0.5-len*0.5*node.width+node.width*this._num;
            } else if(this._chairId === 3){
                node.x = -node.width*this._num;
            } else {
                node.x = node.width*this._num;
            }
            
            node.parent = this._handcardNode;
            node.zIndex = 4-i;
            node.cardBoxIndex = this._num*4+i;
            node.cardValue = list[i];
            if(this._num<this._cardBox.length && i<this._cardBox[this._num].length){
                this._cardBox[this._num][i] = node;
            }

            if (this._num < this.greyCardArrCount) {
                node.color = new cc.Color(150,150,150);
            }
            node.isCanMove = (this._num >= this.greyCardArrCount);
        }
        ++this._num;
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

    isShowWarn(selectCardValue){
        if (this.isCanWarn && 3 == this._handcardNode.children.length) {
            let handCardsValue = [];
            for(let i = 0 ; i < this._handcardNode.children.length; ++i){
                if (this._handcardNode.children[i].cardValue == selectCardValue) {
                    selectCardValue = 0;
                } else {
                    handCardsValue.push(this._handcardNode.children[i].cardValue);
                }
            }
            if (handCardsValue[0] == handCardsValue[1]) {
                return true;
            }
        }
        return false;
    },

    outCard(){
        let pos = this._selectCard.parent.convertToWorldSpaceAR(this._selectCard.position);
        Global.dispatchEvent(EventId.OUTCARD,{card:this._selectCard.cardValue,pos:pos});
        cc.vv.gameData.outCard(this._selectCard.cardValue);
        // this._canOutCard = false;
        // this.showOutLine();
        // this._selectCard.removeFromParent();
        // this.clearSelectInCardBox();
        // this.resetCardPos(true);
        // this._selectCard = null;
    },

    // 插入在前面中间
    resetBoxInsertFront(index){
        this.clearSelectInCardBox();
        for(let i=this._cardBox.length-1;i>0;--i){
            if(i>index){
                for(let j=0;j<4;++j){
                    this._cardBox[i][j] = this._cardBox[i-1][j];
                }
            }
        }
        this._cardBox[index+1][0] = this._selectCard;
        this._cardBox[index+1][1] = null;
        this._cardBox[index+1][2] = null;
        this._cardBox[index+1][3] = null;
    },


    clearSelectInCardBox(){
        let cardIndex = this._selectCard.cardBoxIndex;
        let x = parseInt(cardIndex/4);
        let y = cardIndex%4;
        this._cardBox[x][y] = null;
        this.moveCard(x,y);
    },

    // 在顶部添加
    resetBoxAppendTop(index){
        this.clearSelectInCardBox();
        for(let j=0;j<4;++j){
            if(this._cardBox[index][j] === null){
                this._cardBox[index][j] = this._selectCard;
                break;
            }
        }
    },


    // 检查排的移动
    checkMoveCard(){
        let insertX = -2;
        let cardIndex = this._selectCard.cardBoxIndex;
        let x = parseInt(cardIndex/4);
        let y = cardIndex%4;

        let bFind = false;
        for(let i=0;i<this._cardBox.length;++i){
            let card = this._cardBox[i][0];
            if(card){
                if(this._selectCard.x>card.x-card.width*0.5 && this._selectCard.x<=card.x+card.width*0.5){
                    bFind = true;
                    if(card === this._selectCard){
                        continue;
                    }
                    if(this._cardBox[i][2]===null && this._cardBox[i][3]===null){
                        insertX  = i;
                        if(x==0 && y===0 && this._cardBox[x][1] === null) insertX = 0;

                        // 在前面单独一列，而且这一列只有这一个牌
                        if(this._cardBox[x][1] === null && x<i){
                            insertX = i-1;
                        }
                        this.resetBoxAppendTop(insertX);
                        break;
                    }
                    else{
                        insertX = -1;
                        break;
                    }
                }
            }
        }

        if(!bFind){
            let card = this._cardBox[0][0];
            // 插在最前面
            if(this._selectCard.x<card.x){
                if(this._num<10){
                    insertX  = -1;
                    this.resetBoxInsertFront(insertX);
                }
            }
            else{
                if(this._num<10){
                    // 插在最后
                    this.clearSelectInCardBox();
                    for(let i=0;i<this._cardBox.length;++i){
                        if(this._cardBox[i][0] === null ){
                            this._cardBox[i][0] = this._selectCard;
                            break;
                        }
                    }
                }

            }
        }
        this.resetCardPos(true);
        this._selectCard.color = new cc.Color(255,255,255);
        this._selectCard = null;
    },

    resetCardPos(showAction=false){
        let len = 0;
        for(let i=0;i<this._cardBox.length;++i){
            if(this._cardBox[i][0]) ++len;
        }
        this._num = len;
        for(let i=0;i<this._cardBox.length;++i){
            for(let j=0;j<4;++j){
                if(this._cardBox[i][j] === null && j<3){
                    this._cardBox[i][j] = this._cardBox[i][j+1];
                }
                if(this._cardBox[i][j] ){

                    let endPos = cc.v2(this._handcardNode.parent.width*0.5-len*0.5*this._cardBox[i][j].width+
                        i*this._cardBox[i][j].width,(this._cardBox[i][j].height-22)*j+this._cardBox[i][j].height*0.5-25);
                    if(showAction){
                        this._cardBox[i][j].runAction(cc.moveTo(0.1,endPos));
                    }
                    else{
                        this._cardBox[i][j].position = endPos;
                    }
                    this._cardBox[i][j].cardBoxIndex = i*4+j;
                    this._cardBox[i][j].zIndex = 4-j;
                }
            }
        }
        if(showAction){
            this._canTouch = false;
            this.scheduleOnce(()=>{
                this._canTouch = true;
            },0.1)
        }
    },

    recvChiCard(data){
        data = data.detail;
        if(this._chairId === 0){
            // 轮到我自己出牌
            if(data.actionInfo.nextaction.seat === cc.vv.gameData.getMySeatIndex() &&
                data.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.PUT){
                this._canOutCard = true;
                this.showOutLine();
            }

            // 我当前吃牌
            if(data.actionInfo.curaction.seat === cc.vv.gameData.getMySeatIndex()){
                // 删除手里面的牌
                let list = data.chiInfo.chiData.slice(0);
                let card = data.actionInfo.curaction.card;
                let index = list.indexOf(card);
                if(index>=0){
                    list.splice(index,1);
                    this.delHandCard(list[0]);
                    this.delHandCard(list[1]);
                    if(data.chiInfo.luoData){
                        for(let i=0;i<data.chiInfo.luoData.length;++i){
                            for (var j = 0; j < data.chiInfo.luoData[i].length; j++) {
                                this.delHandCard(data.chiInfo.luoData[i][j]);
                            }
                        }
                    }
                    this.resetCardPos();
                }

            }
        }

    },

    delHandCard(card){
        let x = -1;
        let y = -1;
        for(let i=0;i<this._handcardNode.childrenCount;++i){
            let node = this._handcardNode.children[i];
            if(node.cardValue === card){
                let cardIndex = node.cardBoxIndex;
                x = parseInt(cardIndex/4);
                y = cardIndex%4;
                this._cardBox[x][y] = null;
                node.removeFromParent(true);
                break;
            }
        }
        if(x>-1 && y>-1){
            this.moveCard(x,y);
        }
    },

    moveCard(x,y){
        if(y<3){ // 移走的不是最顶上的
            if(this._cardBox[x][y+1]){
                for(let i=y;i<3;++i){
                    this._cardBox[x][i] = this._cardBox[x][i+1];
                    if(this._cardBox[x][i]) this._cardBox[x][i].cardBoxIndex = x*4+i;
                }
                this._cardBox[x][3] = null;
            }
            else{
                if(y===0){
                    // 这是列只有这一张牌，所以后面的牌都要往前移
                    for(let i=x;i<this._cardBox.length-1;++i){
                        for(let j=0;j<4;++j){
                            this._cardBox[i][j] = this._cardBox[i+1][j];
                            if(this._cardBox[i][j]) this._cardBox[i][j].cardBoxIndex = i*4+j;
                        }
                    }
                    this._cardBox[this._cardBox.length-1][0] = null;
                    this._cardBox[this._cardBox.length-1][1] = null;
                    this._cardBox[this._cardBox.length-1][2] = null;
                    this._cardBox[this._cardBox.length-1][3] = null;
                }
            }
        }
    },

    sortCard(){
        if (this._bPlaying) {
            this.checkCanOutCard(this._handCardData.bankerInfo.seat);
        }
        let canOutCard = this._canOutCard;
        Global.dispatchEvent(EventId.SHOW_MENZI,this._handCardData);
        this.clearDesk();
        let list = cc.vv.gameData.sortCard(this._handCards);
        this.greyCardArrCount = cc.vv.gameData.getGreyCardArrCount(this._handCards);
        for(let i=0;i<list.length;++i){
            this.showCard(list[i],list.length);
        }
    },

    initCardBox(){
        for(let i=0;i<10;++i){
            this._cardBox.push([]);
            for(let j=0;j<4;++j){
                if(j==0) this._cardBox[i].push([]);
                this._cardBox[i][j]=null;
            }
        }
    },

    clearDesk(){
        this._handCardData = null;
        if(this._handcardNode) {
            this._handcardNode.removeAllChildren(true);
        }
        if(this._chairId === 0){
            for(let i=0;i<10;++i){
                for(let j=0;j<4;++j){
                    this._cardBox[i][j] = null;
                }
            }
        }
        this._selectCard = null;
        // this._canOutCard = false;
        // if(this._outCardLineNode) {
        //     this._outCardLineNode.active = false;
        //     this.showOutCardTipsAni();
        // }
        this._num = 0;
    },

    recvOverRound(data){
        this._bPlaying = false;
        this.isCanWarn = false;
        if(this._chairId === 0){
            this._canOutCard = false;
            this.showOutLine();
        }
    },

    recvDelHandcardNotify(data){
        data = data.detail;
        if(data.seat === this._seatIndex){
            this.delHandCard(data.card);
            this.resetCardPos();
        }
    },

    // 收到跑或者龙
    recvPaoAndLongNotify(data){
        data = data.detail;
        if(this._chairId === 0){
            if(data.actionInfo.curaction.seat === cc.vv.gameData.getMySeatIndex()){
                if (data.ishand) {
                    for (var i = 0; i < 3; i++) {
                        this.delHandCard(data.actionInfo.curaction.card);
                    }
                    this.resetCardPos();
                }
            }
            if(data.actionInfo.nextaction.seat === cc.vv.gameData.getMySeatIndex() &&
                data.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.PUT){
                this._canOutCard = true;
                this.showOutLine();
            }
        }

    },

    // 收到坎
    recvKanAndKanNotify(data){
        data = data.detail;
        // if (data.seat === this._seatIndex) {
        //     if (cc.vv.gameData.OPERATETYPE.PENGSI == data.pengType || cc.vv.gameData.OPERATETYPE.KANSI == data.kanType) {
        //         this.isCanWarn = true;
        //     }
        // }
        if(this._chairId === 0){
            if(data.actionInfo.curaction.seat === cc.vv.gameData.getMySeatIndex()){
                this.delHandCard(data.actionInfo.curaction.card);
                this.delHandCard(data.actionInfo.curaction.card);
                this.resetCardPos();
            }
            if(data.actionInfo.nextaction.seat === cc.vv.gameData.getMySeatIndex() &&
                data.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.PUT){
                this._canOutCard = true;
                this.showOutLine();
            }
        }

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
    // update (dt) {},
});
