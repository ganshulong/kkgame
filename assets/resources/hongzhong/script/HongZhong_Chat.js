
cc.Class({
    extends: cc.Component,

    properties: {
        _chatNode:null,
        _isLoad:false,
    },

    start () {

        Global.registerEvent(EventId.SHOW_CHAT,this.showChat,this);
    },


    showChat(){
        if(this._isLoad) return;
        if(this._chatNode === null){
            this._isLoad = true;
            cc.loader.loadRes("common/prefab/FaceChatLayer",cc.Prefab,(err,prefab)=>{
                if(err===null){
                    this._chatNode = cc.instantiate(prefab);
                    this._chatNode.parent = this.node;
                    this._chatNode.x = -this.node.width/2;
                    this._chatNode.y = -this.node.height/2;
                    this._chatNode.zIndex = 3;
                    for(let i=1;i<13;++i){
                        let emjo = cc.find("img_bg/img_bg_bq/btn_bq_"+i,this._chatNode);
                        emjo._index = i-1;
                        emjo.on(cc.Node.EventType.TOUCH_END,this.onSelectEmjo,this);
                    }

                    let content = cc.find("img_bg/img_bg_txt/scrollview/view/content",this._chatNode);
                    let ShortList = Global.getShortList();
                    let height = 0;
                    for(let i=0;i<ShortList.length;++i){
                        let item = null;
                        if(i<content.childrenCount) item = content.children[i];
                        else{
                            item = cc.instantiate(content.children[0]);
                            item.parent = content;
                        }
                        item._index = i;
                        item.y = content.children[0].y-item.height*i;
                        item.getComponent(cc.Label).string = ShortList[i];
                        item.on(cc.Node.EventType.TOUCH_END,this.onSelectShort,this);
                        height += item.height;
                    }
                    content.height = height;
                    let closeBtn = cc.find("img_bg/btn_close",this._chatNode);
                    Global.btnClickEvent(closeBtn,this.onClose,this);
                    this._isLoad = false;
                }
            });
        }
        else{
            this._chatNode.active = true;
        }
    },

    onClose(){
        this._chatNode.active = false;
    },

    // 选择短语
    onSelectShort(event){
        let index = event.target._index;
        this.sendMsg(2,index);
    },

    // 选择表情
    onSelectEmjo(event){
        let index = event.target._index;
        this.sendMsg(1,index);
    },

    sendMsg(type,index){
        let data = {
            type:type,
            index:index,
            seat:cc.vv.gameData.getMySeatIndex()
        };
        var req = { 'c': MsgId.CHAT};
        req.chatInfo = data;
        cc.vv.NetManager.send(req);
        this.onClose();
    },


    onDestroy(){
        if(this._chatNode){
            cc.loader.releaseRes("common/prefab/FaceChatLayer",cc.Prefab);
        }
    }

    // update (dt) {},
});
