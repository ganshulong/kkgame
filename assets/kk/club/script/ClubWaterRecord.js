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
        cc.vv.NetManager.registerMsg(MsgId.MEMEBER_WATER_RECORD, this.onRcvMemberWaterRecord, this);
    },

    showLayer(data){
        this.checkUid = data.checkUid;
        if(this._layer === null){
            cc.loader.loadRes("common/prefab/club_waterRecord",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._layer = cc.instantiate(prefab);
                    this._layer.scaleX = this.node.width / this._layer.width;
                    this._layer.scaleY = this.node.height / this._layer.height;
                    this._layer.parent = this.node;
                    this._layer.zIndex = 1;
                    this._layer.x = this.node.width/2 - this.node.x;
                    this._layer.y = this.node.height/2 - this.node.y;

                    this.initUI();
                    this.initShow(data.checkData);
                }
            })
        }
        else{
            this._layer.active = true;
            this.initShow(data.checkData);
        }
    },

    initUI(){
        let btn_close = cc.find("bg_member/btn_close",this._layer);
        Global.btnClickEvent(btn_close,this.onClose,this);
        
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

        this.listContent = cc.find("bg_member/panel_list/scrollView/content",this._layer);
        this.listItem = cc.find("bg_member/panel_list/scrollView/memberItem",this._layer);
        this.listItem.active = false;
    },

    initShow(checkData){
        let selectData = new Date();
        this.curData = {};
        this.curData.year = selectData.getFullYear();
        this.curData.month = selectData.getMonth();     //比实际小1
        this.curData.day = selectData.getDate();
        this.selectData = checkData;

        this.sendListReq();
    },

    onClose(){
        this._layer.active = false;
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
        this.sendListReq();
    },

    sendListReq(searchID){
        let dataStr = Global.getDataStr(this.selectData.year,this.selectData.month,this.selectData.day);       
        this.text_data.getComponent(cc.Label).string = dataStr;

        let req = { 'c': MsgId.MEMEBER_WATER_RECORD};
        req.huoUid = this.checkUid;
        req.clubid = cc.vv.UserManager.currClubId;
        req.selectTime = dataStr;
        cc.vv.NetManager.send(req);
    },


    onRcvMemberWaterRecord(msg){
        if (200 == msg.code && msg.waterList) {
            this.listContent.removeAllChildren();
            let showList = msg.waterList;
            for (let i = 0; i < showList.length; i++) {
                let item =  cc.instantiate(this.listItem);
                item.parent = this.listContent;
                item.y = - item.height * i;

                let bg_memberItem = item.getChildByName("bg_memberItem");
                let spr_head = cc.find("UserHead/radio_mask/spr_head", bg_memberItem);
                Global.setHead(spr_head, showList[i].usericon);
                bg_memberItem.getChildByName("text_name").getComponent(cc.Label).string = showList[i].playername;
                bg_memberItem.getChildByName("text_ID").getComponent(cc.Label).string = showList[i].gxuid;
                if (0 != showList[i].score) {
                    bg_memberItem.getChildByName("text_water").getComponent(cc.Label).string = showList[i].score.toFixed(2);
                }
                bg_memberItem.getChildByName("text_time").getComponent(cc.Label).string = showList[i].time;
                item.active = true;
            }
        }
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.MEMEBER_WATER_RECORD, this.onRcvMemberWaterRecord, this);
        if(this._layer){
            cc.loader.releaseRes("common/prefab/club_waterRecord",cc.Prefab);
        }
    },
});
