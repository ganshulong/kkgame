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
        Global.btnClickEvent(this.btn_gps,this.onClickGPS,this);
        this.setGpsBtnColour(1);

        this.panel_gps = cc.find("scene/panel_gps",this.node);
        this.onSetShowGps(false);

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

    onClickGPS(){
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
            for (var i = 0; i < locatingList.length; i++) {
                let localSeat = cc.vv.gameData.getLocalChair(locatingList[i].seat);
                let ndoe_player = node_players.getChildByName("ndoe_player" + localSeat);
                ndoe_player.getChildByName("GPS_Green").active = (1 == locatingList[i].headColour);
                ndoe_player.getChildByName("GPS_Red").active = (2 == locatingList[i].headColour);
                let spr_head = cc.find("radio_mask/spr_head", ndoe_player);
                spr_head.active = true;
                Global.setHead(spr_head,locatingList[i].usericon);

                let toOtherPlayerData = locatingList[i].data;
                for (var j = 0; j < toOtherPlayerData.length; j++) {
                    let toLocalSeat = cc.vv.gameData.getLocalChair(toOtherPlayerData[j].seat);
                    if (localSeat < toLocalSeat) {
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
            }
        }
    },

    onRcvPlayersDistanceData(data){
        this.onSetShowGps(true, data.detail);
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
