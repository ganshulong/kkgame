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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.registerMsg();

        let readyBtn = cc.find("scene/operate_btn_view/ready_btn",this.node);
        Global.btnClickEvent(readyBtn,this.onReady,this);
        
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
        Global.btnClickEvent(exit,this.onExit,this);

        let settingBtn = cc.find("btn_setting",this._panelSettingNode);
        Global.btnClickEvent(settingBtn,this.onShowSetting,this);

        let btn_close = cc.find("btn_close",this._panelSettingNode);
        Global.btnClickEvent(btn_close,this.onClose,this);

        let btn_invite_wx = cc.find("scene/operate_btn_view/btn_invite_wx",this.node)
        Global.btnClickEvent(btn_invite_wx,this.onClickInviteToWx,this);
        
        let btn_copy_roomId = cc.find("scene/operate_btn_view/btn_copy_roomId",this.node)
        Global.btnClickEvent(btn_copy_roomId,this.onClickCopyRoomIdToWx,this);

        this.btn_gps = cc.find("scene/operate_btn_view/btn_gps",this.node);
        this.setGpsBtnColour(1);

        this.panel_gps = cc.find("scene/panel_gps",this.node);
        this.onSetShowGps(false);

        this.panel_player = cc.find("scene/panel_player",this.node);
        this.onClickClosePlayerInfo();

        let btn_exit = cc.find("spr_bg/btn_exit", this.panel_gps);
        Global.btnClickEvent(btn_exit,this.onClickExitGame,this);
        let btn_continue = cc.find("spr_bg/btn_continue", this.panel_gps);
        Global.btnClickEvent(btn_continue,this.onClickContinueGame,this);

        Global.registerEvent(EventId.CLOSE_ROUNDVIEW,this.recvCloseRoundView,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.READY_NOTIFY,this.onRcvReadyNotice,this);
        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.PLAYER_DISTANCE_DATA, this.onRcvPlayersDistanceData,this);
        Global.registerEvent(EventId.GPS_TIPS_NOTIFY, this.onRcvGpsTipsNotify,this);
        this.recvDeskInfoMsg();
    },

    //1绿色，2黄色，3红色
    setGpsBtnColour(colour){
        cc.find("btn_ani/GPS_Green",this.btn_gps).active = (1 == colour);
        cc.find("btn_ani/GPS_Red",this.btn_gps).active = (3 == colour);
        cc.find("btn_ani/GPS_Yellow",this.btn_gps).active = (2 == colour);
    },

    onClickGPS(event, customEventData){
        this._clickBtnSeat = parseInt(customEventData);
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
                                ndoe_line.getChildByName("text_distance").color = cc.Color.GREEN;
                            } else if (2 == toOtherPlayerData[j].gpsColour) {
                                ndoe_line.getChildByName("text_distance").color = cc.Color.RED;
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
            let localSeat = this.uiSeatToLocalSeat(this._clickBtnSeat);
            this.onShowPlayerInfo(localSeat, data.detail);
        }
    },

    uiSeatToLocalSeat(uiSeat){
        let uiSeatToLocalSeatArr = [[-1,-1,-1,-1],[-1,-1,-1,-1],[0,-1,1,-1],[0,1,-1,2],[0,1,2,3]];
        let maxSeat = cc.vv.gameData.getRoomConf().seat;
        return uiSeatToLocalSeatArr[maxSeat][uiSeat];
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

                    panel_show.active = true;
                }
            }
        }
    },

    onRcvGpsTipsNotify(data){
        this.setGpsBtnColour(data.detail.gpsColour);
    },

    onClickInviteToWx(){
        let roomConf = cc.vv.gameData.getRoomConf();

        let title = "闲去房间邀请";
        let description = "碰胡";
        description += ("," + roomConf.gamenum + "局");
        description += ("," + roomConf.seat + "人场");
        let bankerModeStr = ["连中玩法","中庄x2","四首相乘"];
        description += ("," + bankerModeStr[roomConf.param1]);
        description += (",底分:" + roomConf.score);
        description += (",房间号:" + roomConf.deskId);
        Global.onWXShareLink(Global.ShareSceneType.WXSceneSession, title, description, Global.iconUrl, Global.shareLink);
    },

    onClickCopyRoomIdToWx(){
        let title = "房间ID";
        let description = cc.vv.gameData.getRoomConf().deskId;
        Global.onWXShareText(Global.ShareSceneType.WXSceneSession, title, description);
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
        this.showReady(user.state === 0);

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
    },

    onDestroy(){
        this.unregisterMsg();
    }
    // update (dt) {},
});
