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
        _effectIsOpen:1,
        _musicIsOpen:1,
        _audioVolue:1,

        _numList:[],
        _inputIndex:0,
        _numLength:6,
        numAtlas:cc.SpriteAtlas,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if(cc.vv.gameData) cc.vv.gameData.clear();

        this.node.parent.name = "lobby";
        Global.autoAdaptDevices(false);

        let head = cc.find("head_bg/UserHead/radio_mask/spr_head",this.node);
        Global.setHead(head,cc.vv.UserManager.userIcon);

        cc.find("gps/label_city",this.node).getComponent(cc.Label).string = cc.vv.UserManager.GpsCity;

        let text_dialogue = cc.find("bg_dialogue/mask/text_dialogue",this.node);
        text_dialogue.x = 120;
        text_dialogue.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.moveTo(6, cc.v2(-300, text_dialogue.y)),
                    cc.callFunc(()=>{
                        text_dialogue.x = 120;
                    })
                )
            )
        )

        let gameItem = cc.find("right_list/scrollview/view/content/item",this.node)
        Global.btnClickEvent(gameItem,this.onClickCreateRoom,this);

        cc.find("head_bg/UserHead/name",this.node).getComponent(cc.Label).string = cc.vv.UserManager.nickName;
        cc.find("head_bg/id",this.node).getComponent(cc.Label).string = cc.vv.UserManager.uid;
        cc.find("money_bg/gold_num",this.node).getComponent(cc.Label).string = cc.vv.UserManager.coin;
        cc.find("room_bg/roomcard_num",this.node).getComponent(cc.Label).string = cc.vv.UserManager.roomcard;

        let notHaveClub_btn = this.node.getChildByName("notHaveClub_btn");
        Global.btnClickEvent(notHaveClub_btn,this.onToClubLobby,this);
        let haveClub_btn = this.node.getChildByName("haveClub_btn");
        Global.btnClickEvent(haveClub_btn,this.onClub,this);
        let moreClub_btn = this.node.getChildByName("moreClub_btn");
        Global.btnClickEvent(moreClub_btn,this.onToClubLobby,this);

        notHaveClub_btn.active = (0 == cc.vv.UserManager.clubs.length);
        haveClub_btn.active = (0 < cc.vv.UserManager.clubs.length);
        moreClub_btn.active = (0 < cc.vv.UserManager.clubs.length);
        if(0 < cc.vv.UserManager.clubs.length){
            let info = haveClub_btn.getChildByName("info");
            this.initClub(info);
        }

        let share_btn = cc.find("dt_xmt/share_btn",this.node)
        Global.btnClickEvent(share_btn,this.onClickShare,this);
        this.panel_share = this.node.getChildByName("panel_share");
        this.panel_share.active = false;
        let btn_shareToSession = cc.find("share_bg/btn_shareToSession",this.panel_share)
        Global.btnClickEvent(btn_shareToSession,this.onClickShareToSession,this);
        let btn_shareToTimeline = cc.find("share_bg/btn_shareToTimeline",this.panel_share)
        Global.btnClickEvent(btn_shareToTimeline,this.onClickShareToTimeline,this);

        let history_btn = cc.find("dt_xmt/history_btn",this.node)
        Global.btnClickEvent(history_btn,this.onClickHistory,this);

        this.initJoinGame();

        this.CreateRoomJS = this.node.getComponent("CreateRoom");
        
        this.node.addComponent("GameRecord");
        this.GameRecordJS = this.node.getComponent("GameRecord");

        this.node.addComponent("LobbySet");
        this.LobbySetJS = this.node.getComponent("LobbySet");

        let setting_btn = cc.find("dt_xmt/setting_btn",this.node)
        Global.btnClickEvent(setting_btn,this.onClickSet,this);

        Global.playBgm(Global.SOUNDS.bgm_hall);

        Global.registerEvent(EventId.SELF_GPS_DATA, this.onRecvSelfGpsData,this);

        //testgsl
        // this.onClickHistory();
    },

    onClickHistory(){
        this.GameRecordJS.showGameRecord();
    },

    onClickCreateRoom(){
        this.CreateRoomJS.showCreateRoom(false);
    },

    onClickSet(){
        this.LobbySetJS.showLobbySet();
    },
    
    initJoinGame(){
        let btn_join_game = this.node.getChildByName("btn_join_game");
        Global.btnClickEvent(btn_join_game,this.onClickJoinGame,this);

        this.panel_join_game = this.node.getChildByName("panel_join_game");
        this.panel_join_game.active = false;

        let closeBtn = cc.find("bg/btn_close",this.panel_join_game);
        Global.btnClickEvent(closeBtn,this.onCloseJoinClub,this);

        for(let i=0;i<10;++i){
            let btn = cc.find("bg/btn_number"+i,this.panel_join_game);
            btn._index = i;
            Global.btnClickEvent(btn,this.inputNum,this);
        }

        let delBtn = cc.find("bg/btn_delete",this.panel_join_game);
        Global.btnClickEvent(delBtn,this.onDelete,this);

        let resetBtn = cc.find("bg/btn_reset",this.panel_join_game);
        Global.btnClickEvent(resetBtn,this.onReset,this);

        for(let i=0;i<this._numLength;++i){
            let numLabel = cc.find("bg/num"+i,this.panel_join_game).getChildByName("num");
            numLabel.active = false;
            this._numList.push(numLabel);
        }
    },

    onClickJoinGame(){
        this.panel_join_game.active = true;
        this.onReset();
    },

    onCloseJoinClub(){
       this.panel_join_game.active = false;
    },

    inputNum(event){
        if(this._inputIndex < this._numLength){
            let index = event.target._index;
            this._numList[this._inputIndex].active = true;
            this._numList[this._inputIndex].getComponent(cc.Sprite).spriteFrame = this.numAtlas.getSpriteFrame("hallClub-img-member-img-img_"+index);
            this._numList[this._inputIndex]._index = index;
            ++this._inputIndex;
            if(this._inputIndex >= this._numLength){
                let str = "";
                for(let i=0;i<this._numLength;++i){
                    str += this._numList[i]._index;
                }
                var req = { 'c': MsgId.GAME_JOINROOM};
                req.deskId = str;
                cc.vv.NetManager.send(req);
            }
        }
    },

    onReset(){
        this._inputIndex = 0;
        for(let i=0;i<this._numList.length;++i){
            this._numList[i].active = false;
            this._numList[i]._index = -1;
        }
    },

    onDelete(){
        --this._inputIndex;
        if(this._inputIndex<0) this._inputIndex = 0;
        if(this._inputIndex>=0){
            this._numList[this._inputIndex].active = false;
            this._numList[this._inputIndex]._index = -1;
        }
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

    onToClubLobby(){
        cc.vv.SceneMgr.enterScene("club_lobby");
    },
 
    onClickShare(){
        this.panel_share.active = !this.panel_share.active;
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
