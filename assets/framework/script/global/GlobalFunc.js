/*
** Manager the global function
*/

var GlobalFunc = require('GlobalVar');
GlobalFunc.designSize = cc.size(1280, 720);
GlobalFunc.centerPos = cc.v2(640, 360);
GlobalFunc.shake = false;

GlobalFunc.ANDROID_CLASS_NAME = 'org/cocos2dx/javascript/AppActivity';
GlobalFunc.IOS_CLASS_NAME = 'AppController';

/*
** 是否是原生app端
*/
GlobalFunc.isNative = function () {
    return cc.sys.isNative && jsb;
}

let headPic = {
    0: "tx_nan1",
    1: "tx_nan2",
    2: "tx_nan3",
    3: "tx_nan4",
    4: "tx_nan5",
    5: "tx_nv1",
    6: "tx_nv2",
    7: "tx_nv3",
    8: "tx_nv4",
    9: "tx_nv5",
}

// 获取默认头像索引
GlobalFunc.getHeadId = function (id) {
    id = id % 10;
    return headPic[id];
}


GlobalFunc.setHead = function (head, url) {
    if (cc.js.isString(url)) {
        if (!Global.defaultHead) {
            Global.defaultHead = head.getComponent(cc.Sprite).spriteFrame;
        }
        let index = url.indexOf("http");
        if (index >= 0) {
            head.getComponent("ImageLoader").setUserHeadUrl(url, (spr) => {
                head.getComponent(cc.Sprite).spriteFrame = spr;
            });
        } else {
            head.getComponent(cc.Sprite).spriteFrame = Global.defaultHead;
        }
    }
},
// 设置是否震动
// 设置 true false
    GlobalFunc.setShake = function (value) {
        GlobalFunc.shake = value;
        cc.sys.localStorage.setItem("shake", value);
        Global.dispatchEvent(EventId.SET_SHAKE, value);
    }

// 获取当前震动值
// 返回ture false
GlobalFunc.getShake = function (value) {
    return GlobalFunc.shake;
}
/*
** 是否是Adnroid
*/
GlobalFunc.isAndroid = function () {
    return cc.sys.os == cc.sys.OS_ANDROID;
}

/*
** 是否是IOS 
*/
GlobalFunc.isIOS = function () {
    return cc.sys.os == cc.sys.OS_IOS;
}

/*
** 是否是IOS审核版本
*/
GlobalFunc.isIOSReview = function () {
    if (!GlobalFunc.isIOS()) {
        return false;
    } else {
        return Global.isReview;
    }
}

/*
** 获取设备ID
*/
GlobalFunc.getDeviceId = function () {
    return cc.vv.PlatformApiMgr.getDeviceId()
}

/*
** 发送事件消息
** 再次封装，主要是打印
*/
GlobalFunc.emit = function (node, eventId, dic) {
    if (node) {
        node.emit(eventId, dic);
        if (Global.localVersion) {
            dic.eventId = eventId;
            cc.log('emit', JSON.stringify(dic));
        }
    }
}

/*
** 注册事件监听
*/
GlobalFunc.on = function (node, eventId, func, target) {
    if (node) {
        node.on(eventId, func, target);
        if (Global.localVersion) {
            cc.log('node(' + node.getName() + ') on ' + 'eventId(' + eventId + ')');
        }
    }
}

/*
** 注销事件监听
*/
GlobalFunc.off = function (node, eventId, func, target) {
    if (node) {
        node.off(eventId, func, target);
        if (Global.localVersion) {
            cc.log('node(' + node.getName() + ') off ' + 'eventId(' + eventId + ')');
        }
    }
}

/*
** retain对象(未开启长期持有C++底层对象时)
*/
GlobalFunc.retain = function (obj) {
    if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
        obj.retain();
    }
}

/*
** release对象(未开启长期持有C++底层对象时)
*/
GlobalFunc.release = function (obj) {
    if (obj && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
        obj.release();
    }
}

/*
** 设置常驻节点（为其他场景使用）
** 将Node成为常驻节点，场景切换时不会清除这个节点的内存
** 方便下一个场景可以通过这个节点访问数据
*/
GlobalFunc.addPersistNode = function (node) {
    cc.game.addPersistRootNode(node);
}

/*
** 移除常驻节点
*/
GlobalFunc.removePersistNode = function (node) {
    cc.game.removePersistRootNode(node)
}

/*
** 保存String数据到本地
*/
GlobalFunc.saveLocal = function (key, str) {
    key += '';
    str += '';
    //cc.sys.localStorage.setItem(key, str);
    cc.sys.localStorage.setItem(Global.compile(key), Global.compile(str));
}

/*
** 获取本地保存的String数据
*/
GlobalFunc.getLocal = function (key, defaultStr) {
    key += '';
    //var str = cc.sys.localStorage.getItem(key);
    var str = cc.sys.localStorage.getItem(Global.compile(key));
    if (str) str = Global.uncompile(str);
    if (!str || str.length <= 0) {
        str = defaultStr
    }
    return str;
}

/*
** 删除本地保存的String数据
*/
GlobalFunc.deleteLocal = function (key) {
    key += '';
    //cc.sys.localStorage.removeItem(key);
    cc.sys.localStorage.removeItem(Global.compile(key));
}

/*
** 简单加密字符串
*/
GlobalFunc.compile = function (code) {
    var c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    // alert(escape(c));
    c = escape(c);
    return c;
}

/*
** 简单解密字符串
*/
GlobalFunc.uncompile = function (code) {
    code = unescape(code);
    var c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
}


