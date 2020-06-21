/*
** hotUpdate Tools
** > node version_generator.js -v 1.0.0 -u http://your-server-address/tutorial-hot-update/remote-assets/ -s native/package/ -d assets/
** 下面是参数说明：
** `-v` 指定 Manifest 文件的主版本号。
** `-u` 指定服务器远程包的地址，这个地址需要和最初发布版本中 Manifest 文件的远程包地址一致，否则无法检测到更新。
** `-s` 本地原生打包版本的目录相对路径。
** `-d` 保存 Manifest 文件的地址。
**
*/
var subGameLastVer = {};
var currSubGameMD5 = {};            // 当前构建游戏的md5列表
var subGameList = require("./assets/framework/res/script/GameItemCfg");
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var dirMap = new Map();
var manifestMap = new Map();
var manifest = {
    packageUrl: 'http://localhost/hotupdate/1.0.0/',
    remoteManifestUrl: 'http://localhost/hotupdate/project.manifest',
    remoteVersionUrl: 'http://localhost/hotupdate/version.manifest',
    version: '1.0.0',
	android_app_version: '1.0.0',
	ios_app_version:'1.0.0',
	androidAppUrl: 'http://localhost/',
	iosAppUrl: 'http://localhost/',
	ios_review_version: '1.0.0',
	force_update_ios: false, 
	force_update_android: false,
    assets: {},
    searchPaths: []
};

var isSuccess = true;

// 每个游戏和大厅创建manifest
function createManifest(manifestName)
{
    let data = {};
    
    data.remoteManifestUrl = manifest.remoteManifestUrl+ "manifest/"+ manifestName+"_project.manifest";
    data.remoteVersionUrl =  manifest.remoteVersionUrl + "manifest/"+manifestName + "_version.manifest";
    data.version = manifest.version;
    data.assets = {};
    data.searchPaths = [];
    if(manifestName==='hall')
    {
        data.packageUrl = manifest.packageUrl  + manifestName;
        data.android_app_version = manifest.android_app_version;
        data.ios_app_version = manifest.ios_app_version;
        data.androidAppUrl = manifest.androidAppUrl;
        data.iosAppUrl = manifest.iosAppUrl;
        data.ios_review_version =  manifest.ios_review_version;
        data.force_update_ios = manifest.force_update_android;
        data.force_update_android =  manifest.force_update_android;
        let subGamesVer = {};
        data.subGamesVer= subGamesVer;
    }
    else{
        data.packageUrl = manifest.packageUrl;
    }
    manifestMap.set(manifestName,data);
    return data;
}

var dest = './remote-assets/';
var writeDir = 'remote-assets/'
var src = './jsb/';
var gameList = [];

// Parse arguments
var i = 2;
while ( i < process.argv.length) {
    var arg = process.argv[i];

    switch (arg) {
    case '--url' :
    case '-u' :
        var url = process.argv[i+1];
        manifest.packageUrl = url;
        manifest.remoteManifestUrl = url ;
        manifest.remoteVersionUrl = url ;
        i += 2;
        break;
    case '--version' :
    case '-v' :
        manifest.version = process.argv[i+1];
        i += 2;
        break;
	case '--android_app_version' :
    case '-aav' :
        manifest.android_app_version = process.argv[i+1];
        i += 2;
        break;
	case '--ios_app_version' :
    case '-iav' :
        manifest.ios_app_version = process.argv[i+1];
        i += 2;
        break;
	case '--android_app_url' :
    case '-aaurl' :
        manifest.androidAppUrl = process.argv[i+1];
        i += 2;
        break;
	case '--ios_app_url' :
    case '-iaurl' :
        manifest.iosAppUrl = process.argv[i+1];
        i += 2;
        break;
	case '--ios_review_version' :
    case '-rv' :
        manifest.ios_review_version = process.argv[i+1];
        i += 2;
        break;
	case '--force_update_ios' :
    case '-fi' :
        manifest.force_update_ios = (process.argv[i+1] == 'true' ? true : false);
        i += 2;
        break;
	case '--force_update_android' :
    case '-fa' :
        manifest.force_update_android = (process.argv[i+1] == 'true' ? true : false);
        i += 2;
        break;
    case '--src' :
    case '-s' :
        src = process.argv[i+1];
        i += 2;
        break;
    case '--dest' :
    case '-d' :
        dest = process.argv[i+1];
        i += 2;
        break;
    default :
        i++;
        break;
    }
}

