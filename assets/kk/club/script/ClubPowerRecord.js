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
    },

    start () {
        cc.vv.NetManager.registerMsg(MsgId.CLUB_POWER_RECORD, this.onRcvList, this);
    },

    showLayer(){
        if(this._layer === null){
            cc.loader.loadRes("common/prefab/club_powerRecord",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._layer = cc.instantiate(prefab);
                    this._layer.scaleX = this.node.width / this._layer.width;
                    this._layer.scaleY = this.node.height / this._layer.height;
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
        let btn_close = cc.find("bg_member/btn_close",this._layer);
        Global.btnClickEvent(btn_close,this.onClose,this);

        let clubInfo = cc.vv.UserManager.getCurClubInfo();
        let isShowSearch = (clubInfo.createUid == cc.vv.UserManager.uid || clubInfo.hehuo);
        cc.find("bg_member/bg_input",this._layer).active = isShowSearch;
        if (isShowSearch) {
            this.input_searchID = cc.find("bg_member/bg_input/input_searchID",this._layer);
            this.input_searchID.on('editing-did-ended',this.onClickSearch,this);
        }

        this.listContent = cc.find("bg_member/panel_list/scrollView/content",this._layer);
        this.listItem = cc.find("bg_member/panel_list/scrollView/memberItem",this._layer);
        this.listItem.active = false;

        this.btn_prePage = cc.find("bg_member/panel_list/node_bottom/btn_prePage",this._layer);
        Global.btnClickEvent(this.btn_prePage, this.onClickPrePage,this);
        this.btn_nextPage = cc.find("bg_member/panel_list/node_bottom/btn_nextPage",this._layer);
        Global.btnClickEvent(this.btn_nextPage, this.onClickNextPage,this); 
        this.text_page = cc.find("bg_member/panel_list/node_bottom/text_page",this._layer);
    },

    initShow(){
        this.text_page.getComponent(cc.Label).string = "1/1";

        this.curStartIndex = 0;
        this.sendListReq();
    },

    onClose(){
        this._layer.active = false;
    },

    sendListReq(searchID){
        let req = { 'c': MsgId.CLUB_POWER_RECORD};
        req.clubid = cc.vv.UserManager.currClubId;
        req.starty = this.curStartIndex;
        req.endy = 5;
        req.selUid = searchID ? searchID : 0;
        cc.vv.NetManager.send(req);
    },

    onClickSearch(event){
        let searchID = this.input_searchID.getComponent(cc.EditBox).string;
        if (searchID && 0 < searchID.length) {
            this.sendListReq(searchID);
        }
    },

    onClickPrePage(){
        this.curStartIndex -= 5;
        this.sendListReq();
    },

    onClickNextPage(){
        this.curStartIndex += 5;
        this.sendListReq();
    },

    onRcvList(msg){
        if (200 == msg.code && msg.powerList) {
            let curPage = (this.curStartIndex/5+1);
            this.btn_prePage.getComponent(cc.Button).interactable = 1 < curPage;
            this.btn_nextPage.getComponent(cc.Button).interactable = curPage < msg.pagCnt;
            this.text_page.getComponent(cc.Label).string = curPage + "/" + msg.pagCnt;

            this.updateList(msg.powerList);
        }
    },

    updateList(showList){
        let removeCount = 0;
        this.listContent.removeAllChildren();
        for (let i = 0; i < showList.length; i++) {
            let item =  cc.instantiate(this.listItem);
            item.parent = this.listContent;
            item.y = - item.height * i;

            let bg_memberItem = item.getChildByName("bg_memberItem");
            bg_memberItem.getChildByName("text_name").getComponent(cc.Label).string = showList[i].bactName;
            bg_memberItem.getChildByName("text_ID").getComponent(cc.Label).string = showList[i].bactuid;
            bg_memberItem.getChildByName("text_partnerID").getComponent(cc.Label).string = showList[i].actuid;
            bg_memberItem.getChildByName("text_operaType").getComponent(cc.Label).string = showList[i].type ? "增加" : "减少";
            bg_memberItem.getChildByName("text_operaType").color = showList[i].type ? (new cc.Color(0,220,0)) : (new cc.Color(220,0,0));
            bg_memberItem.getChildByName("text_powerChange").getComponent(cc.Label).string = showList[i].power.toFixed(2);
            if (0 != showList[i].lastpower) {
                bg_memberItem.getChildByName("text_power").getComponent(cc.Label).string = showList[i].lastpower.toFixed(2);
            }
            bg_memberItem.getChildByName("text_time").getComponent(cc.Label).string = showList[i].time;
            item.active = true;
        }
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_POWER_RECORD, this.onRcvList, this);
        if(this._layer){
            cc.loader.releaseRes("common/prefab/club_powerRecord",cc.Prefab);
        }
    },
});