/*
** 绑定参数
** 第一个参数必须是函数类型
*/
GlobalFunc.bindParams = function () {
    var args = Array.prototype.slice.call(arguments);
    var func = args.shift();
    if (typeof (func) != 'function') return;

    return function () {
        return func.apply(null, args.concat(Array.prototype.slice.call(arguments)));
    };
}

/*
** 生成任意值到任意值（也就是指定范围内）的随机数
** max期望的最大值
** min期望的最小值
*/
GlobalFunc.random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/*
** 对象 深拷贝
*/
GlobalFunc.copy = function (obj) {
    var newObj = obj instanceof Array ? [] : {}
    for (var item in obj) {
        if (typeof obj[item] === "object") {
            newObj[item] = GlobalFunc.copy(obj[item]);
        } else {
            newObj[item] = obj[item];
        }
    }
    return newObj;
}

/*
** string转化成Bytes
*/
GlobalFunc.stringToBytes = function (str) {
    var ch, re = [];
    for (var i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);  // get char
        var st = [];
        do {
            st.push(ch & 0xFF);  // push byte to stack
            ch = ch >> 8;          // shift value down by 1 byte
        }
        while (ch);
        // add stack contents to result
        // done because chars have "wrong" endianness
        re = re.concat(st.reverse());
    }
    // return an array of bytes  
    return re;
}

/*
** 转化value=n*256+m为字符串nm
*/
GlobalFunc.jsToCByShort = function (value) {
    var low1 = Math.floor(value / 256);
    var low2 = Math.floor(value % 256);
    /*var lowByte1 = GlobalFunc.charToByte(low1,low2);
    var lowByte2 = GlobalFunc.charToByte(low2);*/
    return String.fromCharCode(low1, low2);
}

/*
** 转化m+n*2^24+k*2^16+l*2^8=为字符串mnkl
*/
GlobalFunc.jsToCByInt = function (value) {
    var low1 = Math.floor(value / (256 * 256 * 256))
    var low2 = Math.floor(value / (256 * 256)) % 256
    var low3 = Math.floor(value / 256) % 256
    var low4 = Math.floor(value % 256)
    /*var lowByte1 = GlobalFunc.charToByte(low1);
    var lowByte2 = GlobalFunc.charToByte(low2);
    var lowByte3 = GlobalFunc.charToByte(low3);
    var lowByte4 = GlobalFunc.charToByte(low4);*/
    return String.fromCharCode(low1, low2, low3, low4);
}

/*
** 计算长度
*/
GlobalFunc.srcSum = function (strData, len) {
    var sum = 65535;
    for (var i = 0; i < len; i++) {
        var d = strData[i];
        sum = sum ^ d;
        if ((sum && 1) == 0) {
            sum = sum / 2;
        } else {
            sum = (sum / 2) ^ (0x70B1);
        }
    }
    return sum;
}


/*
** @description 把GPS原始坐标转换成GCJ-02火星坐标
** @param lat 纬度
** @param lng 经度
** @return lat,lng
*/
/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
//function wgs84togcj02(lng, lat) {
GlobalFunc.convertGPS2GCJ = function (lng, lat) {
    lng = Number(lng);
    lat = Number(lat);

    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;

    function transformlat(lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret
    }

    function transformlng(lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret
    }

    function out_of_china(lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    }


    // if (out_of_china(lng, lat)) {
    //     return {lat:lat, lng:lng}
    // }
    // else {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = lat / 180.0 * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
    var mglat = lat + dlat;
    var mglng = lng + dlng;
    return {lat: mglat, lng: mglng};
    // }
}
/*
GlobalFunc.convertGPS2GCJ = function (lat,lng) {
    lat = parseInt(lat);
    lng = parseInt(lng);

    var pi = Math.PI;
    var x_pi = pi * 3000.0/180.0;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;

    var transformLat = function(x,y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret = ret + (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
        ret = ret + (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
        ret = ret + (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    	return ret;
    }

    var transformLon = function(x,y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret = ret + (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
        ret = ret + (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
        ret = ret + (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
        return ret;
    }

    var dLat = transformLat(lng - 105.0, lat - 35.0);
    var dLng = transformLon(lng - 105.0, lat - 35.0);

    var radLat = lat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;

    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);

    var mgLat = lat + dLat;
    var mgLng = lng + dLng;

    return {lat:mgLat, lng:mgLng};
}
*/

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
GlobalFunc.gcj02towgs84 = function (lng, lat) {
    if (out_of_china(lng, lat)) {
        return [lng, lat]
    } else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        mglat = lat + dlat;
        mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat]
    }
}


/*
** @description 通过经纬度，获取到具体的位置
** @param lat 纬度
** @param lng 经度
** @param cb 回调,返回街道地址
** [[ {"status":0,"result":{"location":{"lng":111.07259999999997,"lat":26.268391095085833},"formatted_address":"广西壮族自治区桂林市全州县","business":"","addressComponent":{"country":"中国","country_code":0,"province":"广西壮族自治区","city":"桂林市","district":"全州县","town":"","adcode":"450324","street":"","street_number":"","direction":"","distance":""},"pois":[],"roads":[],"poiRegions":[],"sematic_description":"","cityCode":142}} ]]
*/
GlobalFunc.getAddressDetail = function (lat, lng, cb) {
    //因获取的是高德地图经纬度(火星坐标)，这里需要换算到百度地图的经纬度
    /*var posData = convertGCJ2DB(lat,lng)
    lat = posData.lat;
    lng = posData.lng;

    //需要去这里申请 http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding
    var ak_and = "9uAwj28kHQe3SA3sYQycRBv9XfGFzVtG"
    //var ak_ios = "AReN74lHsEGDcUmLdMSAx1GdQs3BS3A4"
    var mcode_and = "35:77:CF:A6:24:79:8A:51:9C:AB:37:10:C7:20:44:C9:96:32:66:20;com.you9.azzy" //安全码（android的）
    //var mcode_ios = "35:77:CF:A6:24:79:8A:51:9C:AB:37:10:C7:20:44:C9:96:32:66:20;com.you9.azzy" //安全码（ios的）
    var url = string.format("http://api.map.baidu.com/geocoder/v2/?location=%f,%f&output=json&pois=0&ak=%s&mcode=%s",lat,lng,ak_and,mcode_and)
    var xhr = cc.XMLHttpRequest:new()
    xhr.timeout = 30
    xhr.responseType = cc.XMLHTTPREQUEST_RESPONSE_JSON
    xhr:open("GET", url)
    xhr:registerScriptHandler( function () {
        if xhr.readyState == 4 and (xhr.status >= 200 and xhr.status < 207) then
            cb({code=0,data=xhr.response})
        elseif xhr.readyState == 1 and xhr.status == 0 then
            // 网络问题,异常断开
            cb({code=1,desc="网络异常断开"})
        else
            cb({code=-1,desc="数据异常"})
        end
        xhr:unregisterScriptHandler()
    });
    xhr:send()*/
}

