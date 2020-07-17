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
        _layer:null,
        _applyList:[],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.vv.NetManager.registerMsg(MsgId.CLUB_EXIT_APPLY_LIST, this.onRcvClubExitApplyList, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_REFUSE_EXIT, this.onRcvClubRefuseExit, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_ALL_AGREE_EXIT, this.onRcvClubAllAgreeExit, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_AGREE_EXIT, this.onRcvClubAgreeExit, this);
    },

    showLayer(){
        if(this._layer === null){
            cc.loader.loadRes("common/prefab/club_message",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._layer = cc.instantiate(prefab);
                    // this._layer.scaleX = this.node.width / this._layer.width;
                    // this._layer.scaleY = this.node.height / this._layer.height;
                    this._layer.parent = this.node;
                    this._layer.zIndex = 1;
                    this._layer.x = this.node.width/2 - this.node.x;
                    this._layer.y = this.node.height/2 - this.node.y;

                    this.initUI();
                    this.initShow();
                }
            })
        }
        else{
            this._layer.active = true;
            this.initShow();
        }
    },

    initUI(){
        let closeBtn = cc.find("bg/btn_close",this._layer);
        Global.btnClickEvent(closeBtn,this.onClose,this);

        let btn_all_agree = cc.find("bg/btn_all_agree",this._layer);
        Global.btnClickEvent(btn_all_agree,this.onAllAgree,this);
    },

    initShow(){
        this.content = cc.find("bg/list/view/content",this._layer);
        for(let i = 0; i < this.content.childrenCount; ++i){
            this.content.children[i].active = false;
        }

        var req = { 'c': MsgId.CLUB_EXIT_APPLY_LIST};
        req.clubid = cc.vv.UserManager.currClubId;
        cc.vv.NetManager.send(req);
    },

    onClose(){
        this._layer.active = false;
    },

    onAllAgree(){
        if (0 < this._applyList.length) {
            var req = { 'c': MsgId.CLUB_ALL_AGREE_EXIT};
            req.clubid = cc.vv.UserManager.currClubId;
            req.applyList = [];
            for(let i = 0; i < this._applyList.length; ++i){
                req.applyList.push(this._applyList[i].uid);
            }
            cc.vv.NetManager.send(req);
        }
    },

    onRcvClubExitApplyList(msg){
        this._applyList = msg.response.exitList;
        Global.dispatchEvent(EventId.CLUB_EXIT_APPLY_NOTIFY, {clubid:cc.vv.UserManager.currClubId, isShow:0 < this._applyList.length});
        if (0 == this._applyList.length) {
            cc.vv.UserManager.setClubExitApplyState(cc.vv.UserManager.currClubId, 0);
        }

        let height = 0;
        for(let i = 0; i < this._applyList.length; ++i){
            let item = null;
            if(i < this.content.childrenCount) {
                item = this.content.children[i];
            } else {
                item = cc.instantiate(this.content.children[0]);
                item.parent = this.content;
            }
            item.y = this.content.children[0].y - i * (item.height + 10);
            height += (item.height + 10);
            item.active = true;

            item.getChildByName("name").getComponent(cc.Label).string = this._applyList[i].playername;
            item.getChildByName("id").getComponent(cc.Label).string = this._applyList[i].uid;
            item.getChildByName("time").getComponent(cc.Label).string = this._applyList[i].applytime;

            let btn_agree = item.getChildByName("btn_agree");
            btn_agree._btnID = this._applyList[i].uid;
            Global.btnClickEvent(btn_agree,this.onAgree,this);

            let btn_reject = item.getChildByName("btn_reject");
            btn_reject._btnID = this._applyList[i].uid;
            Global.btnClickEvent(btn_reject,this.onReject,this);
        }
        this.content.height = height;

        for(let i = this._applyList.length; i < this.content.childrenCount; ++i){
            this.content.children[i].active = false;
        }
    },

    onReject(event){
        var req = { 'c': MsgId.CLUB_REFUSE_EXIT};
        req.clubid = cc.vv.UserManager.currClubId;
        req.applyUid = event.target._btnID;
        cc.vv.NetManager.send(req);
    },

    onAgree(event){
        var req = { 'c': MsgId.CLUB_AGREE_EXIT};
        req.clubid = cc.vv.UserManager.currClubId;
        req.applyUid = event.target._btnID;
        cc.vv.NetManager.send(req);
    },

    onRcvClubRefuseExit(msg){
        if(msg.code === 200){
            cc.vv.FloatTip.show("您已经拒绝退出亲友圈申请");
            this.onRcvClubExitApplyList(msg);
        }
    },

    onRcvClubAgreeExit(msg){
        if(msg.code === 200){
            cc.vv.FloatTip.show("您已经同意退出亲友圈申请");
            this.onRcvClubExitApplyList(msg);
        }
    },

    onRcvClubAllAgreeExit(msg){
        if(msg.code === 200){
            cc.vv.FloatTip.show("您已经全部同意退出亲友圈申请");
            this.onRcvClubExitApplyList({response:{exitList:[]}});
        }
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_EXIT_APPLY_LIST, this.onRcvClubExitApplyList,this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_REFUSE_EXIT, this.onRcvClubRefuseExit, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_ALL_AGREE_EXIT, this.onRcvClubAllAgreeExit, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_AGREE_EXIT, this.onRcvClubAgreeExit, this);
        if(this._layer){
            cc.loader.releaseRes("common/prefab/club_message",cc.Prefab);
        }
    },
    // update (dt) {},
});
