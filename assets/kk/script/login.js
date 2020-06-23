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

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.parent.name = "login";
        Global.autoAdaptDevices(false);

        cc.vv = cc.vv || {};

        //游戏管理
        if (!cc.vv.GameManager) {
            var gameMgr = require('GameManager');
            gameMgr.init();
            cc.vv.GameManager = gameMgr;
        }

        //用户数据管理
        var userMgr = require('UserManager');
        userMgr.init();
        cc.vv.UserManager = userMgr;
        cc.vv.UserManager.clearNotice();

        //喇叭管理
        var speakerMgr = require('SpeakerMgr')
        speakerMgr.init();
        cc.vv.SpeakerMgr = speakerMgr;


        let ver = cc.find("ver", this.node);
        ver.getComponent(cc.Label).string = Global.resVersion;


        this._exit_btn = this.node.getChildByName("btn_exit");
        Global.btnClickEvent(this._exit_btn,this.onExit,this);

        // 防止在游戏被剔除后，无法进入游戏
        cc.vv.gameData = null;

        // 游客登录
        this._visitor_btn = this.node.getChildByName("visitor_login");
        Global.btnClickEvent(this._visitor_btn,this.onVisitorLogin,this);

        // 账号登录
        this._wechat_login = this.node.getChildByName("wechat_login");
        Global.btnClickEvent(this._wechat_login,this.onWeChatLogin,this);

        // facebook登录
        let phone_login = this.node.getChildByName("phone_login");
        Global.btnClickEvent(phone_login,this.onPhoneLogin,this);
    },

    onPhoneLogin(){

    },

    // 微信登录
    onWeChatLogin() {
        cc.vv.GameManager.checkIsPhone(false);
		//test
        if(true){
            var WxMgr = require('WxMgr');
            WxMgr.init();
            cc.vv.WxMgr = WxMgr;

            let loginSyncCall = function (data) {
                cc.vv.FloatTip.show("test---loginSyncCall");
                cc.log("微信===  data： " + JSON.stringify(data));
                if (data.result === 1) {
                    let code = data.token
                    let uid = data.uid
                    let openid = "";
                    let token = "";
                    // self.reqLogin(token, token, Global.LoginType.WX, uid)
                    cc.vv.GameManager.reqWxLogin(code, openid, token,"");
                }
                else {
                    cc.vv.FloatTip.show('微信授权失败！')
                }
            }
            cc.vv.wxLoginResult = function (data) {
                cc.vv.FloatTip.show("test---wxLoginResult "+data);
            }
            cc.vv.WxMgr.wxLogin(loginSyncCall)
        }
    },


    // 游客登录
    onVisitorLogin(){
        var self = this;
        self._nickname = "";
        if (self._nickname.length == 0) {
            var localNickname = Global.getLocal('account', '');
            self._nickname = localNickname;
            if (self._nickname.length == 0) {
                self._nickname = 'G' + Global.random(10000, 99999);
            }
        }
        Global.saveLocal('account', self._nickname);

        var guestTokenCfg = Global.getLocal('guest_token_map', '');
        var guestTokenMap = guestTokenCfg.length > 0?JSON.parse(guestTokenCfg) : {};
        var token = guestTokenMap[self._nickname];
        if (!token || token.length <= 0) {
            token = (new Date()).getTime()  + '_' + Global.random(1, 99999999);
            guestTokenMap[self._nickname] = token;
            Global.saveLocal('guest_token_map', JSON.stringify(guestTokenMap));
        }
        cc.vv.GameManager.reqLogin(self._nickname, "", 11, "","","");

        Global.playEff(Global.SOUNDS.eff_click);
    },


    // 退出
    onExit(){
        let lan = cc.vv.Language.request_quit;
        let sureCall = function(){
            cc.game.end();
        }

        let cancelCall = function(){

        }
        cc.vv.AlertView.show(lan,sureCall,cancelCall)
    },

    start() {
        // var localNickname = Global.getLocal('account', '');
        // if( localNickname ) {
        //     this._nickEditBox.string = localNickname;
        // }

        // if(cc.vv.UserManager.getIsAutoLogin() && localNickname){
        //     this.scheduleOnce(()=>{
        //         cc.vv.GameManager.reqReLogin();
        //     },0.02)
        // }
    },

    onDestroy(){

    }
});
