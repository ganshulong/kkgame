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
        _paoNode:null,
        _tiNode:null,
        _chiNode:null,
        _pengNode:null,
        // _huNode:null,
        _weiNode:null,
        _shaoNode:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._paoNode = cc.find("scene/action/pao",this.node);
        this._tiNode = cc.find("scene/action/ti",this.node);
        this._chiNode = cc.find("scene/action/chi",this.node);
        this._pengNode = cc.find("scene/action/peng",this.node);
        // this._huNode = cc.find("scene/action/hu",this.node);
        this._weiNode = cc.find("scene/action/wei",this.node);
        this._shaoNode = cc.find("scene/action/shao",this.node);

        // this._huNode.getComponent(cc.Animation).on("finished",()=>{
        //     this._huNode.active = false;
        // });

        this.clearDesk();
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.CHI_NOTIFY,this.recvAction,this);
        Global.registerEvent(EventId.PENG_NOTIFY,this.recvAction,this);
        Global.registerEvent(EventId.PAO_NOTIFY,this.recvAction,this);
        Global.registerEvent(EventId.LONG_NOTIFY,this.recvAction,this);
        Global.registerEvent(EventId.KAN_NOTIFY,this.recvAction,this);
        // Global.registerEvent(EventId.HU_NOTIFY,this.recvHuAction,this);

    },

    recvHuAction(data){
        data = data.detail;
        if(data.hupaiType>-1){
            this.showAction(data.seat,cc.vv.gameData.OPERATETYPE.HU);
        }
    },

    recvAction(data){
        data = data.detail;
        this.showAction(data.actionInfo.curaction.seat,data.actionInfo.curaction.type);
    },

    showAction(seat,type){
        this._paoNode.active = type === cc.vv.gameData.OPERATETYPE.PAO;
        this._tiNode.active = type === cc.vv.gameData.OPERATETYPE.LONG;
        this._chiNode.active = type === cc.vv.gameData.OPERATETYPE.CHI;
        this._pengNode.active = type === cc.vv.gameData.OPERATETYPE.PENG;
        // this._huNode.active = type === cc.vv.gameData.OPERATETYPE.HU;
        this._weiNode.active = type === cc.vv.gameData.OPERATETYPE.WEI;
        this._shaoNode.active = type === cc.vv.gameData.OPERATETYPE.SHE;
        
        let chairId = cc.vv.gameData.getLocalChair(seat);
        let uiSeat = cc.vv.gameData.getUISeatBylocalSeat(chairId);
        let node = cc.find("scene/action/player"+uiSeat,this.node);
        let actionNode = null;
        if(type === cc.vv.gameData.OPERATETYPE.PAO) {
            actionNode = this._paoNode;
        }
        else if(type === cc.vv.gameData.OPERATETYPE.LONG) {
            actionNode = this._tiNode;
        }
        else if(type === cc.vv.gameData.OPERATETYPE.CHI) {
            actionNode = this._chiNode;
        }
        else if(type === cc.vv.gameData.OPERATETYPE.PENG) {
            actionNode = this._pengNode;
        }
        // else if(type === cc.vv.gameData.OPERATETYPE.HU) {
        //     actionNode = this._huNode;
        // }
        else if(type === cc.vv.gameData.OPERATETYPE.WEI) {
            actionNode = this._weiNode;
        }
        else if(type === cc.vv.gameData.OPERATETYPE.SHE) {
            actionNode = this._shaoNode;
        }
        if(actionNode){
            if(type !== cc.vv.gameData.OPERATETYPE.HU){
                actionNode.position = cc.v2(0,node.y);
            }
            else actionNode.position = cc.v2(node.x,node.y);
            actionNode.getComponent(cc.Animation).play("show");
        }

    },

    clearDesk(){
        this._paoNode.active = false;
        this._tiNode.active = false;
        this._chiNode.active = false;
        this._pengNode.active = false;
        // this._huNode.active = false;
        this._weiNode.active = false;
        this._shaoNode.active = false;
    },

    // update (dt) {},
});
