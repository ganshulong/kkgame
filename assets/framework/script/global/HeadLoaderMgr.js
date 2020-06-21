// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Loader = function (imgFileName, headUrl) {
    var obj = new Object;
    obj.url = headUrl; //下载url
    obj.filename = imgFileName; //文件名
    obj.times = 0; //下载次数
    obj.observers = []; //下载监听列表

    obj.push = function (callback, sprHead) {
        this.observers.push({spr:sprHead, cb:callback});
    };
    return obj;
};


cc.Class({
    extends: cc.Component,
    statics: {
        _loader_array: null, //下载列表
        _loader_dic: null, //加载器缓存
        _isLoading: false, //是否正在加载

        //添加加载
        //imgFileName: 文件名 ***.png 【必传】
        //headUrl: url地址  【必传】
        //callback: 回调函数 【必传】
        addLoader: function (imgFileName, headUrl, callback, sprHead, isForceDownload) {
            this._loader_array = this._loader_array || [];
            this._loader_dic = this._loader_dic || {};

            var imgFilePath = null;
            if (!isForceDownload) {
                imgFilePath = this.checkLocalFile(imgFileName);
                if (imgFilePath) {
                    headUrl = imgFilePath;
                }
            }
            
            var loaderKey = '$' + imgFileName + '$' + headUrl;
            if (!this._loader_dic[ loaderKey ]) {
                this._loader_dic[ loaderKey ] = Loader(imgFileName, headUrl);
                if (imgFilePath) {
                    this._loader_array.unshift(loaderKey);
                }
                else {
                    this._loader_array.push(loaderKey);  
                }
            }
            this._loader_dic[ loaderKey ].push(callback, sprHead);

            if (!this._isLoading) {
                this.runLoader();
            }
        },

        //开始加载
        runLoader: function () {
            if (this._loader_array.length <= 0) {
                this._isLoading = false;
                return;
            }
            this._isLoading = true;

            //开始下载
            var loaderKey = this._loader_array.shift();
            var loader = this._loader_dic[loaderKey];
            cc.loader.load(loader.url, function (err, tex) {
                if (err) {
                    loader.times += 1;
                    if (loader.times < 3) { //最多下载3次
                        this._loader_array.push(loaderKey);
                    }
                    else {
                        delete this._loader_dic[loaderKey];
                    }
                    this.runLoader();
                    return;
                }

                //生成精灵帧
                var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                for (var i in loader.observers) {
                    if (loader.observers[i].spr) {
                        loader.observers[i].spr.spriteFrame = spriteFrame;
                    }
                    if (loader.observers[i].cb) {
                        loader.observers[i].cb(spriteFrame);
                    }
                }
                delete this._loader_dic[loaderKey];
                this.runLoader();

                //保存到本地
                this.saveToLocalFile(loader.filename, spriteFrame);
            }.bind(this));
        },


        checkLocalFile: function (imgFileName) {
            if (typeof jsb == 'undefined') return false;

            var imgFilePath =  jsb.fileUtils.getWritablePath() + 'loadImgs/' + imgFileName;
            if (jsb.fileUtils.isFileExist( imgFilePath )) {
                return imgFilePath;
            }
            return false;
        },

        saveToLocalFile: function (imgFileName, spriteFrame) {
            if (typeof jsb == 'undefined') return;

            var dirpath =  jsb.fileUtils.getWritablePath() + 'loadImgs/'
            var imgFilePath = dirpath + imgFileName;

            if ( !jsb.fileUtils.isDirectoryExist(dirpath) ){
                jsb.fileUtils.createDirectory(dirpath);
            }

            var spr = new cc.Sprite();
            spr.spriteFrame = spriteFrame;

            var size = cc.size(Math.floor(spr.width), Math.floor(spr.height));
            var renderTexture = new cc.RenderTexture(size.width, size.height);
            renderTexture.setPosition(cc.p(size.width*0.5, size.height*0.5));
            spr.visit();
            renderTexture.end();
            renderTexture.saveToFile(imgFilePath, cc.IMAGE_FORMAT_JPG);
        },

        saveDataToLocalFile: function (imgFileName, data) {
            if (typeof jsb == 'undefined') return;

            var dirpath =  jsb.fileUtils.getWritablePath() + 'loadImgs/'
            var imgFilePath = dirpath + imgFileName;

            if ( !jsb.fileUtils.isDirectoryExist(dirpath) ){
                jsb.fileUtils.createDirectory(dirpath);
            }

            if( typeof data !== 'undefined' ){
                if ( jsb.fileUtils.writeDataToFile(  new Uint8Array(data) , imgFilePath) ) {
                    cc.log('Remote write file succeed.');
                }
                else {
                    AppLog.warn('Remote write file failed.');
                }
            }else{
                AppLog.warn('Remote download file failed.');
            }
        },

        // Todo ... more method
    },
});
