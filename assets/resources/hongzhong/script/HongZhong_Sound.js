
cc.Class({
    extends: cc.Component,

    properties: {
    
        _soundPath:"penghu/"
    },

    start () {
        Global.registerEvent(EventId.CHAT_NOTIFY,this.onRcvChatNotify,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOverNotify,this);
        Global.registerEvent(EventId.OUTCARD_NOTIFY,this.recvOutCardNotify,this);
        Global.registerEvent(EventId.GANG_NOTIFY,this.recvGangNotify,this);
        Global.registerEvent(EventId.PENG_NOTIFY,this.recvPengNotify,this);
        Global.registerEvent(EventId.GUO_NOTIFY,this.recvGuoNotify,this);
    },

    onRcvChatNotify(data){
        data = data.detail;
        let chatInfo = data.chatInfo;
        if(chatInfo.type === 2){ // 表情
            let path = "chattext/"+this.getSex(chatInfo.seat)+"chat"+(chatInfo.index+1);
            cc.vv.AudioManager.playEff(this._soundPath, path,true);
        }
    },

    recvRoundOverNotify(data){
        data = data.detail;
        if(data.hupaiType > 0){
            this.playCardSound("hu", data.seat);
            if(cc.vv.gameData.getMySeatIndex() === data.seat){
                cc.vv.AudioManager.playEff("hongzhong/", "sound_win",true);
            } else{
                cc.vv.AudioManager.playEff("hongzhong/", "sound_lost",true);
            }
        }
    },

    recvOutCardNotify(data){
        data = data.detail;
        let card = data.actionInfo.curaction.card;
        let soundStr = parseInt(card / 10) + "_" + (card % 10)
        this.playCardSound(soundStr, data.actionInfo.curaction.seat);
    },

    recvGangNotify(data){
        data = data.detail;
        this.playCardSound("gang", data.actionInfo.curaction.seat);
    },

    recvPengNotify(data){
        data = data.detail;
        this.playCardSound("peng", data.actionInfo.curaction.seat);
    },

    recvGuoNotify(data){

    },

    getSex(seat){
        let user = cc.vv.gameData.getUserInfo(seat);
        if(user){
            if(user.sex === 1) return "nan/";
            else  return "nv/";
        }
    },

    getLanguage(){
        if(Global.language === 1) return "changsha/"
        else return "normal/";
    },

    playCardSound(soundStr,seat){
        let soundName = "card/"+this.getLanguage()+this.getSex(seat)+soundStr;
        cc.vv.AudioManager.playEff("hongzhong/", soundName,true);
    }

    // update (dt) {},
});
