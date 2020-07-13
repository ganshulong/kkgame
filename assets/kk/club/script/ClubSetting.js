// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        _Layer:null,
        _clubInfo:null,
    },

    start () {
    },

    showClubSetting(){
        if(this._Layer === null){
            cc.loader.loadRes("common/prefab/club_setting",cc.Prefab,(err,prefab)=>{
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
        }
        else{
            this._Layer.active = true;
            this.initShow();
        }
    },

    initUI(){
        let btn_close = cc.find("bg_set/btn_close",this._Layer);
        Global.btnClickEvent(btn_close,this.onClose,this);

        let bg_content = cc.find("bg_set/bg_content",this._Layer);
        this.ItemArr = [];
        for (let i = 0; i < 4; i++) {
            this.ItemArr.push(bg_content.getChildByName("bg_Item"+i));
            let btn = this.ItemArr[i].getChildByName("btn_"+i);
            btn.index = i;
            Global.btnClickEvent(btn,this.onClickItemConfirm,this);
        }


        this._itemEnum = {
            Exit:0,
            Dismiss:1,
            Freeze:2,
            DismissFre:3,
        },

        this.panel_confirmTips = cc.find("bg_set/panel_confirmTips",this._Layer);

        let btn_closeTips = cc.find("confirmTips_bg/btn_closeTips",this.panel_confirmTips);
        Global.btnClickEvent(btn_closeTips,this.onCloseTips,this);

        let btn_confirm = cc.find("confirmTips_bg/btn_confirm",this.panel_confirmTips);
        Global.btnClickEvent(btn_confirm,this.onClickConfirm,this);
    },

    initShow(){
        this._clubInfo = cc.vv.UserManager.getCurClubInfo();
        this.ItemArr[this._itemEnum.Exit].active = (this._clubInfo.createUid != cc.vv.UserManager.uid);
        this.ItemArr[this._itemEnum.Dismiss].active = (this._clubInfo.createUid == cc.vv.UserManager.uid);
        this.ItemArr[this._itemEnum.Freeze].active = (this._clubInfo.createUid == cc.vv.UserManager.uid && this._clubInfo.state);  //state:1正常，0冻结
        this.ItemArr[this._itemEnum.DismissFre].active = (this._clubInfo.createUid == cc.vv.UserManager.uid && !this._clubInfo.state);

        this.panel_confirmTips.active = false;
        this.clickItemIndex = -1;
    },

    onClose(){
        this._Layer.active = false;
    },

    onClickItemConfirm(event){
        this.clickItemIndex = event.target.index;
        this.showConfirmTips();
    },

    showConfirmTips(){
        this.panel_confirmTips.active = true;
        let confirmTips_bg = this.panel_confirmTips.getChildByName("confirmTips_bg");
        for (var i = 0; i < 4; i++) {
            confirmTips_bg.getChildByName("spr_title"+i).active = (i == this.clickItemIndex);
        }
        let tipsStrArr = [];
        tipsStrArr[0] = "确定退出以下亲友圈？";
        tipsStrArr[1] = "确定解散以下亲友圈？";
        tipsStrArr[2] = "确定冻结以下亲友圈？";
        tipsStrArr[3] = "确定解冻以下亲友圈？";
        confirmTips_bg.getChildByName("text_tip").getComponent(cc.Label).string = tipsStrArr[this.clickItemIndex];
        confirmTips_bg.getChildByName("text_clubName").getComponent(cc.Label).string = "亲友圈名称：" + this._clubInfo.name;
        confirmTips_bg.getChildByName("text_clubID").getComponent(cc.Label).string = "亲友圈ID：" + this._clubInfo.clubid;
    },

    onCloseTips(){
        this.panel_confirmTips.active = false;
    },

    onClickConfirm(){
        let msgIDArr = [MsgId.EXIT_CLUB,MsgId.DISMISS_CLUB,MsgId.FREEZE_CLUB,MsgId.FREEZE_CLUB];
        if (-1 < this.clickItemIndex) {
            var req = { 'c': msgIDArr[this.clickItemIndex]};
            if (2 == this.clickItemIndex) {
                req.state = 0;
            } else if (3 == this.clickItemIndex) {
                req.state = 1;
            }
            req.clubid = cc.vv.UserManager.currClubId;
            cc.vv.NetManager.send(req);
        }
    },

    onDestroy(){
        // cc.vv.NetManager.unregisterMsg(MsgId.FREEZE_CLUB, this.onRcvFreezeClubNotify, false, this);
        // cc.vv.NetManager.unregisterMsg(MsgId.DISMISS_CLUB, this.onRcvDismissClubNotify, false, this);
        // cc.vv.NetManager.unregisterMsg(MsgId.EXIT_CLUB, this.onRcvExitClubNotify, false, this);
        if(this._Layer){
            cc.loader.releaseRes("common/prefab/club_setting",cc.Prefab);
        }
    },
});
