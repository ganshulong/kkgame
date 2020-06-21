#!/bin/bash
#删除安装包
echo "-------------------start build"
export CFG_VALUE="\"app\""
sh ./hotupdate.sh $1 "test"
if [ -z $1 ] 
then
   exit
fi

rm -rf ../build/jsb-link/publish/android/*.*
rm -rf ../build/jsb-link/publish/ios/*.*

cd ../shell



IOSDIR="../build/jsb-link/publish/ios"
if [ ! -e $IOSDIR ]
then
    mkdir -pv $IOSDIR
fi

ANDROIDDIR="../build/jsb-link/publish/android"
if [ ! -e $ANDROIDDIR ]
then
    mkdir -pv $ANDROIDDIR
fi

BUILDTIME="$(date +%Y_%m_%d)_$(date +%H_%M)"


#添加热更新需要的main.js代码
#添加编译时间
if [[ $CFG_VALUE = "\"hotupdate\"" ]] 
then
    echo "################build hotupdate success"
    exit 0
fi

ANDROIDNAME="google"
function build_android
{
    
    #rm -rf ../build/jsb-link/frameworks/runtime-src/proj.android-studio/app/build

    if [ -n $2] 
    then
        rm -rf ~/Documents/web/publish/huawei*.apk
         ANDROIDNAME="huawei"
         rm -rf ../build/jsb-link/frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript/AdManage.java
         rm -rf ../build/jsb-link/frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript/GooglePayMgr.java
         cp -R ../huawei/proj.android-studio ../build/jsb-link/frameworks/runtime-src
    else
         rm -rf ~/Documents/web/publish/google*.apk
         rm -rf ../build/jsb-link/frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript/Constants.java
         rm -rf ../build/jsb-link/frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript/IsEnvReadyCallback.java
         rm -rf ../build/jsb-link/frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript/HuaWeiIAPMgr.java
         rm -rf ../build/jsb-link/frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript/PurchaseIntentResultCallback.java
         rm -rf ../build/jsb-link/frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript/QueryPurchasesCallback.java
         rm -rf ../build/jsb-link/frameworks/runtime-src/proj.android-studio/app/src/org/cocos2dx/javascript/Utils.java
         rm -rf ../build/jsb-link/frameworks/runtime-src/proj.android-studio/app/agconnect-services.json
    fi

    /Applications/CocosCreator.app/Contents/MacOS/CocosCreator ../ --compile "debug=false;platform=android;androidStudio=true;"

    if test $? -eq 0
    then
        echo "########################build Success android  package success #########################"
    else
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!build android  package Faild !!!!!!!!!!!!!!!"
        exit 1
    fi

    mv "../build/jsb-link/publish/android/lucky88-release-signed.apk" ~/Documents/web/publish/"${ANDROIDNAME}_${BUILDTIME}_release".apk

}



 
 if [[ $CFG_VALUE = "\"app\"" ]] 
 then
     build_android 
fi

exit 0
function build_ios
{
	rm -rf ~/Documents/web/publish/f4*.ipa
 
    xcodebuild -sdk "$SDK" -target "$TARGET"  OBJROOT=$BUILDDIR SYMROOT=$BUILDDIR 

    #编译IOS
    xcrun -log -sdk "$SDK" PackageApplication -v "$OUTPUTDIR/f4娱乐.app" -o "$DISTRDIR/$1_${BUILDTIME}.ipa"
 
    if test $? -eq 0
    then
        echo "########################export ipa success#########################"
    else
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!export ipa Faild !!!!!!!!!!!!!!!"
        exit 1
    fi
}

security unlock-keychain -p "123456" ~/Library/Keychains/login.keychain

PROJECT_ROOT="$(pwd)/../build/jsb-link/frameworks/runtime-src/proj.ios_mac"

CONFIG="Release"
SDK="iphoneos"
BUILDDIR="$PROJECT_ROOT/build"
OUTPUTDIR="$BUILDDIR/Release-$SDK"
DISTRDIR=~/Documents/web/publish
APPNAME="lucky88"
TARGET="lucky88-mobile"

#编译ios
cd $PROJECT_ROOT/
echo "********************"
echo "*     Cleaning     *"
echo "********************"
xcodebuild -alltargets clean
echo "********************"
echo "*     Building     *"
echo "********************"
if [[ $CFG_VALUE = "\"app\"" ]] 
then
    build_ios f4
fi
