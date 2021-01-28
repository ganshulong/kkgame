
cc.Class({
    extends: cc.Component,

    properties: {
        _layer:null,
        _loseBgSpr:null,
        _winBgSpr:null,
        _show:false,
    },
    
    init(atlas,yinxiAtlas){
        // this._atlas = atlas;
        // this._yinxiAtlas = yinxiAtlas;
    },

    start () {
        Global.registerEvent(EventId.GAMEOVER,this.recvGameOver,this);
        Global.registerEvent(EventId.SHOW_GAMEOVER,this.recvShowGameOver,this);
    },

    recvShowGameOver(){
        this._show = true;
        if(this._layer) {
            this._layer.active = true;
        }
    },

    recvGameOver(data){
        data = data.detail;
        cc.loader.loadRes("common/prefab/ZhuanZhuan_game_over_view",(err,prefab)=>{
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

                let btn_share = this._layer.getChildByName("btn_share");
                Global.btnClickEvent(btn_share,this.onShare,this);

                this._layer.getChildByName("txt_room_id").getComponent(cc.Label).string = "房间号:" + cc.vv.gameData.getRoomConf().deskId;
                this._layer.getChildByName("txt_round_num").getComponent(cc.Label).string = "局数:" + cc.vv.gameData.getDeskInfo().round + "/" + cc.vv.gameData.getRoomConf().gamenum;
                this._layer.getChildByName("txt_date").getComponent(cc.Label).string = data.overTime;

                this.showPlayerInfo(data);

                // 创建者
                let bg_creator = this._layer.getChildByName("bg_creator");
                let spr_head = cc.find("head/radio_mask/spr_head",bg_creator);
                Global.setHead(spr_head,data.createUser.usericon);
                bg_creator.getChildByName("text_name").getComponent(cc.Label).string = data.createUser.playername;
                bg_creator.getChildByName("text_id").getComponent(cc.Label).string = "ID:"+data.createUser.uid;

                let txt_game_desc = this._layer.getChildByName("txt_game_desc");
                txt_game_desc.getComponent(cc.Label).string = cc.vv.gameData.getWanFaStrDetail();

                let round_over_view = this._layer.parent.getChildByName("round_over_view");
                if (!round_over_view) {
                    this.recvShowGameOver();   
                }
            }
        })
    },

    showPlayerInfo(data){
        let bigWinerScore = 0;
        for(let i = 0; i < data.users.length; ++i){
            if (bigWinerScore < data.users[i].score) {
                bigWinerScore = data.users[i].score;
            }
        }

        let bg_playerInfo = this._layer.getChildByName("bg_playerInfo");
        for(let i = 0; i < data.users.length; ++i){
            let player = bg_playerInfo.getChildByName("player" + i);

            player.getChildByName("img_bigwiner").active = (0 < bigWinerScore && bigWinerScore === data.users[i].score);
            let spr_head = cc.find("head/radio_mask/spr_head",player);
            Global.setHead(spr_head, data.users[i].usericon);
            player.getChildByName("text_name").getComponent(cc.Label).string = data.users[i].playername;
            player.getChildByName("text_id").getComponent(cc.Label).string = data.users[i].uid;

            player.getChildByName("text_zimo_count").getComponent(cc.Label).string = data.users[i].zimoCount;
            player.getChildByName("text_angang_count").getComponent(cc.Label).string = data.users[i].angangCount;
            player.getChildByName("text_minggang_count").getComponent(cc.Label).string = data.users[i].mingangCount;
            player.getChildByName("text_jiegang_count").getComponent(cc.Label).string = data.users[i].jiegangCount;

            let bg_score = player.getChildByName("bg_score");
            if (0 <= data.users[i].score) {
                bg_score.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = ('/' + Math.abs(data.users[i].score));
                bg_score.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = '';
            } else {
                bg_score.getChildByName("LabelAtlas_score_win").getComponent(cc.Label).string = '';
                bg_score.getChildByName("LabelAtlas_score_lose").getComponent(cc.Label).string = ('/' + Math.abs(data.users[i].score));
            }
        }
    },

    // 分享
    onShare(){
        Global.onWXShareImage(Global.ShareSceneType.WXSceneSession);
    },

    onBack(){
        if(cc.vv.gameData) cc.vv.gameData.exitGame();
    },

    onDestroy(){
        if(this._layer) cc.loader.releaseRes("common/prefab/ZhuanZhuan_game_over_view",cc.Prefab);
    }
    // update (dt) {},
});
