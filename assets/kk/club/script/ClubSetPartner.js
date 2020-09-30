
cc.Class({
    extends: cc.Component,

    properties: {

        _Layer:null,
    },

    showLayer(){
        if(this._Layer === null){
            cc.loader.loadRes("common/prefab/club_setPartner",cc.Prefab,(err,prefab)=>{
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

        this.input_uid_editBox = this._Layer.getChildByName("input_uid").getComponent(cc.EditBox);

        let btn_cancel = this._Layer.getChildByName("btn_cancel");
        btn_cancel.type = 2;
        Global.btnClickEvent(btn_cancel, this.onClickSetPartner, this);

        let btn_authorization = this._Layer.getChildByName("btn_authorization");
        btn_authorization.type = 1;
        Global.btnClickEvent(btn_authorization, this.onClickSetPartner, this);
    },

    initShow(){
        this.input_uid_editBox.string = "";
    },

    onClose(){
        this._Layer.active = false;
    },

    onClickSetPartner(event){
        let uidInt = parseInt(this.input_uid_editBox.string);
        if (uidInt) {
            var req = { 'c': MsgId.CLUB_SET_PARTNER};
            req.type = event.target.type;
            req.clubid = cc.vv.UserManager.currClubId;
            req.partneruid = uidInt;
            cc.vv.NetManager.send(req);
            this.onClose();
        } else {
            cc.vv.FloatTip.show("输入ID无效");
        }
    },

    onDestroy(){
        if(this._Layer){
            cc.loader.releaseRes("common/prefab/club_setPartner",cc.Prefab);
        }
    },
    // update (dt) {},
});
