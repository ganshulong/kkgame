// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var pokerBg=[
    'plist_puke_back_big_2',
    'plist_puke_front_big',
    'bg_back',
    'poker-red_back', //918中的红色的牌被
    'poly_poker_bg', //带的poly logo 的牌背
]
//资源中颜色的定义定义，搞别人资源就是这么尴尬，还要转一手
var colorIdx = ['3','2','1','0']

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
        spr_bg: cc.Sprite,      //背景
        spr_value: cc.Sprite,   //牌值
        spr_color: cc.Sprite,   //牌色
        spr_color_big: cc.Sprite,//牌色大
        spr_joker: cc.Sprite,   //joker
        // frames_value:{          //牌值取值
        //     default: [],
        //     type: cc.SpriteFrame,
        // },
        // frames_color:{          //牌色图集
        //     default:[],
        //     type:cc.SpriteFrame,
        // },
        // frames_joker:{
        //     default:[],
        //     type:cc.SpriteFrame,
        // },
        // farmes_pokerbg:{
        //     default:[],
        //     type:cc.SpriteFrame
        // },
        // frames_color_big:{
        //     default:[],
        //     type:cc.SpriteFrame
        // },
        pokerAtas:{
            default:null,
            type:cc.SpriteAtlas
        },

        _onClickCallback: null,
        _isSelect: false,
        _colorValue:null,
        _pokerValue:null,
        _pokerIndex: null,
        _bgIdx:null,    //牌背的资源序号
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        if(this._colorValue == null && this._pokerValue == null){
            this.showPokerBg(this._bgIdx); //默认显示牌背
        }
        
    },

    start () {

    },

    //显示牌背面
    showPokerBg: function(idx){
        var self = this

        self.spr_value.node.active = false
        self.spr_color.node.active = false
        self.spr_color_big.node.active = false
        self.spr_joker.node.active = false
        var bgSp = self.getSpriteFrame(pokerBg[0])
        if(pokerBg[idx]){
            self._bgIdx = idx
            bgSp = self.getSpriteFrame(pokerBg[idx])
        }
        self.spr_bg.spriteFrame = bgSp
    },

    //显示16进制的牌
   show16Poker: function (card16Idx) {
        this._pokerIndex = card16Idx;
        
        var data = this.convert16PokertoDatavalue(card16Idx)
        this.showPokerValue(data)
    },

    //将16进制的数据转化成color,value类型
    convert16PokertoDatavalue:function(card16Idx){
        var item ={}
        item.color = 16*(((card16Idx & 0xf0) >> 4) - 1)
        item.value = card16Idx & 0x0f
        return item
    },

    getPokerIndex: function () {
        return this._pokerIndex;
    },

    //显示牌值
    //{
        //color:0黑 16红 32梅花 48方 64王
        //value:1->13 A-K
        //value: 14 小王,15 大王
    //}
    showPokerValue: function(data){
        var self = this
        if(self.isValidCard(data)){
            var colorIdx = data.color/16
            self.setPoker(colorIdx,data.value)
        }
    },

    //设置牌
    //color:0黑 1红 2梅花 3方 4王
    //value:1->13 A-K 14 小王,15 大王
    setPoker: function(color,value){
        var self = this
        self._colorValue = color
        self._pokerValue = value
        
        //白底
        self.spr_bg.spriteFrame = self.getSpriteFrame(pokerBg[1])
        if(color === 4){        //王
            if(value === 14){  
                self.showPokerJoker()  
            }
            else if(value === 15){
                self.showPokerJoker(true)
            }
        }
        else{
            self._showJokerModel(false)
            if(self.spr_color_big){
                var picBigColor = 'plist_puke_color_big_'+colorIdx[color]
                self.spr_color_big.spriteFrame =self.getSpriteFrame(picBigColor)
            }
            var picSmallColor = 'plist_puke_color_xl_small_'+colorIdx[color]
            self.spr_color.spriteFrame = self.getSpriteFrame(picSmallColor)

            var txtColor = 0
            if(color == 0 || color == 2){
                txtColor = 1
            }
            var picValue = 'plist_puke_value_xl_'+txtColor + '_' + value
            if(self.getSpriteFrame(picValue)){
                self.spr_value.spriteFrame = self.getSpriteFrame(picValue)
            }
            else{
                cc.log('unvalid')
            }
            
        }
    },

    //显示joker
    showPokerJoker: function(bBigJoker){
        var self = this
        self._showJokerModel(true)
        var idx = 0
        if(bBigJoker == 1){
            idx = 1
        }
        var picName = 'plist_puke_joker_big_'+ idx
        self.spr_joker.spriteFrame = self.getSpriteFrame(picName)
    },

    //设置缩放
    setScale: function(nScale){
        var self = this
        self.node.scale = nScale
    },

    //
    _showJokerModel: function(bShow){
        var self = this

        self.spr_joker.node.active = bShow
        self.spr_color.node.active = !bShow
        self.spr_value.node.active = !bShow
        if(self.spr_color_big){
            self.spr_color_big.node.active = !bShow
        }
    },

    //是否是有效的牌
    isValidCard: function(data) {
        if(data) {
            if(data.color >= 0 && data.value > 0){
                return true
            }
        }
        return false
    },

    // update (dt) {},

    isSelect: function () {
        return this._isSelect;
    },

    setSelected: function (isSelect) {
        this._isSelect = isSelect?true:false;
    },

    setClickCallback: function (callback) {
        this._onClickCallback = callback;
        this.spr_bg.getComponent('cc.Button').enabled = true;
    },

    onPokerClicked: function (event, customEventData) {
        this._isSelect = !this._isSelect;

        if (this._onClickCallback) {
            this._onClickCallback(this, customEventData);            
        }
    },

    //翻牌动作
    //nSpeed : >1 减慢  <1 加速
    doTurnAction: function(data,endCall,nScaleEx,nSpeed){
        var self = this
        if(!nScaleEx){
            nScaleEx = 0
        }
        if(!nSpeed){
            nSpeed = 1
        }
        var nNodeScaleX = self.node.scaleX
        var nNodeScaleY = self.node.scaleY
        var nCurScaleX = nNodeScaleX + nScaleEx
        var nCurScaleY = nNodeScaleY + nScaleEx
        var acScaleBefore = null
        if(nScaleEx > 0){
            acScaleBefore = cc.scaleTo(0.1,nCurScaleX,nCurScaleY)
        }
        var pCallNext = cc.callFunc(() => {
            var pokerBgNode = new cc.Node('PokerBgSprie')
            var sp = pokerBgNode.addComponent(cc.Sprite)
            var bgSp = self.getSpriteFrame(pokerBg[0])
            if(self.getSpriteFrame(pokerBg[self._bgIdx])){
                bgSp = self.getSpriteFrame(pokerBg[self._bgIdx])
            }
            sp.spriteFrame = bgSp
            pokerBgNode.scaleX = nCurScaleX
            pokerBgNode.scaleY = nCurScaleY
            pokerBgNode.parent = self.node.parent
            pokerBgNode.position = self.node.position
            var curSize = self.node.getContentSize()
            pokerBgNode.setContentSize(cc.size(curSize.width,curSize.height))

            var nDelayTime = 0.3 * nSpeed
            var nSpwTime = 0.6 * nSpeed

            self.node.scaleX = -nCurScaleX
            var pCallBack = cc.callFunc((sender,data) => {
                sender.removeFromParent()
            },pokerBgNode,1)
            var seqBack = cc.sequence(cc.delayTime(nDelayTime),cc.hide(),cc.delayTime(nDelayTime),cc.hide(),pCallBack)
            var scaleBack = cc.scaleTo(nSpwTime,-nCurScaleX,nCurScaleY)
            pokerBgNode.runAction(cc.spawn(seqBack,scaleBack))
            
            var pCallFront = cc.callFunc(() => {

                if((nNodeScaleX != nCurScaleX) || (nNodeScaleY != nCurScaleY)){
                    //如果缩放的不等于最初的，然后再缩放到最初的比例
                    self.node.runAction(cc.scaleTo(0.1,nNodeScaleX,nNodeScaleY))

                } 
                if(endCall){
                    endCall()
                }
            })

            var pShowCall = cc.callFunc(() =>{
                    self.showPokerValue(data)
            })
            var seqFront = cc.sequence(cc.delayTime(nDelayTime),cc.show(),pShowCall,cc.delayTime(nDelayTime),cc.show(),pCallFront)
            var scaleFront = cc.scaleTo(nSpwTime,nCurScaleX,nCurScaleY)
            self.node.runAction(cc.spawn(seqFront,scaleFront))
        })

        if(acScaleBefore){
            self.node.runAction(cc.sequence(acScaleBefore,pCallNext))
        }
        else{
            self.node.runAction(pCallNext)
        }
        
        //self.node.scale = nCurScale

        
       
    },


    //翻牌动作 scaleX 和 scaleY不相同的时候可以使用 add by maojudong ,2018年11月24日17:40:29
    //本函数的action共运行0.6秒
    doTurnActionWithScaleXY: function(data, endCall, target, nScaleXEx, nScaleYEx){
        let self = this;
        if(!nScaleXEx) {
            nScaleXEx = 0;
        }

        if(!nScaleYEx) {
            nScaleYEx = 0;
        }

        let nNodeScaleX = self.node.scaleX;     //记录节点原来的缩放值X
        let nNodeScaleY = self.node.scaleY;
        let nCurScaleX = nNodeScaleX + nScaleXEx;
        let nCurScaleY = nNodeScaleY + nScaleYEx;

        let acScaleBefore = null;
        if(nScaleXEx > 0 || nScaleYEx > 0) {
            acScaleBefore = cc.scaleTo(0.1, nCurScaleX, nCurScaleY);
        }

        let pCallNext = cc.callFunc(() => {
            let pokerBgNode = new cc.Node('PokerBgSprie');
            let sp = pokerBgNode.addComponent(cc.Sprite);
            let bgSp = self.getSpriteFrame(pokerBg[0]);
            if(self.getSpriteFrame(pokerBg[self._bgIdx])) {
                bgSp = self.getSpriteFrame(pokerBg[self._bgIdx]);
            }

            sp.spriteFrame = bgSp;
            pokerBgNode.scaleX = nCurScaleX;
            pokerBgNode.scaleY = nCurScaleY;

            pokerBgNode.parent = self.node.parent;
            pokerBgNode.position = self.node.position;
            let curSize = self.node.getContentSize();
            pokerBgNode.setContentSize(cc.size(curSize.width, curSize.height));

            let nDelayTime = 0.15;
            let nSpwTime = 0.3;

            self.node.scaleX = -nCurScaleX;    //水平方向镜像
            let pCallBack = cc.callFunc((sender, data) => {
                sender.removeFromParent()
            }, pokerBgNode, 1);

            let seqBack = cc.sequence(cc.delayTime(nDelayTime), cc.hide(), cc.delayTime(nDelayTime), cc.hide(), pCallBack);
            let scaleBack = cc.scaleTo(nSpwTime, -nCurScaleX, nNodeScaleY);
            pokerBgNode.runAction(cc.spawn(seqBack, scaleBack));

            let pCallFront = cc.callFunc(() => {

                if((nNodeScaleX !== nCurScaleX) || (nNodeScaleY !== nCurScaleY)){
                    //如果缩放的不等于最初的，然后再缩放到最初的比例
                    self.node.runAction(cc.scaleTo(0.1, nCurScaleX, nCurScaleY));
                }

                if(endCall && target) {
                    endCall.call(target);
                }
            });

            var pShowCall = cc.callFunc(() =>{
                self.showPokerValue(data);     //开始显示牌正面的值
            });

            var seqFront = cc.sequence(cc.delayTime(nDelayTime), cc.show(), pShowCall, cc.delayTime(nDelayTime), cc.show(),pCallFront);
            var scaleFront = cc.scaleTo(nSpwTime, nNodeScaleX, nNodeScaleY);
            self.node.runAction(cc.spawn(seqFront, scaleFront));
        });

        if(acScaleBefore) {
            self.node.runAction(cc.sequence(acScaleBefore, pCallNext));
        } else {
            self.node.runAction(pCallNext);
        }
    },

    setShowPokerEvent: function(call){
        var self = this
        self._eventCall = call
    },
     //添加一个帧事件
     onShowEvent:function(){
         var self = this
        if(self._eventCall){
            self._eventCall()
        }
    },

    getSpriteFrame(picName){
        var self = this
        return self.pokerAtas._spriteFrames[picName]
    }

});
