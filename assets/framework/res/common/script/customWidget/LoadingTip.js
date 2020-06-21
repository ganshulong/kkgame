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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        node_loading: cc.Node,
        lbl_tips: cc.Label,

        _timeoutTimer_0: null,
        _timeoutTimer_1: null,

        _isLongShow: false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //先隐藏提示
        this.lbl_tips.node.active = false;
        this.node_loading.active = false;

        // //设置为常驻对象
        // Global.addPersistNode(this.node);
        //设置自身位置
        this.node.position = Global.centerPos;
        //隐藏自身
        this.node.active = false;
        cc.vv.LoadingTip = this;
    },

    start () {},

    // update (dt) {},

    onEnable () {
        this.node.x = cc.director.getWinSize().width/2;
        this.node.y = cc.director.getWinSize().height/2;
    },

    show: function (tips, isLongShow) {
        var self = this;
        if (this._isLongShow) return; //已经有长时间显示的提示
        this._isLongShow = isLongShow;

        this.node.active = true;
        if (tips && typeof(tips) == 'string') {
            this.node_loading.active = true;

            this.lbl_tips.string = tips;
            this.lbl_tips.node.active = true;
        }
        else {            
            //没有提示信息，消息阻塞2秒
            if (this._timeoutTimer_0 == null) {
                this._timeoutTimer_0 = setTimeout(function () {
                    self.node_loading.active = true;
                },2000);
            }

            if (this._isLongShow) return; //长时间显示，不会自动隐藏
            //20秒后隐藏阻塞，便于用户重新操作
            if (this._timeoutTimer_1) {
                clearTimeout(this._timeoutTimer_1);
                this._timeoutTimer_1 = null;
            }
            this._timeoutTimer_1 = setTimeout(this.hide.bind(this), 20*1000);
        }
    },  

    //force，强制隐藏（当长时间显示时，需要强制隐藏）
    hide: function (delay, force) {
        var self = this;

        var hideself = function () {
            if (self._isLongShow && !force) return;
            self._isLongShow = false;

            self.node.active = false;
            self.lbl_tips.node.active = false;
            self.node_loading.active = false;

            if (self._timeoutTimer_0) {
                clearTimeout(self._timeoutTimer_0);
                self._timeoutTimer_0 = null;
            }

            if (self._timeoutTimer_1) {
                clearTimeout(self._timeoutTimer_1);
                self._timeoutTimer_1 = null;
            }
        }

        if (delay) { //延迟隐藏
            this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(hideself)));
        }
        else {
            hideself();
        }
    },

});
