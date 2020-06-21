// 大厅界面预加载
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
        lbl_precent:cc.Label,
        pro_precent:cc.ProgressBar,
        _pro:0,
        _light:null,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.node.name = 'hall_pre_loading'
        this._light = this.pro_precent.node.getChildByName("light");
        if(this._light) this._light.active = false;
     },

    start () {
        this.initUI();
        this.loadAtlas();
    },

    //初始化ui
    initUI:function(){
        let node_bg = cc.find('common_bg',this.node);
    },

    loadAtlas:function(){
        cc.loader.loadResDir("items",cc.SpriteFrame,this.loadProgress.bind(this),this.loadFinish.bind(this));
    },

    //load的真实进度
    loadProgress:function(completedCount, totalCount, item){
        this._pro =  Number(completedCount/totalCount);
        if( isNaN(this._pro)){
            this._pro = 0
        }
        
        if(this._pro >=1) this._pro = 1;
        this.pro_precent.progress = this._pro;
        this.lbl_precent.string = Global.S2P((this._pro*100),0)+"%";
        if(this._light) {
            this._light.active = this._pro<1;
            this._light.x = -this.pro_precent.totalLength/2 + this.pro_precent.totalLength*this._pro;
            this._light.y = 0;
        }
    },

    //load结束
    loadFinish:function(error,res){

        if(!error){
            if(Global.appId === Global.APPID.Poly){
                cc.vv.AppData.addItemsSpriteAtlas(res);
            }
            cc.vv.EventManager.emit(EventId.ENTER_HALL);
        }
        
    }

    // update (dt) {},
});
