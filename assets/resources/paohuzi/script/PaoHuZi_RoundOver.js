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
        _overRoundNode:null,
        _show:false,
        _isOver:false,
        _OverScoreNode:null,
        _zhuang:-1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.GAMEOVER,this.recvGameOver,this);
        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);

        this._OverScoreNode = cc.find("scene/over_score",this.node);
        this._OverScoreNode.active = false;
    },

    onRecvHandCard(data){
      data = data.detail;
      this._zhuang = data.bankerInfo.seat;

    },

    recvDeskInfoMsg(){
        this._zhuang = cc.vv.gameData.getDeskInfo().bankerInfo.seat;
    },

    init(atlas){
        this._atlas = atlas;
    },

    createType(type){
        let node = new cc.Node();
        let spr = node.addComponent(cc.Sprite);
        let sprName = "";
        if(type === cc.vv.gameData.OPERATETYPE.CHI) sprName = "penghu_onwer-table-imgs-wz_chi";
        else if(type === cc.vv.gameData.OPERATETYPE.KAN) sprName = "penghu_onwer-table-imgs-wz_kan";
        else if(type === cc.vv.gameData.OPERATETYPE.PAO) sprName = "penghu_onwer-table-imgs-wz_pao";
        else if(type === cc.vv.gameData.OPERATETYPE.LONG) sprName = "penghu_onwer-table-imgs-wz_tilong";
        else if(type === cc.vv.gameData.OPERATETYPE.SAO) sprName = "penghu_onwer-table-imgs-wz_sao";
        else if(type === cc.vv.gameData.OPERATETYPE.PENG) sprName = "penghu_onwer-table-imgs-wz_peng";
        spr.spriteFrame = this._atlas.getSpriteFrame(sprName);
        return node;
    },

    recvGameOver(){
        this._isOver = true;
    },

    recvRoundOver(data){
        data = data.detail;
        if(this._overRoundNode === null){
            cc.loader.loadRes("common/prefab/Paohuzi_round_over_view",(err,prefab)=>{
                if(err === null){
                    this._overRoundNode = cc.instantiate(prefab);
                    this._overRoundNode.parent = this.node.getChildByName("scene");
                    this._overRoundNode.zIndex = 3;
                    this._overRoundNode.active = false;
                    this._overRoundNode.x = this.node.width/2;
                    this._overRoundNode.y = this.node.height/2;
                    this.initPlayerInfo(data.users,data.seat,data.hcard,data.source,data.hupaiType);
                    this.initRoomInfo(data.seat>0);
                    this.scheduleOnce(()=>{
                        this._overRoundNode.active = true;
                    },2);
                }
            })
        }

        this._OverScoreNode.active = true;
        for(let i=0;i<data.users.length;++i){
            let chairId = cc.vv.gameData.getLocalChair(data.users[i].seat);
            if(chairId === 1 && cc.vv.gameData.getPlayerNum()===2){
                chairId = 2;
            }

            let score = this._OverScoreNode.getChildByName("score"+chairId);
            score.getComponent(cc.Label).string = data.users[i].roundScore + "硬息";
            score.color = data.users[i].roundScore>0?(new cc.Color(236,187,111)):(new cc.Color(209,114,96));
        }
        this._OverScoreNode.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(()=>{
            this._OverScoreNode.active = false;
        })))

    },

    initPlayerInfo(users,seat,card,source,hupaiType){
        for(let i=0;i<3;++i){
            if(i<users.length){
                let chairId = cc.vv.gameData.getLocalChair(users[i].seat);
                let player = cc.find("sp_bg/player"+chairId,this._overRoundNode);
                player.active = true;
                let head = cc.find("overUser/head",player);
                let name = head.getChildByName("name");
                name.getComponent(cc.Label).string = users[i].playername;

                let id = head.getChildByName("id");
                id.getComponent(cc.Label).string = "ID:"+users[i].uid;

                let icon = cc.find("radio_mask/spr_head",head);
                Global.setHead(icon,users[i].usericon);

                let handCardNode = player.getChildByName("panel_cards");
                let cardValue = null;
                if(source === users[i].seat || (source===0 && users[i].seat === seat)){
                    cardValue = card;
                }
                if(users[i].seat === seat){
                    this.initHandCard(users[i].handInCards,handCardNode,users[i].menzi,cardValue,source);
                }
                else{
                    this.initHandCard(users[i].handInCards,handCardNode,users[i].menzi,cardValue,source);
                }

                // 胡息
                let score = player.getChildByName("lbl_num");
                score.getComponent(cc.Label).string = users[i].roundScore;
                let img_signal = player.getChildByName("img_signal");
                img_signal.active = users[i].roundScore<0;
                img_signal.x = score.x-score.width-img_signal.width;


                // 放炮
                let fangpao = player.getChildByName("wz_fangpao");
                fangpao.active = hupaiType>0 && source>0 && users[i].seat === source;

                // 臭庄
                let chouzhuang = player.getChildByName("wz_chouzhuang");
                chouzhuang.active = hupaiType<=0 && users[i].seat === seat;

                // 胡牌
                let huflag_bg = player.getChildByName("huflag_bg");
                huflag_bg.active = hupaiType>0 && users[i].seat === seat;

                //
                //liuju = -1, --流局

                // 胡牌类型
                let huflag = huflag_bg.getChildByName("huflag");
                if(hupaiType>0) this.showHuType(hupaiType,huflag);

            }
            else cc.find("sp_bg/player"+i,this._overRoundNode).active = false;
        }
    },

    // normal = 1, --平胡
    // tianHu = 2, --天胡
    // diHu = 3, --地胡
    // tilongHu = 4, --踢龙胡
    // paoHu = 5, --跑胡
    // saoHu = 6, --扫胡
    // pengHu = 7,--碰胡
    // pengSanHu = 8, --碰三胡
    // saoSanHu = 9, --扫胡
    // pengSiHu = 10, --碰四胡
    // saoSiHu = 11, --扫四胡
    // shuangLongHu = 12, --双龙
    // xiaoQiDuiHu = 13, --小七对
    // paoDiHu = 14, --跑地胡
    // pengDiHu = 15, --碰地胡
    // pengDiHu = 16, --五福
    showHuType(type,huFlag){
        let sprName = "";
        if(type===1) sprName = "penghu_onwer-table-imgs-huflag_12";
        else if(type===2) sprName = "penghu_onwer-table-imgs-huflag_0";
        else if(type===3 || type === 14 || type === 15) sprName = "penghu_onwer-table-imgs-huflag_1";
        else if(type===4) sprName = "penghu_onwer-table-imgs-huflag_5";
        else if(type===5) sprName = "penghu_onwer-table-imgs-huflag_6";
        else if(type===6) sprName = "penghu_onwer-table-imgs-huflag_13";
        else if(type===7) sprName = "penghu_onwer-table-imgs-huflag_9";
        else if(type===8) sprName = "penghu_onwer-table-imgs-huflag_8";
        else if(type===9) sprName = "penghu_onwer-table-imgs-huflag_13";
        else if(type===10) sprName = "penghu_onwer-table-imgs-huflag_7";
        else if(type===11) sprName = "penghu_onwer-table-imgs-huflag_11";
        else if(type===12) sprName = "penghu_onwer-table-imgs-huflag_3";
        else if(type===13) sprName = "penghu_onwer-table-imgs-huflag_2";
        else if(type===16) sprName = "penghu_onwer-table-imgs-huflag_4";
        huFlag.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(sprName);
    },


    initRoomInfo(isHu){
        let conf = cc.vv.gameData.getRoomConf();
        let roomId = cc.find("sp_bg/roomInfoNode/txt_room_id",this._overRoundNode);
        roomId.getComponent(cc.Label).string = "游戏号:" + conf.deskId;

        let roundNum = cc.find("sp_bg/roomInfoNode/txt_round_num",this._overRoundNode);
        roundNum.getComponent(cc.Label).string = "(" + cc.vv.gameData.getDeskInfo().round + "/" + conf.gamenum + "局)";

        let desc = cc.find("sp_bg/roomInfoNode/txt_game_desc",this._overRoundNode);
        let str = "";
        let list = cc.vv.gameData.getWanFa();
        for(let i=0;i<list.length;++i){
            str += list[i];
        }
        desc.getComponent(cc.Label).string = str;

        let okBtn = this._overRoundNode.getChildByName("btn_comfirm");
        Global.btnClickEvent(okBtn,this.onClose,this);

    },

    onClose(){
        let ndoe_fly_icon = this._overRoundNode.parent.getChildByName("ndoe_fly_icon");
        for(let i = 0; i < ndoe_fly_icon.children.length; ++i){
            ndoe_fly_icon.children[i].stopAllActions();
            ndoe_fly_icon.children[i].removeFromParent();
        }
        this._overRoundNode.removeFromParent(true);
        this._overRoundNode = null;
        this._show = false;
        if(this._isOver) Global.dispatchEvent(EventId.SHOW_GAMEOVER);
        else Global.dispatchEvent(EventId.CLOSE_ROUNDVIEW);
    },

    initHandCard(list,parent,menzi,card=null,source=null){
        let tempList = cc.vv.gameData.sortCard(list);
        let width=0;
        for(let i=0;i<tempList.length;++i){
            for(let j=0;j<tempList[i].length;++j) {
                let node = this.node.getComponent("PaoHuZi_Card").createCard(tempList[i][j],1);
                node.scale = 0.5;
                node.y = (node.height-28)*j*node.scale+20;
                node.x = node.width*i*node.scale+20;
                node.zIndex=4-j;
                node.parent = parent;
                if(j ===0){
                    width = node.x+node.scale*node.width*0.5;
                }
            }
        }

        for(let i=0;i<menzi.length;++i){
            let menzilist = [];
            let typeData = menzi[i];
            let typeNode = this.createType(typeData.type);
            typeNode.parent = parent;
            typeNode.zIndex = 1;
            if(typeData.type === cc.vv.gameData.OPERATETYPE.KAN) // 坎
            {
                menzilist=[typeData.card,typeData.card,typeData.card];
            }
            else if(typeData.type === cc.vv.gameData.OPERATETYPE.LONG || typeData.type === cc.vv.gameData.OPERATETYPE.SHE||
                typeData.type === cc.vv.gameData.OPERATETYPE.PAO){
                menzilist=[typeData.card,typeData.card,typeData.card,typeData.card];
            }
            else if(typeData.type === cc.vv.gameData.OPERATETYPE.PENG){
                menzilist=[typeData.card,typeData.card,typeData.card];
            }
            else if(typeData.type === cc.vv.gameData.OPERATETYPE.CHI){
                menzilist=typeData.data;
            }
            let posX = 0;
            let PosY = 0;
            for(let j=0;j<menzilist.length;++j){
                let node = this.node.getComponent("PaoHuZi_Card").createCard(menzilist[j],0);
                node.scale = 0.45;
                node.x = width+node.width*node.scale;
                node.y = 44;
                node.parent = parent;
                width += (node.width*node.scale);

                if(j===1){
                    PosY = node.height*node.scale*0.5+40;
                    if(menzilist.length===3) posX = node.x;
                    else if(menzilist.length===4){
                        posX = node.x+node.width*node.scale;
                    }
                    else if(menzilist.length===2){
                        posX = node.x-node.width*node.scale;
                    }
                }
            }
            typeNode.x = posX;
            typeNode.y = PosY;

            width += 10;

        }

        if(card){
            let bgNode = new cc.Node();
            bgNode.addComponent(cc.Sprite);
            this.node.getComponent("PaoHuZi_Card").changCardBg(bgNode,source===0);
            let cardNode = this.node.getComponent("PaoHuZi_Card").createCard(card,0);
            bgNode.y = 43;
            bgNode.x = width+60;
            bgNode.scale = 0.6;

            cardNode.parent = bgNode;
            bgNode.parent = parent;
        }
    },

    clearDesk(){
        this._num = 0;
        if(this._overRoundNode){
            this._overRoundNode.removeFromParent(true);
            this._overRoundNode = null;
        }
        this._show = false;
        this._OverScoreNode.active = false;
    },

    onDestroy(){
        if(this._overRoundNode){
            cc.loader.releaseRes("common/prefab/Paohuzi_round_over_view",cc.Prefab);
        }
    }
    // update (dt) {},
});