/*
** @description 计算两个经纬度点间的距离
** @return 距离（number），千米
*/
GlobalFunc.getDistanceOfTwoPoint = function (lat1, lng1, lat2, lng2) {
    AppLog.log(lat1, lng1, lat2, lng2);

    //角度转弧度
    var angleToRadian = function (angle) {
        return angle * Math.PI / 180;
    }

    var radlat1 = angleToRadian(lat1);
    var radlat2 = angleToRadian(lat2);
    ;
    var a = radlat1 - radlat2;
    var b = angleToRadian(lng1) - angleToRadian(lng2);
    var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.pow(Math.sin(b / 2), 2)));
    var earth_radius = 6378.137;
    distance = distance * earth_radius;
    return Math.abs(distance);
}


/*
** 转化数字为万、亿为单位的字符串
** num需转化的数字
** radix进制
** decimal 小数点后保留位数
** costomunitArr 自定义后缀 ['','W','Y','H']
*/
GlobalFunc.convertNumToShort = function (num, radix, decimal, costomunitArr) {
    var unitArr = ['', '万', '亿', '万亿'];
    // var unitArr = ['', 'K', 'M', 'B'];
    var sign = (num != 0) ? num / Math.abs(num) : 1;  //符号
    num = Math.abs(num);

    //替换自定义后缀
    if (costomunitArr) {
        unitArr = costomunitArr
    }

    radix = (radix == null) ? 10000 : radix; //默认值  10000万亿
    decimal = (decimal == null) ? 1 : decimal; //默认值

    var sum = 0;
    while (num >= radix) {
        sum++;
        num = num / radix;
    }
    num = Math.floor(num * Math.pow(10, decimal)) / Math.pow(10, decimal);

    return num * sign + unitArr[sum];
}

/*
** 数字转化成中文
 */
GlobalFunc.convertNumToChineseNum = function (moneyNum) {
    //汉字的数字
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    //基本单位
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //最大处理的数字
    var maxNum = 999999999999999.9999;
    //金额整数部分
    var integerNum;
    //金额小数部分
    var decimalNum;
    //输出的中文金额字符串
    var chineseStr = '';
    //分离金额后用的数组，预定义
    var parts;
    if (moneyNum === '') {
        return '';
    }

    moneyNum = parseFloat(moneyNum);
    if (moneyNum >= maxNum) {
        //超出最大处理数字
        return '';
    }
    if (moneyNum == 0) {
        chineseStr = cnNums[0];
        return chineseStr;
    }

    //转换为字符串
    moneyNum = moneyNum.toString();
    if (moneyNum.indexOf('.') == -1) {
        integerNum = moneyNum;
        decimalNum = '';
    } else {
        parts = moneyNum.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                //归零
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
    }

    if (chineseStr == '') {
        chineseStr += cnNums[0];
    }
    return chineseStr;
}

/*
** 截取字符串 包含中文处理
** （串，长度，增加....）
*/
GlobalFunc.subStrOfChinese = function (str, len, hasDot) {
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    try {
        var strLength = str.replace(chineseRegex, "**").length;
        for (var i = 0; i < strLength; i++) {
            singleChar = str.charAt(i).toString();
            if (singleChar.match(chineseRegex) != null) {
                newLength += 2;
            } else {
                newLength++;
            }
            if (newLength > len) {
                break;
            }
            newStr += singleChar;
        }

        if (hasDot && strLength > len) {
            newStr += "..";
        }
    } catch (e) {
        return str;
    }

    return newStr;
},

//截屏
//fileName: **.png
//node: 截屏的节点
//endCall: 截屏完成的回调会传出目标文件路径
//cpSize: 截屏大小：如果不是截全屏大小。
//bHide:有些节点需要隐藏截图后，就只在截图瞬间显示
    GlobalFunc.captureScreen = function (fileName, node, endCall, cpSize, bHide) {
        if (CC_JSB) {
            var oldPos = node.position
            var doCapSize = Global.designSize
            if (cpSize) {
                doCapSize = cpSize
            }
            if (bHide) {
                node.active = true
            }

            var rt = cc.RenderTexture.create(doCapSize.width, doCapSize.height)
            rt.setVisible(false)
            rt.begin()
            node.position = cc.p(Global.designSize.width / 2, Global.designSize.height / 2); //要加这句，不然会偏移坐标
            node._sgNode.visit()
            rt.end()
            if (bHide) {
                node.active = false
            }


            rt.saveToFile(fileName, cc.ImageFormat.PNG, true, function () {
                cc.log(jsb.fileUtils.getWritablePath())
                var targetPath = jsb.fileUtils.getWritablePath() + fileName
                if (endCall) {
                    node.position = oldPos
                    endCall(targetPath)
                }
            })
        }
    },

