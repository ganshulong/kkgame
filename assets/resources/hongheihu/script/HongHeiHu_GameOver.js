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
        _loseBgSpr:null,
        _winBgSpr:null,
        _show:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init(atlas,yinxiAtlas){
        this._atlas = atlas;
        this._yinxiAtlas = yinxiAtlas;
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
        cc.loader.loadRes("common/prefab/Hongheihu_game_over_view",(err,prefab)=>{
            if(err === null){
                this._layer = cc.instantiate(prefab);
                this._layer.parent = this.node.getChildByName("scene");
                // this._layer.scaleX = this.node.width / this._layer.width;
                // this._layer.scaleY = this.node.height / this._layer.height;
                this._layer.active = this._show;
                this._layer.zIndex = 1;
                this._layer.x = this.node.width/2;
                this._layer.y = this.node.height/2;

                this._winBgSpr = cc.find("game_end_bg/player0/img_bg",this._layer).getComponent(cc.Sprite).spriteFrame;
                this._loseBgSpr = cc.find("game_end_bg/player1/img_bg",this._layer).getComponent(cc.Sprite).spriteFrame;

                let btnBtn = this._layer.getChildByName("btn_back");
                Global.btnClickEvent(btnBtn,this.onBack,this);

                let btn_share = this._layer.getChildByName("btn_share");
                Global.btnClickEvent(btn_share,this.onShare,this);

                this._layer.getChildByName("room_id").getComponent(cc.Label).string = cc.vv.gameData.getRoomConf().deskId;
                this._layer.getChildByName("txt_end_time").getComponent(cc.Label).string = data.overTime;

                // 创建者
                let creator = cc.find("game_end_bg/creator",this._layer);
                let icon = cc.find("radio_mask/spr_head",creator);
                Global.setHead(icon,data.createUser.usericon);

                creator.getChildByName("name").getComponent(cc.Label).string = data.createUser.playername;
                creator.getChildByName("id").getComponent(cc.Label).string = "ID:"+data.createUser.uid;

                let paoList = data.users.slice(0);
                paoList.sort((a,b)=>{
                    return b.dianPaoCount - a.dianPaoCount;
                });

                let scoreList = data.users.slice(0);
                scoreList.sort((a,b)=>{
                    return b.score - a.score;
                });

                let posArr = [[0,0,0],[0,0,0],[-230,230,0],[-375,0,375]];
                let dianPaoWangId = paoList[0].dianPaoCount > 0 ? paoList[0].uid : 0;
                let bigWinerId = scoreList[0].uid;
                for(let i = 0; i < data.users.length; ++i){
                    let player = cc.find("game_end_bg/player"+i,this._layer);
                    this.initPlayer(player,data.users[i], dianPaoWangId, bigWinerId);
                    player.x = posArr[data.users.length][i];
                    player.active = true;
                }
                for(let i = data.users.length; i < 3; ++i){
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

    initPlayer(player,user,dianPaoWangId,dayingjiaID){
        if(player){
            let img_bg = player.getChildByName("img_bg");
            img_bg.getComponent(cc.Sprite).spriteFrame = user.score >= 0 ? this._winBgSpr : this._loseBgSpr;

            let head = player.getChildByName("head");
            let icon = cc.find("radio_mask/spr_head",head);
            Global.setHead(icon,user.usericon);

            player.getChildByName("flag_dianpao").active = user.uid === dianPaoWangId;
            player.getChildByName("flag_dayingjia").active = user.uid === dayingjiaID;

            player.getChildByName("txt_name").getComponent(cc.Label).string = user.playername;
            player.getChildByName("txt_id").getComponent(cc.Label).string = "ID:"+user.uid;

            img_bg.getChildByName("title_hu_num").getComponent(cc.Sprite).spriteFrame = user.score>=0?
                this._atlas.getSpriteFrame("penghu_onwer-table-imgs-win_hu_num"):this._atlas.getSpriteFrame("penghu_onwer-table-imgs-lose_hu_num");
                                                                                                             
            img_bg.getChildByName("title_mingtang_num").getComponent(cc.Sprite).spriteFrame = user.score>=0?
                this._yinxiAtlas.getSpriteFrame("hongheihu-imgs-gamover-win_mingtang_num"):this._yinxiAtlas.getSpriteFrame("hongheihu-imgs-gamover-lose_mingtang_num");

            img_bg.getChildByName("title_yinxi_num").getComponent(cc.Sprite).spriteFrame = user.score>=0?
                this._yinxiAtlas.getSpriteFrame("hongheihu-imgs-gamover-win_all_huxi"):this._yinxiAtlas.getSpriteFrame("hongheihu-imgs-gamover-lose_all_huxi");

            img_bg.getChildByName("hu_num").getComponent(cc.Label).string = user.huPaiCount;
            img_bg.getChildByName("mingtang_num").getComponent(cc.Label).string = user.mingTangCount;
            img_bg.getChildByName("yinxi_num").getComponent(cc.Label).string = user.totalHuXi;

            let score = user.score + "";
            if(score < 0) {
                score = "/"+ (-score);
            }
            img_bg.getChildByName("score").getComponent(cc.Label).string = score;

            if(cc.vv.UserManager.uid === user.uid){
                cc.find("game_end_bg/win_title",this._layer).active = user.score >= 0;
                cc.find("game_end_bg/lose_title",this._layer).active = user.score < 0;
            }
        }
    },

    onDestroy(){
        if(this._layer) cc.loader.releaseRes("common/prefab/Hongheihu_game_over_view",cc.Prefab);
    }
    // update (dt) {},
});
