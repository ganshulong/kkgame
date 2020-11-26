
cc.Class({
    extends: cc.Component,

    properties: {
        
        _value:0,
        _atlas:null,
    },

    init(atlas, star){
        this._atlas = atlas;
        this._star = star;
    },

    // 0x32-0x35-0x3D : 黑桃2-黑桃5-黑桃k
    // 0x22-0x25-0x2D : 红桃2-红桃5-红桃k
    // 0x12-0x15-0x1D : 梅花2-梅花5-梅花k
    // 0x02-0x05-0x0D : 方块2-方块5-方块k

    createCard(cardValue, node = null){
        let spr = null;
        if(node) {
            spr = node;
        } else {
            spr = new cc.Node();
            spr.addComponent(cc.Sprite);
        }

        let resColor = parseInt(cardValue / 0x10);
        let resValue = (cardValue % 0x10 - 1);
        spr.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame("card_"+resColor+"_"+resValue);

        if (cc.vv.gameData.getIsZhuCar(cardValue)) {
            this.showZhuStar(spr);
        } else {
            spr.isZhuCard = false;
        }
        
        spr.cardValue = cardValue;
        spr.isTouchSelect = false;
        spr.isSelect = false;

        return spr;
    },

    showZhuStar(node){
        let starSpr = new cc.Node();
        starSpr.name = "starSpr";
        starSpr.addComponent(cc.Sprite);
        starSpr.getComponent(cc.Sprite).spriteFrame = this._star;
        starSpr.x = -40;
        starSpr.y = -60;
        starSpr.parent = node;
        node.isZhuCard = true;
    },
    
    changCardBg(node,isMoPai){
        node.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(isMoPai?"hongheihu-imgs-cards-card_light":"hongheihu-imgs-cards-card_light2");
    },

    start () {

    },

    // update (dt) {},
});
