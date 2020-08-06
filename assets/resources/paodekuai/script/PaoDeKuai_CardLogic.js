
cc.Class({
    extends: cc.Component,

    properties: {
    },

    init(){
        this.CARDTYPE = {
            ERROR_CARDS     : 0,    //错误牌型
            SINGLE_CARD     : 1,    //单牌
            DOUBLE_CARD     : 2,    //对子
            THREE_CARD      : 3,    //3带0
            THREE_ONE_CARD  : 4,    //3带1
            THREE_TWO_CARD  : 5,    //3带2
            BOMB_ONE_CARD   : 6,    //四个带1张单牌
            BOMB_TWO_CARD   : 7,    //四个带2张单牌
            BOMB_THREE_CARD : 8,    //四个带3张单牌
            CONNECT_CARD    : 9,    //连牌
            COMPANY_CARD    : 10,   //连队
            AIRCRAFT        : 11,   //飞机
            BOMB_CARD       : 12,   //炸弹
            KINGBOMB_CARD   : 13,   //王炸
        };
    },

    checkCardIsCanOut(cards, handCardNum, curaction){
        cards.sort((a,b)=>{
            if ((a%0x10) == (b%0x10)) {
                return a - b;
            } else {
                return (a%0x10) - (b%0x10);
            }
        });
        let card2DList = this.arrangeCard(cards);

        let lastCardValue = 0;
        if (0 < curaction.outCards.length){
            lastCardValue = curaction.outCards[0] % 0x10;
        }

        switch(curaction.cardType) {
            case this.CARDTYPE.ERROR_CARDS:
                return this.getCardType(cards, card2DList, handCardNum, lastCardValue);
                break;
            case this.CARDTYPE.SINGLE_CARD:
                return this.getSingle(cards, lastCardValue);
                break;
            case this.CARDTYPE.DOUBLE_CARD:
                return this.getDouble(cards, lastCardValue);
                break;
            case this.CARDTYPE.THREE_CARD:
                return this.getThree(cards, card2DList, handCardNum, lastCardValue);
                break;
            case this.CARDTYPE.THREE_ONE_CARD:
                return this.getThreeOne(cards, card2DList, handCardNum, lastCardValue);
                break;
            case this.CARDTYPE.THREE_TWO_CARD:
                return this.getThreeTwo(cards, card2DList, lastCardValue);
                break;
            case this.CARDTYPE.BOMB_ONE_CARD:
                return this.getBombOne(cards, card2DList, handCardNum, lastCardValue);
                break;
            case this.CARDTYPE.BOMB_TWO_CARD:
                return this.getBombTwo(cards, card2DList, handCardNum, lastCardValue);
                break;
            case this.CARDTYPE.BOMB_THREE_CARD:
                return this.getBombThree(cards, card2DList, lastCardValue);
                break;
            // case this.CARDTYPE.CONNECT_CARD:
            //     return this.getConnect(cards, card2DList, handCardNum, lastCardValue);
            //     break;
            // case this.CARDTYPE.COMPANY_CARD:
            //     return this.getCompany(cards, card2DList, handCardNum, lastCardValue);
            //     break;
            // case this.CARDTYPE.AIRCRAFT:
            //     return this.getAircrafy(cards, card2DList, handCardNum, lastCardValue);
            //     break;
            // case this.CARDTYPE.BOMB_CARD:
            //     return this.getBomb(cards, card2DList, handCardNum, lastCardValue);
            //     break;
            // case this.CARDTYPE.KINGBOMB_CARD:
            //     return this.getKingBomb(cards, card2DList, handCardNum, lastCardValue);
            //     break;
        } 
        return [];
    },

    getCardType(cards, card2DList, handCardNum, lastCardValue){
        let typeCards = this.getSingle(cards, lastCardValue);
        if (typeCards.length) {
            return typeCards;
        }
        typeCards = this.getDouble(cards, lastCardValue);
        if (typeCards.length) {
            return typeCards;
        }
        typeCards = this.getThree(cards, card2DList, handCardNum, lastCardValue);
        if (typeCards.length) {
            return typeCards;
        }
        typeCards = this.getThreeOne(cards, card2DList, handCardNum, lastCardValue);
        if (typeCards.length) {
            return typeCards;
        }
        typeCards = this.getThreeTwo(cards, card2DList, lastCardValue);
        if (typeCards.length) {
            return typeCards;
        }
        typeCards = this.getBombOne(cards, card2DList, handCardNum, lastCardValue);
        if (typeCards.length) {
            return typeCards;
        }
        typeCards = this.getBombTwo(cards, card2DList, handCardNum, lastCardValue);
        if (typeCards.length) {
            return typeCards;
        }
        typeCards = this.getBombThree(cards, card2DList, lastCardValue);
        if (typeCards.length) {
            return typeCards;
        }
        // typeCards = this.getConnect(cards, card2DList, lastCardValue);
        // if (typeCards.length) {
        //     return typeCards;
        // }
        // typeCards = this.getCompany(cards, card2DList, lastCardValue);
        // if (typeCards.length) {
        //     return typeCards;
        // }
        // typeCards = this.getAircrafy(cards, card2DList, handCardNum, lastCardValue);
        // if (typeCards.length) {
        //     return typeCards;
        // }
        // typeCards = this.getBomb(cards, card2DList, lastCardValue);
        // if (typeCards.length) {
        //     return typeCards;
        // }
        // typeCards = this.getKingBomb(cards, card2DList, lastCardValue);
        // if (typeCards.length) {
        //     return typeCards;
        // }

        return [];
    },

    getSingle(cards, lastCardValue){
        if (1 === cards.length) {
            if (cards[0] % 0x10 > lastCardValue) {
                return cards;
            }
        }
        return [];
    },

    getDouble(cards, lastCardValue){
        if (2 === cards.length) {
            if (cards[0] % 0x10 === cards[1] % 0x10) {
                if (cards[0] % 0x10 > lastCardValue) {
                    return cards;
                }
            }
        }
        return [];
    },

    getThree(cards, card2DList, handCardNum, lastCardValue){
        if (3 === cards.length && 3 === handCardNum) {
            for (let i = 0; i < card2DList.length; i++) {
                if (3 === card2DList[i].length && card2DList[i][0] % 0x10 > lastCardValue) {
                    return cards;
                }
            }
        }
        return [];
    },

    getThreeOne(cards, card2DList, handCardNum, lastCardValue){
        if (4 === cards.length && 4 === handCardNum) {
            for (let i = 0; i < card2DList.length; i++) {
                if (3 === card2DList[i].length && card2DList[i][0] % 0x10 > lastCardValue) {
                    let typeCards = card2DList[i];
                    let takeCards =  this.getTakeCards(typeCards, cards);
                    for (var t = 0; t < takeCards.length; t++) {
                        typeCards.push(takeCards[t]);
                    }
                    return typeCards;
                }
            }
        }
        return [];
    },

    getThreeTwo(cards, card2DList, lastCardValue){
        if (5 === cards.length) {
            for (let i = 0; i < card2DList.length; i++) {
                if (3 === card2DList[i].length && card2DList[i][0] % 0x10 > lastCardValue) {
                    let typeCards = card2DList[i];
                    let takeCards =  this.getTakeCards(typeCards, cards);
                    for (var t = 0; t < takeCards.length; t++) {
                        typeCards.push(takeCards[t]);
                    }
                    return typeCards;
                }
            }
        }
        return [];
    },

    getBombOne(cards, card2DList, handCardNum, lastCardValue){
        if (5 === cards.length && 5 === handCardNum) {
            for (let i = 0; i < card2DList.length; i++) {
                if (4 === card2DList[i].length && card2DList[i][0] % 0x10 > lastCardValue) {
                    let typeCards = card2DList[i];
                    let takeCards =  this.getTakeCards(typeCards, cards);
                    for (var t = 0; t < takeCards.length; t++) {
                        typeCards.push(takeCards[t]);
                    }
                    return typeCards;
                }
            }
        }
        return [];
    },

    getBombTwo(cards, card2DList, handCardNum, lastCardValue){
        if (6 === cards.length && 6 === handCardNum) {
            for (let i = 0; i < card2DList.length; i++) {
                if (4 === card2DList[i].length && card2DList[i][0] % 0x10 > lastCardValue) {
                    let typeCards = card2DList[i];
                    let takeCards =  this.getTakeCards(typeCards, cards);
                    for (var t = 0; t < takeCards.length; t++) {
                        typeCards.push(takeCards[t]);
                    }
                    return typeCards;
                }
            }
        }
        return [];
    },

    getBombThree(cards, card2DList, lastCardValue){
        if (7 === cards.length) {
            for (let i = 0; i < card2DList.length; i++) {
                if (4 === card2DList[i].length && card2DList[i][0] % 0x10 > lastCardValue) {
                    let typeCards = card2DList[i];
                    let takeCards =  this.getTakeCards(typeCards, cards);
                    for (var t = 0; t < takeCards.length; t++) {
                        typeCards.push(takeCards[t]);
                    }
                    return typeCards;
                }
            }
        }
        return [];
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

    getTakeCards(mainCards, allCards){
        let takeCards = [];
        for (let i = 0; i < allCards.length; i++) {
            let j = 0;
            for (j = 0; j < mainCards.length; j++) {
                if (allCards[i] === mainCards[j]) {
                    break;
                }
            }
            if (j === mainCards.length) {
                takeCards.push(allCards[i]);
            }
        }
        return takeCards;
    },
 
});
