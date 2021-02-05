
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
        cc.loader.loadRes("common/prefab/ErQiGui_game_over_view",(err,prefab)=>{
            if(err === null){
                this._layer = cc.instantiate(prefab);
                this._layer.parent = this.node.getChildByName("scene");
                // this._layer.scaleX = this.node.width / this._layer.width;
                // this._layer.scaleY = this.node.height / this._layer.height;
                this._layer.active = this._show;
                this._layer.zIndex = 2;
                this._layer.x = this.node.width/2;
                this._layer.y = this.node.height/2;

                let btnBtn = this._layer.getChildByName("btn_back");
                Global.btnClickEvent(btnBtn,this.onBack,this);

                this._layer.getChildByName("room_id").getComponent(cc.Label).string = cc.vv.gameData.getRoomConf().deskId;
                this._layer.getChildByName("txt_end_time").getComponent(cc.Label).string = data.overTime;

                let btn_share = this._layer.getChildByName("btn_share");
                Global.btnClickEvent(btn_share,this.onShare,this);

                let scoreList = data.users.slice(0);
                scoreList.sort((a,b)=>{
                    return b.scoreCount - a.scoreCount;
                });
                let bigWinerScore = (0 < scoreList[0].scoreCount) ?  scoreList[0].scoreCount : "";
                for(let i = 0; i < data.users.length; ++i){
                    let player = cc.find("game_end_bg/player"+i,this._layer);
                    this.initPlayer(player, data.users[i], bigWinerScore);
                }

                let round_over_view = this._layer.parent.getChildByName("round_over_view");
                if (!round_over_view) {
                    this.recvShowGameOver();   
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

    initPlayer(player, user, bigWinerScore){
        if(player){
            let spr_head = cc.find("head/radio_mask/spr_head",player);
            Global.setHead(spr_head, user.usericon);

            player.getChildByName("flag_dayingjia").active = (user.scoreCount === bigWinerScore);
            player.getChildByName("txt_name").getComponent(cc.Label).string = user.playername;
            player.getChildByName("txt_id").getComponent(cc.Label).string = "ID:"+user.uid;

            player.getChildByName("text_bankerNum").getComponent(cc.Label).string = user.buckCount;
            player.getChildByName("text_winNum").getComponent(cc.Label).string = user.winCount;
            player.getChildByName("text_lossNum").getComponent(cc.Label).string = user.loseCount;
            player.getChildByName("text_totalScxore").getComponent(cc.Label).string = user.score + "x" + user.beishu;

            if (0 < user.scoreCount) {
                player.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = ('/' + user.scoreCount.toFixed(2));
                player.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = '';
            } else if (0 == user.scoreCount) {
                player.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = '0';
                player.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = '';
            } else {
                player.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = '';
                player.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = ('/' + Math.abs(user.scoreCount).toFixed(2));
            }
        }
    },

    onDestroy(){
        if(this._layer) cc.loader.releaseRes("common/prefab/ErQiGui_game_over_view",cc.Prefab);
    }
    // update (dt) {},
});
