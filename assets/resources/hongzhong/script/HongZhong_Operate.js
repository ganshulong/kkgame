
cc.Class({
    extends: cc.Component,

    properties: {
    
        _operateNode:null,
        _selectChiNode:null,    // 选择吃
        _selectLuoNode:null,    // 落牌选择
        _chiItemsList:[],
        _luoItemsList:[],
        _currActionCard:-1,
        _chiData:null,
        _chi:null,
    },

    start () {
        this._operateNode = cc.find("scene/play_action_view",this.node);
        this._operateNode.active = false;

        // 胡
        this._btnHu = cc.find("scene/play_action_view/btn_hu",this.node);
        Global.btnClickEvent(this._btnHu,this.onHu,this);

        // 碰
        this._btnPeng = cc.find("scene/play_action_view/btn_peng",this.node);
        Global.btnClickEvent(this._btnPeng,this.onPeng,this);

        // 杠
        this._btnGang = cc.find("scene/play_action_view/btn_gang",this.node);
        Global.btnClickEvent(this._btnGang,this.onGang,this);

        // 过
        this._btnGuo = cc.find("scene/play_action_view/btn_guo",this.node);
        Global.btnClickEvent(this._btnGuo,this.onGuo,this);

        // 听
        this.panel_ting = cc.find("scene/panel_ting",this.node);
        this.panel_ting.active = false;

        this.btn_checkTing = this.panel_ting.getChildByName("btn_checkTing");
        Global.btnClickEvent(this.btn_checkTing, this.onClickCheckTing,this);
        this.mask_checkTing = this.panel_ting.getChildByName("mask");
        Global.btnClickEvent(this.mask_checkTing, this.onClickHideTing,this);

        this.scrollview_tingCard = this.panel_ting.getChildByName("scrollview_tingCard");
        this.tingCard_content = cc.find("view/content", this.scrollview_tingCard);
        this.tingCard_item = cc.find("view/item", this.scrollview_tingCard);
        this.tingCard_item.active = false;

        let deskInfo = cc.vv.gameData.getDeskInfo();
        if(deskInfo.isReconnect){
            for(let i=0;i<deskInfo.users.length;++i){
                let chairId = cc.vv.gameData.getLocalChair(deskInfo.users[i].seat);
                let uiSeat = cc.vv.gameData.getUISeatBylocalSeat(chairId);
                if(0 == uiSeat && 0 < deskInfo.users[i].tingPaiInfo.length){
                    this.showTingCards(deskInfo.users[i].tingPaiInfo);
                }
            }
        }

        this.registerMsg();
    },

    registerMsg () {
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.OUTCARD_NOTIFY,this.recvOutCardNotify,this);
        Global.registerEvent(EventId.MOPAI_NOTIFY,this.recvMoPaiNotify,this);
        Global.registerEvent(EventId.OUTCARD_RESULT, this.onRcvOutCardResult,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOverNotify,this);

        this.recvDeskInfoMsg();
    },

    onRcvOutCardResult(data){
        let tingPaiInfo = data.detail
        this.showTingCards(tingPaiInfo);
    },

    recvRoundOverNotify(data){
        this.panel_ting.active = false;
    },

    showTingCards(tingPaiInfo){
        this.tingPaiInfo = tingPaiInfo;
        this.panel_ting.active = 0 < tingPaiInfo.length;
        if (this.panel_ting.active) {
            this.btn_checkTing.active = true;
            this.scrollview_tingCard.active = false;
            this.mask_checkTing.active = false;
        }
    },

    onClickCheckTing(){
        this.tingCard_content.removeAllChildren();
        for (let i = 0; i < this.tingPaiInfo.length; i++) {
            let tingCard_item = cc.instantiate(this.tingCard_item);
            tingCard_item.parent = this.tingCard_content;
            tingCard_item.x = tingCard_item.width * i;
            let spr_card = tingCard_item.getChildByName("spr_card");
            this.node.getComponent("HongZhong_Card").createCard(this.tingPaiInfo[i].card, true , false, spr_card);
            tingCard_item.getChildByName("text_tingZhangNum").getComponent(cc.Label).string = this.tingPaiInfo[i].num;

            tingCard_item.active = true;
        }
        this.tingCard_content.width = this.tingCard_item.width * this.tingPaiInfo.length;

        this.btn_checkTing.active = false;
        this.scrollview_tingCard.active = true;
        this.mask_checkTing.active = true;
    },

    onClickHideTing(){
        this.btn_checkTing.active = true;
        this.scrollview_tingCard.active = false;
        this.mask_checkTing.active = false;
    },

    recvDeskInfoMsg(){
        let deskInfo = cc.vv.gameData.getDeskInfo();
        if(deskInfo.isReconnect){
            if(deskInfo.actionInfo.iswait && 0 < deskInfo.actionInfo.waitList.length){
                this.showOperate(deskInfo);
            }
        }
    },

    recvOutCardNotify(data){
        data = data.detail;
        if(data.actionInfo.iswait && 0 < data.actionInfo.waitList.length){
            this.showOperate(data);
        }
    },

    recvMoPaiNotify(data){
        data = data.detail;
        if(data.actionInfo.iswait && 0 < data.actionInfo.waitList.length){
            this.showOperate(data);
        }
    },

    showOperate(data){
        this.disenableBtn();
        this._currActionCard = data.actionInfo.curaction.card;
        this._operateNode.active = false;
        if(data.actionInfo.waitList){
            for(let i=0;i<data.actionInfo.waitList.length;++i){
                if(data.actionInfo.waitList[i].seat === cc.vv.gameData.getMySeatIndex()){
                    this._operateNode.active = true;
                    if(data.actionInfo.waitList[i].type === cc.vv.gameData.OPERATETYPE.HU) this.enableBtn(this._btnHu);
                    else if(data.actionInfo.waitList[i].type === cc.vv.gameData.OPERATETYPE.GANG) this.enableBtn(this._btnGang);
                    else if(data.actionInfo.waitList[i].type === cc.vv.gameData.OPERATETYPE.PENG) this.enableBtn(this._btnPeng);
                    else if(data.actionInfo.waitList[i].type === cc.vv.gameData.OPERATETYPE.GU0) this.enableBtn(this._btnGuo);
                }
            }
            if (this._operateNode.active) {
                let showBtnCound = 0;
                if (this._btnHu.active) {
                    this._btnHu.x = 150 * showBtnCound++;
                }
                if (this._btnGang.active) {
                    this._btnGang.x = 150 * showBtnCound++;
                }
                if (this._btnPeng.active) {
                    this._btnPeng.x = 150 * showBtnCound++;
                }
                if (this._btnGuo.active) {
                    this._btnGuo.x = 150 * showBtnCound++;
                }
            }
        }
    },

    clearDesk(){
        if(this._operateNode) this._operateNode.active = false;
        if(this._selectChiNode) this._selectChiNode.active = false;
        if(this._selectLuoNode) this._selectLuoNode.active = false;
    },

    // 胡
    onHu(){
        cc.vv.gameData.hu();
        this.closeOperate();
    },

    // 碰
    onPeng(event){
        cc.vv.gameData.peng();
        this.closeOperate();
    },

    // 杠
    onGang(){
        cc.vv.gameData.gang();
        this.closeOperate();
    },

    // 过
    onGuo(event){
        cc.vv.gameData.pass();
        this.closeOperate();
    },

    closeOperate(){
        this._operateNode.active = false;
    },

    disenableBtn(){
        // this._btnHu.getComponent(cc.Button).interactable = false;
        // this._btnGang.getComponent(cc.Button).interactable = false;
        // this._btnPeng.getComponent(cc.Button).interactable = false;
        // this._btnGuo.getComponent(cc.Button).interactable = false;
        this._btnHu.active = false;
        this._btnGang.active = false;
        this._btnPeng.active = false;
        this._btnGuo.active = false;
    },

    enableBtn(btn,data=null){
        btn.active = true;
        btn.stopAllActions();
        btn.data = data;
    },

    onDestroy(){
        if(this._selectChiNode){
            cc.loader.releaseRes("common/prefab/chi", cc.Prefab);
        }
    },
    // update (dt) {},
});
