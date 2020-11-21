
cc.Class({
    extends: cc.Component,

    properties: {
    },

    GetCardGroupsInfo(cards){
        cards.sort((a,b)=>{
            if ((a%0x10) == (b%0x10)) {
                return - (a - b);       //0x0?黑桃  0x1?红桃  0x2?梅花  0x3?方块  
            } else {
                return (a%0x10) - (b%0x10);
            }
        });

        //同花
        let card2DList = [];
        let curCardList = [cards[0]];
        for (let i = 1; i < cards.length; i++) {
            if (cards[i] === curCardList[0]) {
                curCardList.push(cards[i]);
            } else {
                card2DList.push(curCardList);
                curCardList = [cards[i]];
            }
        }
        if (0 < curCardList.length) {
            card2DList.push(curCardList);
        }
        let conf = cc.vv.gameData.getRoomConf();
        let tongHuaMinCardNum = (8 < conf.param1) ? 5 : 4;
        let card2DListTongHua = [];
        let otherCards = [];
        for (let i = 0; i < card2DList.length; i++) {
            if (tongHuaMinCardNum <= card2DList[i].length) {
                card2DListTongHua.push(card2DList[i]);
            } else {
                for (let j = 0; j < card2DList[i].length; j++) {
                    otherCards.push(card2DList[i][j]);
                }
            }
        }
        card2DListTongHua.sort((a,b)=>{
            return a.length - b.length;
        });
        let tongHuaNum = card2DListTongHua.length;

        //其他(炸弹)
        let card2DListOther = [];
        curCardList = [otherCards[0]];
        for (let i = 1; i < otherCards.length; i++) {
            if ((otherCards[i]%0x10) === (curCardList[0]%0x10)) {
                curCardList.push(otherCards[i]);
            } else {
                card2DListOther.push(curCardList);
                curCardList = [otherCards[i]];
            }
        }
        if (0 < curCardList.length) {
            card2DListOther.push(curCardList);
        }
        card2DListOther.sort((a,b)=>{
            return a.length - b.length;
        });

        for (let i = 0; i < card2DListOther.length; i++) {
            card2DListTongHua.push(card2DListOther[i]);
        }

        return {card2DListEx:card2DListTongHua, tongHuaNum:tongHuaNum};
    },
});