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
        _operateNode:null,
        _selectChiNode:null,    // 选择吃
        _selectLuoNode:null,    // 落牌选择
        _chiItemsList:[],
        _luoItemsList:[],
        _currActionCard:-1,
        _chiData:null,
        _chi:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.registerMsg();
        this._operateNode = cc.find("scene/play_action_view",this.node);
        this._operateNode.active = false;

        // 吃
        this._btnChi = cc.find("scene/play_action_view/img_bg/btn_chi",this.node);
        Global.btnClickEvent(this._btnChi,this.onChi,this);

        // 碰
        this._btnPeng = cc.find("scene/play_action_view/img_bg/btn_peng",this.node);
        Global.btnClickEvent(this._btnPeng,this.onPeng,this);

        // 胡
        this._btnHu = cc.find("scene/play_action_view/img_bg/btn_hu",this.node);
        Global.btnClickEvent(this._btnHu,this.onHu,this);

        // 过
        this._btnGuo = cc.find("scene/play_action_view/img_bg/btn_guo",this.node);
        Global.btnClickEvent(this._btnGuo,this.onGuo,this);


        this.recvDeskInfoMsg();

    },

    clearDesk(){
        if(this._operateNode) this._operateNode.active = false;
        if(this._selectChiNode) this._selectChiNode.active = false;
        if(this._selectLuoNode) this._selectLuoNode.active = false;
    },

    showSelectChi(list){
        if(this._selectChiNode === null){
            cc.loader.loadRes("common/prefab/chi", cc.Prefab, (error, prefab)=>{
                if(error === null){
                    this._selectChiNode = cc.instantiate(prefab);
                    this._selectChiNode.parent = this.node;
                    this._selectChiNode.zIndex = 1;
                    let item = cc.find("img_bg/item",this._selectChiNode);
                    this._chiItemsList.push(item);
                    let closeBtn = cc.find("img_bg/btn_close",this._selectChiNode);
                    this._selectChiNode.active = true;
                    Global.btnClickEvent(closeBtn,()=>{
                        this.onCloseSelectChi();
                        this._operateNode.active = true;
                    });

                    this._selectLuoNode = cc.instantiate(prefab);
                    this._selectLuoNode.parent = this.node;
                    this._selectLuoNode.zIndex = 2;

                    item = cc.find("img_bg/item",this._selectLuoNode);
                    this._luoItemsList.push(item);
                    closeBtn = cc.find("img_bg/btn_close",this._selectLuoNode);
                    this._selectLuoNode.active = false;
                    Global.btnClickEvent(closeBtn,()=>{
                        this._selectLuoNode.active = false;
                        this._selectChiNode.active = true;
                        this._chi = {
                            chiData:null,
                            luoData:[],
                            luoCount:0,
                         };
                    });

                    this.initChi(list);
                }
            })
        }
        else{
            this.initChi(list);
            this._selectChiNode.active = true;
        }
    },

    initLuoData(list){
        let width = 0;
        this._selectLuoNode.active = true;
        let bg = this._selectLuoNode.getChildByName("img_bg");
        for(let i=0;i<list.length;++i){
            let item = null;
            if(i<this._luoItemsList.length){
                item = this._luoItemsList[i];
            }
            else{
                item = cc.instantiate(this._luoItemsList[0]);
                item.parent = this._luoItemsList[0].parent;
                this._luoItemsList.push(item);
            }
            item.getComponent(cc.Button).interactable = true;
            item.x = -list.length*0.5*item.width+item.width*i;
            item.data = list[i];
            Global.btnClickEvent(item,this.onSelectLuo,this);
            width += item.width;

            let temp = list[i].slice(0);
            // temp.unshift(this._currActionCard);

            for(let j=0;j<3;++j){
                let card = cc.find("img_bg/card"+j,item);
                this.node.getComponent("PengHu_Card").createCard(temp[j],1,false,card);
            }
        }
        for(let i=list.length;i<this._luoItemsList.length;++i){
            this._luoItemsList[i].active = false;
            this._luoItemsList[i].data = null;
        }
        bg.width = width+80;
        let closeBtn = cc.find("img_bg/btn_close",this._selectLuoNode);
        closeBtn.getComponent(cc.Widget).updateAlignment();
    },

    // 选择落牌
    onSelectLuo(event){
        event.target.getComponent(cc.Button).interactable = false;
        event.target.opacity = 200;
        this._chi.luoData.push(event.target.data);
        if(this._chi.luoCount === this._chi.luoData.length){
            cc.vv.gameData.chi(this._chi);
            this._selectLuoNode.active = false;
        }
    },

    initChi(list){
        let width = 0;
         let bg = this._selectChiNode.getChildByName("img_bg");
        for(let i=0;i<list.length;++i){
            let item = null;
            if(i<this._chiItemsList.length){
                item = this._chiItemsList[i];
            }
            else{
                item = cc.instantiate(this._chiItemsList[0]);
                item.parent = this._chiItemsList[0].parent;
                this._chiItemsList.push(item);
            }
            item.x = -list.length*0.5*item.width+item.width*i;
            item.data = list[i];
            item.getComponent(cc.Button).interactable = true;
            item.opacity = 255;
            Global.btnClickEvent(item,this.onSelectChi,this);
            width += item.width;

            let temp = list[i].chiData.slice(0);
            temp.unshift(this._currActionCard);

            for(let j=0;j<3;++j){
                let card = cc.find("img_bg/card"+j,item);
                this.node.getComponent("PengHu_Card").createCard(temp[j],1,false,card);
            }
        }
        for(let i=list.length;i<this._chiItemsList.length;++i){
            this._chiItemsList[i].active = false;
            this._chiItemsList[i].data = null;
        }
        bg.width = width+80;
        let closeBtn = cc.find("img_bg/btn_close",this._selectChiNode);
        closeBtn.getComponent(cc.Widget).updateAlignment();
    },

    onCloseSelectChi(){
        if(this._selectChiNode) this._selectChiNode.active = false;
        if(this._operateNode) this._operateNode.active = false;
        if(this._selectLuoNode) this._selectLuoNode.active = false;
    },

    onSelectChi(event){
        let list = event.target.data;
        if(list){
            if(list.luoData.length == list.luoCount){
                cc.vv.gameData.chi(list);
                event.target.data = null;
                this.onCloseSelectChi();
            }
            else{
                if(this._selectChiNode) this._selectChiNode.active = false;
                if(this._chi.chiData ===null){
                    this._chi.chiData = list.chiData;
                }
                this._chi.luoCount = list.luoCount;
                this.initLuoData(list.luoData);
            }
        }

    },


    onHu(){

    },
    // 过
    onGuo(event){
        cc.vv.gameData.pass();
        this.closeOperate();
    },


    closeOperate(){
        this._operateNode.active = false;
    },

    // 吃
    onChi(event){
        let data = event.target.data;

        if(data){
            if(data.length === 1)   {
                cc.vv.gameData.chi(data[0]);
                event.target.data = null
            }
            else {
                this._chi = {
                    chiData:null,
                    luoData:[],
                    luoCount:data.luoCount
                };
                this.showSelectChi(data);
            }
        }
        this.closeOperate();
    },

    // 碰
    onPeng(event){
        cc.vv.gameData.peng();
        this.closeOperate();
    },

    disenableBtn(){
        this._btnChi.getComponent(cc.Button).interactable = false;
        this._btnPeng.getComponent(cc.Button).interactable = false;
        this._btnGuo.getComponent(cc.Button).interactable = false;
        this._btnHu.getComponent(cc.Button).interactable = false;
    },

    enableBtn(btn,data=null){
        btn.getComponent(cc.Button).interactable = true;
        btn.stopAllActions();
        btn.data = data;
    },

    recvActionNotify(data){
        data = data.detail;
        if(data.actionInfo.waitList.length>0){
            this.showOperate(data);
        }
        else{
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
                    if(data.actionInfo.waitList[i].type === cc.vv.gameData.OPERATETYPE.CHI) {
                        this.enableBtn(this._btnChi,data.actionInfo.waitList[i].data);
                    }
                    else if(data.actionInfo.waitList[i].type === cc.vv.gameData.OPERATETYPE.GU0) this.enableBtn(this._btnGuo);
                    else if(data.actionInfo.waitList[i].type === cc.vv.gameData.OPERATETYPE.PENG) this.enableBtn(this._btnPeng);

                }
            }
        }
    },

    registerMsg () {
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.OUTCARD_NOTIFY,this.recvActionNotify,this);
        Global.registerEvent(EventId.CHI_NOTIFY,this.onCloseSelectChi,this);
        Global.registerEvent(EventId.PENG_NOTIFY,this.onCloseSelectChi,this);
        Global.registerEvent(EventId.PAO_NOTIFY,this.onCloseSelectChi,this);
        Global.registerEvent(EventId.KAN_NOTIFY,this.onCloseSelectChi,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
    },

    recvDeskInfoMsg(){
        let deskInfo = cc.vv.gameData.getDeskInfo();
        if(deskInfo.isReconnect){
            if(deskInfo.actionInfo.iswait){
                this.showOperate(deskInfo);
            }
        }
    },

    onDestroy(){
        if(this._selectChiNode){
            cc.loader.releaseRes("common/prefab/chi", cc.Prefab);
        }
    },
    // update (dt) {},
});
