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
        _panelSettingNode:null,
        _startPos:null,
        _canClick:true,
        _clickNode:null,
        _clickBtnSeat:-1,
        _isPlaying:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.registerMsg();

        this.readyBtn = cc.find("scene/operate_btn_view/ready_btn",this.node);
        Global.btnClickEvent(this.readyBtn,this.onReady,this);
        
        let setting = cc.find("scene/operate_btn_view/btn_setting",this.node);
        Global.btnClickEvent(setting,this.onClickSetting,this);

        this._panelSettingNode = cc.find("scene/panel_setting",this.node);
        this._panelSettingNode.getComponent(cc.Widget).updateAlignment();
        this._panelSettingNode.getComponent(cc.Widget).enabled = false;
        this._startPos = cc.v2(this._panelSettingNode.x,this._panelSettingNode.y);
        this._clickNode = this._panelSettingNode.getChildByName("button");
        Global.btnClickEvent(this._clickNode,this.onClose,this);
        this._clickNode.active = false;

        let exit = cc.find("btn_leave",this._panelSettingNode);
        Global.btnClickEvent(exit,this.onClickDismiss,this);

        let btn_dismiss = this._panelSettingNode.getChildByName("btn_dismiss");
        Global.btnClickEvent(btn_dismiss,this.onClickDismiss,this);
        this.panel_dismiss = cc.find("scene/panel_dismiss",this.node);
        this.panel_dismiss.zIndex = 2;
        this.panel_dismiss.active = false;
        this.dismiss_small_bg = this.panel_dismiss.getChildByName("dismiss_small_bg");
        this.dismiss_big_bg = this.panel_dismiss.getChildByName("dismiss_big_bg");

        let btn_cancel = cc.find("dismiss_small_bg/btn_cancel",this.panel_dismiss);
        Global.btnClickEvent(btn_cancel,this.onClickCancelDismiss,this);
        let btn_close_dismiss = cc.find("dismiss_small_bg/btn_close_dismiss",this.panel_dismiss);
        Global.btnClickEvent(btn_close_dismiss,this.onClickCancelDismiss,this);
        let btn_define = cc.find("dismiss_small_bg/btn_define",this.panel_dismiss);
        Global.btnClickEvent(btn_define,this.onClickDefineDismiss,this);
        
        let btn_agree = cc.find("dismiss_big_bg/btn_agree",this.panel_dismiss);
        Global.btnClickEvent(btn_agree,this.onClickAgreeDismiss,this);
        let btn_refuse = cc.find("dismiss_big_bg/btn_refuse",this.panel_dismiss);
        Global.btnClickEvent(btn_refuse,this.onClickRefuseDismiss,this);

        let settingBtn = this._panelSettingNode.getChildByName("btn_setting");
        Global.btnClickEvent(settingBtn,this.onShowSetting,this);

        let btn_close = this._panelSettingNode.getChildByName("btn_close");
        Global.btnClickEvent(btn_close,this.onClose,this);

        let btn_invite_wx = cc.find("scene/operate_btn_view/btn_invite_wx",this.node)
        Global.btnClickEvent(btn_invite_wx,this.onClickInviteToWx,this);
        
        let btn_copy_roomId = cc.find("scene/operate_btn_view/btn_copy_roomId",this.node)
        Global.btnClickEvent(btn_copy_roomId,this.onClickCopyRoomInfoOpenWx,this);

        this.btn_gps = cc.find("scene/operate_btn_view/btn_gps",this.node);
        this.btn_gps.btnID = -1;
        Global.btnClickEvent(this.btn_gps,this.onClickGPS,this);
        this.setGpsBtnColour(1);

        for (let i = 0; i < cc.vv.gameData.RoomSeat; i++) {
            let head = cc.find("scene/player" + i + "/head",this.node);
            head.btnID = i;
            Global.btnClickEvent(head,this.onClickGPS,this);
        }

        this.panel_gps = cc.find("scene/panel_gps",this.node);
        this.onSetShowGps(false);

        this.panel_player = cc.find("scene/panel_player",this.node);
        this.panel_player.active = false;
        let mask = this.panel_player.getChildByName("mask");
        Global.btnClickEvent(mask,this.onClickClosePlayerInfo,this);

        let btn_exit = cc.find("spr_bg/btn_exit", this.panel_gps);
        Global.btnClickEvent(btn_exit,this.onClickExitGame,this);
        let btn_continue = cc.find("spr_bg/btn_continue", this.panel_gps);
        Global.btnClickEvent(btn_continue,this.onClickContinueGame,this);

        let btn_helper = cc.find("scene/btn_helper",this.node);
        btn_helper.active = cc.vv.UserManager.currClubId;
        btn_helper.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        btn_helper.on(cc.Node.EventType.TOUCH_END,this.onClickSwitchToClub,this);

        // if (Global.isNative()) {
        //     let btn_voice = cc.find("scene/operate_btn_view/btn_voice",this.node);
        //     btn_voice.on(cc.Node.EventType.TOUCH_START,this.onTouchVoiceBtnStart,this);
        //     btn_voice.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchVoiceBtnMove,this);
        //     btn_voice.on(cc.Node.EventType.TOUCH_END,this.onTouchVoiceBtnEnd,this);
        //     btn_voice.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCanVoiceBtncel,this);
        // }

        let btn_cancelTrustee = cc.find("scene/panel_trustee/btn_cancelTrustee", this.node);
        Global.btnClickEvent(btn_cancelTrustee,this.onClickCancelTrustee,this);

        Global.registerEvent(EventId.CLOSE_ROUNDVIEW,this.recvCloseRoundView,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.READY_NOTIFY,this.onRcvReadyNotice,this);
        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.PLAYER_DISTANCE_DATA, this.onRcvPlayersDistanceData,this);
        Global.registerEvent(EventId.GPS_TIPS_NOTIFY, this.onRcvGpsTipsNotify,this);
        Global.registerEvent(EventId.DISMISS_NOTIFY, this.onRcvDismissNotify,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);

        this.recvDeskInfoMsg();
    },

    recvRoundOver(){
        // this.panel_dismiss.active = false;
        this.readyBtn.active = false;
    },

    onClickCancelTrustee(event){
        let req = {c: MsgId.CANCEL_TRUSTEE};
        cc.vv.NetManager.send(req);
    },

    onTouchVoiceBtnStart(event){
        this.VoiceBtnTouching = true;
        cc.log("onTouchVoiceBtnStart");
        Global.startRecord();
    },

    onTouchVoiceBtnMove(event){
        this.VoiceBtnTouching = false;
    },

    onTouchVoiceBtnEnd(event){
        if (this.VoiceBtnTouching) {
            this.VoiceBtnTouching = false;
            Global.stopRecord();
        }
    },

    onTouchCanVoiceBtncel(event){
        this.VoiceBtnTouching = false;
    },

    onClickSwitchToClub(event){
        if (!this.bMoving) {
            let req = {c: MsgId.GAME_SWITCH_CLUB};
            cc.vv.NetManager.send(req);
        }
        this.bMoving = false;
    },

    onTouchMove(event){
        this.bMoving = true;
        event.target.y += event.getDelta().y;
    },

    onRcvDismissNotify(data){
        this.panel_dismiss.active = true;

        if (MsgId.APPLY_DISMISS_NOTIFY == data.detail.c || MsgId.AGREE_DISMISS_NOTIFY == data.detail.c) {
            let dissolveInfo = data.detail.dissolveInfo;
            if (!dissolveInfo) {
                return;
            }
            this.dismiss_small_bg.active = false;
            this.dismiss_big_bg.active = true;

            this.dismiss_big_bg.getChildByName("text_title").getComponent(cc.Label).string = "申请解散游戏";

            let tipStr = "玩家[" + dissolveInfo.startPlayername + "]申请解散游戏，等待其他玩家选择，超过[" + dissolveInfo.time + "]秒未做选择，则默认同意！"
            this.dismiss_big_bg.getChildByName("text_tip").getComponent(cc.Label).string = tipStr;

            let selfIsAgree = true;
            let playerStateNode = this.dismiss_big_bg.getChildByName("playerStateNode");
            playerStateNode.removeAllChildren();
            let text_palyerStateTemplate = this.dismiss_big_bg.getChildByName("text_palyerStateTemplate");
            let posY = 0;
            for (var i = 0; i < dissolveInfo.agreeUsers.length; i++) {
                if (dissolveInfo.startUid != dissolveInfo.agreeUsers[i].uid) {
                    let text_palyerState = cc.instantiate(text_palyerStateTemplate);
                    text_palyerState.active = true;
                    text_palyerState.parent = playerStateNode;
                    text_palyerState.x = 0;
                    text_palyerState.y = posY;
                    posY -=30;
                    if (1 == dissolveInfo.agreeUsers[i].isargee) {
                        text_palyerState.getComponent(cc.Label).string = "【" + dissolveInfo.agreeUsers[i].playername + "】同意解散";
                        text_palyerState.color = new cc.Color(0,180,0);
                    } else {
                        text_palyerState.getComponent(cc.Label).string = "【" + dissolveInfo.agreeUsers[i].playername + "】等待选择";
                        text_palyerState.color = new cc.Color(227,80,26);
                        if (cc.vv.UserManager.uid == dissolveInfo.agreeUsers[i].uid) {
                            selfIsAgree = false;
                        }
                    }
                }
            }

            this.dismiss_big_bg.getChildByName("btn_agree").active = !selfIsAgree;
            this.dismiss_big_bg.getChildByName("btn_refuse").active = !selfIsAgree;
            
            if (MsgId.APPLY_DISMISS_NOTIFY == data.detail.c) {
                let text_downCount = this.dismiss_big_bg.getChildByName("text_downCount");
                text_downCount.getComponent(cc.Label).string = dissolveInfo.distimeoutIntervel;
                text_downCount.runAction(
                    cc.repeatForever(
                        cc.sequence(
                            cc.delayTime(1), 
                            cc.callFunc(()=>{
                                text_downCount.getComponent(cc.Label).string = --dissolveInfo.distimeoutIntervel;
                                if (0 == dissolveInfo.distimeoutIntervel) {
                                    text_downCount.stopAllActions();
                                }
                            })
                        )
                    )
                )
            }

        } else if (MsgId.REFUSE_DISMISS_NOTIFY == data.detail.c || MsgId.SUCCESS_DISMISS_NOTIFY == data.detail.c){
            //大厅房+未开始，收到解散成功消息后直接退出
            if (!cc.vv.UserManager.currClubId && !this._isPlaying) {
                this.onClickExitToHall();
                return;
            }            
            this.dismiss_small_bg.active = true;
            this.dismiss_big_bg.active = false;
            this.dismiss_big_bg.getChildByName("text_downCount").stopAllActions();
            
            this.dismiss_small_bg.getChildByName("text_title").getComponent(cc.Label).string = "提示";
            let tipStr = "游戏解散成功";
            if (MsgId.REFUSE_DISMISS_NOTIFY == data.detail.c) {
                tipStr = "游戏解散失败！玩家[" + data.detail.playername + "]不同意解散";
            }
            this.dismiss_small_bg.getChildByName("text_tip").getComponent(cc.Label).string = tipStr;

            this.dismiss_small_bg.getChildByName("btn_cancel").active = false;
            this.dismiss_small_bg.getChildByName("btn_define").active = false;
            this.dismiss_small_bg.getChildByName("btn_close_dismiss").active = true;
        }
    },

    onClickDismiss(){
        let createUid = cc.vv.gameData.getRoomConf().createUserInfo.uid;
        this.panel_dismiss.active = true;
        this.dismiss_small_bg.active = true;
        this.dismiss_big_bg.active = false;
        this.dismiss_small_bg.getChildByName("btn_cancel").active = true;
        this.dismiss_small_bg.getChildByName("btn_define").active = true;
        this.dismiss_small_bg.getChildByName("btn_close_dismiss").active = false;
        if (this._isPlaying) {  //游戏中
            this.dismiss_small_bg.getChildByName("text_title").getComponent(cc.Label).string = "解散游戏";
            this.dismiss_small_bg.getChildByName("text_tip").getComponent(cc.Label).string = "您正在申请解散游戏操作，是否确认？";
        } else {                //未开始游戏
            if (createUid == cc.vv.UserManager.uid) {   //房主
                if (cc.vv.UserManager.currClubId) {
                    this.dismiss_small_bg.getChildByName("text_title").getComponent(cc.Label).string = "离开游戏";
                } else {
                    this.dismiss_small_bg.getChildByName("text_title").getComponent(cc.Label).string = "解散游戏";
                }
                this.dismiss_small_bg.getChildByName("text_tip").getComponent(cc.Label).string = "解散游戏后返还豆，是否确定解散？";
            } else {
                this.dismiss_small_bg.getChildByName("text_title").getComponent(cc.Label).string = "返回大厅";
                this.dismiss_small_bg.getChildByName("text_tip").getComponent(cc.Label).string = "您确定要离开游戏吗？";
            }
        }
    },

    onClickCancelDismiss(){
        this.panel_dismiss.active = false;
    },

    onClickExitToHall(){
        let createUid = cc.vv.gameData.getRoomConf().createUserInfo.uid;
        if (createUid == cc.vv.UserManager.uid) {
            cc.vv.FloatTip.show("游戏已解散");
        } else {
            cc.vv.FloatTip.show("游戏已被创建者解散");
        }
        // cc.vv.SceneMgr.enterScene('lobby');
        cc.vv.gameData.onRcvNetExitRoom({code:200});
    },

    onClickDefineDismiss(){
        //游戏已开始：               发解散
        //游戏未开始，俱乐部房+房主： 发退出
        //           俱乐部房+闲家： 发退出
        //             大厅房+房主： 发解散
        //             大厅房+闲家： 发退出
        if (this._isPlaying) {
            let roomConf = cc.vv.gameData.getRoomConf();
            if (0 == roomConf.isdissolve) {
                this.panel_dismiss.active = false;
                cc.vv.FloatTip.show("该房间不可解散");
                return;
            }
        }
        let createUid = cc.vv.gameData.getRoomConf().createUserInfo.uid;
        this.panel_dismiss.active = false;
        if (this._isPlaying || (createUid == cc.vv.UserManager.uid) && !cc.vv.UserManager.currClubId) {
            let req = {c: MsgId.APPLY_DISMISS};
            cc.vv.NetManager.send(req);
        } else {
            this.onExit();
        }
    },

    onClickAgreeDismiss(){
        let req = {c: MsgId.AGREE_DISMISS};
        cc.vv.NetManager.send(req);
    },

    onClickRefuseDismiss(){
        let req = {c: MsgId.REFUSE_DISMISS};
        cc.vv.NetManager.send(req);
    },

    //1绿色，2黄色，3红色
    setGpsBtnColour(colour){
        cc.find("btn_ani/GPS_Green",this.btn_gps).active = (1 == colour);
        cc.find("btn_ani/GPS_Red",this.btn_gps).active = (3 == colour);
        cc.find("btn_ani/GPS_Yellow",this.btn_gps).active = (2 == colour);
    },

    onClickGPS(event){
        let btnID = event.target.btnID
        this._clickBtnSeat = parseInt(btnID);
        let req = {c: MsgId.PLAYER_DISTANCE_DATA};
        cc.vv.NetManager.send(req);
    },

    onClickExitGame(){
        this.onSetShowGps(false);
        this.onExit();
    },

    onClickContinueGame(){
        this.onSetShowGps(false);
    },

    onSetShowGps(isShow, data){
        this.panel_gps.active = isShow;
        if (isShow && data && data.locatingList) {
            let panel_gps_bg = this.panel_gps.getChildByName("spr_bg");
            let locatingList = data.locatingList;
            let maxSeat = cc.vv.gameData.getRoomConf().seat;
            for (var i = 2; i <= 4; i++) {
                panel_gps_bg.getChildByName("node_" + i + "player").active = (maxSeat == i);
            }
            let node_players = panel_gps_bg.getChildByName("node_" + maxSeat + "player");
            let isShowHeadTag = [];
            for (var i = 0; i < maxSeat; i++) {
                isShowHeadTag.push(false);
            }
            for (var i = 0; i < locatingList.length; i++) {
                let localSeat = cc.vv.gameData.getLocalChair(locatingList[i].seat);
                isShowHeadTag[localSeat] = true;
                let ndoe_player = node_players.getChildByName("ndoe_player" + localSeat);
                ndoe_player.getChildByName("GPS_Green").active = (1 == locatingList[i].headColour);
                ndoe_player.getChildByName("GPS_Red").active = (2 == locatingList[i].headColour);
                let spr_head = cc.find("radio_mask/spr_head", ndoe_player);
                spr_head.active = true;
                Global.setHead(spr_head,locatingList[i].usericon);

                let toOtherPlayerData = locatingList[i].data;
                let isShowLineTag = [];
                for (var j = 0; j < maxSeat - 1; j++) {
                    isShowLineTag.push(false);
                }
                for (var j = 0; j < toOtherPlayerData.length; j++) {
                    let toLocalSeat = cc.vv.gameData.getLocalChair(toOtherPlayerData[j].seat);
                    if (localSeat < toLocalSeat) {
                        isShowLineTag[toLocalSeat] = true;
                        let ndoe_line = node_players.getChildByName("ndoe_line" + localSeat + toLocalSeat);
                        ndoe_line.getChildByName("line_green").active = (1 == toOtherPlayerData[j].gpsColour);
                        ndoe_line.getChildByName("line_red").active = (2 == toOtherPlayerData[j].gpsColour);
                        if (0 < toOtherPlayerData[j].locating) {
                            let numForShort = Math.floor(toOtherPlayerData[j].locating * 10) / 10;
                            ndoe_line.getChildByName("text_distance").getComponent(cc.Label).string = numForShort + "米";
                            if (1 == toOtherPlayerData[j].gpsColour) {
                                ndoe_line.getChildByName("text_distance").color = new cc.Color(0,150,0);
                            } else if (2 == toOtherPlayerData[j].gpsColour) {
                                ndoe_line.getChildByName("text_distance").color = new cc.Color(150,0,0);
                            } else {
                                ndoe_line.getChildByName("text_distance").color = new cc.Color(134,90,46);
                            }
                        }
                    }
                }
                //还原线
                for (var j = 0; j < maxSeat; j++) {
                    if (!isShowLineTag[j]) {
                        let toLocalSeat = j;
                        if (localSeat < toLocalSeat) {
                            let ndoe_line = node_players.getChildByName("ndoe_line" + localSeat + toLocalSeat);
                            ndoe_line.getChildByName("line_green").active = false;
                            ndoe_line.getChildByName("line_red").active = false;
                            ndoe_line.getChildByName("text_distance").getComponent(cc.Label).string = "未知距离";
                            ndoe_line.getChildByName("text_distance").color = new cc.Color(134,90,46);
                        }
                    }
                }
            }
            //还原头像
            for (var i = 0; i < maxSeat; i++) {
                if (!isShowHeadTag[i]) {
                    let localSeat = i;
                    let ndoe_player = node_players.getChildByName("ndoe_player" + localSeat);
                    ndoe_player.getChildByName("GPS_Green").active = false;
                    ndoe_player.getChildByName("GPS_Red").active = false;
                    cc.find("radio_mask/spr_head", ndoe_player).active = false;
                    //还原线
                    for (var j = 0; j < maxSeat; j++) {
                        let toLocalSeat = j;
                        if (localSeat < toLocalSeat) {
                            let ndoe_line = node_players.getChildByName("ndoe_line" + localSeat + toLocalSeat);
                            ndoe_line.getChildByName("line_green").active = false;
                            ndoe_line.getChildByName("line_red").active = false;
                            ndoe_line.getChildByName("text_distance").getComponent(cc.Label).string = "未知距离";
                            ndoe_line.getChildByName("text_distance").color = new cc.Color(134,90,46);
                        }
                    }
                }
            }
        }
    },

    onRcvPlayersDistanceData(data){
        if (-1 == this._clickBtnSeat) {
            this.onSetShowGps(true, data.detail);
        } else {
            let localSeat = cc.vv.gameData.getLocalSeatByUISeat(this._clickBtnSeat);
            this.onShowPlayerInfo(localSeat, data.detail);
        }
    },

    onClickClosePlayerInfo(){
        this.panel_player.active = false;
    },

    onShowPlayerInfo(clickLocalSeat, data){
        this.panel_player.active = true;
        let self_bg = this.panel_player.getChildByName("self_bg");
        self_bg.active = false;
        let other_bg = this.panel_player.getChildByName("other_bg");
        other_bg.active = false;
        var panel_show = (0 == clickLocalSeat) ? self_bg : other_bg;

        //gsltest
        let spr_chat = panel_show.getChildByName("spr_chat");
        Global.btnClickEvent(spr_chat,()=>{
            // Global.dispatchEvent(EventId.TEST_EVENT)
        });

        if (data && data.locatingList) {
            let locatingList = data.locatingList;
            for (var i = 0; i < locatingList.length; i++) {
                let localSeat = cc.vv.gameData.getLocalChair(locatingList[i].seat);
                if (clickLocalSeat == localSeat) {
                    let spr_head = cc.find("head/radio_mask/spr_head", panel_show);
                    Global.setHead(spr_head, locatingList[i].usericon);

                    cc.find("node_bean/txet_beanNum", panel_show).getComponent(cc.Label).string = cc.vv.UserManager.coin;
                    cc.find("node_roomCard/txet_roomCardNum", panel_show).getComponent(cc.Label).string = cc.vv.UserManager.roomcard;
                    panel_show.getChildByName("txet_name").getComponent(cc.Label).string = "昵称：" + locatingList[i].playername;
                    panel_show.getChildByName("txet_ID").getComponent(cc.Label).string = "游戏ID：" + locatingList[i].uid;
                    panel_show.getChildByName("txet_IP").getComponent(cc.Label).string = "IP：" + locatingList[i].ip;
                    panel_show.getChildByName("txet_GPS").getComponent(cc.Label).string = locatingList[i].isOpen ? "定位已开启" : "未开启定位";
                    let toOtherPlayerData = locatingList[i].data;
                    let distanceStr = "";
                    for (var j = 0; j < toOtherPlayerData.length; j++) {
                        distanceStr += "距离 " + toOtherPlayerData[j].playername + " ";
                        if (0 < toOtherPlayerData[j].locating) {
                            let numForShort = Math.floor(toOtherPlayerData[j].locating * 10) / 10;
                            distanceStr += numForShort + "米\n";
                        } else {
                            distanceStr += "未知距离\n";
                        }
                    }
                    panel_show.getChildByName("txet_distance").getComponent(cc.Label).string = distanceStr;

                    if (0 < clickLocalSeat) {
                        let prefabRes = this.node.getChildByName("prefabRes");
                        let content = cc.find("daoju_bg/scrollview/view/content", panel_show)
                        content.removeAllChildren(true);
                        let tempItem = cc.find("daoju_bg/scrollview/view/item_daoju", panel_show);
                        tempItem.active = false;
                        for (var j = 0; j < cc.vv.UserManager.daojuList.length; j++) {
                            let item = cc.instantiate(tempItem);
                            let spr_daoju = item.getChildByName("spr_daoju");
                            let prefabIcon = prefabRes.getChildByName("dj_icon_"+(cc.vv.UserManager.daojuList[j].id));
                            spr_daoju.getComponent(cc.Sprite).spriteFrame  = prefabIcon.getComponent(cc.Sprite).spriteFrame;
                            item.getChildByName("txet_price").getComponent(cc.Label).string = cc.vv.UserManager.daojuList[j].costGlod;
                            item.x = item.width * j;
                            item.parent = content;
                            item.active = true;
                            item.daojuIndex = cc.vv.UserManager.daojuList[j].id;
                            item.toSeat = cc.vv.gameData.getUserSeatIndex(clickLocalSeat);
                            Global.btnClickEvent(item,this.onClickDaoju,this);
                        }
                        content.width = tempItem.width * cc.vv.UserManager.daojuList.length;
                    }
                    panel_show.active = true;
                }
            }
        }
    },

    onClickDaoju(event){
        let data = {
            type:3,
            index:event.target.daojuIndex,
            fromSeat:cc.vv.gameData.getMySeatIndex(),
            toSeat:event.target.toSeat
        };
        var req = { 'c': MsgId.CHAT};
        req.chatInfo = data;
        cc.vv.NetManager.send(req);
        this.panel_player.active = false;
    },

    onRcvGpsTipsNotify(data){
        this.setGpsBtnColour(data.detail.gpsColour);
    },

    onClickInviteToWx(){
        let title = "闲游房间邀请";
        let description = this.getRoomInfoStr();
        Global.onWXShareLink(Global.ShareSceneType.WXSceneSession, title, description, Global.iconUrl, Global.shareLink);
    },

    getRoomInfoStr(){
        let roomConf = cc.vv.gameData.getRoomConf();
        let users = cc.vv.gameData.getUsers();

        let description = "碰胡";
        description += (",房间号:" + roomConf.deskId);
        if (cc.vv.UserManager.currClubId) {
            description += (",亲友圈ID:" + cc.vv.UserManager.currClubId);
        }
        description += ("," + roomConf.gamenum + "局");
        description += ("," + roomConf.seat + "缺" + (roomConf.seat-users.length));
        description += ("," + ["连中","中庄x2","四首相乘"][roomConf.param1]);
        description += ("," + roomConf.score+ "倍");
        return description;
    },

    onClickCopyRoomIdToWx(){
        let title = "房间ID";
        let description = cc.vv.gameData.getRoomConf().deskId;
        Global.onWXShareText(Global.ShareSceneType.WXSceneSession, title, description);
    },

    onClickCopyRoomInfoOpenWx(){
        if (!cc.vv.UserManager.currClubId) {
            let description = this.getRoomInfoStr();
            description += ",速来玩!\n";
            description += "复制信息打开游戏将自动入座";
            Global.copyStrToClipboard(description);
        }
    },

    onClose(){
        this.showPanel(false);
    },

    onShowSetting(){
        Global.dispatchEvent(EventId.SHOW_SETTING);
    },

    onClickSetting(){
        if(this._canClick) this.showPanel(true);
    },

    showPanel(bShow){
        this._canClick = false;
        if(!bShow) this._clickNode.active = false;
        let endPos = cc.v2(this._startPos.x-this._panelSettingNode.width,this._startPos.y);
        if(!bShow) endPos =  cc.v2(this._startPos.x,this._startPos.y);
        this._panelSettingNode.runAction(cc.sequence(cc.moveTo(0.2,endPos),cc.callFunc(()=>{
            this._canClick = true;
            this._clickNode.active = bShow;
            this
        })))
    },

    recvDeskInfoMsg(){
        let user = cc.vv.gameData.getUserInfo(cc.vv.gameData.getMySeatIndex());
        let deskInfo = cc.vv.gameData.getDeskInfo();
        if (user) {
            this.showReady(user.state === 0);
            this.showInviteWxCopyRoomId(user.state != 2 && 0 === deskInfo.round);
        }

        //解散重连处理
        if (deskInfo.dissolveInfo && deskInfo.dissolveInfo.iStart) {
            let msg = {c: MsgId.APPLY_DISMISS_NOTIFY};
            let data = {};
            data.detail = {};
            data.detail.c = MsgId.APPLY_DISMISS_NOTIFY;
            data.detail.dissolveInfo = deskInfo.dissolveInfo;
            this.onRcvDismissNotify(data);
        }
    },

    recvCloseRoundView(){
        this.showReady(true);
    },

    onRcvReadyNotice(data){
        data = data.detail;
        if(data.seat === cc.vv.gameData.getMySeatIndex()){
            this.showReady(false);
            Global.dispatchEvent(EventId.CLEARDESK);
        }
    },

    onRecvHandCard(data){
        data = data.detail;
        if(data.seat === cc.vv.gameData.getMySeatIndex()){
            this.showInviteWxCopyRoomId(false);
        }
    },

    onExit(){
        if(cc.vv.gameData) cc.vv.gameData.exitGame();
    },

    onReady(){
        cc.vv.NetManager.send({ 'c': MsgId.READY});
        Global.dispatchEvent(EventId.CLEARDESK);
    },

    onRcvReadyResult(msg){
        if(msg.code === 200) this.showReady(false);
    },

    registerMsg(){
        cc.vv.NetManager.registerMsg(MsgId.READY, this.onRcvReadyResult, this);
    },

    unregisterMsg(){
        cc.vv.NetManager.unregisterMsg(MsgId.READY, this.onRcvReadyResult,false,this);
    },

    showReady(bShow){
        cc.find("scene/operate_btn_view/ready_btn",this.node).active = bShow;
    },

    showInviteWxCopyRoomId(bShow){
        cc.find("scene/operate_btn_view/btn_invite_wx",this.node).active = bShow;
        cc.find("scene/operate_btn_view/btn_copy_roomId",this.node).active = bShow;
        cc.find("scene/btn_helper",this.node).active = (bShow && cc.vv.UserManager.currClubId);
        this._isPlaying = !bShow;
    },

    onDestroy(){
        this.unregisterMsg();
    }
    // update (dt) {},
});
