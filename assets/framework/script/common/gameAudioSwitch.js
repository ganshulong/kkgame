// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        btn_audio:cc.Button,
        frame_btn_state:{
            default:[],
            type:cc.SpriteFrame
        },
        frame_btn_en:{
            default:[],
            displayName: "英文图片数组",
            type:cc.SpriteFrame
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        var self = this
        var nCurValue = cc.vv.AudioManager.getEffVolume()
        self.setStateComm(self.btn_audio,nCurValue)
    },

    //点击音效
    onClickAudio:function(){
        var self = this
        var nCurValue = cc.vv.AudioManager.getEffVolume()
        var nValue = 0
        if(nCurValue == 0){
            nValue = 1
        }
        else{
            nValue = 0
        }
        cc.vv.AudioManager.setEffVolume(nValue)
        cc.vv.AudioManager.setBgmVolume(nValue)
        self.setStateComm(self.btn_audio,nValue)
    },

    setStateComm: function(obj,nValue){
        var self = this

        if(obj){
            var sprIdx = 0
            if(nValue === 0){
                //是静音状态
                sprIdx = 1
            }
            var spriteObject = obj.getComponent(cc.Sprite)
            if(spriteObject){
                let spFrame = self.getSpriteRes(sprIdx)
                if(spFrame){
                    spriteObject.spriteFrame = spFrame
                }
                
            }
        }
    },

    getSpriteRes: function(idx){
        var self = this
        
        var spr = self.frame_btn_state[idx]
        if (Global.language === 'en') {
            if(self.frame_btn_en){
                spr = self.frame_btn_en[idx]
            }
            
        }
        return spr
    }

    // update (dt) {},
});
