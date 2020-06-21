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

         let info = club_btn.getChildByName("info");
         info.active = cc.vv.UserManager.clubs.length>0;
         if(cc.vv.UserManager.clubs.length>0) this.initClub(info);

         let head = cc.find("head_bg/UserHead/radio_mask/spr_head",this.node);
         Global.setHead(head,cc.vv.UserManager.userIcon);

         Global.playBgm(Global.SOUNDS.bgm_hall);

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


    start () {

    },

    onDestroy(){
    },

    // update (dt) {},
});
