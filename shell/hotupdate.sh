#!/bin/bash
if [ -z $1 ] 
then
    echo "!!!!!!!!!!!!!! 请输入版本号"
    exit
fi

cd ..


BUILDTIME="$(date +%Y_%m_%d)_$(date +%H_%M)"


 rm -rf ./hotupdate
 mkdir ./hotupdate
 rm -rf ./*.zip

 Ver=${1}
 if [[ $CFG_VALUE = "\"app\"" ]] 
 then
    Ver=1.0.0
fi

APPNAME=${2}
#拉取最新代码
# git fetch
# git checkout ds

# git reset --hard HEAD
# git pull
git add .
git commit -am "modify"

# git tag -d v${Ver}
# #git push origin --delete tag v${Ver}
# git tag v${Ver}
#git push origin v${Ver}
#开启热更新 116app 116hotupdate 只是热更地址跟poly不一样 
if [[ $CFG_VALUE = "\"app\"" ]] || [[ $CFG_VALUE = "\"hotupdate\"" ]] 
then
 sed -i "" "s/openUpdate.*:.*/openUpdate:true,/g" ./assets/lucky/script/GlobalVar.js
else
 sed -i "" "s/openUpdate.*:.*/openUpdate:false,/g" ./assets/lucky/script/GlobalVar.js
fi

#配置服务器地址
 ServerAddr="www.zonzu.net:9180"

if [ $APPNAME = "test" ]
then
  UPDATE_URL="http://www.zonzu.net/lucky88_update/hotupdate/"
  sed -i "" "s/localVersion.*:.*/localVersion:false,/g" ./assets/lucky/script/GlobalVar.js
  ServerAddr="www.zonzu.net:9180"
else
 UPDATE_URL="http://www.zonzu.net/lucky88_update/hotupdate/"
  sed -i "" "s/localVersion.*:.*/localVersion:false,/g" ./assets/lucky/script/GlobalVar.js
fi
#平台
PLATFORM="android"
sed -i "" "s/testModule.*:.*/testModule:false,/g" ./assets/lucky/script/GlobalVar.js


echo "---------------------server:$ServerAddr"
echo "---------------------PLATFORM:$PLATFORM"
sed -i "" "s/loginServerAddress.*:.*/loginServerAddress:\"$ServerAddr\",/g" ./assets/lucky/script/GlobalVar.js

sed -i "" "s/\"encryptJs\":.*/\"encryptJs\":true,/g" ./settings/builder.json
sed -i "" "s/\"md5Cache\":.*/\"md5Cache\":false,/g" ./settings/builder.json
sed -i "" "s/\"xxteaKey\":.*/\"xxteaKey\": \"b32a2160-0c63-41\",/g" ./settings/builder.json

/Applications/CocosCreator.app/Contents/MacOS/CocosCreator ./  --build "platform=$PLATFORM;debug=false;autoCompile=false;buildPath=build;useDebugKeystore=false;\
keystorePath=${PWD}/tool/keystore/lucky88.keystore;keystorePassword=lucky88;keystoreAlias=lucky88;keystoreAliasPassword=lucky88;\
appABIs=['armeabi-v7a','arm64-v8a'];"
if test $? -eq 0
then
 echo "########################构建成功#########################"
else
 echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!构建失败 !!!!!!!!!!!!!!!"
 exit
fi

echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@$3"
if [[ $CFG_VALUE = "\"app\"" ]]   #打app包需要删除游戏
then
    rm -rf ./build/jsb-link/res/raw-assets/resources/games
    rm -rf ./build/jsb-link/res/raw-assets/resources/items
    echo "########### delete games"
else
    echo "########### don't delete games"
fi

#合并import目录的json文件
if [[ $CFG_VALUE = "\"hotupdate\"" ]] || [[ $CFG_VALUE = "\"app\"" ]] 
then
    python ./shell/merge_import_json.py
fi


#获取子游戏目录
function cpSubGame
{
    for element in `ls $1`
    do  
        dir_or_file=$element
        if [ -d $dir_or_file ]
        then 
            update_module $dir_or_file
        fi  
    done
}

