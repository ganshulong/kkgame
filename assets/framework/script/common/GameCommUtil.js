/*
** Manager the global function
* 主要是一些在拉米中也可能用到的方法，如果添加到globfunc中可能会麻烦同步
*/

var GlobalComm = require('GlobalVar');


//ps:截取2位小数点：3.145 => 3.14 不同于toFixed(2)是四舍五入保留两位小数点
//nPoint:保留小数点位数: 默认2
//return: 是字符串 和toFixed返回的类型一样
//usage: Global.S2P(3.145)
//split2pint 简写 S2P
GlobalComm.S2P = function(val,nPoint){
    // if(nPoint >= 0){
    // }
    // else{
    //     nPoint = 2
    // }
    //
    // //因客户端自己累加的时候可能会出现很多.9999999的情况，
    // //服务端最多只有4位小数点，所以4位小数点后的采取四舍五入
    // let pointSave = function(input){
    //         //按4位小数点后面四舍五入
    //     let fixNum = Math.round(Number(input)*Math.pow(10,4))
    //     return fixNum/Math.pow(10,4)
    // }
    // val = pointSave(val);
    //
    // let nRate = Math.pow(10,nPoint) //保留2位
    // let temp = Number(val)
    // temp = Math.floor(pointSave(temp*nRate))/nRate
    // temp = temp.toFixed(0)

    return parseInt(val);
}

// 添加序列帧动画 支持跨多个纹理集 spriteDataList 结构为[{start:1,end:12,atlas:"test",prefix:"tt"},{}]
GlobalComm.createClip=(node,spriteDataList,animationName="action",isLoop=true,speed=1/7,zeroize=true,nSizeModel=cc.Sprite.SizeMode.RAW)=>{
    let animation = node.getComponent(cc.Animation);
    if (animation === null) animation = node.addComponent(cc.Animation);
    animation.enabled = true;

    let clips = animation.getClips();
    for (let i = 0; i < clips.length; ++i) {
        if (clips[i].name === animationName) {
            cc.vv.gameData.addAnimationList(node);
            return;
        }
    }

    // 是否需要补零
    let getZeroize = (num,zeroize)=>
    {
        if(zeroize)
        {
            let str = num<10?("0"+num):num;
            return str;
        }
        else{
            return num;
        }
    }

    // 创建动画
    let framesList = [];
    for(let i=0;i<spriteDataList.length;++i){
        for(let j=spriteDataList[i].start;j<=spriteDataList[i].end;++j){
            let atlas = cc.vv.gameData.resMgr.getAtlas(spriteDataList[i].atlas);
            let spriteName = spriteDataList[i].prefix + (getZeroize(j,zeroize));
            let frame = atlas.getSpriteFrame(spriteName);
            if (frame) {
                framesList.push(frame);
            }
            else{
                AppLog.warn("######### 没有找到序列帧:" + spriteName);
            }
        }
    }
    let clipAnimation = cc.AnimationClip.createWithSpriteFrames(framesList);
    clipAnimation.wrapMode = isLoop?cc.WrapMode.Loop:cc.WrapMode.Normal;
    clipAnimation.sample = 30;
    clipAnimation.speed = speed;
    clipAnimation.name = animationName;
    node.getComponent(cc.Sprite).trim = false;
    node.getComponent(cc.Sprite).sizeMode = nSizeModel;
    animation.addClip(clipAnimation);

    cc.vv.gameData.addAnimationList(node);
    return clipAnimation;
}

GlobalComm.createClipByAtlas=(node,atlas,start,end,prefix,animationName="action",isLoop=true,speed=1/7,nSizeModel=cc.Sprite.SizeMode.RAW)=>
{
    let animation = node.getComponent(cc.Animation);
    if (animation === null) animation = node.addComponent(cc.Animation);
    animation.enabled = true;

    let framesList = [];
    for(let i=start;i<=end;++i){
        let frame = atlas.getSpriteFrame(prefix + i);
        if (frame) {
            framesList.push(frame);
        }
        else{
            AppLog.warn("######### 没有找到序列帧:" + (prefix + i));
        }
    }
    let clipAnimation = cc.AnimationClip.createWithSpriteFrames(framesList);
    clipAnimation.wrapMode = isLoop?cc.WrapMode.Loop:cc.WrapMode.Normal;
    clipAnimation.sample = 30;
    clipAnimation.speed = speed;
    clipAnimation.name = animationName;
    node.getComponent(cc.Sprite).trim = false;
    node.getComponent(cc.Sprite).sizeMode = nSizeModel;
    animation.addClip(clipAnimation);
    return clipAnimation;
}

//异步加载一张图片设置精灵
//path路径
//sprobj精灵对象
GlobalComm.setSpriteSync = function(path,sprObj){
    cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
        sprObj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
}

//数字滚动的效果
//lblObj 需要执行动作的label
//nBeginNum 开始数字
//nEndNum 结束数字
//nDur 持续时间 
//finishCall 结束回调
//perChangeCall 每次数字变化的回调：ps播放数字变化音效
GlobalComm.doRoallNumEff = function(lblObj,nBeginNum,nEndNum,nDur=1.5,finishCall,perChangeCall){
    let lblCmp = lblObj.getComponent(cc.Label)
    if(lblCmp){
        lblCmp.string = nBeginNum
        let nDifTime = 0.04
        let nRoallTime = Math.floor(nDur/nDifTime)
        let nDif = Math.floor(((nEndNum - nBeginNum) / nRoallTime)*100)/100
        if(nDif == 0){
            nDif = 1
        }
        let nStart = nBeginNum
        let changeNum = function(){
            nStart += nDif
            if(nStart <= nEndNum){
                lblCmp.string = Global.S2P(nStart,2)
            }
        }
        let actionDelay = cc.delayTime(nDifTime)
        let actionCall = cc.callFunc(()=>{
            changeNum()
        })
        let perAddCall = cc.callFunc(() => {
            //每次数字变化的回调。可用来播放加钱音效
            if(perChangeCall){
                perChangeCall()
            }
        })
        let seqAc = cc.repeat(cc.sequence(actionDelay,actionCall,perAddCall),nRoallTime)
        let lastCall = cc.callFunc(()=>{
            lblCmp.string = Global.S2P(nEndNum,2)
            if(finishCall){
                finishCall()
            }
        })
        lblCmp.node.stopAllActions()
        lblCmp.node.runAction(cc.sequence(seqAc,lastCall))

    }
}

//是否是boolean类型
Global.isBoolean = function(val){
    if(val == true || val == false){
        return true
    }
    return false
}

//恢复Blink动作:避免出现node不显示的问题
//cc.blink动作在web上是修改opacity,但是在native下是修改visible属性(不是active)
//调用下面的接口来停止cc.blink动作
Global.resetBlink = function(obj){
    if(obj){
        let className = cc.js.getClassName(obj)
        let node = obj.node
        if(className == 'cc.Node'){
            node = obj
        }
        
        if(node){
            node.stopAllActions()
            node.opacity = 255
            node._sgNode.setVisible(true)
        }
    }
}
