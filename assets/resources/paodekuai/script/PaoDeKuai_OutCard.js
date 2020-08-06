
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
        // Global.registerEvent(EventId.PENG_NOTIFY,this.recvPengNotify,this);
        Global.registerEvent(EventId.GUO_NOTIFY,this.recvGuoNotify,this);
        // Global.registerEvent(EventId.MOPAI_NOTIFY,this.recvMoPaiNotify,this);
        // Global.registerEvent(EventId.CHI_NOTIFY,this.recvChiCard,this);
        // Global.registerEvent(EventId.PAO_NOTIFY,this.recvPaoNotify,this);
        // Global.registerEvent(EventId.LONG_NOTIFY,this.showOutCard,this);
        // Global.registerEvent(EventId.KAN_NOTIFY,this.showOutCard,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.showOutCard,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.OUT_CARD_NOTIFY,this.onRcvOutCardNotify,this);

        this.recvDeskInfoMsg();
    },

    recvDeskInfoMsg(){
        //gsdltodo
        return;
        
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

    onRcvOutCardNotify(data){
        data = data.detail;
        if (data.actionInfo.curaction.seat === cc.vv.gameData.getMySeatIndex()) {
            if (0 == data.actionInfo.curaction.type) {
                this.showNoOutCard(true);
            } if (0 < data.actionInfo.curaction.type) {
                //gsltodo
                this.showOutCard(); 
            }
        }
    },

    showOutCard(list){
        this._outCardNode.removeAllChildren();
        if (list.length) {

        }

        // if(this._outCardValue){
        //     for(let i=0;i<this._outCardValue.length;++i){
        //         this.showCard(this._outCardValue[i],true);
        //     }
        //     this._outCardValue = null;
        // }
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

    showNoOutCard(bShow){
        this.mask_onOut.active = bShow;
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
