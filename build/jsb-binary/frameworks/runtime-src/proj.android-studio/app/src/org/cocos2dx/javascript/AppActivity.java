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

import com.kk.happygame.wxapi.WXEntryActivity;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import java.util.Random;

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

//        this.instance.setAppidWithAppsecretForJS(APP_ID, APP_SECRET);
//        this.instance.onWxAuthorize();       //测试拉起微信
    }

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
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();
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

}
