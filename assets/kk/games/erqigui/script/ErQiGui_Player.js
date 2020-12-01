
cc.Class({
    extends: cc.Component,

    properties: {
        
        _playerNode:null,
        _chairId:-1,
        _seatIndex:-1,
        _UISeat:-1,
        _score:0,
        _emjoNode:null,
        _chatNode:null,
        _atlas:null,
    },

    init(index,playerNum,atlas){
        this._atlas = atlas;
        let playerNode = cc.find("scene/player"+index,this.node);
        playerNode.active = false;

        this._chairId = cc.vv.gameData.getLocalSeatByUISeat(index);
        this._UISeat = index;
        this._playerNode = playerNode;
        this.playerNum = playerNum;

        if(this._playerNode){
            this.registerMsg();
            let deskInfo = cc.vv.gameData.getDeskInfo();
            for(let i=0;i<deskInfo.users.length;++i){
                let chairId = cc.vv.gameData.getLocalChair(deskInfo.users[i].seat);
                if(chairId === this._chairId){
                    this._seatIndex = deskInfo.users[i].seat;
                    this.initPlayerInfo(deskInfo.users[i]);
                }
            }

            this._emjoNode = this._playerNode.getChildByName("emoj");
            this._emjoNode.active = false;

            this._chatNode = this._playerNode.getChildByName("chat");
            this._chatNode.active = false;

            // this.recvDeskInfoMsg();
        }
    },

    onRcvReadyNotice(data){
        data = data.detail;
        if(data.seat === this._seatIndex){
            this.showReady(true);
        }
    },

    showReady(bShow){
        if(this._playerNode) this._playerNode.getChildByName("ready").active = bShow;
    },

    registerMsg(){
        cc.vv.NetManager.registerMsg(MsgId.NOTICE_PLAYER_ENTER, this.onRcvPlayerComeNotice, this);
        cc.vv.NetManager.registerMsg(MsgId.NOTICE_PLAYER_EXIT, this.onRcvPlayerExitNotice, this);

        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.CHAT_NOTIFY,this.onRcvChatNotify,this);
        Global.registerEvent(EventId.READY_NOTIFY,this.onRcvReadyNotice,this);
        Global.registerEvent(EventId.OFFLINE_NOTIFY,this.onRcvOfflineNotice,this);

        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);

        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.HANDCARD,this.recvSendCard,this);
        Global.registerEvent(EventId.SCORE_UPDATE_NOTIFY,this.onRcvScoreUpdateNotify,this);
        Global.registerEvent(EventId.UPDATE_PLAYER_INFO,this.onRcvUpdatePlayerInfo,this);

        Global.registerEvent(EventId.ERQIGUI_JIAO_SCORE_NOTIFY,this.onRcvJiaoScoreNotify,this);
        Global.registerEvent(EventId.ERQIGUI_SELECT_COLOR_NOTIFY,this.onRcvSelectColorNotify,this);
        Global.registerEvent(EventId.ERQIGUI_MAI_CARD_NOTIFY,this.onRcvMaiCardNotify,this);
    },

    onRcvUpdatePlayerInfo(){
        let users = cc.vv.gameData.getUsers();
        let bHavePlayer = false;
        for(let i=0;i<users.length;++i){
            let chairId = cc.vv.gameData.getLocalChair(users[i].seat);
            if(chairId === this._chairId){
                bHavePlayer = true;
                if (!this._playerNode.active) {     //刷新显示
                    this._seatIndex = users[i].seat;
                    this.initPlayerInfo(users[i]);
                }
            }
        }
        if (!bHavePlayer && this._playerNode.active) {
            this._seatIndex = -1;
            this._playerNode.active = false;
        }
    },

    onRcvJiaoScoreNotify(data){
        data = data.detail;
        if (data.actionInfo.curaction.jiaoFen.curJiaoSeat === this._seatIndex) {
            this.setJiaoScore(data.actionInfo.curaction.jiaoFen.curJiaoFen);
        }
        if (data.actionInfo.curaction.jiaoFen.maxJiaoSeat === this._seatIndex && 2 == data.actionInfo.nextaction.type) {
            this.showBanker(true);
        }
    },

    setJiaoScore(score = 0){
        cc.find("mask_noJiaoScore", this._playerNode).active = (-1 == score);
        cc.find("text_jiaoScore", this._playerNode).getComponent(cc.Label).string = (0 < score && score < 210) ? score : "";
        cc.find("mask_jiaoZhao", this._playerNode).active = (210 == score);
    },

    onRcvSelectColorNotify(data){
        this.setJiaoScore();
    },

    onRcvMaiCardNotify(data){
        
    },

    onRcvScoreUpdateNotify(data){
        data = data.detail;
        for(let i=0;i<data.usersCoin.length;++i){
            if(data.usersCoin[i].seat === this._seatIndex){          
                this.setTotalScore(data.usersCoin[i].score);
                break;
            }
        }
    },

    onRcvOfflineNotice(data){
        data = data.detail;
        if(data.seat === this._seatIndex){
            this.showOffline(data.ofline === 1);
        }
    },


    recvRoundOver(data){
        data = data.detail;
        for(let i=0;i<data.users.length;++i){
            if(data.users[i].seat === this._seatIndex){          
                this.setTotalScore(data.users[i].score);
                break;
            }
        }
    },


    unregisterMsg(){
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_PLAYER_ENTER, this.onRcvPlayerComeNotice,false,this);
        cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_PLAYER_EXIT, this.onRcvPlayerExitNotice, false,this);
    },

    onRcvChatNotify(data){
        data = data.detail;
        if(data.code === 200){
            if(2 >= data.chatInfo.type && data.chatInfo.seat === this._seatIndex){
                if(data.chatInfo.type === 1){//表情
                    let list = Global.getEmjoList();
                    let index = list[data.chatInfo.index];
                    this._emjoNode.stopAllActions();
                    this._emjoNode.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame("penghu_onwer-prime-imgs-bq-biaoqing_"+index);
                    this._emjoNode.active = true;
                    this._emjoNode.y = 0;
                    let acts = [];
                    for(let i=0;i<6;++i){
                        acts.push(cc.moveTo(0.3,i%2==0?cc.v2(0,5):cc.v2(0,0)));
                    }
                    acts.push(cc.callFunc(()=>{
                        this._emjoNode.active = false;
                    }))
                    this._emjoNode.runAction(cc.sequence(acts));
                } else if(data.chatInfo.type === 2){
                    this._chatNode.active = true;
                    this._chatNode.stopAllActions();
                    let ShortList = Global.getShortListPaoDeKuai();
                    this._chatNode.getChildByName("label").getComponent(cc.Label).string = ShortList[data.chatInfo.index];
                    this._chatNode.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(()=>{
                        this._chatNode.active = false;
                    })))
                }
            } else if (3 == data.chatInfo.type && data.chatInfo.fromSeat === this._seatIndex) {
                let toLocalSeat = cc.vv.gameData.getLocalChair(data.chatInfo.toSeat);
                let toUISeat = cc.vv.gameData.getUISeatBylocalSeat(toLocalSeat);
                let toUIPlayer = this._playerNode.parent.getChildByName("player"+toUISeat);
                let moveByPos = cc.v2(toUIPlayer.position.x - this._playerNode.x, toUIPlayer.position.y - this._playerNode.y);

                let daoju = cc.instantiate(this._playerNode.getChildByName("icon_gold"));

                let prefabRes = this.node.getChildByName("prefabRes");
                let prefabIcon = prefabRes.getChildByName("dj_icon_"+(data.chatInfo.index));
                daoju.getComponent(cc.Sprite).spriteFrame  = prefabIcon.getComponent(cc.Sprite).spriteFrame;
                
                let ndoe_fly_icon = this._playerNode.parent.getChildByName("ndoe_fly_icon");
                daoju.parent = ndoe_fly_icon;
                let startPos = this._playerNode.position;
                daoju.position = startPos;
                daoju.active = true;
                let moveTime = 0.5;
                let delayTime = 0.1;
                if (12 === data.chatInfo.index) {   //飞刀加快
                    moveTime = 0.2;
                    moveByPos.x *= 0.9;
                    moveByPos.y *= 0.9;
                }
                if (9 === data.chatInfo.index) {   //机枪不显示
                    daoju.scaleX = 0;
                    moveTime = 0;
                    delayTime = 0;
                }
                let aniShowTime = [0, 1.25,1.31,1,1.15,1.27, 2.17,2.21,0.3,2.2,0.5, 1.24,0.5,1.07];
                let bHaveSound = [false, true,true,true,false,true, false,false,true,true,true, false,true,true];
                daoju.runAction(
                    cc.sequence(
                        cc.moveBy(moveTime, moveByPos),
                        cc.delayTime(delayTime),
                        cc.callFunc(()=>{
                            daoju.removeFromParent();
                            if (9 === data.chatInfo.index) {    //机枪角度调整
                                cc.loader.loadRes("common/daoju/9_gun",(err,prefab)=>{
                                    if(err === null){
                                        let daojuAni = cc.instantiate(prefab);
                                        daojuAni.position = startPos;
                                        daojuAni.parent = ndoe_fly_icon;

                                        let endToStarPosX = toUIPlayer.position.x-startPos.x;
                                        let endToStarPosY = toUIPlayer.position.y-startPos.y;
                                        daojuAni.rotation = - Math.atan2(endToStarPosY, endToStarPosX)/3.1415926*180;

                                        let jgq1_2 = daojuAni.getChildByName("jgq1_2");
                                        jgq1_2.getComponent(cc.Animation).play("jgq1_2");
                                        let jgq1_1 = daojuAni.getChildByName("jgq1_1");
                                        jgq1_1.getComponent(cc.Animation).play("animation0");
                                        let jgq_huo = daojuAni.getChildByName("jgq_huo");
                                        jgq_huo.getComponent(cc.Animation).play("play");

                                        daojuAni.runAction(
                                            cc.sequence(
                                                cc.delayTime(aniShowTime[data.chatInfo.index]),
                                                cc.callFunc(()=>{
                                                    daojuAni.removeFromParent();
                                                })
                                            )
                                        )
                                    }
                                });
                            }
                            cc.loader.loadRes("common/daoju/"+data.chatInfo.index,(err,prefab)=>{
                                if(err === null){
                                    let daojuAni = cc.instantiate(prefab);
                                    if (9 === data.chatInfo.index) {    //子弹方向和伸缩调整
                                        let endToStarPosX = startPos.x-toUIPlayer.position.x;
                                        let endToStarPosY = startPos.y-toUIPlayer.position.y;
                                        daojuAni.rotation = 180 - Math.atan2(endToStarPosY, endToStarPosX)/3.1415926*180;
                                        daojuAni.scaleX = Math.sqrt(Math.pow(Math.abs(endToStarPosX),2)+Math.pow(Math.abs(endToStarPosY),2))/600;
                                    }
                                    daojuAni.position = toUIPlayer.position;
                                    daojuAni.parent = ndoe_fly_icon;
                                    daojuAni.getComponent(cc.Animation).play("play");
                                    if (bHaveSound[data.chatInfo.index]) {
                                        cc.vv.AudioManager.playEff("", "daoju/"+data.chatInfo.index,true);
                                    }
                                    daojuAni.runAction(
                                        cc.sequence(
                                            cc.delayTime(aniShowTime[data.chatInfo.index]),
                                            cc.callFunc(()=>{
                                                daojuAni.removeFromParent();
                                            })
                                        )
                                    )
                                }
                            })
                        })
                    )
                )
            }
        }
    },

    getSex(seat){
        let user = cc.vv.gameData.getUserInfo(seat);
        if(user){
            if(user.sex === 1) return "nan/";
            else  return "nv/";
        }
    },

    recvDeskInfoMsg(){
        let deskInfo = cc.vv.gameData.getDeskInfo();
        if(deskInfo.isReconnect){
            for(let i=0;i<deskInfo.users.length;++i){
                if(this._seatIndex === deskInfo.users[i].seat){
                    this.initPlayerInfo(deskInfo.users[i]);
                }
            }
        }
    },

    onRcvPlayerExitNotice(msg){
        if(msg.code === 200){
            let chairId = cc.vv.gameData.getLocalChair(msg.seat);
            if(chairId === this._chairId){
                this._seatIndex = -1;
                if(this._playerNode) {
                    this._playerNode.active = false;
                    cc.vv.AudioManager.playEff("paodekuai/", "userleave",true);
                }
            }
        }
    },

    onRcvPlayerComeNotice(msg){
        if(msg.code === 200){
            let chairId = cc.vv.gameData.getLocalChair(msg.user.seat);
            if(chairId === this._chairId){
                this.initPlayerInfo(msg.user);
                this._seatIndex = msg.user.seat;
            }
        }
    },

    initPlayerInfo(user){
        if(user){
            let spr_head = cc.find("head/radio_mask/spr_head",this._playerNode);
            Global.setHead(spr_head,user.usericon);
            cc.find("txt_name",this._playerNode).getComponent(cc.Label).string = user.playername;
            this.setTotalScore(user.score);
            this.showOffline(user.ofline===1);
            this._playerNode.active = true;
            this.showReady(user.state === 1);

            this.setJiaoScore();
            let deskInfo = cc.vv.gameData.getDeskInfo();
            if (3 > deskInfo.actionInfo.nextaction.type) {
                for (let i = 0; i < deskInfo.jiaoFenRecord.length; i++) {
                    if (deskInfo.jiaoFenRecord[i].seat == this._seatIndex) {
                        this.setJiaoScore(deskInfo.jiaoFenRecord[i].fen);
                        break;
                    }
                }
            }
            if (2 <= deskInfo.actionInfo.nextaction.type) {
                this.showBanker(user.uid == deskInfo.actionInfo.curaction.jiaoFen.maxJiaoUid);
            } else {
                this.showBanker(false);
            }
        }
    },

    showOffline(bShow){
        if(this._playerNode) this._playerNode.getChildByName("img_off_line").active = bShow;
    },

    // 总分
    setTotalScore(score){
        if (typeof score != 'undefined' && this._playerNode) {
            cc.find("txt_total_score",this._playerNode).getComponent(cc.Label).string = score;
        }
    },

    // 显示庄家
    showBanker(bShow){
        this._playerNode.getChildByName("mask_banker").active = bShow;
    },

    recvSendCard(){
        this.showReady(false);
    },

    start () {

    },

    clearDesk(){
        this.showBanker(false);
    },

    onDestroy(){
        if(this._playerNode) this.unregisterMsg();
    }
    // update (dt) {},
});
