/*
** Log封装
** 定义比较方便使用的log封装
*/

window.LogMode = cc.DebugMode.INFO;
var AppLog = cc.Class({
    extends: cc.Component,
    statics: {
        getDateString : function () {
            var d = new Date();
            var str = d.getHours();
            var timeStr = "";
            timeStr += (str.length==1? "0"+str : str) + ":";
            str = d.getMinutes();
            timeStr += (str.length==1? "0"+str : str) + ":";
            str = d.getSeconds();
            timeStr += (str.length==1? "0"+str : str) + ":";
            str = d.getMilliseconds();
            if( str.length==1 ) str = "00"+str;
            if( str.length==2 ) str = "0"+str;
            timeStr += str;

            timeStr = "[" + timeStr + "]";
            return timeStr;
        },

        stack : function (index) {
            var e = new Error();
            var lines = e.stack.split("\n");
            lines.shift();
            var result = [];
            lines.forEach(function (line) {
                line = line.substring(7);
                var lineBreak = line.split(" ");
                if (lineBreak.length<2) {
                    result.push(lineBreak[0]);
                } else {
                    result.push({[lineBreak[0]] : lineBreak[1]});
                }
            });

            if (index == -1) {
                var logstr = 'ERROR Function stack:';
                for (var i=2; i < result.length; i++) {
                    logstr += '\n\t';
                    if (typeof result[i] != 'string') {
                        var list = [];
                        for (var a in result[i]) {
                            list.push(a);
                        }
                        logstr += list[0];
                        logstr += result[i][list[0]];
                    }
                    else {
                        logstr += result[i];
                    }                    
                }
                logstr += '\nLog: ';
                return logstr;
            }
            else if(index < result.length-1){
                var list = [];
                for(var a in result[index]){
                    list.push(a);
                }
                //var splitList = list[0].split(".");
                return (list[0] + result[index][list[0]] + "\n\tLog: ");
            }
        },

        log : function () {
            var backLog = console.log || cc.log || log;

            if(LogMode <= cc.DebugMode.INFO){
                if (Global.isNative()) {
                    backLog(AppLog.getDateString() + "Log: " + cc.js.formatStr.apply(cc,arguments));
                }
                else {
                    backLog.call(this,"%c%s%s"+cc.js.formatStr.apply(cc,arguments),"color:#4E455F;",this.stack(3),AppLog.getDateString());  
                }
            }
        },

        info : function () {
            var backLog = console.log || cc.log || log;
            if(LogMode <= cc.DebugMode.INFO){
                if (Global.isNative()) {
                    backLog(AppLog.getDateString() + "Info: " + cc.js.formatStr.apply(cc,arguments));
                }
                else {
                    backLog.call(this,"%c%s%s:"+cc.js.formatStr.apply(cc,arguments),"color:#00CD00;",this.stack(2),AppLog.getDateString());
                }
            }
        },

        warn : function () {
            var backLog = console.log || cc.log || log;
            if(LogMode <= cc.DebugMode.WARN){
                if (Global.isNative()) {
                    backLog(AppLog.getDateString() + "Warn: " + cc.js.formatStr.apply(cc,arguments));
                }
                else {
                    backLog.call(this,"%c%s%s:"+cc.js.formatStr.apply(cc,arguments),"color:#ee7700;",this.stack(2),AppLog.getDateString());
                }
            }
        },

        err : function () {
            var backLog = console.log || cc.log || log;
            if(LogMode <= cc.DebugMode.ERROR){
                if (Global.isNative()) {
                    backLog(AppLog.getDateString() + "Error: " + cc.js.formatStr.apply(cc,arguments));
                }
                else {
                    backLog.call(this,"%c%s%s:"+cc.js.formatStr.apply(cc,arguments),"color:red",this.stack(-1),AppLog.getDateString());
                }
            }
        },
    },
});

window.AppLog = AppLog;
