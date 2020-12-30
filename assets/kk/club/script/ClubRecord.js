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
        cc.vv.NetManager.registerMsg(MsgId.GAME_RECORD, this.onRcvGameRecord, this);
        cc.vv.NetManager.registerMsg(MsgId.ROUND_RECORD, this.onRcvRoundRecord, this);

        Global.registerEvent(EventId.SHOW_CLUB_RECORD, this.showLayer,this);
    },

    showLayer(data){
        this.checkUid = data ? data.detail : "";
        if(this._layer === null){
            cc.loader.loadRes("common/prefab/club_record",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._layer = cc.instantiate(prefab);
                    this._layer.scaleX = this.node.width / this._layer.width;
                    this._layer.scaleY = this.node.height / this._layer.height;
                    this._layer.parent = this.node;
                    this._layer.zIndex = 2;
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
        let btn_back = this._layer.getChildByName("btn_back");
        Global.btnClickEvent(btn_back,this.onClose,this);
        let btn_refresh = this._layer.getChildByName("btn_refresh");
        Global.btnClickEvent(btn_refresh,this.onClickRefresh,this);

        this.btnContent = cc.find("bg_left/scrollview/view/content",this._layer);
        Global.btnClickEvent(this.btnContent.children[0], this.onClickDateItem,this);

        this.panel_gameRecord = cc.find("bg_right/panel_gameRecord",this._layer);
        let btn_share = cc.find("bg_top/btn_share",this.panel_gameRecord)
        Global.btnClickEvent(btn_share,this.onClickShare,this);
        this.gameRecordContent = cc.find("scrollview/view/content",this.panel_gameRecord);
        Global.btnClickEvent(this.gameRecordContent.children[0].getChildByName("btn_detail"), this.onClickDetail, this);

        this.panel_roundRecord = cc.find("bg_right/panel_roundRecord",this._layer);
        let btn_closeRoundRecord = this.panel_roundRecord.getChildByName("btn_closeRoundRecord");
        Global.btnClickEvent(btn_closeRoundRecord,this.onShowGameRecord,this);

        this.roundRecordContent = cc.find("scrollview/content",this.panel_roundRecord);
        Global.btnClickEvent(cc.find("bg_btn/btn_replay", this.roundRecordContent.children[0]), this.onClickReplay,this);
    },

    initShow(){
        this.curDate = new Date();
        for (var i = 0; i < 7; i++) {
            let item = null;
            if(i < this.btnContent.children.length) {
                item = this.btnContent.children[i];
            } else {
                item = cc.instantiate(this.btnContent.children[0]);
                item.parent = this.btnContent;
                Global.btnClickEvent(item,this.onClickDateItem,this);
            }
            item.y = this.btnContent.children[0].y - i * (item.height+5);
            item.getComponent(cc.Button).interactable = (0 == i);

            let itemDate = new Date(this.curDate.getTime() - i*24*60*60*1000);
            let year = itemDate.getFullYear();
            let month = itemDate.getMonth();    //month比实际小1
            let day = itemDate.getDate();

            let itemDateStr = (month + 1) + "月" + day + "日";
            item.getChildByName("text_date").getComponent(cc.Label).string = itemDateStr;
            item.index = i;
            item.dateStr = Global.getDataStr(year,month,day);
        }

        for(let i = 0; i < this.gameRecordContent.children.length; ++i){
            this.gameRecordContent.children[i].active = false;
        }
        for(let i = 0; i < this.roundRecordContent.children.length; ++i){
            this.roundRecordContent.children[i].active = false;
        }

        this.curDateIndex = 0;
        this.curRoomID = null;

        if (Global.backRecordData) {
            this.curDateIndex = Global.backRecordDateIndex;
            for (var i = 0; i < this.btnContent.children.length; i++) {
                this.btnContent.children[i].getComponent(cc.Button).interactable = (i != this.curDateIndex);
            }

            var req = { 'c': MsgId.ROUND_RECORD};
            req.deskid = Global.backRecordData.deskid;
            if (this.checkUid) {
                req.tarGetUid = this.checkUid;
            }
            cc.vv.NetManager.send(req);
            Global.backRecordData = null;
        } else {
            this.onShowGameRecord();
        }
    },

    onClose(){
        this._layer.active = false;
        if (this.checkUid) {
            Global.dispatchEvent(EventId.SHOW_CLUB_MEMBER);
        }
        Global.backRecordCheckUid = "";
    },

    onClickRefresh(){
        if (this.panel_gameRecord.active) {
            this.sendGameRecordReq();
        } else {
            this.sendRoundRecordReq();
        }
    },

    onClickDateItem(event){
        this.curDateIndex = event.target.index;
        this.onShowGameRecord();
    },

    onClickShare(event){
        Global.onWXShareImage(Global.ShareSceneType.WXSceneSession);
    },

    onShowGameRecord(){
        this.panel_gameRecord.active = true;
        this.panel_roundRecord.active = false;
        this.sendGameRecordReq();
    },

    sendGameRecordReq(){
        for (var i = 0; i < this.btnContent.children.length; i++) {
            this.btnContent.children[i].getComponent(cc.Button).interactable = (i != this.curDateIndex);
        }
        var req = { 'c': MsgId.GAME_RECORD};
        req.selectTime = this.btnContent.children[this.curDateIndex].dateStr;
        req.clubid = cc.vv.UserManager.currClubId;
        if (this.checkUid) {
            req.tarGetUid = this.checkUid;
        }
        cc.vv.NetManager.send(req);
    },

    onClickDetail(event){
        this.curRoomID = event.target.deskid;
        this.sendRoundRecordReq();
    },

    sendRoundRecordReq(){
        var req = { 'c': MsgId.ROUND_RECORD};
        req.deskid = this.curRoomID;
        if (this.checkUid) {
            req.tarGetUid = this.checkUid;
        }
        cc.vv.NetManager.send(req);
    },

    onRcvGameRecord(msg){
        if (200 == msg.code && msg.data && 1 < msg.clubid) {
            this.panel_gameRecord.active = true;
            this.panel_roundRecord.active = false;
            for (var i = 0; i < msg.data.length; i++) {
                let item = null;
                if(i < this.gameRecordContent.children.length) {
                    item = this.gameRecordContent.children[i];
                } else {
                    item = cc.instantiate(this.gameRecordContent.children[0]);
                    item.parent = this.gameRecordContent;
                    Global.btnClickEvent(item.getChildByName("btn_detail"), this.onClickDetail, this);
                }
                item.y = this.gameRecordContent.children[0].y - i * (item.height + 5);
                item.active = true;

                let gameIcon = item.getChildByName("gameIcon");
                let gameIconStr = ["","penghu","paohuzi","penghu","paohuzi","hongheihu","hongheihu","liuhuqiang","liuhuqiang","paodekuai","paodekuai",
                                    "hongzhong","hongzhong","shihuka","shihuka","tonghua","tonghua","erqigui","erqigui"];
                let gameIconPrefabRes= cc.find("prefabRes/" + gameIconStr[msg.data[i].gameid], this._layer);
                gameIcon.getComponent(cc.Sprite).spriteFrame  = gameIconPrefabRes.getComponent(cc.Sprite).spriteFrame;

                let strArr = msg.data[i].beginTime.split(" ");
                item.getChildByName("text_time").getComponent(cc.Label).string = strArr[0];
                item.getChildByName("text_time1").getComponent(cc.Label).string = strArr[1];
                item.getChildByName("text_roomID").getComponent(cc.Label).string = msg.data[i].deskid;
                item.getChildByName("text_round").getComponent(cc.Label).string = msg.data[i].gameNum;
                
                let maxScore = 0;
                let bigWinerName = "";
                let bigWinerID = "";
                let userData = JSON.parse(msg.data[i].data);
                let bg_score = item.getChildByName("bg_score");
                for (var j = 0; j < userData.length; j++) {
                    bg_score.getChildByName("text_name"+j).active = true;
                    bg_score.getChildByName("text_score"+j).active = true;
                    bg_score.getChildByName("text_name"+j).getComponent(cc.Label).string = userData[j].playername;
                    if (0 <= userData[j].score) {
                        if (0 < userData[j].score) {
                            bg_score.getChildByName("text_score"+j).getComponent(cc.Label).string = "+" + userData[j].score;
                        } else if (0 == userData[j].score){
                            bg_score.getChildByName("text_score"+j).getComponent(cc.Label).string = userData[j].score;
                        }
                        bg_score.getChildByName("text_score"+j).color = new cc.Color(189,57,53);
                    } else {
                        bg_score.getChildByName("text_score"+j).getComponent(cc.Label).string = userData[j].score;
                        bg_score.getChildByName("text_score"+j).color = new cc.Color(79,102,143);
                    }
                    if (maxScore < userData[j].score) {
                        maxScore = userData[j].score;
                        bigWinerName = userData[j].playername;
                        bigWinerID = userData[j].uid;
                    }
                    if (this.checkUid) {
                        if(this.checkUid == userData[j].uid){
                            item.getChildByName("mask_win").active = (0 <= userData[j].score);
                            item.getChildByName("mask_lose").active = (0 > userData[j].score);
                        }
                    } else {
                        if(cc.vv.UserManager.uid == userData[j].uid){
                            item.getChildByName("mask_win").active = (0 <= userData[j].score);
                            item.getChildByName("mask_lose").active = (0 > userData[j].score);
                        }
                    }
                }
                for (var j = userData.length; j < 4; j++) {
                    bg_score.getChildByName("text_name"+j).active = false;
                    bg_score.getChildByName("text_score"+j).active = false;
                }
                item.getChildByName("text_bigWinerName").getComponent(cc.Label).string = bigWinerName;
                item.getChildByName("text_bigWinerID").getComponent(cc.Label).string = bigWinerID ? ("ID:" + bigWinerID) : "";

                item.getChildByName("btn_detail").deskid = msg.data[i].deskid;
            }
            this.gameRecordContent.height = msg.data.length * (this.gameRecordContent.children[0].height + 5);

            for(let i = msg.data.length; i < this.gameRecordContent.children.length; ++i){
                this.gameRecordContent.children[i].active = false;
            }
            cc.find("bg_right/panel_gameRecord/bg_top/text_roundNum",this._layer).getComponent(cc.Label).string = msg.data.length;
            cc.find("bg_right/panel_gameRecord/bg_top/text_bigWinweNum",this._layer).getComponent(cc.Label).string = msg.bigWinCnt;
            cc.find("bg_right/panel_gameRecord/bg_top/text_score_win",this._layer).getComponent(cc.Label).string = 0 <= msg.totalScore ? '/' + msg.totalScore : "";
            cc.find("bg_right/panel_gameRecord/bg_top/text_score_loss",this._layer).getComponent(cc.Label).string = 0 > msg.totalScore ? '/' + Math.abs(msg.totalScore) : "";
        }
    },

    onRcvRoundRecord(msg){
        if (200 == msg.code && msg.data) {
            this.panel_gameRecord.active = false;
            this.panel_roundRecord.active = true;
            for (var i = 0; i < msg.data.length; i++) {
                let item = null;
                if(i < this.roundRecordContent.children.length) {
                    item = this.roundRecordContent.children[i];
                } else {
                    item = cc.instantiate(this.roundRecordContent.children[0]);
                    item.parent = this.roundRecordContent;
                    Global.btnClickEvent(cc.find("bg_btn/btn_replay", item), this.onClickReplay,this);
                }

                let btn_replay = cc.find("bg_btn/btn_replay", item);
                btn_replay.deskid = msg.data[i].deskid;
                btn_replay.round = i;
                btn_replay.gameid = msg.data[i].gameid;

                item.y = this.roundRecordContent.children[0].y - i * (item.height + 5);
                item.active = true;

                cc.find("bg_num/text_roundIndex",item).getComponent(cc.Label).string = i + 1;
                item.getChildByName("text_time").getComponent(cc.Label).string = msg.data[i].beginTime;

                let playerData =JSON.parse(msg.data[i].data);
                let bg_score = item.getChildByName("bg_score");
                for (var j = 0; j < playerData.length; j++) {
                    bg_score.getChildByName("text_name" + j).getComponent(cc.Label).string = playerData[j].playername;
                    bg_score.getChildByName("text_score_win" + j).active = (0 < playerData[j].roundScore);
                    bg_score.getChildByName("text_score_lose" + j).active = (0 >= playerData[j].roundScore);
                    if (0 < playerData[j].roundScore) {
                        bg_score.getChildByName("text_score_win" + j).getComponent(cc.Label).string = playerData[j].roundScore;
                    } else {
                        bg_score.getChildByName("text_score_lose" + j).getComponent(cc.Label).string = '/' + Math.abs(playerData[j].roundScore);
                    }
                }
                for (var j = playerData.length; j < 4; j++) {
                    bg_score.getChildByName("text_name" + j).active = false;
                    bg_score.getChildByName("text_score_win" + j).active = false;
                    bg_score.getChildByName("text_score_lose" + j).active = false;
                }
            }
            this.roundRecordContent.height = msg.data.length * (this.roundRecordContent.children[0].height + 5);

            for(let i = msg.data.length; i < this.roundRecordContent.children.length; ++i){
                this.roundRecordContent.children[i].active = false;
            }
        }
    },

    onClickReplay(event){
        Global.backRecordDateIndex = this.curDateIndex;
        Global.backRecordCheckUid = this.checkUid;
        var req = { 'c': MsgId.PLAY_BACK_MSG_LIST};
        req.fromSence = 'club';
        req.clubid = cc.vv.UserManager.currClubId;
        req.deskid = event.target.deskid;
        req.round = event.target.round + 1;
        req.startid = 1;
        req.endid = 1;
        cc.vv.NetManager.send(req);
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.GAME_RECORD, this.onRcvGameRecord, this);
        cc.vv.NetManager.unregisterMsg(MsgId.ROUND_RECORD, this.onRcvRoundRecord, this);
        if(this._layer){
            cc.loader.releaseRes("common/prefab/club_record",cc.Prefab);
        }
    },
});
