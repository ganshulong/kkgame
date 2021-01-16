
cc.Class({
    extends: cc.Component,

    properties: {
        _Layer:null,
    },

    start () {
        cc.vv.NetManager.registerMsg(MsgId.CLUB_GET_MANAGER_PERMISSIONS, this.onRcvClubGetManagerPermissions, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_SET_MANAGER_PERMISSIONS, this.onRcvClubSetManagerPermissions, this);
    },

    showLayer(uid){
        this.uid = uid;
        if(this._Layer === null){
            cc.loader.loadRes("common/prefab/club_setManagerPermissions",cc.Prefab,(err,prefab)=>{
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

        this.togglesList = [];
        let toggles = this._Layer.getChildByName("toggles");
        for (let i = 0; i < toggles.children.length; i++) {
            this.togglesList.push(toggles.children[i].getComponent(cc.Toggle));
        }

        let btn_confirm = this._Layer.getChildByName("btn_confirm");
        Global.btnClickEvent(btn_confirm,this.onClickConfirm,this);

        this.togglesIndex = {
            xgwf:0,
            scwf:1,
            jsyx:2,
            cjwf:3,
            jztz:4,
            dpcy:5,
            szpl:6,
            pljl:7,
        };
    },

    onClose(){
        this._Layer.active = false;
    },

    initShow(){
        for (let i = 0; i < this.togglesList.length; i++) {
            this.togglesList[i].isChecked = false;
        }

        var req = { 'c': MsgId.CLUB_GET_MANAGER_PERMISSIONS};
        req.clubid = cc.vv.UserManager.currClubId;
        req.adminUid = this.uid;
        cc.vv.NetManager.send(req);
    },

    onClickConfirm(){
        var req = { 'c': MsgId.CLUB_SET_MANAGER_PERMISSIONS};
        req.clubid = cc.vv.UserManager.currClubId;
        req.adminUid = this.uid;
        req.adminJurInfo = {};
        req.adminJurInfo.xgwf = this.togglesList[this.togglesIndex.xgwf].isChecked ? 1 : 0;
        req.adminJurInfo.scwf = this.togglesList[this.togglesIndex.scwf].isChecked ? 1 : 0;
        req.adminJurInfo.jsyx = this.togglesList[this.togglesIndex.jsyx].isChecked ? 1 : 0;
        req.adminJurInfo.cjwf = this.togglesList[this.togglesIndex.cjwf].isChecked ? 1 : 0;
        req.adminJurInfo.jztz = this.togglesList[this.togglesIndex.jztz].isChecked ? 1 : 0;
        req.adminJurInfo.dpcy = this.togglesList[this.togglesIndex.dpcy].isChecked ? 1 : 0;
        req.adminJurInfo.szpl = this.togglesList[this.togglesIndex.szpl].isChecked ? 1 : 0;
        req.adminJurInfo.pljl = this.togglesList[this.togglesIndex.pljl].isChecked ? 1 : 0;
        cc.vv.NetManager.send(req);
    },

    onRcvClubGetManagerPermissions(msg){
        if (200 == msg.code) {
            this.togglesList[this.togglesIndex.xgwf].isChecked = (1 == msg.adminJurInfo.xgwf);
            this.togglesList[this.togglesIndex.scwf].isChecked = (1 == msg.adminJurInfo.scwf);
            this.togglesList[this.togglesIndex.jsyx].isChecked = (1 == msg.adminJurInfo.jsyx);
            this.togglesList[this.togglesIndex.cjwf].isChecked = (1 == msg.adminJurInfo.cjwf);
            this.togglesList[this.togglesIndex.jztz].isChecked = (1 == msg.adminJurInfo.jztz);
            this.togglesList[this.togglesIndex.dpcy].isChecked = (1 == msg.adminJurInfo.dpcy);
            this.togglesList[this.togglesIndex.szpl].isChecked = (1 == msg.adminJurInfo.szpl);
            this.togglesList[this.togglesIndex.pljl].isChecked = (1 == msg.adminJurInfo.pljl);
        }
    },

    onRcvClubSetManagerPermissions(msg){
        if (200 == msg.code) {
            cc.vv.FloatTip.show("保存成功");
            this.onClose();
        }
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_GET_MANAGER_PERMISSIONS, this.onRcvClubGetManagerPermissions, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_SET_MANAGER_PERMISSIONS, this.onRcvClubSetManagerPermissions, this);
        if(this._Layer){
            cc.loader.releaseRes("common/prefab/club_setManagerPermissions",cc.Prefab);
        }
    },
    // update (dt) {},
});
