/*
** 点击特效监听器
** 主要是针对点击屏幕，触发点击特效
*/

cc.Class({
    extends: cc.Component,

    properties: {
        prefab_ClickEffect: cc.Prefab,

        _startPos: null, //开始触碰位置
        _isClickEffective: false, //当前点击是有效的
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //监听函数
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.node._touchListener.setSwallowTouches(false);
        this.node.zIndex = 100;
    },

    onTouchStart: function (event) {
        this._isClickEffective = true;
        this._startPos = event.touch.getLocation();

        // this.node.dispatchEvent(event);
    },

    onTouchMove: function (event) {
        let pos = event.touch.getLocation();
        if (Math.abs(pos.x - this._startPos.x) > 8 || Math.abs(pos.y - this._startPos.y) > 8) {
            this._isClickEffective = false;
        }

        // this.node.emit(event.type, event.detail);
    },

    onTouchEnd: function (event) {
        if (this._isClickEffective) {
            let wldPos = event.touch.getLocation();
            this.playClickEff(wldPos);
        }
        // this.node.dispatchEvent(event);
    },

    onTouchCancel: function (event) {
        this._isClickEffective = false;
    },

    playClickEff: function (wldPos) {
        let nodePos = this.node.convertToNodeSpaceAR(wldPos);

        let prefabNode = cc.instantiate(this.prefab_ClickEffect);
        prefabNode.position = nodePos;
        this.node.addChild(prefabNode);

        prefabNode.runAction(cc.sequence(cc.delayTime(0.5), cc.removeSelf()));
    },

});
