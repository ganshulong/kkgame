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
        _playerNode:null,
        _chairId:-1,
        _seatIndex:-1,
        _score:0,
        _emjoNode:null,
        _chatNode:null,
        _atlas:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init(index,playerNum,atlas){
        this._atlas = atlas;
        let playerNode = cc.find("scene/player"+index,this.node);
        playerNode.active = false;
        this._playerNode = playerNode;
        this._chairId = index;

        if(this._playerNode){
            this.registerMsg();
            let deskInfo = cc.vv.gameData.getDeskInfo();
            for(let i=0;i<deskInfo.users.length;++i){
                let chairId = cc.vv.gameData.getLocalChair(deskInfo.users[i].seat);
                if(chairId === this._chairId){
                    this._seatIndex = deskInfo.users[i].seat;
                    this.initPlayerInfo(deskInfo.users[i]);
                    if(deskInfo.isReconnect){
                        this.showZhuang(deskInfo.bankerInfo.seat === this._seatIndex, deskInfo.bankerInfo.count);
                    }
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

        Global.registerEvent(EventId.HANDCARD,this.onRecvHandCard,this);
        Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO,this.recvDeskInfoMsg,this);
        Global.registerEvent(EventId.CHAT_NOTIFY,this.onRcvChatNotify,this);
        Global.registerEvent(EventId.READY_NOTIFY,this.onRcvReadyNotice,this);
        Global.registerEvent(EventId.OFFLINE_NOTIFY,this.onRcvOfflineNotice,this);
        Global.registerEvent(EventId.OUTCARD_NOTIFY,this.onRcvOutCardNotify,this);

        Global.registerEvent(EventId.CHI_NOTIFY,this.updateScore,this);
        Global.registerEvent(EventId.KAN_NOTIFY,this.updateScore,this);
        Global.registerEvent(EventId.PENG_NOTIFY,this.updateScore,this);
        Global.registerEvent(EventId.PAO_NOTIFY,this.updateScore,this);
        Global.registerEvent(EventId.LONG_NOTIFY,this.updateScore,this);
        Global.registerEvent(EventId.HANDCARD,this.updateScore,this);
        Global.registerEvent(EventId.HU_NOTIFY,this.recvRoundOver,this);
        Global.registerEvent(EventId.UPDATE_PLAYER_INFO,this.onRcvUpdatePlayerInfo,this);
        Global.registerEvent(EventId.TRUSTEE_NOTIFY,this.onRcvTrusteeNotify,this);
        Global.registerEvent(EventId.CANCEL_TRUSTEE_NOTIFY,this.onRcvCancelTrusteeNotify,this);
        Global.registerEvent(EventId.GAME_CONTINUE_NOTIFY,this.onRcvGameContinueNotify,this);
    },

    onRcvGameContinueNotify(){
        this.setTotalScore(0);
    },

    onRcvCancelTrusteeNotify(data){
        data = data.detail;
        if(data.seat === this._seatIndex){
            this._playerNode.getChildByName("mask_trustee").active = false;
            if (0 == this._chairId) {
                cc.find("scene/panel_trustee", this.node).active = false;
            }
        }
    },

    onRcvTrusteeNotify(data){
        data = data.detail;
        if(data.seat === this._seatIndex){
            this._playerNode.getChildByName("mask_trustee").active = true;
            if (0 == this._chairId) {
                cc.find("scene/panel_trustee", this.node).active = true;
            }
        }
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
                let deskInfo = cc.vv.gameData.getDeskInfo();
                this.showZhuang(deskInfo.bankerInfo.seat === this._seatIndex, deskInfo.bankerInfo.count);
            }
        }
        if (!bHavePlayer && this._playerNode.active) {
            this._seatIndex = -1;
            this._playerNode.active = false;
        }
    },

    onRcvOutCardNotify(data){
        data = data.detail;
        if(data.seat === this._seatIndex){
            if (0 < data.isBaoJin) {
                let self = this;
                this._playerNode.runAction(
                    cc.sequence(
                        cc.delayTime(1),
                        cc.callFunc(()=>{
                            self._playerNode.getChildByName("ani_warn").active = true;
                        })
                    )
                )
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
        let self = this;
        this._playerNode.runAction(
            cc.sequence(
                cc.delayTime(1.5),
                cc.callFunc(()=>{
                    self._playerNode.getChildByName("ani_warn").active = false;
                })
            )
        )
        data = data.detail;
        for(let i=0;i<data.users.length;++i){
            if(data.users[i].seat === this._seatIndex){
                this.setTotalScore(data.users[i].score);
                this.setHuXi(data.users[i].roundHuXi);
                if (data.seat === this._seatIndex && 0 < data.hupaiType) {
                    let ani_huPai = this._playerNode.getChildByName("ani_huPai");
                    ani_huPai.active = true;
                    ani_huPai.scale = 0;
                    ani_huPai.runAction(
                        cc.sequence(
                            cc.scaleTo(0.5,1.2,1.2),
                            cc.scaleTo(0.1,1,1),
                            cc.delayTime(1.4),
                            cc.callFunc(()=>{
                                self._playerNode.getChildByName("ani_huPai").active = false;
                            })
                        )
                    )
                }
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
                    let ShortList = Global.getShortList();
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

    updateScore(data){
        if(this._playerNode){
            data = data.detail;
            if (data.seat === this._seatIndex) {
                if (MsgId.SENDCARD != data.c) {
                    this.setHuXi(data.huxi);
                }
            }
            // let list = data.notyScoreChang;
            // for(let i=0;i<list.length;++i){
                // if(list[i].seat === this._seatIndex){
                    // this.setHuXi(list[i].roundScore);
                    // if (0 > list[i].changeScore) {   
                    //     //该玩家输了，金币飞向其他人
                    //     let toServerSeat = 0;
                    //     for (let j = 0; j < list.length; j++) {
                    //         if (0 < list[j].changeScore) {
                    //             toServerSeat = list[j].seat;
                    //             break;
                    //         }
                    //     }
                    //     this.showFlyIcon(toServerSeat, -list[i].changeScore);
                    // }
                // }
            // }
        }
    },

    // showFlyIcon(toServerSeat,iconNum){
    //     if (0 < toServerSeat && 0 < iconNum) {
    //         let toLocalSeat = cc.vv.gameData.getLocalChair(toServerSeat);
    //         let toUISeat = cc.vv.gameData.getUISeatBylocalSeat(toLocalSeat);
    //         let toUIPlayerPos = this._playerNode.parent.getChildByName("player"+toUISeat).position;
    //         let moveByPos = cc.v2(toUIPlayerPos.x - this._playerNode.x, toUIPlayerPos.y - this._playerNode.y);
    //         for (var j = 0; j < iconNum; j++) {
    //             let icon = cc.instantiate(this._playerNode.getChildByName("icon_gold"));
    //             icon.parent = this._playerNode.parent.getChildByName("ndoe_fly_icon");
    //             icon.position = this._playerNode.position;
    //             icon.active = true;
    //             icon.runAction(
    //                 cc.sequence(
    //                     cc.delayTime(j * 0.1), 
    //                     cc.moveBy(0.6, moveByPos),
    //                     cc.callFunc(()=>{
    //                         Global.playEff(Global.SOUNDS.fly_icon);
    //                     }),
    //                     cc.delayTime(0.2), 
    //                     cc.callFunc(()=>{
    //                         icon.removeFromParent();
    //                     })
    //                 )
    //             )
    //         }
    //     }
    // },

    recvDeskInfoMsg(){
        let deskInfo = cc.vv.gameData.getDeskInfo();
        if(deskInfo.isReconnect){
            for(let i=0;i<deskInfo.users.length;++i){
                if(this._seatIndex === deskInfo.users[i].seat){
                    this.initPlayerInfo(deskInfo.users[i]);
                    this.showZhuang(deskInfo.bankerInfo.seat === this._seatIndex, deskInfo.bankerInfo.count);
                }
            }
        }
    },
    onRecvHandCard(data){
        let bankInfo = data.detail.bankerInfo;
        if(bankInfo.seat === this._seatIndex) {
            this.showZhuang(true);
        }
    },

    onRcvPlayerExitNotice(msg){
        if(msg.code === 200){
            let chairId = cc.vv.gameData.getLocalChair(msg.seat);
            if(chairId === this._chairId){
                this._seatIndex = -1;
                if(this._playerNode){
                    this._playerNode.active = false;

                    let uiSeat = cc.vv.gameData.getUISeatBylocalSeat(this._chairId);
                    let out_cards = this._playerNode.parent.getChildByName("out_cards");
                    out_cards.getChildByName("out_card"+uiSeat).removeAllChildren();
                    out_cards.getChildByName("operate_card"+uiSeat).removeAllChildren();
                    out_cards.getChildByName("show_card"+uiSeat).active = false;
                    if (uiSeat) {
                        let playback_handle = this._playerNode.parent.getChildByName("playback_handle");
                        playback_handle.getChildByName("player"+uiSeat).removeAllChildren();
                    }
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
            cc.find("img_bg/txt_name",this._playerNode).getComponent(cc.Label).string = user.playername;
            this.setTotalScore(user.score);
            this.showOffline(user.ofline===1);
            this._playerNode.active = true;
            this.showZhuang(false);
            this.setHuXi(user.roundHuXi?user.roundHuXi:0);
            this.showReady(user.state === 1);
            this._playerNode.getChildByName("ani_warn").active = (0 < user.isBaoJin);
            this._playerNode.getChildByName("ani_huPai").active = false;
            this._playerNode.getChildByName("mask_trustee").active = (0 < user.autoc);
            if (0 == this._chairId) {
                cc.find("scene/panel_trustee", this.node).active = (0 < user.autoc);
            }
        }
    },

    showOffline(bShow){
        if(this._playerNode) this._playerNode.getChildByName("img_off_line").active = bShow;
    },

    // 胡熄
    setHuXi(score){
        if (typeof score != 'undefined') {
            if(this._playerNode) this._playerNode.getChildByName("txt_cur_score").getComponent(cc.Label).string =score+"硬息";
        }
    },

    // 总分
    setTotalScore(score){
        if (typeof score != 'undefined') {
            if(this._playerNode)  cc.find("img_bg/txt_total_score",this._playerNode).getComponent(cc.Label).string = "分数:"+score.toFixed(2);
        }
    },

    // 显示庄
    showZhuang(bShow, count = 1){
        if(this._playerNode) {
            this._playerNode.getChildByName("sp_flag").active = bShow;
            if (bShow && count) {
                cc.find("sp_flag/zhaung1",this._playerNode).active = (1 == count);
            }
        }
    },

    recvSendCard(){
        this.showReady(false);
    },

    start () {
        Global.registerEvent(EventId.CLEARDESK,this.clearDesk,this);
        Global.registerEvent(EventId.HANDCARD,this.recvSendCard,this);

    },

    clearDesk(){
        this.setHuXi(0);
        this.showZhuang(false);
    },

    onDestroy(){
        if(this._playerNode) this.unregisterMsg();
    }
    // update (dt) {},
});
