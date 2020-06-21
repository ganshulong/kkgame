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
        _prefab:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init(prefab){
        this._prefab = prefab;
    },

    showTips: function (tips, sureCb){
        let preNode = cc.director.getScene().getChildByName("node_alterview")
        if(preNode){
            preNode.removeFromParent()
        }
        let node = cc.instantiate(this._prefab);
        node.name = "node_alterview"
        node.getComponent("AlertView").showTips(tips, sureCb);
        cc.director.getScene().addChild(node)
    },

    show: function (tips, sureCb, cancelCb, isShowCloseBtn, closeCb){
        let preNode = cc.director.getScene().getChildByName("node_alterview")
        if(preNode){
            preNode.removeFromParent()
        }
        let node = cc.instantiate(this._prefab);
        node.name = "node_alterview"
        node.getComponent("AlertView").show(tips, sureCb, cancelCb, isShowCloseBtn, closeCb);
        cc.director.getScene().addChild(node)
    },

    start () {

    },

    // update (dt) {},
});