//Added by AndyHu
manifest.packageUrl += manifest.version + '/';

function readGameDir(dir) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    var subpaths = fs.readdirSync(dir), subpath,  md5, relative;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);

        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            readGameDir(subpath);
        }
        else if (stat.isFile()){
            md5 = crypto.createHash('md5').update(fs.readFileSync(subpath)).digest('hex');
            let index = subpath.indexOf('games/');
            let path = subpath.substr(index+6);
            index = path.indexOf("/");
            let gameName = path.substr(0,index);
            if(currSubGameMD5[gameName]){
                relative = path.substr(index+1);
                relative = relative.replace(/\\/g, '/');
                relative = encodeURI(relative);
                currSubGameMD5[gameName][relative] = md5;
            }
            else{
                console.log("!!!!!!!!!!!!!error " + gameName);
            }
        }
    }

}
function readDir (dir,manifestPath) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            readDir(subpath);
        }
        else if (stat.isFile()) {
            // Size in Bytes
            if(subpath.indexOf(' ')>=0) {
                console.log("!!!!!!!!!!!!!!!!!error:" + subpath + "  文件有空格");
                isSuccess = false;
            }
            size = stat['size'];
            md5 = crypto.createHash('md5').update(fs.readFileSync(subpath)).digest('hex');
            compressed = path.extname(subpath).toLowerCase() === '.zip';
            var obj = null;
            let index = subpath.lastIndexOf("/");
            let gameDir = subpath.substring(index+1,subpath.length-4);
            let findImport = subpath.indexOf("import");
            if(compressed && findImport<=0)
            {
                if(!manifestMap.has(gameDir))
                {

                    createManifest(gameDir);
                }
                obj = manifestMap.get(gameDir);
            }
            else {
                if(!manifestMap.has('hall'))
                {
                    createManifest('hall');
                }
                obj = manifestMap.get('hall');
            }

            if(manifestPath)
            {
                relative = manifestPath+"/"+subpath.substr(subpath.lastIndexOf("/")+1).toString();
            }
            else{
                if(compressed && findImport<= 0)
                {
                    let index = subpath.lastIndexOf("/");
                    relative = subpath.substr(index+1);
                }
                else{
                    let subIndex = subpath.indexOf('hall/');
                    relative = subpath.substr(subIndex+5);;
                    relative = relative.replace(/\\/g, '/');
                    relative = encodeURI(relative); 
                }

            }


            obj.assets[relative] = {
                'size' : size,
                'md5' : md5,
            };
            if (compressed) {
                obj.assets[relative].compressed = true;
            }
        }
    }
}

// 读取游戏的MD5

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
    }
}


let versionDir = path.join(dest, manifest.version);


// 创建子游戏版本信息
function readSubGameVerMd5(){
    for(let k in subGameList){
        let path = "./subgame_ver/" + subGameList[k].name + ".manifest";
        let exists = fs.existsSync(path);
        if(exists)
        {
            let file = fs.readFileSync(path);
            let  data = JSON.parse(file);
            data.ver = data.ver.toString();
            subGameLastVer[subGameList[k].name] = data;
        }
        else{
            subGameLastVer[subGameList[k].name] = {ver:"1001",assets:{}}
        }

        currSubGameMD5[subGameList[k].name] = {};
    }
}

function writeSubGameMd5Manifest(){
    for(let k in subGameLastVer){
        let project = "./subgame_ver/" + k+".manifest";
        fs.writeFileSync(project, JSON.stringify(subGameLastVer[k]), (err) => {
            if (err) throw err;
            console.log(k+".manifest"+' successfully generated ');
        });
    }

}

