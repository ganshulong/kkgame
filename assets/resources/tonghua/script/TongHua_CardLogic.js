
cc.Class({
    extends: cc.Component,

    properties: {
    },

    arrangeCard(cards){
        let card2DList = [];
        for (let i = 0; i < 0x10; i++) {
            card2DList.push([]);
        }
        for (let i = 0; i < cards.length; i++) {
            card2DList[cards[i]%0x10].push(cards[i]);
        }
        return card2DList;
    }, 

    GetCardGroupsInfo(cards){
        cards.sort((a,b)=>{
            if ((a%0x10) == (b%0x10)) {
                return a - b;
            } else {
                return (a%0x10) - (b%0x10);
            }
        });
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

        //同花
        let conf = cc.vv.gameData.getRoomConf();
        let tongHuaMinCardNum = (8 < conf.param1) ? 5 : 4;
        let card2DListEx = [];
        let otherCards = [];
        for (let i = 0; i < card2DList.length; i++) {
            if (tongHuaMinCardNum <= card2DList[i].length) {
                card2DListEx.push(card2DList[i]);
            } else {
                for (let j = 0; j < card2DList[i].length; j++) {
                    otherCards.push(card2DList[i][j]);
                }
            }
        }
        card2DListEx.sort((a,b)=>{
            return a.length - b.length;
        });
        let tongHuaNum = card2DListEx.length;

        let arrangeCard = this.arrangeCard(otherCards);
        arrangeCard.sort((a,b)=>{
            return a.length - b.length;
        });
        for (let i = 0; i < arrangeCard.length; i++) {
            if (0 < arrangeCard[i].length) {
                card2DListEx.push(arrangeCard[i]);
            }
        }

        return {card2DListEx:card2DListEx, tongHuaNum:tongHuaNum};
    },
});
