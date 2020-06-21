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
        node_qrcode: cc.Node,
        spr_icon: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    //设置数据，并显示动态二维码
    showQRCode(urlData,bShowIcon){
        var self = this
        self.makeQRCode(urlData,self.node_qrcode)

        var bShow = false
        if(bShowIcon){
            bShow = true
        }
        if(self.spr_icon){
            self.spr_icon.node.active = bShow
        }
    },

    //动态生成二维码接口
    //urlData:数据链接
    //node:显示二维码节点
    makeQRCode:function(urlData,node){
        var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
		qrcode.addData(urlData);
		qrcode.make();

		var ctx = node.getComponent(cc.Graphics);
		ctx.fillColor = cc.Color.BLACK;
		// compute tileW/tileH based on node width and height
		var tileW = node.width / qrcode.getModuleCount();
		var tileH = node.height / qrcode.getModuleCount();

		// draw in the Graphics
		for (var row = 0; row < qrcode.getModuleCount(); row++) {
			for (var col = 0; col < qrcode.getModuleCount(); col++) {
				if (qrcode.isDark(row, col)) {
					// ctx.fillColor = cc.Color.BLACK;
					var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
					var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
					ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
					ctx.fill();
				} else {
					// ctx.fillColor = cc.Color.WHITE;
				}
				var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
				// var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
				// ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
				// ctx.fill();
			}
		}
    }

    // update (dt) {},
});
