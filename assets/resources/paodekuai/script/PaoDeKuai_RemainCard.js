
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
        Global.registerEvent(EventId.HU_NOTIFY,this.recvGameOver,this);
    },

    recvGameOver(data){
        data = data.detail;
        let users = data.users;
        for(let i=0;i<users.length;++i){
            let chairId = cc.vv.gameData.getLocalChair(users[i].seat);
            let UISeat = cc.vv.gameData.getUISeatBylocalSeat(chairId);
            if(0 < UISeat){
                let node = cc.find("scene/playback_handle/player"+UISeat,this.node);
                this.showHandCard(users[i].handInCards, node, chairId);
            }
        }

        // 公牌
        let publicCard = cc.find("scene/playback_handle/public",this.node);
        for(let i=0;i<data.diPai.length;++i){
            let node = this.node.getComponent("PaoDeKuai_Card").createCard(data.diPai[i],2);

            node.y = -node.height*parseInt(i/6);
            node.x = node.width*parseInt(i%6);
            node.parent = publicCard;
        }
    },

    showHandCard(list,parent,chairId){
        let tempList = cc.vv.gameData.sortCard(list);
        for(let i=0;i<tempList.length;++i){
            for(let j=0;j<tempList[i].length;++j) {
                let node = this.node.getComponent("PaoDeKuai_Card").createCard(tempList[i][j],2);

                node.y = node.height*j;
                if (1 == chairId) {
                    node.x = -node.width*i;
                } else {
                    node.x = node.width*i;
                }
                node.parent = parent;
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
