
cc.Class({
    extends: cc.Component,

    properties: {
        _layer:null,
        _isOver:false,
        _OverScoreNode:null,
    },

    start () {
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.GAMEOVER,this.recvGameOver,this);

        this._OverScoreNode = cc.find("scene/over_score",this.node);
        this._OverScoreNode.active = false;
    },

    recvGameOver(){
        this._isOver = true;
    },

    recvRoundOver(data){
        data = data.detail;
        if(this._layer === null){
            cc.loader.loadRes("common/prefab/TongHua_round_over_view",(err,prefab)=>{
                if(err === null){
                    this._layer = cc.instantiate(prefab);
                    this._layer.parent = this.node.getChildByName("scene");
                    this._layer.scaleX = this.node.width / this._layer.width;
                    this._layer.scaleY = this.node.height / this._layer.height;
                    this._layer.zIndex = 3;
                    this._layer.active = false;
                    this._layer.x = this.node.width/2;
                    this._layer.y = this.node.height/2;

                    this.initRoomInfo();
                    this.initPlayerInfo(data);

                    let self = this;
                    this.scheduleOnce(()=>{
                        self._layer.active = true;
                    },2);
                }
            })
        }

        this._OverScoreNode.active = true;
        for(let i=0;i<data.users.length;++i){
            let chairId = cc.vv.gameData.getLocalChair(data.users[i].seat);
            let score = this._OverScoreNode.getChildByName("score"+chairId);
            score.getComponent(cc.Label).string = data.users[i].roundScore + "分";
            score.color = data.users[i].roundScore>0?(new cc.Color(236,187,111)):(new cc.Color(209,114,96));
        }
        this._OverScoreNode.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(()=>{
            this._OverScoreNode.active = false;
        })))
    },

    initRoomInfo(){
        let conf = cc.vv.gameData.getRoomConf();
        let roomId = cc.find("roomInfoNode/txt_room_id",this._layer);
        roomId.getComponent(cc.Label).string = "游戏号:" + conf.deskId;

        let roundNum = cc.find("roomInfoNode/txt_round_num",this._layer);
        roundNum.getComponent(cc.Label).string = "(" + cc.vv.gameData.getDeskInfo().round + "/" + conf.gamenum + "局)";

        let desc = cc.find("roomInfoNode/txt_game_desc",this._layer);
        let str = "";
        let list = cc.vv.gameData.getWanFa();
        for(let i=0;i<list.length;++i){
            str += list[i];
        }
        desc.getComponent(cc.Label).string = str;

        let okBtn = this._layer.getChildByName("btn_comfirm");
        Global.btnClickEvent(okBtn,this.onClose,this);
    },

    initPlayerInfo(data){
        let createUid = cc.vv.gameData.getRoomConf().createUserInfo.uid;
        for(let i = 0; i < data.users.length; ++i){
            let player = this._layer.getChildByName("player" + i);

            let spr_head = cc.find("head/radio_mask/spr_head",player);
            Global.setHead(spr_head, data.users[i].usericon);

            player.getChildByName("mask_master").active = (data.users[i].uid == createUid);

            player.getChildByName("text_name").getComponent(cc.Label).string = data.users[i].playername;
            player.getChildByName("text_id").getComponent(cc.Label).string = "ID:"+data.users[i].uid;

            player.getChildByName("mask_shangYou").active = (1 == data.users[i].roundYiYou);
            player.getChildByName("mask_xiaYou").active = (1 == data.users[i].roundErYou);

            player.getChildByName("text_burnScore").getComponent(cc.Label).string = data.users[i].roundShaoFen;
            player.getChildByName("text_burnScore").color = data.users[i].roundShaoFen > 0 ? (new cc.Color(233,248,85)) : (new cc.Color(178,251,255));
            player.getChildByName("text_rankScore").getComponent(cc.Label).string = data.users[i].roundTopFen;
            player.getChildByName("text_rankScore").color = data.users[i].roundTopFen > 0 ? (new cc.Color(233,248,85)) : (new cc.Color(178,251,255));
            player.getChildByName("text_gameScore").getComponent(cc.Label).string = data.users[i].roundZhuaFen;
            player.getChildByName("text_gameScore").color = data.users[i].roundZhuaFen > 0 ? (new cc.Color(233,248,85)) : (new cc.Color(178,251,255));
            player.getChildByName("text_xiScore").getComponent(cc.Label).string = data.users[i].roundXiFen;
            player.getChildByName("text_xiScore").color = data.users[i].roundXiFen > 0 ? (new cc.Color(233,248,85)) : (new cc.Color(178,251,255));
            player.getChildByName("text_roundScore").getComponent(cc.Label).string = data.users[i].roundScore;
            player.getChildByName("text_roundScore").color = data.users[i].roundScore > 0 ? (new cc.Color(233,248,85)) : (new cc.Color(178,251,255));
        }
        for (let i = data.users.length; i < cc.vv.gameData.RoomSeat; i++) {
            this._layer.getChildByName("player" + i).active = false;
        }
    },

    onClose(){
        let ndoe_fly_icon = this._layer.parent.getChildByName("ndoe_fly_icon");
        for(let i = 0; i < ndoe_fly_icon.children.length; ++i){
            ndoe_fly_icon.children[i].stopAllActions();
            ndoe_fly_icon.children[i].removeFromParent();
        }
        this._layer.removeFromParent(true);
        this._layer = null;
        if(this._isOver) {
            Global.dispatchEvent(EventId.SHOW_GAMEOVER);
        } else { 
            Global.dispatchEvent(EventId.CLOSE_ROUNDVIEW);
        }
    },

    clearDesk(){
        this._num = 0;
        if(this._layer){
            this._layer.removeFromParent(true);
            this._layer = null;
        }
        this._OverScoreNode.active = false;
    },

    onDestroy(){
        if(this._layer){
            cc.loader.releaseRes("common/prefab/TongHua_round_over_view",cc.Prefab);
        }
    }
    // update (dt) {},
});
