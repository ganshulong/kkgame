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

        btn_close: cc.Button,
        btn_sure: cc.Button,
        btn_cancel: cc.Button,
        lbl_content: cc.Label,

        _sure_btn_posx: 0,
        _cancel_btn_posx: 0,
        _center_posx: 0,

        _sureBtnCb: null,
        _cancelBtnCb: null,
        _closeBtnCb: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.setLocalZOrder(Global.CONST_NUM.HIGHT_ZORDER);

    },

    start () {
        this.setScale();
    },

    setScale(){
        var canvasNode = cc.find('Canvas');

        var frameWidth = canvasNode.width;
        var frameHeight = canvasNode.height;
        // var canvas = canvasNode.getComponent(cc.Canvas);
        // var designWidth = canvas.designResolution.width;
        // var designHeight = canvas.designResolution.height;

        // let curDesignSize = cc.view.getDesignResolutionSize ()

        let xScale = frameWidth / Global.designSize.width
        let yScale = frameHeight / Global.designSize.height
        if(canvasNode.width>canvasNode.height){
            this.node.scaleX = 0.9;
            this.node.scaleY = 0.9;
        }
        else{
            this.node.scaleX = 0.7;
            this.node.scaleY = 0.7;
        }
    },
    //update (dt) {},
    init(){
        //保存按钮位置
        this._sure_btn_posx = this.btn_sure.node.x;
        this._cancel_btn_posx = this.btn_cancel.node.x;
        this._center_posx = this._cancel_btn_posx + (this._sure_btn_posx - this._cancel_btn_posx)*0.5;
    },


    onEnable () {
        this.node.x = cc.director.getWinSize().width/2;
        this.node.y = cc.director.getWinSize().height/2;
    },

    showTips: function (tips, sureCb) {
        this.init();
        this.hideBtns();
        this.lbl_content.string = (tips && tips.length > 0) ? tips : '请传入提示内容！';

        this.btn_sure.node.active = true;
        this.btn_sure.node.x = this._center_posx;
        if (sureCb) {
            this._sureBtnCb = sureCb
        }
    },

    show: function (tips, sureCb, cancelCb, isShowCloseBtn, closeCb) {
        this.setScale();
        this.init();
        this.hideBtns();
        this.lbl_content.string = (tips && tips.length > 0) ? tips : '请传入提示内容！';
        if (sureCb) {
            this._sureBtnCb = sureCb;
            this.btn_sure.node.active = true;
            this.btn_sure.node.x = cancelCb ? this._sure_btn_posx : this._center_posx;
        }
       
        if (cancelCb) {
            this._cancelBtnCb = cancelCb;
            this.btn_cancel.node.active = true;
            this.btn_cancel.node.x = this._cancel_btn_posx;
        }

        if (isShowCloseBtn) {
            this.btn_close.node.active = true;
            if (closeCb) {
                this._closeBtnCb = closeCb;
            }
        }
    },

    hideBtns: function () {
        this.btn_close.node.active = false;
        this.btn_cancel.node.active = false;
        this.btn_sure.node.active = false;

        //事件也重置
        this._closeBtnCb = null
        this._sureBtnCb = null
        this._cancelBtnCb = null

    },

    onCloseBtnClicked: function () {
        Global.playEff(Global.SOUNDS.eff_ui_close);
        if (this._closeBtnCb) {
            this._closeBtnCb();
        }
        this.node.removeFromParent();
    },

    onSureBtnClicked: function () {
        Global.playEff(Global.SOUNDS.eff_click);
        if (this._sureBtnCb) {
            this._sureBtnCb();
        }
        this.node.removeFromParent();
    },

    onCancelBtnClicked: function () {
        Global.playEff(Global.SOUNDS.eff_click);

        if (this._cancelBtnCb) {
            this._cancelBtnCb();
        }
        this.node.removeFromParent();
    },
});
