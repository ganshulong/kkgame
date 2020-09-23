
cc.Class({
    extends: cc.Component,

    properties: {
        _settingNode:null,
    },

    start () {
        Global.registerEvent(EventId.SHOW_SETTING,this.showSetting,this);
    },

    showSetting(){
        if(this._settingNode === null){
            cc.loader.loadRes("common/prefab/game_set",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._settingNode = cc.instantiate(prefab);
                    this._settingNode.parent = this.node;
                    this._settingNode.zIndex = 4;

                    this._settingNode.width = this.node.width;
                    this._settingNode.height = this.node.height;

                    let btnClose = this._settingNode.getChildByName("btn_close");
                    Global.btnClickEvent(btnClose,this.onClose,this);

                    this.btn_music = this._settingNode.getChildByName("btn_music");
                    Global.btnClickEvent(this.btn_music,this.setMusic,this);
                    this.btn_music_mask = this._settingNode.getChildByName("btn_music_mask");

                    this.btn_effect = this._settingNode.getChildByName("btn_effect");
                    Global.btnClickEvent(this.btn_effect,this.setEffct,this);
                    this.btn_effect_mask = this._settingNode.getChildByName("btn_effect_mask");

                    cc.find("language/toggle1",this._settingNode).getComponent(cc.Toggle).isChecked = Global.language == 0;
                    cc.find("language/toggle2",this._settingNode).getComponent(cc.Toggle).isChecked = Global.language == 1;

                    this.showSettingAction();
                }
            });
        }else{
            this.showSettingAction();
        }
    },

    // 设置音乐
    setMusic(){
        this._musicIsOpen = this._musicIsOpen == 0 ? 1 : 0;
        this.setOperate(this._musicIsOpen,this.btn_music_mask);
        cc.sys.localStorage.setItem("_musicIsOpen",this._musicIsOpen);
        cc.vv.AudioManager.setBgmVolume(this._musicIsOpen ? this._audioVolue : 0);
    },

    // 设置音效
    setEffct(){
        this._effectIsOpen = this._effectIsOpen == 0 ? 1 : 0;
        this.setOperate(this._effectIsOpen,this.btn_effect_mask);
        cc.sys.localStorage.setItem("_effectIsOpen",this._effectIsOpen);
        cc.vv.AudioManager.setEffVolume(this._effectIsOpen ? this._audioVolue : 0);
    },

    setOperate(vol,btn){
        btn.x = vol == 0 ? 63 : 178;
    },

    onClose(){
        this._settingNode.active = false;
        let isChecked = cc.find("language/toggle1",this._settingNode).getComponent(cc.Toggle).isChecked;
        Global.language = isChecked ? 0 : 1;
        cc.sys.localStorage.setItem("language",Global.language);
    },

    showSettingAction(){
        this._audioVolue = Number(cc.sys.localStorage.getItem("_audioVolue"));

        this._effectIsOpen = parseInt(cc.sys.localStorage.getItem("_effectIsOpen"));
        this.setOperate(this._effectIsOpen,this.btn_effect_mask);

        this._musicIsOpen = parseInt(cc.sys.localStorage.getItem("_musicIsOpen"));
        this.setOperate(this._musicIsOpen,this.btn_music_mask);

        this._settingNode.active = true;
        this._settingNode.scale = 0;
        this._settingNode.runAction(cc.scaleTo(0.2,1).easing(cc.easeBackOut()));
    },

    onDestroy(){
        if(this._settingNode){
            cc.loader.releaseRes("common/prefab/game_set",cc.Prefab);
        }
    }
});
