package org.cocos2dx.javascript.wxapi;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.cocos2dx.javascript.AppActivity;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {
    private static final String app_id = "wx82256d3bda922e13";
    //微信appId
    private IWXAPI api;
    //微信发送的请求将回调该方法
    private void regToWx(){
        api = WXAPIFactory.createWXAPI(this,app_id,true);
        api.registerApp(app_id);
        System.out.println("###############");
        System.out.println("In wxEntryActivity api is " + api);
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        System.out.println("enter the wxEntryActivity");
        regToWx();
        //这句话很关键
        try {
            api.handleIntent(getIntent(), this);
            System.out.println("Enter the handleIntent");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     *登录微信
     */
    public static void WxLogin() {
        SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "wechat_sdk_aifuns";
        iwxapi.sendReq(req);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        System.out.println("intent is " + intent);
        setIntent(intent);
        api.handleIntent(intent, this);
    }
    @Override
    public void onReq(BaseReq baseReq) {

    }
    //向微信发送的请求的响应信息回调该方法
 
    @Override
    public void onResp(BaseResp baseResp) {
    }
       
}