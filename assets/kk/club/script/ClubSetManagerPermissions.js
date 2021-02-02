
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
            xgwf:0,         // 修改玩法
            scwf:1,         // 删除玩法
            jsyx:2,         // 解散游戏
            cjwf:3,         // 创建玩法

            jztz:4,         // 禁止同桌
            dpcy:5,         // 调配成员
            szpl:6,         // 设置疲劳
            jsqyq:7,        // 解散亲友圈

            djqyq:8,        // 冻结亲友圈
            bjqh:9,         // 包间模式切换
            jzyx:10,        // 禁止玩家游戏
            hfyx:11,        // 恢复玩家游戏

            sccy:12,        // 删除成员
            szhhren:13,     // 设置合伙人
            szgg:14,        // 设置公告
            szkff:15,        // 设置负分

            szyjz:16,        // 设置预警值
            szsxz:17,        // 设置水线值
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
        req.adminJurInfo.jsqyq = this.togglesList[this.togglesIndex.jsqyq].isChecked ? 1 : 0;

        req.adminJurInfo.djqyq = this.togglesList[this.togglesIndex.djqyq].isChecked ? 1 : 0;
        req.adminJurInfo.bjqh = this.togglesList[this.togglesIndex.bjqh].isChecked ? 1 : 0;
        req.adminJurInfo.jzyx = this.togglesList[this.togglesIndex.jzyx].isChecked ? 1 : 0;
        req.adminJurInfo.hfyx = this.togglesList[this.togglesIndex.hfyx].isChecked ? 1 : 0;

        req.adminJurInfo.sccy = this.togglesList[this.togglesIndex.sccy].isChecked ? 1 : 0;
        req.adminJurInfo.szhhren = this.togglesList[this.togglesIndex.szhhren].isChecked ? 1 : 0;
        req.adminJurInfo.szgg = this.togglesList[this.togglesIndex.szgg].isChecked ? 1 : 0;
        req.adminJurInfo.szkff = this.togglesList[this.togglesIndex.szkff].isChecked ? 1 : 0;

        req.adminJurInfo.szyjz = this.togglesList[this.togglesIndex.szyjz].isChecked ? 1 : 0;
        req.adminJurInfo.szsxz = this.togglesList[this.togglesIndex.szsxz].isChecked ? 1 : 0;

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
            this.togglesList[this.togglesIndex.jsqyq].isChecked = (1 == msg.adminJurInfo.jsqyq);
            
            this.togglesList[this.togglesIndex.djqyq].isChecked = (1 == msg.adminJurInfo.djqyq);
            this.togglesList[this.togglesIndex.bjqh].isChecked = (1 == msg.adminJurInfo.bjqh);
            this.togglesList[this.togglesIndex.jzyx].isChecked = (1 == msg.adminJurInfo.jzyx);
            this.togglesList[this.togglesIndex.hfyx].isChecked = (1 == msg.adminJurInfo.hfyx);
            
            this.togglesList[this.togglesIndex.sccy].isChecked = (1 == msg.adminJurInfo.sccy);
            this.togglesList[this.togglesIndex.szhhren].isChecked = (1 == msg.adminJurInfo.szhhren);
            this.togglesList[this.togglesIndex.szgg].isChecked = (1 == msg.adminJurInfo.szgg);
            this.togglesList[this.togglesIndex.szkff].isChecked = (1 == msg.adminJurInfo.szkff);

            this.togglesList[this.togglesIndex.szyjz].isChecked = (1 == msg.adminJurInfo.szyjz);
            this.togglesList[this.togglesIndex.szsxz].isChecked = (1 == msg.adminJurInfo.szsxz);
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
