// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

/*
    一级大厅
 */

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {en_
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         if(cc.vv.gameData) cc.vv.gameData.clear();

         this.node.parent.name = "lobby";
         Global.autoAdaptDevices(false);

         cc.find("head_bg/UserHead/name",this.node).getComponent(cc.Label).string = cc.vv.UserManager.nickName;
         cc.find("head_bg/id",this.node).getComponent(cc.Label).string = cc.vv.UserManager.uid;
         cc.find("money_bg/gold_num",this.node).getComponent(cc.Label).string = cc.vv.UserManager.coin;
         cc.find("room_bg/roomcard_num",this.node).getComponent(cc.Label).string = cc.vv.UserManager.roomcard;

         let club_btn = this.node.getChildByName("club_btn");
         Global.btnClickEvent(club_btn,this.onClub,this);

         let share_btn = cc.find("dt_xmt/share_btn",this.node)
         Global.btnClickEvent(share_btn,this.onClickShare,this);
         this.shareNode = this.node.getChildByName("shareNode");
         this.shareNode.active = false;
         let btn_shareToSession = cc.find("share_bg/btn_shareToSession",this.shareNode)
         Global.btnClickEvent(btn_shareToSession,this.onClickShareToSession,this);
         let btn_shareToTimeline = cc.find("share_bg/btn_shareToTimeline",this.shareNode)
         Global.btnClickEvent(btn_shareToTimeline,this.onClickShareToTimeline,this);

         let info = club_btn.getChildByName("info");
         info.active = cc.vv.UserManager.clubs.length>0;
         if(cc.vv.UserManager.clubs.length>0) this.initClub(info);

         let head = cc.find("head_bg/UserHead/radio_mask/spr_head",this.node);
         Global.setHead(head,cc.vv.UserManager.userIcon);

        Global.playBgm(Global.SOUNDS.bgm_hall);

        Global.registerEvent(EventId.SELF_GPS_DATA, this.onRecvSelfGpsData,this);
     },

    onRecvSelfGpsData(data){
        cc.find("gps/label_city",this.node).getComponent(cc.Label).string = data.detail.city;
    },

    initClub(info){
        let currNumLabel = cc.find("users_bg/curr_num",info);
        let totalNumLabel = cc.find("users_bg/total_num",info);
        let tabelNumLabel = cc.find("users_bg/tabel_num",info);
        currNumLabel.getComponent(cc.Label).string = cc.vv.UserManager.clubs[0].onlineNum;
        totalNumLabel.getComponent(cc.Label).string = "/"+cc.vv.UserManager.clubs[0].count;
        tabelNumLabel.getComponent(cc.Label).string = cc.vv.UserManager.clubs[0].gamedeskNum;
        info.getChildByName("club_name").getComponent(cc.Label).string = cc.vv.UserManager.clubs[0].name;
    },

    onClub(){
        if(cc.vv.UserManager.clubs.length>0) cc.vv.UserManager.currClubId = cc.vv.UserManager.clubs[0].clubid;
        cc.vv.SceneMgr.enterScene(cc.vv.UserManager.clubs.length>0?"club":"club_lobby");
    },
 
 	onClickShare(){
 		this.shareNode.active = !this.shareNode.active;
 	},

 	onClickShareToSession(){
 		this.onShareToWx(Global.ShareSceneType.WXSceneSession);
 	},

 	onClickShareToTimeline(){
 		this.onShareToWx(Global.ShareSceneType.WXSceneTimeline);
 	},

 	onShareToWx(ShareSceneType){
 		let title = "闲去游戏邀请";
        let description = "点击进入闲去游戏下载";
        Global.onWXShareLink(ShareSceneType, title, description, Global.iconUrl, Global.shareLink);
 	},

    start () {

    },

    onDestroy(){
    },

    // update (dt) {},
});