//FB链接分享
//linkUrl:点击跳转的url
//strContent:文字内容即引文
    GlobalFunc.ShareLink = function (linkUrl, strContent) {
        //fb
        if (Global.openFacebookLogin && Global.playerData.logintype === Global.LoginType.FB) {
            var shareData = {}
            shareData.shareType = 1 //链接分享
            shareData.linkUrl = linkUrl
            shareData.content = strContent || ""
            cc.vv.PlatformApiMgr.SdkShare(JSON.stringify(shareData))
        } else if (Global.openWeChatLogin) {
            //微信
            var title = 'f4娱乐'
            var content = '喊你一起玩游戏！'
            if (strContent && strContent.length > 0) {
                content = strContent
            }
            var toScene = Global.WX_SHARE_SCENE.Secssion
            Global.WXShareLink(linkUrl, title, content, toScene)
        } else {
            cc.loader.loadRes("prefab/UIShare", function (err, prefab) {
                var newNode = cc.instantiate(prefab);
                var script = newNode.getComponent('UIGuestShare')
                if (script) {
                    script.setQRCodeUrl(linkUrl)
                }
                newNode.position = Global.centerPos
                cc.director.getScene().addChild(newNode);
            });
        }


    }

GlobalFunc.shareAppWebLink = function (actionId, valueId) {
    actionId = actionId || '0';
    valueId = valueId || '0';
    var url_linke = Global.share_url + '?appName=ruili.com&actionId=' + actionId + '&valueId=' + valueId;
    //添加渠道号
    var strChannal = cc.vv.PlatformApiMgr.umChannel()
    url_linke = url_linke + "&channel=" + strChannal
    Global.ShareLink(url_linke, '');

}
//==FB分享end

//WX链接分享
//linkUrl:点击跳转的url
//title:分享标题
//content:分享内容
//toScene:分享场景 Global.WX_SHARE_SCENE
//shareResultCall:分享结果回调
GlobalFunc.WXShareLink = function (linkUrl, title, content, toScene, shareResultCall) {
    var iconUrl = Global.webShareIcon
    if (toScene >= 0 && linkUrl && title && content) {
        cc.vv.WxMgr.wxShareWeb(toScene, title, content, iconUrl, linkUrl, shareResultCall)
    }
}

//WX图片分享
//imgPath 图片地址
//toScene: 分享场景
GlobalFunc.WXShareImage = function (imgPath, toScene, shareResultCall) {
    if (toScene >= 0 && imgPath) {
        cc.vv.WxMgr.wxShareImg(toScene, imgPath, shareResultCall)
    }
}

//是否开启wss 
//不带端口的时候，就采用https
//即当是https的时候，websocket也需要用wss
GlobalFunc.isUserWSS = function (pUrl) {
    var res = false
    let url = Global.loginServerAddress
    if (pUrl) {
        url = pUrl
    }
    if (url.indexOf(':') === -1) {
        res = true
    }
    return res
}

// 获取房间等级显示的文字
GlobalFunc.getRoomLevelString = function (level) {
    level = level || 0;
    var roomNames = ['场次名称', '体验场', '初级场', '普通场', '高级场', 'VIP场'];
    return roomNames[level];
}

// 注册事件
GlobalFunc.registerEvent = function (eventName, func, obj) {
    let canvas = cc.find("Canvas");
    canvas.on(eventName, func, obj);
}

// 发送事件
GlobalFunc.dispatchEvent = function (eventName, data) {
    let canvas = cc.find("Canvas");
    if (canvas) canvas.emit(eventName, data);
}

// 按钮点击事件
//soundCfg null 播放默认 有配置则播放配置的。-1表示不播放声音
GlobalFunc.btnClickEvent = function (btn, func, obj, soundCfg = null) {
    if (btn == null) {
        return null;
    }
    let temp = func.bind(obj);
    btn.on("click", (event) => {
        let btnCmp = btn.getComponent(cc.Button);
        if (btnCmp) {
            if (btnCmp.interactable) {
                if (soundCfg === null || soundCfg === undefined) {
                    if (cc.vv.gameData === null) Global.playEff(Global.SOUNDS.eff_click);
                } else if (soundCfg === -1) {
                    //不播放声音

                } else {
                    cc.vv.AudioManager.playEff(soundCfg.path, soundCfg.filename, soundCfg.common);
                }
            }
        }
        temp(event);
    });
    return btn;
}

// 按钮点击事件, 不需要默认音效版本，如樱桃的爱，伟大的蓝色，func 中 自己单独播放 同一个按键不同的音效
GlobalFunc.btnClickEventNoDefaultSound = function (btn, func, obj) {
    if (btn == null) {
        return null;
    }
    btn.on("click", func, obj);
    return btn;
}

// 数字转换逗号分隔符
GlobalFunc.FormatNumToComma = function (num) {
    var res = num.toString().replace(/\d+/, function (n) { // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
            return $1 + ",";
        });
    })
    return num;
}

//逗号分隔符数字字符串转成数字
GlobalFunc.FormatCommaNumToNum = function (numStr) {
    return parseInt(numStr.replace(/,/g, ""));
}

// 查找toggle选中
GlobalFunc.checkToggleIsSelect = function (toggleParent) {
    for (let i = 0; i < toggleParent.childrenCount; ++i) {
        let t = toggleParent.children[i].getComponent(cc.Toggle);
        if (t.isChecked) {
            return t.node;
        }
    }
    return null;
}

