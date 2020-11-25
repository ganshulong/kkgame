
cc.Class({
    extends: cc.Component,

    properties: {
        
        _value:0,
        _atlas:null,
    },

    init(atlas){
        this._atlas = atlas;
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
        let resValue = (0x0D < value) ? (value-14) : (value-1);

        spr.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame("card_"+resColor+"_"+resValue);
        
        spr.cardValue = cardValue;
        spr.isTouchSelect = false;
        spr.isSelect = false;

        return spr;
    },
    
    changCardBg(node,isMoPai){
        node.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(isMoPai?"hongheihu-imgs-cards-card_light":"hongheihu-imgs-cards-card_light2");
    },

    start () {

    },

    // update (dt) {},
});
