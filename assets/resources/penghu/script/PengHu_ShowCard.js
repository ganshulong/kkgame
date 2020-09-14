// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        _showCardNode:null,
        _chairId:-1,
        _seatIndex:-1,
        _playerNum:0,
        _pos:null,
        _cardBoXPos:null,
        _cardValue:null,
        _cardPos:null,
    },

    init(index,playerNum){
        let showCardNode = cc.find("scene/out_cards/show_card"+index,this.node);
        showCardNode.active = false;

        let box = cc.find("scene/cardBox",this.node);
        this._cardBoXPos = box.parent.convertToWorldSpaceAR(box.position);

        this._pos = cc.v2(showCardNode.x,showCardNode.y);
        if(playerNum === 4) {
            this._showCardNode = showCardNode;
            this._chairId = index;
        }
        else {
            if( index ==0 || index ==2){
                this._showCardNode = showCardNode;
                this._chairId = index>0?1:0;
            }
        }

        if(this._showCardNode){
            this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);
        }
    },

    showCard(cardValue){
        this._showCardNode.scale = 1;
        this._showCardNode.opacity = 255;
        let node = this.node.getComponent("PengHu_Card").createCard(cardValue,0,cardValue==0?true:false,this._showCardNode);
        this._showCardNode.active = true;
        this._cardValue = cardValue;
        return node;

    },

    recvOutcardNotify(data){
        data = data.detail;
        // 打出去摸得牌
        if(this._cardValue){
            // 没人要
            if(data.actionInfo.iswait === 0){
                this.clearDesk();
            }
        }
        else{
            if(data.actionInfo.curaction.seat === this._seatIndex){

                if(data.actionInfo.curaction.type === cc.vv.gameData.OPERATETYPE.PUT){
                    this.showCard(data.actionInfo.curaction.card);
                    this.node.getComponent("PengHu_Card").changCardBg(this._showCardNode.getChildByName("card_light"),false);
                    let chairId = cc.vv.gameData.getLocalChair(data.actionInfo.curaction.seat);
                    chairId = cc.vv.gameData.getUISeatBylocalSeat(chairId);
                    let playerNode = cc.find("scene/player"+chairId,this.node);
                    let startPos = playerNode.position;
                    if(this._chairId === 0){
                        if(this._cardPos){
                            startPos = cc.v2(this._cardPos.x,this._cardPos.y);
                        }
                        else {
                            startPos = cc.v2(this._cardBoXPos.x,this._cardBoXPos.y);
                        }
                        this.showCardAction(startPos,data.actionInfo.iswait === 0 && data.actionInfo.source>0);
                        this._cardPos = null;
                    }
                    else{
                        this.showCardAction(playerNode.parent.convertToWorldSpaceAR(startPos),data.actionInfo.iswait === 0 && data.actionInfo.source>0);
                    }

                }
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    recvChiCard(data){
        data = data.detail;
        this.clearDesk();
    },

    recvMyOutCard(data){
        data = data.detail;
        if(this._chairId === 0){
            this._cardPos = data.pos;
        }
    },

    recvMoPaiNotify(data){
        data = data.detail;
        if(data.seat === this._seatIndex){
           this.showCard(data.card);

            this.node.getComponent("PengHu_Card").changCardBg(this._showCardNode.getChildByName("card_light"),true);
            this.showCardAction(this._cardBoXPos);
        }
        else this.clearDesk();
    },

    showCardAction(worldPos){
        let pos = this._showCardNode.parent.convertToNodeSpaceAR(worldPos);
        this._showCardNode.stopAllActions();
        this._showCardNode.position = pos;
        this._showCardNode.scale = 0;
        this._showCardNode.opacity = 50;
        let time = cc.vv.gameData.getActionTime();
        let self = this;
        this._showCardNode.runAction(cc.sequence(cc.spawn(cc.moveTo(time,this._pos).easing(cc.easeOut(3)),cc.scaleTo(time,1),cc.fadeTo(time,255)),cc.callFunc(()=>{
            self._showCardNode.scale = 1;
            self._showCardNode.opacity = 255;
        })))
    },

    clearDesk(){
        this._cardValue = null;
        if(this._showCardNode && this._showCardNode.active) {
            this._showCardNode.active = false;
        }
    },

    start () {
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.OUTCARD,this.recvMyOutCard,this);
        Global.registerEvent(EventId.OUTCARD_NOTIFY,this.recvOutcardNotify,this);
        Global.registerEvent(EventId.CHI_NOTIFY,this.recvChiCard,this);
        Global.registerEvent(EventId.MOPAI_NOTIFY,this.recvMoPaiNotify,this);
        Global.registerEvent(EventId.PLAYER_ENTER,this.recvPlayerEnter,this);
        Global.registerEvent(EventId.PLAYER_EXIT,this.recvPlayerExit,this);
        Global.registerEvent(EventId.KAN_NOTIFY,this.recvKanNotify,this);
        Global.registerEvent(EventId.GUO_NOTIFY,this.recvGuoNotify,this);
        Global.registerEvent(EventId.PENG_NOTIFY,this.recvPengNotify,this);
        Global.registerEvent(EventId.PAO_NOTIFY,this.clearDesk,this);
        Global.registerEvent(EventId.LONG_NOTIFY,this.clearDesk,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);
        this.recvDeskInfoMsg();
    },

    recvDeskInfoMsg(){
        let deskInfo = cc.vv.gameData.getDeskInfo();
        if(deskInfo.isReconnect){
            if(deskInfo.smallState === 1){
                if(deskInfo.actionInfo.curaction.type === cc.vv.gameData.OPERATETYPE.PUT ||
                    deskInfo.actionInfo.curaction.type === cc.vv.gameData.OPERATETYPE.MOPAI) {
                    this.clearDesk();
                    if (deskInfo.actionInfo.curaction.seat === this._seatIndex) {
                        this._showCardNode.stopAllActions();
                        this.showCard(deskInfo.actionInfo.curaction.card);
                        this.node.getComponent("PengHu_Card").changCardBg(this._showCardNode.getChildByName("card_light"),
                            deskInfo.actionInfo.curaction.source === 0);
                    }
                }
            }
            else{
                this.clearDesk();
            }
        }
    },

    recvRoundOver(data){
        data = data.detail;
        if(data.hcard>0){
            if(data.source>0){
                this.clearDesk();
                if(data.source === this._seatIndex){
                    this.showCard(data.hcard);
                    this.node.getComponent("PengHu_Card").changCardBg(this._showCardNode.getChildByName("card_light"),false);
                }
            }
            else{
                if(data.seat === this._seatIndex){
                    // this.showCard(data.hcard);
                    // this.node.getComponent("PengHu_Card").changCardBg(this._showCardNode.getChildByName("card_light"),true);
                }
            }
        }

    },

    // 收到过牌
    recvGuoNotify(data){
        data = data.detail;
        if(this._cardValue){
            this.clearDesk();
        }
    },

    recvPengNotify(data){
        this.clearDesk();
    },

    recvKanNotify(data){
        data = data.detail;
        if(data.actionInfo.curaction.seat === this._seatIndex){
            this.clearDesk();
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
