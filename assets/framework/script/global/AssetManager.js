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
    statics: {
        loadAllRes: function () {
            //加载字体资源
            this.loadAllBitMapFont();
        },

        //Bitmap字体资源
        loadAllBitMapFont: function () {
            cc.loader.loadResDir('font/', cc.BitmapFont, function (err, fonts) {
                var bitFonts = {};
                for (var i in fonts) {
                    bitFonts[fonts[i]._name] = fonts[i];
                }
                window.BitMapFont = bitFonts;
            }.bind(this));
        },
    },
});
