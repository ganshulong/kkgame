/*
** Manager the global variable
*/

let ServerList = {
};


var GlobalVar = cc.Class({
    extends: cc.Component,

    statics: {
  		// 登录游戏服地址
        // loginServerAddress:"106.12.7.114:7180",         //开发测试 106.12.7.114:7180
        loginServerAddress:"www.kayuxin.com:7180",      //正式 8.131.94.204:7180  www.kayuxin.com
        resVersion:"1.2.29",
        
        //非常用的配置
        localVersion:true,
        isReview: false,
        appId: 4,           //产品id 1 BB 4 Poly
        appVersion: '1.0.0',
        designSize: cc.size(1280,720),
        centerPos: cc.v2(640,360),

        // 语言
        language:1,
        openUpdate:true,
        openAPIModel:false, //api模式登陆开关
        //tAccountServer:"", //测试账号的服务器
        //loginStateUrl:"",//登录状态检测地址
        testModule:false,
        testIndex:0,
        isLandSpace:true, // 横屏
    },
});

//微信分享场景
GlobalVar.WX_SHARE_SCENE = {
    Secssion : 0,	//会话
    Timeline : 1,	//朋友圈
    Favorite : 2,	//收藏
}
window.Global = GlobalVar;
