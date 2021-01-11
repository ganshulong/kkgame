
cc.Class({
    extends: cc.Component,

    properties: {
        _Layer:null,
    },

    start () {
        cc.vv.NetManager.registerMsg(MsgId.GAME_CONTINUE_NOTIFY, this.onRcvGameContinueNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.GAME_CONTINUE_SELECT, this.onRcvSelect, this);
        cc.vv.NetManager.registerMsg(MsgId.GAME_CONTINUE_REFUSE_NOTIFY, this.onRcvRefuseNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.GAME_CONTINUE_AGREE_NOTIFY, this.onRcvAgreeNotify, this);

        let deskInfo = cc.vv.gameData.getDeskInfo();
        if (deskInfo.againInfo && deskInfo.againInfo.iStart) {
            for (let i = 0; i < deskInfo.againInfo.agreeUsers.length; i++) {
                let userData = deskInfo.againInfo.agreeUsers[i];
                if (userData.uid == cc.vv.UserManager.uid && (-1 != userData.isargee)) {
                    return;
                }
            }
            this.againInfo = deskInfo.againInfo;
            this.showLayer();
        }
    },

    onRcvGameContinueNotify(msg){
        if (200 == msg.code) {
            this.againInfo = msg.againInfo;
            this.showLayer();
            Global.dispatchEvent(EventId.GAME_CONTINUE_NOTIFY);
        }
    },

    onRcvSelect(msg){
    },

    onRcvRefuseNotify(msg){
        if (200 == msg.code && this._Layer && this._Layer.active) {
            if (msg.uid == cc.vv.UserManager.uid) {
                this.onClose();
            } else {
                for (let i = 0; i < 4; i++) {
                    let player = this._Layer.getChildByName("player"+i);
                    if (player.active && msg.uid == player.uid) {
                        this.setPlayerSelect(player, 2);
                    }
                }
            }
        }
    },

    onRcvAgreeNotify(msg){
        if (200 == msg.code && this._Layer && this._Layer.active) {
            if (msg.uid == cc.vv.UserManager.uid) {
                this.onClose();
            } else {
                for (let i = 0; i < 4; i++) {
                    let player = this._Layer.getChildByName("player"+i);
                    if (player.active && msg.uid == player.uid) {
                        this.setPlayerSelect(player, 1);
                    }
                }
            }
        }
    },

    showLayer(){
        if(this._Layer === null){
            cc.loader.loadRes("common/prefab/tip_gameContinue",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._Layer = cc.instantiate(prefab);
                    this._Layer.parent = this.node;
                    this._Layer.zIndex = 1;
                    // this._Layer.x = this.node.width/2 - this.node.x;
                    // this._Layer.y = this.node.height/2 - this.node.y;

                    this.initUI();
                    this.initShow();
                }
            })
        } else{
            this._Layer.active = true;
            this.initShow();
        }
    },

    initUI(){
        // let btnClose = this._Layer.getChildByName("btnClose");
        // Global.btnClickEvent(btnClose,this.onClose,this);

        let btn_refuse = this._Layer.getChildByName("btn_refuse");
        btn_refuse.type = 2;
        Global.btnClickEvent(btn_refuse,this.onClickSelect,this);

        let btn_continue = this._Layer.getChildByName("btn_continue");
        btn_continue.type = 1;
        Global.btnClickEvent(btn_continue,this.onClickSelect,this);
    },

    initShow(){
        let startPosX = -(this.againInfo.agreeUsers.length-1)/2 * 160;
        for (let i = 0; i < this.againInfo.agreeUsers.length; i++) {
            let userData = this.againInfo.agreeUsers[i];
            let player = this._Layer.getChildByName("player"+i);
            player.uid = userData.uid;
            player.x = startPosX + i * 160;
            let spr_head = cc.find("head/radio_mask/spr_head", player);
            Global.setHead(spr_head, userData.usericon);
            player.getChildByName("text_name").getComponent(cc.Label).string = userData.playername;
            this.setPlayerSelect(player, userData.isargee);
            player.active = true;
        }
        for (let i = this.againInfo.agreeUsers.length; i < 4; i++) {
            this._Layer.getChildByName("player"+i).active = false;
        }
        if (this.againInfo.againtimeoutIntervel) {
            let downCountTime = this.againInfo.againtimeoutIntervel;
            let text_downCount = this._Layer.getChildByName("text_downCount");
            text_downCount.getComponent(cc.Label).string = downCountTime;
            text_downCount.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.delayTime(1), 
                        cc.callFunc(()=>{
                            text_downCount.getComponent(cc.Label).string = --downCountTime;
                            if (0 == downCountTime) {
                                text_downCount.stopAllActions();
                            }
                        })
                    )
                )
            )
        }
    },

    setPlayerSelect(player, isargee){
        player.getChildByName("text_selecting").active = (-1 == isargee);
        player.getChildByName("text_refuse").active = (2 == isargee);
        player.getChildByName("text_continue").active = (1 == isargee);
    },

    onClose(){
        this._Layer.getChildByName("text_downCount").stopAllActions();
        this._Layer.active = false;
    },

    onClickSelect(event){
        var req = { 'c': MsgId.GAME_CONTINUE_SELECT};
        req.againType = parseInt(event.target.type);
        cc.vv.NetManager.send(req);
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_CONTINUE_NOTIFY, this.onRcvGameContinueNotify, this);
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_CONTINUE_SELECT, this.onRcvSelect, this);
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_CONTINUE_REFUSE_NOTIFY, this.onRcvRefuseNotify, this);
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_CONTINUE_AGREE_NOTIFY, this.onRcvAgreeNotify, this);
        if(this._Layer){
            cc.loader.releaseRes("common/prefab/tip_gameContinue",cc.Prefab);
        }
    },
    // update (dt) {},
});
