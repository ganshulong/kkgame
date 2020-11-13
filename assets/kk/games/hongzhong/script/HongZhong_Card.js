
cc.Class({
    extends: cc.Component,

    properties: {
    },

    init(atlas){
        this.prefabResCard = cc.find("prefabRes/card",this.node);
    },

    // 创建牌
    createCard(cardValue, bBIgCard=false, showBg=false, node=null){
        let spr = null;
        if(node) {
            spr = node;
        } else {
            spr = new cc.Node();
            spr.addComponent(cc.Sprite);
        }
        spr.cardValue = cardValue;

        let sprName = "";
        if (0 == cardValue || showBg) {
            sprName = "play_img-cards-right_1-img_face_angang_1";
        } else {
            if (bBIgCard) {
                sprName = "play_img-cards-mine_1-play_img_cards_mine";
            } else {
                sprName = "play_img-cards-out_1-play_img_cards_out";
            }
            sprName += ("_" + parseInt(cardValue / 10));
            sprName += ("_" + (cardValue % 10));
        }
        let prefabResNode = this.prefabResCard.getChildByName(sprName);
        spr.getComponent(cc.Sprite).spriteFrame = prefabResNode.getComponent(cc.Sprite).spriteFrame;
        if (35 === cardValue) {
            let magicCardMask = new cc.Node();
            magicCardMask.addComponent(cc.Sprite);
            let img_lai_lai = this.prefabResCard.getChildByName("img_lai_lai");
            magicCardMask.getComponent(cc.Sprite).spriteFrame = img_lai_lai.getComponent(cc.Sprite).spriteFrame;
            magicCardMask.parent = spr;
            if (bBIgCard) {
                magicCardMask.scale = 1;
                magicCardMask.position = cc.v2(-14, 32);
            } else {
                magicCardMask.scale = 0.5;
                magicCardMask.position = cc.v2(-6.5, 20);
            }
        }

        spr.active = true;
        return spr;
    },

    changCardBg(node,isMoPai){
        // node.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(isMoPai?"hongheihu-imgs-cards-card_light":"hongheihu-imgs-cards-card_light2");
    },

    start () {

    },

    // update (dt) {},
});
