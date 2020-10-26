
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
        Global.registerEvent(EventId.GUO_NOTIFY,this.onRcvGuoCardNotify,this);
    },

    onRcvOutCardNotify(data){
        data = data.detail;
        let outCards = data.actionInfo.curaction.outCards;
        let curaction = data.actionInfo.curaction;
        if (0 < curaction.outCards.length) {
            cc.vv.AudioManager.playEff("paodekuai/", "cardout",true);
            this.playCardSound(curaction.cardType, curaction.outCards, curaction.seat);
        }
    },

    onRcvGuoCardNotify(data){
        data = data.detail;
        let path = "card/"+this.getLanguage()+this.getSex(data.seat)+ "pass" + Global.random(0,3);
        cc.vv.AudioManager.playEff("paodekuai/", path,true);
    },

    playCardSound(cardType, outCards, seat){
        let soundName = "";
        let cardValue = outCards[0] % 0x10;
        cardValue = (0x0D < cardValue) ? (cardValue-14) : (cardValue-1);
        switch(cardType) {
            case cc.vv.gameData.CARDTYPE.ERROR_CARDS:
                break;
            case cc.vv.gameData.CARDTYPE.SMALL_CARD:
            case cc.vv.gameData.CARDTYPE.BOMB_CARD:
                soundName = "zhangshu_" + outCards.length;
                break;
            case cc.vv.gameData.CARDTYPE.TONGHUA_CARD:
                soundName = "tonghua_" + outCards.length;
                break;
        }
        if(0 < soundName.length){
            let path = "card/"+soundName;
            cc.vv.AudioManager.playEff("tonghua/", path,true);
        }
    },

    onRcvChatNotify(data){
        data = data.detail;
        let chatInfo = data.chatInfo;
        if(chatInfo.type === 2){ // 表情
            let path = "chat/" + this.getSex(chatInfo.seat) + "chat_" + (data.chatInfo.index + 1);
            cc.vv.AudioManager.playEff("paodekuai/", path, true);
        }
    },

    recvRoundOver(data){
        data = data.detail;
        for(let i=0;i<data.users.length;++i){
            if(data.users[i].uid === cc.vv.UserManager.uid) {  
                if (0 <= data.users[i].roundScore) {
                    cc.vv.AudioManager.playEff("paodekuai/", "complete",true);
                } else {
                    cc.vv.AudioManager.playEff("paodekuai/", "failed",true);
                };
                break;
            }
        }
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
