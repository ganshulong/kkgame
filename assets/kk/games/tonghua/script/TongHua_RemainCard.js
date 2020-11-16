
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

        this.TongHua_CardLogicJS = this.node.getComponent("TongHua_CardLogic");

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
        if (0 == list.length) {
            return;
        }
        let cardGroupsInfo = this.TongHua_CardLogicJS.GetCardGroupsInfo(list);
        let cardGroups = cardGroupsInfo.card2DListEx;
        let cardScale = 0.4;
        for (let i = 0; i < cardGroups.length; i++) {
            for (let j = 0; j < cardGroups[i].length; j++) {
                let node = this.node.getComponent("TongHua_Card").createCard(cardGroups[i][j]);
                node.scale = cardScale;
                node.parent = parent;
                node.x = node.width*cardScale/2 * i - (node.width*cardScale/2*(cardGroups.length-1))/2;
                node.y = node.height*cardScale/2 + node.height*cardScale/9* (cardGroups[i].length-1-j);
                node.isTongHua = (i < cardGroupsInfo.tongHuaNum);
                if (node.isTongHua) {
                    node.color = new cc.Color(255,220,220);
                }
                if ((4 <= cardGroups[i].length && j == (cardGroups[i].length-1))) {
                    node.getChildByName("cardNumText").getComponent(cc.Label).string = cardGroups[i].length;
                    node.getChildByName("cardTypeText").getComponent(cc.Label).string = node.isTongHua ? "同花" : "炸弹";
                    node.getChildByName("cardNumText").color = node.isTongHua ? (new cc.Color(255,0,0)) : (new cc.Color(0,0,255));
                    node.getChildByName("cardTypeText").color = node.isTongHua ? (new cc.Color(255,0,0)) : (new cc.Color(0,0,255));
                } else {
                    node.getChildByName("cardNumText").getComponent(cc.Label).string = "";
                    node.getChildByName("cardTypeText").getComponent(cc.Label).string = "";
                }
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
