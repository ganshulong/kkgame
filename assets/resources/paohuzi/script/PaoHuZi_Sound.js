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
        _soundPath:"penghu/"
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //cc.vv.AudioManager.playBgm(this._soundPath, "music_bg_hhh", true);

        Global.registerEvent(EventId.MOPAI_NOTIFY,this.recvMoPaiNotify,this);
        Global.registerEvent(EventId.OUTCARD_NOTIFY,this.recvOutCardNotify,this);
        Global.registerEvent(EventId.CHI_NOTIFY,this.playOperate,this);
        Global.registerEvent(EventId.PAO_NOTIFY,this.playOperate,this);
        Global.registerEvent(EventId.LONG_NOTIFY,this.playOperate,this);
        Global.registerEvent(EventId.KAN_NOTIFY,this.recvKanNotify,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvHuNotify,this);
        Global.registerEvent(EventId.PENG_NOTIFY,this.recvPengNotify,this);
        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        // Global.registerEvent(EventId.SHOW_MENZI_SOUND,this.onRecvMenziSound,this);
        Global.registerEvent(EventId.CHAT_NOTIFY,this.onRcvChatNotify,this);

    },

    onRcvChatNotify(data){
        data = data.detail;
        let chatInfo = data.chatInfo;
        if(chatInfo.type === 2){ // 表情
            let path = "chattext/"+this.getSex(chatInfo.seat)+"chat"+(chatInfo.index+1);
            cc.vv.AudioManager.playEff(this._soundPath, path,true);
        }
    },

    // onRecvMenziSound(data){
    //     let type = data.detail;
    //     this.playOperateType(cc.vv.gameData.getMySeatIndex(),type);
    // },

    onRecvHandCard(data){
        data = data.detail;
        let seat = data.seat;
        if(seat === cc.vv.gameData.getMySeatIndex()){
            for(let j=0;j<data.menzi.length;++j){
                let typeData = data.menzi[j];
                this.playOperateType(seat,typeData.type);
            }
        }
    },

    // 操作
    playOperate(data){
        data = data.detail;
        let type = data.actionInfo.curaction.type;
        if(type == cc.vv.gameData.OPERATETYPE.CHI && 0 < data.chiInfo.luoData.length){
            type = cc.vv.gameData.OPERATETYPE.CHI_LUO;
        }
        let seat = data.actionInfo.curaction.seat;
        // if(seat === cc.vv.gameData.getMySeatIndex()){
            this.playOperateType(seat,type);
        // }
    },

    recvKanNotify(data){
        data = data.detail;
        let seat = data.actionInfo.curaction.seat;
        // if(seat === cc.vv.gameData.getMySeatIndex()){
            this.playOperateType(seat,data.kanType);
        // }
    },

    recvPengNotify(data){
        data = data.detail;
        let seat = data.actionInfo.curaction.seat;
        // if(seat === cc.vv.gameData.getMySeatIndex()){
            this.playOperateType(seat,data.pengType);
        // }
    },

    playOperateType(seat,type){
        let soundName = "";
        if(type === cc.vv.gameData.OPERATETYPE.PENG) soundName = "peng";
        else if(type === cc.vv.gameData.OPERATETYPE.KAN) soundName = "sao";
        else if(type === cc.vv.gameData.OPERATETYPE.CHI) soundName = "chi";
        else if(type === cc.vv.gameData.OPERATETYPE.CHI_LUO) soundName = "chiluo";
        else if(type === cc.vv.gameData.OPERATETYPE.PAO) soundName = "pao";
        else if(type === cc.vv.gameData.OPERATETYPE.LONG) soundName = "hu_tilong";
        else if(type === cc.vv.gameData.OPERATETYPE.HANDPAO) soundName = "pao";
        else if(type === cc.vv.gameData.OPERATETYPE.HANDLONG) soundName = "hu_tilong";
        // else if(type === cc.vv.gameData.OPERATETYPE.PENGSAN) soundName = "pengsanda";
        // else if(type === cc.vv.gameData.OPERATETYPE.PENGSI) soundName = "pengsiqing";
        // else if(type === cc.vv.gameData.OPERATETYPE.KANSAN) soundName = "saosanda";
        // else if(type === cc.vv.gameData.OPERATETYPE.KANSI) soundName = "saosiqing";

        if(soundName.length>0){
            let path = "effect/"+this.getLanguage()+this.getSex(seat)+soundName;
            cc.vv.AudioManager.playEff(this._soundPath, path,true);
        }
    },

    recvHuNotify(data){
        data = data.detail;
        if(data.hupaiType>0){
            let path = "effect/"+this.getLanguage()+this.getSex(data.seat)+"hu";
            if (2 == data.hupaiType) {
                path += "_tian";
            } else if (3 == data.hupaiType || 14 == data.hupaiType || 15 == data.hupaiType) {
                path += "_dihu";
            } else if (4 == data.hupaiType) {
                path += "_tilong";
            } else if (5 == data.hupaiType) {
                path += "_paohu";
            } else if (6 == data.hupaiType || 9 == data.hupaiType || 11 == data.hupaiType) {
                path += "_saohu";
            } else if (7 == data.hupaiType || 8 == data.hupaiType || 10 == data.hupaiType) {
                path += "_penghu";
            } else if (12 == data.hupaiType) {
                path += "_shuanglong";
            }
            cc.vv.AudioManager.playEff(this._soundPath, path,true);

            if(cc.vv.gameData.getMySeatIndex() === data.seat){
                cc.vv.AudioManager.playEff(this._soundPath, "win",true);
            }
            else{
                cc.vv.AudioManager.playEff(this._soundPath, "loss",true);
            }
        }
    },

    // 出牌
    recvOutCardNotify(data){
        data = data.detail;
        // if(data.actionInfo.curaction.source > 0 && data.actionInfo.curaction.seat === cc.vv.gameData.getMySeatIndex()){
        if(data.actionInfo.curaction.source > 0){
            this.playCardSound(data.actionInfo.curaction.card,data.actionInfo.curaction.seat);
        }
        if (0 < data.isBaoJin) {
            let self = this;
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(()=>{
                        let path = "effect/"+self.getLanguage()+self.getSex(data.seat)+"baojing";
                        cc.vv.AudioManager.playEff(self._soundPath, path, true);
                    })
                )
            )
        }
    },

    // 摸牌
    recvMoPaiNotify(data){
        data = data.detail;
        let seat = data.seat;
        // if(seat === cc.vv.gameData.getMySeatIndex()){
            this.playCardSound(data.card,data.seat);
        // }
    },

    getSex(seat){
        let user = cc.vv.gameData.getUserInfo(seat);
        if(user){
            if(user.sex === 1) return "nan/";
            else  return "nv/";
        }
    },

    getLanguage(){
        if(Global.language === 1) return "anxiang/"
        else return "normal/";
    },

    playCardSound(cardValue,seat){
        let value = cardValue%100;
        let valueSound = cardValue>200?(16+value):value;
        let soundName = "card/"+this.getLanguage()+this.getSex(seat)+valueSound;
        cc.vv.AudioManager.playEff(this._soundPath, soundName,true);

    }

    // update (dt) {},
});
