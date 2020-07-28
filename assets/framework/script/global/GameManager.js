/*
** 游戏管理
** 负责处理全局消息
** 负责退出进程等接口
*/

cc.Class({
    extends: cc.Component,
    statics: {
        _interval_id: null,
        _showExit: false,        // 防止多次弹出退出框
        _inGameServer:false,     // 用于判断是否需要重连

        init: function () {
            //设置模式
            if (Global.localVersion) {
                cc._initDebugSetting(cc.DebugMode.INFO);
                window.LogMode = cc.DebugMode.INFO;
            } else {
                cc._initDebugSetting(cc.DebugMode.WARN);
                window.LogMode = cc.DebugMode.WARN;
            }

            // 安卓物理返回键:统一改成杀掉游戏进程
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
                if ((event.keyCode == cc.KEY.back || event.keyCode == cc.KEY.escape)) {
                    let curScene = cc.director.getScene();
                    if (curScene.name !== "slot_loading" && curScene.name !== "hall_pre_loading") {
                        let str = cc.vv.Language.ask_exit;
                        if (!this._showExit) {
                            this._showExit = true;
                            cc.vv.AlertView.show(str, () => {
                                if (Global.appId === Global.APPID.BigBang) {
                                    if (cc.vv.gameData) cc.vv.gameData.requestExit();
                                    else {
                                        if (curScene.name === "login") cc.game.end();
                                        else if (curScene.name === "lobby") cc.vv.SceneMgr.enterScene("login");
                                        else if (curScene.name !== "hotupdate") cc.vv.SceneMgr.enterScene("lobby");
                                        else cc.game.end();
                                    }
                                    this._showExit = false;
                                } else {
                                    cc.game.end();
                                }
                            }, () => {
                                this._showExit = false;
                            });
                        }
                    }
                }
            });

            // 注册全局消息
            this.registerAllMsg();
        },

        // 清理账号密码
        clearLocalSaveAccout(){
            cc.sys.localStorage.removeItem("account");
            cc.sys.localStorage.removeItem("passwd");
        },

        setInGameServer(bEnable){
            this._inGameServer = bEnable;
        },

        // 检查保存的账号是否是手机
        checkIsPhone(isPhoneNum){
            let account = cc.sys.localStorage.getItem("account");
            if(isPhoneNum && Global.checkNum(account)){

            }
            else {
                this.clearLocalSaveAccout();
            }
        },

        registerAllMsg: function () {
            //进入大厅
            cc.vv.EventManager.on(EventId.ENTER_HALL, this.onRcvEnterHall, this);
            //进入游戏
            cc.vv.NetManager.registerMsg(MsgId.GAME_ENTER_MATCH, this.onRcvNetEnterGame, this);

            //登录获取节点服
            cc.vv.NetManager.registerMsg(MsgId.LOGIN, this.onRcvMsgLogin, this);
            //用户登录节点服
            cc.vv.NetManager.registerMsg(MsgId.LOGIN_USERID, this.onRcvMsgLoginUserId, this);
            //用户重新登录节点服
            cc.vv.NetManager.registerMsg(MsgId.RELOGIN_USERID, this.onRcvMsgLoginUserId, this);
            //登出游戏
            cc.vv.NetManager.registerMsg(MsgId.LOGIN_OUT, this.onRcvMsgLoginout, this);
            //创建房间
            cc.vv.NetManager.registerMsg(MsgId.GAME_CREATEROOM, this.onRecNetCreateOrJoinRoom, this);
            //加入房间
            cc.vv.NetManager.registerMsg(MsgId.GAME_JOINROOM, this.onRecNetCreateOrJoinRoom, this);
            //游戏断线重连房间信息
            cc.vv.NetManager.registerMsg(MsgId.GAME_RECONNECT_DESKINFO, this.onRecNetCreateOrJoinRoom, this);
            //异地登录
            cc.vv.NetManager.registerMsg(MsgId.GAME_REMOTE_LOGIN, this.onRecNetRemoteLogin, this);
            //房间解散踢人，T回大厅
            cc.vv.NetManager.registerMsg(MsgId.NOTIFY_SYS_KICK_HALL, this.onRcvNetTickHallNotice, this);
            //踢人，T回登录界面
            cc.vv.NetManager.registerMsg(MsgId.NOTIFY_SYS_KICK_LOGIN, this.onRcvNetSysKickNotice, this);
            //App需要重启，可能是强更
            cc.vv.NetManager.registerMsg(MsgId.GAME_NEED_RESTART, this.onRcvNetGameRestarNotice, this);

            //财富改变（金币改变）
            cc.vv.NetManager.registerMsg(MsgId.MONEY_CHANGED, this.onRcvNetMoneyChanged, this);
            //主动同步金币
            cc.vv.NetManager.registerMsg(MsgId.SYNC_COIN, this.onRcvNetSyncMoney, this);
            //同步玩家信息
            cc.vv.NetManager.registerMsg(MsgId.SYNC_PLAYER_INFO, this.onRcvNetSyncPlayerInfo, this);
            //幸运红包变化
            cc.vv.NetManager.registerMsg(MsgId.REQ_REDPACK, this.onRcvRedPackInfo, this)

            cc.vv.NetManager.registerMsg(MsgId.NOTIFY_SYS_MAINTENANCE, this.onRcvMaintenance, this)

            //邮件完成通知，随时监听
            cc.vv.NetManager.registerMsg(MsgId.TASK_FINISH_NOTICE, this.onRcvNetTaskFinishNotice, this);

            cc.vv.NetManager.registerMsg(MsgId.NOTICE_JOINCLUB, this.onRcvJoinClub, this);

            cc.vv.NetManager.registerMsg(MsgId.SELF_GPS_DATA, this.onRcvSelfGpsData, this);

            cc.vv.NetManager.registerMsg(MsgId.FREEZE_CLUB_NOTIFY, this.onRcvFreezeClubNotify, this);
            cc.vv.NetManager.registerMsg(MsgId.DISMISS_CLUB_NOTIFY, this.onRcvDismissClubNotify, this);

            cc.vv.NetManager.registerMsg(MsgId.CLUB_EXIT_APPLY_NOTIFY, this.onRcvClubExitApplyNotify, this);
        
            cc.game.on(cc.game.EVENT_HIDE, this.onBackGround, this);
        },

        onRcvClubExitApplyNotify(msg){
            if(msg.code === 200){
                cc.vv.UserManager.setClubExitApplyState(msg.clubid, 1);
                Global.dispatchEvent(EventId.CLUB_EXIT_APPLY_NOTIFY, {clubid:msg.clubid, isShow:true});
            }
        },

        onRcvFreezeClubNotify(msg){
            if(msg.code === 200){
                cc.vv.UserManager.setClubFreezeState(msg.response.clubid, msg.response.state);
                Global.dispatchEvent(EventId.FREEZE_CLUB_NOTIFY, msg.response);
            }
        },

        onRcvDismissClubNotify(msg){
            if(msg.code === 200){
                cc.vv.UserManager.dismissExitCurClub();
                Global.dispatchEvent(EventId.DISMISS_CLUB_NOTIFY, msg.response);
            }
        },

        onRcvSelfGpsData(msg){
            if(msg.code === 200){
                Global.dispatchEvent(EventId.SELF_GPS_DATA, msg);
            }
        },

        onRcvJoinClub(msg){
            if(msg.code === 200){
                cc.vv.UserManager.clubs =msg.response.clubList;
                cc.vv.FloatTip.show("您申请加入亲友圈已经通过!");
                Global.dispatchEvent(EventId.UPDATE_CLUBS);
            }
        },

        // 系统维护公告
        onRcvMaintenance(msgDic){
            if(msgDic.code === 200){
                cc.vv.AlertView.showTips(msgDic.notices.msg);
            }
        },
        onBackGround: function () {
            AppLog.warn("游戏进入后台");
            Global.playerData.bank_token = null; //进入后台，清除银行token，防止其他人拿手机可以操作银行
        },

        onEnterFront: function () {
            //进去前台就断线重连
            cc.log('游戏进入前台!');
            Global.dispatchEvent(EventId.ENTER_FRONT);
            if (this._inGameServer) {
                this.reqReLogin();
            }
        },

        //重走登录服
        reqReLogin: function () {
            let self = this;

            let preLoginStr = Global.getLocal(Global.SAVE_KEY_REQ_LOGIN, '');
            if (preLoginStr) {
                cc.vv.NetManager.connect(Global.loginServerAddress, function () {
                    let reloginData = JSON.parse(preLoginStr);
                    reloginData.uid = Global.playerData.uid;
                    reloginData.token = Global.playerData.token;
                    reloginData.LoginExData = Global.LoginExData.reloginAction;
                    if(reloginData.t === Global.LoginType.REGISTER){
                        reloginData.t = Global.LoginType.ACCOUNT;
                    }
                    if(reloginData.t === Global.LoginType.WXFIRST){
                        reloginData.t = Global.LoginType.WX;
                    }
                    let historyOpenid = cc.sys.localStorage.getItem("openid");
                    if (historyOpenid && historyOpenid.length > 0){
                        reloginData.user = historyOpenid;
                    }
                    cc.vv.NetManager.send(reloginData);
                    //清除超时连接
                    cc.vv.UserManager.setLoginType(reloginData.t);
                    Global.saveLocal('account', reloginData.user);
                });
            } else {
                let sureCall = function () {
                    self.goBackLoginScene()
                }
                cc.vv.AlertView.showTips(cc.vv.Language.go_back_login, sureCall)
            }
        },

        //登录界面构造登录消息
        reqLogin: function (nickname, pwd, loginType, accesstoken, loginExData, token, code = "",email="") {
            cc.vv.NetManager.connect(Global.loginServerAddress, function () {
                let req = {c: MsgId.LOGIN};
                req.user = nickname;
                req.passwd = pwd;
                req.email = email;
                req.v = Global.resVersion;
                if (Global.isNative()) {
                    req.av = cc.vv.PlatformApiMgr.getAppVersion();
                }
                let _loginExData = loginExData || Global.LoginExData.reloginAction
                req.t = loginType; //1随机 2 微信 3fb
                req.accessToken = accesstoken;
                req.platform = cc.sys.os;
                req.code = code;

                req.invitcode = Global.invitcode;

                let bOpenApi = false
                if (cc.vv.UserManager.getLoginType() == Global.LoginType.APILOGIN) {
                    bOpenApi = true
                }
                if (bOpenApi && Global.openAPIModel) {
                    //开放平台登陆就需要添加额外的参数
                    let apiGameid = cc.vv.UserManager.getApiGameId()
                    req.gameid = apiGameid
                    let apiSign = cc.vv.UserManager.getApiSign()
                    req.signstr = apiSign
                }

                cc.vv.UserManager.setLoginType(loginType);
                req.token = token || Global.playerData.token;
                req.bwss = 0;
                req.LoginExData = _loginExData
                let languageType = 1 //上传语言类型
                if (Global.language == 'en') {
                    languageType = 2
                }
                req.language = languageType
                req.client_uuid = Global.getLocal('client_uuid', ''); //用来记录是当前客户端
                if (Global.isUserWSS()) {
                    req.bwss = 1
                }
                cc.vv.NetManager.send(req);
                console.log('个性化 req: ' + JSON.stringify(req));
                cc.log('保存登陆数据');
                Global.saveLocal(Global.SAVE_KEY_REQ_LOGIN, JSON.stringify(req));
                Global.saveLocal('account', nickname);

            })
        },


        //返回登陆场景
        goBackLoginScene: function (autoLogin = true) {
            if(cc.vv.gameData) cc.vv.gameData.clear();
            cc.vv.UserManager.setIsAutoLogin(autoLogin);
            this._inGameServer = false;
            Global.dispatchEvent(EventId.STOP_ACTION);
            cc.vv.NetManager.close();
            cc.vv.SceneMgr.enterScene("login");
            cc.vv.GameManager.setInGameServer(false);
        },

        //用户登出
        onRcvMsgLoginout: function (msgDic) {
            if (msgDic.code === 200) {
                this.goBackLoginScene()
            }
        },

        //进入大厅
        onRcvEnterHall: function (dic) {
            let currSceneName = cc.director.getScene().name;
            // 在大厅，二级大厅
            if (currSceneName !== "lobby") {
                cc.vv.SceneMgr.enterScene('lobby', function () {
                    cc.log('进去大厅');
                });
            }
        },

        //游戏是否开放
        isOpenOfGameId: function (gameid) {
            let gamelist = Global.playerData.gameList;
            if (gamelist) {
                for (let i = 0; i < gamelist.length; i++) {
                    if (gamelist[i].id == gameid) {
                        return gamelist[i].status == 1; //1开启
                    }
                }
            }
            return true;
        },

        onRcvMsgLogin: function (msgDic) {
            let self = this
            cc.log("@@@@@@@@ " + JSON.stringify(msgDic));
            cc.warn("@@@@@@@@ " + JSON.stringify(msgDic));
            if (msgDic.code === 200) {
                //下发新的服务器地址
                let gameServer = msgDic.net
                let uid = msgDic.uid
                let server = msgDic.server
                let subid = msgDic.subid
                let token = msgDic.token
                Global.openid = msgDic.openid;
                Global.shareLink = msgDic.shareLink;
                Global.iconUrl = msgDic.iconUrl;

                cc.sys.localStorage.setItem("account",msgDic.account);
                cc.sys.localStorage.setItem("passwd",msgDic.passwd);

                //首次拉起微信的登录，才有这个值
                let openid = msgDic.openid;
                if (openid && openid.length > 0) {
                    cc.sys.localStorage.setItem("openid", openid);
                }

                //首次登陆下发的信息
                cc.vv.UserManager.initLoginServer(msgDic)
                cc.vv.NetManager.close();
                cc.vv.NetManager.connect(gameServer, function () {
                    let req = {'c': MsgId.LOGIN_USERID}
                    req.uid = uid
                    req.openid = ""
                    req.server = server
                    req.subid = subid
                    req.token = token
                    req.deviceid = Global.getDeviceId()
                    cc.vv.NetManager.send(req)
                })
            } else {
                Global.deleteLocal(Global.SAVE_KEY_REQ_LOGIN);
            }
        },

        onRcvMsgLoginUserId: function (msgDic) {
            if (msgDic.code === 200) {
                cc.vv.UserManager.initPlayerData(msgDic)
                cc.vv.UserManager.setIsAutoLogin(true);
                Global.dispatchEvent(EventId.ENTER_LOGIN_SUCCESS, msgDic);
                let loginType = cc.vv.UserManager.getLoginType();
                this._inGameServer = true;
                // //登录成功后，将user字段替换成palyername
                // if (msgDic.playerInfo && loginType == Global.LoginType.WX) {
                //     let reloginData = JSON.parse(Global.getLocal(Global.SAVE_KEY_REQ_LOGIN, ''));
                //     reloginData.user = cc.vv.WxMgr.getWXToken()
                //     Global.saveLocal(Global.SAVE_KEY_REQ_LOGIN, JSON.stringify(reloginData));
                // }


                //游戏断线重连
                if (msgDic.deskFlag == 1) {

                    if ( !Global.isNative() || !Global.openUpdate || (Global.isNative() &&
                            cc.vv.SubGameUpdateNode.getComponent("SubGameUpdate").isDownLoadSubGame(msgDic.deskInfo.conf.gameid)) ||
                        msgDic.deskInfo.conf.gameid===1 || msgDic.deskInfo.conf.gameid===2) {
                        msgDic.deskInfo.isReconnect = true;
                        cc.vv.NetManager.dispatchNetMsg({
                            c: MsgId.GAME_RECONNECT_DESKINFO,
                            code: Global.ERROR_CODE.NORMAL,
                            deskInfo: msgDic.deskInfo
                        });

                    } else {
                        // 断线重连如果在游戏中，游戏没有下载，自动退出房间.
                        let req = {c: MsgId.GAME_LEVELROOM};
                        req.deskid = this._gameId;
                        cc.vv.NetManager.send(req);
                        cc.vv.EventManager.emit(EventId.ENTER_HALL);
                        // let gameName = Global.SUBGAME[msgDic.deskInfo.gameid].title;
                        // cc.vv.AlertView.showTips(cc.js.formatStr(cc.vv.Language.cannot_entergame, gameName, gameName));
                    }

                } else {//进入大厅
                    if (loginType == Global.LoginType.APILOGIN) {
                        //api调用 登陆成功后 直接进入游戏
                        let nId = cc.vv.UserManager.getApiGameId()
                        this.sendEnterGameReq(nId)
                    } else {
                        if (cc.vv.SceneMgr.isInLoginScene()) {
                            //在登录界面，预加载下资源
                            cc.vv.SceneMgr.enterScene('lobby');
                        } else {
                            cc.vv.EventManager.emit(EventId.ENTER_HALL);
                        }
                    }


                    //cc.vv.EventManager.emit(EventId.ENTER_LOGIN_SUCCESS); 
                }
            }
        },

        //创建房间或者加入房间
        onRecNetCreateOrJoinRoom: function (msgDic) {
            if (msgDic.code == 200) {
                if(msgDic.deskInfo.conf.gameid === 1 || msgDic.deskInfo.conf.gameid === 3){
                    if(cc.vv.gameData === null){
                        let data = require("PengHu_GameData");
                        cc.vv.gameData = new data();
                        cc.vv.gameData.init(msgDic.deskInfo);
                        cc.vv.SceneMgr.enterScene("penghu");
                    }
                } else if(msgDic.deskInfo.conf.gameid === 2 || msgDic.deskInfo.conf.gameid === 4){
                    if(cc.vv.gameData === null){
                        let data = require("PaoHuZi_GameData");
                        cc.vv.gameData = new data();
                        cc.vv.gameData.init(msgDic.deskInfo);
                        cc.vv.SceneMgr.enterScene("paohuzi");
                    }
                } else if(msgDic.deskInfo.conf.gameid === 5 || msgDic.deskInfo.conf.gameid === 6){
                    if(cc.vv.gameData === null){
                        let data = require("HongHeiHu_GameData");
                        cc.vv.gameData = new data();
                        cc.vv.gameData.init(msgDic.deskInfo);
                        cc.vv.SceneMgr.enterScene("hongheihu");
                    }
                } else if(msgDic.deskInfo.conf.gameid === 7 || msgDic.deskInfo.conf.gameid === 8){
                    if(cc.vv.gameData === null){
                        let data = require("LiuHuQiang_GameData");
                        cc.vv.gameData = new data();
                        cc.vv.gameData.init(msgDic.deskInfo);
                        cc.vv.SceneMgr.enterScene("liuhuqiang");
                    }
                }
            }

        },

        //收到系统强制解散房间
        onRecNetDimissRoomBySystem: function (msgDic) {
            if (msgDic.code === 200) {
                let callback = function () {
                    cc.vv.EventManager.emit(EventId.ENTER_HALL);
                }
                cc.vv.AlertView.showTips(cc.vv.Language.dissolve_room, callback)
            }
        },

        //异地登录
        onRecNetRemoteLogin: function (msgDic) {
            cc.vv.NetManager.close(null, false);
            cc.vv.AlertView.showTips(cc.vv.Language.acc_online, function () {
                this.goBackLoginScene()
            }.bind(this));
        },

        onRcvNetSysKickNotice: function (msgDic) {
            cc.vv.NetManager.close(null, false);
            if (cc.vv.gameData) {
                cc.vv.gameData.onExit();
                cc.vv.gameData = null;
            }
            this.goBackLoginScene();
            cc.vv.AlertView.showTips(msgDic.msg);
        },

        loadLoginScene() {

        },

        //财富变化
        onRcvNetMoneyChanged: function (msgDic) {
            if (msgDic.code === 200) {
                if(msgDic.uid === cc.vv.UserManager.uid){
                    Global.playerData.coin = msgDic.coin;
                    if (msgDic.count > 0 && msgDic.type === 1) cc.vv.AlertView.showTips(cc.js.formatStr(cc.vv.Language.add_score_succ, Global.S2P(msgDic.count)), () => {
                    });
                }
                Global.dispatchEvent(EventId.RECHARGE_SUCC,msgDic);
            }
        },

        //主动同步金币
        onRcvNetSyncMoney: function (msgDic) {
            if (msgDic.code === 200) {
                Global.playerData.coin = msgDic.coin;
                Global.dispatchEvent(EventId.RECHARGE_SUCC,msgDic);
            }
        },

        onRcvNetSyncPlayerInfo: function (msgDic) {
            if (msgDic.code === 200) {
                if (msgDic.playerInfo.uid == Global.playerData.uid) {
                    for (let k in msgDic.playerInfo) {
                        Global.playerData[k] = msgDic.playerInfo[k];
                    }
                }
            }
        },

        onRcvNetTaskFinishNotice: function (msgDic) {
            if (msgDic.code === 200) {
                Global.playerData.taskNum = msgDic.hasQuest; //0没有任务 1有任务
                cc.vv.EventManager.emit(EventId.UPDATE_TASK_REDPOINT);
            }
        },

        //app强制重启
        onRcvNetGameRestarNotice: function (msg) {
            if (msg.code === 200) {
                cc.vv.AlertView.showTips(cc.vv.Language.app_restart, function () {
                    //app重启
                    Global.dispatchEvent(EventId.STOP_ACTION);
                    cc.vv.NetManager.close();
                    cc.audioEngine.stopAll();
                    cc.game.restart();
                }.bind(this));
            }
        },

        //T回大厅
        onRcvNetTickHallNotice: function (msg) {
            if (msg.code === 200) {
                cc.vv.AlertView.showTips(cc.vv.Language.user_tick_notice, function () {
                    if (cc.vv.gameData) {
                        Global.dispatchEvent(cc.vv.gameData._EventId.EXIT_GAME);
                        Global.dispatchEvent(EventId.EXIT_GAME);
                        cc.vv.SceneMgr.enterScene("lobby");
                    }

                }.bind(this));
            }
        },

        //幸运红包
        onRcvRedPackInfo: function (msg) {
            if (msg.code === 200) {
                if (msg.num > 0) {
                    //更新红包数量
                    cc.vv.UserManager.setLuckPackNum(msg.allnum)
                    //提示
                    cc.vv.AlertView.showTips(cc.vv.Language.get_luckypack_tips, function () {
                        //关闭提示就好

                    }.bind(this));

                    //更新大厅红包状态
                    Global.dispatchEvent(EventId.UPDATE_REDPACK);

                }

            }
        },

        //发送进入游戏请求
        sendEnterGameReq: function (gameId, ssid) {
            if (gameId) {
                var req = {'c': MsgId.GAME_ENTER_MATCH};
                req.gameid = gameId;
                req.gpsx = 0;
                req.gpsy = 0;
                req.gpsadd = '';
                req.ssid = ssid || 0;
                cc.vv.NetManager.send(req);
            }
        },

        onRcvNetEnterGame: function (msg) {
            this.onRecNetCreateOrJoinRoom(msg)
        },


    }
});
