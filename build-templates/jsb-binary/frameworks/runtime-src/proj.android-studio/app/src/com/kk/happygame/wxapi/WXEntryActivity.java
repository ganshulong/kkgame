package com.kk.happygame.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

import com.kk.happygame.util.JsonUtils;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.SendAuth.Resp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.apache.http.client.ClientProtocolException;
import org.cocos2dx.javascript.AppActivity;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

// import com.tencent.mm.sdk.constants.ConstantsAPI;
// import java.util.Calendar;
// import java.util.GregorianCalendar;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {
    // public static WXEntryActivity s_instance;

    private static final String TAG = "WXEntryActivity";
    // IWXAPI 是第三方app和微信通信的openapi接口
    private static IWXAPI api;

    protected static final int RETURN_OPENID_ACCESSTOKEN = 0;    // 返回openid，accessToken消息码
    protected static final int RETURN_REFRESH_TOKEN = 1;    // 刷新或续期access_token
    protected static final int RETURN_NICKNAME_UID = 2;        // 返回昵称，uid消息码(json格式的字符串)
    protected static final int RETURN_ACCESSTOKEN_ISVALID = 3;    // 返回access_token是否有效

    static Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                // 获取openid，accessToken消息码回调
                case RETURN_OPENID_ACCESSTOKEN:
                    Bundle bundle1 = (Bundle) msg.obj;
                    String accessToken = bundle1.getString("access_token");
                    String openId = bundle1.getString("openid");
                    String refresh_token = bundle1.getString("refresh_token");

                    // 获取当前时间字符串
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date date = new Date();
                    String curDate = dateFormat.format(date);        // 当前时间

                    Log.i(TAG, "accessToken = " + accessToken);
                    Log.i(TAG, "openId = " + openId);
                    Log.i(TAG, "refresh_token = " + refresh_token);
                    Log.i(TAG, "curDate = " + curDate);

                    onSaveUseDefaultInfo(accessToken, openId, refresh_token, curDate);
                    // FIX ME:刷新或续期access_token请求
                    // String refreshToken = bundle1.getString("refresh_token")
                    // getRefreshToken(refreshToken);

                    // 第3步 获取unionid信息请求
                    getUID(openId, accessToken);
                    break;
                // 返回json的unionid信息回调
                case RETURN_NICKNAME_UID:
                    Bundle bundle2 = (Bundle) msg.obj;
                    String nickname = bundle2.getString("nickname");
                    String uid = bundle2.getString("unionid");
                    String openid = bundle2.getString("openid");
                    String sex = bundle2.getString("sex");
                    String province = bundle2.getString("province");
                    String city = bundle2.getString("city");
                    String country = bundle2.getString("country");
                    String headimgurl = bundle2.getString("headimgurl");

                    String jsonInfo = bundle2.getString("jsonInfo");

                    // uid最终得到微信用户数据
                    Log.i(TAG, "nickname = " + nickname);
                    Log.i(TAG, "unionid = " + uid);
                    Log.i(TAG, "openid = " + openid);
                    Log.i(TAG, "sex = " + sex);
                    Log.i(TAG, "province = " + province);
                    Log.i(TAG, "city = " + city);
                    Log.i(TAG, "country = " + country);
                    Log.i(TAG, "headimgurl = " + headimgurl);

                    // 调用lua函数将json数据传过去
                    // @昵称、@openId、@性别、@unionid
                    AppActivity.onJavaUseInfoToJS(jsonInfo);

                    break;
                // 刷新或续期access_token回调
                case RETURN_REFRESH_TOKEN:
                    Bundle bundle3 = (Bundle) msg.obj;
                    String access_Token = bundle3.getString("access_token");
                    String openId1 = bundle3.getString("open_id");
                    String refresh_token1 = bundle3.getString("refresh_token");
                    // 获取当前时间字符串
                    SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date date1 = new Date();
                    String curDate1 = dateFormat1.format(date1);        // 当前时间
                    // 保存数据
                    onSaveUseDefaultInfo(access_Token, openId1, refresh_token1, curDate1);
                    // 获取unionid信息请求
                    getUID(openId1, access_Token);
                    break;
                // 返回access_token是否有效
                case RETURN_ACCESSTOKEN_ISVALID:
                    Bundle bundle4 = (Bundle) msg.obj;
                    String errcode = bundle4.getString("errcode");
                    String errmsg = bundle4.getString("errmsg");

                    // uid最终得到微信用户数据
                    Log.i(TAG, "errcode = " + errcode);
                    Log.i(TAG, "errmsg = " + errmsg);

                    // access_token有效合法
                    if (errcode.equals("0") && errmsg.equals("ok")) {
                        getUID(AppActivity.s_strOpenid, AppActivity.s_strAccess_token);
                    }
                    // access_token不合法
                    else if (errcode.equals("40003") && errmsg.equals("invalid openid")) {

                        boolean isOverTime = isOverTimeRefreshToken(AppActivity.s_strRefresh_token_time);
                        // refresh_token 存在并且未超时
                        if ((AppActivity.s_strRefresh_token != null) && !(AppActivity.s_strRefresh_token.equals("refresh_token")) && !isOverTime) {
                            // 刷新access_token
                            getRefreshAccToken(AppActivity.s_strRefresh_token);
                        } else {
                            AppActivity.onWxAuthorize();
                        }
                    }

                    break;

                default:
                    break;
            }
        }

        ;
    };

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 通过WXAPIFactory工厂，获取IWXAPI的实例
        api = WXAPIFactory.createWXAPI(this, AppActivity.APP_ID, false);

        api.handleIntent(getIntent(), this);
    }

    /**
     * 请求回调接口
     */
    @Override
    public void onReq(BaseReq req) {
        Log.i(TAG, "onReq");
    }

    /**
     * 请求响应回调接口
     */
    @Override
    public void onResp(BaseResp resp) {
        Log.i(TAG, "onResp-------------------");

        switch (resp.errCode) {
            case BaseResp.ErrCode.ERR_OK:
                // 可用以下两种方法获得code
                // resp.toBundle(bundle);
                // Resp sp = new Resp(bundle);
                // String code = sp.code;
                // 或者
                // if (resp.getType() == ConstantsAPI.COMMAND_SENDAUTH)//登陆回调
                // {
                // }


                ///// 分享特有的stag
//                if (instance.sTag != null && resp.transaction.equals(instance.sTag)) {
//                    AppActivity.GobackJS();
//                    finish();
//                } else
                SendAuth.Resp sendAuthResp = (Resp) resp;    // 用于分享时不要有这个，不能强转
                String code = sendAuthResp.code;            // 这里的code就是接入指南里要拿到的code

                // 微信回调得到的state
                String state = sendAuthResp.state;
                Log.i("AppActivity.state:", AppActivity.s_strState);
                Log.i("state:", state);

                // 判断传入的state参数和回调过来的是否一致
                if (AppActivity.s_strState.equals(state)) {
                    //将此code传给JS层
                    AppActivity.onJavaWXCodeToJS(code);
                    //getResult(code);        //第二步：通过 code 获取 access_token
                    Log.i(TAG, "onResp-------------success ");
                    // Toast.makeText(this, "onResp-------------success " + code, 6000).show();
                } else {
                    // 微信登录失败，重新回到畅游岛app
                    Log.i(TAG, "onResp-------------error! ");
                    // Toast.makeText(this, "onResp-------------error!", 6000).show();
                }

                finish();// 必须要有，用于点击返回游戏的时候不会留在微信
                break;
            case BaseResp.ErrCode.ERR_USER_CANCEL:
                Log.v("WeiChatLogin", "login----ERR_USER_CANCEL-");
                finish();
                break;
            case BaseResp.ErrCode.ERR_AUTH_DENIED:
                Log.v("WeiChatLogin", "login----ERR_AUTH_DENIED-");
                finish();
                break;
            default:
                Log.v("WeiChatLogin", "login--unknown---");
                finish();
                break;
        }
    }

    /**
     * 第二步：通过 code 获取 access_token
     * 获取openid accessToken值用于后期操作
     *
     * @param code 请求码
     */
    private void getResult(final String code) {
        new Thread() {// 开启工作线程进行网络请求
            public void run() {
                String path = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="
                        + AppActivity.APP_ID
                        + "&secret="
                        + AppActivity.APP_SECRET
                        + "&code="
                        + code
                        + "&grant_type=authorization_code";
                try {
                    JSONObject jsonObject = JsonUtils
                            .initSSLWithHttpClinet(path);// 请求https连接并得到json结果
                    if (null != jsonObject) {
                        String openid = jsonObject
                                .getString("openid").toString().trim();
                        String access_token = jsonObject
                                .getString("access_token").toString().trim();
                        String refresh_token = jsonObject
                                .getString("refresh_token").toString().trim();

                        Log.i(TAG, "openid = " + openid);
                        Log.i(TAG, "access_token = " + access_token);
                        Log.i(TAG, "refresh_token = " + refresh_token);

                        Message msg = handler.obtainMessage();
                        msg.what = RETURN_OPENID_ACCESSTOKEN;
                        Bundle bundle = new Bundle();
                        bundle.putString("openid", openid);
                        bundle.putString("access_token", access_token);
                        bundle.putString("refresh_token", refresh_token);
                        msg.obj = bundle;
                        handler.sendMessage(msg);
                    }
                } catch (ClientProtocolException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                return;
            }

            ;
        }.start();
    }

    /**
     * 第3步 获取用户唯一标识
     *
     * @param openId
     * @param accessToken
     */
    private static void getUID(final String openId, final String accessToken) {
        new Thread() {
            @Override
            public void run() {
                String path = "https://api.weixin.qq.com/sns/userinfo?access_token="
                        + accessToken + "&openid=" + openId;
                JSONObject jsonObject = null;
                try {
                    jsonObject = JsonUtils.initSSLWithHttpClinet(path);
                    String nickname = jsonObject.getString("nickname");
                    String unionid = jsonObject.getString("unionid");
                    String openid = jsonObject.getString("openid");
                    String sex = jsonObject.getString("sex");
                    String province = jsonObject.getString("province");
                    String city = jsonObject.getString("city");
                    String country = jsonObject.getString("country");
                    String headimgurl = jsonObject.getString("headimgurl");

                    String jsonInfo = jsonObject.toString();

                    Log.i(TAG, "nickname = " + nickname);
                    Log.i(TAG, "unionid = " + unionid);
                    Log.i(TAG, "openid = " + openid);
                    Log.i(TAG, "sex = " + sex);
                    Log.i(TAG, "province = " + province);
                    Log.i(TAG, "city = " + city);
                    Log.i(TAG, "country = " + country);
                    Log.i(TAG, "headimgurl = " + headimgurl);

                    Message msg = handler.obtainMessage();
                    msg.what = RETURN_NICKNAME_UID;
                    Bundle bundle = new Bundle();
                    bundle.putString("nickname", nickname);
                    bundle.putString("unionid", unionid);
                    bundle.putString("openid", openid);
                    bundle.putString("sex", sex);
                    bundle.putString("province", province);
                    bundle.putString("city", city);
                    bundle.putString("country", country);
                    bundle.putString("headimgurl", headimgurl);

                    bundle.putString("jsonInfo", jsonInfo);
                    msg.obj = bundle;
                    handler.sendMessage(msg);
                } catch (ClientProtocolException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            ;
        }.start();
    }

    /**
     * 刷新或续期access_token
     *
     * @refresh_token:填通过getResult()得到的refresh_token
     */
    private static void getRefreshAccToken(final String refreshToken) {
        new Thread() {
            @Override
            public void run() {
                String path = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid="
                        + AppActivity.APP_ID + "&grant_type=refresh_token&refresh_token=" + refreshToken;
                JSONObject jsonObject = null;
                try {
                    jsonObject = JsonUtils.initSSLWithHttpClinet(path);
                    String access_token = jsonObject.getString("access_token");
                    String refresh_token = jsonObject.getString("refresh_token");
                    String openid = jsonObject.getString("openid");

                    Log.i(TAG, "openid = " + openid);
                    Log.i(TAG, "access_token = " + access_token);
                    Log.i(TAG, "refresh_token = " + refresh_token);

                    Message msg = handler.obtainMessage();
                    msg.what = RETURN_REFRESH_TOKEN;
                    Bundle bundle = new Bundle();
                    bundle.putString("access_token", access_token);
                    bundle.putString("openid", openid);
                    bundle.putString("refresh_token", refresh_token);
                    msg.obj = bundle;
                    handler.sendMessage(msg);
                } catch (ClientProtocolException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            ;
        }.start();
    }

    /*
     *	检验授权凭证access_token是否有效, 防止每次都连接微信客户端
     * 	@param accessToken
     * 	@param openId
     */
    public static void getAccessTokenIsValid(final String accessToken, final String openId) {
        new Thread() {
            @Override
            public void run() {
                String path = "https://api.weixin.qq.com/sns/auth?access_token="
                        + accessToken + "&openid=" + openId;
                JSONObject jsonObject = null;
                try {
                    jsonObject = JsonUtils.initSSLWithHttpClinet(path);
                    String errcode = jsonObject.getString("errcode");
                    String errmsg = jsonObject.getString("errmsg");

                    Log.i(TAG, "errcode = " + errcode);
                    Log.i(TAG, "errmsg = " + errmsg);

                    Message msg = handler.obtainMessage();
                    msg.what = RETURN_ACCESSTOKEN_ISVALID;                // FIX ME
                    Bundle bundle = new Bundle();
                    bundle.putString("errcode", errcode);
                    bundle.putString("errmsg", errmsg);

                    msg.obj = bundle;
                    handler.sendMessage(msg);
                } catch (ClientProtocolException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            ;
        }.start();
    }

    /*
     * 判断refresh_token是否超时29天
     */
    public static boolean isOverTimeRefreshToken(String historyTime) {
        // 获取当前日期时间
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = new Date();

        String curDate = dateFormat.format(date);        // 当前时间
        //String formatDate = "2017-01-17 16:00:00";	// 历史时间
        try {
            Date curDate1 = dateFormat.parse(curDate);
            // 历史获取refresh_token的时间
            Date formatDate1 = dateFormat.parse(historyTime);

            System.out.println("curDate" + curDate);
            System.out.println("historyTime" + historyTime);
            // 当前时间与获得refresh_token起始时间差 单位：ms / 1000
            long diff = (curDate1.getTime() - formatDate1.getTime()) / 1000;
            System.out.println("diff" + diff);
            // 29天的时间 单位：s
            long diffTime = 29 * 24 * 3600;
            System.out.println("overtimeSum:" + diffTime);
            // 超时29天
            if (diff >= diffTime) {
                return true;
            }
        } catch (Exception e) {

        }

        return false;
    }

    /*
     *	刷新保存得到的新网络请求数据
     */
    private static void onSaveUseDefaultInfo(String accessToken, String openId, String refreshToken, String refreshTokenTime) {
        AppActivity.s_strAccess_token = accessToken;
        AppActivity.s_strOpenid = openId;
        AppActivity.s_strRefresh_token = refreshToken;
        AppActivity.s_strRefresh_token_time = refreshTokenTime;

        Log.i(TAG, "AppActivity.s_strAccess_token = " + AppActivity.s_strAccess_token);
        Log.i(TAG, "AppActivity.s_strOpenid = " + AppActivity.s_strOpenid);
        Log.i(TAG, "AppActivity.s_strRefresh_token = " + AppActivity.s_strRefresh_token);
        Log.i(TAG, "AppActivity.s_strRefresh_token_time = " + AppActivity.s_strRefresh_token_time);
    }


    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        setIntent(intent);
        api.handleIntent(intent, this);
    }

}