// 设置选中的toggle
GlobalFunc.setToggleSecelct = function (toggleParent, toggleName) {
    for (let i = 0; i < toggleParent.childrenCount; ++i) {

        let t = toggleParent.children[i].getComponent(cc.Toggle);
        if (toggleParent.children[i].name == toggleName) {

            t.isChecked = true;
        } else {
            t.isChecked = false;
        }
    }
}

//自动适配设备
GlobalFunc.autoAdaptDevices = function (isShowAll = true) {
    //
    var canvasNode = cc.find('Canvas');
    var canvas = canvasNode.getComponent(cc.Canvas);
    // let designSize = canvas.getComponent(cc.Canvas).designResolution;
    // canvasNode.removeComponent(cc.Canvas);
    // canvasNode.scaleX = cc.director.getVisibleSize().width/designSize.width;
    // canvasNode.scaleY = cc.director.getVisibleSize().height/designSize.height;
    var frameWidth = canvasNode.width;
    var frameHeight = canvasNode.height;
    var designWidth = canvas.designResolution.width;
    var designHeight = canvas.designResolution.height;
    if ((frameWidth / frameHeight) < (designWidth / designHeight)) { //按照宽来适配
        canvas.fitWidth = true;
        canvas.fitHeight = false;
    } else { //按照高来适配
        canvas.fitWidth = false;
        canvas.fitHeight = true;
    }
    // if (Global.isIOS() &&isShowAll)
    // {
    //     cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
    // }
    //
    // //适配iPhoneX的刘海
    Global.setAdaptIphoneX();
}

// 适配iphoneX
GlobalFunc.setAdaptIphoneX = function () {
    if (Global.isIOS() && 812*2 == cc.winSize.width) {
        var canvas = cc.find("Canvas").getComponent(cc.Canvas);
        canvas.node.scaleX = (1 - 32 * 2 / 812);
    }
}

GlobalFunc.clickService = function () {
    cc.sys.openURL("https://mapped.vorsco.com/talk/chatClient/chatbox.jsp?companyID=631049927&configID=1490&jid=7922767770&s=1");
}

GlobalFunc.getStrBLen = function (str) {
    if (str == null) return 0;
    if (typeof str != "string") {
        str += "";
    }
    return str.replace(/[^\x00-\xff]/g, "ab").length;
}

/*
** 检测IP跟GPS
** playersList参数结构:[{uid:*, ip:*, lat:* lng:*},...]
** toPlayer参数结构：{uid:*, ip:*, lat:*, lng:*} 说明：相对玩家，缺省情况下，会两两相互之间比较
*/
GlobalFunc.checkIpAndGps = function (playersList, toPlayer) {
    //是否开启GPS
    var isOpenGPS = function (player) {
        return !(player.lat === 0 && player.lng === 0);
    };

    //IP相同
    var isSameIp = function (player1, player2) {
        return (player1.ip.split(':')[0] == player2.ip.split(':')[0]);
    };

    var isNearlyDistance = function (player1, player2) {
        if (!isOpenGPS(player1)) return false;
        if (!isOpenGPS(player2)) return false;
        return Global.getDistanceOfTwoPoint(player1.lat, player1.lng, player2.lat, player2.lng) <= 0.2;
    }

    if (!toPlayer) {
        //先检测是否IP相同
        for (var i = 0; i < playersList.length - 1; i++) {
            if (!playersList[i]) continue;
            for (var j = i + 1; j < playersList.length; j++) {
                if (!playersList[j]) continue;
                if (isSameIp(playersList[i], playersList[j])) return true;
            }
        }

        //再检测GPS是否过近
        for (var i = 0; i < playersList.length - 1; i++) {
            if (!playersList[i]) continue;
            for (var j = i + 1; j < playersList.length; j++) {
                if (!playersList[j]) continue;
                if (isNearlyDistance(playersList[i], playersList[j])) return true;
            }
        }
    } else {
        //先检测是否IP相同
        for (var i = 0; i < playersList.length; i++) {
            if (!playersList[i]) continue;
            if (playersList[i].uid == toPlayer.uid) continue;
            if (isSameIp(playersList[i], toPlayer)) return true;
        }

        //再检测GPS是否过近
        for (var i = 0; i < playersList.length; i++) {
            if (!playersList[i]) continue;
            if (playersList[i].uid == toPlayer.uid) continue;
            if (isNearlyDistance(playersList[i], toPlayer)) return true;
        }
    }
    return false;
}
//动态生成二维码接口
//urlData:数据链接
//node:显示二维码预制节点
//bShowIcon:是否显示游戏icon
GlobalFunc.showQRCode = function (urlData, node, bShowIcon) {
    if (node) {
        var script = node.getComponent('showQRcode')
        if (script) {
            script.showQRCode(urlData, bShowIcon)
        }
    }

}

GlobalFunc.moveMenu = function (isDown, meunNode) // 移动菜单栏
{
    meunNode.getComponent(cc.Button).interactable = false;
    let startPos = isDown ? cc.v2(0, meunNode.height) : cc.v2(0, 0);
    let endPos = isDown ? cc.v2(0, 0) : cc.v2(0, meunNode.height);
    meunNode.position = startPos;
    meunNode.opacity = isDown ? 0 : 255;
    meunNode.active = true;
    let delaytime = 0.3;
    meunNode.runAction(cc.sequence(cc.spawn(cc.moveTo(delaytime, endPos), cc.fadeTo(delaytime, isDown ? 255 : 0)), cc.callFunc(() => {
        meunNode.getComponent(cc.Button).interactable = true;
    })));
}

