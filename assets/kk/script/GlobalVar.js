/*
** Manager the global variable
*/

let ServerList = {
};


var GlobalVar = cc.Class({
    extends: cc.Component,

    statics: {
  		// 登录游戏服地址
        // loginServerAddress:"47.241.145.84:7180",    //开发测试
        loginServerAddress:"123.57.94.118:7180",    //正式
        resVersion:"1.2.22",
        
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
