/*
** 支付管理
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
            cc.vv.NetManager.registerMsg(MsgId.PURCHASE_CHECK_ORDER, this.onRcvMsgCheckOrder.bind(this));

        },

        //sdk充值完成，发送协议给服务端校验
        sendCheckOrder: function(data){

            cc.vv.LoadingTip.hide(0.1, true);

            var req = null
            if(Global.isAndroid()){
                //google pay 回调
                var strResult = data.result
                if(strResult === "1"){
                    var msg = data.message
                    var sign = data.signature
                    var pid = data.pid

                    req = {c:MsgId.PURCHASE_CHECK_ORDER}
                    req.orderid = ""//通过透传参数传到服务端，这里就不传了
                    req.platform = 1
                    req.data = msg
                    req.sign = sign
                }
                else {
                    //支付异常
                    var strErr = data.errInfo
                    cc.vv.FloatTip.show(strErr)
                }
                
                

            }
            else if(Global.isIOS()){
                //apple pay 回调
                var receipt = data.receipt
                var orderid  = data.orderid
                
                req = {c:MsgId.PURCHASE_CHECK_ORDER}
                req.orderid = orderid
                req.platform = 2
                req.data = receipt
                req.sign = ''
            }

            if(req){
                cc.vv.NetManager.send(req)
            }
        },

        //补单
        doReplaceOrder: function(){
            var self = this
            if(Global.isIOS()){
                cc.vv.PlatformApiMgr.addCallback(self.paySdkReplacementCallback.bind(this),"paySdkReplacementCallback")
                var data = ""//空的字符
                cc.vv.PlatformApiMgr.SdkReplaceOrder(data)
            }
            
        },

        //支付校验成功
        onRcvMsgCheckOrder:function(msg){
            if(msg.code === 200){
                if(Global.isIOS()){
                    //删除订单缓存
                    var data = {}
                    data.Flag = msg.flag
                    data.OrderId = msg.orderid 
                    cc.vv.PlatformApiMgr.SdkDelOrderCache(JSON.stringify(data));
                }
            }
        },

        //补单回调
        paySdkReplacementCallback: function(data){
            var self = this
            self.sendCheckOrder(data)
        }

        
        
    }
});
