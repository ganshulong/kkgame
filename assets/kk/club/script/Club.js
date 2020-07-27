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
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        _content:null,
        _tableList:[],
        wanfaAtlas:cc.SpriteAtlas,
        tableBgs:{
            default:[],
            type:cc.SpriteFrame,
        },
        _startPos:null,
        _sendSit:false,
        _clubInfo:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if(cc.vv.gameData){
            cc.vv.gameData.clear();
            cc.vv.gameData = null;
        }
        this.registerMsg();
        Global.autoAdaptDevices(false);

        this.node.addComponent("ClubMessage");
        this.node.addComponent("CreateRoom");

        let info = cc.vv.UserManager.getCurClubInfo();
        this._clubInfo = info;

        let back = cc.find("Layer/bg/btn_back",this.node);
        Global.btnClickEvent(back,this.onBack,this);

        cc.find("Layer/bg/txt_freeze",this.node).active = (0 == info.state);

        let spr_head = cc.find("Layer/bg/UserHead/radio_mask/spr_head",this.node);
        Global.setHead(spr_head, (info?info.createIcon:""));

        let clubId = cc.find("Layer/bg/img_club_name_bg/txt_clubId",this.node);
        clubId.getComponent(cc.Label).string = info?("ID:"+info.clubid):"";

        let clubName = cc.find("Layer/bg/img_club_name_bg/txt_clubName",this.node);
        clubName.getComponent(cc.Label).string = info?info.name:"";

        cc.find("Layer/img_card_bg",this.node).active = (info.createUid == cc.vv.UserManager.uid);

        let btn_invite = cc.find("Layer/bg/bg_top/btn_invite",this.node);
        Global.btnClickEvent(btn_invite,this.onClickInviteToWx,this);
        btn_invite.active = (info.createUid == cc.vv.UserManager.uid);

        this.node.addComponent("ClubExitApplyMessage");
        this.ClubExitApplyMessageJS = this.node.getComponent("ClubExitApplyMessage");

        let btn_msg = cc.find("Layer/bg/bg_top/btn_msg",this.node);
        Global.btnClickEvent(btn_msg,this.onClickMsg,this);
        btn_msg.active = (info.createUid == cc.vv.UserManager.uid);

        this.spr_redPoint = btn_msg.getChildByName("spr_redPoint");
        this.spr_redPoint.active = this._clubInfo.exitHave;

        this.node.addComponent("ClubSetting");
        this.ClubSettingJS = this.node.getComponent("ClubSetting");

        let btn_setting = cc.find("Layer/bg/bg_top/btn_setting",this.node);
        Global.btnClickEvent(btn_setting,this.onClickSetting,this);

        let createRoomBtn = cc.find("Layer/img_bottomBg/btn_switch",this.node);
        Global.btnClickEvent(createRoomBtn,this.onCreateRoom,this);
        createRoomBtn.active = (info.createUid == cc.vv.UserManager.uid);

        this.node.addComponent("ClubMember");
        this.ClubMemberJS = this.node.getComponent("ClubMember");

        let btn_member = cc.find("Layer/img_bottomBg/btn_member",this.node);
        Global.btnClickEvent(btn_member,this.onClickMember,this);
        btn_member.active = (info.createUid == cc.vv.UserManager.uid);

        this.node.addComponent("ClubRecord");
        this.ClubRecordJS = this.node.getComponent("ClubRecord");

        let btn_record = cc.find("Layer/img_bottomBg/btn_record",this.node);
        Global.btnClickEvent(btn_record,this.onClickRecord,this);

        this._content = cc.find("Layer/list/view/content",this.node);
        this._content.active = false;

        let tips = cc.find("Layer/bg_dialogue/mask/txt_dialogue",this.node);
        tips.x = 200;
        tips.runAction(cc.repeatForever(cc.sequence(cc.moveTo(10,cc.v2(-200,tips.y)),cc.callFunc(()=>{
            tips.x = 200;
        }))))

        this._startPos = cc.v2(this._content.children[0].x,this._content.children[0].y);
        // 请求俱乐部信息
        var req = { 'c': MsgId.ENTERCLUB};
        req.clubid = cc.vv.UserManager.currClubId;
        cc.vv.NetManager.send(req);
    },

    // 俱乐部信息
    onRcvClubInfo(msg){
        if(msg.code == 200){
            this._tableList = msg.response.deskList;
            this.initTables(this._tableList);
        }
    },

    registerMsg(){
        cc.vv.NetManager.registerMsg(MsgId.NOTICE_ADDNEWTABLE, this.onRcvAddTableMsg, this);
        cc.vv.NetManager.registerMsg(MsgId.ENTERCLUB, this.onRcvClubInfo, this);
        cc.vv.NetManager.registerMsg(MsgId.SEATDOWN, this.onEnterDeskResult, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTICE_TABLEINFO, this.onRecvTableinfo, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_DELETE_TABLE, this.onRecvDeleteTable, this);

        Global.registerEvent(EventId.FREEZE_CLUB_NOTIFY, this.onRcvFreezeClubNotify,this);
        Global.registerEvent(EventId.DISMISS_CLUB_NOTIFY, this.onRcvDismissClubNotify,this);
        Global.registerEvent(EventId.CLUB_EXIT_APPLY_NOTIFY, this.onRcvClubExitApplyNotify, this);
        Global.registerEvent(EventId.UPDATE_CLUBS,this.updateClubList,this);
    },

    unregisterMsg(){
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_ADDNEWTABLE, this.onRcvAddTableMsg,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.ENTERCLUB, this.onRcvClubInfo,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.SEATDOWN, this.onEnterDeskResult,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_TABLEINFO, this.onRecvTableinfo,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_DELETE_TABLE, this.onRecvDeleteTable,false,this);
    },

    onRcvClubExitApplyNotify(data){
        if(data.detail.clubid == cc.vv.UserManager.currClubId){
            this.spr_redPoint.active = data.detail.isShow;
        }
    },

    updateClubList(){
        let currClubIsHave = false;
        for (let i = 0; i < cc.vv.UserManager.clubs.length; ++i) {
            if (cc.vv.UserManager.clubs[i].clubid == cc.vv.UserManager.currClubId) {
                currClubIsHave = true;
                break;
            }
        }
        if (!currClubIsHave) {
            cc.vv.SceneMgr.enterScene("club_lobby");
        }
    },

    onRcvFreezeClubNotify(data){
        if (cc.vv.UserManager.currClubId == data.detail.clubid) {
            cc.find("Layer/bg/txt_freeze",this.node).active = (0 == data.detail.state);
            cc.vv.FloatTip.show((0 == data.detail) ? "亲友圈冻结成功" : "亲友圈解冻成功");
        }
    },

    onRcvDismissClubNotify(data){
        if (cc.vv.UserManager.currClubId == data.detail.clubid) {
            cc.vv.SceneMgr.enterScene("club_lobby");
            cc.vv.FloatTip.show("成功解散亲友圈");
        }
    },

    onRecvDeleteTable(msg){
        if(msg.code === 200){
            let deskId = msg.response.deskId;
            for(let i=0;i<this._content.childrenCount;++i){
                let item = this._content.children[i];
                if(item._deskId === deskId){
                    item.removeFromParent();
                    for(let i=0;i<this._tableList.length;++i){
                        if(this._tableList[i].deskid === deskId){
                            this._tableList.splice(i,1);
                            break;
                        }
                    }
                    break;
                }
            }
            this.initTables(this._tableList);
        }
    },

    // 桌子信息
    onRecvTableinfo(msg){
        if(msg.code === 200){
            let deskInfo = msg.response.hallDeskInfo;
            for(let i=0;i<this._content.childrenCount;++i){
                let item = this._content.children[i];
                if(item._deskId === deskInfo.deskid){
                    this.initTable(item,deskInfo.config,deskInfo);
                    for(let i=0;i<this._tableList.length;++i){
                        if(this._tableList[i].deskid === deskInfo.deskid){
                            this._tableList[i] = deskInfo;
                            break;
                        }
                    }
                    break;
                }
            }
        }
    },

    onEnterDeskResult(msg){
        if(msg.code === 200){
            if(msg.response.deskInfo.conf.gameid === 1 || msg.response.deskInfo.conf.gameid === 3){
                if(cc.vv.gameData === null){
                    let data = require("PengHu_GameData");
                    cc.vv.gameData = new data();
                    cc.vv.gameData.init(msg.response.deskInfo);
                    cc.vv.SceneMgr.enterScene("penghu");
                }
            } else if(msg.response.deskInfo.conf.gameid === 2 || msg.response.deskInfo.conf.gameid === 4){
                if(cc.vv.gameData === null){
                    let data = require("PaoHuZi_GameData");
                    cc.vv.gameData = new data();
                    cc.vv.gameData.init(msg.response.deskInfo);
                    cc.vv.SceneMgr.enterScene("paohuzi");
                }
            } else if(msg.response.deskInfo.conf.gameid === 3 || msg.response.deskInfo.conf.gameid === 6){
                if(cc.vv.gameData === null){
                    let data = require("HongHeiHu_GameData");
                    cc.vv.gameData = new data();
                    cc.vv.gameData.init(msg.response.deskInfo);
                    cc.vv.SceneMgr.enterScene("hongheihu");
                }
            }
        }
    },

    onRcvAddTableMsg(msg){
        if(msg.code === 200){
            this._tableList.unshift(msg.response.addDeskInfo);
            this.initTables(this._tableList);
        }
    },

    // 加入桌子
    onEnterDesk(event){
        if(!this._sendSit){
            var req = { 'c': MsgId.SEATDOWN};
            req.clubid = cc.vv.UserManager.currClubId;
            req.deskId = event.target._deskId;
            cc.vv.NetManager.send(req);
            this.scheduleOnce(()=>{
                this._sendSit = true;
            },0.2)
        }
    },

    // 更新桌子信息
    initTable(item,config,data){
        let type = cc.find("node/type_bg",item);
        type.getComponent(cc.Sprite).spriteFrame = this.wanfaAtlas.getSpriteFrame("hallClub-img-table-moreRule-index_" +
            config.playtype);

        let tableName = cc.find("node/img_roomId/table_name",item);
        tableName.getComponent(cc.Label).string = config.tname;

        let round = cc.find("node/img_round/txt_round",item);
        round.getComponent(cc.Label).string = config.gamenum+"局 " +config.seat+"人" ;

        let tableChar24 = cc.find("node/tableChar24",item);
        let tableChar3 = cc.find("node/tableChar3",item);

        let tableChar = null;
        if (2 == config.seat || 4 == config.seat) {
            tableChar3.active = false;
            tableChar = tableChar24;
            tableChar.getChildByName("char_3").active = (2 <= config.seat);
            tableChar.getChildByName("char_2").active = (3 <= config.seat);
            tableChar.getChildByName("char_4").active = (4 <= config.seat);
            for (let i = 1; i <= 4; i++) {
                cc.find("char_"+i+"/headNode",tableChar).active = false;
            }
        } else if (3 == config.seat) {
            tableChar24.active = false;
            tableChar = tableChar3;
            for (let i = 1; i <= 3; i++) {
                cc.find("char_"+i+"/headNode",tableChar).active = false;
            }
        }

        let bg = tableChar.getChildByName("bg");
        if (1 == config.gameid) {
            bg.getComponent(cc.Sprite).spriteFrame = config.seat === 4?this.tableBgs[0]:this.tableBgs[1];
        } else if (2 == config.gameid) {
            bg.getComponent(cc.Sprite).spriteFrame = this.tableBgs[2];
        }
            
        tableChar.active = true;
        
        if(data.users){
            let users = data.users;
            for(let j=0;j<users.length;++j){
                let headNode = cc.find("char_"+(j+1)+"/headNode",tableChar);
                if(config.seat === 2 && j===1) {
                    headNode = cc.find("char_3/headNode",tableChar);
                }
                if(headNode){
                    headNode.active = true;
                    let spr_head = cc.find("UserHead/radio_mask/spr_head",headNode);
                    Global.setHead(spr_head,users[j].usericon);
                    let name = cc.find("img_nameBg/txt_name",headNode);
                    name.getComponent(cc.Label).string = users[j].playername;
                    headNode.getChildByName("img_ready").active = users[j].state===1;
                }
            }
        }
    },

    initTables(list){
        let width = 0;
        for(let i=0;i<list.length;++i){
            let config = list[i].config;
            let item = null;
            if(i<this._content.childrenCount) item = this._content.children[i];
            else {
                item = cc.instantiate(this._content.children[0]);
                item.parent = this._content;
            }
            item.active = true;
            let clickBtn = cc.find("node/img_click",item);
            clickBtn._deskId = list[i].deskid;
            item._deskId = list[i].deskid;
            Global.btnClickEvent(clickBtn,this.onEnterDesk,this);

            item.x  = this._startPos.x + (clickBtn.width+30)*parseInt(i/2);
            item.y  = this._startPos.y - (clickBtn.height+30)*(i%2);
            if(i%2===0) width +=  (clickBtn.width+30);
            this.initTable(item,config,list[i]);

        }
        for(let i=list.length;i<this._content.childrenCount;++i){
            this._content.children[i].active = false;
        }
        this._content.active = list.length>0;
        this._content.width = width+50;
    },

    onClickInviteToWx(){
        let des = "我在闲去棋牌的亲友圈ID是" + this._clubInfo.clubid + "，赶快来加入吧"
        Global.onWXShareText(Global.ShareSceneType.WXSceneSession, "俱乐部邀请", des);
    },

    onClickMsg(){
        if (this.spr_redPoint.active) {
            this.ClubExitApplyMessageJS.showLayer();
        }
    },

    onClickSetting(){
        this.ClubSettingJS.showClubSetting();
    },

    onCreateRoom(){
        Global.dispatchEvent(EventId.GAME_CREATEROOM);
    },

    onClickMember(){
        this.ClubMemberJS.showLayer();
    },

    onClickRecord(){
        this.ClubRecordJS.showLayer();
    },

    onBack(){
        cc.vv.SceneMgr.enterScene("club_lobby");
    },

    onDestroy(){
        this.unregisterMsg();
    }
    // update (dt) {},
});
