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
        _createLayer:null,
        _isClubRoom:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    /*gameInfo.clubid
    gameInfo.gameid :1
    gameInfo.seat :人数
    gameInfo.gamenum: 局数
    gameInfo.param1 --中庄家方式
     gameInfo.ipcheck 同ip
     gameInfo.distance 距离
     gameInfo.score 积分
     gameInfo.speed 速度
     gameInfo.tname // 桌名
     gameInfo.trustee // 托管
     */
    start () {
        Global.registerEvent(EventId.GAME_CREATEROOM,this.showCreateRoom,this);
        cc.vv.NetManager.registerMsg(MsgId.ADDGAME, this.onRcvAddGameResult, this);
    },

    showCreateRoom(isClubRoo){
        this._isClubRoom = isClubRoo;
        if(this._createLayer === null){
            cc.loader.loadRes("common/prefab/create_room",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._createLayer = cc.instantiate(prefab);
                    this._createLayer.parent = this.node;
                    this._createLayer.zIndex = 1;
                    // this._createLayer.x = this.node.width/2;
                    // this._createLayer.y = this.node.height/2;
                    this.clearPengHu();

                    let btn_back = this._createLayer.getChildByName("btn_back");
                    Global.btnClickEvent(btn_back,this.onClose,this);

                    let btn_create_room = cc.find("img_bg/right_bg/penghu/btn_create_room",this._createLayer);
                    Global.btnClickEvent(btn_create_room,this.onCreatePengHu,this);
                }
            })
        }
        else{
            this._createLayer.active = true;
        }
    },

    onClose(){
        this._createLayer.active = false;
    },


    onRcvAddGameResult(msg){
        if(msg.code === 200){
            this.onClose();
            cc.vv.FloatTip.show("创建桌子成功!");
        }
    },

    // 创建碰胡
    onCreatePengHu(){
        let layer = cc.find("img_bg/right_bg/penghu",this._createLayer);
        // let str = layer.getChildByName("input_name").getComponent(cc.EditBox).string;
        // if(str.length===0){
        //     cc.vv.FloatTip.show("请输入桌子名称!");
        //     return;
        // }
        let req = {};
        if (this._isClubRoom) {
            req.clubid = cc.vv.UserManager.currClubId;
        }
        req.gameid = 3;
        req.gamenum = 8;
        req.param1 = 0;
        req.score = 1;
        req.seat = 4;
        req.speed = 0;
        for(let i=1;i<4;++i){
            // 局数
            let round = cc.find("round/toggle"+i,layer);
            if(round.getComponent(cc.Toggle).isChecked){
                if(i===1) req.gamenum = 8;
                else if(i === 2) req.gamenum = 16;
                else  req.gamenum = 24;
            }


            // 中庄
            let zhongzhuang = cc.find("zhongzhuang/toggle"+i,layer);
            if(zhongzhuang.getComponent(cc.Toggle).isChecked){
                if(i===1) req.param1 = 0;
                else if(i === 2) req.param1 = 1;
                else  req.param1 = 2;
            }

            // 积分
            let jifen = cc.find("score/toggle"+i,layer);
            if(zhongzhuang.getComponent(cc.Toggle).isChecked){
                if(i===1) req.score = 1;
                else if(i === 2) req.score = 2;
                else  req.score = 4;
            }

            if(i<3){
                let player_num = cc.find("player_num/toggle"+i,layer);
                if(player_num.getComponent(cc.Toggle).isChecked){
                    if(i===1) req.seat = 4;
                    else if(i === 2) req.seat = 2;
                }

                let speed = cc.find("speed/toggle"+i,layer);
                if(speed.getComponent(cc.Toggle).isChecked){
                    if(i===1) req.speed = 0;
                    else if(i === 2) req.speed = 1;
                }
            }
        }


        // 托管
        let trusteeship = cc.find("force/toggle1",layer);
        req.trustee = trusteeship.getComponent(cc.Toggle).isChecked?1:0;

        // 同IP
        let sameIp = cc.find("other/toggle1",layer);
        req.ipcheck = sameIp.getComponent(cc.Toggle).isChecked?1:0;

        // 托管
        let distance = cc.find("other/toggle2",layer);
        req.distance = distance.getComponent(cc.Toggle).isChecked?1:0;

        req.tname = "";

        var data = { 'c': MsgId.GAME_CREATEROOM};
        data.gameInfo = req;
        cc.vv.NetManager.send(data);
    },

    clearPengHu(){
        let layer = cc.find("img_bg/right_bg/penghu",this._createLayer);
        for(let i=1;i<4;++i){
            // 局数
            let round = cc.find("round/toggle"+i,layer);
            round.getComponent(cc.Toggle).isChecked = i===1;

            // 中庄
            let zhongzhuang = cc.find("zhongzhuang/toggle"+i,layer);
            zhongzhuang.getComponent(cc.Toggle).isChecked = i===1;

            // 积分
            let jifen = cc.find("score/toggle"+i,layer);
            jifen.getComponent(cc.Toggle).isChecked = i===1;

            if(i<3){
                let player_num = cc.find("player_num/toggle"+i,layer);
                player_num.getComponent(cc.Toggle).isChecked = i===1;

                let speed = cc.find("speed/toggle"+i,layer);
                speed.getComponent(cc.Toggle).isChecked = true;
            }
        }

        // 托管
        let trusteeship = cc.find("force/toggle1",layer);
        trusteeship.getComponent(cc.Toggle).isChecked = false;

        // 同IP
        let sameIp = cc.find("other/toggle1",layer);
        sameIp.getComponent(cc.Toggle).isChecked = true;

        // 托管
        let distance = cc.find("other/toggle2",layer);
        distance.getComponent(cc.Toggle).isChecked = false;

        // layer.getChildByName("input_name").getComponent(cc.EditBox).string = "";
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.ADDGAME, this.onRcvAddGameResult,false,this);
        if(this._createLayer){
            cc.loader.releaseRes("common/prefab/create_home_layer",cc.Prefab);
        }
    },
    // update (dt) {},
});
