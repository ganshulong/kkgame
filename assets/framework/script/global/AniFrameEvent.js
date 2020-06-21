/*
通用的动画帧事件监听
需要挂载到动画节点上
动画的帧事件回调到以后，各自定义一个event发送出去，需要处理的地方监听这个event
*/
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    //大厅开红包的显示金币
    showCoins:function(){
        Global.dispatchEvent(EventId.HALL_EFF_SHOWCOINS,1);
    },

    
    

    // update (dt) {},
});
