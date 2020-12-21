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
        cc.vv.NetManager.registerMsg(MsgId.MEMBER_FORBID_PLAY, this.onRcvMemberState, this);
        cc.vv.NetManager.registerMsg(MsgId.MEMBER_RECOVER_PLAY, this.onRcvMemberState, this);
        cc.vv.NetManager.registerMsg(MsgId.TICKOUT_CLUB_MEMBER, this.onRcvTickoutMember, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_SET_POWER, this.onRcvSetPower, this);
        cc.vv.NetManager.registerMsg(MsgId.SEARCH_CLUB_MEMBER, this.onRcvSearchClubMember, this);

        Global.registerEvent(EventId.CLUB_SET_PARTNER, this.onRcvSetPartner, this);
        Global.registerEvent(EventId.SHOW_CLUB_MEMBER, this.showLayer,this);
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
        this.btn_back = cc.find("bg_member/btn_back",this._layer);
        Global.btnClickEvent(this.btn_back,this.onClickBack,this);
        let btn_close = cc.find("bg_member/btn_close",this._layer);
        Global.btnClickEvent(btn_close,this.onClickClose,this);

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
        let sortBtnStrArr = ["btn_IDSort","btn_stateSort","btn_roundNumSort","btn_bigWinerNumSort","btn_waterProSort","btn_scoreSort","btn_powerSort","btn_totalPowerSort"];
        for (let i = 0; i < sortBtnStrArr.length; i++) {
            this.sortBtnArr.push(node_topInfo.getChildByName(sortBtnStrArr[i]));
            Global.btnClickEvent(this.sortBtnArr[i],this.onClickSort,this);
        }

        this.memberListContent = cc.find("bg_member/panel_list/scrollView/content",this._layer);
        this.memberItem = cc.find("bg_member/panel_list/scrollView/memberItem",this._layer);
        this.memberItem.active = false;

        this.pagePlayerNum = 4;
        this.btn_prePage = cc.find("bg_member/panel_list/node_bottom/btn_prePage",this._layer);
        Global.btnClickEvent(this.btn_prePage, this.onClickPrePage,this);
        this.btn_nextPage = cc.find("bg_member/panel_list/node_bottom/btn_nextPage",this._layer);
        Global.btnClickEvent(this.btn_nextPage, this.onClickNextPage,this); 
        this.text_page = cc.find("bg_member/panel_list/node_bottom/text_page",this._layer);

        this._layer.addComponent("ClubSetPartnerRatio");
        this.ClubSetPartnerRatioJS = this._layer.getComponent("ClubSetPartnerRatio");

        this._layer.addComponent("ClubSetPower");
        this.ClubSetPowerJS = this._layer.getComponent("ClubSetPower");

        this.panel_memberOperate = cc.find("bg_member/panel_member", this._layer);
        this.onClickCloseMemberOperate();
        let btnCloseMemberOperate = this.panel_memberOperate.getChildByName("btnCloseMemberOperate");
        Global.btnClickEvent(btnCloseMemberOperate, this.onClickCloseMemberOperate, this);
        this.btn_tickout = this.panel_memberOperate.getChildByName("btn_tickout");
        Global.btnClickEvent(this.btn_tickout, this.onClickTickout,this);
        this.btn_forbidPlay = this.panel_memberOperate.getChildByName("btn_forbidPlay");
        Global.btnClickEvent(this.btn_forbidPlay, this.onClickForbidPlay,this);
        this.btn_recoverPlay = this.panel_memberOperate.getChildByName("btn_recoverPlay");
        Global.btnClickEvent(this.btn_recoverPlay, this.onClickRecoverPlay,this); 
    },

    initShow(){
        this.isShowSearchMember = false;
        this.input_nameID.getComponent(cc.EditBox).string = "";
        for (let i = 0; i < this.sortBtnArr.length; i++) {
            this.sortBtnArr[i].isSmallToBig = true;
        }
        this.panel_dateSelect.active = false;

        let selectData = new Date();
        this.curData = {};
        this.curData.year = selectData.getFullYear();
        this.curData.month = selectData.getMonth();     //比实际小1
        this.curData.day = selectData.getDate();
        this.selectData = JSON.parse(JSON.stringify(this.curData));
        
        this.btn_back.active = (0 < Global.checkPartnerList.length);
        
        this.text_page.getComponent(cc.Label).string = "1/1";
        this.curStartIndex = Global.curStartIndex ? Global.curStartIndex : 0;

        this.sendMemberListReq();
    },

    onClickBack(){
        if (this.isShowSearchMember) {
            this.isShowSearchMember = false;
            this.btn_back.active = (0 < Global.checkPartnerList.length);
            this.sendMemberListReq();
        } else if (0 < Global.checkPartnerList.length) {
            Global.checkPartnerList.pop();
            this.curStartIndex = Global.checkPartnerListCurStartIndex[Global.checkPartnerListCurStartIndex.length-1];
            Global.checkPartnerListCurStartIndex.pop();
            this.btn_back.active = (0 < Global.checkPartnerList.length);
            this.sendMemberListReq();
        }
    },

    onClickClose(){
        this._layer.active = false;
    },

    sendMemberListReq(){
        let dataStr = Global.getDataStr(this.selectData.year,this.selectData.month,this.selectData.day);       
        this.text_data.getComponent(cc.Label).string = dataStr;

        let req = { 'c': MsgId.CLUB_MEMBER_LIST};
        req.selectTime = Global.getDataStr(this.selectData.year,this.selectData.month,this.selectData.day);
        req.clubid = cc.vv.UserManager.currClubId;
        if (0 < Global.checkPartnerList.length) {
            req.tarUid = Global.checkPartnerList[Global.checkPartnerList.length-1];
        }
        req.starty = this.curStartIndex;
        req.endy = 10000;
        cc.vv.NetManager.send(req);

        this.showList = [];
    },

    onClickSearch(event){
        let inputStr = this.input_nameID.getComponent(cc.EditBox).string;
        if (inputStr && 6 == inputStr.length) {
            let req = { 'c': MsgId.SEARCH_CLUB_MEMBER};
            req.selectTime = Global.getDataStr(this.selectData.year,this.selectData.month,this.selectData.day);
            req.clubid = cc.vv.UserManager.currClubId;
            req.selectUid = inputStr;
            cc.vv.NetManager.send(req);
        }
    },

    onClickPrePage(){
        this.curStartIndex -= this.pagePlayerNum;
        this.sendMemberListReq();
    },

    onClickNextPage(){
        this.curStartIndex += this.pagePlayerNum;
        this.sendMemberListReq();
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
        this.memberList.sort((obj1, obj2)=>{
            if ("btn_IDSort" == event.target.name) {
                return seq * (obj1.uid - obj2.uid);
            } else if ("btn_stateSort" == event.target.name) {
                return seq * (obj1.isOnLine - obj2.isOnLine);
            } else if ("btn_roundNumSort" == event.target.name) {
                return seq * (obj1.jushu - obj2.jushu);
            } else if ("btn_bigWinerNumSort" == event.target.name) {
                return seq * (obj1.bigWinCnt - obj2.bigWinCnt);
            } else if ("btn_waterProSort" == event.target.name) {
                return seq * (obj1.cost - obj2.cost);
            } else if ("btn_scoreSort" == event.target.name) {
                return seq * (obj1.totalScore - obj2.totalScore);
            } else if ("btn_powerSort" == event.target.name) {
                return seq * (obj1.power - obj2.power);
            } else if ("btn_totalPowerSort" == event.target.name) {
                return seq * (obj1.totalPower - obj2.totalPower);
            }
            return false;
        });
        this.updateMemberList();
    },

    onRcvMemberList(msg){
        if (200 == msg.code && msg.memberList) {
            let curPage = (this.curStartIndex/this.pagePlayerNum + 1);
            this.btn_prePage.getComponent(cc.Button).interactable = 1 < curPage;
            this.btn_nextPage.getComponent(cc.Button).interactable = curPage < msg.pagCnt;
            this.text_page.getComponent(cc.Label).string = curPage + "/" + msg.pagCnt;

            for (let i = 0; i < this.sortBtnArr.length; i++) {
                this.sortBtnArr[i].isSmallToBig = true;
            }
            this.isShowSearchMember = false;
            this.memberList = msg.memberList;
            this.updateMemberList();
        }
    },

    onRcvSearchClubMember(msg){
        if (200 == msg.code){
            this.btn_prePage.getComponent(cc.Button).interactable = false
            this.btn_nextPage.getComponent(cc.Button).interactable = false;
            this.text_page.getComponent(cc.Label).string = "1/1";

            this.isShowSearchMember = true;
            this.btn_back.active = true;
            this.memberList = [msg.memberInfo];
            this.updateMemberList()
        }
    },

    updateMemberList(list){
        let showList = list ? list : this.memberList;
        let removeCount = 0;
        for (let i = showList.length-1; i >= removeCount; i--) {
            if (showList[i].hehuo) {
                let tempInfo = showList[i];
                showList.splice(i, 1);
                showList.unshift(tempInfo);
                ++removeCount;
                ++i;
            }
        }
        for (let i = 0; i < showList.length; i++) {
            if (showList[i].uid == cc.vv.UserManager.uid) {
                let clubCeateInfo = showList[i];
                showList.splice(i, 1);
                showList.unshift(clubCeateInfo);
                break;
            }
        }
        if (0 < Global.checkPartnerList.length) {
            for (let i = 0; i < showList.length; i++) {
                if (showList[i].uid == Global.checkPartnerList[Global.checkPartnerList.length-1]) {
                    let clubCeateInfo = showList[i];
                    showList.splice(i, 1);
                    showList.unshift(clubCeateInfo);
                    break;
                }
            }
        }

        this.showMemberList(showList);
    },

    showMemberList(showList){
        this.showList = showList;
        this.showNum = (15 > showList.length) ? showList.length : 15;
        this.memberListContent.removeAllChildren();
        for (let i = 0; i < this.showNum; i++) {
            let item =  cc.instantiate(this.memberItem);
            item.parent = this.memberListContent;
            item.listIndex = i;
            this.updateMemberItem(item);
            item.active = true;
        }
        this.memberListContent.height = this.memberItem.height * showList.length;
        this.memberListContent.y = 0;
        this.lastFrameContentY = this.memberListContent.y;
    },

    update (dt) {
        if (this.showList && 15 < this.showList.length) {
            if (this.lastFrameContentY < this.memberListContent.y) {        //上移中
                for (var i = 0; i < this.memberListContent.children.length; i++) {
                    let item = this.memberListContent.children[i];
                    if (500 < (item.y + this.memberListContent.y) && (item.listIndex + 15) < this.showList.length) {
                        item.listIndex += 15;
                        this.updateMemberItem(item);
                    }
                }

            } else if (this.lastFrameContentY > this.memberListContent.y && 0 < this.memberListContent.y) { //下移中
                for (var i = this.memberListContent.children.length - 1; i >= 0 ; i--) {
                    let item = this.memberListContent.children[i];
                    if (-500 > (item.y + this.memberListContent.y) && (item.listIndex - 15) >= 0) {
                        item.listIndex -= 15;
                        this.updateMemberItem(item);
                    }
                }
            }
            this.lastFrameContentY = this.memberListContent.y;
        }
    },

    updateMemberItem(item){
        let userInfo = this.showList[item.listIndex];
        item.y = - item.height * item.listIndex;
        item.uid = userInfo.uid;

        Global.btnClickEventOff(item, this.onClickSetPartnerRatio,this);
        Global.btnClickEventOff(cc.find("bg_memberItem/UserHead", item), this.onClickCheckPartnerMember,this);
        Global.btnClickEventOff(item, this.onClickCheckRecord,this);
        Global.btnClickEventOff(cc.find("bg_memberItem/text_waterScore/btn_waterScore", item), this.onClickWaterScore,this);
        Global.btnClickEventOff(cc.find("bg_memberItem/text_power/btn_setPower", item), this.onClickSetPower,this);
        Global.btnClickEventOff(cc.find("bg_memberItem/btn_operate", item), this.onClickShowMemberOperate,this);

        if (cc.vv.UserManager.uid != userInfo.uid && userInfo.hehuo) {
            if (0 === Global.checkPartnerList.length) {
                item.partneruid = userInfo.uid;
                Global.btnClickEventOn(item, this.onClickSetPartnerRatio,this);
            }

            if ( ! (0 < Global.checkPartnerList.length && userInfo.uid == Global.checkPartnerList[Global.checkPartnerList.length-1])) {
                let userHead = cc.find("bg_memberItem/UserHead", item);
                userHead.partneruid = userInfo.uid;
                Global.btnClickEventOn(userHead, this.onClickCheckPartnerMember,this);
            }
        }
        if (!userInfo.hehuo) {
            item.uid = userInfo.uid;
            Global.btnClickEventOn(item, this.onClickCheckRecord,this);
        }
        
        let bg_memberItem = item.getChildByName("bg_memberItem");
        bg_memberItem.getChildByName("spr_creater").active = (cc.vv.UserManager.getCurClubInfo().createUid == userInfo.uid);
        bg_memberItem.getChildByName("spr_partner").active = (cc.vv.UserManager.getCurClubInfo().createUid != userInfo.uid && userInfo.hehuo);
        bg_memberItem.getChildByName("spr_stopPlay").active = (!userInfo.state);
        let spr_head = cc.find("UserHead/radio_mask/spr_head", bg_memberItem);
        Global.setHead(spr_head, userInfo.usericon);

        bg_memberItem.getChildByName("text_name").getComponent(cc.Label).string = userInfo.playername;
        bg_memberItem.getChildByName("text_ID").getComponent(cc.Label).string = userInfo.uid;
        bg_memberItem.getChildByName("text_state").getComponent(cc.Label).string = userInfo.isOnLine ? "在线" : "离线";
        bg_memberItem.getChildByName("text_state").color = userInfo.isOnLine ? (new cc.Color(0,255,0)) : (new cc.Color(135,135,135));
        bg_memberItem.getChildByName("text_waterScore").active = userInfo.hehuo;
        if (userInfo.hehuo) {
            if (0 != userInfo.shuiScore) {
                bg_memberItem.getChildByName("text_waterScore").getComponent(cc.Label).string = userInfo.shuiScore.toFixed(2);
            } else {
                bg_memberItem.getChildByName("text_waterScore").getComponent(cc.Label).string = userInfo.shuiScore;
            }
            let btn_waterScore = cc.find("text_waterScore/btn_waterScore", bg_memberItem);
            btn_waterScore.uid = userInfo.uid;
            Global.btnClickEventOn(btn_waterScore, this.onClickWaterScore,this); 
        }
        bg_memberItem.getChildByName("text_roundNum").getComponent(cc.Label).string = userInfo.jushu;
        bg_memberItem.getChildByName("text_bigWinerNum").getComponent(cc.Label).string = userInfo.bigWinCnt;
        if (-1 < userInfo.waterPro) {
            bg_memberItem.getChildByName("text_waterPro").getComponent(cc.Label).string = userInfo.waterPro + "%";
        } else {
            bg_memberItem.getChildByName("text_waterPro").getComponent(cc.Label).string = "--";
        }
        if (0 != userInfo.totalScore) {
            bg_memberItem.getChildByName("text_score").getComponent(cc.Label).string = userInfo.totalScore.toFixed(2);
        } else {
            bg_memberItem.getChildByName("text_score").getComponent(cc.Label).string = userInfo.totalScore;
        }
        if (0 != userInfo.power) {
            bg_memberItem.getChildByName("text_power").getComponent(cc.Label).string = userInfo.power.toFixed(2);
        } else {
            bg_memberItem.getChildByName("text_power").getComponent(cc.Label).string = userInfo.power;
        }
        if (0 != userInfo.totalPower) {
            bg_memberItem.getChildByName("text_totalPower").getComponent(cc.Label).string = userInfo.totalPower.toFixed(2);
        } else {
            bg_memberItem.getChildByName("text_totalPower").getComponent(cc.Label).string = userInfo.totalPower;
        }
        
        if (0 === Global.checkPartnerList.length) {
            if (cc.vv.UserManager.getCurClubInfo().createUid == userInfo.uid || cc.vv.UserManager.uid != userInfo.uid) {
                let btn_setPower = cc.find("text_power/btn_setPower", bg_memberItem);
                btn_setPower.uid = userInfo.uid;
                Global.btnClickEventOn(btn_setPower, this.onClickSetPower,this); 
            }
            let btn_operate = bg_memberItem.getChildByName("btn_operate");
            btn_operate.active = (userInfo.isMember && cc.vv.UserManager.uid != userInfo.uid);
            if (btn_operate.active) {
                btn_operate.playerInfo = userInfo;
                Global.btnClickEventOn(btn_operate, this.onClickShowMemberOperate,this); 
            }
        }
    },

    onClickCheckRecord(event){
        Global.dispatchEvent(EventId.SHOW_CLUB_RECORD, event.target.uid);
        Global.curStartIndex = this.curStartIndex;
    },

    onClickShowMemberOperate(event){
        this.panel_memberOperate.active = true;

        let playerInfo = event.target.playerInfo;
        this.panel_memberOperate.getChildByName("text_memberInfo").getComponent(cc.Label).string = "当前操作成员:"+playerInfo.playername;

        this.btn_tickout.uid = playerInfo.uid;
        this.btn_tickout.playername = playerInfo.playername;

        this.btn_forbidPlay.active = (1 == playerInfo.state);
        this.btn_forbidPlay.uid = playerInfo.uid;
        this.btn_forbidPlay.playername = playerInfo.playername;

        this.btn_recoverPlay.active = (0 == playerInfo.state);
        this.btn_recoverPlay.uid = playerInfo.uid;
        this.btn_recoverPlay.playername = playerInfo.playername;
    },

    onClickCloseMemberOperate(){
        this.panel_memberOperate.active = false;
    },

    onClickSetPartnerRatio(event){
        this.ClubSetPartnerRatioJS.showLayer(event.target.partneruid);
    },

    onClickCheckPartnerMember(event){
        Global.checkPartnerList.push(event.target.partneruid);
        Global.checkPartnerListCurStartIndex.push(this.curStartIndex);
        this.btn_back.active = (0 < Global.checkPartnerList.length);
        this.curStartIndex = 0;
        this.sendMemberListReq();
    },

    onRcvSetPartner(data){
        data = data.detail;
        if (200 == data.code && this._layer && this._layer.active && data.clubid === cc.vv.UserManager.currClubId) {
            for (let i = 0; i < this.memberList.length; i++) {
                if (data.partneruid === this.memberList[i].uid) {
                    this.memberList[i].hehuo = (1 == data.type) ? 1 : 0;
                    this.updateMemberList();
                    break;
                }
            }
        }
    },

    onClickForbidPlay(event){
        let self = this;
        self.kickUid = event.target.uid;
        let sureCall = function () {
            let req = { 'c': MsgId.MEMBER_FORBID_PLAY};
            req.clubid = cc.vv.UserManager.currClubId;
            req.pauseUid = self.kickUid;
            cc.vv.NetManager.send(req);
        }
        let cancelCall = function () {
        }
        cc.vv.AlertView.show("确定将" + event.target.playername + "禁止娱乐吗", sureCall, cancelCall);
    },

    onClickRecoverPlay(event){
        let self = this;
        self.kickUid = event.target.uid;
        let sureCall = function () {
            let req = { 'c': MsgId.MEMBER_RECOVER_PLAY};
            req.clubid = cc.vv.UserManager.currClubId;
            req.recoverUid = self.kickUid;
            cc.vv.NetManager.send(req);
        }
        let cancelCall = function () {
        }
        cc.vv.AlertView.show("确定将" + event.target.playername + "恢复娱乐吗", sureCall, cancelCall);
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

    onClickWaterScore(event){
        let data = {checkUid:event.target.uid, checkData:this.selectData}
        this.node.getComponent("ClubWaterRecord").showLayer(data);
    },

    onClickSetPower(event){
        this.ClubSetPowerJS.showLayer(event.target.uid);
    },

    onRcvMemberState(msg){
        this.onClickCloseMemberOperate();
        if (200 == msg.code) {
            for(let i = 0; i < this.memberListContent.children.length; ++i){
                let childrenItem = this.memberListContent.children[i];
                if (msg.uid === childrenItem.uid && childrenItem.active) {
                    cc.find("bg_memberItem/btn_operate", childrenItem).playerInfo.state = msg.state;
                    cc.find("bg_memberItem/spr_stopPlay", childrenItem).active = (!msg.state);
                    break;
                }
            }
            for (let i = 0; i < this.memberList.length; i++) {
                if (msg.uid === this.memberList[i].uid) {
                    this.memberList[i].state = msg.state;
                    break;
                }
            }
        }
    },

    onRcvTickoutMember(msg){
        this.onClickCloseMemberOperate();
        if (200 == msg.code) {
            this.sendMemberListReq();
            cc.vv.FloatTip.show("踢出玩家成功");
        }
    },

    onRcvSetPower(msg){
        this.onClickCloseMemberOperate();
        if (200 == msg.code) {
            for(let i = 0; i < this.memberListContent.children.length; ++i){
                let childrenItem = this.memberListContent.children[i];
                if (cc.vv.UserManager.uid === childrenItem.uid && childrenItem.active) {
                    cc.find("bg_memberItem/text_power", childrenItem).getComponent(cc.Label).string = msg.myPower.toFixed(2);
                }
                if (msg.memberuid === childrenItem.uid && childrenItem.active) {
                    cc.find("bg_memberItem/text_power", childrenItem).getComponent(cc.Label).string = msg.memPower.toFixed(2);
                }
            }
            for (let i = 0; i < this.memberList.length; i++) {
                if (cc.vv.UserManager.uid === this.memberList[i].uid) {
                    this.memberList[i].power = msg.myPower;
                }
                if (msg.memberuid === this.memberList[i].uid) {
                    this.memberList[i].power = msg.memPower;
                }
            }
            cc.vv.FloatTip.show("操作成功");
        }
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_MEMBER_LIST, this.onRcvMemberList, this);
        cc.vv.NetManager.unregisterMsg(MsgId.MEMBER_FORBID_PLAY, this.onRcvMemberState, this);
        cc.vv.NetManager.unregisterMsg(MsgId.MEMBER_RECOVER_PLAY, this.onRcvMemberState, this);
        cc.vv.NetManager.unregisterMsg(MsgId.TICKOUT_CLUB_MEMBER, this.onRcvTickoutMember, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_SET_POWER, this.onRcvSetPower, this);
        cc.vv.NetManager.unregisterMsg(MsgId.SEARCH_CLUB_MEMBER, this.onRcvSearchClubMember, this);
        if(this._layer){
            cc.loader.releaseRes("common/prefab/club_member",cc.Prefab);
        }
    },
});
