
cc.Class({
    extends: cc.Component,

    properties: {
        
        _handCardNodeList:[],
    },

    start () {
        for(let i = 1; i < cc.vv.gameData.RoomSeat; ++i){
            let node = cc.find("scene/playback_handle/player"+i,this.node);
            this._handCardNodeList.push(node);
        }
        this._handCardNodeList.push(cc.find("scene/playback_handle/public",this.node));
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);
    },

    recvRoundOver(data){
        data = data.detail;
        if (!cc.vv.gameData._isPlayBack) {
            let users = data.users;
            for(let i=0;i<users.length;++i){
                let chairId = cc.vv.gameData.getLocalChair(users[i].seat);
                let UISeat = cc.vv.gameData.getUISeatBylocalSeat(chairId);
                if(0 < UISeat){
                    let node = cc.find("scene/playback_handle/player"+UISeat,this.node);
                    this.showHandCard(users[i].handInCards, node, UISeat);
                }
            }
        }
    },

    showHandCard(list,parent,UISeat){
        let cardScale = 0.5;
        let cardWidth = cc.vv.gameData.CardWidth * cardScale;
        let startPosX = 0;
        if(UISeat === 1){  //右 右对齐
            startPosX = - cardWidth/2*(list.length-1);
            if (9 < list.length) {
                startPosX = - cardWidth/2*(9-1);
            }
        } else if(UISeat === 2){  //左 左对齐
            startPosX = 0;
        }
        for (let i = 0; i < list.length; i++) {
            let node = this.node.getComponent("PaoDeKuai_Card").createCard(list[i]);
            node.scale = cardScale;
            node.parent = parent;
            if (i < 9) {
                node.x = startPosX + cardWidth/2 * i;
            } else {
                node.x = startPosX + cardWidth/2 * (i - 9);
                node.y = -node.height * cardScale * 0.6;
            }
            
        }
    },


    clearDesk(){
        this._num = 0;
        for(let i=0;i<this._handCardNodeList.length;++i){
            this._handCardNodeList[i].removeAllChildren(true);
        }
    },

    // update (dt) {},
});
