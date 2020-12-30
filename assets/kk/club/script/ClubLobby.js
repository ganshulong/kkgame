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
        _createClubNode:null,
        _joinClubNode:null,
        _numList:[],
        _inputIndex:0,
        numAtlas:cc.SpriteAtlas,
        _roomManagerNode:null,
        _content:null,
        itemBgs:{
            default:[],
            type:cc.SpriteFrame,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        Global.autoAdaptDevices(false);
        this.registerMsg();
        this.node.getChildByName("girl").active = cc.vv.UserManager.clubs.length==0;

        let creatClub = this.node.getChildByName("btn_create");
        Global.btnClickEvent(creatClub,this.onCreatClub,this);

        let joinClub = this.node.getChildByName("btn_join");
        Global.btnClickEvent(joinClub,this.onJoinClub,this);

        let btn_back = this.node.getChildByName("btn_back");
        Global.btnClickEvent(btn_back,this.onBack,this);
        // this._roomManagerNode = this.node.getChildByName("room_manager");
        // this._roomManagerNode.active = false;

        this.node.addComponent("ClubInviteMessage");

        this._content = cc.find("club_list/view/content",this.node);
        this._content.active = cc.vv.UserManager.clubs.length>0;
        if(cc.vv.UserManager.clubs.length>0){
            this.initClubList(cc.vv.UserManager.clubs);
        }
    },

    registerMsg(){
        Global.registerEvent(EventId.UPDATE_CLUBS,this.updateClubList,this);
        Global.registerEvent(EventId.DISMISS_CLUB_NOTIFY, this.onRcvDismissClubNotify,this);
        
        cc.vv.NetManager.registerMsg(MsgId.CREATECULB, this.onRcvCreatClubResult, this);
        cc.vv.NetManager.registerMsg(MsgId.JOINCULB, this.onRcvJoinClubResult, this);
    },

    unregisterMsg(){
        cc.vv.NetManager.unregisterMsg(MsgId.CREATECULB, this.onRcvCreatClubResult, false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.JOINCULB, this.onRcvJoinClubResult, false,this);
    },

    initClubList(list){
        this.node.getChildByName("girl").active = (0 == list.length);
        let width = 0;
        for(let i=0;i<list.length;++i){
            let item = null;
            if(i<this._content.childrenCount) item = this._content.children[i];
            else{
                item = cc.instantiate(this._content.children[0]);
                item.parent = this._content;
            }
            item.x = this._content.children[0].x + i*(item.width+20);
            width += (item.width+20);
            item.active = true;

            let bg = item.getChildByName("bg");

            // 俱乐部名字
            let clubName = bg.getChildByName("clubName");
            clubName.getComponent(cc.Label).string = list[i].name;
            clubName.color = cc.vv.UserManager.uid !== list[i].createUid?(new cc.Color(75,63,135)):(new cc.Color(37,73,121));

            // 俱乐部ID
            let clubId = bg.getChildByName("clubId");
            clubId.getComponent(cc.Label).string = "(亲友圈ID:"+list[i].clubid+")";
            clubId.color = cc.vv.UserManager.uid !== list[i].createUid?(new cc.Color(75,63,135)):(new cc.Color(37,73,121));

            // 创建者名字
            let createrName = cc.find("bg/img_creater/text_createrName",item);
            createrName.getComponent(cc.Label).string = list[i].createPlayername;

            // 创建者UId
            let createrUId = cc.find("bg/img_id/text_id",item);
            createrUId.getComponent(cc.Label).string = list[i].createUid;

            // 联盟人数
            let memberNum = cc.find("bg/img_member/text_member",item);
            memberNum.getComponent(cc.Label).string = list[i].count;

            // 在玩桌子数
            let gamedeskNum = cc.find("bg/img_online/text_online",item);
            gamedeskNum.getComponent(cc.Label).string = list[i].gamedeskNum;

            let bOpenGameList = [];
            let gameList = list[i].clubGameList;
            let str = "";
            for(let i=0;i<gameList.length;++i){
                if(gameList[i].gameid === 1 && -1 === str.indexOf("碰胡")) {
                    str += "碰胡 ";
                } else if(gameList[i].gameid === 2 && -1 === str.indexOf("跑胡子")) {
                    str += "跑胡子 ";
                } else if(gameList[i].gameid === 5 && -1 ===  str.indexOf("红黑胡")) {
                    str += "红黑胡 ";
                } else if(gameList[i].gameid === 7 && -1 === str.indexOf("六胡抢")) {
                    str += "六胡抢 ";
                } else if(gameList[i].gameid === 9 && -1 === str.indexOf("跑得快")) {
                    str += "跑得快 ";
                } else if(gameList[i].gameid === 11 && -1 === str.indexOf("红中")) {
                    str += "红中 ";
                } else if(gameList[i].gameid === 13 && -1 === str.indexOf("十胡卡")) {
                    str += "十胡卡 ";
                } else if(gameList[i].gameid === 15 && -1 === str.indexOf("同花")) {
                    str += "同花 ";
                } else if(gameList[i].gameid === 17 && -1 === str.indexOf("二七鬼")) {
                    str += "二七鬼 ";
                }
            }
            // 游戏列表
            let gameListNode = cc.find("bg/img_game/text_game",item);
            gameListNode.getComponent(cc.Label).string = str;

            let spr_head = cc.find("bg/UserHead/radio_mask/spr_head",item);
            Global.setHead(spr_head,list[i].createIcon);

            let createrIcon = cc.find("bg/node_user/img_createrIcon",item);
            createrIcon.active = cc.vv.UserManager.uid === list[i].createUid;

            bg._id = list[i].clubid;
            bg.getComponent(cc.Sprite).spriteFrame = cc.vv.UserManager.uid !== list[i].createUid? this.itemBgs[0]:this.itemBgs[1];

            Global.btnClickEvent(bg,this.onEnterClub,this);



        }
        for(let i = list.length;i<this._content.childrenCount;++i){
            this._content.children[i].active = false;
        }
        this._content.width = width + 20;
        this._content.active = cc.vv.UserManager.clubs.length>0;
    },

    onEnterClub(event){
        let id = event.target._id;
        cc.vv.UserManager.currClubId = id;

        Global.curRoomID = "";
        cc.vv.SceneMgr.enterScene("club");
    },

    onBack(){
        cc.vv.SceneMgr.enterScene("lobby");
    },

    onCreatClub(){
        if(this._createClubNode === null){
            cc.loader.loadRes("common/prefab/create_club",cc.Prefab,(error,prefab)=>{
                if(error === null){
                    this._createClubNode = cc.instantiate(prefab);
                    this._createClubNode.parent = this.node;
                    this._createClubNode.zIndex = 1;
                    this._createClubNode.active = true;
                    this.initCreatClub();
                }
            })
        }
        else {
            let name = cc.find("bg/name",this._createClubNode);
            name.getComponent(cc.EditBox).string = "";
            this._createClubNode.active = true;
        }
    },

    // 更新俱乐部列表
    updateClubList(){
        this.initClubList(cc.vv.UserManager.clubs);
    },

    initCreatClub(){
        let closeBtn = cc.find("bg/btn_close",this._createClubNode);
        Global.btnClickEvent(closeBtn,this.onCloseCreateClub,this);
        let comfirmBtn = cc.find("bg/btn_confirm_create",this._createClubNode);
        Global.btnClickEvent(comfirmBtn,this.onCreateClub,this);
    },

    // 创建亲友圈
    onCreateClub(){
        let name = cc.find("bg/name",this._createClubNode);
        let str = name.getComponent(cc.EditBox).string;
        if(str.length === 0 ) cc.vv.FloatTip.show("请输入亲友圈名字");
        else{
            var req = { 'c': MsgId.CREATECULB};
            req.name = str;
            cc.vv.NetManager.send(req);
        }

    },

    onJoinClub(){
        if(this._joinClubNode === null){
            cc.loader.loadRes("common/prefab/join_club",cc.Prefab,(error,prefab)=>{
                if(error === null){
                    this._joinClubNode = cc.instantiate(prefab);
                    this._joinClubNode.parent = this.node;
                    this._joinClubNode.zIndex = 1;
                    this._joinClubNode.x = this.node.width/2 - this.node.x;
                    this._joinClubNode.y = this.node.height/2 - this.node.y;
                    this._joinClubNode.active = true;
                    this.initJoinClub();
                }
            })
        }
        else {
            this.onReset();
            this._joinClubNode.active = true;
        }
    },


    initJoinClub(){
        let closeBtn = cc.find("bg/btn_close",this._joinClubNode);
        Global.btnClickEvent(closeBtn,this.onCloseJoinClub,this);

        for(let i=0;i<10;++i){
            let btn = cc.find("bg/btn_number"+i,this._joinClubNode);
            btn._index = i;
            Global.btnClickEvent(btn,this.inputNum,this);
        }

        let delBtn = cc.find("bg/btn_delete",this._joinClubNode);
        Global.btnClickEvent(delBtn,this.onDelete,this);

        let resetBtn = cc.find("bg/btn_reset",this._joinClubNode);
        Global.btnClickEvent(resetBtn,this.onReset,this);

        for(let i=0;i<7;++i){
            let numLabel = cc.find("bg/num"+i,this._joinClubNode).getChildByName("num");
            numLabel.active = false;
            this._numList.push(numLabel);
        }
    },

    onReset(){
        this._inputIndex = 0;
        for(let i=0;i<this._numList.length;++i){
            this._numList[i].active = false;
            this._numList[i]._index = -1;
        }
    },

    onDelete(){
        --this._inputIndex;
        if(this._inputIndex<0) this._inputIndex = 0;
        if(this._inputIndex>=0){
            this._numList[this._inputIndex].active = false;
            this._numList[this._inputIndex]._index = -1;
        }
    },

    inputNum(event){
        if(this._inputIndex<7){
            let index = event.target._index;
            this._numList[this._inputIndex].active = true;
            this._numList[this._inputIndex].getComponent(cc.Sprite).spriteFrame = this.numAtlas.getSpriteFrame("hallClub-img-member-img-img_"+index);
            this._numList[this._inputIndex]._index = index;
            ++this._inputIndex;
            if(this._inputIndex>=7){
                let str = "";
                for(let i=0;i<7;++i){
                    str += this._numList[i]._index;
                }
                var req = { 'c': MsgId.JOINCULB};
                req.clubid = str;
                cc.vv.NetManager.send(req);
            }
        }

    },

    onCloseJoinClub(){
       if(this._joinClubNode) this._joinClubNode.active = false;
    },

    // 关闭亲友圈
    onCloseCreateClub(){
        this._createClubNode.active = false;
    },

    onRcvCreatClubResult(msg){
        if(msg.code === 200){
            cc.vv.AlertView.show("创建亲友圈成功",()=>{});
            cc.vv.UserManager.clubs = msg.response.clubList;
            this.initClubList(cc.vv.UserManager.clubs);
            this.onCloseCreateClub();
        }
    },

    onRcvJoinClubResult(msg){
        if(msg.code === 200){
            cc.vv.AlertView.show("申请成功，等待管理员审核！",()=>{});
            this.onCloseJoinClub();
        }
    },

    onRcvDismissClubNotify(data){
        this.updateClubList();
    },

    onDestroy(){
        this.unregisterMsg();
        if(this._joinClubNode){
            cc.loader.releaseRes("common/prefab/join_club",cc.Prefab);
        }
        if(this._createClubNode){
            cc.loader.releaseRes("common/prefab/create_club",cc.Prefab);
        }
    },

    // update (dt) {},
});
