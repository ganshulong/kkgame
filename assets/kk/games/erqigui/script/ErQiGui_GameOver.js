
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
        cc.loader.loadRes("common/prefab/Paodekuai_game_over_view",(err,prefab)=>{
            if(err === null){
                this._layer = cc.instantiate(prefab);
                this._layer.parent = this.node.getChildByName("scene");
                // this._layer.scaleX = this.node.width / this._layer.width;
                // this._layer.scaleY = this.node.height / this._layer.height;
                this._layer.active = this._show;
                this._layer.zIndex = 3;
                this._layer.x = this.node.width/2;
                this._layer.y = this.node.height/2;

                this.bg_bar_win = cc.find("game_end_bg/bg_bar_win",this._layer).getComponent(cc.Sprite).spriteFrame;
                this.bg_bar_lose = cc.find("game_end_bg/bg_bar_lose",this._layer).getComponent(cc.Sprite).spriteFrame;

                let btnBtn = this._layer.getChildByName("btn_back");
                Global.btnClickEvent(btnBtn,this.onBack,this);

                // 创建者
                // let creator = cc.find("game_end_bg/creator",this._layer);
                // let icon = cc.find("radio_mask/spr_head",creator);
                // Global.setHead(icon,data.createUser.usericon);

                // creator.getChildByName("name").getComponent(cc.Label).string = data.createUser.playername;
                // creator.getChildByName("id").getComponent(cc.Label).string = "ID:"+data.createUser.uid;

                // this._layer.getChildByName("room_id").getComponent(cc.Label).string = cc.vv.gameData.getRoomConf().deskId;
                // this._layer.getChildByName("txt_end_time").getComponent(cc.Label).string = data.overTime;

                // let btn_share = this._layer.getChildByName("btn_share");
                // Global.btnClickEvent(btn_share,this.onShare,this);

                // let scoreList = data.users.slice(0);
                // scoreList.sort((a,b)=>{
                //     return b.score - a.score;
                // });

                // let posArr = [[0,0,0],[0,0,0],[-230,230,0],[-385,0,385],[-420,-130,160,450]];
                // let bigWinerId = scoreList[0].uid;
                // for(let i = 0; i < data.users.length; ++i){
                //     let player = cc.find("game_end_bg/player"+i,this._layer);
                //     this.initPlayer(player, data.users[i], bigWinerId, data.createUser.uid);
                //     player.x = posArr[data.users.length][i];
                //     player.active = true;
                // }
                // for(let i = data.users.length; i < cc.vv.gameData.RoomSeat; ++i){
                //     cc.find("game_end_bg/player"+i,this._layer).active = false;
                // }
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

    initPlayer(player,user,dayingjiaID,createID){
        if(player){
            let head = player.getChildByName("head");
            let icon = cc.find("radio_mask/spr_head",head);
            Global.setHead(icon,user.usericon);

            player.getChildByName("mask_master").active = (user.uid == createID);

            player.getChildByName("txt_name").getComponent(cc.Label).string = user.playername;
            player.getChildByName("txt_id").getComponent(cc.Label).string = "ID:"+user.uid;

            player.getChildByName("flag_dayingjia").active = user.uid === dayingjiaID;

            player.getChildByName("text_maxRoundScore").getComponent(cc.Label).string = "当局最高分数："+ user.highscore;
            player.getChildByName("text_bombNum").getComponent(cc.Label).string = "打出炸弹数："+ user.zhadancount;
            player.getChildByName("text_winLoseNum").getComponent(cc.Label).string = "胜负局数：" + user.winCount + "赢" + user.loseCount + "输";
            player.getChildByName("text_scoreMul").getComponent(cc.Label).string = "积分倍数：" + user.score + "x" + user.beishu + "=" + user.scoreCount;

            let bg_bar = player.getChildByName("bg_bar");
            if (0 <= user.scoreCount) {
                bg_bar.getComponent(cc.Sprite).spriteFrame = this.bg_bar_win;
                player.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = ('/' + Math.abs((user.scoreCount)));
                player.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = '';
            } else {
                bg_bar.getComponent(cc.Sprite).spriteFrame = this.bg_bar_lose;
                player.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = '';
                player.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = ('/' + Math.abs((user.scoreCount)));
            }
        }
    },

    onDestroy(){
        if(this._layer) cc.loader.releaseRes("common/prefab/Paodekuai_game_over_view",cc.Prefab);
    }
    // update (dt) {},
});
