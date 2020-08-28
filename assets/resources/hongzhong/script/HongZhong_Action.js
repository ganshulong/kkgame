
cc.Class({
    extends: cc.Component,

    properties: {
        _pengNode:null,
        _gangNode:null,
    },

    start () {
        this._pengNode = cc.find("scene/action/peng",this.node);
        this._gangNode = cc.find("scene/action/gang",this.node);

        this.clearDesk();
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.PENG_NOTIFY,this.recvPengNotify,this);
        Global.registerEvent(EventId.GANG_NOTIFY,this.recvGangNotify,this);
    },

    recvPengNotify(data){
        data = data.detail;
        this.showAction(data.actionInfo.curaction.seat, this._pengNode);
    },

    recvGangNotify(data){
        data = data.detail;
        this.showAction(data.actionInfo.curaction.seat, this._gangNode);
    },

    showAction(seat,actionNode){
        let chairId = cc.vv.gameData.getLocalChair(seat);
        let uiSeat = cc.vv.gameData.getUISeatBylocalSeat(chairId);
        let node = cc.find("scene/action/player"+uiSeat,this.node);

        actionNode.position = cc.v2(node.x,node.y);
        actionNode.active = true;
        actionNode.scale = 0;
        actionNode.runAction(
            cc.sequence(
                cc.scaleTo(0.5,1.2,1.2),
                cc.scaleTo(0.1,1,1),
                cc.delayTime(0.4),
                cc.callFunc(()=>{
                    actionNode.active = false;
                })
            )
        )
    },

    clearDesk(){
        this._pengNode.active = false;
        this._gangNode.active = false;
    },

    // update (dt) {},
});
