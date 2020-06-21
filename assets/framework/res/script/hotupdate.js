// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const Md5 = require('Md5');
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
        progressBar: cc.ProgressBar,
        lblTips: cc.Label,

        _manifestUrl: null, //配置文件URL
        mainfest:cc.RawAsset,

        // 成员变量
        _updating: false, //是否正在更新
        _failCount: 0, 
        _canRetry: false, //重试
        _checkListener: null, //检查监听器
        _updateListener: null, //更新监听器
        _storagePath: '', //存储路径
        _assManager: null, //资源管理器

        _checkOver: false, //检测完成
        _countdownSec: 0, //倒计时
        _overtimeCount: 0, //超时次数
        _light:null,
    },    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.parent.name = "hotupdate";
        if (!Global.isNative()) return;

        this._manifestUrl = this.mainfest;
        AppLog.log("#####################-------------------")
        var searchPaths = cc.sys.localStorage.getItem('HotUpdateSearchPaths');;
        AppLog.log(JSON.stringify(searchPaths));

        this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset';

        this._assManager = new jsb.AssetsManager('', this._storagePath, this.versionComHandle.bind(this));
        Global.retain(this._assManager)
        this._assManager.setVerifyCallback(this.verifyCallback.bind(this));
        if (Global.isAndroid()) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._assManager.setMaxConcurrentTask(2);
        }
        this._light = this.progressBar.node.getChildByName("light");
        if(this._light) this._light.active = false;
        //进度条初始化为0
        this.progressBar.progress = 0.0;
        //淡入动画
        this.node.runAction(cc.fadeIn(1.0));
    },

    start () {
        if (!Global.isNative()) {
            this.enterLoginScene();
            return;
        }

        this.lblTips.string = '版本检测中,请稍后...';
        //开始检测是否强制更新
        this.checkForceAppUpdate();
    },

    update (dt) {
        this._countdownSec += dt;
        if (this._countdownSec > 3 && !this._checkOver) {
            this._countdownSec -=3;
            if (this._overtimeCount >= 3) { //3次之后，不再继续，直接进入登录场景
                // AppLog.log('超过三次没有获得Http返回。。。直接进入登录');
                this._checkOver = true //此次启动就不检测了，进入登录
                this.enterLoginScene();
            }
            else {
                this._overtimeCount ++;
                this.checkForceAppUpdate();
                // AppLog.log('超时。。。第' + this._overtimeCount + '次，继续强制更新');
            }
        }
    },

    onDestroy: function () {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        Global.release(this._assManager);
    },
   
    enterLoginScene: function () {
        if (this._assManager.getLocalManifest()) {
            Global.resVersion = this._assManager.getLocalManifest().getVersion();
        }
        cc.vv.SceneMgr.enterScene("login", function(){}.bind(this))
    },

    checkForceAppUpdate: function () {
        AppLog.log('检测App强制更新！');

        //加载本地的version.manifest文件
        var localVersionStr = jsb.fileUtils.getStringFromFile(this._manifestUrl);
        if (localVersionStr) {
            //AppLog.warn('本地：' + localVersionStr);

            var localVersionObj = JSON.parse(localVersionStr);
            cc.vv.SubGameUpdateNode.getComponent('SubGameUpdate').setSubGamesVer(localVersionObj.subGamesVer);
            AppLog.log("##############url:"+localVersionObj.remoteVersionUrl);
            cc.vv.NetManager.requestHttp('', {}, function (state, data) {
                if (state) {

                    if (this._checkOver) {
                        AppLog.log('已经检测完成...');
                        return;
                    } //已经开始更新了
                    this._checkOver = true;

                    var remoteVersionObj = (typeof data == 'string' ? JSON.parse(data) : data);

                    //AppLog.err('远程：' + JSON.stringify(remoteVersionObj));

                    // AppLog.log("AppVersion: " + cc.vv.PlatformApiMgr.getAppVersion());
                    // AppLog.log("ReviewVersion: " + remoteVersionObj.ios_review_version);

                    if (Global.isIOS() && cc.vv.PlatformApiMgr.getAppVersion() == remoteVersionObj.ios_review_version) {
                        AppLog.log('当前是提审版本！');

                        Global.isReview = true;
                        this.enterLoginScene();
                        return;
                    }

                    var localAppVersion = parseInt(cc.vv.PlatformApiMgr.getAppVersion().split('.').join(''));
                    var remoteAppVersion = parseInt(remoteVersionObj.android_app_version.split('.').join(''));
                    var isNeedForceUpdate = remoteVersionObj.force_update_android;
                    var app_update_url = remoteVersionObj.androidAppUrl;
                    if (Global.isIOS()) {
                        //localAppVersion = parseInt(localVersionObj.ios_app_version.split('.').join(''));
                        remoteAppVersion = parseInt(remoteVersionObj.ios_app_version.split('.').join(''));
                        isNeedForceUpdate = remoteVersionObj.force_update_ios;
                        app_update_url = remoteVersionObj.iosAppUrl;
                    }

                     AppLog.log('@@@@@@@@@@@@@localAppVersion: ' + localAppVersion);
                     AppLog.log('@@@@@@@@@remoteAppVersion: ' + remoteAppVersion);
                     AppLog.log('@@@@@@@@@@@@isNeedForceUpdate: ' + isNeedForceUpdate);
                     AppLog.log('@@@@@@@@@@@@@@app_update_url: ' + app_update_url);

                    if (localAppVersion < remoteAppVersion) {
                        AppLog.log('需要更新App');
                        if (isNeedForceUpdate) {
                            AppLog.log('需要强制更新App');
                            cc.vv.AlertView.show(cc.vv.Language.new_ver, function () {
                                cc.vv.PlatformApiMgr.openURL(app_update_url);
                                cc.game.end();
                            }.bind(this));
                        }
                        else {
                            cc.vv.AlertView.show(cc.vv.Language.new_ver, function () { //确定
                                cc.vv.PlatformApiMgr.openURL(app_update_url);
                                cc.game.end();
                            }.bind(this), null, true, function () { //关闭
                                //开始检测更新
                                AppLog.log('非强制更新，检测热更新！');
                                this.startCheckHotUpdate();
                            }.bind(this));
                        }
                    }
                    else {
                        //开始检测更新
                        AppLog.log('不需要更新App！');
                        this.startCheckHotUpdate();
                    }
                }
                else {
                    //开始检测更新
                    this.startCheckHotUpdate();
                }
            }.bind(this), localVersionObj.remoteVersionUrl);
        }
        else {
            AppLog.warn('加载本地version.manifest文件失败');
            this.enterLoginScene();
        }
    },

    startCheckHotUpdate: function () {
        //开始检测更新
        if (!this.checkHotUpdate()) {
            AppLog.warn('检测更新失败');
            this.enterLoginScene();
        } 
    },

    checkHotUpdate: function () {
        if (this._updating) {
            AppLog.log('Checking or Updating ...');
            return;
        }
        if (this._assManager.getState() === jsb.AssetsManager.State.UNINITED) {
            this._assManager.loadLocalManifest(this._manifestUrl);
        }
        if (!this._assManager.getLocalManifest() || !this._assManager.getLocalManifest().isLoaded()) {
            AppLog.warn('Failed to load local manifest ...');
            return;
        }
        this._checkListener = new jsb.EventListenerAssetsManager(this._assManager, this.checkCallback.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._assManager.checkUpdate();
        return true;
    },

    startHotupdate: function () {
        if (this._assManager && !this._updating) {
            this.lblTips.string = '资源更新中，请稍后...';

            this._updateListener = new jsb.EventListenerAssetsManager(this._assManager, this.updateCallback.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            if (this._assManager.getState() === jsb.AssetsManager.State.UNINITED) {
                this._assManager.loadLocalManifest(this._manifestUrl);
            }

            this._failCount = 0;
            this._assManager.update();
            this._updating = true;
        }
    },

    checkCallback: function (event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                AppLog.warn("No local manifest file found, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                AppLog.warn("Fail to download manifest file, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                AppLog.warn("Already up to date with the latest remote version.");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.startHotupdate();
                AppLog.warn("New version found, please try to update.");
                return;
            default:
                return;
        }

        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
        this._updating = false;

        //不更新，直接进入登录
        this.enterLoginScene();
    },

    updateCallback: function (event) {
        var needRestart = false; //重启游戏
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                AppLog.warn("No local manifest file found, hot update skipped.");
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                //this.panel.fileProgress.progress = event.getPercentByFile();

                //this.lblTips.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                //this.lblTips.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                var loadPercent = Math.floor(event.getDownloadedBytes()/event.getTotalBytes()*100);
                loadPercent = (isNaN(loadPercent)?0:loadPercent);

                if(loadPercent<=100){
                    if(Global.appId===Global.APPID.BigBang){
                        this.lblTips.string = loadPercent+"%";
                    }
                    else{
                        this.lblTips.string = loadPercent + '/100';
                    }
                    this.progressBar.progress = loadPercent/100;
                }
                if(this._light) {
                    this._light.active = this._pro<1;
                    this._light.x = -this.progressBar.totalLength/2 + this.progressBar.totalLength*this.progressBar.progress;
                    this._light.y = 0;
                }
                var msg = event.getMessage();
                if (msg) {
                    //this.panel.info.string = 'Updated file: ' + msg;
                    AppLog.log(event.getPercent()/100 + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                AppLog.warn('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                AppLog.warn('Already up to date with the latest remote version.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                AppLog.log('Update finished. ' + event.getMessage());
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                AppLog.warn('Update failed. ' + event.getMessage());
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                AppLog.warn('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                AppLog.log(event.getMessage());
                break;
            default:
                break;
        }

        if(this._canRetry){
            console.log("#################download update failed files");
            this._canRetry = false;
            this._assManager.downloadFailedAssets();

        }
        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this._updating = false;

            //进入登录
            this.enterLoginScene();
        }

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;

            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._assManager.getLocalManifest().getSearchPaths();
            AppLog.log(JSON.stringify(newPaths));

            //在搜索路径之前增加新的搜索路径
            Array.prototype.unshift(searchPaths, newPaths);

            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    },

    // Setup your own version compare handler, versionA and B is versions in string
    // if the return value greater than 0, versionA is greater than B,
    // if the return value equals 0, versionA equals to B,
    // if the return value smaller than 0, versionA is smaller than B.
    versionComHandle: function (versionA, versionB) {
        AppLog.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var verA = versionA.split('.');
        var verB = versionB.split('.');
        for (var i=0; i < verA.length; ++i) {
            var a = parseInt(verA[i]);
            var b = parseInt(verB[i]);
            if (a === b) {
                continue;
            }
            else {
                return -1;
            }
        }
        if (verB.length > verA.length) {
            return -1;
        }
        else {
            return 0;
        }
    },

    // Setup the verification callback, but we don't have md5 check function yet, so only print some message
    // Return true if the verification passed, otherwise return false
    verifyCallback: function (path, asset) {
        // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
        var compressed = asset.compressed;
        // Retrieve the correct md5 value.
        var expectedMD5 = asset.md5;
        // asset.path is relative path and path is absolute.
        var relativePath = asset.path;
        // The size of asset file, but this value could be absent.
        var size = asset.size;
        if (compressed) {
            AppLog.log("Verification passed : " + relativePath);
            return true;
        }
        else {
            var file =  jsb.fileUtils.getWritablePath() + "remote-asset_temp/"+ relativePath;
            if (jsb.fileUtils.isFileExist(file)) {
                let md5Value = Md5(jsb.fileUtils.getDataFromFile(file));
                return md5Value === asset.md5;
            }
            else{
                return false;
            }
        }
    },
});
