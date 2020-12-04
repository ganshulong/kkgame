
cc.Class({
    extends: cc.Component,

    properties: {
        
        _value:0,
        _atlas:null,
    },

    init(atlas, starSpr, maxCardSpr){
        this._atlas = atlas;
        this._starSpr = starSpr;
        this._maxCardSpr = maxCardSpr;
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
        let resValue = (cardValue % 0x10);
        spr.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(resColor+"-"+resValue);
        spr.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.CUSTOM;
        spr.width = cc.vv.gameData.CardWidth;
        spr.height = cc.vv.gameData.CardHeight;

        if (cc.vv.gameData.getIsZhuCard(cardValue)) {
            this.showZhuStarSpr(spr);
        } else {
            spr.isZhuCard = false;
        }

        this.setMaxCardSpr(spr);

        spr.cardValue = cardValue;
        spr.isTouchSelect = false;
        spr.isSelect = false;

        return spr;
    },

    showZhuStarSpr(node){
        let starSpr = new cc.Node();
        starSpr.name = "starSpr";
        starSpr.addComponent(cc.Sprite);
        starSpr.getComponent(cc.Sprite).spriteFrame = this._starSpr;
        starSpr.x = -40;
        starSpr.y = -60;
        starSpr.parent = node;
        node.isZhuCard = true;
    },

    setMaxCardSpr(node){
        let maxCardSpr = new cc.Node();
        maxCardSpr.name = "maxCardSpr";
        maxCardSpr.addComponent(cc.Sprite);
        maxCardSpr.getComponent(cc.Sprite).spriteFrame = this._maxCardSpr;
        maxCardSpr.scale = 1.4;
        maxCardSpr.x = 38;
        maxCardSpr.y = 72;
        maxCardSpr.parent = node;
        maxCardSpr.active = false;
    },
    
    changCardBg(node,isMoPai){
        node.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(isMoPai?"hongheihu-imgs-cards-card_light":"hongheihu-imgs-cards-card_light2");
    },

    start () {

    },

    // update (dt) {},
});
