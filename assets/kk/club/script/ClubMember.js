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
        cc.vv.NetManager.registerMsg(MsgId.CLUB_MEMBER_LIST, this.onRcvMemberList, this);
        cc.vv.NetManager.registerMsg(MsgId.TICKOUT_CLUB_MEMBER, this.onRcvTickoutMember, this);
    },

    showLayer(){
        if(this._layer === null){
            cc.loader.loadRes("common/prefab/club_member",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._layer = cc.instantiate(prefab);
                    this._layer.scaleX = this.node.width / this._layer.width;
                    this._layer.scaleY = this.node.height / this._layer.height;
                    this._layer.parent = this.node;
                    this._layer.zIndex = 1;
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
        let btn_close = cc.find("bg_member/btn_close",this._layer);
        Global.btnClickEvent(btn_close,this.onClose,this);

        this.input_nameID = cc.find("bg_member/bg_input/input_nameID",this._layer);
        this.input_nameID.on('editing-did-ended',this.onClickSearch,this);
        
        this.text_data = cc.find("bg_member/bg_data/text_data",this._layer);
        let btn_selecteData = cc.find("bg_member/bg_data/btn_selecteData",this._layer);
        Global.btnClickEvent(btn_selecteData,this.onClickSelectData, this);

        this.panel_dateSelect = cc.find("bg_member/panel_dateSelect",this._layer);
        Global.btnClickEvent(this.panel_dateSelect,this.onClickCloseSelectData,this);
        this.bg_dateSelect = this.panel_dateSelect.getChildByName("bg_dateSelect");
        let btn_left = this.bg_dateSelect.getChildByName("btn_left");
        Global.btnClickEvent(btn_left,this.onClickLeft,this);
        let btn_right = this.bg_dateSelect.getChildByName("btn_right");
        Global.btnClickEvent(btn_right,this.onClickRight,this);
        this.text_year_month = this.bg_dateSelect.getChildByName("text_year_month");

        this.sortBtnArr = [];
        let node_topInfo = cc.find("bg_member/panel_list/node_topInfo",this._layer);
        let sortBtnStrArr = ["btn_IDSort", "btn_stateSort", "btn_roundNumSort", "btn_bigWinerNumSort", "btn_speedSort", "btn_score2Sort"]
        for (let i = 0; i < sortBtnStrArr.length; i++) {
            this.sortBtnArr.push(node_topInfo.getChildByName(sortBtnStrArr[i]));
            Global.btnClickEvent(this.sortBtnArr[i],this.onClickSort,this);
        }

        this.memberListContent = cc.find("bg_member/panel_list/scrollView/content",this._layer);
        let spr_head = cc.find("bg_memberItem/UserHead/radio_mask/spr_head", this.memberListContent.children[0])
        this.defaultSpriteFrame = spr_head.getComponent(cc.Sprite).spriteFrame;
    },

    initShow(){
        this.input_nameID.getComponent(cc.EditBox).string = "";
        for (let i = 0; i < this.sortBtnArr.length; i++) {
            this.sortBtnArr[i].isSmallToBig = true;
        }
        for(let i = 0; i < this.memberListContent.children.length; ++i){
            this.memberListContent.children[i].active = false;
        }

        this.panel_dateSelect.active = false;

        let selectData = new Date();
        this.curData = {};
        this.curData.year = selectData.getFullYear();
        this.curData.month = selectData.getMonth();     //比实际小1
        this.curData.day = selectData.getDate();
        this.selectData = JSON.parse(JSON.stringify(this.curData));

        this.sendMemberListReq();
    },

    onClose(){
        this._layer.active = false;
    },

    sendMemberListReq(){
        let dataStr = Global.getDataStr(this.selectData.year,this.selectData.month,this.selectData.day);       
        this.text_data.getComponent(cc.Label).string = dataStr;

        let req = { 'c': MsgId.CLUB_MEMBER_LIST};
        req.selectTime = Global.getDataStr(this.selectData.year,this.selectData.month,this.selectData.day);
        req.clubid = cc.vv.UserManager.currClubId;
        cc.vv.NetManager.send(req);
    },

    onClickSearch(event){
        let inputStr = this.input_nameID.getComponent(cc.EditBox).string;
        if (inputStr && 0 < inputStr.length) {
            let searchList = [];
            for (let i = 0; i < this.memberList.length; i++) {
                if (0 <= this.memberList[i].uid.toString().indexOf(inputStr) || 0 <= this.memberList[i].playername.indexOf(inputStr)) {
                    searchList.push(this.memberList[i]);
                }
            }
            this.updateMemberList(searchList);
        }
    },

    onClickSelectData(event){
        this.panel_dateSelect.active = true;
        this.curSelectYear = this.selectData.year;
        this.curSelectMonth = this.selectData.month;
        this.onShowDataItem(this.curSelectYear, this.curSelectMonth);
    },

    onShowDataItem(year,month){
        this.text_year_month.getComponent(cc.Label).string = Global.getDataStr(year, month);
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
        for (let i = firstDay; i <= lastDay; i++) {
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
        for (let i = lastDay - firstDay + 1; i < 15; i++) {
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
        
        this.sendMemberListReq();
    },

    onClickSort(event){
        let seq = event.target.isSmallToBig ? 1 : -1;
        event.target.isSmallToBig = !event.target.isSmallToBig;
        ["btn_IDSort", "btn_stateSort", "btn_roundNumSort", "btn_bigWinerNumSort", "btn_speedSort", "btn_score2Sort"]
        this.memberList.sort((obj1, obj2)=>{
            if ("btn_IDSort" == event.target.name) {
                return seq * (obj1.uid - obj2.uid);
            } else if ("btn_stateSort" == event.target.name) {
                return seq * (obj1.isOnLine - obj2.isOnLine);
            } else if ("btn_roundNumSort" == event.target.name) {
                return seq * (obj1.jushu - obj2.jushu);
            } else if ("btn_bigWinerNumSort" == event.target.name) {
                return seq * (obj1.bigWinCnt - obj2.bigWinCnt);
            } else if ("btn_speedSort" == event.target.name) {
                return seq * (obj1.cost - obj2.cost);
            } else if ("btn_score2Sort" == event.target.name) {
                return seq * (obj1.totalScore - obj2.totalScore);
            }
            return false;
        });
        this.updateMemberList();
    },

    onRcvMemberList(msg){
        if (200 == msg.code && msg.memberList) {
            for (let i = 0; i < this.sortBtnArr.length; i++) {
                this.sortBtnArr[i].isSmallToBig = true;
            }
            this.memberList = msg.memberList;
            this.clubTotalScore = 0;
            for (let i = 0; i < this.memberList.length; i++) {
                this.clubTotalScore += this.memberList[i].totalScore;
            }
            this.updateMemberList();
        }
    },

    updateMemberList(list){
        let showList = list ? list : this.memberList;
        let clubCeateUid = cc.vv.UserManager.getCurClubInfo().createUid;
        for (let i = 0; i < showList.length; i++) {
            if (showList[i].uid == clubCeateUid) {
                let clubCeateInfo = showList[i];
                showList.splice(i, 1);
                showList.unshift(clubCeateInfo);
                break;
            }
        }
        for (let i = 0; i < showList.length; i++) {
            let item = null;
            if(i < this.memberListContent.children.length) {
                item = this.memberListContent.children[i];
            } else {
                item = cc.instantiate(this.memberListContent.children[0]);
                item.parent = this.memberListContent;
            }
            item.y = this.memberListContent.children[0].y - i * (item.height + 5);
            item.active = true;
            
            let bg_memberItem = item.getChildByName("bg_memberItem");

            bg_memberItem.getChildByName("spr_creater").active = (clubCeateUid == showList[i].uid);

            let spr_head = cc.find("UserHead/radio_mask/spr_head", bg_memberItem);
            spr_head.getComponent(cc.Sprite).spriteFrame = this.defaultSpriteFrame;
            Global.setHead(spr_head, showList[i].usericon);

            bg_memberItem.getChildByName("text_name").getComponent(cc.Label).string = showList[i].playername;
            bg_memberItem.getChildByName("text_ID").getComponent(cc.Label).string = showList[i].uid;
            bg_memberItem.getChildByName("text_state").getComponent(cc.Label).string = showList[i].isOnLine ? "在线" : "离线";
            bg_memberItem.getChildByName("text_state").color = showList[i].isOnLine ? (new cc.Color(0,255,0)) : (new cc.Color(135,135,135));
            bg_memberItem.getChildByName("text_score1").active = (clubCeateUid == showList[i].uid);
            bg_memberItem.getChildByName("text_score1").getComponent(cc.Label).string = (clubCeateUid == showList[i].uid) ? this.clubTotalScore : "";
            bg_memberItem.getChildByName("text_roundNum").getComponent(cc.Label).string = showList[i].jushu;
            bg_memberItem.getChildByName("text_bigWinerNum").getComponent(cc.Label).string = showList[i].bigWinCnt;
            bg_memberItem.getChildByName("text_speed").getComponent(cc.Label).string = showList[i].cost;
            bg_memberItem.getChildByName("text_score2").getComponent(cc.Label).string = showList[i].totalScore;
            let btn_tickout = bg_memberItem.getChildByName("btn_tickout");
            btn_tickout.active = (clubCeateUid != showList[i].uid);
            btn_tickout.uid = showList[i].uid;
            btn_tickout.playername = showList[i].playername;
            Global.btnClickEvent(btn_tickout,this.onClickTickout,this);

        }
        this.memberListContent.height = showList.length * (this.memberListContent.children[0].height + 5);

        for(let i = showList.length; i < this.memberListContent.children.length; ++i){
            this.memberListContent.children[i].active = false;
        }
    },

    onClickTickout(event){
        let self = this;
        self.kickUid = event.target.uid;
        let sureCall = function () {
            let req = { 'c': MsgId.TICKOUT_CLUB_MEMBER};
            req.clubid = cc.vv.UserManager.currClubId;
            req.kickUid = self.kickUid;
            cc.vv.NetManager.send(req);
        }
        let cancelCall = function () {
        }
        cc.vv.AlertView.show("确定将" + event.target.playername + "踢出亲友圈吗", sureCall, cancelCall);
    },

    onRcvTickoutMember(msg){
        if (200 == msg.code) {
            this.sendMemberListReq();
            cc.vv.FloatTip.show("踢出玩家成功");
        }
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_MEMBER_LIST, this.onRcvMemberList, this);
        cc.vv.NetManager.unregisterMsg(MsgId.TICKOUT_CLUB_MEMBER, this.onRcvTickoutMember, this);
        if(this._layer){
            cc.loader.releaseRes("common/prefab/club_member",cc.Prefab);
        }
    },
});
