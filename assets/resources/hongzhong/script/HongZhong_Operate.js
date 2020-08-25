
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

    // 吃
    onChi(event){
        let data = event.target.data;
        if(data){
            if(0 < data.length)   {
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

    showSelectChi(list){
        if(this._selectChiNode === null){
            cc.loader.loadRes("common/prefab/chi", cc.Prefab, (error, prefab)=>{
                if(error === null){
                    this._selectChiNode = cc.instantiate(prefab);
                    this._selectChiNode.parent = this.node;
                    this._selectChiNode.zIndex = 1;
                    let item = cc.find("img_bg/item",this._selectChiNode);
                    Global.btnClickEvent(item,this.onSelectChi,this);
                    this._chiItemsList.push(item);
                    let closeBtn = cc.find("img_bg/btn_close",this._selectChiNode);
                    this._selectChiNode.active = true;
                    Global.btnClickEvent(closeBtn,()=>{
                        this.onCloseSelectChi();
                        this._operateNode.active = true;
                    });
                    this._selectChiNode.getChildByName("selectedChi_bg").active = false;

                    this._selectLuoNode = cc.instantiate(prefab);
                    this._selectLuoNode.parent = this.node;
                    this._selectLuoNode.zIndex = 2;

                    item = cc.find("img_bg/item",this._selectLuoNode);
                    Global.btnClickEvent(item,this.onSelectLuo,this);
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
                Global.btnClickEvent(item,this.onSelectChi,this);
                item.parent = this._chiItemsList[0].parent;
                this._chiItemsList.push(item);
            }
            item.x = -list.length*0.5*item.width+item.width*i;
            item.data = list[i];
            width += item.width;

            let temp = list[i].chiData.slice(0);
            temp.unshift(this._currActionCard);

            for(let j=0;j<3;++j){
                let card = cc.find("img_bg/card"+j,item);
                this.node.getComponent("HongZhong_Card").createCard(temp[j],1,false,card);
            }
        }
        for(let i=0;i<list.length;++i){
            this._chiItemsList[i].active = true;
            this._chiItemsList[i].getComponent(cc.Button).interactable = true;
        }
        for(let i=list.length;i<this._chiItemsList.length;++i){
            this._chiItemsList[i].active = false;
            this._chiItemsList[i].getComponent(cc.Button).interactable = false;
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
            if(0 < list.luoData.length){
                if(this._selectChiNode) this._selectChiNode.active = false;
                if(this._chi.chiData ===null){
                    this._chi.chiData = list.chiData;
                }
                this._chi.luoCount = list.luoCount;
                this._chi.isChoose = list.isChoose;
                this._chi.handInCards = list.handInCards;
                this.initLuoData(list.luoData);
            } else {
                cc.vv.gameData.chi(list);
                event.target.data = null;
                this.onCloseSelectChi();
            }
        }
    },

    getIsAutoAllLuo(luoData,luoCount){
        let luoCardCount = 0;
        for (let i = 0; i < luoData.length; i++) {
            for (var j = 0; j < luoData[i].length; j++) {
                if (this._currActionCard == luoData[i][j]) {
                    ++luoCardCount;
                }
            }
        }
        return (luoCount == luoCardCount);
    },

    initLuoData(list){
        let selectedChiItem_bg = cc.find("selectedChi_bg/item/selectedChiItem_bg",this._selectLuoNode);
        this.node.getComponent("HongZhong_Card").createCard(this._currActionCard,1,false,selectedChiItem_bg.getChildByName("card"+0));
        this.node.getComponent("HongZhong_Card").createCard(this._chi.chiData[0],1,false,selectedChiItem_bg.getChildByName("card"+1));
        this.node.getComponent("HongZhong_Card").createCard(this._chi.chiData[1],1,false,selectedChiItem_bg.getChildByName("card"+2));

        this.handCard = JSON.parse(JSON.stringify(this._chi.handInCards));
        this.selectedItemCount = 0;
        this.chedCardCount = 0;
        this.luoDataList = list;        //落牌数组数据
        this.luoItemIsSelected = [];    //落牌项是否已选
        this.luoItemIsLackCard = [];    //落牌项是否缺牌
        for (let i = 0; i < this.luoDataList.length; i++) {
            this.luoItemIsSelected.push(false);
            this.luoItemIsLackCard.push(false);
        }
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
                Global.btnClickEvent(item,this.onSelectLuo,this);
                item.parent = this._luoItemsList[0].parent;
                this._luoItemsList.push(item);
            }
            item.x = -list.length*0.5*item.width+item.width*i;
            item.index = i;
            // Global.btnClickEvent(item,this.onSelectLuo,this);
            width += item.width;

            let temp = list[i].slice(0);
            // temp.unshift(this._currActionCard);

            for(let j=0;j<3;++j){
                let card = cc.find("img_bg/card"+(2-j),item);
                this.node.getComponent("HongZhong_Card").createCard(temp[j],1,false,card);
            }
        }
        for(let i=0;i<list.length;++i){
            this._luoItemsList[i].active = true;
            this._luoItemsList[i].getComponent(cc.Button).interactable = true;
            this._luoItemsList[i].getChildByName("selectedLuo_mask").active = false;
            this._luoItemsList[i].getChildByName("img_bg").opacity = 255;
        }
        for(let i=list.length;i<this._luoItemsList.length;++i){
            this._luoItemsList[i].active = false;
            this._luoItemsList[i].getComponent(cc.Button).interactable = false;
            this._luoItemsList[i].data = null;
        }
        bg.width = width+80;
        let closeBtn = cc.find("img_bg/btn_close",this._selectLuoNode);
        closeBtn.getComponent(cc.Widget).updateAlignment();
    },

    // 选择落牌
    onSelectLuo(event){
        let index = event.target.index;
        if (this.luoItemIsLackCard[index]) {
            cc.vv.FloatTip.show("该组牌无法加入落牌");
            return;
        }
        if (this.luoItemIsSelected[index]) {        //已选项
            this.luoItemIsSelected[index] = false;
            --this.selectedItemCount;
            for (var i = 0; i < this.luoDataList[index].length; i++) {
                this.handCard.push(this.luoDataList[index][i]);
                if (this.luoDataList[index][i] == this._currActionCard) {
                    --this.chedCardCount;
                }
            }
        } else {        
            let susurplusHandCard = JSON.parse(JSON.stringify(this.handCard));                            
            for (let i = 0; i < this.luoDataList[index].length; i++) {
                for (let j = 0; j < susurplusHandCard.length; j++) {
                    if (this.luoDataList[index][i] == susurplusHandCard[j]) {
                        susurplusHandCard.splice(j,1);
                        break;
                    }
                }
            }
            if (this.handCard.length == susurplusHandCard.length + 3) {
                this.luoItemIsSelected[index] = true;
                ++this.selectedItemCount;
                for (let i = 0; i < this.luoDataList[index].length; i++) {
                    if (this.luoDataList[index][i] == this._currActionCard) {
                        ++this.chedCardCount;
                    }
                }
                this.handCard = susurplusHandCard;

                if (this.selectedItemCount == this._chi.luoCount || (this._chi.isChoose && this.chedCardCount == this._chi.luoCount)) {
                    this._chi.luoData = [];
                    for (let i = 0; i < this.luoItemIsSelected.length; i++) {
                        if (this.luoItemIsSelected[i]) {
                            this._chi.luoData.push(this.luoDataList[i]);
                        }
                    }
                    cc.vv.gameData.chi(this._chi);
                    this._selectLuoNode.active = false;
                    return;
                }
            }
        }

        this._luoItemsList[index].getChildByName("selectedLuo_mask").active = this.luoItemIsSelected[index];
        this._luoItemsList[index].getChildByName("img_bg").opacity = this.luoItemIsSelected[index] ? 150 : 255;

        //缺牌组置灰
        for (let i = 0; i < this.luoItemIsLackCard.length; i++) {
            this.luoItemIsLackCard[i] = false;
            if (!this.luoItemIsSelected[i]) {
                let susurplusHandCard = JSON.parse(JSON.stringify(this.handCard));  
                for (let j = 0; j < this.luoDataList[i].length; j++) {
                    let indexResult = susurplusHandCard.indexOf(this.luoDataList[i][j]);
                    if(-1 < indexResult){
                        susurplusHandCard.splice(indexResult,1);
                    } else {
                        this.luoItemIsLackCard[i] = true;
                        break;  
                    }
                }
                this._luoItemsList[i].getChildByName("img_bg").opacity = this.luoItemIsLackCard[i] ? 150 : 255;
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
