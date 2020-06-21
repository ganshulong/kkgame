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
        spr_bg: cc.Sprite,
        lbl_content: cc.Label,
        bg_sprire_frame: cc.SpriteFrame,
        _floatTipPrefab: null,
        _tips: "",
        _list: [],
        _topList: [],
    },

    // LIFE-CYCLE CALLBACKS:

    init(path) {
        cc.loader.loadRes(path, cc.Prefab, (err, prefab) => {
            if (err === null)
                this._floatTipPrefab = prefab;
        })
    },

    start() {

    },

    onEnable() {
        this.node.position = Global.centerPos;
    },

    clear() {
        this._list = [];
    },

    show: function (tips, isTop, color) {
        if (this._tips === tips) return;
        if (this._floatTipPrefab) {
            let node = null;
            if (isTop) {
                for (let i = 0; i < this._topList.length; ++i) {
                    if (!this._topList[i].active) {
                        node = this._topList[i];
                        break;
                    }
                }
            }
            else {

                for (let i = 0; i < this._list.length; ++i) {
                    if (!this._list[i].active) {
                        node = this._list[i];
                        break;
                    }
                }
            }
            if (node === null) {
                node = cc.instantiate(this._floatTipPrefab);
                if (isTop) this._topList.push(node);
                else this._list.push(node);
            }
            if (isTop) {
                if (node.parent === null) cc.game.addPersistRootNode(node);
                let canvas = cc.find("Canvas");
                let size = canvas.getComponent(cc.Canvas).designResolution;
                node.position = cc.v2(size.width / 2, size.height / 2);
            }
            else {
                if(node){
                    if (node.parent === null) cc.game.addPersistRootNode(node);
                    let canvas = cc.find("Canvas");
                    let size = canvas.getComponent(cc.Canvas).designResolution;
                    node.position = cc.v2(size.width / 2, size.height / 2);
                }
            }
            node.zIndex = Global.CONST_NUM.HIGHT_ZORDER;
            node.active = true;

            tips = tips + "";
            if (tips && typeof(tips) == 'string') {
                let content = cc.find("spr_bg/lbl_content", node).getComponent(cc.Label);
                content.string = tips;
                if (color) {
                    content.node.color = color;
                }
                else {
                    content.node.color = cc.Color.WHITE;
                }
            }

            var anim = node.getChildByName("spr_bg").getComponent(cc.Animation);
            if (anim) {
                anim.play('FloatTipMoveAndFade');
                anim.on("stop", () => {
                    node.active = false;
                    this._tips = "";
                });
            }
            else {
                node.runAction(cc.sequence(cc.delayTime(1.0), cc.callFunc(()=>{
                    node.active = false;
                    this._tips = "";
                })))
            }
        }

    },

    // update (dt) {},
});
