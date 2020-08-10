
cc.Class({
    extends: cc.Component,

    properties: {
        
        _soundPath:"penghu/"
    },

    start () {
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);
        // Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.CHAT_NOTIFY,this.onRcvChatNotify,this);
        Global.registerEvent(EventId.OUT_CARD_NOTIFY,this.onRcvOutCardNotify,this);
        Global.registerEvent(EventId.GUO_NOTIFY,this.onRcvOutCardNotify,this);
    },

    onRcvOutCardNotify(data){
        data = data.detail;
        let outCards = data.actionInfo.curaction.outCards;
        let curaction = data.actionInfo.curaction;
        if (0 < curaction.outCards.length) {
            cc.vv.AudioManager.playEff("paodekuai/", "cardout",true);
            this.playCardSound(curaction.cardType, curaction.outCards, curaction.seat);
        } else {
            let path = "card/"+this.getLanguage()+this.getSex(data.seat)+ "pass" + Global.random(0,3);
            cc.vv.AudioManager.playEff("paodekuai/", path,true);
        }
    },

    playCardSound(cardType, outCards, seat){
        let soundName = "";
        let cardValue = outCards[0] % 0x10;
        cardValue = (0x0D < cardValue) ? (cardValue-14) : (cardValue-1);
        switch(cardType) {
            case cc.vv.gameData.CARDTYPE.ERROR_CARDS:
                break;
            case cc.vv.gameData.CARDTYPE.SINGLE_CARD:
                soundName = "singe" + cardValue;
                break;
            case cc.vv.gameData.CARDTYPE.DOUBLE_CARD:
                soundName = "double" + cardValue;
                break;
            case cc.vv.gameData.CARDTYPE.THREE_CARD:
                soundName = "sanzhang";
                break;
            case cc.vv.gameData.CARDTYPE.THREE_ONE_CARD:
                soundName = "sandaiyi";
                break;
            case cc.vv.gameData.CARDTYPE.THREE_TWO_CARD:
                soundName = "sandaier";
                break;
            case cc.vv.gameData.CARDTYPE.BOMB_ONE_CARD:
                soundName = "sidaiyi";
                break;
            case cc.vv.gameData.CARDTYPE.BOMB_TWO_CARD:
                soundName = "sidaier";
                break;
            case cc.vv.gameData.CARDTYPE.BOMB_THREE_CARD:
                soundName = "sidaisan";
                break;
            case cc.vv.gameData.CARDTYPE.CONNECT_CARD:
                soundName = "shunzi0";
                break;
            case cc.vv.gameData.CARDTYPE.COMPANY_CARD:
                soundName = "liandui";
                break;
            case cc.vv.gameData.CARDTYPE.AIRCRAFT:
                soundName = "feiji";
                break;
            case cc.vv.gameData.CARDTYPE.BOMB_CARD:
                soundName = "zhadan";
                break;
        }
        if(0 < soundName.length){
            let path = "card/"+this.getLanguage()+this.getSex(seat)+soundName;
            cc.vv.AudioManager.playEff("paodekuai/", path,true);
        }
    },

    onRcvChatNotify(data){
        data = data.detail;
        let chatInfo = data.chatInfo;
        if(chatInfo.type === 2){ // 表情
            let path = "chattext/"+this.getSex(chatInfo.seat)+"chat"+(chatInfo.index+1);
            cc.vv.AudioManager.playEff(this._soundPath, path,true);
        }
    },

    recvRoundOver(data){
        data = data.detail;
    },

    getSex(seat){
        let user = cc.vv.gameData.getUserInfo(seat);
        if(user){
            if(user.sex === 1) return "nan/";
            else  return "nv/";
        }
    },

    getLanguage(){
        return "normal/";
    },
});
