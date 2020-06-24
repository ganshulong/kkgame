/*
** 微信相关接口管理
** 
** 
*/

cc.Class({
    extends: cc.Component,
    statics: {
        init: function () {
            
            // 注册全局消息
            this.registerAllMsg();
        },

        registerAllMsg: function () {
            
            //注册sdk支付回调
            //cc.vv.NetManager.registerMsg(MsgId.PURCHASE_CHECK_ORDER, this.onRcvMsgCheckOrder.bind(this));

        },

        //是否安装微信
        isWXAppInstalled: function(){
            var bInstall = false
            var nResult = cc.vv.PlatformApiMgr.isInstallWXApp()
            if(Number(nResult) == 1){
                bInstall = true
            }
            return bInstall
        },

        //微信登录
        wxLogin:function(pCall){
            var self = this
            self._loginResultCall = pCall

            cc.vv.PlatformApiMgr.addCallback(self.loginSdkCallback.bind(this),"loginSdkCallback")
            cc.vv.PlatformApiMgr.wxLogin()
        },

        //微信支付
        wxPay:function(){

        },

        //微信分享_文字
        wxShareText:function(toScene,textStr,pCall){
            var self = this
            self._shareEndCall = pCall

            var data = {}
            data.shareScene = toScene
            data.shareType = 1
            data.textMsg = textStr
            cc.vv.PlatformApiMgr.addCallback(self.shareResultCall.bind(this),"shareResultCall")
            cc.vv.PlatformApiMgr.wxShare(JSON.stringify(data))
        },
        //微信分享_图片
        wxShareImg:function(toScene,imgPath,pCall){
            var self = this
            self._shareEndCall = pCall

            var data = {}
            data.shareScene = toScene
            data.shareType = 2
            data.imgPath = imgPath
            cc.vv.PlatformApiMgr.addCallback(self.shareResultCall.bind(this),"shareResultCall")
            cc.vv.PlatformApiMgr.wxShare(JSON.stringify(data))
        },
        //微信分享_web
        wxShareWeb:function(toScene,title,des,imgUrl,urlLink,pCall){
            var self = this
            self._shareEndCall = pCall

            var data = {}
            data.shareScene = toScene
            data.shareType = 3
            data.linkUrl = urlLink//点击后跳转的url
            data.imgUrl = imgUrl    //icon所在url
            data.title = title      //标题
            data.des = des          //描述
            cc.vv.PlatformApiMgr.addCallback(self.shareResultCall.bind(this),"shareResultCall")
            cc.vv.PlatformApiMgr.wxShare(JSON.stringify(data))
        },


        //打开微信
        openWxApp: function(){
            var bResult = false
            bResult = cc.vv.PlatformApiMgr.openWXApp()
            return bResult
        },

        //分享成功回调
        shareResultCall:function(data){
            var self = this
            //data.result = 1 成功 -1 取消 ...
            //cc.vv.FloatTip.show(data.result)
            
            if(self._shareEndCall){
                self._shareEndCall(data)
            }
        },

        //登录回调
        loginSdkCallback:function(data){
            var self = this

            var nResult = data.result//登录结果 1成功 其它失败
            var token = data.token  //登录的sdk token
            var strUid = data.uid //登录的回传参数
            if(self._loginResultCall){
                self._loginResultCall(data)
            }
        },

        //获取微信token
        getWXToken:function(){
            var token = Global.getLocal('wxToken')
            if(token && token.length>0){
                return token
            }
            return null
        },
        
        //保存微信token
        saveWXToken:function(token){
            if(token){
                Global.saveLocal('wxToken',token)
            }
            
        },

        //删除微信token
        delWXToken:function(){
            var self = this

            self.saveWXToken('')
        },
        
        
    }
});
