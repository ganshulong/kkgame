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
        _handCardNodeList:[],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        for(let i=1;i<=2;++i){
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
            if(chairId!==0){
                let node = cc.find("scene/playback_handle/player"+chairId,this.node);
                this.showHandCard(users[i].handInCards, node, chairId);
            }
        }

        // 公牌
        let publicCard = cc.find("scene/playback_handle/public",this.node);
        for(let i=0;i<data.diPai.length;++i){
            let node = this.node.getComponent("PaoHuZi_Card").createCard(data.diPai[i],2);

            node.y = -(node.height+8)*parseInt(i/9);
            node.x = (node.width+8)*parseInt(i%9);
            node.parent = publicCard;
        }
    },

    showHandCard(list,parent,chairId){
        let tempList = cc.vv.gameData.sortCard(list);
        for(let i=0;i<tempList.length;++i){
            for(let j=0;j<tempList[i].length;++j) {
                let node = this.node.getComponent("PaoHuZi_Card").createCard(tempList[i][j],2);

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