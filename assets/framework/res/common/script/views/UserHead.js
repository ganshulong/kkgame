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
        headAtlas:cc.SpriteAtlas,
        sprHead:cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    setHeadUrl(url){
        if(cc.js.isString(url)){
            let index = url.indexOf("http");
            if(index>=0){
                this.sprHead.getComponent("ImageLoader").setUserHeadUrl(url,(spr)=>{
                    this.sprHead.getComponent(cc.Sprite).spriteFrame = spr;
                });
            }
            else this.sprHead.getComponent(cc.Sprite).spriteFrame = this.headAtlas.getSpriteFrame(Global.getHeadId(url));
        }
        else this.sprHead.getComponent(cc.Sprite).spriteFrame = this.headAtlas.getSpriteFrame(Global.getHeadId(url));
    },

    start () {

    },

    // update (dt) {},
});