function compressSubGame
{
    for element in `ls $1`
    do  
        dir_or_file=$element
        if [ -d $dir_or_file ]
        then 
             echo "----------------compress $dir_or_file"
             path=../../../../../$dir_or_file/res/raw-assets/resources/games 
             mkdir -p "${path}"
             mv "${dir_or_file}" "${path}"
             7z a ../../../../../"${dir_or_file}".zip "../../../../../$dir_or_file"
             rm -rf "../../../../../$dir_or_file"
        fi  
    done
}

#压缩import文件夹
function compressImportDir
{
    for element in `ls $1`
    do  
        dir_or_file=$element
        if [ -d $dir_or_file ]
        then 
            echo "----------------compress $dir_or_file"
            # path=../../../../../$dir_or_file/res/import
            # mkdir -p "${path}" 
            # mv "${dir_or_file}" "${path}"
            7z a "${dir_or_file}".zip "./$dir_or_file"
            rm -rf "./$dir_or_file"
        fi
    done  
}

#提审版本
#暂时不需要提审
IOS_RV="10.0.0"

if [[ $CFG_VALUE = "\"hotupdate\"" ]] 
then
    #不需要更新的文件
    rm -rf ./build/jsb-link/res/raw-assets/lucky/project.manifest


    rm -rf ./hotupdate
    mkdir ./hotupdate
    mkdir ./hotupdate/$Ver
    mkdir -p ./hotupdate/$Ver/hall/src
    cp -rf ./build/jsb-link/src/*.* ./hotupdate/$Ver/hall/src
    cp -rf ./build/jsb-link/res ./hotupdate/$Ver/hall

    cd ./hotupdate/$Ver/hall/res/raw-assets/resources/games
    compressSubGame "$(pwd)"
    cd ../../../../res/import
    cd ../../../../../
    
    # if [[ $CFG_VALUE = "\"116hotupdate\"" ]]
    # then
    #      IOS_RV="10.0.0"
    #      UPDATE_URL="http://116.62.136.51/lucky88/hotupdate/"
    # fi    


    #热更包
    node ./hotupdate_generator.js -v $1 -u $UPDATE_URL -aav 1.0.0 -fa false -iav 1.0.0 -fi false -rv $IOS_RV -aaurl https://www.zonzu.net -iaurl https://www.zonzu.net -s ./build/jsb-link/ -d ./hotupdate/
    BUILDTIME="$(date +%Y_%m_%d)_$(date +%H_%M)"


    7z a ./"${APPNAME}_${1}_${BUILDTIME}".zip ./hotupdate
    rm -rf ~/Documents/web/publish/"${APPNAME}"*.zip
    mv *.zip ~/Documents/web/publish

	sed -i "" "s/\"md5Cache\":.*/\"md5Cache\":true,/g" ./settings/builder.json
    git checkout ./assets/lucky/script/GlobalVar.js
    git_status=$(git status)
    check_nothing=$((echo $git_status )| grep "nothing to commit, working directory clean")
    if [ ${#check_nothing} -eq 0 ]
    then
        git add .
        git commit -am "修改版本信息subgamever"
        git push origin ds
    else
         addfile=$((echo $git_status )| grep "no changes added to commit")
            if [ ${#addfile} -eq 0 ]
            then
                git add .
                git commit -am "添加版本信息subgamever"
                git push origin ds
            fi    
    fi    

    echo "########### finish version $1"

elif [[ $CFG_VALUE = "\"app\"" ]] 
then
    #app 生成manifest文件
    rm -rf ./hotupdate
    mkdir ./hotupdate
    mkdir ./hotupdate/$Ver
    mkdir -p ./hotupdate/$Ver/hall/src
    cp -rf ./build/jsb-link/src/*.* ./hotupdate/$Ver/hall/src
    cp -rf ./build/jsb-link/res ./hotupdate/$Ver/hall

    rm -rf ./hotupdate/manifest/*
    node ./hotupdate_generator.js -v $Ver -u $UPDATE_URL -aav 1.0.0 -fa false -iav 1.0.0 -fi false -rv $IOS_RV -aaurl https://update.caojuhe.cn -iaurl https://update.caojuhe.cn -s ./build/jsb-link/ -d ./hotupdate/
    BUILDTIME="$(date +%Y_%m_%d)_$(date +%H_%M)"

    rm -rf ./build/jsb-link/res/raw-assets/framework/project.manifest
    mv -f ./hotupdate/manifest/hall_project.manifest ./build/jsb-link/res/raw-assets/lucky/project.manifest
fi
