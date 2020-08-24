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
        _value:0,
        _atlas:null,
    },

    // LIFE-CYCLE CALLBACKS:

    init(atlas){
        this._atlas = atlas;
        this.prefabResCard = cc.find("prefabRes/card",this.node);
    },

    // onLoad () {},
    // 创建牌
    createCard(cardValue,type,showBg=false,node=null){
        let spr = null;
        if(node) {
            spr = node;
        } else {
            spr = new cc.Node();
            spr.addComponent(cc.Sprite);
        }

        this._value = cardValue;
        let value = cardValue%100;
        let sprName = "";
        if(showBg){
            if(type === 0){ // 大
                sprName = "hongheihu-imgs-cards-card_back_big";
            }
            else if(type === 1){ // 中
                sprName = "hongheihu-imgs-cards-card_black_middle";
            }
            else if(type === 2){ // 小
                sprName = "hongheihu-imgs-cards-card_black_small";
            }
            // spr.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(sprName);
            let prefabResNode = this.prefabResCard.getChildByName(sprName);
            spr.getComponent(cc.Sprite).spriteFrame = prefabResNode.getComponent(cc.Sprite).spriteFrame;
        }
        else{
            if(type === 0){ // 大
                sprName = cardValue>200?"hongheihu-imgs-cards-b_fp_card":"hongheihu-imgs-cards-s_fp_card";
            }
            else if(type === 1){ // 中
                sprName = cardValue>200?"hongheihu-imgs-cards-b_card":"hongheihu-imgs-cards-s_card";
            }
            else if(type === 2){ // 小
                sprName = cardValue>200?"hongheihu-imgs-cards-b_s_card":"hongheihu-imgs-cards-s_s_card";
            }
            // spr.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(sprName+value);
            let prefabResNode = this.prefabResCard.getChildByName(sprName+value);
            spr.getComponent(cc.Sprite).spriteFrame = prefabResNode.getComponent(cc.Sprite).spriteFrame;
        }
        spr.cardValue = cardValue;
        spr.active = true;
        return spr;
    },

    changCardBg(node,isMoPai){
        node.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(isMoPai?"hongheihu-imgs-cards-card_light":"hongheihu-imgs-cards-card_light2");
    },

    start () {

    },

    // update (dt) {},
});
