
cc.Class({
    extends: cc.Component,

    properties: {
    },

    init(){
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
        let lastCardLength = 0;
        if (0 < curaction.outCards.length){
            lastCardValue = curaction.outCards[0] % 0x10;
            lastCardLength = curaction.outCards.length;
        }

        let typeCards = [];
        switch(curaction.cardType) {
            case cc.vv.gameData.CARDTYPE.ERROR_CARDS:
                return this.getCardType(cards, card2DList, handCardNum, lastCardValue, lastCardLength);
                break;
            case cc.vv.gameData.CARDTYPE.SINGLE_CARD:
                typeCards = this.getSingle(cards, lastCardValue);
                if (typeCards.length) {
                    return typeCards;
                }
                break;
            case cc.vv.gameData.CARDTYPE.DOUBLE_CARD:
                typeCards = this.getDouble(cards, lastCardValue);
                if (typeCards.length) {
                    return typeCards;
                }
                break;
            case cc.vv.gameData.CARDTYPE.THREE_CARD:
                typeCards = this.getThree(cards, card2DList, handCardNum, lastCardValue);
                if (typeCards.length) {
                    return typeCards;
                }
                break;
            case cc.vv.gameData.CARDTYPE.THREE_ONE_CARD:
                typeCards = this.getThreeOne(cards, card2DList, handCardNum, lastCardValue);
                if (typeCards.length) {
                    return typeCards;
                }
                break;
            case cc.vv.gameData.CARDTYPE.THREE_TWO_CARD:
                typeCards = this.getThreeTwo(cards, card2DList, lastCardValue);
                if (typeCards.length) {
                    return typeCards;
                }
                break;
            case cc.vv.gameData.CARDTYPE.BOMB_ONE_CARD:
                typeCards = this.getBombOne(cards, card2DList, handCardNum, lastCardValue);
                if (typeCards.length) {
                    return typeCards;
                }
                break;
            case cc.vv.gameData.CARDTYPE.BOMB_TWO_CARD:
                typeCards = this.getBombTwo(cards, card2DList, handCardNum, lastCardValue);
                if (typeCards.length) {
                    return typeCards;
                }
                break;
            case cc.vv.gameData.CARDTYPE.BOMB_THREE_CARD:
                typeCards = this.getBombThree(cards, card2DList, lastCardValue);
                if (typeCards.length) {
                    return typeCards;
                }
                break;
            case cc.vv.gameData.CARDTYPE.CONNECT_CARD:
                typeCards = this.getConnect(cards, lastCardValue, lastCardLength);
                if (typeCards.length) {
                    return typeCards;
                }
                break;
            case cc.vv.gameData.CARDTYPE.COMPANY_CARD:
                typeCards = this.getCompany(cards, card2DList, lastCardValue, lastCardLength);
                if (typeCards.length) {
                    return typeCards;
                }
                break;
            case cc.vv.gameData.CARDTYPE.AIRCRAFT:
                typeCards = this.getAircrafy(cards, card2DList, handCardNum, lastCardValue, lastCardLength);
                if (typeCards.length) {
                    return typeCards;
                }
                break;
            case cc.vv.gameData.CARDTYPE.BOMB_CARD:
                typeCards = this.getBomb(cards, lastCardValue);
                if (typeCards.length) {
                    return typeCards;
                }
                break;
            // case cc.vv.gameData.CARDTYPE.KINGBOMB_CARD:
            //     return this.getKingBomb(cards);
            //     break;
        } 
        if (curaction.cardType < cc.vv.gameData.CARDTYPE.BOMB_CARD) {
            typeCards = this.getBomb(cards, 0);
            if (typeCards.length) {
                return typeCards;
            }
        }
        return [];
    },

    getCardType(cards, card2DList, handCardNum, lastCardValue, lastCardLength){
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
        typeCards = this.getConnect(cards, lastCardValue, lastCardLength);
        if (typeCards.length) {
            return typeCards;
        }
        typeCards = this.getCompany(cards, card2DList, lastCardValue, lastCardLength);
        if (typeCards.length) {
            return typeCards;
        }
        typeCards = this.getAircrafy(cards, card2DList, handCardNum, lastCardValue, lastCardLength);
        if (typeCards.length) {
            return typeCards;
        }
        typeCards = this.getBomb(cards, lastCardValue);
        if (typeCards.length) {
            return typeCards;
        }
        // typeCards = this.getKingBomb(cards);
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
            for (let i = 3; i < card2DList.length; i++) {
                if (3 === card2DList[i].length && card2DList[i][0] % 0x10 > lastCardValue) {
                    return cards;
                }
            }
        }
        return [];
    },

    getThreeOne(cards, card2DList, handCardNum, lastCardValue){
        if (4 === cards.length && 4 === handCardNum) {
            for (let i = 3; i < card2DList.length; i++) {
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
            for (let i = 3; i < card2DList.length; i++) {
                if (3 <= card2DList[i].length && card2DList[i][0] % 0x10 > lastCardValue) {
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
            for (let i = 3; i < card2DList.length; i++) {
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
            for (let i = 3; i < card2DList.length; i++) {
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
            for (let i = 3; i < card2DList.length; i++) {
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

    getConnect(cards, lastCardValue, lastCardLength){
        if ((0 == lastCardLength && 5 <= cards.length) || cards.length === lastCardLength) {
            let startValue = cards[0] % 0x10;
            if (startValue > lastCardValue) {
                for (let i = 1; i < cards.length; i++) {
                    if (startValue + i != cards[i] % 0x10) {
                        return [];
                    }
                }
                return cards;
            }
        }
        return [];
    },

    getCompany(cards, card2DList, lastCardValue, lastCardLength){
        if ((0 == lastCardLength && 4 <= cards.length && 0 == cards.length % 2) || cards.length === lastCardLength) {
            for (let i = 3; i < card2DList.length; i++) {
                if (2 === card2DList[i].length && card2DList[i][0] % 0x10 > lastCardValue) {
                    let startValue = card2DList[i][0] % 0x10;
                    for (var j = i + 1; j < card2DList.length; j++) {
                        if (2 === card2DList[j].length && (startValue - i + j) === card2DList[j][0] % 0x10) {
                            if ((j - i + 1) === cards.length / 2) {
                                return cards;
                            }
                        } else {
                            return [];
                        }
                    }
                }
            }
        }
        return [];
    },

    getAircrafy(cards, card2DList, handCardNum, lastCardValue, lastCardLength){
        if (10 <= lastCardLength && 0 == lastCardLength % 5) {   //上家飞机数据验证
            if (cards.length == lastCardLength || (cards.length < lastCardLength && cards.length == handCardNum)) {     //自家出牌数据验证
                let cardTypeLength = lastCardLength / 5;
                let lastMaxCardValue = lastCardValue + cardTypeLength - 1;
                let typeCards = this.getAircrafyPart(cards, card2DList, cardTypeLength, lastMaxCardValue);
                if (typeCards.length) {
                    return typeCards;
                }
            }

        } else {  //上家为空
            if (0 == lastCardLength && (0 == cards.length % 5 || cards.length == handCardNum)) {
                let cardTypeLength = Math.ceil(cards.length / 5);
                let lastMaxCardValue = 0;
                let typeCards = this.getAircrafyPart(cards, card2DList, cardTypeLength, lastMaxCardValue);
                if (typeCards.length) {
                    return typeCards;
                }
            }
        }
        return [];
    },

    getAircrafyPart(cards, card2DList, cardTypeLength, lastMaxCardValue){
        for (let i = card2DList.length - 1; i >= 3 ; i--) {
            if (3 <= card2DList[i].length && card2DList[i][0] % 0x10 > lastMaxCardValue) {
                let startValue = card2DList[i][0] % 0x10;
                for (var j = i - 1; j >= 3; j--) {
                    if (3 <= card2DList[j].length && (startValue - i + j) === card2DList[j][0] % 0x10) {
                        if ((i - j + 1) === cardTypeLength) {
                            let typeCards = [];
                            for (let k = j + 0; k < j + cardTypeLength; k++) {
                                for (var l = 0; l < 3; l++) {
                                    typeCards.push(card2DList[k][l]);
                                }
                            }
                            let takeCards =  this.getTakeCards(typeCards, cards);
                            for (var t = 0; t < takeCards.length; t++) {
                                typeCards.push(takeCards[t]);
                            }
                            return typeCards;
                        }
                    } else {
                        i = j;
                        break;
                    }
                }
            }
        }
        return [];
    },
    

    getBomb(cards, lastCardValue){
        if (4 === cards.length && cards[0] % 0x10 > lastCardValue) {
            if (cards[0] % 0x10 == cards[1] % 0x10 && cards[1] % 0x10 == cards[2] % 0x10 && cards[2] % 0x10 == cards[3] % 0x10) {
                return cards;
            }
        }
        return [];
    },

    // getKingBomb(cards){
    //     if (false) {
    //         return cards;
    //     }
    //     return [];
    // },

    filterConnect(cards){
        let filterCards = [];
        let card2DList = this.arrangeCard(cards);
        for (let i = 3; i < card2DList.length; i++) {
            if (card2DList[i].length) {
                let startValue = card2DList[i][0] % 0x10;
                let tempList = [card2DList[i][0]];
                for (var j = i + 1; j < card2DList.length; j++) {
                    if (card2DList[j].length && (startValue - i + j) === card2DList[j][0] % 0x10) {
                        tempList.push(card2DList[j][0]);
                    } else {
                        break;
                    }
                }
                if (5 <= tempList.length && filterCards.length <= tempList.length) {
                    filterCards = tempList;
                }
            }
        }
        return filterCards;
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
