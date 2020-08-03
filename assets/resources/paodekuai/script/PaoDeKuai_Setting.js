
cc.Class({
    extends: cc.Component,

    properties: {
        
        _settingNode:null,
        _btn_music:null,
        _btn_effect:null,
        _musicValue:1,
        _effectValue:1,
        _language:0, //0普通话 1攸县话
    },

    start () {
        this._musicValue = cc.sys.localStorage.getItem("music");
        if(this._musicValue === null) this._musicValue = 1;

        this._effectValue = cc.sys.localStorage.getItem("effect");
        if(this._effectValue === null) this._effectValue = 1;

        Global.registerEvent(EventId.SHOW_SETTING,this.showSetting,this);

    },

    showSetting(){
        if(this._settingNode === null){
            cc.loader.loadRes("common/prefab/SettingLayer",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._settingNode = cc.instantiate(prefab);
                    this._settingNode.parent = this.node;
                    this._settingNode.zIndex = 4;

                    this._settingNode.width = this.node.width;
                    this._settingNode.height = this.node.height;

                    let btnClose = this._settingNode.getChildByName("btn_close");
                    Global.btnClickEvent(btnClose,this.onClose,this);

                    let btn_real_music = this._settingNode.getChildByName("btn_real_music");
                    let btn_effect = this._settingNode.getChildByName("btn_real_effect");

                    cc.find("language/toggle1",this._settingNode).getComponent(cc.Toggle).isChecked = Global.language == 0;
                    cc.find("language/toggle2",this._settingNode).getComponent(cc.Toggle).isChecked = Global.language == 1;

                    this._btn_music = this._settingNode.getChildByName("btn_music");
                    this._btn_effect = this._settingNode.getChildByName("btn_effect");
                    Global.btnClickEvent(btn_real_music,this.setMusic,this);
                    Global.btnClickEvent(btn_effect,this.setEffct,this);
                    this.showSettingAction();
                    this.setOperate(this._musicValue,this._btn_music);
                    this.setOperate(this._effectValue,this._btn_effect);
                }
            });
        }else{
            this.showSettingAction();
        }
    },

    // 设置音乐
    setMusic(){
        this._musicValue = this._musicValue==0?1:0;
        this.setOperate(this._musicValue,this._btn_music);
        cc.sys.localStorage.setItem("music",this._musicValue);
        cc.vv.AudioManager.setBgmVolume(this._musicValue);
    },

    setOperate(vol,btn){
        btn.x = vol==0?47:163;
    },

    // 设置音效
    setEffct(){
        this._effectValue = this._effectValue==0?1:0;
        this.setOperate(this._effectValue,this._btn_effect);
        cc.sys.localStorage.setItem("effect",this._effectValue);
        cc.vv.AudioManager.setEffVolume(this._effectValue);
    },

    onClose(){
        this._settingNode.active = false;
         if(cc.find("language/toggle1",this._settingNode).getComponent(cc.Toggle).isChecked){
             this._language = 0;
         }
         else{
             this._language = 1;
         }
        cc.sys.localStorage.setItem("language",this._language);
        Global.language = this._language;
    },

    showSettingAction(){
        this._settingNode.active = true;
        this._settingNode.scale = 0;
        this._settingNode.runAction(cc.scaleTo(0.2,1).easing(cc.easeBackOut()));
    },

    onDestroy(){
        if(this._settingNode){
            cc.loader.releaseRes("common/prefab/SettingLayer",cc.Prefab);
        }
    }
    // update (dt) {},
});
