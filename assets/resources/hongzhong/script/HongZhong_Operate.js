
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
        this._btnHu = cc.find("scene/play_action_view/img_bg/btn_hu",this.node);
        Global.btnClickEvent(this._btnHu,this.onHu,this);

        // 碰
        this._btnPeng = cc.find("scene/play_action_view/img_bg/btn_peng",this.node);
        Global.btnClickEvent(this._btnPeng,this.onPeng,this);

        // 杠
        this._btnGang = cc.find("scene/play_action_view/img_bg/btn_gang",this.node);
        Global.btnClickEvent(this.btn_gang,this.onGang,this);

        // 过
        this._btnGuo = cc.find("scene/play_action_view/img_bg/btn_guo",this.node);
        Global.btnClickEvent(this._btnGuo,this.onGuo,this);

        this.registerMsg();
    },

    registerMsg () {
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.OUTCARD_NOTIFY,this.recvOutCardNotify,this);
        // Global.registerEvent(EventId.CHI_NOTIFY,this.onCloseSelectChi,this);
        // Global.registerEvent(EventId.PENG_NOTIFY,this.onCloseSelectChi,this);
        // Global.registerEvent(EventId.PAO_NOTIFY,this.onCloseSelectChi,this);
        // Global.registerEvent(EventId.KAN_NOTIFY,this.onCloseSelectChi,this);
        // Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);

        this.recvDeskInfoMsg();
    },

    recvDeskInfoMsg(){
        let deskInfo = cc.vv.gameData.getDeskInfo();
        if(deskInfo.isReconnect){
            if(deskInfo.actionInfo.iswait){
                this.showOperate(deskInfo);
            }
        }
    },

    recvOutCardNotify(data){
        data = data.detail;
        if(data.actionInfo.waitList.length>0){
            this.showOperate(data);
        }else{
            this.onCloseSelectChi();
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
                    else if(data.actionInfo.waitList[i].type === cc.vv.gameData.OPERATETYPE.PENG) this.enableBtn(this._btnPeng);
                    else if(data.actionInfo.waitList[i].type === cc.vv.gameData.OPERATETYPE.GANG) this.enableBtn(this._btnGang);
                    else if(data.actionInfo.waitList[i].type === cc.vv.gameData.OPERATETYPE.GU0) this.enableBtn(this._btnGuo);
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

    },

    // 碰
    onPeng(event){
        cc.vv.gameData.peng();
        this.closeOperate();
    },

    // 杠
    onGang(){

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
        this._btnHu.getComponent(cc.Button).interactable = false;
        this._btnPeng.getComponent(cc.Button).interactable = false;
        this._btnGang.getComponent(cc.Button).interactable = false;
        this._btnGuo.getComponent(cc.Button).interactable = false;
    },

    enableBtn(btn,data=null){
        btn.getComponent(cc.Button).interactable = true;
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
