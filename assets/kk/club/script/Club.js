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
        _content:null,
        _tableList:[],
        wanfaAtlas:cc.SpriteAtlas,
        tableBgs:{
            default:[],
            type:cc.SpriteFrame,
        },
        _startPos:null,
        _sendSit:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if(cc.vv.gameData){
            cc.vv.gameData.clear();
            cc.vv.gameData = null;
        }
        this.registerMsg();
        Global.autoAdaptDevices(false);
        let back = cc.find("Layer/bg/btn_back",this.node);
        Global.btnClickEvent(back,this.onBack,this);

        this.node.addComponent("ClubMessage");
        this.node.addComponent("CreateRoom");

        let info = null;
        for(let i=0;i<cc.vv.UserManager.clubs.length;++i){
            if(cc.vv.UserManager.currClubId === cc.vv.UserManager.clubs[i].clubid){
                info = cc.vv.UserManager.clubs[i];
            }
        }
        let clubId = cc.find("Layer/bg/img_club_name_bg/txt_clubId",this.node);
        clubId.getComponent(cc.Label).string = info?("ID:"+info.clubid):"";

        let clubName = cc.find("Layer/bg/img_club_name_bg/txt_clubName",this.node);
        clubName.getComponent(cc.Label).string = info?info.name:"";


        let createRoomBtn = cc.find("Layer/img_bottomBg/btn_switch",this.node);
        Global.btnClickEvent(createRoomBtn,this.onCreateRoom,this);

        this._content = cc.find("Layer/list/view/content",this.node);
        this._content.active = false;

        let tips = cc.find("Layer/bg_dialogue/mask/txt_dialogue",this.node);
        tips.x = 200;
        tips.runAction(cc.repeatForever(cc.sequence(cc.moveTo(10,cc.v2(-200,tips.y)),cc.callFunc(()=>{
            tips.x = 200;
        }))))

        this._startPos = cc.v2(this._content.children[0].x,this._content.children[0].y);
        // 请求俱乐部信息
        var req = { 'c': MsgId.ENTERCLUB};
        req.clubid = cc.vv.UserManager.currClubId;
        cc.vv.NetManager.send(req);
    },

    // 俱乐部信息
    onRcvClubInfo(msg){
        if(msg.code == 200){
            this._tableList = msg.response.deskList;
            this.initTables(this._tableList);
        }
    },

    registerMsg(){
        cc.vv.NetManager.registerMsg(MsgId.NOTICE_ADDNEWTABLE, this.onRcvAddTableMsg, this);
        cc.vv.NetManager.registerMsg(MsgId.ENTERCLUB, this.onRcvClubInfo, this);
        cc.vv.NetManager.registerMsg(MsgId.SEATDOWN, this.onEnterDeskResult, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTICE_TABLEINFO, this.onRecvTableinfo, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTIFY_DELETE_TABLE, this.onRecvDeleteTable, this);


    },

    unregisterMsg(){
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_ADDNEWTABLE, this.onRcvAddTableMsg,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.ENTERCLUB, this.onRcvClubInfo,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.SEATDOWN, this.onEnterDeskResult,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_TABLEINFO, this.onRecvTableinfo,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_DELETE_TABLE, this.onRecvDeleteTable,false,this);
    },

    onRecvDeleteTable(msg){
        if(msg.code === 200){
            let deskId = msg.response.deskId;
            for(let i=0;i<this._content.childrenCount;++i){
                let item = this._content.children[i];
                if(item._deskId === deskId){
                    item.removeFromParent();
                    for(let i=0;i<this._tableList.length;++i){
                        if(this._tableList[i].deskid === deskId){
                            this._tableList.splice(i,1);
                            break;
                        }
                    }
                    break;
                }
            }
            this.initTables(this._tableList);
        }
    },

    // 桌子信息
    onRecvTableinfo(msg){
        if(msg.code === 200){
            let deskInfo = msg.response.hallDeskInfo;
            for(let i=0;i<this._content.childrenCount;++i){
                let item = this._content.children[i];
                if(item._deskId === deskInfo.deskid){
                    this.initTable(item,deskInfo.config,deskInfo);
                    for(let i=0;i<this._tableList.length;++i){
                        if(this._tableList[i].deskid === deskInfo.deskid){
                            this._tableList[i] = deskInfo;
                            break;
                        }
                    }
                    break;
                }
            }
        }
    },

    onEnterDeskResult(msg){
        if(msg.code === 200){
            if(cc.vv.gameData === null){
                let data = require("PengHu_GameData");
                cc.vv.gameData = new data();
                cc.vv.gameData.init(msg.response.deskInfo);
                cc.vv.SceneMgr.enterScene("penghu");
            }
        }
    },

    onRcvAddTableMsg(msg){
        if(msg.code === 200){
            this._tableList.unshift(msg.response.addDeskInfo);
            this.initTables(this._tableList);
        }
    },

    // 加入桌子
    onEnterDesk(event){
        if(!this._sendSit){
            var req = { 'c': MsgId.SEATDOWN};
            req.clubid = cc.vv.UserManager.currClubId;
            req.deskId = event.target._deskId;
            cc.vv.NetManager.send(req);
            this.scheduleOnce(()=>{
                this._sendSit = true;
            },0.2)
        }
    },

    // 更新桌子信息
    initTable(item,config,data){
        let type = cc.find("node/type_bg",item);
        type.getComponent(cc.Sprite).spriteFrame = this.wanfaAtlas.getSpriteFrame("hallClub-img-table-moreRule-index_" +
            config.playtype);

        let tableName = cc.find("node/img_roomId/table_name",item);
        tableName.getComponent(cc.Label).string = config.tname;

        let round = cc.find("node/img_round/txt_round",item);
        round.getComponent(cc.Label).string = config.gamenum+"局 " +config.seat+"人" ;

        let char2 = cc.find("node/char_2",item);
        char2.active = config.seat === 4;

        let char4 = cc.find("node/char_4",item);
        char4.active = config.seat === 4;

        cc.find("node/char_1/headNode",item).active = false;
        cc.find("node/char_2/headNode",item).active = false;
        cc.find("node/char_3/headNode",item).active = false;
        cc.find("node/char_4/headNode",item).active = false;

        if(data.users){
            let users = data.users;
            for(let j=0;j<users.length;++j){
                let headNode = cc.find("node/char_"+(j+1)+"/headNode",item);
                if(config.seat === 2 && j===1) headNode = cc.find("node/char_3/headNode",item);
                if(headNode){
                    headNode.active = true;
                    Global.setHead(headNode.getChildByName("UserHead"),users[j].usericon);
                    let name = cc.find("img_nameBg/txt_name",headNode);
                    name.getComponent(cc.Label).string = users[j].playername;

                    headNode.getChildByName("img_ready").active = users[j].state===1;
                }
            }
        }

        let bg = cc.find("node/bg",item);
        bg.getComponent(cc.Sprite).spriteFrame = config.seat === 4?this.tableBgs[0]:this.tableBgs[1];
    },

    initTables(list){
        let width = 0;
        for(let i=0;i<list.length;++i){
            let config = list[i].config;
            let item = null;
            if(i<this._content.childrenCount) item = this._content.children[i];
            else {
                item = cc.instantiate(this._content.children[0]);
                item.parent = this._content;
            }
            item.active = true;
            let clickBtn = cc.find("node/img_click",item);
            clickBtn._deskId = list[i].deskid;
            item._deskId = list[i].deskid;
            Global.btnClickEvent(clickBtn,this.onEnterDesk,this);

            item.x  = this._startPos.x + (clickBtn.width+30)*parseInt(i/2);
            item.y  = this._startPos.y - (clickBtn.height+30)*(i%2);
            if(i%2===0) width +=  (clickBtn.width+30);
            this.initTable(item,config,list[i]);

        }
        for(let i=list.length;i<this._content.childrenCount;++i){
            this._content.children[i].active = false;
        }
        this._content.active = list.length>0;
        this._content.width = width+50;
    },

    onCreateRoom(){
        Global.dispatchEvent(EventId.GAME_CREATEROOM);
    },

    onBack(){
        cc.vv.SceneMgr.enterScene("club_lobby");
    },

    onDestroy(){
        this.unregisterMsg();
    }
    // update (dt) {},
});
