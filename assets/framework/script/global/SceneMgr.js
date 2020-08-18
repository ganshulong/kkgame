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
        enterScene(sceneName,callback){
            if(cc.vv.FloatTip) cc.vv.FloatTip.clear();
            // let curScene = cc.director.getScene();
            // if(curScene.name === sceneName) return;
            let enterSceneName = sceneName;
            if(sceneName === 'hall'){
                if(cc.vv.gameData) cc.vv.gameData.onExit();
            }

            cc.director.loadScene(sceneName,()=>{
                if(enterSceneName === "lobby") {
                    if(cc.vv.gameData) cc.vv.gameData.clear();
                }
                if(callback) callback();
            });
        },

        //是否再大厅场景
        isInHallScene(){
            let self = this
            let curScene = cc.director.getScene();
            if(curScene.name === 'hall' ) {
                return true
            }
            return false
        },

        //是否在登录场景
        isInLoginScene(){
            let self = this;
            let curScene = cc.director.getScene();
            if(curScene.name === 'login') {
                return true
            }
            return false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // update (dt) {},
});
