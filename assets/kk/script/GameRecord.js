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
        _gameRecordLayer:null,
        
        _gameRecordItemList:[],
        _isShowDetailList:[],
        _detailPlayerRowList:[],

        _roundRecordItemList:[],
    },

    start () {
        cc.vv.NetManager.registerMsg(MsgId.GAME_RECORD, this.onRcvGameRecord, this);
        cc.vv.NetManager.registerMsg(MsgId.ROUND_RECORD, this.onRcvRoundRecord, this);
    },

    showGameRecord(){
        if(this._gameRecordLayer === null){
            cc.loader.loadRes("common/prefab/GameRecord",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._gameRecordLayer = cc.instantiate(prefab);
                    this._gameRecordLayer.scaleX = this.node.width / this._gameRecordLayer.width;
                    this._gameRecordLayer.scaleY = this.node.height / this._gameRecordLayer.height;
                    this._gameRecordLayer.parent = this.node;
                    this._gameRecordLayer.zIndex = 1;
                    this._gameRecordLayer.x = this.node.width/2 - this.node.x;
                    this._gameRecordLayer.y = this.node.height/2 - this.node.y;

                    this.initUI();
                    this.initShow();
                }
            })
        }
        else{
            this._gameRecordLayer.active = true;
            this.initShow();
        }
    },

    initUI(){
        let btn_back = cc.find("bg_top/btn_back",this._gameRecordLayer);
        Global.btnClickEvent(btn_back,this.onClose,this);

        this.recordTypeBtnArr = [];
        this.left_list_view = cc.find("bg_buttons/left_list_view",this._gameRecordLayer);
        for (var i = 0; i < 2; i++) {
            let btnTypeNor = this.left_list_view.getChildByName("btn_" + i + "_nor");
            btnTypeNor._index = i;
            Global.btnClickEvent(btnTypeNor,this.onClickRecordType,this);
        }

        let btn_selecteData = cc.find("selectData_node/btn_selecteData",this._gameRecordLayer);
        Global.btnClickEvent(btn_selecteData,this.onClickSelectData,this);
        this.text_data = cc.find("selectData_node/bg_data/text_data",this._gameRecordLayer);

        this.panel_dateSelect = cc.find("selectData_node/panel_dateSelect",this._gameRecordLayer);
        Global.btnClickEvent(this.panel_dateSelect,this.onClickCloseSelectData,this);
        this.panel_dateSelect.active = false;
        this.bg_dateSelect = this.panel_dateSelect.getChildByName("bg_dateSelect");
        let btn_left = this.bg_dateSelect.getChildByName("btn_left");
        Global.btnClickEvent(btn_left,this.onClickLeft,this);
        let btn_right = this.bg_dateSelect.getChildByName("btn_right");
        Global.btnClickEvent(btn_right,this.onClickRight,this);
        this.text_year_month = this.bg_dateSelect.getChildByName("text_year_month");

        this.scroll_gameRecord = this._gameRecordLayer.getChildByName("scroll_gameRecord");
        this.scroll_gameRecord.active = true;
        this.gameRecordContent = this.scroll_gameRecord.getChildByName("content");
        this.gameRecordItem = this.gameRecordContent.getChildByName("gameRecordItem");
        this.gameRecordItem.active = false;

        this.panel_roundRecord = this._gameRecordLayer.getChildByName("panel_roundRecord");
        this.panel_roundRecord.active = false;
        this.scroll_roundRecord = this.panel_roundRecord.getChildByName("scroll_roundRecord");
        let btn_closeRoundRecord = this.panel_roundRecord.getChildByName("btn_closeRoundRecord");
        Global.btnClickEvent(btn_closeRoundRecord,this.onClickCloseRoundRecord,this);
        this.roundRecordContent = this.scroll_roundRecord.getChildByName("content");
        this.roundRecordItem = this.roundRecordContent.getChildByName("roundRecordItem");
        this.roundRecordItem.active = false;
    },

    initShow(){
        this.onClickCloseRoundRecord();
        this.panel_dateSelect.active = false;

        let selectData = new Date();
        this.curData = {};
        this.curData.year = selectData.getFullYear();
        this.curData.month = selectData.getMonth();     //比实际小1
        this.curData.day = selectData.getDate();
        this.selectData = JSON.parse(JSON.stringify(this.curData));

        let dataStr = this.getDataStr(this.selectData.year,this.selectData.month,this.selectData.day);       
        this.text_data.getComponent(cc.Label).string = dataStr;

        this.onShowRecordType(0)
    },

    getDataStr(year,month,day){
        let dataStr = year + '-';
        if (9 < month) {
            dataStr += (month + 1);         //month比实际小1
        } else {
            dataStr += '0' + (month + 1);   //month比实际小1
        }
        if (day) {
            dataStr += '-';
            if (9 < day) {
                dataStr += day;
            } else {
                dataStr += '0' + day;
            }
        }
        return dataStr;
    },

    onClose(){
        this._gameRecordLayer.active = false;
    },

    onClickRecordType(event){
        this.onShowRecordType(parseInt(event.target._index));
    },

    onShowRecordType(type){
        this.curShowRecordType = type;
        for (var i = 0; i < 2; i++) {
            let isShowDis = (i == type);
            this.left_list_view.getChildByName("btn_" + i + "_nor").active = (i != this.curShowRecordType);
            this.left_list_view.getChildByName("btn_" + i + "_dis").active = (i == this.curShowRecordType);
        }
        var req = { 'c': MsgId.GAME_RECORD};
        req.selectTime = this.getDataStr(this.selectData.year,this.selectData.month,this.selectData.day);
        req.clubid = this.curShowRecordType;
        cc.vv.NetManager.send(req);
    },

    onClickSelectData(){
        this.panel_dateSelect.active = true;
        this.curSelectYear = this.selectData.year;
        this.curSelectMonth = this.selectData.month;
        this.onShowDataItem(this.curSelectYear, this.curSelectMonth);
    },

    onShowDataItem(year,month){
        this.text_year_month.getComponent(cc.Label).string = this.getDataStr(year, month);
        let firstDay = null;
        let lastDay = null;
        if (month == this.curData.month) {
            firstDay = this.curData.day - 14;
            if (1 > firstDay) {
                firstDay = 1;
            }
            lastDay = this.curData.day;
        } else {
            lastDay = (new Date(year, month + 1, 0)).getDate();
            firstDay = lastDay - (14 - this.curData.day);
        }
        for (var i = firstDay; i <= lastDay; i++) {
            let dataItem_node = this.bg_dateSelect.getChildByName("dataItem_node" + (i - firstDay));
            dataItem_node._index = firstDay;
            Global.btnClickEvent(dataItem_node,this.onClickDataItem,this);
            dataItem_node.active = true;
            dataItem_node._year = year;
            dataItem_node._month = month;
            dataItem_node._day = i;
            dataItem_node.getChildByName("bg_dateItem").active = (i == this.selectData.day)
            dataItem_node.getChildByName("text_dataItem").getComponent(cc.Label).string = i;
        }
        for (var i = lastDay - firstDay + 1; i < 15; i++) {
            this.bg_dateSelect.getChildByName("dataItem_node" + i).active = false;
        }
    },

    onClickCloseSelectData(){
        this.panel_dateSelect.active = false;
    },

    onClickLeft(){
        if (this.curSelectMonth == this.curData.month && 15 > this.curData.day) {
            if (0 == this.curSelectMonth) {
                this.curSelectYear -= 1;
                this.curSelectMonth = 11;
            } else {
                this.curSelectMonth -= 1;
            }
            this.onShowDataItem(this.curSelectYear,this.curSelectMonth);
        }
    },

    onClickRight(){
        if ((this.curSelectMonth + 1) % 12 == this.curData.month) {
            if (11 == this.curSelectMonth) {
                this.curSelectYear += 1;
                this.curSelectMonth = 0;
            } else {
                this.curSelectMonth += 1;
            }
            this.onShowDataItem(this.curSelectYear,this.curSelectMonth);
        }
    },

    onClickDataItem(event){
        this.panel_dateSelect.active = false;
        this.selectData.year = event.target._year;
        this.selectData.month = event.target._month;
        this.selectData.day = event.target._day;
        
        let dataStr = this.getDataStr(this.selectData.year,this.selectData.month,this.selectData.day);
        this.text_data.getComponent(cc.Label).string = dataStr;

        this.onClickCloseRoundRecord();
        
        var req = { 'c': MsgId.GAME_RECORD};
        req.selectTime = dataStr;
        req.clubid = this.curShowRecordType;
        cc.vv.NetManager.send(req);
    },

    onClickCloseRoundRecord(){
        this.scroll_gameRecord.active = true;
        this.panel_roundRecord.active = false;
    },

    onRcvGameRecord(msg){
        if (this._gameRecordItemList) {
            for (var i = 0; i < this._gameRecordItemList.length; i++) {
                this._gameRecordItemList[i].removeFromParent();
            }
        }
        this._gameRecordItemList = [];
        this._isShowDetailList = [];
        this._detailPlayerRowList = [];

        if(msg.code === 200 && msg.data){
            for (var i = 0; i < msg.data.length; i++) {
                this._gameRecordItemList.push(cc.instantiate(this.gameRecordItem));
                this._gameRecordItemList[i].parent = this.gameRecordContent;

                let roomInfo = this._gameRecordItemList[i].getChildByName("roomInfo");

                roomInfo.getChildByName("text_begin_time").getComponent(cc.Label).string = msg.data[i].beginTime;
                roomInfo.getChildByName("text_end_time").getComponent(cc.Label).string = msg.data[i].endTime;

                let text_roomInfo = roomInfo.getChildByName("text_roomInfo");
                text_roomInfo.getChildByName("text_roomID").getComponent(cc.Label).string = "房间号：" + msg.data[i].deskid;
                text_roomInfo.getChildByName("text_game_name").getComponent(cc.Label).string = "碰胡";
                text_roomInfo.getChildByName("text_game_jushu").getComponent(cc.Label).string = msg.data[i].gameNum + "局";
                text_roomInfo.getChildByName("text_people_num").getComponent(cc.Label).string = msg.data[i].presonNum;

                let bg_clubInfo = roomInfo.getChildByName("bg_clubInfo");
                let roomTypeStr = ["代开房房间","亲友圈房间","代开房房间","个人房间"]
                bg_clubInfo.getChildByName("text_roomType").getComponent(cc.Label).string = roomTypeStr[msg.data[i].gameid];
                bg_clubInfo.getChildByName("text_houseOwner").getComponent(cc.Label).string = msg.data[i].houseOwner;
                
                cc.find("bg_score/text_score",roomInfo).getComponent(cc.Label).string = msg.data[i].score;

                let btn_detail = roomInfo.getChildByName("btn_detail");
                btn_detail._index = i;
                Global.btnClickEvent(btn_detail,this.onClickDetail,this);

                let playersInfo = this._gameRecordItemList[i].getChildByName("playersInfo");
                playersInfo.active = false;

                let timeShareDetail = playersInfo.getChildByName("timeShareDetail");
                timeShareDetail.getChildByName("text_timeValue").getComponent(cc.Label).string = msg.data[i].beginTime;

                let btn_share = timeShareDetail.getChildByName("btn_share");
                btn_detail._index = i;
                Global.btnClickEvent(btn_share,this.onClickShare,this);

                let btn_checkRoundDetail = timeShareDetail.getChildByName("btn_checkRoundDetail");
                btn_checkRoundDetail._index = msg.data[i].deskid;
                Global.btnClickEvent(btn_checkRoundDetail,this.onClickCheckRoundDetail,this);

                let playerData =JSON.parse( msg.data[i].data);

                let maxScore = 0;
                for (var j = 0; j < playerData.length; j++) {
                    if (maxScore < playerData[j].score) {
                        maxScore = playerData[j].score;
                    }
                }
                for (var j = 0; j < playerData.length; j++) {
                    let playerInfoItem = playersInfo.getChildByName("playerInfoItem" + j);

                    Global.setHead(playerInfoItem.getChildByName("user_head"),playerData[j].usericon);
                    playerInfoItem.getChildByName("img_owner").active = (playerData[j].uid == msg.data[i].houseOwnerUid);
                    playerInfoItem.getChildByName("text_player_name").getComponent(cc.Label).string = playerData[j].playername;
                    playerInfoItem.getChildByName("text_player_id").getComponent(cc.Label).string = playerData[j].uid;
                    playerInfoItem.getChildByName("img_big_winner").active = (playerData[j].score >= maxScore && maxScore > 0);

                    playerInfoItem.getChildByName("text_score_win").active = (0 < playerData[j].score);
                    playerInfoItem.getChildByName("text_score_lose").active = (0 >= playerData[j].score);
                    if (0 < playerData[j].score) {
                        playerInfoItem.getChildByName("text_score_win").getComponent(cc.Label).string = playerData[j].score;
                    } else {
                        playerInfoItem.getChildByName("text_score_lose").getComponent(cc.Label).string = '/' + Math.abs(playerData[j].score);
                    }
                    playerInfoItem.active = true;
                }
                for (var j = playerData.length; j < 4; j++) {
                    let playerInfoItem = playersInfo.getChildByName("playerInfoItem" + j);
                    playerInfoItem.active = false;
                }

                this._gameRecordItemList[i].active = true;
                this._isShowDetailList[i] = false;
                this._detailPlayerRowList[i] = 2 < playerData.length ? 2 : 1;
            }
            this.updateItemPosX();
        }
        this._gameRecordLayer.getChildByName("tips").active = (0 == this._gameRecordItemList.length);
    },

    onClickDetail(event){
        let _index = event.target._index;
        this._isShowDetailList[_index] = !this._isShowDetailList[_index];
        this._gameRecordItemList[_index].getChildByName("playersInfo").active = this._isShowDetailList[_index];
        this.updateItemPosX();
    },

    onClickShare(event){
        let _index = event.target._index;
    },

    onClickCheckRoundDetail(event){
        var req = { 'c': MsgId.ROUND_RECORD};
        req.deskid = event.target._index;
        cc.vv.NetManager.send(req);
    },

    onRcvRoundRecord(msg){
        if (this._roundRecordItemList) {
            for (var i = 0; i < this._roundRecordItemList.length; i++) {
                this._roundRecordItemList[i].removeFromParent();
            }
        }
        this._roundRecordItemList = [];

        if(msg.code === 200 && msg.data){
            for (var i = 0; i < msg.data.length; i++) {
                this._roundRecordItemList.push(cc.instantiate(this.roundRecordItem));
                this._roundRecordItemList[i].parent = this.roundRecordContent;
                this._roundRecordItemList[i].y = -i * this._roundRecordItemList[i].height;

                cc.find("bg_num/text_roundIndex",this._roundRecordItemList[i]).getComponent(cc.Label).string = i + 1;
                this._roundRecordItemList[i].getChildByName("text_time").getComponent(cc.Label).string = msg.data[i].beginTime;

                let playerData =JSON.parse(msg.data[i].data);
                let bg_score = this._roundRecordItemList[i].getChildByName("bg_score");
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
                this._roundRecordItemList[i].active = true;
            }
            this.roundRecordContent.height = msg.data.length * this.roundRecordItem.height;
            this.scroll_gameRecord.active = false;
            this.panel_roundRecord.active = true;
        }
    },

    updateItemPosX(){
        let showHeightByRow = [122, 122 + 60 + 100 + 5, 122 + 60 + 100 + 5 + 100 + 5];
        let curPosY = 0;
        for (var i = 0; i < this._gameRecordItemList.length; i++) {
            this._gameRecordItemList[i].y = curPosY;
            if (this._isShowDetailList[i]) {
                curPosY -= showHeightByRow[this._detailPlayerRowList[i]];
            } else {
                curPosY -= showHeightByRow[0];
            }
        }
        this.gameRecordContent.height = -curPosY;
    },

    onDestroy(){
        if(this._gameRecordLayer){
            cc.loader.releaseRes("common/prefab/GameRecord",cc.Prefab);
        }
    },
});
