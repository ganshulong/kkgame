/*
** 平台API
** 主要是用到android、ios的系统接口，通过这里来转化
** Android: int(I) float(F) boolean(Z) String(Ljava/lang/String;)
** IOS中参数：NSNumber(float,int) BOOL(bool) NSString(string)
*/


cc.Class({
    extends: cc.Component,
    statics: {
        _callbackDic: null,  //保存注册回调函数
        _cbDataList: null,  //回调数据缓存

        _IOS_CLASS_NAME: 'PlatformIosApi', //ios类名
        _AND_CLASS_NAME: 'org/cocos2dx/javascript/PlatformAndroidApi', //android类名

        //初始化
        init: function () {
            setInterval(this.update.bind(this), 100);
        },

        /*以下是平台接口实现*/
        /*==============================================================================*/
        //获取app版本号
        getAppVersion: function () {
            if(Global.isNative()) {
                return this.callPlatformApi('getAppVersion', '()Ljava/lang/String;');
            }
            else {
                AppLog.warn('Browser call Function [getAppVersion]');
                return '1.0.0';
            }
        },

        getShareInstallInfo: function () {
            if(Global.isNative()) {
                return this.callPlatformApi('getShareInstallInfo', '()Ljava/lang/String;');
            }
            else {
                AppLog.warn('Browser call Function [getAppVersion]');
                return '';
            }
        },

        //获取剪切板文本
        getTxtFromClipboard: function () {
            if(Global.isNative()) {
                return this.callPlatformApi('getTxtFromClipboard', '()Ljava/lang/String;');
            }
            else {g
                AppLog.warn('Browser call Function [getTxtFromClipboard]');
                return '';
            }
        },

        //设置文本到剪切板
        setTxtToClipboard: function (txtStr) {
            if(Global.isNative()) {
                this.callPlatformApi('setTxtToClipboard', '(Ljava/lang/String;)V', txtStr);
            }
            else {
                AppLog.warn('Browser call Function [setTxtToClipboard]');
            }
        },

        //打开app的url数据
        getOpenAppUrlDataStr: function () {
            if(Global.isNative()&& cc.sys.isMobile) {
                return this.callPlatformApi('getOpenAppUrlDataString', '()Ljava/lang/String;');
            }
            else {
                if(cc.sys.isBrowser)
                {
                    AppLog.warn('Browser call Function [getOpenAppUrlDataStr]');
                }
                return null;
            }
        },

        //打开Gps设置
        openGPSSetting: function () {
            if(Global.isNative()) {
                this.callPlatformApi('openGPSSetting', '()V');
            }
            else {
                AppLog.warn('Browser call Function [openGPSSetting]');
            }
        },

        //是否开启了Gps
        isOpenGPS: function () {
            if(Global.isNative()) {
                return this.callPlatformApi('isOpenGPS', '()Z');
            }
            else {
                AppLog.warn('Browser call Function [isOpenGPS]');
                return false;
            }
        },

        // //开始定位
        // startLocation: function ( callback ) {
        //     if(Global.isNative()) {
        //         this.callPlatformApi('startLocation', '()V');
        //         this.addCallback(callback, 'locationCbKey');
        //     }
        //     else {
        //         AppLog.warn('Browser call Function [startLocation]');
        //     }
        // },

        // stopLocation: function () {
        //     if(Global.isNative()) {
        //         this.callPlatformApi('stopLocation', '()V');
        //     }
        //     else {
        //         AppLog.warn('Browser call Function [stopLocation]');
        //     }
        // },

        getBatteyLevel: function () {
            if(Global.isNative()) {
                return this.callPlatformApi('getBatteyLevel', '()F');
            }
            else {
                AppLog.warn('Browser call Function [getBatteyLevel]');
            }
        },

        //网页跳转
        openURL: function (urlStr) {
            if (Global.isNative()) {
                this.callPlatformApi('openURL', '(Ljava/lang/String;)V', urlStr);  
            }
            else {
                cc.sys.openURL(urlStr);
            }
        },

        // 获取游戏包名
        getPackageName:function(){
            if (Global.isNative()){
                return this.callPlatformApi("getAPPBundleId","()Ljava/lang/String;")
            }
            else {
                return "";
            }
        },

        //sdk登录
        SdkLogin: function() {
            if(Global.isNative()){
                this.callPlatformApi('fbSdkLogin','()V')
            }
            else {
                AppLog.warn('Browser call Function [SdkLogin]');
            }
        },

        //sdk登出
        SdkLoginOut: function() {
            if(Global.isNative()) {
                this.callPlatformApi('fbSdkLoginOut','()V')
            }
            else {
                AppLog.warn('Browser call Function [SdkLoginOut]');
            }
        },

        //facebook sdk分享
        SdkShare: function(data) {
            if(Global.isNative()){
                this.callPlatformApi('fbSdkShare','(Ljava/lang/String;)V', data)
            }
            else {
                AppLog.warn('Browser call Function [SdkShare]');
            }
        },

        //Sdk支付
        SdkPay:function(data) {
            if(Global.isNative()){
                AppLog.log('--------sdk play platom');
                this.callPlatformApi('SdkPay','(Ljava/lang/String;)V', data)
            }
            else{
                AppLog.warn('Browser call Function [SdkPay]');
            }
        },

        //删除订单缓存
        SdkDelOrderCache: function(data){
            if(Global.isNative()){
                this.callPlatformApi('SdkPayResult','(Ljava/lang/String;)V', data)
            }
            else{
                AppLog.warn('Browser call Function [SdkDelOrderCache]');
            }
        },

        //尝试补单
        SdkReplaceOrder: function(data){
            if(Global.isNative()){
                this.callPlatformApi('SdkPayReplacement','(Ljava/lang/String;)V', data)
            }
            else{
                AppLog.warn('Browser call Function [SdkReplaceOrder]');
            }
        },
        //复制内容
        Copy:function(data) {
            if(Global.isNative()){
                this.callPlatformApi('copy','(Ljava/lang/String;)V', data)
            }
            else{
                AppLog.warn('Browser call Function [Copy]');
                console.log("copy data:" + data);
            }
        },

        //从粘贴板获取内容
        Paste: function(data){
            if(Global.isNative()){
                this.callPlatformApi('paste','()V')
            }
            else{
                AppLog.warn('Browser call Function [Paste]');
            }
        },

        //打开FB
        //data json格式的字符串，平台里面自解
        OpenFB:function(data){
            if(Global.isNative()){
               return this.callPlatformApi('OpenFB','(Ljava/lang/String;)Z',data)
            }
            else{
                AppLog.warn('Browser call Function [OpenFB]');
            }
        },

        //保存图片到相册
        SaveToAlumb:function(file){
            if(Global.isNative()){
               return this.callPlatformApi('SaveToAlumb','(Ljava/lang/String;)I',file)
            }
            else {
                AppLog.warn('Browser call Function [SaveToAlumb]');
            }
        },

        //是否安装微信app
        isInstallWXApp:function(){
            if(Global.isNative()){
                return this.callPlatformApi('installWXApp','()I')
            }
            else{
                AppLog.warn('Browser call Function [installWXApp]');
            }
        },

        //打开微信app
        openWXApp:function(){
            if(Global.isNative()){
                return this.callPlatformApi('openWXApp','()I')
            }
            else {
                AppLog.warn('Browser call Function [openWXApp]');
            }
        },

        //微信登录
        wxLogin:function(){
            if(Global.isNative()){
                this.callPlatformApi('wxLogin','()V')
            }
            else{
                AppLog.warn('Browser call Function [wxLogin]');
            }
        },

        // 消耗物品
        consumeOwnedPurchase:function (token) {
            if(Global.isNative()){
                this.callPlatformApi('consumeOwnedPurchase','(Ljava/lang/String;)V', token)
            }
            else{
                AppLog.warn('Browser call Function [installWXApp]');
            }
        },

        //微信分享
        wxShare:function(data){
            if(Global.isNative()){
                this.callPlatformApi('wxShare','(Ljava/lang/String;)V',data)
            }
            else{
                AppLog.warn('Browser call Function [wxShare]');
            }
        },

        // //获取umeng渠道序号：目前GANGA  GANGB  GANGC
        // umChannel:function(){
        //     if(Global.isNative()){
        //         return this.callPlatformApi('getUMChannelIdx','()Ljava/lang/String;')
        //     }
        //     else{
        //         return "GANGA"
        //     }
        // },

        //获取唯一的设备id
        //android 获取android id
        //ios 获取idfa
        getDeviceId:function(){
            if(Global.isNative()){
                return this.callPlatformApi('getDeviceId','()Ljava/lang/String;')
            }
            else{
                //网页上没有
                return '0'
             }
        },

        //获取设备品牌：小米_xiaomi,iphone6
        getDeviceBrand:function(){
            if(Global.isNative()){
                return this.callPlatformApi('getDeviceBrand','()Ljava/lang/String;')
            }
            else{
                return 'web'
            }
        },

        //获取设备操作系统版本
        getDeviceOpSysVision:function(){
            if(Global.isNative()){
                return this.callPlatformApi('getDeviceOpSysVision','()Ljava/lang/String;')
            }
            else{
                return 'web'
            }
        },

        //关闭闪屏
        closeSplash:function(){
            if(Global.isNative()){
                this.callPlatformApi('closeSpalsh','()V')
            }
        },

        //手机震动一下
        deviceShock:function(){
            if(Global.getShake()){
                if(Global.isNative()){
                    this.callPlatformApi('phoneShock','()V')
                }
            }
        },

        //播放广告视频
         showRewardedVideo:function(){
            if(Global.isNative()){
                this.callPlatformApi('showRewardedVideo','()V')
            }
        },

        // 显示google banner广告
        showBannerAd:function(){
            if(Global.isNative()){
                this.callPlatformApi('showBannerAd','()V')
            }

        },

        // 隐藏google banner广告
        hideBannerAd:function(){
            if(Global.isNative()){
                this.callPlatformApi('hideBannerAd','()V')
            }
        },

        /*以下是函数方法的封装*/
        /*==============================================================================*/

        // 回调在注册到dic中
        addCallback: function (callback, callbackkey) {
            this._callbackDic = this._callbackDic || {};
            this._callbackDic[callbackkey] = callback;
        },

        //删除回调函数
        delCallback: function (callbackkey) {
            delete this._callbackDic[callbackkey];
        },

        // 触发回调（oc，java）
        trigerCallback: function (cbDataDic) {
            //json序列化
            cc.log("CallBackData:" + JSON.stringify(cbDataDic))
            /*if (cbDataDic.cbName) {
                if (this._callbackDic[cbDataDic.cbName]) {
                    this._callbackDic[cbDataDic.cbName](cbDataDic);
                }
                else {
                    AppLog.warn('Has not add ' + cbDataDic.cbName + ' in the cbDataDic!');
                }
            }
            else {
                AppLog.err('The callback data (cbDataDic.cbName) is not exist!');
            }*/

            this.pushCallbackDataToList(cbDataDic);
        },

        //paraments 参数，当多个参数时，用json字符串传入，平台端解开（多个返回值亦是如此）
        callPlatformApi: function (methodName, methodSignature, paraments) {
            if (Global.isAndroid()) {
                if (paraments) {
                    return jsb.reflection.callStaticMethod(this._AND_CLASS_NAME, methodName, methodSignature, paraments)
                }
                else {
                    return jsb.reflection.callStaticMethod(this._AND_CLASS_NAME, methodName, methodSignature)
                }
            }
            else if (Global.isIOS()) {
                if (paraments) {
                    return jsb.reflection.callStaticMethod(this._IOS_CLASS_NAME, methodName + ':', paraments);
                }
                else {
                    return jsb.reflection.callStaticMethod(this._IOS_CLASS_NAME, methodName);
                }
            }
            else {
                AppLog.warn('Web Api is not Exit function : ' + methodName);
                return "";
            }
        },

        pushCallbackDataToList: function (cbDataDic) {
            this._cbDataList = this._cbDataList || [];
            this._cbDataList.push(cbDataDic);
        },

        //放到刷新函数中，防止异步线程直接回调，造成UI更新问题
        update: function () {
            if (this._cbDataList != null && this._cbDataList.length > 0) {
                var cbDataDic = this._cbDataList.shift();
                if (cbDataDic.cbName) {
                    if (this._callbackDic[cbDataDic.cbName]) {
                        this._callbackDic[cbDataDic.cbName](cbDataDic);
                    }
                    else {
                        AppLog.warn('Has not add ' + cbDataDic.cbName + ' in the cbDataDic!');
                    }
                }
                else {
                    AppLog.err('The callback data (cbDataDic.cbName) is not exist!');
                }
            }
        },

        // 切换屏幕
        // @param isLandSpace 是否横屏
        changScreen:function(isLandSpace)
        {
            let frame = cc.view.getFrameSize();
            if(isLandSpace && frame.width>frame.height) return;
            if(!isLandSpace && frame.width<frame.height) return;
            Global.isLandSpace = isLandSpace;
            if(cc.sys.os == cc.sys.OS_IOS)
            {
                jsb.reflection.callStaticMethod("AppController", "changeRootViewController:",isLandSpace);
            }
            else if(cc.sys.os == cc.sys.OS_ANDROID)
            {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "changedActivityOrientation", "(Z)V",isLandSpace);

            }
             cc.view.setFrameSize(frame.height, frame.width);
            if(isLandSpace)
            {
                cc.view.setDesignResolutionSize(1280,720,cc.ResolutionPolicy.FIXED_WIDTH);
            }
            else
            {
                cc.view.setDesignResolutionSize(720,1280,cc.ResolutionPolicy.FIXED_HEIGHT);
            }
            cc.view.setOrientation(isLandSpace?cc.macro.ORIENTATION_LANDSCAPE:cc.macro.ORIENTATION_PORTRAIT);
        },
    },
});
