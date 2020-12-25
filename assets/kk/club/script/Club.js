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
        this.node.addComponent("ClubExitApplyMessage");
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

        this.node.addComponent("ClubPowerRecord");
        this.ClubPowerRecordJS = this.node.getComponent("ClubPowerRecord");

        let power_bg = cc.find("Layer/bg/power_bg",this.node);
        Global.btnClickEvent(power_bg,this.onClickPowerRecord,this);

        this.img_card_bg = cc.find("Layer/bg/img_card_bg",this.node);
        this.img_card_bg.active = this.getIsManager();
        this.img_card_bg.getChildByName("txt_card_num").getComponent(cc.Label).string = cc.vv.UserManager.roomcard;

        this.btn_invite = cc.find("Layer/bg/bg_top/btn_invite",this.node);
        this.btn_invite.active = (this.getIsManager() || this.getIsPartner());
        Global.btnClickEvent(this.btn_invite,this.onClickInviteJoin,this);
        this.node.addComponent("ClubInviteJoin");
        this.ClubInviteJoinJS = this.node.getComponent("ClubInviteJoin");

        this.node.addComponent("ClubPlayerInOutRecord");
        this.ClubPlayerInOutRecordJS = this.node.getComponent("ClubPlayerInOutRecord");

        this.btn_msg = cc.find("Layer/bg/bg_top/btn_msg",this.node);
        Global.btnClickEvent(this.btn_msg,this.onClickMsg,this);
        this.btn_msg.active = this.getIsManager();

        this.spr_redPoint = this.btn_msg.getChildByName("spr_redPoint");
        this.spr_redPoint.active = false;

        this.node.addComponent("ClubSetting");
        this.ClubSettingJS = this.node.getComponent("ClubSetting");

        let btn_setting = cc.find("Layer/bg/bg_top/btn_setting",this.node);
        Global.btnClickEvent(btn_setting,this.onClickSetting,this);

        this.createRoomBtn = cc.find("Layer/img_bottomBg/btn_switch",this.node);
        Global.btnClickEvent(this.createRoomBtn,this.onCreateRoom,this);
        this.createRoomBtn.active = this.getIsManager();

        this.CreateRoomJS = this.node.getComponent("CreateRoom");
        //this.CreateRoomJS.preLoadPrefab(true);

        this.node.addComponent("ClubMember");
        this.ClubMemberJS = this.node.getComponent("ClubMember");

        this.btn_member = cc.find("Layer/img_bottomBg/btn_member",this.node);
        Global.btnClickEvent(this.btn_member,this.onClickMember,this);
        this.btn_member.active = (this.getIsManager() || this.getIsPartner());

        this.node.addComponent("ClubWaterRecord");

        this.node.addComponent("ClubRecord");
        this.ClubRecordJS = this.node.getComponent("ClubRecord");

        let btn_record = cc.find("Layer/img_bottomBg/btn_record",this.node);
        Global.btnClickEvent(btn_record,this.onClickRecord,this);

        this.showRuleInfo = null;
        this.panel_ruleSelect = cc.find("Layer/panel_ruleSelect",this.node);
        this.setRuleSelectShow(false);
        let btn_mask = cc.find("Layer/panel_ruleSelect/btn_mask",this.node);
        Global.btnClickEvent(btn_mask,this.onClickHideRuleSelect,this);
        let item_allRuleSelect = cc.find("Layer/panel_ruleSelect/item_allRuleSelect",this.node);
        Global.btnClickEvent(item_allRuleSelect,this.onClickAllRuleSelect,this);
        this.ruleSelectContent = cc.find("Layer/panel_ruleSelect/list/view/content",this.node);
        this.ruleSelectItem = cc.find("Layer/panel_ruleSelect/list/view/item_ruleSelect",this.node);
        this.ruleSelectItem.active = false;
        let btn_ruleSelect = cc.find("Layer/img_bottomBg/btn_ruleSelect",this.node);
        Global.btnClickEvent(btn_ruleSelect,this.onClickRuleSelect,this);

        this.panel_tableOperate = cc.find("Layer/panel_tableOperate",this.node);
        this.panel_tableOperate.active = false;
        let btnCloseTableOperate = this.panel_tableOperate.getChildByName("btnCloseTableOperate");
        Global.btnClickEvent(btnCloseTableOperate,this.onClickCloseTableOperate,this);
        this.btn_deleteTable = this.panel_tableOperate.getChildByName("btn_deleteTable");
        Global.btnClickEvent(this.btn_deleteTable,this.onClickDeleteTable,this);
        this.btn_modifyTable = this.panel_tableOperate.getChildByName("btn_modifyTable");
        Global.btnClickEvent(this.btn_modifyTable,this.onClickModifyTable,this);

        let btn_backRoom = cc.find("Layer/img_bottomBg/btn_backRoom",this.node);
        Global.btnClickEvent(btn_backRoom,this.onClickBackRoom,this);

        this._content = cc.find("Layer/list/view/content",this.node);
        this._content.active = false;
        let img_click = cc.find("node/img_click", this._content.children[0]);
        Global.btnClickEvent(img_click,this.onEnterDesk,this);

        this._startPos = cc.v2(this._content.children[0].x,this._content.children[0].y);

        // 请求俱乐部信息
        var req = { 'c': MsgId.ENTERCLUB};
        req.clubid = cc.vv.UserManager.currClubId;
        cc.vv.NetManager.send(req);

        if (Global.backRecordData) {
            this.ClubRecordJS.showLayer({detail:Global.backRecordCheckUid});
        }
    },

    // 俱乐部信息
    onRcvClubInfo(msg){
        if(msg.code == 200){
            this._tableList = msg.response.deskList;
            this.initTables(this._tableList);
            this.setPower(msg.response.pscore);
            this.spr_redPoint.active = msg.response.hsNew;
        }
    },

    registerMsg(){
        cc.vv.NetManager.registerMsg(MsgId.NOTICE_ADDNEWTABLE, this.onRcvAddTableMsg, this);
        cc.vv.NetManager.registerMsg(MsgId.ENTERCLUB, this.onRcvClubInfo, this);
        cc.vv.NetManager.registerMsg(MsgId.SEATDOWN, this.onEnterDeskResult, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTICE_TABLEINFO, this.onRecvTableinfo, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_DELETE_TABLE, this.onRecvDeleteTable, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_SWITCH_GAME, this.onEnterDeskResult, this);
        cc.vv.NetManager.registerMsg(MsgId.SUCCESS_DISMISS_NOTIFY, this.onRcvDismissNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.GAME_LEVELROOM, this.onRcvNetExitRoom, this); //退出房间
        cc.vv.NetManager.registerMsg(MsgId.CLUB_POWER_NOTIFY, this.onRcvPowerNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_SET_POWER, this.onRcvSetPower, this);
        cc.vv.NetManager.registerMsg(MsgId.MODIFY_ROOM_PLAY, this.onRcvModifyRoomPlay, this);

        Global.registerEvent(EventId.FREEZE_CLUB_NOTIFY, this.onRcvFreezeClubNotify,this);
        Global.registerEvent(EventId.DISMISS_CLUB_NOTIFY, this.onRcvDismissClubNotify,this);
        // Global.registerEvent(EventId.CLUB_EXIT_APPLY_NOTIFY, this.onRcvClubExitApplyNotify, this);
        Global.registerEvent(EventId.UPDATE_CLUBS,this.updateClubList,this);
        Global.registerEvent(EventId.ROOMCRAD_CHANGE, this.onRcvNetRoomcardChanged,this);
        Global.registerEvent(EventId.CLUB_SET_PARTNER, this.onRcvSetPartner, this);
    },

    unregisterMsg(){
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_ADDNEWTABLE, this.onRcvAddTableMsg,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.ENTERCLUB, this.onRcvClubInfo,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.SEATDOWN, this.onEnterDeskResult,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_TABLEINFO, this.onRecvTableinfo,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_DELETE_TABLE, this.onRecvDeleteTable,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_SWITCH_GAME, this.onEnterDeskResult, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.SUCCESS_DISMISS_NOTIFY, this.onRcvDismissNotify, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_LEVELROOM, this.onRcvNetExitRoom, false, this); //退出房间
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_POWER_NOTIFY, this.onRcvPowerNotify, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_SET_POWER, this.onRcvSetPower, false, this);
        cc.vv.NetManager.unregisterMsg(MsgId.MODIFY_ROOM_PLAY, this.onRcvModifyRoomPlay, false, this);
    },

    onRcvModifyRoomPlay(msg){
        if(msg.code === 200){
            this.CreateRoomJS.onClose();

            let deskInfo = msg.response.deskInfo;
            for(let i=0;i<this._content.childrenCount;++i){
                let item = this._content.children[i];
                if(item._deskId == deskInfo.deskid){
                    for(let i=0;i<this._tableList.length;++i){
                        if(this._tableList[i].deskid == deskInfo.deskid){
                            this._tableList[i] = deskInfo;
                            this.initTables(this._tableList);
                            break;
                        }
                    }
                    break;
                }
            }
            cc.vv.FloatTip.show("修改玩法成功!");
        }
    },

    onRcvSetPower(msg){
        if (200 == msg.code) {
            if (msg.clubid === cc.vv.UserManager.currClubId && msg.uid == cc.vv.UserManager.uid) {
                this.setPower(msg.myPower)
            }
        }
    },

    onRcvPowerNotify(msg){
        if (200 == msg.code) {
            if (msg.clubid === cc.vv.UserManager.currClubId && msg.memberuid === cc.vv.UserManager.uid) {
                this.setPower(msg.power)
            }
        }
    },

    getIsManager(){
        this._clubInfo = cc.vv.UserManager.getCurClubInfo();
        return (1 == this._clubInfo.level || 2 == this._clubInfo.level);
    },

    getIsPartner(){
        this._clubInfo = cc.vv.UserManager.getCurClubInfo();
        return (1 == this._clubInfo.level || 3 <= this._clubInfo.level);
    },

    onRcvSetPartner(data){
        data = data.detail;
        if (200 == data.code) {
            if (data.clubid === cc.vv.UserManager.currClubId && data.setuid === cc.vv.UserManager.uid) {
                this.img_card_bg.active = this.getIsManager();
                this.btn_msg.active = this.getIsManager();
                this.createRoomBtn.active = this.getIsManager();
                this.btn_invite.active = (this.getIsManager() || this.getIsPartner());
                this.btn_member.active = (this.getIsManager() || this.getIsPartner());
                for(let i=0; i<this._content.childrenCount;++i){
                    let btn_tableOperate = cc.find("node/btn_tableOperate", this._content.children[i]);
                    btn_tableOperate.active = this.getIsManager();
                }
            }
            if (data.clubid === cc.vv.UserManager.currClubId && data.partneruid === cc.vv.UserManager.uid) {
                this._clubInfo = cc.vv.UserManager.getCurClubInfo();
                this.btn_invite.active = (this.getIsManager() || this.getIsPartner());
                this.btn_member.active = (this.getIsManager() || this.getIsPartner());
            }
        }
    },

    onRcvNetRoomcardChanged(){
        let txt_card_num = cc.find("Layer/bg/img_card_bg/txt_card_num",this.node);
        txt_card_num.getComponent(cc.Label).string = cc.vv.UserManager.roomcard;
    },

    onRcvDismissNotify(msg){
        if (msg.code === 200 && Global.curRoomID) {
            Global.curRoomID = "";
        }
    },

    // onRcvClubExitApplyNotify(data){
    //     if(data.detail.clubid == cc.vv.UserManager.currClubId){
    //         this.spr_redPoint.active = data.detail.isShow;
    //     }
    // },

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
            cc.vv.FloatTip.show((0 == data.detail.state) ? "亲友圈冻结成功" : "亲友圈解冻成功");
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
            if (deskInfo.config.clubid === cc.vv.UserManager.currClubId) {
                for(let i=0;i<this._tableList.length;++i){
                    if(this._tableList[i].deskid === deskInfo.deskid){
                        this._tableList[i] = deskInfo;
                        this.initTables(this._tableList);
                        break;
                    }
                }
            }
        }
    },

    onEnterDeskResult(msg){
        if(msg.code === 200){
            if (MsgId.CLUB_SWITCH_GAME === msg.c) {
                msg.response.deskInfo.isReconnect = true;
            }
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
            } else if(msg.response.deskInfo.conf.gameid === 5 || msg.response.deskInfo.conf.gameid === 6){
                if(cc.vv.gameData === null){
                    let data = require("HongHeiHu_GameData");
                    cc.vv.gameData = new data();
                    cc.vv.gameData.init(msg.response.deskInfo);
                    cc.vv.SceneMgr.enterScene("hongheihu");
                }
            } else if(msg.response.deskInfo.conf.gameid === 7 || msg.response.deskInfo.conf.gameid === 8){
                if(cc.vv.gameData === null){
                    let data = require("LiuHuQiang_GameData");
                    cc.vv.gameData = new data();
                    cc.vv.gameData.init(msg.response.deskInfo);
                    cc.vv.SceneMgr.enterScene("liuhuqiang");
                }
            } else if(msg.response.deskInfo.conf.gameid === 9 || msg.response.deskInfo.conf.gameid === 10){
                if(cc.vv.gameData === null){
                    let data = require("PaoDeKuai_GameData");
                    cc.vv.gameData = new data();
                    cc.vv.gameData.init(msg.response.deskInfo);
                    cc.vv.SceneMgr.enterScene("paodekuai");
                }
            } else if(msg.response.deskInfo.conf.gameid === 11 || msg.response.deskInfo.conf.gameid === 12){
                if(cc.vv.gameData === null){
                    let data = require("HongZhong_GameData");
                    cc.vv.gameData = new data();
                    cc.vv.gameData.init(msg.response.deskInfo);
                    cc.vv.SceneMgr.enterScene("hongzhong");
                }
            } else if(msg.response.deskInfo.conf.gameid === 13 || msg.response.deskInfo.conf.gameid === 14){
                if(cc.vv.gameData === null){
                    let data = require("ShiHuKa_GameData");
                    cc.vv.gameData = new data();
                    cc.vv.gameData.init(msg.response.deskInfo);
                    cc.vv.SceneMgr.enterScene("shihuka");
                }
            } else if(msg.response.deskInfo.conf.gameid === 15 || msg.response.deskInfo.conf.gameid === 16){
                if(cc.vv.gameData === null){
                    let data = require("TongHua_GameData");
                    cc.vv.gameData = new data();
                    cc.vv.gameData.init(msg.response.deskInfo);
                    cc.vv.SceneMgr.enterScene("tonghua");
                }
            }
        }
    },

    onRcvAddTableMsg(msg){
        if(msg.code === 200){
            let deskInfo = msg.response.addDeskInfo;
            if (deskInfo.config.clubid === cc.vv.UserManager.currClubId) {
                this._tableList.unshift(deskInfo);
                this.initTables(this._tableList);
            }
        }
    },

    onClickBackRoom(){
        if (Global.curRoomID) {
            this.sendEnterRoomMsg(Global.curRoomID);
        } else {
            this.sendEnterRoomMsg(0);
        }
    },

    // 加入桌子
    onEnterDesk(event){
        let deskId = event.target._deskId;
        if (Global.curRoomID && Global.curRoomID != deskId) {
            let self = this;
            let sureCall = function () {
                self.sendExitRoomMsg();
                self.newDeskId = deskId;
            }
            let cancelCall = function () {
            }
            cc.vv.AlertView.show("是否退出另一桌子,进入当前桌", sureCall, cancelCall)
        } else {
            this.sendEnterRoomMsg(deskId);
        }
    },

    sendExitRoomMsg(){
        var req = { c: MsgId.GAME_LEVELROOM };
        req.deskid = Global.curRoomID;
        cc.vv.NetManager.send(req);

        Global.curRoomID = "";
    },

    onRcvNetExitRoom(msg) {
        if (msg.code === 200) {
            if (this.newDeskId) {
                this.sendEnterRoomMsg(this.newDeskId);
            }
            this.newDeskId = '';
        }
    },

    sendEnterRoomMsg(deskId){
        var req = { 'c': MsgId.SEATDOWN};
        req.clubid = cc.vv.UserManager.currClubId;
        req.deskId = deskId;
        cc.vv.NetManager.send(req);

        Global.curRoomID = "";
    },

    // 更新桌子信息
    initTable(item,config,data){
        let type = cc.find("node/type_bg",item);
        type.getComponent(cc.Sprite).spriteFrame = this.wanfaAtlas.getSpriteFrame("hallClub-img-table-moreRule-index_" +
            config.playtype);

        let tableName = cc.find("node/img_roomId/table_name",item);
        tableName.getComponent(cc.Label).string = config.tname;

        let round = cc.find("node/img_round/txt_round",item);
        round.getComponent(cc.Label).string = data.round + "/" + config.gamenum + "局";

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
            bg.getComponent(cc.Sprite).spriteFrame = config.seat === 4 ? this.tableBgs[0] : this.tableBgs[1];
        } else if (2 == config.gameid) {
            bg.getComponent(cc.Sprite).spriteFrame = this.tableBgs[2];
        } else if (5 == config.gameid) {
            bg.getComponent(cc.Sprite).spriteFrame = this.tableBgs[3];
        } else if (7 == config.gameid) {
            bg.getComponent(cc.Sprite).spriteFrame = config.seat === 4 ? this.tableBgs[4] : this.tableBgs[5];
        } else if (9 == config.gameid) {
            bg.getComponent(cc.Sprite).spriteFrame = config.seat === 4 ? this.tableBgs[6] : this.tableBgs[7];
        } else if (11 == config.gameid) {
            bg.getComponent(cc.Sprite).spriteFrame = this.tableBgs[8];
        } else if (13 == config.gameid) {
            bg.getComponent(cc.Sprite).spriteFrame = this.tableBgs[9];
        } else if (15 == config.gameid) {
            bg.getComponent(cc.Sprite).spriteFrame = this.tableBgs[10];
        }
            
        tableChar.active = true;
        
        let bInRoomMask = cc.find("node/bInRoomMask",item);
        bInRoomMask.active = false;
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
                    headNode.getChildByName("img_ready").active = users[j].state === 1;
                }
                if (Global.curRoomID && Global.curRoomID == data.deskid) {
                    if (users[j].uid == cc.vv.UserManager.uid) {
                        bInRoomMask.position = cc.v2(-5, 80);
                        bInRoomMask.active = true;
                        bInRoomMask.stopAllActions();
                        bInRoomMask.runAction(
                            cc.repeatForever(
                                cc.sequence(
                                    cc.moveTo(0.3, cc.v2(-5, 90)),
                                    cc.moveTo(0.3, cc.v2(-5, 80))
                                )
                            )
                        )
                    }
                }
            }
        }

        let btn_tableOperate = cc.find("node/btn_tableOperate",item);
        btn_tableOperate.active = this.getIsManager();
        btn_tableOperate.tableInfo = data;
        Global.btnClickEvent(btn_tableOperate,this.onClickShowTableOperate,this);
    },

    initTables(list){
        if (this.showRuleInfo) {
            let showTableList = [];
            for (let i = 0; i < list.length; i++) {
                if (list[i].config.gameid == this.showRuleInfo.config.gameid &&
                    list[i].config.gamenum == this.showRuleInfo.config.gamenum &&
                    list[i].config.seat == this.showRuleInfo.config.seat &&
                    list[i].config.score == this.showRuleInfo.config.score &&
                    list[i].config.param1 == this.showRuleInfo.config.param1 &&
                    list[i].config.param2 == this.showRuleInfo.config.param2) {
                    showTableList.push(list[i]);
                }
            }
            list = showTableList;
        }

        list.sort((obj1, obj2)=>{
            let obj2UserNum = (obj2.users.length || 0);
            let obj1UserNum = (obj1.users.length || 0);
            let obj2SeatRateState = (obj2UserNum == obj2.config.seat) ? 1 : 0;
            if (0 < obj2UserNum && obj2UserNum < obj2.config.seat) {
                obj2SeatRateState = 2;
            }
            let obj1SeatRateState = (obj1UserNum == obj1.config.seat) ? 1 : 0;
            if (0 < obj1UserNum && obj1UserNum < obj1.config.seat) {
                obj1SeatRateState = 2;
            }

            if (obj2SeatRateState == obj1SeatRateState) {
                if (obj2UserNum == obj1UserNum) {
                    return -(obj2.config.playtype - obj1.config.playtype);              //3.玩法从小到大
                } else {
                    return obj2UserNum - obj1UserNum;                                   //2.人数从多到少
                }
            } else {
                return obj2SeatRateState - obj1SeatRateState;                           //1.占座率: 未坐满 > 坐满 > 空
            }
        });

        let width = 0;
        for(let i=0;i<list.length;++i){
            let config = list[i].config;
            let item = null;
            if(i < this._content.childrenCount) {
                item = this._content.children[i];
            } else {
                item = cc.instantiate(this._content.children[0]);
                item.parent = this._content;
                Global.btnClickEvent(cc.find("node/img_click",item),this.onEnterDesk,this);
            }
            item.active = true;
            let clickBtn = cc.find("node/img_click",item);
            clickBtn._deskId = list[i].deskid;
            item._deskId = list[i].deskid;

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

    setPower(power){
        cc.find("Layer/bg/power_bg/text_power", this.node).getComponent(cc.Label).string = power.toFixed(2);
    },

    onClickInviteToWx(){
        let des = "我在闲乐棋牌的亲友圈ID是" + this._clubInfo.clubid + "，赶快来加入吧"
        Global.onWXShareText(Global.ShareSceneType.WXSceneSession, "亲友圈邀请", des);
    },

    onClickPowerRecord(){
        this.ClubPowerRecordJS.showLayer();
    },

    onClickInviteJoin(){
        this.ClubInviteJoinJS.showLayer();
    },

    onClickMsg(){
        this.ClubPlayerInOutRecordJS.showLayer();
        this.spr_redPoint.active = false;
    },

    onClickSetting(){
        this.ClubSettingJS.showClubSetting();
    },

    onCreateRoom(){
        this.CreateRoomJS.showCreateRoom(true);
    },

    onClickMember(){
        Global.checkPartnerList = [];
        Global.checkPartnerListCurStartIndex = [];
        Global.curStartIndex = 0;
        this.ClubMemberJS.showLayer();
    },

    onClickRecord(){
        this.ClubRecordJS.showLayer();
    },

    onClickHideRuleSelect(){
        this.setRuleSelectShow(false);
    },

    onClickAllRuleSelect(){
        this.showRuleInfo = null;
        this.initTables(this._tableList);
        this.setRuleSelectShow(false);
    },

    onClickRuleSelect(){
        this.setRuleSelectShow(!this.panel_ruleSelect.active);
    },

    setRuleSelectShow(isShow){
        this.panel_ruleSelect.active = isShow;
        if (isShow) {
            this.ruleSelectContent.removeAllChildren();
            let tableTypeList = [];
            for (let i = 0; i < this._tableList.length; i++) {
                let j = 0;
                for (j = 0; j < tableTypeList.length; j++) {
                    if (this._tableList[i].config.gameid == tableTypeList[j].config.gameid &&
                        this._tableList[i].config.gamenum == tableTypeList[j].config.gamenum &&
                        this._tableList[i].config.seat == tableTypeList[j].config.seat &&
                        this._tableList[i].config.score == tableTypeList[j].config.score &&
                        this._tableList[i].config.param1 == tableTypeList[j].config.param1 &&
                        this._tableList[i].config.param2 == tableTypeList[j].config.param2) {
                        tableTypeList[j].onlineNum += this._tableList[i].users.length || 0;
                        break;
                    }
                }
                if (j == tableTypeList.length) {
                    tableTypeList.push(this._tableList[i]);
                    tableTypeList[tableTypeList.length-1].onlineNum = this._tableList[i].users.length || 0;
                }
            }
            for (let i = 0; i < tableTypeList.length; i++) {
                let item =  cc.instantiate(this.ruleSelectItem);
                item.parent = this.ruleSelectContent;
                item.y = - item.height * i;
                item.getChildByName("text_index").getComponent(cc.Label).string = i + 1;
                item.getChildByName("text_gameName").getComponent(cc.Label).string = Global.getGameName(tableTypeList[i].config.gameid);
                item.getChildByName("text_onlineNum").getComponent(cc.Label).string = tableTypeList[i].onlineNum + "人在线";
                item.getChildByName("text_round").getComponent(cc.Label).string = tableTypeList[i].config.gamenum + "局";
                item.getChildByName("text_playerNum").getComponent(cc.Label).string = tableTypeList[i].config.seat + "人";
                let ruleStr = (tableTypeList[i].config.score + "倍 ");
                switch(tableTypeList[i].config.gameid) {
                    case 1:
                        ruleStr += ["连中","中庄x2","四首相乘"][tableTypeList[i].config.param1];
                        break;
                    case 2:
                        ruleStr += ["蚂蚁上树","见三加一","见六加一"][tableTypeList[i].config.param1-1];
                        break;
                    case 5:
                        ruleStr += ["一胡一分","1分底","2分底","3分底","4分底","5分底"][tableTypeList[i].config.param1];
                        break;
                    case 7:
                        ruleStr += ["一胡一分","三胡一分"][tableTypeList[i].config.param1];
                        ruleStr += " ";
                        ruleStr += ["不带醒","翻醒","随醒"][tableTypeList[i].config.param2];
                        break;
                    case 9:
                        ruleStr += ["不扎鸟","红桃10扎鸟翻倍","红桃10扎鸟+5分","红桃10扎鸟+10分"][tableTypeList[i].config.param1];
                        break;
                    case 11:
                        ruleStr += ["不抓鸟","抓2鸟","抓4鸟","抓6鸟"][tableTypeList[i].config.param1/2];
                        break;
                    case 13:
                        ruleStr += ["一胡一分","三胡一分"][tableTypeList[i].config.param1];
                        ruleStr += " ";
                        ruleStr += ["不带醒","翻醒","随醒"][tableTypeList[i].config.param2];
                        break;
                    case 15:
                        ruleStr += tableTypeList[i].config.param1 + "副牌";
                        ruleStr += " ";
                        ruleStr += ["不显示剩余牌","显示剩余牌"][tableTypeList[i].config.param2];
                        break;
                }
                item.getChildByName("text_rule").getComponent(cc.Label).string = ruleStr;
                item.tableInfo = tableTypeList[i];
                Global.btnClickEvent(item, this.onClickSelectGame,this);
                item.active = true;
            }
            this.ruleSelectContent.height = this.ruleSelectItem.height * tableTypeList.length;
        }
    },

    onClickSelectGame(event){
        this.showRuleInfo = event.target.tableInfo;
        this.initTables(this._tableList);
        this.setRuleSelectShow(false);
    },

    onClickCloseTableOperate(){
        this.panel_tableOperate.active = false;
    },

    onClickShowTableOperate(event){
        let tableInfo = event.target.tableInfo;
        for (let i = 0; i < this._tableList.length; i++) {
            if (this._tableList[i].deskid == tableInfo.deskid) {
                if (0 < this._tableList[i].users.length) {
                    cc.vv.FloatTip.show("以有人坐下的桌子，不能删除或修改玩法");
                    return;
                }
            }
        }
        this.panel_tableOperate.getChildByName("text_tip").getComponent(cc.Label).string = "当前操作桌子:" + tableInfo.config.tname;
        this.btn_deleteTable.deskid = tableInfo.deskid;
        tableInfo.config.deskid = tableInfo.deskid;
        this.btn_modifyTable.config = tableInfo.config;
        this.panel_tableOperate.active = true;
    },

    onClickDeleteTable(event){
        this.panel_tableOperate.active = false;
        let deskid = event.target.deskid;
        let sureCall = function () {
            var req = { c: MsgId.CLUB_DELETE_TABLE};
            req.clubid = cc.vv.UserManager.currClubId;
            req.deskid = deskid;
            cc.vv.NetManager.send(req);
        }
        let cancelCall = function () {
        }
        cc.vv.AlertView.show("是否确实删除桌子："+deskid, sureCall, cancelCall);
    },

    onClickModifyTable(event){
        this.panel_tableOperate.active = false;
        this.CreateRoomJS.showCreateRoom(true, event.target.config);
    },

    onBack(){
        if (Global.curRoomID) {
            let self = this;
            let sureCall = function () {
                self.sendExitRoomMsg();
                this.newDeskId = '';
                self.sendExitClubMsg();
                cc.vv.SceneMgr.enterScene("club_lobby");
            }
            let cancelCall = function () {
            }
            cc.vv.AlertView.show("返回大厅将会退出当前桌子", sureCall, cancelCall)
        } else {
            this.sendExitClubMsg();
            cc.vv.SceneMgr.enterScene("club_lobby");
        }
    },

    sendExitClubMsg(){
        var req = { 'c': MsgId.BACK_GAME};
        req.clubid = cc.vv.UserManager.currClubId;
        cc.vv.NetManager.send(req);
    },

    onDestroy(){
        this.unregisterMsg();
    }
    // update (dt) {},
});
