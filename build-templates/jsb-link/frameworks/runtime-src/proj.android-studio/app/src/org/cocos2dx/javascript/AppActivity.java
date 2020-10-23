/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2011      Zynga Inc.
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;
import android.view.WindowManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import com.kk.happygamehengshan.wxapi.WXEntryActivity;
import com.kk.happygamehengshan.util.Util;

import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXTextObject;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import java.util.Random;
import java.io.File;

//gaode gps
import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationClientOption.AMapLocationMode;
import com.amap.api.location.AMapLocationClientOption.AMapLocationProtocol;
import com.amap.api.location.AMapLocationListener;
import com.amap.api.location.AMapLocationQualityReport;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.IntentFilter;
import android.content.ClipboardManager;
import android.content.ClipData;

public class AppActivity extends Cocos2dxActivity {
    public static AppActivity instance;
    static String resultStatus;
    static String result;
    static String memo;
    static int sElectricity;//电池电量
    static int iElectricityLevel;//电池电量等级
    //static MyBroadcastReceiver myBroadcastReceiver;//监听电池电量广播

    public static int WXshareCallback;//微信分享回调信息
    public static String sTag;//微信回调唯一标识
    static int MediaCallback;//录音回调
    static long startRecorderTime;//开始时间
    static long stopRecorderTime;//停止时间
    private static AppActivity sContext;//从微信官方后台获取到的
    public static String APP_ID = "";       //"wx82256d3bda922e13";
    public static String APP_SECRET = "";   //"b87d6ec883757e530cdf55794df03e92";
    // IWXAPI 是第三方app和微信通信的openapi接口
    private static IWXAPI api;
    // 是否安装微信客户端并且支持微信API
    //private static boolean s_bDownloadWxApp;
    // 发起微信授权登录sendReq的state参数字符段后面加的随机数
    private static int s_nState;
    // sendReq的state参数
    public static String s_strState;

    // 微信授权登录获取用户信息的JS函数id
    public static int s_nGetWxLoginFuncId;    // 发起微信登录回调函数id onWxLoginCallBack
    // js层传过来的用来网络发起请求的数据
    public static String s_strAccess_token;            // 微信登录授权凭证
    public static String s_strOpenid;                // 微信用户唯一标识
    public static String s_strRefresh_token;        // 用来刷新授权凭证超时时间refresh_token
    public static String s_strRefresh_token_time;    // 用来刷新授权凭证超时时间refresh_token的有效起始时间

    // 回调到JS的函数id
    public static int s_nDownloadWxAppProFuncId;    // 提示下载微信客户端回调函数id

    //gaode gps
    public AMapLocationClient mLocationClient = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        sContext = this;
        instance = this;
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        SDKWrapper.getInstance().init(this);

