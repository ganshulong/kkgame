
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
        this._outCardNode = cc.find("scene/out_cards/out_card"+index,this.node);
        this.curOutCardTipsAni = cc.find("scene/out_cards/curOutCardTipsPos"+index+"/curOutCardTipsAni",this.node);
        this.showCurOutCardAni(false);

        this._playerNum = playerNum;
        this._chairId = cc.vv.gameData.getLocalSeatByUISeat(index);
        this._UISeat = index;

        if(this._outCardNode){
            let showCardNode = cc.find("scene/out_cards/show_card"+index,this.node);
            let pos = showCardNode.parent.convertToWorldSpaceAR(showCardNode.position);
            this._startPos = this._outCardNode.convertToNodeSpaceAR(pos);
            this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);
        }
    },

    start () {
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.PLAYER_ENTER,this.recvPlayerEnter,this);
        Global.registerEvent(EventId.PLAYER_EXIT,this.recvPlayerExit,this);
        Global.registerEvent(EventId.PENG_NOTIFY,this.recvPengNotify,this);
        Global.registerEvent(EventId.GANG_NOTIFY,this.recvGangNotify,this);
        Global.registerEvent(EventId.OUTCARD_NOTIFY,this.recvOutCardNotify,this);
        Global.registerEvent(EventId.GUO_NOTIFY,this.recvGuoNotify,this);
        Global.registerEvent(EventId.MOPAI_NOTIFY,this.recvMoPaiNotify,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOverNotify,this);
        // Global.registerEvent(EventId.CHI_NOTIFY,this.recvChiCard,this);
        // Global.registerEvent(EventId.PAO_NOTIFY,this.recvPaoNotify,this);
        // Global.registerEvent(EventId.LONG_NOTIFY,this.showOutCard,this);
        // Global.registerEvent(EventId.KAN_NOTIFY,this.showOutCard,this);
        // Global.registerEvent(EventId.HU_NOTIFY,this.showOutCard,this);
        // Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);

        this.recvDeskInfoMsg();
    },

    recvDeskInfoMsg(){
        let deskInfo = cc.vv.gameData.getDeskInfo();
        if(deskInfo.isReconnect){
            for(let i=0;i<deskInfo.users.length;++i){
                if(this._seatIndex === deskInfo.users[i].seat && deskInfo.users[i].qipai){
                    let qipaiList = deskInfo.users[i].qipai;
                    if(this._outCardNode.childrenCount !== qipaiList.length){
                        this._cardsNum = 0;
                        this._outCardNode.removeAllChildren();
                        for(let i=0;i<qipaiList.length;++i){
                            this.showCard(qipaiList[i]);
                        }
                        break;
                    }
                }
            }
        }
    },

    recvRoundOverNotify(){
        this.showCurOutCardAni(false);
    },

    recvMoPaiNotify(data){
        // this.showCurOutCardAni(false);
    },

    // 出牌
    recvOutCardNotify(data){
        data = data.detail;
        if(data.actionInfo.curaction.seat === this._seatIndex){
            this.showCard(data.actionInfo.curaction.card);
        }
        this.showCurOutCardAni(data.actionInfo.curaction.seat === this._seatIndex);
    },

    recvPengNotify(data){
        data = data.detail;
        if(data.actionInfo.curaction.source === this._seatIndex){
            this._outCardNode.children[this._outCardNode.children.length-1].removeFromParent();
            --this._cardsNum;
            this.showCurOutCardAni(false);
        }
    },

    recvGangNotify(data){
        data = data.detail;
        if(data.actionInfo.curaction.source === this._seatIndex){
            if (0 < this._outCardNode.children.length) {
                if (data.actionInfo.curaction.card == this._outCardNode.children[this._outCardNode.children.length-1].cardValue) {
                    this._outCardNode.children[this._outCardNode.children.length-1].removeFromParent();
                    --this._cardsNum;
                    this.showCurOutCardAni(false);
                }
            }
        }
    },

    // 过
    recvGuoNotify(data){
        data = data.detail;
        this.showCurOutCardAni(data.actionInfo.curaction.seat === this._seatIndex);
    },

    showCard(value){
        let node = this.node.getComponent("HongZhong_Card").createCard(value,false);
        let row = parseInt(this._cardsNum/25);
        let col = this._cardsNum%25;
        if(this._UISeat === 0){             // 下
            node.x = 43 * col;
            node.y = -70 * row;
        } else if(this._UISeat === 1){      //上
            node.x = -43 * col;
            node.y = 70 * row;
        }
        node.parent = this._outCardNode;
        node.cardValue = value;
        ++this._cardsNum;
    },

    showCurOutCardAni(bShow){
        this.curOutCardTipsAni.active = bShow;
        this.curOutCardTipsAni.stopAllActions();
        if (bShow) {
            let curOutCard = this._outCardNode.children[this._outCardNode.children.length-1];
            this.curOutCardTipsAni.position = cc.v2(curOutCard.x,curOutCard.y);
            this.curOutCardTipsAni.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.moveTo(0.3, cc.p(curOutCard.x, curOutCard.y+10)),
                        cc.moveTo(0.3, cc.p(curOutCard.x, curOutCard.y)),
                    )
                )
            )
        }
    },

    showOutCard(card){
        this.showCard(card,true);
    },

    // 吃
    recvChiCard(data){
        data = data.detail;
        this.showOutCard();
        if(data.actionInfo.curaction.seat === this._seatIndex && data.luoData){
            for(let i=0;i<data.luoData.length;++i){
                this.showCard(data.luoData[i],true);
            }
        }
    },

    putOutCard(card){
        this._outCardValue = [];
        this._outCardValue.push(card);
    },

    recvPaoNotify(data){
        data = data.detail;
        if (this._outCardValue) {
            for (let j = 0; j < this._outCardValue.length; j++) {
                if (data.actionInfo.curaction.card == this._outCardValue[j]) {
                    this._outCardValue.splice(j,1)
                }
            }
        }
        if(data.delQiPaiSeat === this._seatIndex){
            let card = data.delQiPaiCard;
            let node = null;
            let num = 0;
            for(let i=0;i<this._outCardNode.childrenCount;++i){
                let child = this._outCardNode.children[i];
                if(child.cardValue === card){
                    node = child;
                }
                else {
                    if(node){
                        let pos = this.getEndPos(num);
                        this._outCardNode.children[i].position = pos;
                    }
                    ++num;
                }
            }
            if(node) {
                this._cardsNum = num;
                node.removeFromParent();
            }
        }
    },

    // showOutCard(){
    //     if(this._outCardValue){
    //         for(let i=0;i<this._outCardValue.length;++i){
    //             this.showCard(this._outCardValue[i],true);
    //         }
    //         this._outCardValue = null;
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
        // node.position = startPos;
        // node.scale = 1;

        // let time = cc.vv.gameData.getActionTime();
        // node.opacity = 255;

        // let self = this;
        // node.runAction(cc.sequence(cc.spawn(cc.moveTo(time,endPos),cc.scaleTo(time,0.48),cc.fadeTo(time,50)),cc.callFunc(()=>{
        //     self.node.getComponent("HongZhong_Card").createCard(node.cardValue,2,node.showBg,node);
        //     node.scale = 1;
        //     node.rotation = 0;
        //     node.opacity = 255;
        // })))
    },

    recvPlayerExit(data){
        data = data.detail;
        if(data === this._seatIndex){
            this._seatIndex = -1;
        }
    },

    getEndPos(cardsNum){
        let scale = 1;
        // 下
        if(this._UISeat === 0){
            scale = 0.9;
        //上
        } else if(this._UISeat === 1){
            scale = -0.75;
        }
        return cc.v2(0, 0);
    },

    clearDesk(){
        this._outCardValue = null;
        this._cardsNum = 0;
        if(this._outCardNode) this._outCardNode.removeAllChildren();
    },

    // update (dt) {},
});
