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
        _layer:null,
        _clubInfo:null,
    },

    start () {
        cc.vv.NetManager.registerMsg(MsgId.EXIT_CLUB_APPLY, this.onRcvExitClubApply, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_FORBID_LIST, this.onRcvForbidList, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_ADD_FORBID_LIST, this.onRcvAddForbidList, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_DELETE_FORBID_LIST, this.onRcvDeleteForbidList, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_ADD_FORBID_MEMBER, this.onRcvAddForbidMember, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_DELETE_FORBID_MEMBER, this.onRcvDeleteForbidMember, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_SET_NOTIFY, this.onRcvClubSetNotify, this);
    },

    showClubSetting(){
        if(this._layer === null){
            cc.loader.loadRes("common/prefab/club_setting",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._layer = cc.instantiate(prefab);
                    this._layer.parent = this.node;
                    this._layer.zIndex = 1;
                    this._layer.x = this.node.width/2 - this.node.x;
                    this._layer.y = this.node.height/2 - this.node.y;

                    this.initUI();
                    this.initShow();
                }
            })
        }
        else{
            this._layer.active = true;
            this.initShow();
        }
    },

    initUI(){
        let btn_close = cc.find("bg_set/btn_close",this._layer);
        Global.btnClickEvent(btn_close,this.onClose,this);

        this.left_btn_bg = cc.find("bg_set/left_btn_bg",this._layer);
        for (let j = 0; j < this.left_btn_bg.children.length; j++) {
            let btn = this.left_btn_bg.getChildByName("btn" + j);
            btn.index = j;
            Global.btnClickEvent(btn, this.onClickLeftBtn, this);
            btn.getComponent(cc.Button).interactable = (j != 0);
        }

        //基础操作
        this.panel_baseContent = cc.find("bg_set/panel_baseContent",this._layer);
        this.ItemArr = [];
        for (let i = 0; i < this.panel_baseContent.children.length; i++) {
            this.ItemArr.push(this.panel_baseContent.getChildByName("bg_Item"+i));
            let btn = this.ItemArr[i].getChildByName("btn_"+i);
            btn.index = i;
            Global.btnClickEvent(btn,this.onClickItemConfirm,this);
        }

        //基础操作确认弹窗
        this.panel_confirmTips = cc.find("bg_set/panel_confirmTips",this._layer);
        let btn_closeTips = cc.find("confirmTips_bg/btn_closeTips",this.panel_confirmTips);
        Global.btnClickEvent(btn_closeTips,this.onCloseTips,this);
        let btn_confirm = cc.find("confirmTips_bg/btn_confirm",this.panel_confirmTips);
        Global.btnClickEvent(btn_confirm,this.onClickConfirm,this);

        //限制列表
        this.panel_forbidTogether = cc.find("bg_set/panel_forbidTogether",this._layer);
        this.input_search_editBox = cc.find("bg_input/input_uid", this.panel_forbidTogether).getComponent(cc.EditBox);
        let btn_search = this.panel_forbidTogether.getChildByName("btn_search")
        Global.btnClickEvent(btn_search,this.onClickSearch,this);
        let btn_addList = this.panel_forbidTogether.getChildByName("btn_addList");
        Global.btnClickEvent(btn_addList,this.onClickAddList,this);

        this.forbidTogetherContent = cc.find("scrollView/content", this.panel_forbidTogether);
        this.contentItem = cc.find("scrollView/contentItem", this.panel_forbidTogether);
        this.contentItem.active = false;
        // let btn_deleteContentItem = this.contentItem.getChildByName("btn_delete")
        // Global.btnClickEvent(btn_deleteContentItem,this.onClicDeleteContentItem,this);

        this.playerItem = cc.find("scrollView/playerItem", this.panel_forbidTogether);
        this.playerItem.active = false;
        // let btn_deletePlayerItem = this.playerItem.getChildByName("btn_delete");
        // Global.btnClickEvent(btn_deletePlayerItem,this.onClicDeletePlayerItem,this);
        
        this.addPlayerItem = cc.find("scrollView/addPlayerItem", this.panel_forbidTogether);
        this.addPlayerItem.active = false;
        // Global.btnClickEvent(this.addPlayerItem,this.onClicAddPlayerItem,this);

        //输入添加ID页        
        this.panel_inputID = cc.find("bg_set/panel_inputID",this._layer);
        let btn_closeInpurID = this.panel_inputID.getChildByName("btn_closeInpurID");
        Global.btnClickEvent(btn_closeInpurID,this.onClicCloseInpurID,this);
        this.input_addPlayer_editBox = this.panel_inputID.getChildByName("input_uid").getComponent(cc.EditBox);
        let btn_confirmAddID = this.panel_inputID.getChildByName("btn_confirmAddID");
        Global.btnClickEvent(btn_confirmAddID,this.onClickConfirmAddID,this);

        //设置公告页        
        this.panel_setNotify = cc.find("bg_set/panel_setNotify",this._layer);
        this.input_notify_editBox = this.panel_setNotify.getChildByName("input_notify").getComponent(cc.EditBox);
        let btn_pause = this.panel_setNotify.getChildByName("btn_pause");
        Global.btnClickEvent(btn_pause,this.onClicNotifyPause,this);
        let btn_play = this.panel_setNotify.getChildByName("btn_play");
        Global.btnClickEvent(btn_play,this.onClicNotifyPlay,this);

    },

    initShow(){
        this._clubInfo = cc.vv.UserManager.getCurClubInfo();
        this.ItemArr[0].active = (this._clubInfo.createUid != cc.vv.UserManager.uid);
        this.ItemArr[1].active = Global.getIsManager();
        this.ItemArr[2].active = (Global.getIsManager() && this._clubInfo.state);  //state:1正常，0冻结
        this.ItemArr[3].active = (Global.getIsManager() && !this._clubInfo.state);
        this.ItemArr[4].active = (Global.getIsManager() && (1 == this._clubInfo.mode));
        this.ItemArr[5].active = (Global.getIsManager() && (1 != this._clubInfo.mode));
        this.ItemArr[6].active = (Global.getIsManager() && (1 == this._clubInfo.fufen));
        this.ItemArr[7].active = (Global.getIsManager() && (1 != this._clubInfo.fufen));
        
        this.left_btn_bg.getChildByName("btn1").active = Global.getIsManager();     //禁止同桌
        this.left_btn_bg.getChildByName("btn2").active = Global.getIsManager();     //设置公告

        this.setPanelShow(0);
        this.panel_confirmTips.active = false;
        this.panel_inputID.active = false;
    },

    setPanelShow(index){
        for (let j = 0; j < this.left_btn_bg.children.length; j++) {
            let btn = this.left_btn_bg.getChildByName("btn" + j);
            btn.getComponent(cc.Button).interactable = (j != index);
        }
        this.panel_baseContent.active = (0 == index);
        this.panel_forbidTogether.active = (1 == index);
        if (this.panel_forbidTogether.active) {
            this.input_search_editBox.string = "";
            var req = { c: MsgId.CLUB_FORBID_LIST};
            req.clubid = cc.vv.UserManager.currClubId;
            cc.vv.NetManager.send(req);
        }
        this.panel_setNotify.active = (2 == index);
        if (this.panel_setNotify.active) {
            this.input_notify_editBox.string = this._clubInfo.notify;
        }
    },

    onRcvClubSetNotify(msg){
        if (200 == msg.code) {
            cc.vv.FloatTip.show("公告设置成功");
            this.onClose();
        }
    },

    onRcvForbidList(msg){
        if (200 == msg.code) {
            this.forbidList = msg.mutexGroupList;
            this.updateForbidList();
        }
    },

    onRcvAddForbidList(msg){
        if (200 == msg.code) {
            this.forbidList.push({groupid : msg.groupid, mutexUser : []});
            this.updateForbidList();
        }
    },

    onRcvDeleteForbidList(msg){
        if (200 == msg.code) {
            for (let i = 0; i < this.forbidList.length; i++) {
                if (this.forbidList[i].groupid == msg.groupid) {
                    this.forbidList.splice(i, 1);
                    this.updateForbidList();
                    break;
                }
            }
        }
    },

    onRcvAddForbidMember(msg){
        if (200 == msg.code) {
            for (let i = 0; i < this.forbidList.length; i++) {
                if (this.forbidList[i].groupid == msg.mutexUserList.groupid) {
                    this.forbidList[i].mutexUser = msg.mutexUserList.mutexUser;
                    this.updateForbidList();
                    break;
                }
            }
        }
    },

    onRcvDeleteForbidMember(msg){
        if (200 == msg.code) {
            for (let i = 0; i < this.forbidList.length; i++) {
                if (this.forbidList[i].groupid == msg.mutexUserList.groupid) {
                    this.forbidList[i].mutexUser = msg.mutexUserList.mutexUser;
                    this.updateForbidList();
                    break;
                }
            }
        }
    },

    updateForbidList(){
        let curPosY = 0;
        this.forbidTogetherContent.removeAllChildren();
        for (let i = 0; i < this.forbidList.length; i++) {
            let contentItem =  cc.instantiate(this.contentItem);
            contentItem.parent = this.forbidTogetherContent;
            contentItem.y = curPosY;
            curPosY -= this.contentItem.height;
            contentItem.getChildByName("text_index").getComponent(cc.Label).string = (i+1);
            contentItem.getChildByName("text_playerNum").getComponent(cc.Label).string = "限制人数：" + this.forbidList[i].mutexUser.length + "/99";
            let btn_deleteContentItem = contentItem.getChildByName("btn_delete")
            btn_deleteContentItem.groupid = this.forbidList[i].groupid;
            Global.btnClickEvent(btn_deleteContentItem,this.onClicDeleteContentItem,this);

            for (let j = 0; j < this.forbidList[i].mutexUser.length; j++) {
                let playerItem =  cc.instantiate(this.playerItem);
                playerItem.parent = this.forbidTogetherContent;
                playerItem.x = this.playerItem.x + this.playerItem.width * (j % 3);
                playerItem.y = curPosY;
                if ((j+1) % 3 == 0) {
                    curPosY -= this.playerItem.height;
                }
                let spr_head = cc.find("UserHead/radio_mask/spr_head",playerItem);
                Global.setHead(spr_head, this.forbidList[i].mutexUser[j].usericon);
                playerItem.getChildByName("text_name").getComponent(cc.Label).string = this.forbidList[i].mutexUser[j].playername;
                playerItem.getChildByName("text_ID").getComponent(cc.Label).string = this.forbidList[i].mutexUser[j].uid;
                let btn_deletePlayerItem = playerItem.getChildByName("btn_delete");
                btn_deletePlayerItem.groupid = this.forbidList[i].groupid;
                btn_deletePlayerItem.delUid = this.forbidList[i].mutexUser[j].uid;
                Global.btnClickEvent(btn_deletePlayerItem,this.onClicDeletePlayerItem,this);
                playerItem.active = true;
            }

            //添加成员
            let addPlayerItem =  cc.instantiate(this.addPlayerItem);
            addPlayerItem.parent = this.forbidTogetherContent;
            addPlayerItem.x = this.playerItem.x + this.playerItem.width * (this.forbidList[i].mutexUser.length % 3);
            addPlayerItem.y = curPosY;
            curPosY -= this.playerItem.height;
            let btn_add = addPlayerItem.getChildByName("btn_add");
            btn_add.groupid = this.forbidList[i].groupid;
            Global.btnClickEvent(btn_add,this.onClicAddPlayerItem,this);
            addPlayerItem.active = true;

            contentItem.active = true;
        }
        this.forbidTogetherContent.height = -curPosY;
    },

    onClose(){
        this._layer.active = false;
    },

    onClickLeftBtn(event){
        this.setPanelShow(event.target.index);
    },

    onClickSearch(event){
        let input_uid = this.input_search_editBox.string;
        if (input_uid && 6 == input_uid.length) {
            let searchList = [];
            for (let i = 0; i < this.forbidList.length; i++) {
                for (let j = 0; j < this.forbidList[i].mutexUser.length; j++) {
                    if (input_uid == this.forbidList[i].mutexUser[j].uid) {
                        searchList.push(this.forbidList[i]);
                        break
                    }
                }
            }
            if (0 < searchList.length) {
                this.forbidList = searchList;
                this.updateForbidList();
            } else {
                cc.vv.FloatTip.show("未搜到该玩家");
            }
        } else {
            cc.vv.FloatTip.show("输入无效");
        }
    },

    onClickAddList(event){
        var req = { c: MsgId.CLUB_ADD_FORBID_LIST};
        req.clubid = cc.vv.UserManager.currClubId;
        cc.vv.NetManager.send(req);
    },

    onClicDeleteContentItem(event){
        var req = { c: MsgId.CLUB_DELETE_FORBID_LIST};
        req.clubid = cc.vv.UserManager.currClubId;
        req.groupid = event.target.groupid;
        let sureCall = function () {
            cc.vv.NetManager.send(req);
        }
        let cancelCall = function () {
        }
        cc.vv.AlertView.show("是否确定删除该限制组", sureCall, cancelCall);
    },

    onClicDeletePlayerItem(event){
        var req = { c: MsgId.CLUB_DELETE_FORBID_MEMBER};
        req.clubid = cc.vv.UserManager.currClubId;
        req.groupid = event.target.groupid;
        req.delUid = event.target.delUid;
        let sureCall = function () {
            cc.vv.NetManager.send(req);
        }
        let cancelCall = function () {
        }
        cc.vv.AlertView.show("是否确定从限制组中删除玩家"+event.target.delUid, sureCall, cancelCall);
    },

    onClicAddPlayerItem(event){
        this.curGroupid = event.target.groupid;
        this.input_addPlayer_editBox.string = "";
        this.panel_inputID.active = true;
    },

    onClicCloseInpurID(){
        this.panel_inputID.active = false;
    },

    onClickConfirmAddID(){
        let input_uid = this.input_addPlayer_editBox.string;
        if (input_uid && 6 == input_uid.length) {
            var req = { c: MsgId.CLUB_ADD_FORBID_MEMBER};
            req.clubid = cc.vv.UserManager.currClubId;
            req.groupid = this.curGroupid;
            req.addUid = input_uid;
            cc.vv.NetManager.send(req);

            this.panel_inputID.active = false;
        } else {
            cc.vv.FloatTip.show("输入无效");
        }
    },

    onClickItemConfirm(event){
        this.clickItemIndex = event.target.index;
        this.showConfirmTips();
    },

    showConfirmTips(){
        this.panel_confirmTips.active = true;
        let tipsStrArr = [];
        tipsStrArr[0] = "确定退出以下亲友圈？";
        tipsStrArr[1] = "确定解散以下亲友圈？";
        tipsStrArr[2] = "确定冻结以下亲友圈？";
        tipsStrArr[3] = "确定解冻以下亲友圈？";
        tipsStrArr[4] = "确定切换平摊模式？";
        tipsStrArr[5] = "确定切换大赢家模式？";
        tipsStrArr[6] = "确定设置为不可负分？";
        tipsStrArr[7] = "确定设置为可负分？";
        let confirmTips_bg = this.panel_confirmTips.getChildByName("confirmTips_bg");
        for (var i = 0; i < tipsStrArr.length; i++) {
            confirmTips_bg.getChildByName("spr_title"+i).active = (i == this.clickItemIndex);
        }
        confirmTips_bg.getChildByName("text_tip").getComponent(cc.Label).string = tipsStrArr[this.clickItemIndex];
        confirmTips_bg.getChildByName("text_clubName").getComponent(cc.Label).string = "亲友圈名称：" + this._clubInfo.name;
        confirmTips_bg.getChildByName("text_clubID").getComponent(cc.Label).string = "亲友圈ID：" + this._clubInfo.clubid;
    },

    onCloseTips(){
        this.panel_confirmTips.active = false;
    },

    onClickConfirm(){
        let msgIDArr = [MsgId.EXIT_CLUB_APPLY, MsgId.DISMISS_CLUB, MsgId.FREEZE_CLUB, MsgId.FREEZE_CLUB, MsgId.CLUB_SWITCH_MODE, MsgId.CLUB_SWITCH_MODE, MsgId.CLUB_SWITCH_MODE, MsgId.CLUB_SWITCH_MODE];
        if (-1 < this.clickItemIndex) {
            var req = { 'c': msgIDArr[this.clickItemIndex]};
            if (2 == this.clickItemIndex) {
                req.state = 0;
            } else if (3 == this.clickItemIndex) {
                req.state = 1;
            } else if (4 == this.clickItemIndex) {
                req.type = 1;
                req.mode = 2;
            } else if (5 == this.clickItemIndex) {
                req.type = 1;
                req.mode = 1;
            } else if (6 == this.clickItemIndex) {
                req.type = 2;
                req.mode = 2;
            } else if (7 == this.clickItemIndex) {
                req.type = 2;
                req.mode = 1;
            }
            req.clubid = cc.vv.UserManager.currClubId;
            cc.vv.NetManager.send(req);

            this._layer.active = false;
        }
    },

    onClicNotifyPause(){
        let notifyStr = this.input_notify_editBox.string;
        notifyStr = notifyStr.replace(/[\r\n]/g,"");   
        var req = { c: MsgId.CLUB_SET_NOTIFY};
        req.clubid = cc.vv.UserManager.currClubId;
        req.notify = notifyStr;
        req.notifynum = 0;
        cc.vv.NetManager.send(req);
    },

    onClicNotifyPlay(){
        let notifyStr = this.input_notify_editBox.string;
        notifyStr = notifyStr.replace(/[\r\n]/g,"");   
        var req = { c: MsgId.CLUB_SET_NOTIFY};
        req.clubid = cc.vv.UserManager.currClubId;
        req.notify = notifyStr;
        req.notifynum = 1;
        cc.vv.NetManager.send(req);
    },

    onRcvExitClubApply(msg){
        if(msg.code === 200){
            cc.vv.FloatTip.show("成功申请退出亲友圈");
            this.onClose();
        }
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.EXIT_CLUB_APPLY, this.onRcvExitClubApply, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_FORBID_LIST, this.onRcvForbidList, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_ADD_FORBID_LIST, this.onRcvAddForbidList, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_DELETE_FORBID_LIST, this.onRcvDeleteForbidList, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_ADD_FORBID_MEMBER, this.onRcvAddForbidMember, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_DELETE_FORBID_MEMBER, this.onRcvDeleteForbidMember, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_SET_NOTIFY, this.onRcvClubSetNotify, this);
        if(this._layer){
            cc.loader.releaseRes("common/prefab/club_setting",cc.Prefab);
        }
    },
});
