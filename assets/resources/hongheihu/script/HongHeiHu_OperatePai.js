// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

/*
    碰，提，畏，吃
 */
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
        _operateCardNode:null,
        _chairId:-1,
        _seatIndex:-1,
        _num:0, // 吃碰提畏数量
        _playerNum:0,
        _startPos:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init(index,playerNum){
        this._playerNum = playerNum;
        let outCardNode = cc.find("scene/out_cards/operate_card"+index,this.node);
        let showCardNode = cc.find("scene/out_cards/show_card"+index,this.node);

        this._startPos = showCardNode.parent.convertToWorldSpaceAR(showCardNode.position);

        this._operateCardNode = outCardNode;
        this._chairId = index;

        if(this._operateCardNode){
            this._startPos = this._operateCardNode.convertToNodeSpaceAR(this._startPos);
            this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);

        }

    },

    showCard(list,type,source=0,showAction = false){
        for(let i=0;i<list.length;++i){
            let showBg = false;
            if(type === cc.vv.gameData.OPERATETYPE.KAN){
                if(i == 2 && this._chairId === 0){ // 自己
                    showBg = false;
                } else {
                    showBg = true;
                }
            }
            else if(type === cc.vv.gameData.OPERATETYPE.LONG || type === cc.vv.gameData.OPERATETYPE.SHE){
                if (i == 3 && this._chairId === 0) {
                    showBg = false;
                } else {
                    showBg = true;
                }
            }
            let node = this.node.getComponent("PaoHuZi_Card").createCard(list[i],showAction?1:2,showBg);

            let endPos = cc.v2(0,0);
            endPos.y = 36*i;
            if(this._chairId == 1) {
                endPos.x = -37*this._num;
            } else {
                endPos.x = 37*this._num;
            }

            if(showAction){
                let startPos = cc.v2(0,0);
                startPos.x = this._startPos.x+this._num*node.width;
                let len = list.length*(node.height-22)/2;
                startPos.y = this._startPos.y-len+i*(node.height-22);
                this.showCardAction(node,startPos,endPos)
            }
            else{
                node.position = cc.v2(endPos.x,endPos.y);
            }

            node.cardValue = list[i];
            node.showBg = showBg;
            node.index = i;

            node.parent = this._operateCardNode;
            node.source = source;

        }
        ++this._num;

    },

    showCardAction(node,startPos,endPos){
        node.stopAllActions();
        node.position = startPos;
        node.scale = 1;
        node.opacity = 255;
        let time = cc.vv.gameData.getActionTime();
        node.runAction(cc.sequence(cc.spawn(cc.moveTo(time,endPos).easing(cc.easeOut(3)),cc.scaleTo(time,0.48),cc.fadeTo(time,50)),cc.callFunc(()=>{
            this.node.getComponent("PaoHuZi_Card").createCard(node.cardValue,2,node.showBg,node);
            node.scale = 1;
            node.opacity = 255;
        })))
    },

    recvHandCard(data){
        data = data.detail;
        if(data.seat === this._seatIndex){
            for(let j=0;j<data.menzi.length;++j){
                let typeData = data.menzi[j];
                let list = [];
                if(typeData.type === cc.vv.gameData.OPERATETYPE.KAN ||typeData.type === cc.vv.gameData.OPERATETYPE.PENG) // 坎
                {
                    list=[typeData.card,typeData.card,typeData.card];
                }
                else if(typeData.type === cc.vv.gameData.OPERATETYPE.LONG){
                    list=[typeData.card,typeData.card,typeData.card,typeData.card];
                }
                else if(typeData.type === cc.vv.gameData.OPERATETYPE.SHE){
                    list=[typeData.card,typeData.card,typeData.card,typeData.card];
                }
                this.showCard(list,typeData.type,0,true);
                Global.dispatchEvent(EventId.SHOW_MENZI_SOUND,typeData.type);
            }
        }

    },

    // 收到吃消息
    recvChiCard(data){
        data = data.detail;
        if(this._seatIndex === data.actionInfo.curaction.seat){
            this.showCard(data.chiInfo.chiData,data.actionInfo.curaction.type,0,true);
            for (var i = 0; i < data.chiInfo.luoData.length; i++) {
                this.showCard(data.chiInfo.luoData[i],data.actionInfo.curaction.type,0,true);
            }
        }
    },

    clearDesk(){
        this._num = 0;
        if(this._operateCardNode) this._operateCardNode.removeAllChildren();
    },

    start () {
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.SHOW_MENZI,this.recvHandCard,this);
        Global.registerEvent(EventId.CHI_NOTIFY,this.recvChiCard,this);
        Global.registerEvent(EventId.PLAYER_ENTER,this.recvPlayerEnter,this);
        Global.registerEvent(EventId.PLAYER_EXIT,this.recvPlayerExit,this);
        Global.registerEvent(EventId.KAN_NOTIFY,this.recvKanNotify,this);
        Global.registerEvent(EventId.PENG_NOTIFY,this.recvPengNotify,this);
        Global.registerEvent(EventId.PAO_NOTIFY,this.recvPaoNotify,this);
        Global.registerEvent(EventId.LONG_NOTIFY,this.recvLongNotify,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.HANDCARD,this.recvHandCardMsg,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvOverRound,this);
        this.recvDeskInfoMsg();
    },

    // 小局结束
    recvOverRound(){
        if(this._operateCardNode){
            for(let i=0;i<this._operateCardNode.childrenCount;++i){
                let child = this._operateCardNode.children[i];
                if(child.showBg && child.index==2){
                    // this.node.getComponent("PaoHuZi_Card").createCard(child.cardValue,2,false,child);
                }
            }
        }
    },

    recvHandCardMsg(data){
        if(data.detail.seat !== cc.vv.gameData.getMySeatIndex()){
            this.recvHandCard(data);
        }
    },

    recvDeskInfoMsg(){
        let deskInfo = cc.vv.gameData.getDeskInfo();
        if(deskInfo.isReconnect){
            for(let i=0;i<deskInfo.users.length;++i){
                if(this._seatIndex === deskInfo.users[i].seat){
                    let menziList = deskInfo.users[i].menzi;
                    if(this._operateCardNode.childrenCount !== menziList.length){
                        this._num = 0;
                        this._operateCardNode.removeAllChildren();
                        for(let j=0;j<menziList.length;++j){
                            let typeData = menziList[j];
                            let list = [];
                            let source = 0;
                            if(typeData.type === cc.vv.gameData.OPERATETYPE.KAN) // 坎
                            {
                                list=[typeData.card,typeData.card,typeData.card];
                            }
                            else if(typeData.type === cc.vv.gameData.OPERATETYPE.LONG || typeData.type === cc.vv.gameData.OPERATETYPE.SHE||
                                typeData.type === cc.vv.gameData.OPERATETYPE.PAO){
                                list=[typeData.card,typeData.card,typeData.card,typeData.card];
                            }
                            else if(typeData.type === cc.vv.gameData.OPERATETYPE.PENG){
                                if(typeData.source === 0){
                                    list=[typeData.card,typeData.card,typeData.card];
                                }
                                else{
                                    list=[typeData.card,typeData.card];
                                }
                                source = typeData.source;
                            }

                            else {
                                list = typeData.data;
                            }
                            this.showCard(list,typeData.type,source);
                        }
                        break;
                    }
                }
            }
        }
    },

    recvPaoNotify(data){
        data = data.detail;
        if(data.actionInfo.curaction.seat === this._seatIndex){
            if (data.ishand) {
                let card = data.actionInfo.curaction.card;
                this.showCard([card,card,card,card],cc.vv.gameData.OPERATETYPE.PAO,0,true);
            } else {
                let card = data.actionInfo.curaction.card;
                this.addCard(card,false);
            }
        }
    },

    recvLongNotify(data){
        data = data.detail;
        if(data.actionInfo.curaction.seat === this._seatIndex){
            if (data.ishand) {
                let card = data.actionInfo.curaction.card;
                this.showCard([card,card,card,card],cc.vv.gameData.OPERATETYPE.LONG,0,true);
            } else {
                let card = data.actionInfo.curaction.card;
                this.addCard(card,true); 
            }
        }
    },

    addCard(card,showBg){
        let num = 0;
        let startX = 0;
        for(let i=0;i<this._operateCardNode.childrenCount;++i){
            if(this._operateCardNode.children[i].cardValue == card ){
                startX = this._operateCardNode.children[i].x;
                ++num;
                if(this._operateCardNode.children[i].index !==3){
                    this.node.getComponent("PaoHuZi_Card").createCard(card,2,showBg,this._operateCardNode.children[i]);

                }
            }
        }
        if(num === 0){
            for(let i=0;i<4;++i){
                let node = this.node.getComponent("PaoHuZi_Card").createCard(card,2,(i<3)?showBg:false);
                node.y = node.height*(num+i);
                node.x = startX;
                node.cardValue = card;
                node.parent = this._operateCardNode;
                node.index = num+i;
            }
        }
        else {
            for(let i=0;i<4-num;++i){
                let node = this.node.getComponent("PaoHuZi_Card").createCard(card,2,(num<3&&i==0)?showBg:false);
                node.y = node.height*(num+i);
                node.x = startX;
                node.cardValue = card;
                node.parent = this._operateCardNode;
                node.index = num+i;
            }
        }

    },


    recvKanNotify(data){
        data = data.detail;
        if(data.actionInfo.curaction.seat === this._seatIndex){
            let card = data.actionInfo.curaction.card;
            this.showCard([card,card,card],cc.vv.gameData.OPERATETYPE.KAN,0,true);
        }
    },

    recvPengNotify(data){
        data = data.detail;
        if(data.actionInfo.curaction.seat === this._seatIndex){
            let card = data.actionInfo.curaction.card;
            this.showCard([card,card,card],data.actionInfo.curaction.type,0,true);      //扫碰 都显示三张  不同
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
