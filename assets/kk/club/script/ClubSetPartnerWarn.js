
cc.Class({
    extends: cc.Component,

    properties: {
        _Layer:null,
    },

    showLayer(userInfo){
        this.userInfo = userInfo;
        if(this._Layer === null){
            cc.loader.loadRes("common/prefab/club_setPartnerWarn",cc.Prefab,(err,prefab)=>{
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
        let btnClose = this._Layer.getChildByName("btnClose");
        Global.btnClickEvent(btnClose,this.onClose,this);

        this.input_warnTip_editBox = this._Layer.getChildByName("input_warnTip").getComponent(cc.EditBox);
        this.input_warn_editBox = this._Layer.getChildByName("input_warn").getComponent(cc.EditBox);

        let btn_confirm = this._Layer.getChildByName("btn_confirm");
        Global.btnClickEvent(btn_confirm,this.onClickConfirm,this);
    },

    initShow(){
        cc.find("warnOff/toggle0",this._Layer).getComponent(cc.Toggle).isChecked = (1 != this.userInfo.warnswich);
        cc.find("warnOff/toggle1",this._Layer).getComponent(cc.Toggle).isChecked = (1 == this.userInfo.warnswich);

        this.input_warnTip_editBox.string = this.userInfo.warnntyvalue;
        this.input_warn_editBox.string = this.userInfo.warnvalue;
    },

    onClose(){
        this._Layer.active = false;
    },

    onClickConfirm(){
        let warnswich = cc.find("warnOff/toggle1",this._Layer).getComponent(cc.Toggle).isChecked ? 1 : 0;
        let warnTipInt = parseInt(this.input_warnTip_editBox.string) || 0;
        let warnInt = parseInt(this.input_warn_editBox.string) || 0;
        if (0 <= warnTipInt && 0 <= warnInt) {
            if (warnswich && warnTipInt <= warnInt) {
                cc.vv.FloatTip.show("预警提示值必须大于预警值");
                return;
            }
            var req = { 'c': MsgId.CLUB_SET_PARTNER_RATIO};
            req.clubid = cc.vv.UserManager.currClubId;
            req.partneruid = this.userInfo.uid;
            req.warnntyvalue = warnTipInt;
            req.water = warnInt;
            req.warnswich = warnswich;
            req.type = 2;
            cc.vv.NetManager.send(req);
            this.onClose();
        } else {
            cc.vv.FloatTip.show("输入无效");
        }
    },

    onDestroy(){
        if(this._Layer){
            cc.loader.releaseRes("common/prefab/club_setPartnerWarn",cc.Prefab);
        }
    },
    // update (dt) {},
});
