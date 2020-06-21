// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


//房间配置
var SpeakerObj = function (data) {
    var obj = new Object;
    obj.speed = data.speed || 4; //速度，每0.05秒移动距离
    obj.level = data.level || 100; //优先级（逆序）， 越小优先级越高
    obj.count = data.count || 1; //播放次数
    obj.curCount = 0; //当前次数
    obj.time = (new Date()).getTime(); //用作排序，防止因优先级排序导致排序错乱
    obj.msg = data.msg || "推送缺少msg字段"; //显示内容
    obj.playername = data.playername; //发送名称
    obj.type = data.type;
    return obj;
};

cc.Class({
    extends: cc.Component,

    statics: {
        _cache_count_limit: 10,  //缓存条数限制，超过把队列前面的(优先级最低的)挤掉
        _game_list: null,        // 游戏公告
        _system_list:null,       // 系统公告
        _all_list:null,          // 所有公告

        //初始化
        init: function () {
            //注册消息监听
            this.registerMsg();
            
        },

        //插入
        insertToList: function (speakerData) {
            // 系统公告
            if(speakerData.type === 1){
                this._system_list = this._system_list || [];
                this._system_list.push(SpeakerObj(speakerData));
            }
            else if(speakerData.type === 2){
                this._game_list = this._game_list || [];
                this._game_list.push(SpeakerObj(speakerData));
            }

            this._all_list = this._all_list || [];
            this._all_list.push(SpeakerObj(speakerData));
            //清除超过限制
            this.deleteOver(speakerData.type === 1?this._system_list:this._game_list);
            //排序
            this.sortList(speakerData.type === 1?this._system_list:this._game_list);

            // 清理所有公告列表
            this.deleteOver(this._all_list);
            this.sortList(this._all_list);
        },

        //获取下一个
        /*
        @param type 1:系统公告 2:游戏公告 3：所有公告
         */
        getNextFromList: function (type=3) {
            let list = null;
            if(type===1){
                if (!this._system_list || this._system_list.length <= 0) return null;
                list = this._system_list;
            }
            else if(type===2){
                if (!this._game_list || this._game_list.length <= 0) return null;
                list = this._game_list;
            }
            else  {
                if (!this._all_list || this._all_list.length <= 0) return null;
                list = this._all_list;
            }

            var sObj = list[0];
            if (sObj.count - sObj.curCount <= 1) {
                sObj = list.shift(); //删除并返回第一个
            }
            sObj.curCount ++;

            // 不是获取所有公告
            if(type!==3){

            }
            else{
                if(sObj.type === 1) this.delMsg(this._system_list,sObj);
                else if(sObj.type === 2) this.delMsg(this._game_list,sObj);
            }
            return sObj;
        },

        delMsg(list,obj){
            for(let i=0;i<list.length;++i){
                if(list[i] === obj){
                    list.splice(i,1);
                    break;
                }
            }
        },


        //排序
        sortList: function (list) {
            list.sort((obj1, obj2)=>{
                if (obj1.level == obj2.level) {
                    return obj1.time - obj2.time;
                }
                return obj1.level - obj2.level;
            });
        },

        //删除多余的（超过限制数的）
        deleteOver: function (list) {
            var delCount = list.length - this._cache_count_limit;
            if (delCount <= 0) return;

            //根据优先级，时间，排序被删除权重
            list.sort((obj1, obj2)=>{
                if (obj1.level == obj2.level) {
                    return obj1.time - obj2.time; //逆序，优先级相同，先插入的，先移除
                }
                return -(obj1.level - obj2.level);  //正序，优先级高的排后
            });

            //清除多余的
            list.splice(0, delCount);
        },

        //清空
        clearList: function () {
            this._game_list = null;
            this._system_list = null;
            this._all_list = null;
        },

        //注册消息
        registerMsg: function () {
            cc.vv.NetManager.registerMsg(MsgId.GLOBAL_SPEAKER_NOTIFY, this.onRcvNetSpeakerNotify, this); //接收喇叭通知
        },

        //接收喇叭通知
        onRcvNetSpeakerNotify: function (msgDic) {
            if (msgDic.code === 200) {
                this.insertToList(msgDic.notices);
            }
        },

        // Todo ...
    },
});
