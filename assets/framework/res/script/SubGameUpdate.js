
let STATUS={
    CHECK_HALL:0,
    CHECK_SUBGAME:1,
}
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
        _manifestMap:null,
        _status:-1,
        _subGame:"",
        _subGameMap:[],            // 检查子游戏列表
        _updateGameId:0,           // 当前更新的游戏id
        _failNum:0,
        _hallVer:"",
        _downloadList:[],          // 下载列表
        _checkTime:0,              // 三秒检测一次下载是否正常
        _isDownloading:false,      // 是否正在下载
        _isTry:false,              // 是否重新下载
        _subGamesVer:null,         // 所有子游戏最新版本
        _sameGameList:null,        // 换皮游戏id列表
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (!Global.isNative()) return;
        cc.vv.SubGameUpdateNode.on("check_subgame",this.onCheckSubGame,this);
        cc.vv.SubGameUpdateNode.on("set_hall_ver",this.recvHallVer,this);
        cc.vv.SubGameUpdateNode.on("request_subgame_status",this.requestSubGameStatus,this);
        this._subGameMap = new Map();
        this._sameGameList = new Map(),
        this._downloadList = [];
        this.readHallLocalMainfest();
        this.readAllSubLocalManifest();
    },

    // 请求子游戏状态
    requestSubGameStatus()
    {
        cc.vv.SubGameUpdateNode.emit("subgame_status",this._subGameMap);
        cc.vv.SubGameUpdateNode.emit("subgame_downloadList",this._downloadList);
    },

    // 读取大厅manifest文件
    readHallLocalMainfest()
    {
        let path = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "remote-asset/project.manifest";
        if(jsb.fileUtils.isFileExist(path))
        {
            var localVersionStr = jsb.fileUtils.getStringFromFile(path);
            var localVersionObj = JSON.parse(localVersionStr);
            this._subGamesVer = localVersionObj.subGamesVer;
        }

    },

    // 设置当前子游戏版本
    setSubGamesVer(data)
    {
        if(this._subGamesVer === null)
        {
            this._subGamesVer = data;
        }
    },

    // 子游戏是否下载
    isDownLoadSubGame(id){
        if(!Global.isNative())
        {
            return true;
        }
        else{
            if(this._subGameMap.has(id.toString())){
                return this._subGameMap.get(id.toString()).ver !== "0";
            }
            else{
                return false;
            }
        }

    },

    // 读取本地所有子游戏版本
    readAllSubLocalManifest()
    {
        for(let key in cc.vv.GameItemCfg)
        {
            if(!this._sameGameList.has(cc.vv.GameItemCfg[key].name)){
                this._sameGameList.set(cc.vv.GameItemCfg[key].name,[]);
            }
            let list = this._sameGameList.get(cc.vv.GameItemCfg[key].name);
            let localVer = this.readSubLocalManifest(cc.vv.GameItemCfg[key].name);
            let  update = localVer.length===0;
            if(this._subGamesVer)
            {
                update = this._subGamesVer[key.toString()]!==localVer;
            }
            AppLog.log("##########key:" + key + "  ver:" + localVer);
            this._subGameMap.set(key.toString(),{ver:localVer.length>0?localVer:'0',needUpdate:update,pro:-1});
            list.push(key.toString());
        }
    },

    recvHallVer(data)
    {
        this._hallVer = data.detail;
        if(data.detail !== Global.resVersion) // 大厅不是最新版本
        {
            cc.vv.SubGameUpdateNode.emit("need_update_hall");
        }
        else
        {

        }
    },

    // 读取游戏本地manifest
    readSubLocalManifest(gameName)
    {
        let path = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "remote-asset/"+gameName+"/project.manifest";
        if(jsb.fileUtils.isFileExist(path))
        {
            var localVersionStr = jsb.fileUtils.getStringFromFile(path);
            var localVersionObj = JSON.parse(localVersionStr);
            return localVersionObj.version;
        }
        else
        {
            return "";
        }
    },

    // 已经是最新版本
    showAlreadyUpdate(gameId,ver)
    {
        let subGame = this._subGameMap.get(gameId.toString());
        subGame.needUpdate = false;
        subGame.ver = ver;
        cc.vv.SubGameUpdateNode.emit("already_update_to_date",gameId);
    },

    // 检查子游戏
    onCheckSubGame(data)
    {
        let gameId = data.detail;
        if(gameId === this._updateGameId){
            cc.vv.SubGameUpdateNode.emit("update_started", gameId);
            return;
        }

        if(!this._subGameMap.has(gameId.toString()))
        {
            let localVer = this.readSubLocalManifest(cc.vv.GameItemCfg[gameId].name);
            if(localVer === this._subGamesVer[gameId.toString()]) // 已经是最新的不需要下载
            {
                this.showAlreadyUpdate(gameId,localVer);
                return;
            }
        }
        else
        {
            let data = this._subGameMap.get(gameId.toString());
            var subVer = data.ver;
            if(this._subGamesVer[gameId.toString()] === subVer) // 已经是最新版本
            {
                if(!data.needUpdate){
                    this.showAlreadyUpdate(gameId,subVer);
                    return;
                }

            }
            else
            {
                data.pro = 0;
                data.needUpdate = true;
            }
        }
        let isInList = false;
        for(let i=0;i<this._downloadList.length;++i)
        {
            if(this._downloadList[i] === gameId)
            {
                isInList = true;
            }
        }
        if(!isInList)
        {
            cc.vv.FloatTip.show(cc.vv.Language[cc.vv.GameItemCfg[gameId].title] + cc.vv.Language.join_queue);
            if(this._downloadList.length === 0)
            {
                this._updateGameId = gameId;
                this.init(cc.vv.GameItemCfg[gameId].name);
            }
            this._downloadList.push(gameId);
        }

        cc.vv.SubGameUpdateNode.emit("update_started", gameId);
    },

    init(subGameName)
    {
        this._subGame = subGameName;
        this.initCheck(subGameName);
    },

    initCheck(gameName)
    {
        AppLog.log("##########gameName:" + gameName);
        this.onDestroy();
        this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/' + gameName;
        this._assManager = new jsb.AssetsManager('', this._storagePath, this.versionComHandle.bind(this));
        let projectName = gameName + "_project";
        let path = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "remote-asset/"+gameName+"/project.manifest";

        // 先查找游戏目录下面有没有manifest配置，如果没有再查找remote-asset/manifest下面的
        if(!jsb.fileUtils.isFileExist(path)){
            path = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "remote-asset/manifest/"+gameName+"_project.manifest";
        }
        this.manifestUrl = path;
        Global.retain(this._assManager);
        this._assManager.setVerifyCallback(this.verifyCallback.bind(this));
        if (Global.isAndroid()) {
            this._assManager.setMaxConcurrentTask(2);
        }
        this.checkHotUpdate();
    },


    start () {
    },

    update (dt) {
        if(this._downloadList.length>0){
            this._checkTime += dt;
            if(this._checkTime >= 3){
                this._checkTime = 0;
                if(!this._isDownloading){
                    this._isTry = true;
                }
                this._isDownloading = false;
            }
        }
    },

    onDestroy: function () {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if(this._assManager)
            Global.release(this._assManager);
        this._checkOver = false;
        this._updating = false;
    },
    
    startCheckHotUpdate: function () {
        //开始检测更新
        if (!this.checkHotUpdate()) {
            AppLog.warn('检测更新失败');
        }
    },

    checkHotUpdate: function () {
        if (this._updating) {
            AppLog.log('Checking or Updating ...');
            return;
        }
        if (this._assManager.getState() === jsb.AssetsManager.State.UNINITED) {
            this._assManager.loadLocalManifest(this.manifestUrl);
        }
        if (!this._assManager.getLocalManifest() || !this._assManager.getLocalManifest().isLoaded()) {
            AppLog.warn('Failed to load local manifest ...');
            this.showFailDlg();
            return;
        }
        this._checkListener = new jsb.EventListenerAssetsManager(this._assManager, this.checkCallback.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._assManager.checkUpdate();
        return true;
    },

    startHotupdate: function () {
        if (this._assManager && !this._updating) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._assManager, this.updateCallback.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            if (this._assManager.getState() === jsb.AssetsManager.State.UNINITED) {
                this._assManager.loadLocalManifest(this.manifestUrl);
            }

            this._failCount = 0;
            this._assManager.update();
            this._updating = true;
        }
    },

    // 设置子游戏版本号,下载状态
    setSubGameUpdateStatus(updateFinish)
    {
        let subGame = this._subGameMap.get(this._updateGameId.toString());
        if(subGame)
        {
            subGame.needUpdate = !updateFinish;
        }
    },

    // 设置子游戏版本号
    setSubGameVer(ver)
    {
        let subGame = this._subGameMap.get(this._updateGameId.toString());
        if(subGame)
        {
            subGame.ver = ver;
            subGame.needUpdate = true;
            this._subGamesVer[this._updateGameId.toString()] = ver;
        }
    },

    checkCallback: function (event) {
        cc.log('Code: ' + event.getEventCode());
        this._isDownloading = true;
        let success = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                AppLog.warn("No local manifest file found, hot update skipped.");
                success = false;
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                AppLog.warn("Fail to download manifest file, hot update skipped.");
                success = false;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                AppLog.warn("Already up to date with the latest remote version.");
                this.setSubGameUpdateStatus(true);
                if(!this._isTry)
                {
                    cc.vv.SubGameUpdateNode.emit("already_update_to_date",this._updateGameId);
                }
                success = true;
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                AppLog.warn("New version found, please try to update.");
                this.setSubGameUpdateStatus(false);
                this.startHotupdate();
                return;
            default:
                return;
        }

        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
        this._updating = false;
        cc.log('-------------------finish: ' + event.getEventCode());
        //不更新，直接进入登录
        if(success)  this.enterNextStep();
        else {
            ++this._failCount;
            console.log("**************fail count:" +this._failCount);
            if(this._failCount<2) this.initCheck(this._subGame);
            else {
                console.log("**************fail Show faildlg" +this._failCount);
                this.showFailDlg();
            }
        }
    },

    // 显示失败弹窗
    showFailDlg()
    {
        cc.eventManager.removeListener(this._updateListener);
        this._updateListener = null;

        cc.vv.AlertView.show(cc.vv.Language[cc.vv.GameItemCfg[this._updateGameId].title] + cc.vv.Language.download_fail,function () {
            let path = jsb.fileUtils.getWritablePath()+ "remote-asset/"+cc.vv.GameItemCfg[this._updateGameId].name;
            // 删除重新下载
            jsb.fileUtils.removeFile(path)
        });
        cc.vv.SubGameUpdateNode.emit("subgame_update_fail",this._updateGameId);
        this.downloadNextGame();
    },

    downloadNextGame()
    {
        this._failCount = 0;
        this._downloadList.shift();
        this._checkOver = false;
        this._updating = false;
        this._canRetry = false;
        this._isTry = false;
        this._updateGameId = -1;
        if(this._downloadList.length>0)
        {
            this._updateGameId = this._downloadList[0];
            this._subGame = cc.vv.GameItemCfg[this._updateGameId].name;
            AppLog.log("##########upateName:" + this._subGame);
            this.initCheck(this._subGame);
        }
    },

    enterNextStep()
    {

        let subGame = this._subGameMap.get(this._updateGameId.toString());
        if(subGame)
        {
            if(!subGame.needUpdate)
            {
                let bFinsSameGame = false;
                let name = cc.vv.GameItemCfg[this._updateGameId].name;
                let ver = this._subGamesVer[this._updateGameId];
                // 将所有当前下载的换皮版本都设置为最新版本
                if(this._sameGameList.has(name)){
                    let list = this._sameGameList.get(name);
                    if(list){
                        for(let i=0;i<list.length;++i){
                            let subGame = this._subGameMap.get(list[i]);
                            if(subGame)
                            {
                                subGame.ver = ver;
                                subGame.needUpdate = false;
                                this._subGamesVer[list[i]] = ver;
                            }
                        }
                    };
                }


                for(let i=0;i<this._downloadList.length;++i){
                    let gameName = cc.vv.GameItemCfg[this._downloadList[i]].name;

                    // 查找下载列表是否有换皮游戏 如果有则从列表里面删除
                    if(gameName === name && this._downloadList[i] !== this._updateGameId){
                        if(Global.appId !== Global.APPID.BigBang) cc.vv.FloatTip.show(cc.vv.Language[cc.vv.GameItemCfg[this._downloadList[i]].title] + cc.vv.Language.download_complete);
                        cc.vv.SubGameUpdateNode.emit("update_finish",this._downloadList[i]);
                        bFinsSameGame = true;
                        AppLog.log("########find same game:" + gameName + " gameId:"+this._downloadList[i]);

                        this._downloadList[i] = 0;
                    }
                };
                if(bFinsSameGame){
                    let list = [];
                    for(let i=0;i<this._downloadList.length;++i){
                        if(this._downloadList[i]!==0){
                            list.push(this._downloadList[i]);
                        }
                    }
                    this._downloadList = list.slice(0);
                }

                if(Global.appId !== Global.APPID.BigBang) cc.vv.FloatTip.show(cc.vv.Language[cc.vv.GameItemCfg[this._updateGameId].title] + cc.vv.Language.download_complete);
                cc.vv.SubGameUpdateNode.emit("update_finish",this._updateGameId);

                this.downloadNextGame();
            }
        }
    },

    updateCallback: function (event) {
        var finish = false; //重启游戏
        var failed = false;
        this._isDownloading = true;
        var msg = event.getMessage();
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                AppLog.warn("No local manifest file found, hot update skipped.");
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                //this.panel.fileProgress.progress = event.getPercentByFile();

                //this.lblTips.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                //this.lblTips.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                var loadPercent = event.getDownloadedBytes()/event.getTotalBytes()*100;
                AppLog.log("########loadPercent:" +loadPercent);
                loadPercent = isNaN(loadPercent)? 0 :loadPercent;
                let subGame = this._subGameMap.get(this._updateGameId.toString());
                if(subGame){
                    subGame.pro = Global.S2P(loadPercent,0);
                }
                cc.vv.SubGameUpdateNode.emit("update_subgame_pro",{per:Global.S2P(loadPercent,0),gameId:this._updateGameId});

                var msg = event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                AppLog.warn('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                AppLog.warn('@@@@@@@@@updateCallback Already up to date with the latest remote version.');
                finish = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                AppLog.log('Update finished. ' + event.getMessage());
                cc.vv.SubGameUpdateNode.emit("update_subgame_status",{txt:"更新完成!",gameId:this._updateGameId});
                finish = true;
                this._canRetry = false;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                AppLog.warn('Update failed. ' + event.getMessage());
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                AppLog.warn('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                failed = true;
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                AppLog.log(event.getMessage());
                failed = true;
                break;
            default:
                break;
        }

        if (failed) {
            this.setSubGameUpdateStatus(false);
            this.showFailDlg();
        }

        if(finish)
        {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this.setSubGameUpdateStatus(true);
            this.enterNextStep();

        }

        if(this._canRetry)
        {
            ++this._failCount;
            if(this._failCount<2)
            {
                this.setSubGameUpdateStatus(false);
                this._canRetry = false;
                this._assManager.downloadFailedAssets();
            }
            else{
                this.showFailDlg();
            }
        }

    },

    // Setup your own version compare handler, versionA and B is versions in string
    // if the return value greater than 0, versionA is greater than B,
    // if the return value equals 0, versionA equals to B,
    // if the return value smaller than 0, versionA is smaller than B.
    versionComHandle: function (versionA, versionB) {
        AppLog.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        this.setSubGameVer(versionB);
        if (versionA !==versionB) {
            return -1;
        }
        else {
            return 0;
        }
    },

    calMD5OfFile(filePath){
        return Md5(jsb.fileUtils.getDataFromFile(filePath));
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
            AppLog.log("-----------compressed------- ");
            return true;
        }
        else {
            return true;
        }
    },
});