// 弹出动画显示
GlobalFunc.showAlertAction = function (node, isShow, startScale, endScale, callback) {
    let start_Scale = startScale;
    let end_Scale = endScale;
    if (isShow) {
        if (start_Scale == null) {
            node.scale = 0;
        } else {
            node.scale = start_Scale;
        }

        if (end_Scale == null) {
            end_Scale = 1;
        }
    } else {
        if (start_Scale == null) {
            node.scale = 1;
        }

        if (end_Scale == null) {
            end_Scale = 0;
        }
    }
    let action = cc.scaleTo(0.2, end_Scale);
    if (isShow) {
        action.easing(cc.easeBackOut());
    } else {
        action.easing(cc.easeSineIn());
    }

    node.runAction(cc.sequence(action, cc.callFunc(function () {
        if (callback) {
            callback();
        }

    })));
}

//创建一个新节点带帧动画
//atlas资源所在的图集
//preSufix资源的前缀
//nNum帧动画张数
//speed播放速度
//bLoop是否循环
//endCall播完结束的回调
//strConn前缀和数字之间的连接字符可空
//beginDif:开始图片的起始下标，默认1开始
//return: 返回的节点需要自己删除
GlobalFunc.createrSpriteAni = function (atlas, preSufix, nNum, speed, bLoop, endCall, strConn, beginDif, addZero) {
    var self = this
    //创建一个空节点
    var newNode = new cc.Node('node_eff')
    var sp = newNode.addComponent(cc.Sprite)

    self.addSpriteAni(newNode, atlas, preSufix, nNum, speed, bLoop, endCall, strConn, beginDif, addZero)

    return newNode
}

// 时间戳转换成具体时间
GlobalFunc.getLocalTime = (timestamp, splitStr = '/') => {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + splitStr;
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + splitStr;
    var D = date.getDate();
    if (D < 10) D = "0" + D;
    D = D + ' ';
    var h = date.getHours();
    if (h < 10) h = "0" + h;
    h = h + ":"
    var m = date.getMinutes();
    if (m < 10) m = "0" + m;
    m = m + ":"
    var s = date.getSeconds();
    if (s < 10) s = "0" + s;
    return Y + M + D + h + m + s;
},

// 设置玩家名字
// @param isSubstr 是否截取
GlobalFunc.showName = function (name, isSubstr) {
    let str = name;
    // 全部都是数字
    if (Global.checkNum(name) && name.length === 11) {
        str = name.substr(0, 3);
        str += "******";
        str += name.substr(9, name.length);
    } else {
        if (isSubstr) {
            str = Global.subStrOfChinese(name, 10, true);
        }
    }
    return str;
}

//判断字符串是否为数字 ，判断正整数用/^[1-9]+[0-9]*]*$/
GlobalFunc.checkNum = function (str) {

    var reg = /^[0-9]+.?[0-9]*$/;

    if (!reg.test(str)) {
        return false;
    } else return true;

},

//给节点添加帧动画组件
    GlobalFunc.addSpriteAni = function (newNode, atlas, preSufix, nNum, speed, bLoop, endCall, strConn, beginDif, addZero) {
        var self = this
        if (!beginDif) beginDif = 1
        if (addZero == null) {
            addZero = true
        }
        // 是否需要补零
        var getZeroize = function (num, isZeroize) {
            if (isZeroize) {
                let str = num < 10 ? ("0" + num) : num;
                return str;
            } else {
                return num;
            }

        }

        var lists = []
        for (var i = 0; i < nNum; i++) {
            var key = preSufix + getZeroize(i + beginDif, addZero)
            if (strConn) {
                key = preSufix + strConn + getZeroize(i + beginDif, addZero)
            }

            if (atlas._spriteFrames[key]) {
                lists.push(atlas._spriteFrames[key])
            }

        }

        var ani = newNode.addComponent(cc.Animation)
        var clip = cc.AnimationClip.createWithSpriteFrames(lists, 30)
        let finishEvent = 'finished'
        if (bLoop) {
            clip.wrapMode = cc.WrapMode.Loop
            finishEvent = 'lastframe'
        }

        clip.speed = speed
        ani.addClip(clip, preSufix)
        var finishCall = function () {
            ani.off(finishEvent, finishCall)
            if (endCall) {
                endCall()
            }
        }
        ani.on(finishEvent, finishCall) //不循环的
        ani.play(preSufix)
    }

//空对象判断
GlobalFunc.isEmptyObject = function (obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}


//获取设备信息
//用于后台上报
GlobalFunc.getDeviceInfo = function () {
    let info = {osValue: 'web'}
    if (cc.sys.isNative) {
        //分辨率
        info.frameSize = cc.view.getFrameSize()
        //系统:ios android
        info.osValue = cc.sys.os
        //手机型号 android:手机品牌_手机型号(小米_xiaomi)  ios:iphne6_ios12
        info.phoneBrand = cc.vv.PlatformApiMgr.getDeviceBrand()
        //手机操作系统版本
        info.phoneSystemVision = cc.vv.PlatformApiMgr.getDeviceOpSysVision()
        //手机唯一识别码
        info.phoneUuid = this.getDeviceId()

    }
    return info
}

//对节点缩放适配
//node cc.Node 类型
Global.setNodeScaleFixWin = function (node) {
    var winSize = cc.director.getWinSize()
    node.scaleX = winSize.width / node.width
    node.scaleY = winSize.height / node.height
}

//对节点缩放适配, 节点的width和height，可以不是 设计分辨率
//node cc.Node 类型
Global.setNodeScaleWithDesignSize = function (node) {
    node.scaleX = cc.winSize.width / Global.designSize.width;
    node.scaleY = cc.winSize.height / Global.designSize.height;
}

// 剔除重复元素
Global.unique5 = function (arr) {
    var x = new Set(arr);
    return [...x];
}

