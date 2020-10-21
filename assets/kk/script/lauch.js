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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.setDisplayStats(false);
        require('AppLog');
        require('GlobalVar');
        require('MsgIdDef');
        require('EventDef');
        require('GlobalCfg');
        require('GlobalFunc');


        Global.autoAdaptDevices(false);

        cc.vv = {};
        //声音管理
        var audioMgr = require('AudioManager');
        audioMgr.init();
        cc.vv.AudioManager = audioMgr;

        cc.vv.Language = require("ChineseCfg");

        //事件管理
        cc.vv.EventManager = require('EventManager');

        //网络管理
        var netMgr = require('NetManager');
        netMgr.init();
        cc.vv.NetManager = netMgr;

        //平台Api管理
        var platformApiMgr = require('PlatformApi');
        platformApiMgr.init();
        cc.vv.PlatformApiMgr = platformApiMgr;

        let FloatTips = require("FloatTip");
        cc.vv.FloatTip = new FloatTips();
        cc.vv.FloatTip.init("common/prefab/FloatTip");

        let AlertViewMgr = require("AlertViewMgr");
        cc.vv.AlertView = new AlertViewMgr();

        let ExChangeTip = require("ExChangeTip");
        cc.vv.ExChangeTip = new ExChangeTip();
        cc.vv.ExChangeTip.init("common/prefab/ExChangeTip");

        let sceneMgr = require("SceneMgr");
        cc.vv.SceneMgr = sceneMgr;

        let node = new cc.Node();
        node.addComponent('SubGameUpdate');
        cc.vv.SubGameUpdateNode = node;
        cc.game.addPersistRootNode(node);

        let language = parseInt(cc.sys.localStorage.getItem("language"));
        if(language === null) language = 0;
        Global.language = language;

        cc.vv.WxMgr = require("WxMgr");
        //资源管理
        require('AssetManager').loadAllRes();

        this.loadAlterView();
        this.loadLoadingTip();
    },


    loadLoadingTip () {
		let func = (err,prefab)=>{
            if(err == null){
                let node = cc.instantiate(prefab);
                cc.game.addPersistRootNode(node);
            }
            else {
            	AppLog.err('prefab(game_common/common/prefab/LoadingTip) load error')
            }
        };

        cc.loader.loadRes("common/prefab/LoadingTip",cc.Prefab,(err,prefab)=>{
            func(err,prefab);
        });
    },

    loadAlterView(){
        let func = (err,prefab)=>{
            if(err == null){
                cc.vv.AlertView.init(prefab);
            }
        };

        cc.loader.loadRes("common/prefab/AlterView",cc.Prefab,(err,prefab)=>{
            func(err,prefab);
        });

    },
    start () {
        var self = this;
        var node = cc.find('Canvas');
        Global.centerPos = cc.v2(node.width/2,node.height/2);

        if (Global.isNative()) {
            cc.vv.SceneMgr.preloadScene('lobby');
            cc.vv.SceneMgr.preloadScene('club');
            cc.vv.SceneMgr.preloadScene('club_lobby');
            cc.vv.SceneMgr.preloadScene('penghu');
            cc.vv.SceneMgr.preloadScene('paohuzi');
            cc.vv.SceneMgr.preloadScene('hongheihu');
            cc.vv.SceneMgr.preloadScene('liuhuqiang');
            cc.vv.SceneMgr.preloadScene('paodekuai');
            cc.vv.SceneMgr.preloadScene('hongzhong');
            cc.vv.SceneMgr.preloadScene('shihuka');
            cc.vv.SceneMgr.preloadScene('tonghua');
        }
        
    	if(Global.isAndroid()){
            //安卓启动太慢，所以先起了一个闪屏，待游戏启动再关闭
            cc.vv.PlatformApiMgr.closeSplash();
            setTimeout(function () {
                self.loadNextScene()
            },1500); //call load scene function after 2.0s
        }
        else{
            setTimeout(function () {
                self.loadNextScene()
            },1500); //call load scene function after 2.0s
        }
    },

    loadNextScene: function () {
        //淡出动画
        this.node.runAction(cc.fadeOut(1.0));
        if (Global.isNative()) { //android、ios需要走热更新
            if(Global.openUpdate){
                cc.vv.SceneMgr.enterScene('hotupdate', this.onLoadHotupdateSceneFinish.bind(this))
            }
            else{
                cc.vv.SceneMgr.enterScene("login", this.onLoadLoginSceneFinish.bind(this))
            }
    	}
    	else { //H5不需要热更新
    		cc.vv.SceneMgr.enterScene("login", this.onLoadLoginSceneFinish.bind(this))
    	 }
    },

    onLoadHotupdateSceneFinish: function () {
    	cc.log("onLoadHotupdateSceneFinish")
    },

    onLoadLoginSceneFinish: function () {
    	cc.log("onLoadLoginSceneFinish")
    },
});

