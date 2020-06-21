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
        _messageNode:null,
        _applyList:[],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        this.registerMsg();
        var req = { 'c': MsgId.CLUBNOTICE};
        req.clubid = cc.vv.UserManager.currClubId;
        cc.vv.NetManager.send(req);

    },

    registerMsg(){
        cc.vv.NetManager.registerMsg(MsgId.CLUBNOTICE, this.onRcvClubMessage, this);
        cc.vv.NetManager.registerMsg(MsgId.AGREECULB, this.onRcvAgreeResult, this);
        cc.vv.NetManager.registerMsg(MsgId.REJECTJOINCLUB, this.onRcvRejectResult, this);
        cc.vv.NetManager.registerMsg(MsgId.ALLAGREE, this.onRcvAllAgreeResult, this);
    },

    unregisterMsg(){
        cc.vv.NetManager.unregisterMsg(MsgId.CLUBNOTICE, this.onRcvClubMessage,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.AGREECULB, this.onRcvAgreeResult, this);
        cc.vv.NetManager.unregisterMsg(MsgId.REJECTJOINCLUB, this.onRcvRejectResult, this);
        cc.vv.NetManager.unregisterMsg(MsgId.ALLAGREE, this.onRcvAllAgreeResult, this);
    },

    onRcvAllAgreeResult(msg){
        if(msg.code === 200){
            cc.vv.FloatTip.show("您已经全部同意加入亲友圈");
            this.initMsg([]);
            this.onc
        }
    },

    // 拒绝
    onRcvRejectResult(msg){
        if(msg.code === 200){
            cc.vv.FloatTip.show("您已经拒绝加入亲友圈");
            this.initMsg(msg.response.applyList);
        }
    },

    // 同意结果
    onRcvAgreeResult(msg){
        if(msg.code === 200){
           cc.vv.FloatTip.show("您已经同意了加入亲友圈");
            this.initMsg(msg.response.applyList);
        }
    },

    onRcvClubMessage(msg){
        if(msg.code === 200){
            this._applyList = msg.response.applyList;
            if(msg.response.applyList.length>0){
                if(this._messageNode === null){
                    cc.loader.loadRes("common/prefab/club_message",cc.Prefab,(error,prefab)=>{
                        if(error === null){
                            this._messageNode = cc.instantiate(prefab);
                            this._messageNode.active = true;
                            this.initMsg(msg.response.applyList);
                            this._messageNode.parent = this.node;

                            this._messageNode.x = this.node.width
                            let btn_all_agree = cc.find("bg/btn_all_agree",this._messageNode);

                            let closeBtn = cc.find("bg/btn_close",this._messageNode);
                            Global.btnClickEvent(btn_all_agree,this.onAllAgree,this);

                            Global.btnClickEvent(closeBtn,this.onClose,this);
                        }
                    })
                }
                else{
                    this._messageNode.active = true;
                    this.initMsg(msg.response.applyList);
                }
            }
        }
    },

    onClose(){
        this._messageNode.active = false;
    },

    initMsg(list){
        let content = cc.find("bg/list/view/content",this._messageNode);
        let height = 0;
        for(let i=0;i<list.length;++i){
            let item = null;
            if(i<content.childrenCount) item = content.children[i];
            else {
                item = cc.instantiate(content.children[0]);
                item.parent = content;
            }
            item.y = content.children[0].y - i*(item.height+20);
            height += (item.width+20);
            item.active = true;

            let name = item.getChildByName("name");
            name.getComponent(cc.Label).string = list[i].playername;

            let id = item.getChildByName("id");
            id.getComponent(cc.Label).string = list[i].uid;

            let time = item.getChildByName("time");
            time.getComponent(cc.Label).string = list[i].applytime;

            let btn_agree = item.getChildByName("btn_agree");
            let btn_reject = item.getChildByName("btn_reject");

            btn_agree._id = list[i].uid;
            btn_reject._id = list[i].uid;

            Global.btnClickEvent(btn_agree,this.onAgree,this);
            Global.btnClickEvent(btn_reject,this.onReject,this);

        }
        content.height = height;

        for(let i=list.length;i<content.childrenCount;++i){
            content.children[i].active = false;
        }
    },

    onAllAgree(){
        let list = [];
        for(let i=0;i<this._applyList.length;++i){
            list.push(this._applyList[i].uid);
        }
        var req = { 'c': MsgId.ALLAGREE};
        req.clubid = cc.vv.UserManager.currClubId;
        req.applyList = list;
        cc.vv.NetManager.send(req);
    },

    onAgree(event){
        var req = { 'c': MsgId.AGREECULB};
        req.clubid = cc.vv.UserManager.currClubId;
        req.applyUid = event.target._id;
        cc.vv.NetManager.send(req);
    },

    onReject(event){
        var req = { 'c': MsgId.REJECTJOINCLUB};
        req.clubid = cc.vv.UserManager.currClubId;
        req.applyUid = event.target._id;
        cc.vv.NetManager.send(req);
    },

    onDestroy(){
        this.unregisterMsg();
        if(this._messageNode){
            cc.loader.releaseRes("common/prefab/club_message",cc.Prefab);
        }
    },
    // update (dt) {},
});