//节点摇晃效果
//@param node: 要摇晃的节点
//@param offset 摇晃的幅度(默认16)
//@param time: 摇晃的时间(默认1s)
//@param originPos: 摇晃结束后回到的位置
Global.shakeNode = function (node, offset, time, originPos) {
    offset = offset || 16;
    time = time || 1.0;
    let duration = 0.04;
    // 一个震动耗时4个duration左,复位,右,复位
    // 同时左右和上下震动
    let times = Math.floor(time / (duration * 4));
    let moveLeft = cc.moveBy(duration, cc.p(-offset, 0));
    let moveLReset = cc.moveBy(duration, cc.p(offset, 0));
    let moveRight = cc.moveBy(duration, cc.p(offset, 0));
    let moveRReset = cc.moveBy(duration, cc.p(-offset, 0));
    let horSeq = cc.sequence(moveLeft, moveLReset, moveRight, moveRReset);
    let moveUp = cc.moveBy(duration, cc.p(0, offset));
    let moveUReset = cc.moveBy(duration, cc.p(0, -offset));
    let moveDown = cc.moveBy(duration, cc.p(0, -offset));
    let moveDReset = cc.moveBy(duration, cc.p(0, offset));
    let verSeq = cc.sequence(moveUp, moveUReset, moveDown, moveDReset);
    node.runAction(cc.sequence(cc.scaleTo(duration, 1.025), cc.repeat(cc.spawn(horSeq, verSeq), times), cc.scaleTo(duration, 1), cc.callFunc(() => {
        if (originPos) {
            node.setPosition(originPos);
        }
    })));
}

// 金币不足播放广告
Global.showAd = function () {
    cc.vv.FloatTip.show("金币不足");

    // cc.vv.AlertView.show(cc.vv.Language.show_ad,()=>{
    //     cc.vv.PlatformApiMgr.showRewardedVideo();
    //     cc.vv.PlatformApiMgr.addCallback((data)=>{
    //         if(data.result == "7"){
    //             console.log("----------得到奖励");
    //             cc.vv.NetManager.send({c:MsgId.WATCH_AD});
    //         }
    //     },"adCallback");
    //
    // },()=>{});
}

Global.getShortList = function () {
    return [
        '快点吧,我等的花都谢了',
        '你的牌打的太好了',
        '打一个来碰呀',
        '好歹让我吃一个',
        '来呀,互相伤害',
        '我有一百种办法胡你',
        '呵呵~',
        '还让不让我摸牌了',
        '你这样以后没朋友',
    ];
}

Global.getShortListPaoDeKuai = function () {
    return [
        '搏一搏，单车变摩托',
        '风吹鸡蛋壳，财去人安乐',
        '姑娘，你真是条汉子',
        '我等得假花都谢了',
        '我炸你个桃花朵朵开',
        '一走一停真有型，一秒一卡好潇洒',
        '炸得好',
        '真怕猪一样的队友',
        '你要是不装逼，我们还是好朋友',
    ];
}

Global.getEmjoList = function () {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
}



///////////////////微信登录相关的SDK
//判断用户是否安装了微信客户端
Global.isWXAppInstalled = function () {
    if (GlobalFunc.isAndroid()) {
        let result = false;
        result = jsb.reflection.callStaticMethod(Global.ANDROID_CLASS_NAME, "isWXAppInstalled", "()Z");
        return result;
    }
    else if (GlobalFunc.isIOS()) {
        let result = false;
        result = jsb.reflection.callStaticMethod(Global.IOS_CLASS_NAME, "isWXAppInstalled");
        return result;
    }else {
        return false;
    }
}

//设置微信SDK的appid 和 APP_SECRET, 返回注册app到微信是否成功
Global.setAppidWithAppsecretForJS = function (app_id, app_sceret) {
    if (GlobalFunc.isAndroid()) {
        let result = false;
        result = jsb.reflection.callStaticMethod(Global.ANDROID_CLASS_NAME, "setAppidWithAppsecretForJS", "(Ljava/lang/String;Ljava/lang/String;)Z", app_id, app_sceret );
        return result;
    }
    else if (GlobalFunc.isIOS()) {
        let result = false;
        result = jsb.reflection.callStaticMethod(Global.IOS_CLASS_NAME, "setAppidWithAppsecretForJS", app_id, app_sceret);
        return result;
    }
}

Global.wxRequestCallBack = null;
Global.wxRequestCallBackTarget = null;
Global.wxCode = "";
//设置微信授权之后的回调函数
Global.setWXRequestCallBack = function (callback, target) {
    Global.wxRequestCallBack = callback;
    Global.wxRequestCallBackTarget = target;
}

//JAVA/OC端调用此函数，返回JS层code值
Global.WXCode = function (code) {
    Global.wxCode = code;
    Global.wxRequestCallBack.call(Global.wxRequestCallBackTarget, code);
}

//拉起微信客户端
Global.onWxAuthorize = function (callback, target) {
    // if (callback &&  typeof (callback)=== 'function')
    Global.wxRequestCallBack = callback;
    Global.wxRequestCallBackTarget = target;

    if (!Global.wxRequestCallBack) {
        cc.warn("请先设置微信相应的回调");
        return;
    }

    if (GlobalFunc.isAndroid()) {
        let result = false;
        result = jsb.reflection.callStaticMethod(Global.ANDROID_CLASS_NAME, "onWxAuthorize", "()Z");
        return result;
    } else if (GlobalFunc.isIOS()) {
        let result = false;
        result = jsb.reflection.callStaticMethod(Global.IOS_CLASS_NAME, "onWxAuthorize");
        return result;
    }
}

