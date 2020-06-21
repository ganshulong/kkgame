var URL = "192.168.0.158:80";

var HTTP = cc.Class({
    extends: cc.Component,

    statics: {
        _sessionId: 0,
        _url: URL,

        sendReq: function (path, data, handler, extraUrl,type="GET") {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;  //5秒超时

            var str = "?";
            for (var key in data) {
                if (str != "?") {
                    str += "&";
                }
                str += key + "=" + data[key];
            }

            if (extraUrl == null) {
                extraUrl = HTTP._url
            }

            var requestURL = extraUrl + path + encodeURI( str );
            console.log("#######request url:" +requestURL);
            xhr.open(type, requestURL, true);
            if (Global.isNative()) {
                xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
            }
            xhr.onreadystatechange = function () {
                HTTP.onReadyStateChanged(xhr, handler);
            };
            xhr.send();
            return xhr;
        },

        onReadyStateChanged: function (xhr, handler) {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                console.log("http res("+ xhr.responseText.length + "): " + xhr.responseText);
                try {
                    var ret = JSON.parse(xhr.responseText);
                    if (handler) {
                        handler(true, ret);
                    }
                    else {
                        console.log("HTTP is not set callback function!");
                        handler(false);
                    }
                } 
                catch (e) {
                    console.log("HTTP Error: " + e);
                    handler(false);
                }
                finally {
                    // Todo ...
                }
            }
            else {
                console.log('Http Error:  readyState: ' + xhr.readyState + '  status: ' + xhr.status);
                handler(false);
            }
        },
    },
});

module.exports = HTTP;