        //初始化定位
        initLocation();
    }

    // 创建BroadcastReceiver 
    private static BroadcastReceiver mBatInfoReveiver = new BroadcastReceiver() { 
        @Override 
        public void onReceive(Context context, Intent intent) { 
            final int intLevel = intent.getExtras().getInt("level");// 获得当前电量
            final int intScale = intent.getExtras().getInt("scale");// 获得总电量
            instance.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    String jsCallStr = "Global.GetBatteryChange('"+ intLevel +"')";
                    Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
                }
            });
        }
    }; 

    public static void starBatteryReceiver(){
        instance.registerReceiver(mBatInfoReveiver, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    }

    public void initLocation(){
        //初始化client
        mLocationClient = new AMapLocationClient(this.getApplicationContext());
        mLocationClient.setLocationOption(getLocationOption());
        mLocationClient.setLocationListener(mAMapLocationListener);
        mLocationClient.startLocation();
    }

    public AMapLocationClientOption getLocationOption(){
        AMapLocationClientOption mOption = new AMapLocationClientOption();
        mOption.setInterval(30000);//可选，设置定位间隔。默认为2秒
        // mOption.setLocationMode(AMapLocationMode.Hight_Accuracy);//可选，设置定位模式，可选的模式有高精度、仅设备、仅网络。默认为高精度模式
        // mOption.setGpsFirst(false);//可选，设置是否gps优先，只在高精度模式下有效。默认关闭
        // mOption.setHttpTimeOut(30000);//可选，设置网络请求超时时间。默认为30秒。在仅设备模式下无效
        // mOption.setNeedAddress(true);//可选，设置是否返回逆地理地址信息。默认是true
        // mOption.setOnceLocation(false);//可选，设置是否单次定位。默认是false
        // mOption.setOnceLocationLatest(false);//可选，设置是否等待wifi刷新，默认为false.如果设置为true,会自动变为单次定位，持续定位时不要使用
        // AMapLocationClientOption.setLocationProtocol(AMapLocationProtocol.HTTP);//可选， 设置网络请求的协议。可选HTTP或者HTTPS。默认为HTTP
        // mOption.setSensorEnable(false);//可选，设置是否使用传感器。默认是false
        // mOption.setWifiScan(true); //可选，设置是否开启wifi扫描。默认为true，如果设置为false会同时停止主动刷新，停止以后完全依赖于系统刷新，定位位置可能存在误差
        // mOption.setLocationCacheEnable(true); //可选，设置是否使用缓存定位，默认为true
        // mOption.setGeoLanguage(AMapLocationClientOption.GeoLanguage.DEFAULT);//可选，设置逆地理信息的语言，默认值为默认语言（根据所在地区选择语言）
        return mOption;
    }

    //异步获取定位结果
    AMapLocationListener mAMapLocationListener = new AMapLocationListener(){
        @Override
        public void onLocationChanged(AMapLocation amapLocation) {
            if (amapLocation != null) {
                if (amapLocation.getErrorCode() == 0) {
                    String gpsDataStr = "" + amapLocation.getLongitude();   //获取经度
                    gpsDataStr += "," + amapLocation.getLatitude();         //获取纬度
                    gpsDataStr += "," + amapLocation.getDistrict();         //区域信息
                    final String callGpsDataStr = gpsDataStr;
                    instance.runOnGLThread(new Runnable() {
                        @Override
                        public void run() {
                            String jsCallStr = "Global.GetGPSData('"+ callGpsDataStr +"')";
                            Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
                        }
                    });
                }
            }
        }
    };

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();
        
        // if (batteryReceiver == null) {
        //     intentFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        //     batteryReceiver = new BatteryReceiver();
        //     this.registerReceiver(batteryReceiver, intentFilter);
        // }
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();

        // if (batteryReceiver == null) {
        //     this.unregisterReceiver(batteryReceiver);
        //     batteryReceiver = null;
        // }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }


    /*
     *	调用JS函数将json数据传过去
     *	@用户昵称
     *	@用户openId
     *	@用户性别
     *	@用户unionid
     */
    public static void onJavaUseInfoToJS(final String wxUseInfo) {

        instance.runOnGLThread(new Runnable() {
            @Override
            public void run() {
//
//                System.out.println("s_nGetAccessTokenFuncId:" + s_nGetAccessTokenFuncId);
//                //System.out.println("s_nGetHttpOpenIdFuncId:" + s_nGetHttpOpenIdFuncId);
//                System.out.println("s_nGetRefreshTokenFuncId:" + s_nGetRefreshTokenFuncId);
//                System.out.println("s_nGetRefreshTokenTimeFuncId:" + s_nGetRefreshTokenTimeFuncId);
//
//                // access_token
//                int nAccessToken = Cocos2dxLuaJavaBridge.callLuaFunctionWithString(s_nGetAccessTokenFuncId, s_strAccess_token);
//                System.out.println("nAccessToken:" + nAccessToken);
//                Cocos2dxLuaJavaBridge.releaseLuaFunction(s_nGetAccessTokenFuncId);
//
//                // refresh_token
//                int nRefreshToken = Cocos2dxLuaJavaBridge.callLuaFunctionWithString(s_nGetRefreshTokenFuncId, s_strRefresh_token);
//                System.out.println("nRefreshToken:" + nRefreshToken);
//                Cocos2dxLuaJavaBridge.releaseLuaFunction(s_nGetRefreshTokenFuncId);
//
//                // refresh_token_time
//                int nRefreshTokenTime = Cocos2dxLuaJavaBridge.callLuaFunctionWithString(s_nGetRefreshTokenTimeFuncId, s_strRefresh_token_time);
//                System.out.println("nRefreshTokenTime:" + nRefreshTokenTime);
//                Cocos2dxLuaJavaBridge.releaseLuaFunction(s_nGetRefreshTokenTimeFuncId);
//
//                // lua微信登录回调
//                int nWxLoginFun = Cocos2dxLuaJavaBridge.callLuaFunctionWithString(s_nGetWxLoginFuncId, wxUseInfo);
//                System.out.println("nWxLoginFun:" + nWxLoginFun);
//                Cocos2dxLuaJavaBridge.releaseLuaFunction(s_nGetWxLoginFuncId);
            }
        });
    }

    // 获取提示下载微信客户端回调函数id
    public static boolean isWXAppInstalled() {
        // 是否安装微信客户端并且支持微信API
        boolean bDownloadWxApp = api.isWXAppInstalled();
        System.out.println("bDownloadWxApp:" + bDownloadWxApp);
        return bDownloadWxApp;
    }

    private static boolean setAppidWithAppsecretForJS(String appid, String appsecret) {
        APP_ID = appid;
        APP_SECRET = appsecret;

        api = WXAPIFactory.createWXAPI(instance, APP_ID, true);
        boolean isOk = api.registerApp(APP_ID);
        Log.i("isok", "isok" + isOk);
        return isOk;
    }

    /*  no use
     *	发起微信登录
     *	@access_token
     *	@openid
     *	@refresh_token
     *	@refresh_token_time
     */
    public static void onStartWxLoginCallBack(String accessToken,
                                              String openId,
                                              String refreshToken,
                                              String refreshTokenTime) {
        // 将lua传过来的值保存在java本地
        s_strAccess_token = accessToken;
        s_strOpenid = openId;
        s_strRefresh_token = refreshToken;
        s_strRefresh_token_time = refreshTokenTime;

        // 判断access_token存在并且openid也存在
        if ((accessToken != null) && (!(accessToken.equals("access_token")))
                && ((openId != null) && (!(openId.equals("openid"))))) {
            Log.i("getAccessTokenIsValid", "检验access_token是否有效");
            WXEntryActivity.getAccessTokenIsValid(s_strAccess_token, s_strOpenid);
        } else {
            Log.i("WxAuthorize", "拉起微信授权登录");
            onWxAuthorize();
        }
    }

    /*
     *	拉起微信登录授权界面
     */
    public static boolean onWxAuthorize() {
        // 发起微信登录授权，会回调到onResp(),得到code票据
        Random random = new Random();
        s_nState = Math.abs(random.nextInt(1000));
        s_strState = "wx_login_" + s_nState;
        // send oauth request
        final SendAuth.Req req1 = new SendAuth.Req();
        req1.scope = "snsapi_userinfo";
        req1.state = s_strState;
        Log.i("state!!!!!!!!!!!!!!!!!:", s_strState);
        return api.sendReq(req1);
    }

    // no use
    public static void GobackJS() {
        System.out.println("ssssssssssssssss");
        sTag = null;
        instance.runOnGLThread(new Runnable() {
            @Override
            public void run() {
//                Cocos2dxLuaJavaBridge.callLuaFunctionWithString(WXshareCallback, "succ");
//                // System.out.println("nNickFun:" + nNickFun);
//                Cocos2dxLuaJavaBridge.releaseLuaFunction(WXshareCallback);
            }
        });
    }

    /*
     *	调用JS函数将code数据传过去 "
     */
    public static void onJavaWXCodeToJS(final String code) {
        //System.out.println("code22 is   "+ code);
        instance.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                String jsCallStr = "Global.WXCode('"+ code +"')";
                Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);
            }
        });
    }

    public static int getWxShareScene(final String shareSceneType){
        if (shareSceneType.equals("WXSceneTimeline")) {
            return SendMessageToWX.Req.WXSceneTimeline;
        } else if (shareSceneType.equals("WXSceneFavorite")) {
            return SendMessageToWX.Req.WXSceneFavorite;
        } else {
            return SendMessageToWX.Req.WXSceneSession;
        }
    }

    public static void onWXShareText(final String shareSceneType, final String title, final String description) {
        WXTextObject textObj = new WXTextObject();
        textObj.text = description;     //文本数据 描述

        WXMediaMessage msg = new WXMediaMessage();
        msg.title = title;              //标题
        msg.description = description;  //描述
        msg.mediaObject = textObj;      //消息对象

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.message = msg;
        req.scene = getWxShareScene(shareSceneType);     //发送的目标场景
        //req.transaction = buildTransaction("text");       //对应该请求的事务 ID，通常由 Req 发起，回复 Resp 时应填入对应事务 ID

        api.sendReq(req);
    }

    
    public static void onWXShareImage(final String shareSceneType, final String imgPath) {
        File file = new File(imgPath);  
        if (!file.exists()) {
            return;
        }

        Bitmap bmp = BitmapFactory.decodeFile(imgPath);
        WXImageObject imgObj = new WXImageObject(bmp);
        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = imgObj;

        //缩略图二进制数据  100 * 56 * 4(32位色图) < 32K
        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, 100, 56, true);
        bmp.recycle();
        msg.thumbData = Util.bmpToByteArray(thumbBmp, true);
        
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.message = msg;
        req.scene = getWxShareScene(shareSceneType);
        // req.transaction = buildTransaction("img");
        // req.userOpenId = getOpenId();

        api.sendReq(req);
    }

    public static void onWXShareLink(final String shareSceneType, final String title, final String description, final String iconUrl, final String linkUrl) {

        WXWebpageObject webpage = new WXWebpageObject();
        webpage.webpageUrl = linkUrl;

        WXMediaMessage msg = new WXMediaMessage(webpage);
        msg.title = title;
        msg.description = description;
        msg.thumbData = Util.getHtmlByteArray(iconUrl);

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.message = msg;
        req.scene = getWxShareScene(shareSceneType);
        // req.transaction = buildTransaction("webpage");
        // req.userOpenId = getOpenId();

        api.sendReq(req);
    }

    public static void copyStrToClipboard(final String description) {
        ClipboardManager clipboardManager = (ClipboardManager) instance.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clipData = ClipData.newPlainText("Label", description);
        clipboardManager.setPrimaryClip(clipData);

        //打开微信
        if (api.isWXAppInstalled()) {
            if (description.contains("速来玩")) {
                api.openWXApp();
            }
        }
    }

    public static void getClipboardStr(){
        instance.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                ClipboardManager clipboardManager = (ClipboardManager) instance.getSystemService(Context.CLIPBOARD_SERVICE);
                if(clipboardManager.getText() != null)  
                {
                    final String clipBoardStr = clipboardManager.getText().toString();
                    String jsCallStr = "Global.getClipboardStrCallBackk('"+ clipBoardStr +"')";
                    Cocos2dxJavascriptJavaBridge.evalString(jsCallStr);

                    ClipData clipData = ClipData.newPlainText("Label", "");
                    clipboardManager.setPrimaryClip(clipData);
                }
            }
        });
    }
}
