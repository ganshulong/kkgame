
cc.Class({
    extends: cc.Component,

    properties: {
        
        _layer:null,
        _loseBgSpr:null,
        _winBgSpr:null,
        _show:false,
    },

    start () {
        Global.registerEvent(EventId.GAMEOVER,this.recvGameOver,this);
        Global.registerEvent(EventId.SHOW_GAMEOVER,this.recvShowGameOver,this);
    },

    recvShowGameOver(){
        this._show = true;
        if(this._layer) this._layer.active = true;
    },

    recvGameOver(data){
        data = data.detail;
        cc.loader.loadRes("tonghua/TongHua_game_over_view",(err,prefab)=>{
            if(err === null){
                this._layer = cc.instantiate(prefab);
                this._layer.parent = this.node.getChildByName("scene");
                // this._layer.scaleX = this.node.width / this._layer.width;
                // this._layer.scaleY = this.node.height / this._layer.height;
                this._layer.active = this._show;
                this._layer.zIndex = 3;
                this._layer.x = this.node.width/2;
                this._layer.y = this.node.height/2;

                let btnBtn = this._layer.getChildByName("btn_back");
                Global.btnClickEvent(btnBtn,this.onBack,this);

                let roomInfo = this._layer.getChildByName("roomInfo");
                roomInfo.getChildByName("text_mul").getComponent(cc.Label).string = ("x" + cc.vv.gameData.getRoomConf().score);
                roomInfo.getChildByName("room_id").getComponent(cc.Label).string = cc.vv.gameData.getRoomConf().deskId;
                roomInfo.getChildByName("txt_end_time").getComponent(cc.Label).string = data.overTime;

                let btn_share = this._layer.getChildByName("btn_share");
                Global.btnClickEvent(btn_share,this.onShare,this);
                
                this._winBgSpr = cc.find("game_end_bg/player0/img_bg",this._layer).getComponent(cc.Sprite).spriteFrame;
                this._loseBgSpr = cc.find("game_end_bg/player1/img_bg",this._layer).getComponent(cc.Sprite).spriteFrame;

                let scoreList = data.users.slice(0);
                scoreList.sort((a,b)=>{
                    return b.score - a.score;
                });
                let bigWinerId = scoreList[0].uid;

                for(let i = 0; i < data.users.length; ++i){
                    let player = cc.find("game_end_bg/player"+i,this._layer);
                    this.initPlayer(player, data.users[i], bigWinerId);
                    player.active = true;
                }
                for(let i = data.users.length; i < cc.vv.gameData.RoomSeat; ++i){
                    cc.find("game_end_bg/player"+i,this._layer).active = false;
                }
            }
        })
    },

    // 分享
    onShare(){
        Global.onWXShareImage(Global.ShareSceneType.WXSceneSession);
    },

    onBack(){
        if(cc.vv.gameData) cc.vv.gameData.exitGame();
    },

    initPlayer(player,user,dayingjiaID){
        if(player){
            let img_bg = player.getChildByName("img_bg");
            img_bg.getComponent(cc.Sprite).spriteFrame = user.score >= 0 ? this._winBgSpr : this._loseBgSpr;
            
            let spr_head = cc.find("head/radio_mask/spr_head", player);
            Global.setHead(spr_head, user.usericon);

            let createUid = cc.vv.gameData.getRoomConf().createUserInfo.uid;
            player.getChildByName("mask_master").active = (user.uid == createUid);
            player.getChildByName("mask_bigWiner").active = (user.uid == dayingjiaID);

            player.getChildByName("txt_name").getComponent(cc.Label).string = user.playername;
            player.getChildByName("txt_id").getComponent(cc.Label).string = "ID:"+user.uid;

            player.getChildByName("text_tongHuaNum").getComponent(cc.Label).string = user.tonghuaCnt;
            player.getChildByName("text_shangYouNum").getComponent(cc.Label).string = user.YiCnt;
            player.getChildByName("text_xiaYouNum").getComponent(cc.Label).string = user.ErCnt;
            player.getChildByName("text_gameScore").getComponent(cc.Label).string = user.score;
            player.getChildByName("text_gameScore").color = user.score > 0 ? (new cc.Color(200,17,36)) : (new cc.Color(133,200,255));
        }
    },

    onDestroy(){
        if(this._layer) cc.loader.releaseRes("tonghua/TongHua_game_over_view",cc.Prefab);
    }
    // update (dt) {},
});
