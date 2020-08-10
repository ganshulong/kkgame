
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
            let users = cc.vv.gameData.getUsers();
            for(let i=0;i<users.length;++i){
                let chairId = cc.vv.gameData.getLocalChair(users[i].seat);
                if(chairId === this._chairId){
                    this._seatIndex = users[i].seat;
                    this.initPlayerInfo(users[i]);

                }
            }
            this._emjoNode = this._playerNode.getChildByName("emoj");
            this._emjoNode.active = false;

            this._chatNode = this._playerNode.getChildByName("chat");
            this._chatNode.active = false;

            this.recvDeskInfoMsg();
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
            if(data.chatInfo.seat === this._seatIndex){
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
                }
                else{
                    this._chatNode.active = true;
                    this._chatNode.stopAllActions();
                    let ShortList = Global.getShortList();
                    this._chatNode.getChildByName("label").getComponent(cc.Label).string = ShortList[data.chatInfo.index];
                    this._chatNode.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(()=>{
                        this._chatNode.active = false;
                    })))
                }
            }
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
            this.showMaster(user.uid == cc.vv.gameData.getRoomConf().createUserInfo.uid);
            this.showReady(user.state === 1);
        }
    },

    showOffline(bShow){
        if(this._playerNode) this._playerNode.getChildByName("img_off_line").active = bShow;
    },

    // 总分
    setTotalScore(score){
        if (typeof score != 'undefined') {
            if(this._playerNode)  cc.find("bg_score/txt_total_score",this._playerNode).getComponent(cc.Label).string = score;
        }
    },

    // 显示房主
    showMaster(bShow){
        this._playerNode.getChildByName("mask_master").active = bShow;
    },

    recvSendCard(){
        this.showReady(false);
    },

    start () {

    },

    clearDesk(){
    },

    onDestroy(){
        if(this._playerNode) this.unregisterMsg();
    }
    // update (dt) {},
});