function creatEmptyProject()
{
    let dir = path.join(dest, manifest.version);
    var romFiles = fs.readdirSync(dir);//读取该文件夹
    romFiles.forEach(function(file)
    {
        let index = file.indexOf(".zip");
        if(index>=0)
        {
            let name = file.substring(0,index);
            let value = createManifest(name);
            value.version = "1000";
            let project = path.join(dest,  manifest.version + "/hall/manifest/"+name+"_project.manifest");
            fs.writeFileSync(project, JSON.stringify(value), (err) => {
                if (err) throw err;
                console.log('Manifest successfully generated ' + key);
            });
        }
    });
}

function creatGameDir(dir)
{
    var romFiles = fs.readdirSync(dir);//读取该文件夹
    romFiles.forEach(function(file)
    {
        let index = file.indexOf(".zip");
        if(index>=0)
        {
            let name = file.substring(0,index-1);
        }
    })
}

function setSearchDir()
{
    let hallManifest = manifestMap.get('hall');
    if(hallManifest)
    {
        for(let k in subGameList)
        {
            hallManifest.searchPaths.push(subGameList[k].name + "/" + subGameList[k].name);
        }
    }
}

// 比较子游戏的md5 如果有文件的md5不一则，则修改大厅hall_project.manifest中的subGamesVer版本信息，已经游戏的版本信息
function compareSubGameVer(){
    let hallManifest = manifestMap.get('hall');
    for(let k in subGameList){
        let key = subGameList[k].name;
        let data = currSubGameMD5[key];
        let currkeys = Object.keys(currSubGameMD5[key]);
        let lastkeys = Object.keys(subGameLastVer[key].assets);
        if(currkeys.length !== lastkeys.length){
            subGameLastVer[key].ver = (parseInt(subGameLastVer[key].ver)+1).toString();
            subGameLastVer[key].assets = data;
            console.log("@@@@@@@@@@@@@!!!!!!!!!md5 diff:" + key  + " 有文件添加或者删减");
        }
        else{
            for(let j in data){
                let obj = subGameLastVer[key].assets[j];
                // 文件不存在或者md5不相同
                if(obj === undefined || obj !== data[j]){
                    subGameLastVer[key].ver = ""+(parseInt(subGameLastVer[key].ver)+1).toString();
                    subGameLastVer[key].assets = data;
                    console.log("@@@@@@@@@@@@@md5 diff:" + j + "  game:" + key);
                    break;
                }
            }
        }

        hallManifest.subGamesVer[k] = subGameLastVer[key].ver;
    }
}

// 保存mainfest
function  saveManifest(){
    for (let [key, value] of manifestMap.entries())
    {
        var destManifest = path.join(manifestDir, key+'_project.manifest');
        var destVersion = path.join(manifestDir,  key+'_version.manifest');
        value.version = manifest.version;
        for(let k in subGameList)
        {

            if(subGameList[k].name === key)
            {
                value.version = subGameLastVer[key].ver.toString();
                break;
            }
        }

        fs.writeFile(destManifest, JSON.stringify(value), (err) => {
            if (err) throw err;
            console.log('Manifest successfully generated');
            //cp the manifest files to creator project
        });

        delete  value.assets;
        delete  value.searchPaths;
        fs.writeFile(destVersion, JSON.stringify(value), (err) => {
            //if (err) throw err;
            console.log('Version successfully generated');
        });

    }
};

readSubGameVerMd5();

mkdirSync(path.join(dest, manifest.version+"/hall"));

mkdirSync(path.join(dest, manifest.version+"/hall"+"/manifest"));

creatGameDir(path.join(dest, manifest.version))
creatEmptyProject();
readDir(path.join(dest, manifest.version));
readDir(path.join(dest, manifest.version+"/hall/manifest"),"manifest");

if(isSuccess){
    let gamesPath = "./build/jsb-link/res/raw-assets/resources/games";
    let is_exist = fs.existsSync(gamesPath);
    if(is_exist){
        readGameDir(gamesPath);
    }

    mkdirSync(dest);
    setSearchDir();
    compareSubGameVer();
    //所有manifest文件放在这个目录
    var manifestDir = path.join(dest, "manifest");
    mkdirSync(manifestDir);
    saveManifest();
    writeSubGameMd5Manifest();
}
else{
    console.log("!!!!!!!!!!!error 创建版本失败!");
}