//shareSceneType:分享目标场景
//title:分享标题
//description:分享描述
GlobalFunc.onWXShareText = function (shareSceneType, title, description) {
    if (GlobalFunc.isAndroid()) {
        jsb.reflection.callStaticMethod(Global.ANDROID_CLASS_NAME, "onWXShareText", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", shareSceneType, title, description);
    } else if (GlobalFunc.isIOS()) {
        jsb.reflection.callStaticMethod(Global.IOS_CLASS_NAME, "onWXShareText:title:description:", shareSceneType, title, description);
    }
}

//shareSceneType:分享目标场景
//imgPath 图片地址
GlobalFunc.onWXShareImage = function (shareSceneType) {
    if (GlobalFunc.isNative()) {   
        let dirpath = jsb.fileUtils.getWritablePath() + 'ScreenShoot/';
        if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
            jsb.fileUtils.createDirectory(dirpath);
        }
        let name = 'ScreenShoot-' + (new Date()).valueOf() + '.png';
        let imgPath = dirpath + name;
        let size = cc.winSize;
        let rt = cc.RenderTexture.create(size.width, size.height, cc.Texture2D.PixelFormat.RGBA8888, 0x88F0);
        rt.setPosition(cc.p(size.width/2, size.height/2));
        cc.director.getScene()._sgNode.addChild(rt);
        rt.setVisible(false);
        rt.begin();
        cc.director.getScene()._sgNode.visit();
        rt.end();
        rt.saveToFile('ScreenShoot/' + name, cc.ImageFormat.PNG, true, function() {
            rt.removeFromParent();
            if(GlobalFunc.isAndroid()){
                jsb.reflection.callStaticMethod(Global.ANDROID_CLASS_NAME, "onWXShareImage", "(Ljava/lang/String;Ljava/lang/String;)V", shareSceneType, imgPath);
            }else if(GlobalFunc.isIOS()){
                jsb.reflection.callStaticMethod(Global.IOS_CLASS_NAME, "onWXShareImage:imgPath:", shareSceneType, imgPath);
            }
        });
    }
}

//shareSceneType:分享目标场景
//title:分享标题
//description:分享描述
//iconUrl:icon网址
//linkUrl:链接网址
GlobalFunc.onWXShareLink = function (shareSceneType, title, description, iconUrl, linkUrl) {
    if(GlobalFunc.isAndroid()){
        jsb.reflection.callStaticMethod(Global.ANDROID_CLASS_NAME, "onWXShareLink", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", shareSceneType, title, description, iconUrl, linkUrl);
    }else if(GlobalFunc.isIOS()){
        jsb.reflection.callStaticMethod(Global.IOS_CLASS_NAME, "onWXShareLink:title:description:iconUrl:linkUrl:", shareSceneType, title, description, iconUrl, linkUrl);
    }
}

//JAVA/OC端调用此函数，返回JS层code值
Global.GetGPSData = function (parameterStr) {
    let GPSDataStrArr = parameterStr.split(",");
    let req = {c: MsgId.SELF_GPS_DATA};
    req.lng = GPSDataStrArr[0];     //经度
    req.lat = GPSDataStrArr[1];     //维度
    req.city = GPSDataStrArr[2];    //区域
    cc.vv.NetManager.send(req);
}

GlobalFunc.starBatteryReceiver = function () {
    if (GlobalFunc.isAndroid()) {
        jsb.reflection.callStaticMethod(Global.ANDROID_CLASS_NAME, "starBatteryReceiver", "()V");
    } else if (GlobalFunc.isIOS()) {
        let parameterStr = jsb.reflection.callStaticMethod(Global.IOS_CLASS_NAME, "starBatteryReceiver");
        Global.dispatchEvent(EventId.BATTERY_CHANGE_NOTIFY, parameterStr);
    }
}

Global.GetBatteryChange = function (parameterStr) {
    Global.dispatchEvent(EventId.BATTERY_CHANGE_NOTIFY, parameterStr);
}

Global.getDataStr = function (year,month,day){
    let dataStr = year + '-';
    if (9 < month) {
        dataStr += (month + 1);         //month比实际小1
    } else {
        dataStr += '0' + (month + 1);   //month比实际小1
    }
    if (day) {
        dataStr += '-';
        if (9 < day) {
            dataStr += day;
        } else {
            dataStr += '0' + day;
        }
    }
    return dataStr;
}

GlobalFunc.initRecord = function (){
    if (GlobalFunc.isAndroid()) {
        cc.vv.FloatTip.show("initRecord isAndroid");

        Global.voicemgr = yvcc.IMDispatchMsgNode.getInstance();
        cc.vv.FloatTip.show("voicemgr getInstance()");

        Global.voicemgr.setCallback(Global.recordCallback, this);
        cc.vv.FloatTip.show("voicemgr setCallback");

        Global.voicemgr.initSDK(1003818);
        cc.vv.FloatTip.show("voicemgr initSDK");

        Global.voicemgr.cpLogin("lucky88", "19100");
        cc.vv.FloatTip.show("voicemgr cpLogin");
    } else if (GlobalFunc.isIOS()) {

    }
}

GlobalFunc.recordCallback = function (data){
    let rsp = JSON.parse(data);
    Global.dispatchEvent(EventId.VOICE_EVENT, rsp);
    cc.vv.FloatTip.show("voiceCallback"+data);
}

GlobalFunc.startRecord = function (){
    if (GlobalFunc.isAndroid()) {
        Global.voicemgr.startRecord(10, "startRecord10");
    } else if (GlobalFunc.isIOS()) {

    }
}

GlobalFunc.stopRecord = function (){
    if (GlobalFunc.isAndroid()) {
        Global.voicemgr.stopRecord();
    } else if (GlobalFunc.isIOS()) {

    }
}