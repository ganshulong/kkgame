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
        _lobbySetLayer:null,
    },

    start () {
        Global.registerEvent(EventId.BIND_PHONE,this.onRcvBindPhone,this);
    },

    showLobbySet(){
        if(this._lobbySetLayer === null){
            cc.loader.loadRes("common/prefab/lobby_set",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._lobbySetLayer = cc.instantiate(prefab);
                    // this._lobbySetLayer.scaleX = this.node.width / this._lobbySetLayer.width;
                    // this._lobbySetLayer.scaleY = this.node.height / this._lobbySetLayer.height;
                    this._lobbySetLayer.parent = this.node;
                    this._lobbySetLayer.zIndex = 1;
                    this._lobbySetLayer.x = this.node.width/2 - this.node.x;
                    this._lobbySetLayer.y = this.node.height/2 - this.node.y;

                    this.initUI();
                    this.initShow();
                }
            })
        }
        else{
            this._lobbySetLayer.active = true;
            this.initShow();
        }
    },

    initUI(){
        let btn_closeSet = this._lobbySetLayer.getChildByName("btn_closeSet");
        Global.btnClickEvent(btn_closeSet,this.onClose,this);

        let btn_bind = cc.find("phone_bg/btn_bind",this._lobbySetLayer);
        Global.btnClickEvent(btn_bind,this.onClickBindPhone,this);

        let btn_switch = this._lobbySetLayer.getChildByName("btn_switch");
        Global.btnClickEvent(btn_switch,this.onClickSwitch,this);

        let btn_quitGame = this._lobbySetLayer.getChildByName("btn_quitGame");
        Global.btnClickEvent(btn_quitGame,this.onClickQuitGame,this);

        this.slider_volum = this._lobbySetLayer.getChildByName("slider_volum");
        this.slider_volum.on('slide', this.onSliderVolum, this);

        this.progressBar_volum = this.slider_volum.getChildByName("progressBar_volum");
        
        let btn_effect = this._lobbySetLayer.getChildByName("btn_effect");
        Global.btnClickEvent(btn_effect,this.setEffct,this);
        this.btn_effect_mask = this._lobbySetLayer.getChildByName("btn_effect_mask");

        let btn_music = this._lobbySetLayer.getChildByName("btn_music");
        Global.btnClickEvent(btn_music,this.setMusic,this);
        this.btn_music_mask = this._lobbySetLayer.getChildByName("btn_music_mask");

        let btn_help = this._lobbySetLayer.getChildByName("btn_help");
        Global.btnClickEvent(btn_help,this.onClickHelp,this);

        let btn_protol = this._lobbySetLayer.getChildByName("btn_protol");
        Global.btnClickEvent(btn_protol,this.onClickProtol,this);

        let btn_clean = this._lobbySetLayer.getChildByName("btn_clean");
        Global.btnClickEvent(btn_clean,this.onClickClean,this);

        this.panel_bind_phone = this._lobbySetLayer.getChildByName("panel_bind_phone");

        let btn_close = cc.find("bg_bind_phone/btn_close",this.panel_bind_phone);
        Global.btnClickEvent(btn_close,this.onClickBindPhone,this);

        this.input_phoneNumStr = cc.find("bg_bind_phone/input_phoneNum",this.panel_bind_phone).getComponent(cc.EditBox);
        this.input_codeStr = cc.find("bg_bind_phone/input_code",this.panel_bind_phone).getComponent(cc.EditBox);
        
        this.btn_getCode = cc.find("bg_bind_phone/btn_getCode",this.panel_bind_phone);
        Global.btnClickEvent(this.btn_getCode,this.onClickGetCode,this);

        this.spr_countDown = this.btn_getCode.getChildByName("spr_countDown");
        this.number_countDown = this.spr_countDown.getChildByName("number_countDown").getComponent(cc.Label);

        let btn_confirm = cc.find("bg_bind_phone/btn_confirm",this.panel_bind_phone);
        Global.btnClickEvent(btn_confirm,this.onClickConfirm,this);
    },

    initShow(){
        let node_userinfo = this._lobbySetLayer.getChildByName("node_userinfo");
        let spr_head = cc.find("UserHead/radio_mask/spr_head",node_userinfo);
        Global.setHead(spr_head,cc.vv.UserManager.userIcon);
        node_userinfo.getChildByName("text_name").getComponent(cc.Label).string = cc.vv.UserManager.nickName;
        node_userinfo.getChildByName("text_id").getComponent(cc.Label).string = "ID: " + cc.vv.UserManager.uid;
        cc.find("phone_bg/text_num",this._lobbySetLayer).getComponent(cc.Label).string = cc.vv.UserManager.mobile;
        cc.find("phone_bg/btn_bind",this._lobbySetLayer).active = (!cc.vv.UserManager.mobile);

        this._audioVolue = Number(cc.sys.localStorage.getItem("_audioVolue"));
        if(null == this._audioVolue) this._audioVolue = 1;
        this.slider_volum.getComponent(cc.Slider).progress = this._audioVolue;
        this.progressBar_volum.getComponent(cc.ProgressBar).progress = this._audioVolue;

        this._effectIsOpen = parseInt(cc.sys.localStorage.getItem("_effectIsOpen"));
        if(null == this._effectIsOpen) this._effectIsOpen = 1;
        this.setOperate(this._effectIsOpen,this.btn_effect_mask);
        cc.vv.AudioManager.setEffVolume(this._effectIsOpen ? this._audioVolue : 0);

        this._musicIsOpen = parseInt(cc.sys.localStorage.getItem("_musicIsOpen"));
        if(null == this._musicIsOpen) this._musicIsOpen = 1;
        this.setOperate(this._musicIsOpen,this.btn_music_mask);
        cc.vv.AudioManager.setBgmVolume(this._musicIsOpen ? this._audioVolue : 0);

        this.panel_bind_phone.active = false;
    },

    onClose(){
        this._lobbySetLayer.active = false;
    },

    onClickBindPhone(){
        this.panel_bind_phone.active = !this.panel_bind_phone.active;
        if (this.panel_bind_phone.active) {
            this.input_phoneNumStr.string = "";
            this.input_codeStr.string = "";
            this.btn_getCode.getComponent(cc.Button).interactable = true;
            this.spr_countDown.active = false;
            this.number_countDown.string = "";
        }
    },

    onClickGetCode(){
        let phoneNumStr = this.input_phoneNumStr.string;
        let phoneNum = parseInt(phoneNumStr);
        if (11 == phoneNumStr.length && phoneNum) {
            var req = { 'c': MsgId.GER_PHONE_CODE};
            req.mobile = phoneNum;
            cc.vv.NetManager.send(req);
            this.btn_getCode.getComponent(cc.Button).interactable = false;
            this.spr_countDown.active = true;
            let countDown = 90;
            this.number_countDown.string = countDown;
            let that = this;
            that.btn_getCode.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.delayTime(1), 
                        cc.callFunc(()=>{
                            that.number_countDown.string = --countDown;
                            if (0 == countDown) {
                                that.btn_getCode.getComponent(cc.Button).interactable = true;
                                that.spr_countDown.active = false;
                                that.btn_getCode.stopAllActions();
                            }
                        })
                    )
                )
            )
        } else {
            cc.vv.FloatTip.show("手机号输入错误");
        }
    },

    onClickConfirm(){
        let phoneNumStr = this.input_phoneNumStr.string;
        let phoneNum = parseInt(phoneNumStr);
        let codeStr = this.input_codeStr.string;
        if (11 == phoneNumStr.length && phoneNum && 6 == codeStr.length) {
            var req = { 'c': MsgId.BIND_PHONE};
            req.mobile = phoneNum;
            req.code = codeStr;
            cc.vv.NetManager.send(req);
        }
    },

    onRcvBindPhone(msg){
        if(msg.code === 200){
            this.onClose();
        }
    },

    onClickSwitch(){
        cc.vv.NetManager.send({c:MsgId.LOGIN_OUT});
        cc.vv.NetManager.close();
        Global.noAutoLogin = true;
        cc.vv.SceneMgr.enterScene("login");
    },

    onClickQuitGame(){
        let lan = cc.vv.Language.request_quit;
        let sureCall = function () {
            cc.game.end();
        }
        let cancelCall = function () {
        }
        cc.vv.AlertView.show(lan, sureCall, cancelCall)
    },

    onSliderVolum(sliderEvent){
        this._audioVolue = Math.floor(sliderEvent.detail.progress * 100) / 100;
        this.slider_volum.getComponent(cc.Slider).progress = this._audioVolue;
        this.progressBar_volum.getComponent(cc.ProgressBar).progress = this._audioVolue;
        cc.sys.localStorage.setItem("_audioVolue",this._audioVolue);
        if (this._effectIsOpen) {
            cc.vv.AudioManager.setEffVolume(this._audioVolue);
        }
        if (this._musicIsOpen) {
            cc.vv.AudioManager.setBgmVolume(this._audioVolue);
        }
    },

    // 设置音效
    setEffct(){
        this._effectIsOpen = this._effectIsOpen == 0 ? 1 : 0;
        this.setOperate(this._effectIsOpen,this.btn_effect_mask);
        cc.sys.localStorage.setItem("_effectIsOpen",this._effectIsOpen);
        cc.vv.AudioManager.setEffVolume(this._effectIsOpen ? this._audioVolue : 0);
    },

    // 设置音乐
    setMusic(){
        this._musicIsOpen = this._musicIsOpen == 0 ? 1 : 0;
        this.setOperate(this._musicIsOpen,this.btn_music_mask);
        cc.sys.localStorage.setItem("_musicIsOpen",this._musicIsOpen);
        cc.vv.AudioManager.setBgmVolume(this._musicIsOpen ? this._audioVolue : 0);
    },

    setOperate(vol,node){
        node.x = vol== 0 ? 55 : 140;
    },

    onClickHelp(){
        
    },

    onClickProtol(){
        
    },

    onClickClean(){
        
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.BIND_PHONE, this.onRcvBindPhone,false,this);
        if(this._lobbySetLayer){
            cc.loader.releaseRes("common/prefab/lobby_set",cc.Prefab);
        }
    },
});
