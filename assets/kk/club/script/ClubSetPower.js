
cc.Class({
    extends: cc.Component,

    properties: {
        _Layer:null,
    },

    showLayer(memberuid){
        this.memberuid = memberuid;
        if(this._Layer === null){
            cc.loader.loadRes("common/prefab/club_setPower",cc.Prefab,(err,prefab)=>{
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

        this.input_addPower_editBox = this._Layer.getChildByName("input_addPower").getComponent(cc.EditBox);

        let btn_confirmAdd = this._Layer.getChildByName("btn_confirmAdd");
        btn_confirmAdd.mul = 1;
        Global.btnClickEvent(btn_confirmAdd,this.onClickConfirm,this);

        this.input_deductionPower_editBox = this._Layer.getChildByName("input_deductionPower").getComponent(cc.EditBox);

        let btn_confirmDeduction = this._Layer.getChildByName("btn_confirmDeduction");
        btn_confirmDeduction.mul = -1;
        Global.btnClickEvent(btn_confirmDeduction,this.onClickConfirm,this);
    },

    initShow(){
        this.input_addPower_editBox.string = "";
        this.input_deductionPower_editBox.string = "";
    },

    onClose(){
        this._Layer.active = false;
    },

    onClickConfirm(event){
        let mul = parseInt(event.target.mul);
        let uidInt = 0;
        if (1 == mul) {
            uidInt = parseInt(this.input_addPower_editBox.string);
        } else {
            uidInt = parseInt(this.input_deductionPower_editBox.string);
        }
        if (uidInt) {
            var req = { 'c': MsgId.CLUB_SET_POWER};
            req.clubid = cc.vv.UserManager.currClubId;
            req.memberuid = this.memberuid;
            req.power = uidInt*mul;
            cc.vv.NetManager.send(req);
            this.onClose();
        } else {
            cc.vv.FloatTip.show("输入无效");
        }
    },

    onDestroy(){
        if(this._Layer){
            cc.loader.releaseRes("common/prefab/club_setPower",cc.Prefab);
        }
    },
    // update (dt) {},
});
