
cc.Class({
    extends: cc.Component,

    properties: {
        _Layer:null,
    },

    showLayer(userInfo){
        this.userInfo = userInfo;
        if(this._Layer === null){
            cc.loader.loadRes("common/prefab/club_allocateMember",cc.Prefab,(err,prefab)=>{
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

        let btn_confirm = this._Layer.getChildByName("btn_confirm");
        Global.btnClickEvent(btn_confirm,this.onClickConfirm,this);
    },

    initShow(){
        let spr_head = cc.find("UserHead/radio_mask/spr_head", this._Layer);
        Global.setHead(spr_head, this.userInfo.usericon);
        cc.find("UserHead/text_name", this._Layer).getComponent(cc.Label).string = this.userInfo.playername;
        cc.find("UserHead/text_ID", this._Layer).getComponent(cc.Label).string = "ID: "+this.userInfo.uid;

        this.input_uid_editBox.string = "";
    },

    onClose(){
        this._Layer.active = false;
    },

    onClickConfirm(event){
        let input_uid = this.input_uid_editBox.string;
        if (input_uid && 6 == input_uid.length) {
            var req = { 'c': MsgId.CLUB_ALLOCATE_MEMBER};
            req.clubid = cc.vv.UserManager.currClubId;
            req.memberuid = this.userInfo.uid;
            req.hehuouid = input_uid;
            cc.vv.NetManager.send(req);
            this.onClose();
        } else {
            cc.vv.FloatTip.show("输入无效");
        }
    },

    onDestroy(){
        if(this._Layer){
            cc.loader.releaseRes("common/prefab/club_allocateMember",cc.Prefab);
        }
    },
    // update (dt) {},
});
