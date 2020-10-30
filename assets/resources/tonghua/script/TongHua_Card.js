
cc.Class({
    extends: cc.Component,

    properties: {
        
        _value:0,
        _atlas:null,
        _font:null,
    },

    init(atlas, cardTypeFont){
        this._atlas = atlas;
        this._font = cardTypeFont;
    },

    // --扑克数据 45张(除掉大小王，红桃2,梅花2,方块2, 红桃A,梅花A,方块A, 方块K,每人15张)
    // local CardData45=
    // {
    //     0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,0x1E,0x0F, --黑 3 - 2(15)
    //     0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D, --红
    //     0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D, --梅
    //     0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x3B,0x3C,      --方
    // }

    createCard(cardValue, node = null){
        let spr = null;
        if(node) {
            spr = node;
        } else {
            spr = new cc.Node();
            spr.addComponent(cc.Sprite);
        }

        let color = parseInt(cardValue / 0x10);
        let resColor = [3,2,1,0][color];
        let value = cardValue % 0x10;
        let resValue = (0x0D < value) ? (value-13) : (value);

        spr.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(resColor+"-"+resValue);

        let cardNumText = new cc.Node();
        cardNumText.name = "cardNumText";
        cardNumText.addComponent(cc.Label);
        cardNumText.getComponent(cc.Label).string = "";
        cardNumText.getComponent(cc.Label).fontSize = 36;
        cardNumText.getComponent(cc.Label).font = this._font;
        cardNumText.x = -40;
        cardNumText.y = -30;
        cardNumText.parent = spr;

        let cardTypeText = new cc.Node();
        cardTypeText.name = "cardTypeText";
        cardTypeText.addComponent(cc.Label);
        cardTypeText.getComponent(cc.Label).string = "";
        cardTypeText.getComponent(cc.Label).fontSize = 30;
        cardTypeText.getComponent(cc.Label).font = this._font;
        cardTypeText.x = -40;
        cardTypeText.y = -70;
        cardTypeText.parent = spr;
        
        spr.cardValue = cardValue;
        spr.isTouchSelect = false;
        spr.isSelect = false;

        return spr;
    },

    // // 创建牌
    // createCard(cardValue,type,showBg=false,node=null){
    //     let spr = null;
    //     if(node) {
    //         spr = node;
    //     } else {
    //         spr = new cc.Node();
    //         spr.addComponent(cc.Sprite);
    //     }

    //     this._value = cardValue;
    //     let value = cardValue%100;
    //     let sprName = "";
    //     if(showBg){
    //         if(type === 0){ // 大
    //             sprName = "hongheihu-imgs-cards-card_back_big";
    //         }
    //         else if(type === 1){ // 中
    //             sprName = "hongheihu-imgs-cards-card_black_middle";
    //         }
    //         else if(type === 2){ // 小
    //             sprName = "hongheihu-imgs-cards-card_black_small";
    //         }
    //         spr.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(sprName);
    //     }
    //     else{
    //         if(type === 0){ // 大
    //             sprName = cardValue>200?"hongheihu-imgs-cards-b_fp_card":"hongheihu-imgs-cards-s_fp_card";
    //         }
    //         else if(type === 1){ // 中
    //             sprName = cardValue>200?"hongheihu-imgs-cards-b_card":"hongheihu-imgs-cards-s_card";
    //         }
    //         else if(type === 2){ // 小
    //             sprName = cardValue>200?"hongheihu-imgs-cards-b_s_card":"hongheihu-imgs-cards-s_s_card";
    //         }
    //         spr.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(sprName+value);
    //     }
    //     spr.cardValue = cardValue;
    //     spr.active = true;
    //     return spr;
    // },

    changCardBg(node,isMoPai){
        node.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(isMoPai?"hongheihu-imgs-cards-card_light":"hongheihu-imgs-cards-card_light2");
    },

    start () {

    },

    // update (dt) {},
});
