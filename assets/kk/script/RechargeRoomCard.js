
cc.Class({
    extends: cc.Component,

    properties: {

        _Layer:null,
    },

    showLayer(){
        if(this._Layer === null){
            cc.loader.loadRes("common/prefab/Recharge_RoomCard",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._Layer = cc.instantiate(prefab);
                    this._Layer.parent = this.node;
                    this._Layer.zIndex = 1;
                    this._Layer.x = this.node.width/2 - this.node.x;
                    this._Layer.y = this.node.height/2 - this.node.y;

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
        this.input_num_editBox = this._Layer.getChildByName("input_num").getComponent(cc.EditBox);

        let btn_recharge = this._Layer.getChildByName("btn_recharge");
        Global.btnClickEvent(btn_recharge,this.onClickRrecharge,this);
    },

    initShow(){
        this.input_uid_editBox.string = "";
        this.input_num_editBox.string = "";
    },

    onClose(){
        this._Layer.active = false;
    },

    onClickRrecharge(){
        let uidInt = parseInt(this.input_uid_editBox.string);
        let numInt = parseInt(this.input_num_editBox.string);
        if (uidInt && numInt) {
            var req = { 'c': MsgId.RECHARGE_ROOM_CARD};
            req.rechargeUid = uidInt;
            req.rechargeNum = numInt;
            cc.vv.NetManager.send(req);
        } else {
            cc.vv.FloatTip.show("输入的ID或数量无效");
        }
    },

    onDestroy(){
        if(this._Layer){
            cc.loader.releaseRes("common/prefab/Recharge_RoomCard",cc.Prefab);
        }
    },
    // update (dt) {},
});
