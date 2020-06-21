/*
** 声音资源管理器
** 播放背景音乐，音效的封装
** 切换语言的处理
*/

let BGM_VOL_MAX = 1.0

cc.Class({
    extends: cc.Component,

    statics: {
        bgmVolume:BGM_VOL_MAX,
        effVolume:1.0,

        bgmAudioId: -1, //背景音乐Id
        //背保存景音乐临时子目录url，用于切换语言时使用
        tempBgmCfg: JSON.stringify({suburl: '',iscommon: false}), 

        //语言类型
        languageType: 0,
        //枚举具体类型
        CHINESE: 0,
        ENGLISH: 1,
        soundEffectList:null,
        bgmUrl:"",

        init: function () {
            var t = Global.getLocal('bgmVolume', this.bgmVolume);
            this.bgmVolume = parseFloat(t);

            var t = Global.getLocal('effVolume', this.effVolume);
            this.effVolume = parseFloat(t);

            var t = Global.getLocal('languageType', this.languageType);
            this.languageType = parseInt(t);

            this.tempBgmCfg = {suburl: '',iscommon: false};

            cc.game.on(cc.game.EVENT_HIDE, this.onBackGround.bind(this));
            cc.game.on(cc.game.EVENT_SHOW, this.onEnterFront.bind(this));
            this.soundEffectList = new Map();
        },

        //进入后台
        onBackGround: function () {
            this.pauseAll();
        },
        
        //进入前台
        onEnterFront: function () {
            this.resumeAll();
        },

        //获取声音资源路径（这里可以用来处理国际化音效）
        //iscommon 是否共用
        getSoundURL: function (subpath, filename, iscommon) {
            var path = 'resources/';
            path += subpath;
            path += 'audio/'

            if (!iscommon) {
                if (this.languageType == this.ENGLISH || Global.language == 'en') {
                    path += 'english/';
                }
                else {
                    path += 'chinese/'; //默认中文
                }
            }
            //如果扩展名不是.mp3和.ogg那么就设置成.mp3 如果是.ogg就直接播放
            let index = filename.indexOf('.');
            let str = filename.substr(index+1);
            if (str === "ogg" || str === "wav" || str === "WAV"){
            }
            else filename += '.mp3'
            var fullpath = path + filename
            return cc.url.raw(fullpath);
        },

        //iscommon 是否共用
        //curVolum 当前这个背景音乐的音量,如果有设置的话，就不使用默认的音量
        playBgm: function (subpath, filename, iscommon,curVolum, cb, loop=true) {
            cc.log('play Bgm music: ', subpath);
            
            this.tempBgmCfg.subpath = subpath;
            this.tempBgmCfg.filename = filename;
            this.tempBgmCfg.iscommon = iscommon;

            var audiourl = this.getSoundURL(subpath, filename, iscommon);
            if(this.bgmUrl!== audiourl){
                if (this.bgmAudioId >= 0) {
                    cc.audioEngine.stop(this.bgmAudioId);
                }
                let bgmVol = this.bgmVolume
                if(curVolum && this.bgmVolume > 0){ //如果bgmVolume=0表示已经静音了
                    bgmVol = curVolum
                }
                this.bgmAudioId = cc.audioEngine.play(audiourl, loop, bgmVol);
                if (cb) cc.audioEngine.setFinishCallback(this.bgmAudioId, cb);
                this.bgmUrl = audiourl;
            }
            return this.bgmAudioId;

        },

        stopBgm: function() {
            if (this.bgmAudioId >= 0) {
                cc.audioEngine.stop(this.bgmAudioId);
                this.bgmAudioId = -1;
                this.bgmUrl = "";
            }
        },

        //iscommon 是否共用
        playEff: function (subpath, filename, iscommon,loop = false,callback,volume) {
            cc.log('Effect:'+filename)
            var audiourl = this.getSoundURL(subpath, filename, iscommon);
            let soundId = cc.audioEngine.play(audiourl, loop, volume?volume:this.effVolume);
            this.soundEffectList.set(soundId,audiourl);
            cc.audioEngine.setFinishCallback(soundId,(event)=>{
                this.soundEffectList.delete(soundId);
                if(callback) callback();
            });
            return soundId;
        },

        setEffVolume: function (volume) {
            if (this.effVolume != volume) {
                this.effVolume = volume
                Global.saveLocal('effVolume', this.effVolume);
            }
            for (let [key, value] of this.soundEffectList.entries()) {
                cc.audioEngine.setVolume(key,volume);
            }
        },

        setBgmVolume: function (volume) {
            if(volume > BGM_VOL_MAX){
                volume = BGM_VOL_MAX
            }
            if (this.bgmVolume != volume) {
                this.bgmVolume = volume;
                Global.saveLocal('bgmVolume', this.bgmVolume);
                cc.audioEngine.setVolume(this.bgmAudioId, volume);
            }  
        },

        setLanguage: function ( languageType) {
            if (this.languageType != languageType) {
                if (languageType != this.CHINESE && languageType != this.ENGLISH) return;

                Global.saveLocal('languageType', languageType);
                this.languageType = languageType;

                if (!this.tempBgmCfg.iscommon) { //共用资源，音乐文件目录不变，不需要重播背景音乐
                    this.playBgm(this.tempBgmCfg.suburl, this.tempBgmCfg.filename,this.tempBgmCfg.iscommon)
                }
            }
        },

        getLanguage: function () {
            return this.languageType;  
        },

        getBgmVolume: function () {
            return this.bgmVolume  
        },

        getEffVolume: function () {
            return this.effVolume;
        },

        //暂停
        pauseAll: function () {
            cc.audioEngine.pauseAll();
        },

        //恢复
        resumeAll: function () {
            cc.audioEngine.resumeAll();
        },

        //停止播放
        stopAudio:function(audioId){
            cc.audioEngine.stop(audioId)
        },

        // 停止所有音效 ，debarList排除
        stopAllEffect(debarList=[]){
            AppLog.log("!!!!!!!!!!!!!!stop all effect");
            for (let [key, value] of this.soundEffectList.entries()) {
                let isFind =false;
                for(let i=0;i<debarList.length;++i){
                    if(value.indexOf(debarList[i])>=0){
                        isFind = true;
                        break;
                    }
                }
                if(!isFind){
                    cc.audioEngine.stop(key);
                    delete this.soundEffectList[key];
                }
            }
            if(debarList.length===0)this.soundEffectList.clear();
        },

        //停止某个音效
        stopEffectByName:function(effName){
            for (let [key, value] of this.soundEffectList.entries()) {
                let isFind =false;
                if(value.indexOf(effName)>=0){
                    isFind = true
                }
                if(isFind){
                    cc.audioEngine.stop(key);
                    
                }
            }
        }
    },
});
