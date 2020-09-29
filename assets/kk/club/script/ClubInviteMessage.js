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
        inviteList:[],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var req = { 'c': MsgId.CLUB_INVITE_NOTIFY};
        cc.vv.NetManager.send(req);

        this.registerMsg();
    },

    registerMsg(){
        cc.vv.NetManager.registerMsg(MsgId.CLUB_INVITE_NOTIFY, this.onRcvClubInviteNotify, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_INVITE_AGREE, this.onRcvAgreeResult, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_INVITE_REFUSE, this.onRcvRejectResult, this);
        cc.vv.NetManager.registerMsg(MsgId.CLUB_INVITE_All_AGREE, this.onRcvAllAgreeResult, this);
    },

    unregisterMsg(){
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_INVITE_NOTIFY, this.onRcvClubInviteNotify,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_INVITE_AGREE, this.onRcvAgreeResult, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_INVITE_REFUSE, this.onRcvRejectResult, this);
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_INVITE_All_AGREE, this.onRcvAllAgreeResult, this);
    },

    onRcvAllAgreeResult(msg){
        if(msg.code === 200){
            cc.vv.FloatTip.show("您已经全部同意亲友圈邀请");
            this.initMsg([]);
            cc.vv.UserManager.clubs =msg.response.clubList;
            Global.dispatchEvent(EventId.UPDATE_CLUBS);
        }
    },

    // 拒绝
    onRcvRejectResult(msg){
        if(msg.code === 200){
            cc.vv.FloatTip.show("您已经拒绝亲友圈邀请");
            this.initMsg(msg.response.inviteList);
        }
    },

    // 同意结果
    onRcvAgreeResult(msg){
        if(msg.code === 200){
           cc.vv.FloatTip.show("您已经同意亲友圈邀请");
            this.initMsg(msg.response.inviteList);
            cc.vv.UserManager.clubs =msg.response.clubList;
            Global.dispatchEvent(EventId.UPDATE_CLUBS);
        }
    },

    onRcvClubInviteNotify(msg){
        if(msg.code === 200){
            this.inviteList = msg.response.inviteList;
            if(msg.response.inviteList.length>0){
                if(this._messageNode === null){
                    cc.loader.loadRes("common/prefab/club_message",cc.Prefab,(error,prefab)=>{
                        if(error === null){
                            this._messageNode = cc.instantiate(prefab);
                            this._messageNode.active = true;
                            this._messageNode.parent = this.node;
                            this._messageNode.x = this.node.width;

                            let btn_all_agree = cc.find("bg/btn_all_agree",this._messageNode);
                            Global.btnClickEvent(btn_all_agree,this.onAllAgree,this);

                            let closeBtn = cc.find("bg/btn_close",this._messageNode);
                            Global.btnClickEvent(closeBtn,this.onClose,this);

                            this.initMsg(msg.response.inviteList);
                        }
                    })
                }
                else{
                    this._messageNode.active = true;
                    this.initMsg(msg.response.inviteList);
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
            if(i<content.childrenCount) {
                item = content.children[i];
            } else {
                item = cc.instantiate(content.children[0]);
                item.parent = content;
            }
            item.y = content.children[0].y - i*(item.height+20);
            height += (item.width+20);
            item.active = true;

            let name = item.getChildByName("name");
            name.getComponent(cc.Label).string = list[i].clubname;

            let id = item.getChildByName("id");
            id.getComponent(cc.Label).string = list[i].clubid;

            let time = item.getChildByName("time");
            time.getComponent(cc.Label).string = list[i].invitetime;

            let btn_agree = item.getChildByName("btn_agree");
            let btn_reject = item.getChildByName("btn_reject");

            btn_agree.clubid = list[i].clubid;
            btn_agree.inviteuid = list[i].inviteuid;
            btn_reject.clubid = list[i].clubid;

            Global.btnClickEvent(btn_agree,this.onAgree,this);
            Global.btnClickEvent(btn_reject,this.onReject,this);

        }
        content.height = height;

        for(let i=list.length;i<content.childrenCount;++i){
            content.children[i].active = false;
        }
    },

    onAllAgree(){
        var req = { 'c': MsgId.CLUB_INVITE_All_AGREE};
        req.inviteList = [];
        for(let i=0;i<this.inviteList.length;++i){
            req.inviteList.push({clubid:this.inviteList[i].clubid, inviteuid:this.inviteList[i].inviteuid});
        }
        cc.vv.NetManager.send(req);
    },

    onAgree(event){
        var req = { 'c': MsgId.CLUB_INVITE_AGREE};
        req.clubid = event.target.clubid;
        req.inviteuid = event.target.inviteuid;
        cc.vv.NetManager.send(req);
    },

    onReject(event){
        var req = { 'c': MsgId.CLUB_INVITE_REFUSE};
        req.clubid = event.target.clubid;
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
