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
        _gameOverNode:null,
        _loseBgSpr:null,
        _winBgSpr:null,
        _show:false,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init(atlas){
        this._atlas = atlas;
    },

    start () {
        Global.registerEvent(EventId.GAMEOVER,this.recvGameOver,this);
        Global.registerEvent(EventId.SHOW_GAMEOVER,this.recvShowGameOver,this);

    },

    recvShowGameOver(){
        this._show = true;
        if(this._gameOverNode) this._gameOverNode.active = true;
    },

    recvGameOver(data){
        data = data.detail;
        cc.loader.loadRes("common/prefab/gameOverView",(err,prefab)=>{
            if(err === null){
                this._gameOverNode = cc.instantiate(prefab);
                this._gameOverNode.active = this._show;
                this._gameOverNode.zIndex = 1;
                this._gameOverNode.parent = this.node.getChildByName("scene");

                this._winBgSpr = cc.find("game_end_bg/player0/img_bg",this._gameOverNode).getComponent(cc.Sprite).spriteFrame;
                this._loseBgSpr = cc.find("game_end_bg/player1/img_bg",this._gameOverNode).getComponent(cc.Sprite).spriteFrame;

                let btnBtn = this._gameOverNode.getChildByName("btn_back");
                Global.btnClickEvent(btnBtn,this.onBack,this);

                let btn_share = this._gameOverNode.getChildByName("btn_share");
                Global.btnClickEvent(btn_share,this.onShare,this);

                this._gameOverNode.getChildByName("room_id").getComponent(cc.Label).string = cc.vv.gameData.getRoomConf().deskId;
                this._gameOverNode.getChildByName("txt_end_time").getComponent(cc.Label).string = data.overTime;

                // 创建者
                let creator = cc.find("game_end_bg/creator",this._gameOverNode);
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

                for(let i=0;i<4;++i){
                    let player = cc.find("game_end_bg/player"+i,this._gameOverNode);
                    if(i<data.users.length){
                        this.initPlayer(player,data.users[i],paoList[0].dianPaoCount>0?paoList[0].uid:0,scoreList[0].uid);
                        player.active = true;
                    }
                    else{
                        player.active = false;
                    }
                    if(cc.vv.gameData.getPlayerNum()===2){
                        if(i===0)player.x = -180;
                        else if(i===1)player.x = 280;
                    }
                }
            }
        })
    },

    // 分享
    onShare(){

    },

    onBack(){
        if(cc.vv.gameData) cc.vv.gameData.exitGame();
    },

    initPlayer(player,user,dianPaoWangId,dayingjiaID){
        if(player){
            player.getChildByName("txt_name").getComponent(cc.Label).string = user.playername;
            player.getChildByName("txt_id").getComponent(cc.Label).string = "ID:"+user.uid;

            let img_bg = player.getChildByName("img_bg");
            img_bg.getComponent(cc.Sprite).spriteFrame = user.score>0?this._winBgSpr:this._loseBgSpr;

            img_bg.getChildByName("title_hu_num").getComponent(cc.Sprite).spriteFrame = user.score>0?
                this._atlas.getSpriteFrame("penghu_onwer-table-imgs-win_hu_num"):this._atlas.getSpriteFrame("penghu_onwer-table-imgs-lose_hu_num");

            img_bg.getChildByName("title_zhongzhuang_num").getComponent(cc.Sprite).spriteFrame = user.score>0?
                this._atlas.getSpriteFrame("penghu_onwer-table-imgs-win_zhongzhuang_num"):this._atlas.getSpriteFrame("penghu_onwer-table-imgs-lose_zhongzhuang_num");
            img_bg.getChildByName("title_dianpao_num").getComponent(cc.Sprite).spriteFrame = user.score>0?
                this._atlas.getSpriteFrame("penghu_onwer-table-imgs-win_dianpao_num"):this._atlas.getSpriteFrame("penghu_onwer-table-imgs-lose_dianpao_num");

            img_bg.getChildByName("hu_num").getComponent(cc.Label).string = user.huPaiCount;
            img_bg.getChildByName("zhongzhuang_num").getComponent(cc.Label).string = user.zhongZhangCount;
            img_bg.getChildByName("dianpao_num").getComponent(cc.Label).string = user.dianPaoCount;
            let score = user.score + "";
            if(score<0) score = "/"+ (-score);
            img_bg.getChildByName("score").getComponent(cc.Label).string = score;
            player.active = true;

            player.getChildByName("flag_dianpao").active = user.uid === dianPaoWangId;
            player.getChildByName("flag_dayingjia").active = user.uid === dayingjiaID;

            let head = player.getChildByName("head");
            let icon = cc.find("radio_mask/spr_head",head);
            Global.setHead(icon,user.userIcon);

            if(cc.vv.UserManager.uid === user.uid){
                cc.find("game_end_bg/win_title",this._gameOverNode).active = user.score>=0;
                cc.find("game_end_bg/lose_title",this._gameOverNode).active = user.score<0;
            }
        }
    },

    onDestroy(){
        if(this._gameOverNode) cc.loader.releaseRes("common/prefab/gameOverView",cc.Prefab);
    }
    // update (dt) {},
});
