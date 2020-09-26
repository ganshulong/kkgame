function loadImage(_url,callback){
    cc.loader.load(_url+"?aa=aa.jpg",function (err,tex) {
        if(tex && !err)
        {
            let spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
            callback(err,spriteFrame);
        }
    });
};

cc.Class({
    extends: cc.Component,
    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _spriteFrame:null,
        _callback:null,
    },

    // use this for initialization
    onLoad: function () {
        this.setupSpriteFrame();
    },

    setUserHeadUrl:function(url,callback){
        this._callback = callback;
        if(!url){
            return;
        }

        let self = this;
        loadImage(url,function (err,spriteFrame) {
            self._spriteFrame = spriteFrame;
            self.setupSpriteFrame();
            self._callback(spriteFrame);
        });
    },
    
    setupSpriteFrame:function(){
        if(this._spriteFrame && this.node){
            let spr = this.node.getComponent(cc.Sprite);
            if(spr){
                spr.spriteFrame = this._spriteFrame;
            }
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
