
cc.Class({
    extends: cc.Component,

    properties: {
        _Layer:null,
    },

    showLayer(partneruid, setType){
        this.partneruid = partneruid;
        this.setType = setType;
        if(this._Layer === null){
            cc.loader.loadRes("common/prefab/club_setPartnerRatio",cc.Prefab,(err,prefab)=>{
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

        this.text_des = cc.find("input_uid/text_des", this._Layer).getComponent(cc.Label);

        this.input_uid_editBox = this._Layer.getChildByName("input_uid").getComponent(cc.EditBox);

        let btn_confirm = this._Layer.getChildByName("btn_confirm");
        Global.btnClickEvent(btn_confirm,this.onClickConfirm,this);
    },

    initShow(){
        this.text_des.string = (1 == this.setType) ? "设置该合伙人抽水百分比：" : "设置该合伙人游戏预警值：";

        this.input_uid_editBox.string = "";
    },

    onClose(){
        this._Layer.active = false;
    },

    onClickConfirm(){
        let uidInt = parseInt(this.input_uid_editBox.string);
        if (uidInt && 0 < uidInt) {
            if (1 == this.setType && 100 < uidInt) {
               cc.vv.FloatTip.show("输入比例最大100%"); 
               return;
            }
            var req = { 'c': MsgId.CLUB_SET_PARTNER_RATIO};
            req.clubid = cc.vv.UserManager.currClubId;
            req.partneruid = this.partneruid;
            req.water = uidInt;
            req.type = this.setType;
            cc.vv.NetManager.send(req);
            this.onClose();
        } else {
            cc.vv.FloatTip.show("输入比例无效");
        }
    },

    onDestroy(){
        if(this._Layer){
            cc.loader.releaseRes("common/prefab/club_setPartnerRatio",cc.Prefab);
        }
    },
    // update (dt) {},
});
