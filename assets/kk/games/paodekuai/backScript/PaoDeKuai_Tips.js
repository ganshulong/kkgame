
cc.Class({
    extends: cc.Component,

    properties: {
        _cardBox:null,      // 牌盒
        _remaindCards:null,
    },

    start () {
        this._cardBox = cc.find("scene/cardBox",this.node);
        this._cardBox.active = false;

        this._remaindCards = cc.find("scene/cardBox/panel_bg/txt_remain_card",this.node);

        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.CHI_NOTIFY,this.operateNotify,this);
        Global.registerEvent(EventId.KAN_NOTIFY,this.operateNotify,this);
        Global.registerEvent(EventId.PENG_NOTIFY,this.operateNotify,this);
        Global.registerEvent(EventId.PAO_NOTIFY,this.operateNotify,this);
        Global.registerEvent(EventId.LONG_NOTIFY,this.operateNotify,this);
        Global.registerEvent(EventId.GUO_NOTIFY,this.operateNotify,this);
        Global.registerEvent(EventId.MOPAI_NOTIFY,this.recvMoPaiNotify,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        this.recvDeskInfoMsg();
    },

    recvDeskInfoMsg(){
        //gsdltodo
        return;
        
       let deskInfo = cc.vv.gameData.getDeskInfo();
       if(deskInfo.isReconnect ){
           if(deskInfo.smallState === 1){
               this.showDir((deskInfo.actionInfo.iswait===1 && deskInfo.actionInfo.curaction.seat>0)? deskInfo.actionInfo.curaction.seat:deskInfo.actionInfo.nextaction.seat);
               this._cardBox.active = true;
               this.updateRemainCards(deskInfo.pulicCardsCnt);
           }
           else{
               this.clearDesk();
           }
       }
    },

    recvMoPaiNotify(data){
        data = data.detail;
        this.showDir(data.seat);
        this.updateRemainCards(data.pulicCardsCnt);
    },

    operateNotify(data){
        data = data.detail;
        this.showDir(data.actionInfo.iswait===1? data.actionInfo.curaction.seat:data.actionInfo.nextaction.seat);
    },

    onRecvHandCard(data){
        //gsltodo
        
        // data = data.detail;
        // this._cardBox.active = true;
        // let bankInfo = data.bankerInfo;
        // this.showDir(bankInfo.seat);
        // if(data.cardcnt) this.updateRemainCards(data.cardcnt);
    },

    updateRemainCards(num){
        this._remaindCards.getComponent(cc.Label).string = num;
    },

    showDir(seat){
        let chairId = cc.vv.gameData.getLocalChair(seat);
        let UISeat = cc.vv.gameData.getUISeatBylocalSeat(chairId);
        let playerNum = cc.vv.gameData.getPlayerNum();
        for(let i = 0; i < cc.vv.gameData.RoomSeat; ++i){
           let arrow =  cc.find("panel_bg/arrow"+i,this._cardBox);
           arrow.active = UISeat === i;
        }
    },

    clearDesk(){
        if(this._cardBox) this._cardBox.active = false;
    },

    // update (dt) {},
});
