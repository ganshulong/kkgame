
cc.Class({
    extends: cc.Component,

    properties: {
    },

    start () {
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);
        Global.registerEvent(EventId.CHAT_NOTIFY,this.onRcvChatNotify,this);
        Global.registerEvent(EventId.OUT_CARD_NOTIFY,this.onRcvOutCardNotify,this);

        Global.registerEvent(EventId.ERQIGUI_JIAO_SCORE_NOTIFY,this.onRcvJiaoScoreNotify,this);
        Global.registerEvent(EventId.ERQIGUI_SELECT_COLOR_NOTIFY,this.onRcvSelectColorNotify,this);
    },

    onRcvJiaoScoreNotify(data){
        // 资源缺失 只有不叫
        // data = data.detail;
        // let seat = data.actionInfo.curaction.seat;
        // let curJiaoFen = data.actionInfo.curaction.jiaoFen.curJiaoFen;
        // let path = this.getLanguage() + this.getSex(seat) + "callbanker/" + (curJiaoFen + "fen");
        // cc.vv.AudioManager.playEff("erqigui/", path,true);
    },

    onRcvSelectColorNotify(data){
        data = data.detail;
        let seat = data.actionInfo.curaction.seat;
        let jiaoZhu = data.jiaoZhu;
        if (5 > jiaoZhu) {
            let path = this.getLanguage() + this.getSex(seat) + "choosecolor/" + jiaoZhu;
            cc.vv.AudioManager.playEff("erqigui/", path,true);
        }
    },

    onRcvOutCardNotify(data){
        data = data.detail;
        let outCards = data.actionInfo.curaction.outCards;
        let curaction = data.actionInfo.curaction;
        if (0 < curaction.outCards.length) {
            cc.vv.AudioManager.playEff("paodekuai/", "cardout",true);
            this.playCardSound(data.audioType, curaction.outCards, curaction.seat);
        }
    },

    playCardSound(audioType, outCards, seat){
        let soundName = "";
        soundName += this.getLanguage();
        soundName += this.getSex(seat);
        if (0 < audioType) {
            soundName += "cards/";
            soundName += ["","type_bile","type_gaibi","type_biele","type_tractor","type_diaozhu","type_shuaipai",][audioType];
        } else {
            soundName += (1 == outCards.length) ? "card1/" : "card2/";
            let sex = cc.vv.gameData.getUserInfo(seat).sex;
            soundName += (1 == sex) ? "m_card_" : "f_card_";
            soundName += (1 == outCards.length) ? "dan_" : "dui_";
            soundName += ["","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d"][(outCards[0]%0x10)];
        }
        if(0 < soundName.length){
            cc.vv.AudioManager.playEff("erqigui/", soundName,true);
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
                    cc.vv.AudioManager.playEff("erqigui/", "win",true);
                } else {
                    cc.vv.AudioManager.playEff("erqigui/", "lose",true);
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
        return "mandarin/";
    },
});
