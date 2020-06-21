// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        spr_bg: cc.Node, //背景
        mask_node: cc.Node, //遮盖节点
        rich_roll: cc.RichText, //滚动RichText
        type:3,         // 是否是系统公告
        move_px: {
            default: 4,
            displayName: '每0.05秒移动的像素',
        },

        _cur_time: 0,
        _enabled_update: false, //激活自身
        _timeoutId: null, //定时器
        _isShow:false,           // 是否显示
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        this.node.x = cc.director.getWinSize().width/2;
        this.node.y = cc.director.getWinSize().height+this.spr_bg.height/2;
        this.rich_roll.string = ''; //把默认的清除掉
        this.spr_bg.active = false; //隐藏喇叭背景

        /* cc.vv.SpeakerMgr.insertToList({level:5, count:2, msg:'这是最先插入的优先级为5的喇叭消息！'});

         setTimeout(function () {
             cc.vv.SpeakerMgr.insertToList({level:2, count:2, msg:'这是优先级为2的喇叭消息！'});
             // cc.vv.SpeakerMgr.insertToList({level:1, count:2, msg:'这是优先级为1的喇叭消息！'});
             // cc.vv.SpeakerMgr.insertToList({level:3, count:2, msg:'这是优先级为3的喇叭消息！'});
         }, 60*1000);*/

        if (Global.isNative()) {
            this._timeoutId = setTimeout(() => {
                this._enabled_update = true;
                this.removeTimeout();
            }, 1000);
        } else {
            this._timeoutId = setTimeout(() => {
                this._enabled_update = true;
                this.removeTimeout();
            }, 3 * 1000); //浏览器较卡
        }
    },

    onDisable() {
        this.removeTimeout();
    },

    show(bShow){
       this._isShow = bShow;
       this.spr_bg.active = this._isShow;
    },


    update(dt) {
        if(cc.vv.SpeakerMgr){
            if (!this._enabled_update) return; //未激活
            //大厅中才显示，游戏内不显示
            this._cur_time += dt;
            if (this.spr_bg.active) {
                if (this._cur_time > 0.05) {
                    this._cur_time -= 0.05;
                    this.rich_roll.node.x -= this.move_px;
                    if (this.rich_roll.node.x + this.rich_roll.node.width < -10) {
                        this.startNextRoll();
                    }
                }
            } else {
                if (this._cur_time > 2.0) {
                    this._cur_time -= 2.0;
                    this.startNextRoll();
                }
            }
        }
    },

    //开始下一个滚动
    startNextRoll: function () {
        var speakerObjData = cc.vv.SpeakerMgr.getNextFromList(this.type);
        if (speakerObjData) {
            this.spr_bg.active = true;

            this.show(true);

            //cc.warn(this.rich_roll.maxWidth);
            this.rich_roll.maxWidth = 0;        //设置为0，不换行
            this.rich_roll.string = speakerObjData.msg;
            this._cur_time = 0;
            this.move_px = speakerObjData.speed;
            this.rich_roll.node.x = this.mask_node.width + 10;
        } else {
            this.show(false);
        }
    },

    removeTimeout: function () {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
    },
});
