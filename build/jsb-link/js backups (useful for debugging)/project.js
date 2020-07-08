require = function o(s, r, c) {
function l(t, e) {
if (!r[t]) {
if (!s[t]) {
var n = "function" == typeof require && require;
if (!e && n) return n(t, !0);
if (h) return h(t, !0);
var i = new Error("Cannot find module '" + t + "'");
throw i.code = "MODULE_NOT_FOUND", i;
}
var a = r[t] = {
exports: {}
};
s[t][0].call(a.exports, function(e) {
return l(s[t][1][e] || e);
}, a, a.exports, o, s, r, c);
}
return r[t].exports;
}
for (var h = "function" == typeof require && require, e = 0; e < c.length; e++) l(c[e]);
return l;
}({
AlertViewMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "275f7NqQtdAlpyKtQwZoWaq", "AlertViewMgr");
cc.Class({
extends: cc.Component,
properties: {
_prefab: null
},
init: function(e) {
this._prefab = e;
},
showTips: function(e, t) {
var n = cc.director.getScene().getChildByName("node_alterview");
n && n.removeFromParent();
var i = cc.instantiate(this._prefab);
i.name = "node_alterview";
i.getComponent("AlertView").showTips(e, t);
cc.director.getScene().addChild(i);
},
show: function(e, t, n, i, a) {
var o = cc.director.getScene().getChildByName("node_alterview");
o && o.removeFromParent();
var s = cc.instantiate(this._prefab);
s.name = "node_alterview";
s.getComponent("AlertView").show(e, t, n, i, a);
cc.director.getScene().addChild(s);
},
start: function() {}
});
cc._RF.pop();
}, {} ],
AlertView: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "3dce5WFyPtJD6tUtOQ/3Mlp", "AlertView");
cc.Class({
extends: cc.Component,
properties: {
btn_close: cc.Button,
btn_sure: cc.Button,
btn_cancel: cc.Button,
lbl_content: cc.Label,
_sure_btn_posx: 0,
_cancel_btn_posx: 0,
_center_posx: 0,
_sureBtnCb: null,
_cancelBtnCb: null,
_closeBtnCb: null
},
onLoad: function() {
this.node.setLocalZOrder(Global.CONST_NUM.HIGHT_ZORDER);
},
start: function() {
this.setScale();
},
setScale: function() {
var e = cc.find("Canvas"), t = e.width, n = e.height;
Global.designSize.width, Global.designSize.height;
if (e.width > e.height) {
this.node.scaleX = .9;
this.node.scaleY = .9;
} else {
this.node.scaleX = .7;
this.node.scaleY = .7;
}
},
init: function() {
this._sure_btn_posx = this.btn_sure.node.x;
this._cancel_btn_posx = this.btn_cancel.node.x;
this._center_posx = this._cancel_btn_posx + .5 * (this._sure_btn_posx - this._cancel_btn_posx);
},
onEnable: function() {
this.node.x = cc.director.getWinSize().width / 2;
this.node.y = cc.director.getWinSize().height / 2;
},
showTips: function(e, t) {
this.init();
this.hideBtns();
this.lbl_content.string = e && 0 < e.length ? e : "请传入提示内容！";
this.btn_sure.node.active = !0;
this.btn_sure.node.x = this._center_posx;
t && (this._sureBtnCb = t);
},
show: function(e, t, n, i, a) {
this.setScale();
this.init();
this.hideBtns();
this.lbl_content.string = e && 0 < e.length ? e : "请传入提示内容！";
if (t) {
this._sureBtnCb = t;
this.btn_sure.node.active = !0;
this.btn_sure.node.x = n ? this._sure_btn_posx : this._center_posx;
}
if (n) {
this._cancelBtnCb = n;
this.btn_cancel.node.active = !0;
this.btn_cancel.node.x = this._cancel_btn_posx;
}
if (i) {
this.btn_close.node.active = !0;
a && (this._closeBtnCb = a);
}
},
hideBtns: function() {
this.btn_close.node.active = !1;
this.btn_cancel.node.active = !1;
this.btn_sure.node.active = !1;
this._closeBtnCb = null;
this._sureBtnCb = null;
this._cancelBtnCb = null;
},
onCloseBtnClicked: function() {
Global.playEff(Global.SOUNDS.eff_ui_close);
this._closeBtnCb && this._closeBtnCb();
this.node.removeFromParent();
},
onSureBtnClicked: function() {
Global.playEff(Global.SOUNDS.eff_click);
this._sureBtnCb && this._sureBtnCb();
this.node.removeFromParent();
},
onCancelBtnClicked: function() {
Global.playEff(Global.SOUNDS.eff_click);
this._cancelBtnCb && this._cancelBtnCb();
this.node.removeFromParent();
}
});
cc._RF.pop();
}, {} ],
AniFrameEvent: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "8e868F7Nj5BP7oCNABJMM5a", "AniFrameEvent");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
showCoins: function() {
Global.dispatchEvent(EventId.HALL_EFF_SHOWCOINS, 1);
}
});
cc._RF.pop();
}, {} ],
AnimationFrameEvent: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "cf410tU8OFLI6JvHvsdN+Z+", "AnimationFrameEvent");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
callback: function() {
var e = [].slice.call(arguments, 1);
cc.vv.EventManager.emit(arguments[0], e);
}
});
cc._RF.pop();
}, {} ],
AppLog: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "bdde8lksOhKO5Zj5w2La0u6", "AppLog");
window.LogMode = cc.DebugMode.INFO;
var i = cc.Class({
extends: cc.Component,
statics: {
getDateString: function() {
var e = new Date(), t = e.getHours(), n = "";
n += (1 == t.length ? "0" + t : t) + ":";
n += (1 == (t = e.getMinutes()).length ? "0" + t : t) + ":";
n += (1 == (t = e.getSeconds()).length ? "0" + t : t) + ":";
1 == (t = e.getMilliseconds()).length && (t = "00" + t);
2 == t.length && (t = "0" + t);
return n = "[" + (n += t) + "]";
},
stack: function(e) {
var t = new Error().stack.split("\n");
t.shift();
var n = [];
t.forEach(function(e) {
var t = (e = e.substring(7)).split(" ");
t.length < 2 ? n.push(t[0]) : n.push(function(e, t, n) {
t in e ? Object.defineProperty(e, t, {
value: n,
enumerable: !0,
configurable: !0,
writable: !0
}) : e[t] = n;
return e;
}({}, t[0], t[1]));
});
if (-1 == e) {
for (var i = "ERROR Function stack:", a = 2; a < n.length; a++) {
i += "\n\t";
if ("string" != typeof n[a]) {
var o = [];
for (var s in n[a]) o.push(s);
i += o[0];
i += n[a][o[0]];
} else i += n[a];
}
return i += "\nLog: ";
}
if (e < n.length - 1) {
o = [];
for (var s in n[e]) o.push(s);
return o[0] + n[e][o[0]] + "\n\tLog: ";
}
},
log: function(e) {
function t() {
return e.apply(this, arguments);
}
t.toString = function() {
return e.toString();
};
return t;
}(function() {
var e = console.log || cc.log || log;
LogMode <= cc.DebugMode.INFO && (Global.isNative() ? e(i.getDateString() + "Log: " + cc.js.formatStr.apply(cc, arguments)) : e.call(this, "%c%s%s" + cc.js.formatStr.apply(cc, arguments), "color:#4E455F;", this.stack(3), i.getDateString()));
}),
info: function() {
var e = console.log || cc.log || log;
LogMode <= cc.DebugMode.INFO && (Global.isNative() ? e(i.getDateString() + "Info: " + cc.js.formatStr.apply(cc, arguments)) : e.call(this, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments), "color:#00CD00;", this.stack(2), i.getDateString()));
},
warn: function() {
var e = console.log || cc.log || log;
LogMode <= cc.DebugMode.WARN && (Global.isNative() ? e(i.getDateString() + "Warn: " + cc.js.formatStr.apply(cc, arguments)) : e.call(this, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments), "color:#ee7700;", this.stack(2), i.getDateString()));
},
err: function() {
var e = console.log || cc.log || log;
LogMode <= cc.DebugMode.ERROR && (Global.isNative() ? e(i.getDateString() + "Error: " + cc.js.formatStr.apply(cc, arguments)) : e.call(this, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments), "color:red", this.stack(-1), i.getDateString()));
}
}
});
window.AppLog = i;
cc._RF.pop();
}, {} ],
AssetManager: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "94fbaJUTbZNl71UwPCZSHXf", "AssetManager");
cc.Class({
extends: cc.Component,
statics: {
loadAllRes: function() {
this.loadAllBitMapFont();
},
loadAllBitMapFont: function() {
cc.loader.loadResDir("font/", cc.BitmapFont, function(e, t) {
var n = {};
for (var i in t) n[t[i]._name] = t[i];
window.BitMapFont = n;
}.bind(this));
}
}
});
cc._RF.pop();
}, {} ],
AudioManager: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "604ecP8/J1J7orKou3S09Da", "AudioManager");
var u = function(e, t) {
if (Array.isArray(e)) return e;
if (Symbol.iterator in Object(e)) return function(e, t) {
var n = [], i = !0, a = !1, o = void 0;
try {
for (var s, r = e[Symbol.iterator](); !(i = (s = r.next()).done); i = !0) {
n.push(s.value);
if (t && n.length === t) break;
}
} catch (e) {
a = !0;
o = e;
} finally {
try {
!i && r.return && r.return();
} finally {
if (a) throw o;
}
}
return n;
}(e, t);
throw new TypeError("Invalid attempt to destructure non-iterable instance");
};
cc.Class({
extends: cc.Component,
statics: {
bgmVolume: 1,
effVolume: 1,
bgmAudioId: -1,
tempBgmCfg: JSON.stringify({
suburl: "",
iscommon: !1
}),
languageType: 0,
CHINESE: 0,
ENGLISH: 1,
soundEffectList: null,
bgmUrl: "",
init: function() {
var e = Global.getLocal("bgmVolume", this.bgmVolume);
this.bgmVolume = parseFloat(e);
e = Global.getLocal("effVolume", this.effVolume);
this.effVolume = parseFloat(e);
e = Global.getLocal("languageType", this.languageType);
this.languageType = parseInt(e);
this.tempBgmCfg = {
suburl: "",
iscommon: !1
};
cc.game.on(cc.game.EVENT_HIDE, this.onBackGround.bind(this));
cc.game.on(cc.game.EVENT_SHOW, this.onEnterFront.bind(this));
this.soundEffectList = new Map();
},
onBackGround: function() {
this.pauseAll();
},
onEnterFront: function() {
this.resumeAll();
},
getSoundURL: function(e, t, n) {
var i = "resources/";
i += e;
i += "audio/";
n || (this.languageType == this.ENGLISH || "en" == Global.language ? i += "english/" : i += "chinese/");
var a = t.indexOf("."), o = t.substr(a + 1);
"ogg" === o || "wav" === o || "WAV" === o || (t += ".mp3");
var s = i + t;
return cc.url.raw(s);
},
playBgm: function(e, t, n, i, a) {
var o = !(5 < arguments.length && void 0 !== arguments[5]) || arguments[5];
cc.log("play Bgm music: ", e);
this.tempBgmCfg.subpath = e;
this.tempBgmCfg.filename = t;
this.tempBgmCfg.iscommon = n;
var s = this.getSoundURL(e, t, n);
if (this.bgmUrl !== s) {
0 <= this.bgmAudioId && cc.audioEngine.stop(this.bgmAudioId);
var r = this.bgmVolume;
i && 0 < this.bgmVolume && (r = i);
this.bgmAudioId = cc.audioEngine.play(s, o, r);
a && cc.audioEngine.setFinishCallback(this.bgmAudioId, a);
this.bgmUrl = s;
}
return this.bgmAudioId;
},
stopBgm: function() {
if (0 <= this.bgmAudioId) {
cc.audioEngine.stop(this.bgmAudioId);
this.bgmAudioId = -1;
this.bgmUrl = "";
}
},
playEff: function(e, t, n) {
var i = 3 < arguments.length && void 0 !== arguments[3] && arguments[3], a = this, o = arguments[4], s = arguments[5];
cc.log("Effect:" + t);
var r = this.getSoundURL(e, t, n), c = cc.audioEngine.play(r, i, s || this.effVolume);
this.soundEffectList.set(c, r);
cc.audioEngine.setFinishCallback(c, function(e) {
a.soundEffectList.delete(c);
o && o();
});
return c;
},
setEffVolume: function(e) {
if (this.effVolume != e) {
this.effVolume = e;
Global.saveLocal("effVolume", this.effVolume);
}
var t = !0, n = !1, i = void 0;
try {
for (var a, o = this.soundEffectList.entries()[Symbol.iterator](); !(t = (a = o.next()).done); t = !0) {
var s = a.value, r = u(s, 2), c = r[0];
r[1];
cc.audioEngine.setVolume(c, e);
}
} catch (e) {
n = !0;
i = e;
} finally {
try {
!t && o.return && o.return();
} finally {
if (n) throw i;
}
}
},
setBgmVolume: function(e) {
1 < e && (e = 1);
if (this.bgmVolume != e) {
this.bgmVolume = e;
Global.saveLocal("bgmVolume", this.bgmVolume);
cc.audioEngine.setVolume(this.bgmAudioId, e);
}
},
setLanguage: function(e) {
if (this.languageType != e) {
if (e != this.CHINESE && e != this.ENGLISH) return;
Global.saveLocal("languageType", e);
this.languageType = e;
this.tempBgmCfg.iscommon || this.playBgm(this.tempBgmCfg.suburl, this.tempBgmCfg.filename, this.tempBgmCfg.iscommon);
}
},
getLanguage: function() {
return this.languageType;
},
getBgmVolume: function() {
return this.bgmVolume;
},
getEffVolume: function() {
return this.effVolume;
},
pauseAll: function() {
cc.audioEngine.pauseAll();
},
resumeAll: function() {
cc.audioEngine.resumeAll();
},
stopAudio: function(e) {
cc.audioEngine.stop(e);
},
stopAllEffect: function() {
var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : [];
AppLog.log("!!!!!!!!!!!!!!stop all effect");
var t = !0, n = !1, i = void 0;
try {
for (var a, o = this.soundEffectList.entries()[Symbol.iterator](); !(t = (a = o.next()).done); t = !0) {
for (var s = a.value, r = u(s, 2), c = r[0], l = r[1], h = !1, d = 0; d < e.length; ++d) if (0 <= l.indexOf(e[d])) {
h = !0;
break;
}
if (!h) {
cc.audioEngine.stop(c);
delete this.soundEffectList[c];
}
}
} catch (e) {
n = !0;
i = e;
} finally {
try {
!t && o.return && o.return();
} finally {
if (n) throw i;
}
}
0 === e.length && this.soundEffectList.clear();
},
stopEffectByName: function(e) {
var t = !0, n = !1, i = void 0;
try {
for (var a, o = this.soundEffectList.entries()[Symbol.iterator](); !(t = (a = o.next()).done); t = !0) {
var s = a.value, r = u(s, 2), c = r[0], l = r[1], h = !1;
0 <= l.indexOf(e) && (h = !0);
h && cc.audioEngine.stop(c);
}
} catch (e) {
n = !0;
i = e;
} finally {
try {
!t && o.return && o.return();
} finally {
if (n) throw i;
}
}
}
}
});
cc._RF.pop();
}, {} ],
ChineseCfg: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "fc0d0TNAkVC2YcAeVzRUmF+", "ChineseCfg");
t.exports = {
account: "账号",
password: "密码",
rember_psw: "记住密码",
forgot_psw: "忘记密码>>>",
login: "登 录",
hint: "提示语",
input_acc_psw: "请输入账号和密码",
err_id_psw: "账号或密码错误",
acc_banned: "该账号已被封禁",
login_afer_secord: "请在%s秒后登录",
acc_forbidden_area: "该账号禁止在该区域登录",
acc_online: "当前账号已在线",
plyerId: "账号",
login_fail_again: "登录失败，请检查网络后再重新登录连接",
confirm: "确定",
cancel: "取消",
retry: "重试",
update: "更新",
new_ver: "发现新版本，请点击更新按钮将游戏更新到最新的版本",
app_restart: "发现新版本，请重启将游戏更新到最新的版本",
system_maintenance: "系统维护期间无法登录，预计%s点可恢复正常",
system_maintenance_tips: "系统维护期间无法登录",
credit: "分值",
time: "时间",
status: "状态",
chang_psw: "修改密码",
old_psw: "旧密码",
new_psw: "新密码",
confirm_psw: "确认密码",
letters_limit: "密码6-14数字或字母",
account_limit: "6-12数字或字母",
request_quit: "您确定退出游戏?",
online: "在线",
arcade: "街机",
fish: "捕鱼",
slots: "老虎机",
hot: "热门",
sound_on: "开",
sound_off: "关",
help: "帮助",
back: "返回",
exit: "退出",
spin: "旋转",
stop: "停止",
auto_play: "自动开始",
stop_auto: "停止自动",
balance: "余额",
total_score: "总分",
lines: "压线",
bet: "押注",
win: "赢",
switch: "切换",
switchX: "切换 X",
clear: "清空",
jackpot: "彩金",
rebet: "续押",
banker: "庄",
player: "闲",
tie: "和",
max: "最大:",
min: "最小:",
max_no_colon: "最大",
min_no_colon: "最小",
click_start: "点击开始",
good_luck: "祝你好运！",
game_over: "游戏结束",
close_bet: "关闭押注",
betting_panel: "押注面板",
total_bet: "总押注",
odds: "倍率",
me: "我",
total: "总",
history: "历史",
auto_rebet: "自动下注",
new_game: "新游戏",
new: "新游戏",
deal: "发牌",
surrender: "投降",
hit: "要牌",
stand: "开牌",
double: "加倍",
split: "拆牌",
insurance: "保险",
skip_insurance: "跳过保险",
skip: "跳过",
bust: "爆牌",
betting_time: "押注时间",
opening_time: "开奖时间",
wait_next_round: "等待下一轮",
start: "开始",
long_press_auto: "长按自动",
bet_all: "全押",
horse_ranking: "马匹排名",
top_two: "前两名",
last_four: "后四名",
combination: "组合",
stake_size: "下注额",
amber_dragon: "赤龙驹",
big_four: "碧科",
gale: "疾风",
imperial_concorde: "威势之宝",
prince_satchi: "沙驰王子",
raging_thunder: "奔雷",
bet_based_on_horse: "按马匹组合下注",
ready: "准备",
reset_psw: "请联系管理员重置密码!",
complete: "完成",
processing: "处理中",
leave_times: "剩余%s次免费游戏",
leave_times_1: "剩余次数",
leave_times_2: "剩余%s次免费游戏",
total_free_times: "您赢了%s次免费游戏",
free_game_over: "免费游戏结束!!!",
total_win_lines: "您赢了 %s 条线!",
win_per_line: "您赢了 %s 在线 %s ",
total_wincoin: "您共赢了 %s ",
dollball_wincoin: "您额外赢得 %s ",
total_line_num: "押注%s线",
bet_per_line: "每条线押注%s",
you_bet_per_line: "您每条线下注 %s",
you_total_line_num: "您下注了%s条线",
free_game_complete: "免费游戏结束",
play: "规则说明",
special_play: "特殊玩法",
point: "分数",
bet_success: "押注确认成功!",
bet_fail: "未点击确认，下注失败.",
freegame_trigger: "免费游戏触发",
treasure_help_1: "第1,2,3列同时中SCATTER即可获得10次免费游戏机会",
treasure_help_2: "免费游戏期间,WILD会出现在2-5列,且只要出现就会停留在原位置(即下次旋转不会移除上局该位置的WILD)随着游戏次数的增多,停留的WILD元素会越来越多,中奖几率会越来越高",
shz_help_1: "主游戏输赢判断",
shz_help_2: "物品图标必须在线条上，由左向右或从右向左连续出现三格及以上为中奖。",
shz_help_3: "如图，忠义堂的图标依照规定线路，由左向右连续出现三个即算中奖。",
shz_help_4: "如图，虽然连续三个忠义堂出现在规定线条上，但是左边和右边不连接，即不算中奖。",
shz_help_5: "水浒传",
shz_help_6: "连线倍率展示",
shz_help_7: "可代替任何标志",
shz_help_8: "全盘",
shz_help_9: "5000倍\n+27次小玛丽\n2000",
shz_help_10: "进入小玛丽游戏后不能代替任何标志",
shz_help_11: "全盘人物",
shz_help_12: "全盘武器",
shz_help_13: "小玛丽游戏",
shz_help_14: "中",
shz_help_15: "五个连线，可玩  小玛丽游戏   3次",
shz_help_16: "四个连线，可玩  小玛丽游戏   2次",
shz_help_17: "三个连线，可玩  小玛丽游戏   1次",
shz_help_18: "外围灯停止的图案与中间滚动图案相同时，可得该图案对应倍率\n的奖励。",
shz_help_19: "1.中间滚出4个图案的同时，可额外获得500 倍。",
shz_help_20: "2.当中间滚出3个图案的同时，可额外获得20 倍。",
shz_help_21: "比倍游戏",
shz_help_22: "玩家点击比倍，进入猜骰子游戏，通过点击“加减”调整押注的分值，玩家可选择界面 “小、和、大”进行押注，押注完毕，点击“开奖”，庄家给出骰子结果。\n大2 倍（对子4倍），和6倍，小2 倍（对子4倍），若玩家猜中游戏结果则获得对应倍数奖励，猜错则分数归0且游戏结束退出比倍游戏。",
ynxj_help_1: "3个SCATTER元素从左至右出现在滚轴上，即可获得10 次免费游戏SCATTER出现在滚轴2-4列",
ynxj_help_2: "WILD可代替除BONUS及SCATTER外任何元素WILD出现在滚轴2-5列",
ynxj_help_3: "3个及以上BONUS出现在任意位置，即触发BONUS游戏“幻姬转轮”",
ynxj_help_4: "幻姬转轮",
ynxj_help_5: "任意3 列出现BONUS即可触发幻姬转轮\n幻姬转轮可赢取50，20，10，5，2或1倍的红利奖励，屏幕上所展示的红利奖励已乘以免\n费游戏开始前所选择的总投注",
fruit_slot_help_1: "WILD图标可代替非特殊的8个\n图标，特殊图标：BOUNDS/SCA",
fruit_slot_help_2: "3连线进入转盘小游戏\n4连线进入杯子小游戏\n一条线以上，BOUNS图标连续成",
fruit_slot_help_3: "5-JACKPOT*8%\n4-JACKPOT*5%\n3-JACKPOT*3%\n滚动任意位置出现三个及以上",
fruit_slot_help_4: "5-15次免费游戏\n4-10次免费游戏\n3-5次免费游戏\n滚动任意位置出现三个及以上的",
win_score: "得分",
special_prize: "特殊奖励",
round_result: "本轮开奖结果",
pre_betrecord: "赛事记录",
last_result: "上局结果",
user_tick_notice: "您已被强制下线，如有疑问请联系管理员",
not_only_zhuang: "需押注庄闲和以外的区域",
subgame_is_over: "小游戏已结束",
BAL: "余额",
xnxj_bi_bei_tip: "BONUS红利奖励=奖励倍数x总投注额",
fruit_class_max: "最大到2倍",
fruit_class_min: "最小到0.01",
round_not_over: "本轮还未结束",
chips: "筹码",
you_win: "赢：%s",
unenoughToTrip: "不够下注翻倍区域",
bet_succ: "下注成功",
go_back_login: "请重新登陆！",
hall_share_tips: "每次分享可获得幸运红包，分享越多，获得越多！",
get_luckypack_tips: "你已经获得红包  去点击红包开启吧",
no_luckypack_tips: "没有红包可以拆开！",
share_success: "分享成功",
un_availd: "功能暂未开放",
how_to_get_luckpack: "分享就有机会可获得红包",
t_BET: "下注",
t_WIN: "赢得",
t_BAL: "余额",
t_MIN: "最小",
t_MAX: "最大",
red_packet_limit: "无法领取，请完成相应的对局次数再来领取！",
reset_red_packet: "换桌或退出将重置红包任务（同一类型牌桌除外）",
horse_rule: "1、街机赛马是一款赛跑类押注游戏，总共有6匹马参赛，最先冲过终点的前两名马匹获胜。\n\n2、每次游戏开始时，给15个押注项分配15个不同的赔率，玩家自由押注。\n\n3、根据游戏开奖结果，对应赔率对玩家进行奖励派奖。\n\n4、参赛的马匹：奔雷、沙驰王子、威势之宝、疾风、碧科、赤龙驹。",
eps_play: "1、玩家进入游戏之后，可以选择筹码进行下注。\n\n2、玩家有一定的时间在各个俱乐部下注，每个俱乐部对应的倍率都会显示在押注面板上。\n\n3、玩家下注完毕以后请点击“确定”。\n\n4、押注某个俱乐部后，会根据倍率获得相应的奖励。",
eps_special: "独中一元：正常开奖后，还会随机开讲一个。\n\n梅开二度：同一俱乐部的任意2个颜色都中奖。\n\n帽子戏法：任意俱乐部的3个颜色全部中奖。\n\n大四喜：同一颜色的4个俱乐部全部中奖。",
birds_play: "1、玩家进入游戏之后，可以选择筹码进行下注。\n\n\n2、玩家有30秒的时间进行各个动物的下注，每\n个动物对应的赔率都显示在押注面板上。\n\n\n3、每个动物分别对应着飞禽和走兽两种动物类型。\n\n\n4、玩家押中某个动物时，会根据倍率获得相应的奖励。",
special_rule: "1、游戏除了提供玩家8种动物的押分之外，还提供了\n金鲨/银鲨的押分，可以通过对其进行押分，获得更高\n的收益。\n\n\n2、金鲨、银鲨还可以拉启彩金，当玩家拉启彩金时，\n根据彩金倍数获得一定数量的彩金奖。",
game_in_progress: "游戏正在进行中，请耐心等待下一轮开始。",
fruit_help: "1.操作简单，玩法丰富，选择想要押注的物品后，选择“开始”即可进行游戏。lucky将激活随机送灯，送灯个数可能为2个、1个，也可能不送灯（送灯即为中奖）\n\n2.赔率说明：\t\t\t\t\t\t\t\t\t\t\n大BAR:1赔120，中BAR:1赔50，小BAR：1赔25，大77:1赔40，小77:1赔3，大双星：1赔30，小双星：1赔3，大西瓜：1赔20，小西瓜：1赔3，大铃铛：1赔20，小铃铛：1赔3，大橘子：1赔10，小橘子，大苹果：1赔5，小苹果：1赔3\n\n3.比大小：\t\t\t\t\t\t\t\t\t\t\n压中后可进入比倍模式，猜大小前可选择左箭头或者右箭头来调整押注金币数可选择“1-7:”或者“8-14”两按钮，只要猜对奖金即*2\t",
pjl_help_1: "免费旋转中，WILD可以获得多倍奖励\n第5列:2~10倍\n第4列:2~5倍\n第3列:1~3倍\n第2列:1~3倍\n",
pjl_help_2: "潘金莲wild玩法是由freespin触发的免费旋转游戏，wild财神会出现在滚轴第2~5列任意位置，免费游戏过程中，中奖线上出现WILD，即可获得2~10倍奖励，免费游戏期间不会再触发潘金莲玩法，第1,、2、3列同时中WILD即可触发财神天降，获得10次免费游戏机会",
pjl_help_3: "WILD可代替除SC\nATTER外任何元\n素WILD只出现在\n2~5列",
pjl_help_4: "3个SCATTER元素\n连续出现将触发免\n费游戏SCATTER\n只出现在1~3列",
roulette_help: "一、游戏采用标准的欧洲轮盘游戏规则，目标是预测小球将落在轮盘的哪个格子上面。\n二、玩家可以选择单一下注或者混合下注\n三、下注及赔付规则\n1.直接押注号码：点击下注区域内任意一个格子的中间来对格子上所标明的数字下注，赔付为1:35。\n2.两码押注：点击下注区域内相邻的两个格子中间的分界线来对格子上标明的两个数字进行下注，1:17\n3.三码押注：点击下注区域每列格子最下边的线来对这一行的三个数字进行下注，赔付为1:11\n4.四码押注：点击下注区域内四个格子的交汇点可以对这四个格子内的数字同时下注，赔付为1:8\n5.六码押注：点击下注区域内两列格子最下边的交汇点可以对这两列格子内的六个数字同时下注，赔付为1:5\n6.十二码押注01：点击下注区域内每行最右边的“2 to 1”，可以对这一列的12数字同时下注（不包括0），赔付为1:2\n7.十二码押注02：点击下注区域内的“1st 12”，点击“2st12”点击“3st12”，赔付为1:2.\n8.十八码押注：点击“1st18”，点击“19st36”，赔付都为1:1.\n9.红黑押注：点击标有红色矩形的格子，点击标有黑色矩形的格子，赔付为1:1\n10.奇偶数押注：点击标有“EVEN”对所有的偶数下注，点击标有“ODD”对所有的奇数下注，赔付为1:1.\n",
JLBD_ITEM_1: "3个Scatter元素连续出现将触发免费游戏\nScatter只出现在1~3列",
JLBD_ITEM_2: "Wild可代替Scatter外任何元素\nWild只出现在2~5列",
illegal_parameter: "非法参数值",
invalid_token: "自动登录已过期，请重新登录",
permission_denied: "没有权限",
sub_account_prohibits: "账号禁止登陆",
user_already_exists: "用户名已经存在",
param_nil: "缺少必要参数",
not_enough_coins: "余额不足",
upper_limit: "下注已达上限",
please_bet: "请下注",
not_enough_coins_break_card: "余额不足，不能拆牌",
not_enough_buy_safe: "余额不足，不能进行保险操作",
not_enough_rebet_fail: "余额不足，重新下注失败",
not_enough_not_add: "余额不足，不能加倍",
not_enough_xuya_fail: "余额不足，续押失败",
need_bet_start: "必须押注才能开始",
loading: "加载中，请稍后...",
bet_limit_100: "单个押注区域不能超过100",
bet_limit_up: "下注已达上限",
please_adjust_bet: "余额少于总押注分，请调整押注",
download_complete: "下载完成！",
join_queue: "已加入安装队列！",
modify_psw_succ: "修改密码成功！",
old_psw_empty: "旧密码不能为空！",
new_psw_empty: "新密码不能为空！",
psw_empty: "密码不能为空",
account_empty: "账号不能为空",
psw_diff: "新密码和确认密码不一致！",
psw_diff2: "密码和确认密码不一致！",
already_download: "游戏已下载！",
please_input_psw: "请输入密码",
please_input_account: "请输入账号",
loggin_in: "正在登录中...",
reconnect: "重连中...",
network_error: "网络已断开，请检查你的网络",
download_fail: "游戏下载失败",
call_back_error: "调用错误",
ask_exit: "您确定退出吗？",
dissolve_room: "系统强制解散房间",
cannot_entergame: "无法进入%s游戏,因为%s游戏还没有下载!",
kick_out_game: "由于长时间未操作，您已被踢出游戏！",
lock_5_second: "账号被冻结5秒",
lock_10_second: "账号被冻结10秒",
lock_20_second: "账号被冻结20秒",
lock_600_second: "账号被冻结10分钟",
login_frequently: "登录过于频繁，请稍后再试！",
wait_try_again: "登录失败，请稍后重试!",
lines_selected: "您下注了",
lines_nums: "条线",
each_line_bet: "您每条线下注 ",
gain_free_games: "得到 %s 次免费游戏",
extra_win: "您额外赢了 %s",
lines_bet: "赔付线",
forestpayrty777_help_rule: '1、玩家可选择自己喜欢的动物(颜色)进行押注每个押注有上限，也可以选择庄闲和押注。\n\n2、每轮有30秒时间，供玩家下注和思考。\n\n3、玩家押注结束之后，等待开奖结果，中奖会得到大量奖励。\n\n4、点击"续押"可延续上把的押注情况，金币不足的情况不能续押。\n\n5、点击"清零"可清除本次押注选择，返回玩家金币。',
forestpayrty777_help_special: "1、在开奖的过程中会不定时有彩金 大三元 大四喜等特殊奖励\n2、彩金：押注可拉彩金。根据押注比例获得彩金，多押多得。\n3、大三元：同一种动物的3种颜色全部中奖。\n4、大四喜：同一种颜色的4种动物全部中奖。\n",
bcbm777_help_rule: "1、奔驰宝马是一款简单易上手的游戏，一共有4种车标(奔驰、宝马、奥迪，大众)，每种车标有3种颜色(红、绿、黄)，一共12个押注选项。\n\n2、每次游戏开始时，每次12种车标分配12个赔率，玩家有30秒的时间，自由选择押注任意一种颜色的车标。\n\n3、根据游戏开奖结果，玩家中奖，则会根据中奖车标的对应赔率对玩家进行奖励派奖。\n\n",
bcbm777_help_special: "1、大三元：同一种车标的三种颜色全部中奖。\n\n2、大四喜：同一种颜色的四种车标全部中奖。\n\n3、彩金：彩金根据房间内各位玩家的总押注权重进行分配奖励。\n\n",
coins_lack: "余额不足",
fishjoy_note: "击杀对应鱼种获得奖励",
fish_kickout: "因长时间未操作，系统已将你踢出房间！",
hwby_f1: "绿叶小鱼",
hwby_f2: "小丑鱼",
hwby_f3: "黄蓝纹鱼",
hwby_f4: "粉红刺鱼",
hwby_f5: "紫衫鱼",
hwby_f6: "黄鳊鱼",
hwby_f7: "小龙虾",
hwby_f8: "紫旗鱼",
hwby_f9: "八爪鱼",
hwby_f10: "灯笼鱼",
hwby_f11: "海龟",
hwby_f12: "锯齿鲨",
hwby_f13: "蓝魔鬼鱼",
hwby_f14: "精英黄蓝纹鱼",
hwby_f15: "精英粉红刺鱼",
hwby_f16: "精英小丑鱼",
hwby_f17: "鲨鱼",
hwby_f18: "杀人鲸",
hwby_f19: "帝王鲸",
hwby_f20: "狂暴火龙",
hwby_f21: "深海狂鳌",
hwby_f22: "史前巨鳄",
hwby_f23: "深海章鱼",
hwby_f24: "暗夜魔兽",
haiwangbuyu: "海王捕鱼",
haiwangbuyu918: "海王捕鱼",
wukongnaohai: "悟空闹海",
jinchanbuyu: "金蟾捕鱼",
likuibuyu: "李逵捕鱼",
yaoqianshubuyu: "摇钱树捕鱼",
caishendao: "财神到",
feizhouconglin: "非洲丛林",
weidadelanse: "伟大的蓝色",
haitunjiao: "海豚礁",
yindan: "银弹",
huangjinshu: "黄金树",
baijiale: "百家乐",
pilihou: "霹雳猴",
xiyouzhengba: "西游争霸",
benchibaoma: "奔驰宝马",
longhudou: "龙虎斗",
heibao: "黑豹",
ivan: "不休的国王",
magicaldragon: "神秘之龙",
feiqinzoushou: "飞禽走兽",
zhuanpan: "俄罗斯转盘",
twentyone: "21点",
yunvxinjing: "玉女心经",
shuiguoslots: "水果Slots",
falaobaozang: "法老的宝藏",
azitaike: "阿兹泰克",
jinglianhua: "金莲花",
gaosugonglu: "高速公路",
jilebaodian: "极乐宝典",
panjinlian: "潘金莲",
xiaoribenpangzi: "小日本胖子",
shuihuzhuan: "水浒传",
sanguoyanyi: "三国演义",
jiangjinxiong: "奖金熊",
saima: "赛马",
yingchaoliansai: "英超联赛",
fengshenbang: "封神榜",
senlinwuhui: "森林舞会",
shuiguoji: "经典水果机",
baoziwang: "豹子王",
huluoji: "葫芦鸡",
yuxiahao: "鱼虾蚝",
fuguixiongmao: "富贵熊猫",
jinlianyinye: "金莲淫液",
xingganmeinv: "性感美女",
luobinhan: "罗宾汉",
roulet36: "轮盘",
zhanWM918: "斩五门",
football: "足球嘉年华",
thaiamazing: "泰国神游",
easter: "复活节",
newyear: "拜年",
steamtower: "蒸汽塔",
victory: "胜利",
longhudou1: "龙虎斗1",
longhudou2: "龙虎斗2",
longhudou3: "龙虎斗3",
dragon5: "五龙",
jixing: "吉星",
western_pasture: "西部牧场",
rally: "拉力赛",
traffic_light: "红绿灯",
garden: "花园",
prosperity: "发大财",
cherryLove: "樱桃的爱",
ranch_story: "农场故事",
stoneage: "石器时代",
blazing_star: "闪亮之星",
ice_land: "冰雪世界",
indiamyth: "印度神话",
magician: "魔法师",
circus: "马戏团",
airplane: "飞机",
fame: "名利场",
baccarat918: "百家乐",
baijiale1: "百家乐1",
baijiale2: "百家乐2",
baijiale3: "百家乐3",
ocean: "海洋天堂",
singlepick: "单挑",
bcbm918: "奔驰宝马",
sicbo918: "豹子王",
three_poker918: "三卡扑克",
hold_em_918: "赌城",
bull918: "牛牛",
roulet73: "73轮盘",
roulet24: "24轮盘",
roulet12: "12轮盘",
aladdin: "阿拉丁",
zwbs: "西游争霸之战无不胜",
halloween: "万圣节",
brave_legend: "勇敢传说",
fairy_garden: "精灵花园",
african_safari: "狂野非洲",
golden_dragon: "金龙赐福",
wufumen: "五福门",
Cleopatra: "埃及艳后",
wangcai: "旺财",
wolfer: "猎狼者",
alice: "爱丽丝",
captain9: "船长9线",
casino_war: "赌城战争",
crazy_money: "狂热金钱",
felicitous: "招财进宝",
ireland_lucky: "爱尔兰运气",
laura: "劳拉",
money_frog: "金钱蛙",
moto_race: "赛摩托",
top_gun: "壮志凌云",
year_by_year: "年年有余",
swk: "孙悟空",
pirate_ship: "海盗船",
sea_captain: "船长",
sea_world: "海洋世界",
huang_di_lai_le: "皇帝来了",
treasure_islang: "珍宝岛",
witch: "万圣节惊喜",
colabottle: "可乐瓶",
spartan: "斯巴达",
dashennaohai: "大圣闹海",
likuipiyu: "李逵劈鱼",
fishstar: "捕鱼之星",
dashennaohaiwanpao: "大圣闹海万炮版",
likuipiyuwanpao: "李逵劈鱼万炮版",
fishstarwanpao: "捕鱼之星万炮版",
haiwangbuyuwanpao: "海王捕鱼万炮版",
ternado: "龙卷风",
Slot_Motorcycle: "极限赛车",
Season: "季节问候",
water: "海豚",
xuemei: "学妹",
orient: "东方快车",
CoyoteCash: "野狼现金",
yemei: "野妹",
captain20: "船长",
Matsuri: "飨宴",
saintseiay: "圣斗士星矢",
fashion: "时尚世界",
Trex: "霸王龙",
GreatChina: "中华之最",
line9: "九线拉王",
enter_game: "正在进入房间!请稍等!",
error_operate: "错误操作...",
coming_soon: "敬请期待!",
add_score_succ: "成功加了%s分",
check_version_updates: "检测版本更新中...",
wait_next_round_tip: "游戏正在进行中，请耐心等待下一轮开始。",
err_psw: "密码错误",
network_connecting: "网络连接中...",
free_win: "在免费游戏中获得",
account_forbid: "账号禁止在该区域登录",
register_id: "(最多12位，不区分大小写)",
register_password: "(最少8位数，区分大小写)",
register_email: "用于重置密码使用",
promoter_code: "必须填写",
register_tips1: "注册成功",
register_tips2: "账号已存在",
register_tips3: "邀请码不正确",
register_tips4: "填写不正确",
send_captcha: "发送验证码",
resend_captcha: "%s秒",
email_address: "注册账号时绑定的邮箱",
register_help: "1.账号最多为12位数，最少为6位数。\n2.注册账号需绑定邀请码才能注册成功。\n3.注册成功后会生成自己的邀请码。",
password_tips1: "初始密码：123456，请及时修改密码。",
password_tips2: "初始密码：123456",
transfer_successful: "转账成功",
transfer_failed: "余额不足",
transfer_null: "转账金额不能为空",
commission_history: "历史总收益：%s",
invert_code: "我的邀请码：%s",
successful_withdrawal: "提现成功!",
account_exist: "用户名已经存在",
email_exist: "Email已经存在",
invalid_promoter_code: "邀请码不存在",
invalid_pin: "找回密码重设,验证码不存在或错误",
email_failed_to_send: "邮件发送失败",
account_not_exits: "账号不存在",
commission_not_enough: "当前没有可提现收益",
password_error: "支付密码错误",
transfer_failure: "转账失败",
available_to_upline_and_downline: "必须是直接上下级关系才能转账",
account_too_short: "用户名必须为6位或以上字符",
account_must_filled: "用户名必须填写",
password_must_filled: "密码必须填写",
promoter_code_error: "邀请码错误",
no_record: "没有记录",
need_update: "有新版本需要更新",
wait_exit: "该局游戏正在进行中",
captcha_timeout: "验证码不存在或错误",
limit_red: "限红5000",
charge_success: "下单成功",
charge_fail: "下单失败",
table_not_sit: "该桌子已满",
control_success: "成功",
not_connect: "断开连接，点击重新登录",
in_table: "已经在桌子上",
operate_err: "操作错误",
operate_limit: "操作太频繁!",
bind_err: "绑定错误",
bind_mobile_already: "该手机号已注册",
login_err: "登录异常!",
field_limit: "该区域已达上限!",
banker_min_coin: "上庄最少需要%s",
not_down_banker: "申请成功!",
nn: "抢庄牛牛",
have_sit_down: "玩家已坐下",
envelope_not_enough: "红包余额不足",
envelope_already_get: "红包当日已兑换",
bank_coin_not_enough: "银行存款不足",
bank_passwd_error: "银行密码错误",
gold: "金币",
dollar: "价格:%s美元",
show_ad: "金币不足，您可以观看完整广告来获得金币奖励，您是否观看?",
email: "邮箱",
email_tips: "提示：邮箱账号是您找回密码的凭证。",
email_empty: "邮箱不能为空",
room_id_non_existent: "房号不存在",
distance_less200: "距离其他玩家小于200米",
forbid_same_ip: "禁止同ip进入"
};
cc._RF.pop();
}, {} ],
ClickEffListener: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "11c09RjKaNN74o6lGnb4/G7", "ClickEffListener");
cc.Class({
extends: cc.Component,
properties: {
prefab_ClickEffect: cc.Prefab,
_startPos: null,
_isClickEffective: !1
},
onLoad: function() {
this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
this.node._touchListener.setSwallowTouches(!1);
this.node.zIndex = 100;
},
onTouchStart: function(e) {
this._isClickEffective = !0;
this._startPos = e.touch.getLocation();
},
onTouchMove: function(e) {
var t = e.touch.getLocation();
(8 < Math.abs(t.x - this._startPos.x) || 8 < Math.abs(t.y - this._startPos.y)) && (this._isClickEffective = !1);
},
onTouchEnd: function(e) {
if (this._isClickEffective) {
var t = e.touch.getLocation();
this.playClickEff(t);
}
},
onTouchCancel: function(e) {
this._isClickEffective = !1;
},
playClickEff: function(e) {
var t = this.node.convertToNodeSpaceAR(e), n = cc.instantiate(this.prefab_ClickEffect);
n.position = t;
this.node.addChild(n);
n.runAction(cc.sequence(cc.delayTime(.5), cc.removeSelf()));
}
});
cc._RF.pop();
}, {} ],
ClubLobby: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "ed43ejnMtRHqKEsvcwP/wzZ", "ClubLobby");
cc.Class({
extends: cc.Component,
properties: {
_createClubNode: null,
_joinClubNode: null,
_numList: [],
_inputIndex: 0,
numAtlas: cc.SpriteAtlas,
_roomManagerNode: null,
_content: null,
itemBgs: {
default: [],
type: cc.SpriteFrame
}
},
start: function() {
Global.autoAdaptDevices(!1);
this.registerMsg();
this.node.getChildByName("girl").active = 0 == cc.vv.UserManager.clubs.length;
var e = this.node.getChildByName("btn_create");
Global.btnClickEvent(e, this.onCreatClub, this);
var t = this.node.getChildByName("btn_join");
Global.btnClickEvent(t, this.onJoinClub, this);
var n = this.node.getChildByName("btn_back");
Global.btnClickEvent(n, this.onBack, this);
this._content = cc.find("club_list/view/content", this.node);
this._content.active = 0 < cc.vv.UserManager.clubs.length;
0 < cc.vv.UserManager.clubs.length && this.initClubList(cc.vv.UserManager.clubs);
},
initClubList: function(e) {
for (var t = 0, n = 0; n < e.length; ++n) {
var i = null;
n < this._content.childrenCount ? i = this._content.children[n] : (i = cc.instantiate(this._content.children[0])).parent = this._content;
i.x = this._content.children[0].x + n * (i.width + 20);
t += i.width + 20;
i.active = !0;
var a = i.getChildByName("bg"), o = a.getChildByName("clubName");
o.getComponent(cc.Label).string = e[n].name;
o.color = cc.vv.UserManager.uid !== e[n].createUid ? new cc.Color(75, 63, 135) : new cc.Color(37, 73, 121);
var s = a.getChildByName("clubId");
s.getComponent(cc.Label).string = "(亲友圈ID:" + e[n].clubid + ")";
s.color = cc.vv.UserManager.uid !== e[n].createUid ? new cc.Color(75, 63, 135) : new cc.Color(37, 73, 121);
cc.find("bg/img_creater/text_createrName", i).getComponent(cc.Label).string = e[n].createPlayername;
cc.find("bg/img_id/text_id", i).getComponent(cc.Label).string = e[n].createUid;
cc.find("bg/img_member/text_member", i).getComponent(cc.Label).string = e[n].count;
cc.find("bg/img_online/text_online", i).getComponent(cc.Label).string = e[n].gamedeskNum;
for (var r = e[n].clubGameList, c = "", l = 0; l < r.length; ++l) 1 === r[l].gameid ? c += "碰胡 " : 2 === r[l].gameid && (c += "跑胡子 ");
cc.find("bg/img_game/text_game", i).getComponent(cc.Label).string = c;
var h = cc.find("bg/UserHead/radio_mask/spr_head", i);
Global.setHead(h, e[n].createIcon);
cc.find("bg/node_user/img_createrIcon", i).active = cc.vv.UserManager.uid === e[n].createUid;
a._id = e[n].clubid;
a.getComponent(cc.Sprite).spriteFrame = cc.vv.UserManager.uid !== e[n].createUid ? this.itemBgs[0] : this.itemBgs[1];
Global.btnClickEvent(a, this.onEnterClub, this);
}
for (var d = e.length; d < this._content.childrenCount; ++d) this._content.children[d].active = !1;
this._content.width = t + 20;
this._content.active = 0 < cc.vv.UserManager.clubs.length;
},
onEnterClub: function(e) {
var t = e.target._id;
cc.vv.UserManager.currClubId = t;
cc.vv.SceneMgr.enterScene("club");
},
onBack: function() {
cc.vv.SceneMgr.enterScene("lobby");
},
onCreatClub: function() {
var n = this;
if (null === this._createClubNode) cc.loader.loadRes("common/prefab/create_club", cc.Prefab, function(e, t) {
if (null === e) {
n._createClubNode = cc.instantiate(t);
n._createClubNode.parent = n.node;
n._createClubNode.zIndex = 1;
n._createClubNode.active = !0;
n.initCreatClub();
}
}); else {
cc.find("bg/name", this._createClubNode).getComponent(cc.EditBox).string = "";
this._createClubNode.active = !0;
}
},
updateClubList: function() {
this.initClubList(cc.vv.UserManager.clubs);
},
registerMsg: function() {
Global.registerEvent(EventId.UPDATE_CLUBS, this.updateClubList, this);
cc.vv.NetManager.registerMsg(MsgId.CREATECULB, this.onRcvCreatClubResult, this);
cc.vv.NetManager.registerMsg(MsgId.JOINCULB, this.onRcvJoinClubResult, this);
},
unregisterMsg: function() {
cc.vv.NetManager.unregisterMsg(MsgId.CREATECULB, this.onRcvCreatClubResult, !1, this);
cc.vv.NetManager.registerMsg(MsgId.JOINCULB, this.onRcvJoinClubResult, this);
},
initCreatClub: function() {
var e = cc.find("bg/btn_close", this._createClubNode);
Global.btnClickEvent(e, this.onCloseCreateClub, this);
var t = cc.find("bg/btn_confirm_create", this._createClubNode);
Global.btnClickEvent(t, this.onCreateClub, this);
},
onCreateClub: function() {
var e = cc.find("bg/name", this._createClubNode).getComponent(cc.EditBox).string;
if (0 === e.length) cc.vv.FloatTip.show("请输入亲友圈名字"); else {
var t = {
c: MsgId.CREATECULB
};
t.name = e;
cc.vv.NetManager.send(t);
}
},
onJoinClub: function() {
var n = this;
if (null === this._joinClubNode) cc.loader.loadRes("common/prefab/join_club", cc.Prefab, function(e, t) {
if (null === e) {
n._joinClubNode = cc.instantiate(t);
n._joinClubNode.parent = n.node;
n._joinClubNode.zIndex = 1;
n._joinClubNode.active = !0;
n.initJoinClub();
}
}); else {
this.onReset();
this._joinClubNode.active = !0;
}
},
initJoinClub: function() {
var e = cc.find("bg/btn_close", this._joinClubNode);
Global.btnClickEvent(e, this.onCloseJoinClub, this);
for (var t = 0; t < 10; ++t) {
var n = cc.find("bg/btn_number" + t, this._joinClubNode);
n._index = t;
Global.btnClickEvent(n, this.inputNum, this);
}
var i = cc.find("bg/btn_delete", this._joinClubNode);
Global.btnClickEvent(i, this.onDelete, this);
var a = cc.find("bg/btn_reset", this._joinClubNode);
Global.btnClickEvent(a, this.onReset, this);
for (var o = 0; o < 7; ++o) {
var s = cc.find("bg/num" + o, this._joinClubNode).getChildByName("num");
s.active = !1;
this._numList.push(s);
}
},
onReset: function() {
for (var e = this._inputIndex = 0; e < this._numList.length; ++e) {
this._numList[e].active = !1;
this._numList[e]._index = -1;
}
},
onDelete: function() {
--this._inputIndex;
this._inputIndex < 0 && (this._inputIndex = 0);
if (0 <= this._inputIndex) {
this._numList[this._inputIndex].active = !1;
this._numList[this._inputIndex]._index = -1;
}
},
inputNum: function(e) {
if (this._inputIndex < 7) {
var t = e.target._index;
this._numList[this._inputIndex].active = !0;
this._numList[this._inputIndex].getComponent(cc.Sprite).spriteFrame = this.numAtlas.getSpriteFrame("hallClub-img-member-img-img_" + t);
this._numList[this._inputIndex]._index = t;
++this._inputIndex;
if (7 <= this._inputIndex) {
for (var n = "", i = 0; i < 7; ++i) n += this._numList[i]._index;
var a = {
c: MsgId.JOINCULB
};
a.clubid = n;
cc.vv.NetManager.send(a);
}
}
},
onCloseJoinClub: function() {
this._joinClubNode && (this._joinClubNode.active = !1);
},
onCloseCreateClub: function() {
this._createClubNode.active = !1;
},
onRcvCreatClubResult: function(e) {
if (200 === e.code) {
cc.vv.AlertView.show("创建亲友圈成功", function() {});
cc.vv.UserManager.clubs = e.response.clubList;
this.initClubList(cc.vv.UserManager.clubs);
this.onCloseCreateClub();
}
},
onRcvJoinClubResult: function(e) {
if (200 === e.code) {
cc.vv.AlertView.show("申请成功，等待管理员审核！", function() {});
this.onCloseJoinClub();
}
},
onDestroy: function() {
this.unregisterMsg();
this._joinClubNode && cc.loader.releaseRes("common/prefab/join_club", cc.Prefab);
this._createClubNode && cc.loader.releaseRes("common/prefab/create_club", cc.Prefab);
}
});
cc._RF.pop();
}, {} ],
ClubMessage: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "bb07889KtdEQaCuRdL/O/Hn", "ClubMessage");
cc.Class({
extends: cc.Component,
properties: {
_messageNode: null,
_applyList: []
},
start: function() {
this.registerMsg();
var e = {
c: MsgId.CLUBNOTICE
};
e.clubid = cc.vv.UserManager.currClubId;
cc.vv.NetManager.send(e);
},
registerMsg: function() {
cc.vv.NetManager.registerMsg(MsgId.CLUBNOTICE, this.onRcvClubMessage, this);
cc.vv.NetManager.registerMsg(MsgId.AGREECULB, this.onRcvAgreeResult, this);
cc.vv.NetManager.registerMsg(MsgId.REJECTJOINCLUB, this.onRcvRejectResult, this);
cc.vv.NetManager.registerMsg(MsgId.ALLAGREE, this.onRcvAllAgreeResult, this);
},
unregisterMsg: function() {
cc.vv.NetManager.unregisterMsg(MsgId.CLUBNOTICE, this.onRcvClubMessage, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.AGREECULB, this.onRcvAgreeResult, this);
cc.vv.NetManager.unregisterMsg(MsgId.REJECTJOINCLUB, this.onRcvRejectResult, this);
cc.vv.NetManager.unregisterMsg(MsgId.ALLAGREE, this.onRcvAllAgreeResult, this);
},
onRcvAllAgreeResult: function(e) {
if (200 === e.code) {
cc.vv.FloatTip.show("您已经全部同意加入亲友圈");
this.initMsg([]);
this.onc;
}
},
onRcvRejectResult: function(e) {
if (200 === e.code) {
cc.vv.FloatTip.show("您已经拒绝加入亲友圈");
this.initMsg(e.response.applyList);
}
},
onRcvAgreeResult: function(e) {
if (200 === e.code) {
cc.vv.FloatTip.show("您已经同意了加入亲友圈");
this.initMsg(e.response.applyList);
}
},
onRcvClubMessage: function(a) {
var o = this;
if (200 === a.code) {
this._applyList = a.response.applyList;
if (0 < a.response.applyList.length) if (null === this._messageNode) cc.loader.loadRes("common/prefab/club_message", cc.Prefab, function(e, t) {
if (null === e) {
o._messageNode = cc.instantiate(t);
o._messageNode.active = !0;
o.initMsg(a.response.applyList);
o._messageNode.parent = o.node;
o._messageNode.x = o.node.width;
var n = cc.find("bg/btn_all_agree", o._messageNode), i = cc.find("bg/btn_close", o._messageNode);
Global.btnClickEvent(n, o.onAllAgree, o);
Global.btnClickEvent(i, o.onClose, o);
}
}); else {
this._messageNode.active = !0;
this.initMsg(a.response.applyList);
}
}
},
onClose: function() {
this._messageNode.active = !1;
},
initMsg: function(e) {
for (var t = cc.find("bg/list/view/content", this._messageNode), n = 0, i = 0; i < e.length; ++i) {
var a = null;
i < t.childrenCount ? a = t.children[i] : (a = cc.instantiate(t.children[0])).parent = t;
a.y = t.children[0].y - i * (a.height + 20);
n += a.width + 20;
a.active = !0;
a.getChildByName("name").getComponent(cc.Label).string = e[i].playername;
a.getChildByName("id").getComponent(cc.Label).string = e[i].uid;
a.getChildByName("time").getComponent(cc.Label).string = e[i].applytime;
var o = a.getChildByName("btn_agree"), s = a.getChildByName("btn_reject");
o._id = e[i].uid;
s._id = e[i].uid;
Global.btnClickEvent(o, this.onAgree, this);
Global.btnClickEvent(s, this.onReject, this);
}
t.height = n;
for (var r = e.length; r < t.childrenCount; ++r) t.children[r].active = !1;
},
onAllAgree: function() {
for (var e = [], t = 0; t < this._applyList.length; ++t) e.push(this._applyList[t].uid);
var n = {
c: MsgId.ALLAGREE
};
n.clubid = cc.vv.UserManager.currClubId;
n.applyList = e;
cc.vv.NetManager.send(n);
},
onAgree: function(e) {
var t = {
c: MsgId.AGREECULB
};
t.clubid = cc.vv.UserManager.currClubId;
t.applyUid = e.target._id;
cc.vv.NetManager.send(t);
},
onReject: function(e) {
var t = {
c: MsgId.REJECTJOINCLUB
};
t.clubid = cc.vv.UserManager.currClubId;
t.applyUid = e.target._id;
cc.vv.NetManager.send(t);
},
onDestroy: function() {
this.unregisterMsg();
this._messageNode && cc.loader.releaseRes("common/prefab/club_message", cc.Prefab);
}
});
cc._RF.pop();
}, {} ],
Club: [ function(n, e, t) {
"use strict";
cc._RF.push(e, "eb94bh1eH9KyJ6BcnCkseXM", "Club");
cc.Class({
extends: cc.Component,
properties: {
_content: null,
_tableList: [],
wanfaAtlas: cc.SpriteAtlas,
tableBgs: {
default: [],
type: cc.SpriteFrame
},
_startPos: null,
_sendSit: !1
},
start: function() {
if (cc.vv.gameData) {
cc.vv.gameData.clear();
cc.vv.gameData = null;
}
this.registerMsg();
Global.autoAdaptDevices(!1);
var e = cc.find("Layer/bg/btn_back", this.node);
Global.btnClickEvent(e, this.onBack, this);
this.node.addComponent("ClubMessage");
this.node.addComponent("CreateRoom");
for (var t = null, n = 0; n < cc.vv.UserManager.clubs.length; ++n) cc.vv.UserManager.currClubId === cc.vv.UserManager.clubs[n].clubid && (t = cc.vv.UserManager.clubs[n]);
var i = cc.find("Layer/bg/UserHead/radio_mask/spr_head", this.node);
Global.setHead(i, t ? t.createIcon : "");
cc.find("Layer/bg/img_club_name_bg/txt_clubId", this.node).getComponent(cc.Label).string = t ? "ID:" + t.clubid : "";
cc.find("Layer/bg/img_club_name_bg/txt_clubName", this.node).getComponent(cc.Label).string = t ? t.name : "";
cc.find("Layer/bg/bg_top/btn_invite", this.node).active = t.createUid == cc.vv.UserManager.uid;
cc.find("Layer/bg/bg_top/btn_msg", this.node).active = t.createUid == cc.vv.UserManager.uid;
cc.find("Layer/img_bottomBg/btn_switch", this.node).active = t.createUid == cc.vv.UserManager.uid;
cc.find("Layer/img_bottomBg/btn_member", this.node).active = t.createUid == cc.vv.UserManager.uid;
cc.find("Layer/img_bottomBg/btn_statistics", this.node).x = t.createUid == cc.vv.UserManager.uid ? 450 : 80;
this._content = cc.find("Layer/list/view/content", this.node);
this._content.active = !1;
var a = cc.find("Layer/bg_dialogue/mask/txt_dialogue", this.node);
a.x = 200;
a.runAction(cc.repeatForever(cc.sequence(cc.moveTo(10, cc.v2(-200, a.y)), cc.callFunc(function() {
a.x = 200;
}))));
this._startPos = cc.v2(this._content.children[0].x, this._content.children[0].y);
var o = {
c: MsgId.ENTERCLUB
};
o.clubid = cc.vv.UserManager.currClubId;
cc.vv.NetManager.send(o);
},
onRcvClubInfo: function(e) {
if (200 == e.code) {
this._tableList = e.response.deskList;
this.initTables(this._tableList);
}
},
registerMsg: function() {
cc.vv.NetManager.registerMsg(MsgId.NOTICE_ADDNEWTABLE, this.onRcvAddTableMsg, this);
cc.vv.NetManager.registerMsg(MsgId.ENTERCLUB, this.onRcvClubInfo, this);
cc.vv.NetManager.registerMsg(MsgId.SEATDOWN, this.onEnterDeskResult, this);
cc.vv.NetManager.registerMsg(MsgId.NOTICE_TABLEINFO, this.onRecvTableinfo, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_DELETE_TABLE, this.onRecvDeleteTable, this);
},
unregisterMsg: function() {
cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_ADDNEWTABLE, this.onRcvAddTableMsg, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.ENTERCLUB, this.onRcvClubInfo, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.SEATDOWN, this.onEnterDeskResult, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_TABLEINFO, this.onRecvTableinfo, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_DELETE_TABLE, this.onRecvDeleteTable, !1, this);
},
onRecvDeleteTable: function(e) {
if (200 === e.code) {
for (var t = e.response.deskId, n = 0; n < this._content.childrenCount; ++n) {
var i = this._content.children[n];
if (i._deskId === t) {
i.removeFromParent();
for (var a = 0; a < this._tableList.length; ++a) if (this._tableList[a].deskid === t) {
this._tableList.splice(a, 1);
break;
}
break;
}
}
this.initTables(this._tableList);
}
},
onRecvTableinfo: function(e) {
if (200 === e.code) for (var t = e.response.hallDeskInfo, n = 0; n < this._content.childrenCount; ++n) {
var i = this._content.children[n];
if (i._deskId === t.deskid) {
this.initTable(i, t.config, t);
for (var a = 0; a < this._tableList.length; ++a) if (this._tableList[a].deskid === t.deskid) {
this._tableList[a] = t;
break;
}
break;
}
}
},
onEnterDeskResult: function(e) {
if (200 === e.code && null === cc.vv.gameData) {
var t = n("PengHu_GameData");
cc.vv.gameData = new t();
cc.vv.gameData.init(e.response.deskInfo);
cc.vv.SceneMgr.enterScene("penghu");
}
},
onRcvAddTableMsg: function(e) {
if (200 === e.code) {
this._tableList.unshift(e.response.addDeskInfo);
this.initTables(this._tableList);
}
},
onEnterDesk: function(e) {
var t = this;
if (!this._sendSit) {
var n = {
c: MsgId.SEATDOWN
};
n.clubid = cc.vv.UserManager.currClubId;
n.deskId = e.target._deskId;
cc.vv.NetManager.send(n);
this.scheduleOnce(function() {
t._sendSit = !0;
}, .2);
}
},
initTable: function(e, t, n) {
cc.find("node/type_bg", e).getComponent(cc.Sprite).spriteFrame = this.wanfaAtlas.getSpriteFrame("hallClub-img-table-moreRule-index_" + t.playtype);
cc.find("node/img_roomId/table_name", e).getComponent(cc.Label).string = t.tname;
cc.find("node/img_round/txt_round", e).getComponent(cc.Label).string = t.gamenum + "局 " + t.seat + "人";
cc.find("node/char_2", e).active = 4 === t.seat;
cc.find("node/char_4", e).active = 4 === t.seat;
cc.find("node/char_1/headNode", e).active = !1;
cc.find("node/char_2/headNode", e).active = !1;
cc.find("node/char_3/headNode", e).active = !1;
cc.find("node/char_4/headNode", e).active = !1;
if (n.users) for (var i = n.users, a = 0; a < i.length; ++a) {
var o = cc.find("node/char_" + (a + 1) + "/headNode", e);
2 === t.seat && 1 === a && (o = cc.find("node/char_3/headNode", e));
if (o) {
o.active = !0;
var s = cc.find("UserHead/radio_mask/spr_head", o);
Global.setHead(s, i[a].usericon);
cc.find("img_nameBg/txt_name", o).getComponent(cc.Label).string = i[a].playername;
o.getChildByName("img_ready").active = 1 === i[a].state;
}
}
cc.find("node/bg", e).getComponent(cc.Sprite).spriteFrame = 4 === t.seat ? this.tableBgs[0] : this.tableBgs[1];
},
initTables: function(e) {
for (var t = 0, n = 0; n < e.length; ++n) {
var i = e[n].config, a = null;
n < this._content.childrenCount ? a = this._content.children[n] : (a = cc.instantiate(this._content.children[0])).parent = this._content;
a.active = !0;
var o = cc.find("node/img_click", a);
o._deskId = e[n].deskid;
a._deskId = e[n].deskid;
Global.btnClickEvent(o, this.onEnterDesk, this);
a.x = this._startPos.x + (o.width + 30) * parseInt(n / 2);
a.y = this._startPos.y - (o.height + 30) * (n % 2);
n % 2 == 0 && (t += o.width + 30);
this.initTable(a, i, e[n]);
}
for (var s = e.length; s < this._content.childrenCount; ++s) this._content.children[s].active = !1;
this._content.active = 0 < e.length;
this._content.width = t + 50;
},
onCreateRoom: function() {
Global.dispatchEvent(EventId.GAME_CREATEROOM);
},
onBack: function() {
cc.vv.SceneMgr.enterScene("club_lobby");
},
onDestroy: function() {
this.unregisterMsg();
}
});
cc._RF.pop();
}, {
PengHu_GameData: "PengHu_GameData"
} ],
CreateRoom: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "fdc262NLV9DTpLVRj+Ez++E", "CreateRoom");
cc.Class({
extends: cc.Component,
properties: {
_createLayer: null,
_isClubRoom: !1
},
start: function() {
Global.registerEvent(EventId.GAME_CREATEROOM, this.showCreateRoom, this);
cc.vv.NetManager.registerMsg(MsgId.ADDGAME, this.onRcvAddGameResult, this);
},
showCreateRoom: function(e) {
var a = this;
this._isClubRoom = e;
if (null === this._createLayer) cc.loader.loadRes("common/prefab/create_room", cc.Prefab, function(e, t) {
if (null === e) {
a._createLayer = cc.instantiate(t);
a._createLayer.setContentSize(cc.size(a.node.width, a.node.height));
a._createLayer.parent = a.node;
a._createLayer.zIndex = 1;
a._createLayer.x = a.node.width / 2 - a.node.x;
a._createLayer.y = a.node.height / 2 - a.node.y;
a.clearPengHu();
var n = a._createLayer.getChildByName("btn_back");
Global.btnClickEvent(n, a.onClose, a);
var i = cc.find("img_bg/right_bg/btn_create_room", a._createLayer);
Global.btnClickEvent(i, a.onCreatePengHu, a);
}
}); else {
this._createLayer.active = !0;
var t = cc.find("img_bg/right_bg/scrollview/content/input_roomName", this._createLayer);
t.getComponent(cc.EditBox).string = "";
t.active = this._isClubRoom;
}
},
onClose: function() {
this._createLayer.active = !1;
},
onRcvAddGameResult: function(e) {
if (200 === e.code) {
this.onClose();
cc.vv.FloatTip.show("创建桌子成功!");
}
},
onCreatePengHu: function() {
var e = cc.find("img_bg/right_bg/scrollview/content", this._createLayer), t = "";
if (this._isClubRoom && 0 === (t = e.getChildByName("input_roomName").getComponent(cc.EditBox).string).length) cc.vv.FloatTip.show("请输入桌子名称!"); else {
var n = {};
this._isClubRoom && (n.clubid = cc.vv.UserManager.currClubId);
n.gameid = this._isClubRoom ? 1 : 3;
n.gamenum = 8;
n.param1 = 0;
n.score = 1;
n.seat = 4;
n.speed = 0;
for (var i = 1; i < 4; ++i) {
cc.find("round/toggle" + i, e).getComponent(cc.Toggle).isChecked && (n.gamenum = 1 === i ? 8 : 2 === i ? 16 : 24);
var a = cc.find("zhongzhuang/toggle" + i, e);
a.getComponent(cc.Toggle).isChecked && (n.param1 = 1 === i ? 0 : 2 === i ? 1 : 2);
cc.find("score/toggle" + i, e);
a.getComponent(cc.Toggle).isChecked && (n.score = 1 === i ? 1 : 2 === i ? 2 : 4);
if (i < 3) {
cc.find("player_num/toggle" + i, e).getComponent(cc.Toggle).isChecked && (1 === i ? n.seat = 4 : 2 === i && (n.seat = 2));
cc.find("speed/toggle" + i, e).getComponent(cc.Toggle).isChecked && (1 === i ? n.speed = 0 : 2 === i && (n.speed = 1));
}
}
var o = cc.find("force/toggle1", e);
n.trustee = o.getComponent(cc.Toggle).isChecked ? 1 : 0;
var s = cc.find("dismiss/toggle1", e);
n.isdissolve = s.getComponent(cc.Toggle).isChecked ? 1 : 0;
var r = cc.find("other/toggle1", e);
n.ipcheck = r.getComponent(cc.Toggle).isChecked ? 1 : 0;
var c = cc.find("other/toggle2", e);
n.distance = c.getComponent(cc.Toggle).isChecked ? 1 : 0;
n.tname = t;
var l = {};
l.c = this._isClubRoom ? MsgId.ADDGAME : MsgId.GAME_CREATEROOM;
l.gameInfo = n;
cc.vv.NetManager.send(l);
}
},
clearPengHu: function() {
for (var e = cc.find("img_bg/right_bg/scrollview/content", this._createLayer), t = 1; t < 4; ++t) {
cc.find("round/toggle" + t, e).getComponent(cc.Toggle).isChecked = 1 === t;
cc.find("zhongzhuang/toggle" + t, e).getComponent(cc.Toggle).isChecked = 1 === t;
cc.find("score/toggle" + t, e).getComponent(cc.Toggle).isChecked = 1 === t;
if (t < 3) {
cc.find("player_num/toggle" + t, e).getComponent(cc.Toggle).isChecked = 1 === t;
cc.find("speed/toggle" + t, e).getComponent(cc.Toggle).isChecked = !0;
}
}
cc.find("force/toggle1", e).getComponent(cc.Toggle).isChecked = !1;
cc.find("other/toggle1", e).getComponent(cc.Toggle).isChecked = !0;
cc.find("other/toggle2", e).getComponent(cc.Toggle).isChecked = !1;
e.getChildByName("input_roomName").getComponent(cc.EditBox).string = "";
e.getChildByName("input_roomName").active = this._isClubRoom;
},
onDestroy: function() {
cc.vv.NetManager.unregisterMsg(MsgId.ADDGAME, this.onRcvAddGameResult, !1, this);
this._createLayer && cc.loader.releaseRes("common/prefab/create_room", cc.Prefab);
}
});
cc._RF.pop();
}, {} ],
EventDef: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "76cfbWnrjxOI467NvAoYcaF", "EventDef");
var i = cc.Class({
extends: cc.Component,
statics: {}
});
window.EventId = i;
cc._RF.pop();
}, {} ],
EventManager: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "0ff2bTm9f1KK6HvNRck4Y9j", "EventManager");
cc.Class({
extends: cc.Component,
statics: {
_listeners: null,
emit: function(e) {
this._listeners = this._listeners || {};
var t = [].slice.call(arguments, 1), n = this._listeners["$" + e];
if (n) for (var i = (n = n.slice(0)).length - 1; 0 <= i; i--) n[i].tgt ? n[i].cb.apply(n[i].tgt, t) : n[i].cb.apply(t);
cc.log("emit event (" + e + "): ", JSON.stringify(t));
},
on: function(e, t, n) {
this._listeners = this._listeners || {};
var i = {
cb: t,
tgt: n
};
(this._listeners["$" + e] = this._listeners["$" + e] || []).push(i);
},
once: function(e, t, n) {
function i() {
this.off(e, i);
t.apply(targtet, arguments);
}
i.fn = t;
this.on(e, i);
},
off: function(e, t) {
this._listeners = this._listeners || {};
0 == arguments.length && (this._listeners = {});
var n = this._listeners["$" + e];
if (n) if (1 != arguments.length) {
for (var i, a = 0; a < n.length; a++) if ((i = n[a]).cb === t || i.cb.fn === t) {
n.splice(a, 1);
break;
}
} else delete this._listeners["$" + e];
}
}
});
cc._RF.pop();
}, {} ],
FloatTip: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "f441e7ECPtE1bqcpDmo6ij0", "FloatTip");
cc.Class({
extends: cc.Component,
properties: {
spr_bg: cc.Sprite,
lbl_content: cc.Label,
bg_sprire_frame: cc.SpriteFrame,
_floatTipPrefab: null,
_tips: "",
_list: [],
_topList: []
},
init: function(e) {
var n = this;
cc.loader.loadRes(e, cc.Prefab, function(e, t) {
null === e && (n._floatTipPrefab = t);
});
},
start: function() {},
onEnable: function() {
this.node.position = Global.centerPos;
},
clear: function() {
this._list = [];
},
show: function(e, t, n) {
var i = this;
if (this._tips !== e && this._floatTipPrefab) {
var a = null;
if (t) {
for (var o = 0; o < this._topList.length; ++o) if (!this._topList[o].active) {
a = this._topList[o];
break;
}
} else for (var s = 0; s < this._list.length; ++s) if (!this._list[s].active) {
a = this._list[s];
break;
}
if (null === a) {
a = cc.instantiate(this._floatTipPrefab);
t ? this._topList.push(a) : this._list.push(a);
}
if (t) {
null === a.parent && cc.game.addPersistRootNode(a);
var r = cc.find("Canvas").getComponent(cc.Canvas).designResolution;
a.position = cc.v2(r.width / 2, r.height / 2);
} else if (a) {
null === a.parent && cc.game.addPersistRootNode(a);
var c = cc.find("Canvas").getComponent(cc.Canvas).designResolution;
a.position = cc.v2(c.width / 2, c.height / 2);
}
a.zIndex = Global.CONST_NUM.HIGHT_ZORDER;
a.active = !0;
if ((e += "") && "string" == typeof e) {
var l = cc.find("spr_bg/lbl_content", a).getComponent(cc.Label);
l.string = e;
l.node.color = n || cc.Color.WHITE;
}
var h = a.getChildByName("spr_bg").getComponent(cc.Animation);
if (h) {
h.play("FloatTipMoveAndFade");
h.on("stop", function() {
a.active = !1;
i._tips = "";
});
} else a.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function() {
a.active = !1;
i._tips = "";
})));
}
}
});
cc._RF.pop();
}, {} ],
GameCommUtil: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "02475xg0C9NgIMlKYYfjZ1p", "GameCommUtil");
var i = e("GlobalVar");
i.S2P = function(e, t) {
return parseInt(e);
};
i.createClip = function(e, t) {
var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "action", i = !(3 < arguments.length && void 0 !== arguments[3]) || arguments[3], a = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : 1 / 7, o = !(5 < arguments.length && void 0 !== arguments[5]) || arguments[5], s = 6 < arguments.length && void 0 !== arguments[6] ? arguments[6] : cc.Sprite.SizeMode.RAW, r = e.getComponent(cc.Animation);
null === r && (r = e.addComponent(cc.Animation));
r.enabled = !0;
for (var c = r.getClips(), l = 0; l < c.length; ++l) if (c[l].name === n) {
cc.vv.gameData.addAnimationList(e);
return;
}
for (var h = function(e, t) {
if (t) {
return e < 10 ? "0" + e : e;
}
return e;
}, d = [], u = 0; u < t.length; ++u) for (var g = t[u].start; g <= t[u].end; ++g) {
var _ = cc.vv.gameData.resMgr.getAtlas(t[u].atlas), f = t[u].prefix + h(g, o), v = _.getSpriteFrame(f);
v ? d.push(v) : AppLog.warn("######### 没有找到序列帧:" + f);
}
var p = cc.AnimationClip.createWithSpriteFrames(d);
p.wrapMode = i ? cc.WrapMode.Loop : cc.WrapMode.Normal;
p.sample = 30;
p.speed = a;
p.name = n;
e.getComponent(cc.Sprite).trim = !1;
e.getComponent(cc.Sprite).sizeMode = s;
r.addClip(p);
cc.vv.gameData.addAnimationList(e);
return p;
};
i.createClipByAtlas = function(e, t, n, i, a) {
var o = 5 < arguments.length && void 0 !== arguments[5] ? arguments[5] : "action", s = !(6 < arguments.length && void 0 !== arguments[6]) || arguments[6], r = 7 < arguments.length && void 0 !== arguments[7] ? arguments[7] : 1 / 7, c = 8 < arguments.length && void 0 !== arguments[8] ? arguments[8] : cc.Sprite.SizeMode.RAW, l = e.getComponent(cc.Animation);
null === l && (l = e.addComponent(cc.Animation));
l.enabled = !0;
for (var h = [], d = n; d <= i; ++d) {
var u = t.getSpriteFrame(a + d);
u ? h.push(u) : AppLog.warn("######### 没有找到序列帧:" + (a + d));
}
var g = cc.AnimationClip.createWithSpriteFrames(h);
g.wrapMode = s ? cc.WrapMode.Loop : cc.WrapMode.Normal;
g.sample = 30;
g.speed = r;
g.name = o;
e.getComponent(cc.Sprite).trim = !1;
e.getComponent(cc.Sprite).sizeMode = c;
l.addClip(g);
return g;
};
i.setSpriteSync = function(e, n) {
cc.loader.loadRes(e, cc.SpriteFrame, function(e, t) {
n.getComponent(cc.Sprite).spriteFrame = t;
});
};
i.doRoallNumEff = function(e, t, n) {
var i = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : 1.5, a = arguments[4], o = arguments[5], s = e.getComponent(cc.Label);
if (s) {
s.string = t;
var r = Math.floor(i / .04), c = Math.floor((n - t) / r * 100) / 100;
0 == c && (c = 1);
var l = t, h = cc.delayTime(.04), d = cc.callFunc(function() {
(l += c) <= n && (s.string = Global.S2P(l, 2));
}), u = cc.callFunc(function() {
o && o();
}), g = cc.repeat(cc.sequence(h, d, u), r), _ = cc.callFunc(function() {
s.string = Global.S2P(n, 2);
a && a();
});
s.node.stopAllActions();
s.node.runAction(cc.sequence(g, _));
}
};
Global.isBoolean = function(e) {
return 1 == e || 0 == e;
};
Global.resetBlink = function(e) {
if (e) {
var t = cc.js.getClassName(e), n = e.node;
"cc.Node" == t && (n = e);
if (n) {
n.stopAllActions();
n.opacity = 255;
n._sgNode.setVisible(!0);
}
}
};
cc._RF.pop();
}, {
GlobalVar: "GlobalVar"
} ],
GameEventId: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "ef043OWMthByYih3LNm8BER", "GameEventId");
var i = e("EventDef");
i.SHOW_SCORE_LOG = "show_score_log";
i.SHOW_MODIFY_PSW = "show_modify_psw";
i.ENTER_HALL = "enter_hall";
i.ENTER_GAME_EVENT = "enter_game_event";
i.ENTER_LOGIN_SUCCESS = "enter_login_success";
i.STOP_ACTION = "stop_action";
i.LOGOUT = "logout";
i.UPDATE_GAME_LIST = "update_game_list";
i.UPATE_COINS = "upate_coins";
i.EXIT_GAME = "exit_game";
i.SHOW_BIGBANG = "show_bigbang";
i.HIDE_BIGBANG = "hide_bigbang";
i.RECHARGE_SUCC = "recharge_succ";
i.SPECIAL_ACTION_FINISH = "special_action_finish";
i.LOAD_ITEM_FINISH = "load_Items_finish";
i.SHOW_ALL_GAMEITEM = "show_all_gameitem";
i.SHOW_RANDJACKPOT = "show_randjackpot";
i.HIDE_RANDJACKPOT = "hide_randjackpot";
i.RELOGIN = "game_relogin";
i.PAUSE_PLAY_BIGWIN = "pause_play_bigwin";
i.PLAY_BIGWIN = "play_bigwin";
i.SET_SHAKE = "set_shake";
i.UPDATE_REDPACK = "UPDATE_REDPACK";
i.HALL_EFF_SHOWCOINS = "HALL_EFF_SHOWCOINS";
i.HALL_EFF_SHOWLUCKPACK = "HALL_EFF_SHOWLUCKPACK";
i.HALL_EFF_OPENLUCKBOX = "HALL_EFF_OPENLUCKBOX";
i.HALL_EFF_SHOWLUCKRAIN = "HALL_EFF_SHOWLUCKRAIN";
i.HALL_FAV_GAME_CHANGE = "HALL_FAV_GAME_CHANGE";
i.SHOW_RED_HEART_ANI = "SHOW_RED_HEART_ANI";
i.SHOW_SETTING = "show_setting";
i.REGISTER_ACCOUNT = "register_account";
i.ENTER_FRONT = "enter_front";
i.SHOW_SHOP = "show_shop";
i.UPDATE_CLUBS = "update_clubs";
i.GAME_CREATEROOM = "game_createroom";
i.CLEARDESK = "clear_desk";
i.HANDCARD = "handcard";
i.OUTCARD = "outcard";
i.OUTCARD_NOTIFY = "outcard_notify";
i.PAO_NOTIFY = "pao_notify";
i.KAN_NOTIFY = "kan_notify";
i.LONG_NOTIFY = "long_notify";
i.PENG_NOTIFY = "peng_notify";
i.GUO_NOTIFY = "guo_notify";
i.CHI_NOTIFY = "chi_notify";
i.MOPAI_NOTIFY = "mopai_notify";
i.PLAYER_ENTER = "player_enter";
i.PLAYER_EXIT = "player_exit";
i.HU_NOTIFY = "hu_notify";
i.CLOSE_ROUNDVIEW = "close_roundview";
i.SHOW_ROUND_VIEW = "show_round_view";
i.GAMEOVER = "gameover";
i.SHOW_GAMEOVER = "show_gameover";
i.GAME_RECONNECT_DESKINFO = "game_reconnect_deskinfo";
i.HIDE_SHOWCARD = "hide_showcard";
i.SHOW_MENZI = "show_menzi";
i.SHOW_MENZI_SOUND = "show_menzi_sound";
i.SHOW_CHAT = "show_chat";
i.CHAT_NOTIFY = "chat_notify";
i.DEL_HANDCARD_NOTIFY = "del_handcard_notify";
i.READY_NOTIFY = "ready_notify";
i.OFFLINE_NOTIFY = "offline_notify";
i.SELF_GPS_DATA = "sele_gps_data";
i.PLAYER_DISTANCE_DATA = "player_distance_data";
i.GPS_TIPS_NOTIFY = "gps_tips_notify";
i.DISMISS_NOTIFY = "dismidd_notify";
cc._RF.pop();
}, {
EventDef: "EventDef"
} ],
GameManager: [ function(n, e, t) {
"use strict";
cc._RF.push(e, "a4573XiL/dPKoydrqlkMvEu", "GameManager");
cc.Class({
extends: cc.Component,
statics: {
_interval_id: null,
_showExit: !1,
_inGameServer: !1,
init: function() {
if (Global.localVersion) {
cc._initDebugSetting(cc.DebugMode.INFO);
window.LogMode = cc.DebugMode.INFO;
} else {
cc._initDebugSetting(cc.DebugMode.WARN);
window.LogMode = cc.DebugMode.WARN;
}
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function(e) {
var t = this;
if (e.keyCode == cc.KEY.back || e.keyCode == cc.KEY.escape) {
var n = cc.director.getScene();
if ("slot_loading" !== n.name && "hall_pre_loading" !== n.name) {
var i = cc.vv.Language.ask_exit;
if (!this._showExit) {
this._showExit = !0;
cc.vv.AlertView.show(i, function() {
if (Global.appId === Global.APPID.BigBang) {
cc.vv.gameData ? cc.vv.gameData.requestExit() : "login" === n.name ? cc.game.end() : "lobby" === n.name ? cc.vv.SceneMgr.enterScene("login") : "hotupdate" !== n.name ? cc.vv.SceneMgr.enterScene("lobby") : cc.game.end();
t._showExit = !1;
} else cc.game.end();
}, function() {
t._showExit = !1;
});
}
}
}
});
this.registerAllMsg();
},
clearLocalSaveAccout: function() {
cc.sys.localStorage.removeItem("account");
cc.sys.localStorage.removeItem("passwd");
},
setInGameServer: function(e) {
this._inGameServer = e;
},
checkIsPhone: function(e) {
var t = cc.sys.localStorage.getItem("account");
e && Global.checkNum(t) || this.clearLocalSaveAccout();
},
registerAllMsg: function() {
cc.vv.EventManager.on(EventId.ENTER_HALL, this.onRcvEnterHall, this);
cc.vv.NetManager.registerMsg(MsgId.GAME_ENTER_MATCH, this.onRcvNetEnterGame, this);
cc.vv.NetManager.registerMsg(MsgId.LOGIN, this.onRcvMsgLogin, this);
cc.vv.NetManager.registerMsg(MsgId.LOGIN_USERID, this.onRcvMsgLoginUserId, this);
cc.vv.NetManager.registerMsg(MsgId.RELOGIN_USERID, this.onRcvMsgLoginUserId, this);
cc.vv.NetManager.registerMsg(MsgId.LOGIN_OUT, this.onRcvMsgLoginout, this);
cc.vv.NetManager.registerMsg(MsgId.GAME_CREATEROOM, this.onRecNetCreateOrJoinRoom, this);
cc.vv.NetManager.registerMsg(MsgId.GAME_JOINROOM, this.onRecNetCreateOrJoinRoom, this);
cc.vv.NetManager.registerMsg(MsgId.GAME_RECONNECT_DESKINFO, this.onRecNetCreateOrJoinRoom, this);
cc.vv.NetManager.registerMsg(MsgId.GAME_REMOTE_LOGIN, this.onRecNetRemoteLogin, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_SYS_KICK_HALL, this.onRcvNetTickHallNotice, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_SYS_KICK_LOGIN, this.onRcvNetSysKickNotice, this);
cc.vv.NetManager.registerMsg(MsgId.GAME_NEED_RESTART, this.onRcvNetGameRestarNotice, this);
cc.vv.NetManager.registerMsg(MsgId.MONEY_CHANGED, this.onRcvNetMoneyChanged, this);
cc.vv.NetManager.registerMsg(MsgId.SYNC_COIN, this.onRcvNetSyncMoney, this);
cc.vv.NetManager.registerMsg(MsgId.SYNC_PLAYER_INFO, this.onRcvNetSyncPlayerInfo, this);
cc.vv.NetManager.registerMsg(MsgId.REQ_REDPACK, this.onRcvRedPackInfo, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_SYS_MAINTENANCE, this.onRcvMaintenance, this);
cc.vv.NetManager.registerMsg(MsgId.TASK_FINISH_NOTICE, this.onRcvNetTaskFinishNotice, this);
cc.vv.NetManager.registerMsg(MsgId.NOTICE_JOINCLUB, this.onRcvJoinClub, this);
cc.vv.NetManager.registerMsg(MsgId.SELF_GPS_DATA, this.onRcvSelfGpsData, this);
cc.game.on(cc.game.EVENT_HIDE, this.onBackGround, this);
},
onRcvSelfGpsData: function(e) {
200 === e.code && Global.dispatchEvent(EventId.SELF_GPS_DATA, e);
},
onRcvJoinClub: function(e) {
if (200 === e.code) {
cc.vv.UserManager.clubs = e.response.clubList;
cc.vv.FloatTip.show("您申请加入亲友圈已经通过!");
Global.dispatchEvent(EventId.UPDATE_CLUBS);
}
},
onRcvMaintenance: function(e) {
200 === e.code && cc.vv.AlertView.showTips(e.notices.msg);
},
onBackGround: function() {
AppLog.warn("游戏进入后台");
Global.playerData.bank_token = null;
},
onEnterFront: function() {
cc.log("游戏进入前台!");
Global.dispatchEvent(EventId.ENTER_FRONT);
this._inGameServer && this.reqReLogin();
},
reqReLogin: function() {
var e = this, t = Global.getLocal(Global.SAVE_KEY_REQ_LOGIN, "");
if (t) cc.vv.NetManager.connect(Global.loginServerAddress, function() {
var e = JSON.parse(t);
e.uid = Global.playerData.uid;
e.token = Global.playerData.token;
e.LoginExData = Global.LoginExData.reloginAction;
e.t === Global.LoginType.REGISTER && (e.t = Global.LoginType.ACCOUNT);
cc.vv.NetManager.send(e);
cc.vv.UserManager.setLoginType(e.t);
Global.saveLocal("account", e.user);
}); else {
cc.vv.AlertView.showTips(cc.vv.Language.go_back_login, function() {
e.goBackLoginScene();
});
}
},
reqLogin: function(s, r, c, l, h, d) {
var u = 6 < arguments.length && void 0 !== arguments[6] ? arguments[6] : "", g = 7 < arguments.length && void 0 !== arguments[7] ? arguments[7] : "";
cc.vv.NetManager.connect(Global.loginServerAddress, function() {
var e = {
c: MsgId.LOGIN
};
e.user = s;
e.passwd = r;
e.email = g;
e.v = Global.resVersion;
Global.isNative() && (e.av = cc.vv.PlatformApiMgr.getAppVersion());
var t = h || Global.LoginExData.reloginAction;
e.t = c;
e.accessToken = l;
e.platform = cc.sys.os;
e.code = u;
e.invitcode = Global.invitcode;
var n = !1;
cc.vv.UserManager.getLoginType() == Global.LoginType.APILOGIN && (n = !0);
if (n && Global.openAPIModel) {
var i = cc.vv.UserManager.getApiGameId();
e.gameid = i;
var a = cc.vv.UserManager.getApiSign();
e.signstr = a;
}
cc.vv.UserManager.setLoginType(c);
e.token = d || Global.playerData.token;
e.bwss = 0;
e.LoginExData = t;
var o = 1;
"en" == Global.language && (o = 2);
e.language = o;
e.client_uuid = Global.getLocal("client_uuid", "");
Global.isUserWSS() && (e.bwss = 1);
cc.vv.NetManager.send(e);
console.log("个性化 req: " + JSON.stringify(e));
cc.log("保存登陆数据");
Global.saveLocal(Global.SAVE_KEY_REQ_LOGIN, JSON.stringify(e));
Global.saveLocal("account", s);
});
},
goBackLoginScene: function() {
var e = !(0 < arguments.length && void 0 !== arguments[0]) || arguments[0];
cc.vv.gameData && cc.vv.gameData.clear();
cc.vv.UserManager.setIsAutoLogin(e);
this._inGameServer = !1;
Global.dispatchEvent(EventId.STOP_ACTION);
cc.vv.NetManager.close();
cc.vv.SceneMgr.enterScene("login");
cc.vv.GameManager.setInGameServer(!1);
},
onRcvMsgLoginout: function(e) {
200 === e.code && this.goBackLoginScene();
},
onRcvEnterHall: function(e) {
"lobby" !== cc.director.getScene().name && cc.vv.SceneMgr.enterScene("lobby", function() {
cc.log("进去大厅");
});
},
isOpenOfGameId: function(e) {
var t = Global.playerData.gameList;
if (t) for (var n = 0; n < t.length; n++) if (t[n].id == e) return 1 == t[n].status;
return !0;
},
onRcvMsgLogin: function(e) {
cc.log("@@@@@@@@ " + JSON.stringify(e));
cc.warn("@@@@@@@@ " + JSON.stringify(e));
if (200 === e.code) {
var t = e.net, n = e.uid, i = e.server, a = e.subid, o = e.token;
Global.openid = e.openid;
Global.shareLink = e.shareLink;
Global.iconUrl = e.iconUrl;
cc.sys.localStorage.setItem("account", e.account);
cc.sys.localStorage.setItem("passwd", e.passwd);
var s = e.openid;
s && 0 < s.length && cc.sys.localStorage.setItem("openid", s);
cc.vv.UserManager.initLoginServer(e);
cc.vv.NetManager.close();
cc.vv.NetManager.connect(t, function() {
var e = {
c: MsgId.LOGIN_USERID
};
e.uid = n;
e.openid = "";
e.server = i;
e.subid = a;
e.token = o;
e.deviceid = Global.getDeviceId();
cc.vv.NetManager.send(e);
});
} else Global.deleteLocal(Global.SAVE_KEY_REQ_LOGIN);
},
onRcvMsgLoginUserId: function(e) {
if (200 === e.code) {
cc.vv.UserManager.initPlayerData(e);
cc.vv.UserManager.setIsAutoLogin(!0);
Global.dispatchEvent(EventId.ENTER_LOGIN_SUCCESS, e);
var t = cc.vv.UserManager.getLoginType();
this._inGameServer = !0;
if (1 == e.deskFlag) if (!Global.isNative() || !Global.openUpdate || Global.isNative() && cc.vv.SubGameUpdateNode.getComponent("SubGameUpdate").isDownLoadSubGame(e.deskInfo.conf.gameid) || 1 === e.deskInfo.conf.gameid || 2 === e.deskInfo.conf.gameid) {
e.deskInfo.isReconnect = !0;
cc.vv.NetManager.dispatchNetMsg({
c: MsgId.GAME_RECONNECT_DESKINFO,
code: Global.ERROR_CODE.NORMAL,
deskInfo: e.deskInfo
});
} else {
var n = {
c: MsgId.GAME_LEVELROOM
};
n.deskid = this._gameId;
cc.vv.NetManager.send(n);
cc.vv.EventManager.emit(EventId.ENTER_HALL);
} else if (t == Global.LoginType.APILOGIN) {
var i = cc.vv.UserManager.getApiGameId();
this.sendEnterGameReq(i);
} else cc.vv.SceneMgr.isInLoginScene() ? cc.vv.SceneMgr.enterScene("lobby") : cc.vv.EventManager.emit(EventId.ENTER_HALL);
}
},
onRecNetCreateOrJoinRoom: function(e) {
if (200 == e.code && (1 === e.deskInfo.conf.gameid || 3 === e.deskInfo.conf.gameid) && null === cc.vv.gameData) {
var t = n("PengHu_GameData");
cc.vv.gameData = new t();
cc.vv.gameData.init(e.deskInfo);
cc.vv.SceneMgr.enterScene("penghu");
}
},
onRecNetDimissRoomBySystem: function(e) {
if (200 === e.code) {
cc.vv.AlertView.showTips(cc.vv.Language.dissolve_room, function() {
cc.vv.EventManager.emit(EventId.ENTER_HALL);
});
}
},
onRecNetRemoteLogin: function(e) {
cc.vv.NetManager.close(null, !1);
cc.vv.AlertView.showTips(cc.vv.Language.acc_online, function() {
this.goBackLoginScene();
}.bind(this));
},
onRcvNetSysKickNotice: function(e) {
cc.vv.NetManager.close(null, !1);
if (cc.vv.gameData) {
cc.vv.gameData.onExit();
cc.vv.gameData = null;
}
this.goBackLoginScene();
cc.vv.AlertView.showTips(e.msg);
},
loadLoginScene: function() {},
onRcvNetMoneyChanged: function(e) {
if (200 === e.code) {
if (e.uid === cc.vv.UserManager.uid) {
Global.playerData.coin = e.coin;
0 < e.count && 1 === e.type && cc.vv.AlertView.showTips(cc.js.formatStr(cc.vv.Language.add_score_succ, Global.S2P(e.count)), function() {});
}
Global.dispatchEvent(EventId.RECHARGE_SUCC, e);
}
},
onRcvNetSyncMoney: function(e) {
if (200 === e.code) {
Global.playerData.coin = e.coin;
Global.dispatchEvent(EventId.RECHARGE_SUCC, e);
}
},
onRcvNetSyncPlayerInfo: function(e) {
if (200 === e.code && e.playerInfo.uid == Global.playerData.uid) for (var t in e.playerInfo) Global.playerData[t] = e.playerInfo[t];
},
onRcvNetTaskFinishNotice: function(e) {
if (200 === e.code) {
Global.playerData.taskNum = e.hasQuest;
cc.vv.EventManager.emit(EventId.UPDATE_TASK_REDPOINT);
}
},
onRcvNetGameRestarNotice: function(e) {
200 === e.code && cc.vv.AlertView.showTips(cc.vv.Language.app_restart, function() {
Global.dispatchEvent(EventId.STOP_ACTION);
cc.vv.NetManager.close();
cc.audioEngine.stopAll();
cc.game.restart();
}.bind(this));
},
onRcvNetTickHallNotice: function(e) {
200 === e.code && cc.vv.AlertView.showTips(cc.vv.Language.user_tick_notice, function() {
if (cc.vv.gameData) {
Global.dispatchEvent(cc.vv.gameData._EventId.EXIT_GAME);
Global.dispatchEvent(EventId.EXIT_GAME);
cc.vv.SceneMgr.enterScene("lobby");
}
}.bind(this));
},
onRcvRedPackInfo: function(e) {
if (200 === e.code && 0 < e.num) {
cc.vv.UserManager.setLuckPackNum(e.allnum);
cc.vv.AlertView.showTips(cc.vv.Language.get_luckypack_tips, function() {}.bind(this));
Global.dispatchEvent(EventId.UPDATE_REDPACK);
}
},
sendEnterGameReq: function(e, t) {
if (e) {
var n = {
c: MsgId.GAME_ENTER_MATCH
};
n.gameid = e;
n.gpsx = 0;
n.gpsy = 0;
n.gpsadd = "";
n.ssid = t || 0;
cc.vv.NetManager.send(n);
}
},
onRcvNetEnterGame: function(e) {
this.onRecNetCreateOrJoinRoom(e);
}
}
});
cc._RF.pop();
}, {
PengHu_GameData: "PengHu_GameData"
} ],
GameRecord: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "85333QxlARB0qGgRPWe9q2q", "GameRecord");
cc.Class({
extends: cc.Component,
properties: {
_gameRecordLayer: null,
_gameRecordItemList: [],
_isShowDetailList: [],
_detailPlayerRowList: [],
_roundRecordItemList: []
},
start: function() {
cc.vv.NetManager.registerMsg(MsgId.GAME_RECORD, this.onRcvGameRecord, this);
cc.vv.NetManager.registerMsg(MsgId.ROUND_RECORD, this.onRcvRoundRecord, this);
},
showGameRecord: function() {
var n = this;
if (null === this._gameRecordLayer) cc.loader.loadRes("common/prefab/GameRecord", cc.Prefab, function(e, t) {
if (null === e) {
n._gameRecordLayer = cc.instantiate(t);
n._gameRecordLayer.scaleX = n.node.width / n._gameRecordLayer.width;
n._gameRecordLayer.scaleY = n.node.height / n._gameRecordLayer.height;
n._gameRecordLayer.parent = n.node;
n._gameRecordLayer.zIndex = 1;
n._gameRecordLayer.x = n.node.width / 2 - n.node.x;
n._gameRecordLayer.y = n.node.height / 2 - n.node.y;
n.initUI();
n.initShow();
}
}); else {
this._gameRecordLayer.active = !0;
this.initShow();
}
},
initUI: function() {
var e = cc.find("bg_top/btn_back", this._gameRecordLayer);
Global.btnClickEvent(e, this.onClose, this);
for (var t = 0; t < 4; t++) {
var n = cc.find("bg_buttons/left_list_view/btn_" + t, this._gameRecordLayer);
n._index = t;
Global.btnClickEvent(n, this.onClickRecordType, this);
}
var i = cc.find("selectData_node/btn_selecteData", this._gameRecordLayer);
Global.btnClickEvent(i, this.onClickSelectData, this);
this.text_data = cc.find("selectData_node/bg_data/text_data", this._gameRecordLayer);
this.panel_dateSelect = cc.find("selectData_node/panel_dateSelect", this._gameRecordLayer);
Global.btnClickEvent(this.panel_dateSelect, this.onClickCloseSelectData, this);
this.panel_dateSelect.active = !1;
this.bg_dateSelect = this.panel_dateSelect.getChildByName("bg_dateSelect");
var a = this.bg_dateSelect.getChildByName("btn_left");
Global.btnClickEvent(a, this.onClickLeft, this);
var o = this.bg_dateSelect.getChildByName("btn_right");
Global.btnClickEvent(o, this.onClickRight, this);
this.text_year_month = this.bg_dateSelect.getChildByName("text_year_month");
this.scroll_gameRecord = this._gameRecordLayer.getChildByName("scroll_gameRecord");
this.scroll_gameRecord.active = !0;
this.gameRecordContent = this.scroll_gameRecord.getChildByName("content");
this.gameRecordItem = this.gameRecordContent.getChildByName("gameRecordItem");
this.gameRecordItem.active = !1;
this.scroll_roundRecord = this._gameRecordLayer.getChildByName("scroll_roundRecord");
this.scroll_roundRecord.active = !1;
var s = this.scroll_roundRecord.getChildByName("btn_closeRoundRecord");
Global.btnClickEvent(s, this.onClickCloseRoundRecord, this);
this.roundRecordContent = this.scroll_roundRecord.getChildByName("content");
this.roundRecordItem = this.roundRecordContent.getChildByName("roundRecordItem");
this.roundRecordItem.active = !1;
},
initShow: function() {
this.onClickCloseRoundRecord();
this.panel_dateSelect.active = !1;
var e = new Date();
this.curData = {};
this.curData.year = e.getFullYear();
this.curData.month = e.getMonth();
this.curData.day = e.getDate();
this.selectData = JSON.parse(JSON.stringify(this.curData));
var t = this.getDataStr(this.selectData.year, this.selectData.month, this.selectData.day);
this.text_data.getComponent(cc.Label).string = t;
this.curShowRecordType = 0;
var n = {
c: MsgId.GAME_RECORD
};
n.selectTime = t;
n.clubid = this.curShowRecordType;
cc.vv.NetManager.send(n);
},
getDataStr: function(e, t, n) {
var i = e + "-";
i += 9 < t ? t + 1 : "0" + (t + 1);
if (n) {
i += "-";
i += 9 < n ? n : "0" + n;
}
return i;
},
onClose: function() {
this._gameRecordLayer.active = !1;
},
onClickRecordType: function(e) {
this.curShowRecordType = e.target._index;
var t = {
c: MsgId.GAME_RECORD
};
t.selectTime = this.getDataStr(this.selectData.year, this.selectData.month, this.selectData.day);
t.clubid = this.curShowRecordType;
cc.vv.NetManager.send(t);
},
onClickSelectData: function() {
this.panel_dateSelect.active = !0;
this.curSelectYear = this.selectData.year;
this.curSelectMonth = this.selectData.month;
this.onShowDataItem(this.curSelectYear, this.curSelectMonth);
},
onShowDataItem: function(e, t) {
this.text_year_month.getComponent(cc.Label).string = this.getDataStr(e, t);
var n = null, i = null;
if (t == this.curData.month) {
(n = this.curData.day - 14) < 1 && (n = 1);
i = this.curData.day;
} else n = (i = new Date(e, t + 1, 0).getDate()) - (14 - this.curData.day);
for (var a = n; a <= i; a++) {
var o = this.bg_dateSelect.getChildByName("dataItem_node" + (a - n));
o._index = n;
Global.btnClickEvent(o, this.onClickDataItem, this);
o.active = !0;
o._year = e;
o._month = t;
o._day = a;
o.getChildByName("bg_dateItem").active = a == this.selectData.day;
o.getChildByName("text_dataItem").getComponent(cc.Label).string = a;
}
for (a = i - n + 1; a < 15; a++) this.bg_dateSelect.getChildByName("dataItem_node" + a).active = !1;
},
onClickCloseSelectData: function() {
this.panel_dateSelect.active = !1;
},
onClickLeft: function() {
if (this.curSelectMonth == this.curData.month && this.curData.day < 15) {
if (0 == this.curSelectMonth) {
this.curSelectYear -= 1;
this.curSelectMonth = 11;
} else this.curSelectMonth -= 1;
this.onShowDataItem(this.curSelectYear, this.curSelectMonth);
}
},
onClickRight: function() {
if ((this.curSelectMonth + 1) % 12 == this.curData.month) {
if (11 == this.curSelectMonth) {
this.curSelectYear += 1;
this.curSelectMonth = 0;
} else this.curSelectMonth += 1;
this.onShowDataItem(this.curSelectYear, this.curSelectMonth);
}
},
onClickDataItem: function(e) {
this.panel_dateSelect.active = !1;
this.selectData.year = e.target._year;
this.selectData.month = e.target._month;
this.selectData.day = e.target._day;
var t = this.getDataStr(this.selectData.year, this.selectData.month, this.selectData.day);
this.text_data.getComponent(cc.Label).string = t;
this.onClickCloseRoundRecord();
var n = {
c: MsgId.GAME_RECORD
};
n.selectTime = t;
n.clubid = this.curShowRecordType;
cc.vv.NetManager.send(n);
},
onClickCloseRoundRecord: function() {
this.scroll_gameRecord.active = !0;
this.scroll_roundRecord.active = !1;
},
onRcvGameRecord: function(e) {
if (this._gameRecordItemList) for (var t = 0; t < this._gameRecordItemList.length; t++) this._gameRecordItemList[t].removeFromParent();
this._gameRecordItemList = [];
this._isShowDetailList = [];
this._detailPlayerRowList = [];
if (200 === e.code && e.data) {
for (t = 0; t < e.data.length; t++) {
this._gameRecordItemList.push(cc.instantiate(this.gameRecordItem));
this._gameRecordItemList[t].parent = this.gameRecordContent;
var n = this._gameRecordItemList[t].getChildByName("roomInfo");
n.getChildByName("text_begin_time").getComponent(cc.Label).string = e.data[t].beginTime;
n.getChildByName("text_end_time").getComponent(cc.Label).string = e.data[t].endTime;
var i = n.getChildByName("text_roomInfo");
i.getChildByName("text_roomID").getComponent(cc.Label).string = "房间号：" + e.data[t].deskid;
i.getChildByName("text_game_name").getComponent(cc.Label).string = "碰胡";
i.getChildByName("text_game_jushu").getComponent(cc.Label).string = e.data[t].gameNum + "局";
i.getChildByName("text_people_num").getComponent(cc.Label).string = e.data[t].presonNum;
var a = n.getChildByName("bg_clubInfo");
a.getChildByName("text_roomType").getComponent(cc.Label).string = [ "代开房房间", "亲友圈房间", "代开房房间", "他人房间" ][e.data[t].clubid];
a.getChildByName("text_houseOwner").getComponent(cc.Label).string = e.data[t].houseOwner;
cc.find("bg_score/text_score", n).getComponent(cc.Label).string = e.data[t].score;
var o = n.getChildByName("btn_detail");
o._index = t;
Global.btnClickEvent(o, this.onClickDetail, this);
var s = this._gameRecordItemList[t].getChildByName("playersInfo");
s.active = !1;
var r = s.getChildByName("timeShareDetail");
r.getChildByName("text_timeValue").getComponent(cc.Label).string = e.data[t].beginTime;
var c = r.getChildByName("btn_share");
o._index = t;
Global.btnClickEvent(c, this.onClickShare, this);
var l = r.getChildByName("btn_checkRoundDetail");
l._index = e.data[t].deskid;
Global.btnClickEvent(l, this.onClickCheckRoundDetail, this);
for (var h = JSON.parse(e.data[t].data), d = 0, u = 0; u < h.length; u++) d < h[u].score && (d = h[u].score);
for (u = 0; u < h.length; u++) {
var g = s.getChildByName("playerInfoItem" + u);
Global.setHead(g.getChildByName("user_head"), h[u].usericon);
g.getChildByName("img_owner").active = h[u].uid == e.data[t].houseOwnerUid;
g.getChildByName("text_player_name").getComponent(cc.Label).string = h[u].playername;
g.getChildByName("text_player_id").getComponent(cc.Label).string = h[u].uid;
g.getChildByName("img_big_winner").active = h[u].score >= d && 0 < d;
g.getChildByName("text_score_win").active = 0 < h[u].score;
g.getChildByName("text_score_lose").active = h[u].score <= 0;
0 < h[u].score ? g.getChildByName("text_score_win").getComponent(cc.Label).string = h[u].score : g.getChildByName("text_score_lose").getComponent(cc.Label).string = "/" + Math.abs(h[u].score);
g.active = !0;
}
for (u = h.length; u < 4; u++) {
s.getChildByName("playerInfoItem" + u).active = !1;
}
this._gameRecordItemList[t].active = !0;
this._isShowDetailList[t] = !1;
this._detailPlayerRowList[t] = 2 < h.length ? 2 : 1;
}
this.updateItemPosX();
}
this._gameRecordLayer.getChildByName("tips").active = 0 == this._gameRecordItemList.length;
},
onClickDetail: function(e) {
var t = e.target._index;
this._isShowDetailList[t] = !this._isShowDetailList[t];
this._gameRecordItemList[t].getChildByName("playersInfo").active = this._isShowDetailList[t];
this.updateItemPosX();
},
onClickShare: function(e) {
e.target._index;
},
onClickCheckRoundDetail: function(e) {
var t = {
c: MsgId.ROUND_RECORD
};
t.deskid = e.target._index;
cc.vv.NetManager.send(t);
},
onRcvRoundRecord: function(e) {
if (this._roundRecordItemList) for (var t = 0; t < this._roundRecordItemList.length; t++) this._roundRecordItemList[t].removeFromParent();
this._roundRecordItemList = [];
if (200 === e.code && e.data) {
for (t = 0; t < e.data.length; t++) {
this._roundRecordItemList.push(cc.instantiate(this.roundRecordItem));
this._roundRecordItemList[t].parent = this.roundRecordContent;
this._roundRecordItemList[t].y = -80 - t * this._roundRecordItemList[t].height;
cc.find("bg_num/text_roundIndex", this._roundRecordItemList[t]).getComponent(cc.Label).string = t + 1;
this._roundRecordItemList[t].getChildByName("text_time").getComponent(cc.Label).string = e.data[t].beginTime;
for (var n = JSON.parse(e.data[t].data), i = this._roundRecordItemList[t].getChildByName("bg_score"), a = 0; a < n.length; a++) {
i.getChildByName("text_name" + a).getComponent(cc.Label).string = n[a].playername;
i.getChildByName("text_score_win" + a).active = 0 < n[a].roundScore;
i.getChildByName("text_score_lose" + a).active = n[a].roundScore <= 0;
0 < n[a].roundScore ? i.getChildByName("text_score_win" + a).getComponent(cc.Label).string = n[a].roundScore : i.getChildByName("text_score_lose" + a).getComponent(cc.Label).string = "/" + Math.abs(n[a].roundScore);
}
for (a = n.length; a < 4; a++) {
i.getChildByName("text_name" + a).active = !1;
i.getChildByName("text_score_win" + a).active = !1;
i.getChildByName("text_score_lose" + a).active = !1;
}
this._roundRecordItemList[t].active = !0;
}
this.scroll_gameRecord.active = !1;
this.scroll_roundRecord.active = !0;
}
},
updateItemPosX: function() {
for (var e = [ 122, 287, 392 ], t = 0, n = 0; n < this._gameRecordItemList.length; n++) {
this._gameRecordItemList[n].y = t;
this._isShowDetailList[n] ? t -= e[this._detailPlayerRowList[n]] : t -= e[0];
}
this.gameRecordContent.height = -t;
},
onDestroy: function() {
this._gameRecordLayer && cc.loader.releaseRes("common/prefab/GameRecord", cc.Prefab);
}
});
cc._RF.pop();
}, {} ],
GlobalCfg: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "400cfFA/jxGw4u2CwwaF0u9", "GlobalCfg");
var i = e("GlobalVar");
i.ChatType = {
TXT: 0,
EMOJI: 1,
VOICE: 2,
TXT_EFF: 3
};
i.LoginType = {
Guest: 11,
WX: 2,
FB: 13,
ACCOUNT: 14,
REGISTER: 12,
TOKEN: 6,
APILOGIN: 7
};
i.PLATFORM_ID = {
Google: 1,
HuaWei: 2
};
i.APPID = {
BigBang: 1,
Poly: 4
};
i.LoginExData = {
loginAction: 1,
reloginAction: 2
};
i.ERROR_CODE = {
NORMAL: 200
}, i.CONST_NUM = {
HIGHT_ZORDER: 100
}, i.ShareSceneType = {
WXSceneSession: "WXSceneSession",
WXSceneTimeline: "WXSceneTimeline",
WXSceneFavorite: "WXSceneFavorite"
}, i.SOUNDS = Global.SOUNDS || {};
i.SOUNDS.bgm_hall = {
path: "",
filename: "music_bg0",
common: !0
};
i.SOUNDS.eff_click = {
path: "",
filename: "effect_btn",
common: !0
};
i.SOUNDS.eff_ui_pop = {
path: "",
filename: "effect_return",
common: !0
};
i.SOUNDS.eff_ui_close = {
path: "",
filename: "effect_close",
common: !0
};
i.playBgm = function(e, t, n) {
if (null != e && null != e) if ("string" == typeof e) cc.vv.AudioManager.playBgm(e, !1, t); else {
e.rmax && (e = Global.randomEffCfg(e, e.rmin || 0, e.rmax));
var i = e.filename;
cc.vv.AudioManager.playBgm(e.path, i, e.common, !1, t, n);
} else AppLog.warn("bgm_cfg is null or undefined");
};
i.playEff = function(e, t, n) {
if (null != e && null != e) {
var i = null;
if ("string" == typeof e) i = cc.vv.AudioManager.playEff(e, !1); else {
e.rmax && (e = Global.randomEffCfg(e, e.rmin || 0, e.rmax));
var a = e.filename;
null != n && (a = a + "_" + n);
null != t && null != t && (a += 1 == t ? "_B" : "_G");
i = cc.vv.AudioManager.playEff(e.path, a, e.common);
}
return i;
}
AppLog.warn("eff_cfg is null or undefined");
};
i.randomEffCfg = function(e, t, n) {
var i = JSON.parse(JSON.stringify(e)), a = Global.random(t, n);
i.filename += "_" + a;
return i;
};
i.SAVE_KEY_REQ_LOGIN = "SAVE_KEY_REQ_LOGIN";
i.SAVE_KEY_ACCOUNT_PW = "SAVE_KEY_ACCOUNT_PW";
i.SAVE_KEY_IS_REMEMBER = "SAVE_KEY_IS_REMEMBER";
i.SAVE_KEY_LOGIN_TYPE = "SAVE_KEY_LOGIN_TYPE";
i.SAVE_KEY_LAST_LOGIN_TYPE = "SAVE_KEY_LAST_LOGIN_TYPE";
i.SAVE_PLAYER_TOKEN = "SAVE_PLAYER_TOKEN";
i.SAVE_LANGUAGE = "SAVE_LANGUAGE";
cc._RF.pop();
}, {
GlobalVar: "GlobalVar"
} ],
GlobalFunc: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "6a1dap8I4FEi6IX92jWwcHR", "GlobalFunc");
var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
var s = e("GlobalVar");
s.designSize = cc.size(1280, 720);
s.centerPos = cc.v2(640, 360);
s.shake = !1;
s.ANDROID_CLASS_NAME = "org/cocos2dx/javascript/AppActivity";
s.isNative = function() {
return cc.sys.isNative && jsb;
};
var o = {
0: "tx_nan1",
1: "tx_nan2",
2: "tx_nan3",
3: "tx_nan4",
4: "tx_nan5",
5: "tx_nv1",
6: "tx_nv2",
7: "tx_nv3",
8: "tx_nv4",
9: "tx_nv5"
};
s.getHeadId = function(e) {
return o[e %= 10];
};
s.setHead = function(t, e) {
if (cc.js.isString(e)) {
0 <= e.indexOf("http") && t.getComponent("ImageLoader").setUserHeadUrl(e, function(e) {
t.getComponent(cc.Sprite).spriteFrame = e;
});
}
}, s.setShake = function(e) {
s.shake = e;
cc.sys.localStorage.setItem("shake", e);
Global.dispatchEvent(EventId.SET_SHAKE, e);
};
s.getShake = function(e) {
return s.shake;
};
s.isAndroid = function() {
return cc.sys.os == cc.sys.OS_ANDROID;
};
s.isIOS = function() {
return cc.sys.os == cc.sys.OS_IOS;
};
s.isIOSReview = function() {
return !!s.isIOS() && Global.isReview;
};
s.getDeviceId = function() {
return cc.vv.PlatformApiMgr.getDeviceId();
};
s.emit = function(e, t, n) {
if (e) {
e.emit(t, n);
if (Global.localVersion) {
n.eventId = t;
cc.log("emit", JSON.stringify(n));
}
}
};
s.on = function(e, t, n, i) {
if (e) {
e.on(t, n, i);
Global.localVersion && cc.log("node(" + e.getName() + ") on eventId(" + t + ")");
}
};
s.off = function(e, t, n, i) {
if (e) {
e.off(t, n, i);
Global.localVersion && cc.log("node(" + e.getName() + ") off eventId(" + t + ")");
}
};
s.retain = function(e) {
cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS || e.retain();
};
s.release = function(e) {
e && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS && e.release();
};
s.addPersistNode = function(e) {
cc.game.addPersistRootNode(e);
};
s.removePersistNode = function(e) {
cc.game.removePersistRootNode(e);
};
s.saveLocal = function(e, t) {
e += "";
t += "";
cc.sys.localStorage.setItem(Global.compile(e), Global.compile(t));
};
s.getLocal = function(e, t) {
e += "";
var n = cc.sys.localStorage.getItem(Global.compile(e));
n && (n = Global.uncompile(n));
(!n || n.length <= 0) && (n = t);
return n;
};
s.deleteLocal = function(e) {
e += "";
cc.sys.localStorage.removeItem(Global.compile(e));
};
s.compile = function(e) {
for (var t = String.fromCharCode(e.charCodeAt(0) + e.length), n = 1; n < e.length; n++) t += String.fromCharCode(e.charCodeAt(n) + e.charCodeAt(n - 1));
return t = escape(t);
};
s.uncompile = function(e) {
e = unescape(e);
for (var t = String.fromCharCode(e.charCodeAt(0) - e.length), n = 1; n < e.length; n++) t += String.fromCharCode(e.charCodeAt(n) - t.charCodeAt(n - 1));
return t;
};
s.bindParams = function() {
var e = Array.prototype.slice.call(arguments), t = e.shift();
if ("function" == typeof t) return function() {
return t.apply(null, e.concat(Array.prototype.slice.call(arguments)));
};
};
s.random = function(e, t) {
return Math.floor(Math.random() * (t - e + 1) + e);
};
s.copy = function(e) {
var t = e instanceof Array ? [] : {};
for (var n in e) "object" === i(e[n]) ? t[n] = s.copy(e[n]) : t[n] = e[n];
return t;
};
s.stringToBytes = function(e) {
for (var t, n = [], i = 0; i < e.length; i++) {
t = e.charCodeAt(i);
var a = [];
do {
a.push(255 & t);
t >>= 8;
} while (t);
n = n.concat(a.reverse());
}
return n;
};
s.jsToCByShort = function(e) {
var t = Math.floor(e / 256), n = Math.floor(e % 256);
return String.fromCharCode(t, n);
};
s.jsToCByInt = function(e) {
var t = Math.floor(e / 16777216), n = Math.floor(e / 65536) % 256, i = Math.floor(e / 256) % 256, a = Math.floor(e % 256);
return String.fromCharCode(t, n, i, a);
};
s.srcSum = function(e, t) {
for (var n = 65535, i = 0; i < t; i++) {
0 == ((n ^= e[i]) && 1) ? n /= 2 : n = n / 2 ^ 28849;
}
return n;
};
s.convertGPS2GCJ = function(e, t) {
e = Number(e);
t = Number(t);
var i = 3.141592653589793, n = .006693421622965943;
var a = function(e, t) {
var n = 2 * e - 100 + 3 * t + .2 * t * t + .1 * e * t + .2 * Math.sqrt(Math.abs(e));
n += 2 * (20 * Math.sin(6 * e * i) + 20 * Math.sin(2 * e * i)) / 3;
n += 2 * (20 * Math.sin(t * i) + 40 * Math.sin(t / 3 * i)) / 3;
return n += 2 * (160 * Math.sin(t / 12 * i) + 320 * Math.sin(t * i / 30)) / 3;
}(e - 105, t - 35), o = function(e, t) {
var n = 300 + e + 2 * t + .1 * e * e + .1 * e * t + .1 * Math.sqrt(Math.abs(e));
n += 2 * (20 * Math.sin(6 * e * i) + 20 * Math.sin(2 * e * i)) / 3;
n += 2 * (20 * Math.sin(e * i) + 40 * Math.sin(e / 3 * i)) / 3;
return n += 2 * (150 * Math.sin(e / 12 * i) + 300 * Math.sin(e / 30 * i)) / 3;
}(e - 105, t - 35), s = t / 180 * i, r = Math.sin(s);
r = 1 - n * r * r;
var c = Math.sqrt(r);
return {
lat: t + (a = 180 * a / (6378245 * (1 - n) / (r * c) * i)),
lng: e + (o = 180 * o / (6378245 / c * Math.cos(s) * i))
};
};
s.gcj02towgs84 = function(e, t) {
if (out_of_china(e, t)) return [ e, t ];
var n = transformlat(e - 105, t - 35), i = transformlng(e - 105, t - 35), o = t / 180 * PI, s = Math.sin(o);
s = 1 - ee * s * s;
var r = Math.sqrt(s);
n = 180 * n / (a * (1 - ee) / (s * r) * PI);
i = 180 * i / (a / r * Math.cos(o) * PI);
mglat = t + n;
mglng = e + i;
return [ 2 * e - mglng, 2 * t - mglat ];
};
s.getAddressDetail = function(e, t, n) {};
s.getDistanceOfTwoPoint = function(e, t, n, i) {
AppLog.log(e, t, n, i);
var a = function(e) {
return e * Math.PI / 180;
}, o = a(e), s = a(n), r = o - s, c = a(t) - a(i), l = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(r / 2), 2) + Math.cos(o) * Math.cos(s) * Math.pow(Math.sin(c / 2), 2)));
l *= 6378.137;
return Math.abs(l);
};
s.convertNumToShort = function(e, t, n, i) {
var a = [ "", "万", "亿", "万亿" ], o = 0 != e ? e / Math.abs(e) : 1;
e = Math.abs(e);
i && (a = i);
t = null == t ? 1e4 : t;
n = null == n ? 1 : n;
for (var s = 0; t <= e; ) {
s++;
e /= t;
}
return (e = Math.floor(e * Math.pow(10, n)) / Math.pow(10, n)) * o + a[s];
};
s.convertNumToChineseNum = function(e) {
var t, n, i = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"), a = new Array("", "拾", "佰", "仟"), o = new Array("", "万", "亿", "兆"), s = "";
if ("" === e) return "";
if (1e15 <= (e = parseFloat(e))) return "";
if (0 == e) return s = i[0];
if (-1 == (e = e.toString()).indexOf(".")) {
t = e;
"";
} else {
t = (n = e.split("."))[0];
n[1].substr(0, 4);
}
if (0 < parseInt(t, 10)) for (var r = 0, c = t.length, l = 0; l < c; l++) {
var h = t.substr(l, 1), d = c - l - 1, u = d / 4, g = d % 4;
if ("0" == h) r++; else {
0 < r && (s += i[0]);
r = 0;
s += i[parseInt(h)] + a[g];
}
0 == g && r < 4 && (s += o[u]);
}
"" == s && (s += i[0]);
return s;
};
s.subStrOfChinese = function(t, e, n) {
var i = 0, a = "", o = /[^\x00-\xff]/g, s = "";
try {
for (var r = t.replace(o, "**").length, c = 0; c < r; c++) {
null != (s = t.charAt(c).toString()).match(o) ? i += 2 : i++;
if (e < i) break;
a += s;
}
n && e < r && (a += "..");
} catch (e) {
return t;
}
return a;
}, s.captureScreen = function(t, n, i, e, a) {
var o = n.position, s = Global.designSize;
e && (s = e);
a && (n.active = !0);
var r = cc.RenderTexture.create(s.width, s.height);
r.setVisible(!1);
r.begin();
n.position = cc.p(Global.designSize.width / 2, Global.designSize.height / 2);
n._sgNode.visit();
r.end();
a && (n.active = !1);
r.saveToFile(t, cc.ImageFormat.PNG, !0, function() {
cc.log(jsb.fileUtils.getWritablePath());
var e = jsb.fileUtils.getWritablePath() + t;
if (i) {
n.position = o;
i(e);
}
});
}, s.ShareLink = function(a, e) {
if (Global.openFacebookLogin && Global.playerData.logintype === Global.LoginType.FB) {
var t = {
shareType: 1
};
t.linkUrl = a;
t.content = e || "";
cc.vv.PlatformApiMgr.SdkShare(JSON.stringify(t));
} else if (Global.openWeChatLogin) {
var n = "喊你一起玩游戏！";
e && 0 < e.length && (n = e);
var i = Global.WX_SHARE_SCENE.Secssion;
Global.WXShareLink(a, "f4娱乐", n, i);
} else cc.loader.loadRes("prefab/UIShare", function(e, t) {
var n = cc.instantiate(t), i = n.getComponent("UIGuestShare");
i && i.setQRCodeUrl(a);
n.position = Global.centerPos;
cc.director.getScene().addChild(n);
});
};
s.shareAppWebLink = function(e, t) {
e = e || "0";
t = t || "0";
var n = Global.share_url + "?appName=ruili.com&actionId=" + e + "&valueId=" + t;
n = n + "&channel=" + cc.vv.PlatformApiMgr.umChannel();
Global.ShareLink(n, "");
};
s.WXShareLink = function(e, t, n, i, a) {
var o = Global.webShareIcon;
0 <= i && e && t && n && cc.vv.WxMgr.wxShareWeb(i, t, n, o, e, a);
};
s.WXShareImage = function(e, t, n) {
0 <= t && e && cc.vv.WxMgr.wxShareImg(t, e, n);
};
s.isUserWSS = function(e) {
var t = !1, n = Global.loginServerAddress;
e && (n = e);
-1 === n.indexOf(":") && (t = !0);
return t;
};
s.getRoomLevelString = function(e) {
return [ "场次名称", "体验场", "初级场", "普通场", "高级场", "VIP场" ][e = e || 0];
};
s.registerEvent = function(e, t, n) {
cc.find("Canvas").on(e, t, n);
};
s.dispatchEvent = function(e, t) {
var n = cc.find("Canvas");
n && n.emit(e, t);
};
s.btnClickEvent = function(n, e, t) {
var i = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
if (null == n) return null;
var a = e.bind(t);
n.on("click", function(e) {
var t = n.getComponent(cc.Button);
t && t.interactable && (null == i ? null === cc.vv.gameData && Global.playEff(Global.SOUNDS.eff_click) : -1 === i || cc.vv.AudioManager.playEff(i.path, i.filename, i.common));
a(e);
});
return n;
};
s.btnClickEventNoDefaultSound = function(e, t, n) {
if (null == e) return null;
e.on("click", t, n);
return e;
};
s.FormatNumToComma = function(e) {
e.toString().replace(/\d+/, function(e) {
return e.replace(/(\d)(?=(\d{3})+$)/g, function(e) {
return e + ",";
});
});
return e;
};
s.FormatCommaNumToNum = function(e) {
return parseInt(e.replace(/,/g, ""));
};
s.checkToggleIsSelect = function(e) {
for (var t = 0; t < e.childrenCount; ++t) {
var n = e.children[t].getComponent(cc.Toggle);
if (n.isChecked) return n.node;
}
return null;
};
s.setToggleSecelct = function(e, t) {
for (var n = 0; n < e.childrenCount; ++n) {
var i = e.children[n].getComponent(cc.Toggle);
e.children[n].name == t ? i.isChecked = !0 : i.isChecked = !1;
}
};
s.autoAdaptDevices = function() {
!(0 < arguments.length && void 0 !== arguments[0]) || arguments[0];
var e = cc.find("Canvas"), t = e.getComponent(cc.Canvas);
if (e.width / e.height < t.designResolution.width / t.designResolution.height) {
t.fitWidth = !0;
t.fitHeight = !1;
} else {
t.fitWidth = !1;
t.fitHeight = !0;
}
Global.setAdaptIphoneX();
};
s.clickService = function() {
cc.sys.openURL("https://mapped.vorsco.com/talk/chatClient/chatbox.jsp?companyID=631049927&configID=1490&jid=7922767770&s=1");
}, s.setAdaptIphoneX = function() {
var e = cc.find("Canvas").getComponent(cc.Canvas).node.getChildByName("safe_node");
if (e) {
var t = e.getComponent(cc.Widget);
if (t) {
t.top = 0;
t.bottom = 0;
t.left = 0;
t.right = 0;
}
}
};
s.getStrBLen = function(e) {
if (null == e) return 0;
"string" != typeof e && (e += "");
return e.replace(/[^\x00-\xff]/g, "ab").length;
};
s.checkIpAndGps = function(e, t) {
var n = function(e) {
return !(0 === e.lat && 0 === e.lng);
}, i = function(e, t) {
return e.ip.split(":")[0] == t.ip.split(":")[0];
}, a = function(e, t) {
return !!n(e) && (!!n(t) && Global.getDistanceOfTwoPoint(e.lat, e.lng, t.lat, t.lng) <= .2);
};
if (t) {
for (o = 0; o < e.length; o++) if (e[o] && e[o].uid != t.uid && i(e[o], t)) return !0;
for (o = 0; o < e.length; o++) if (e[o] && e[o].uid != t.uid && a(e[o], t)) return !0;
} else {
for (var o = 0; o < e.length - 1; o++) if (e[o]) for (var s = o + 1; s < e.length; s++) if (e[s] && i(e[o], e[s])) return !0;
for (var o = 0; o < e.length - 1; o++) if (e[o]) for (s = o + 1; s < e.length; s++) if (e[s] && a(e[o], e[s])) return !0;
}
return !1;
};
s.showQRCode = function(e, t, n) {
if (t) {
var i = t.getComponent("showQRcode");
i && i.showQRCode(e, n);
}
};
s.moveMenu = function(e, t) {
t.getComponent(cc.Button).interactable = !1;
var n = e ? cc.v2(0, t.height) : cc.v2(0, 0), i = e ? cc.v2(0, 0) : cc.v2(0, t.height);
t.position = n;
t.opacity = e ? 0 : 255;
t.active = !0;
t.runAction(cc.sequence(cc.spawn(cc.moveTo(.3, i), cc.fadeTo(.3, e ? 255 : 0)), cc.callFunc(function() {
t.getComponent(cc.Button).interactable = !0;
})));
};
s.showAlertAction = function(e, t, n, i, a) {
var o = n, s = i;
if (t) {
e.scale = null == o ? 0 : o;
null == s && (s = 1);
} else {
null == o && (e.scale = 1);
null == s && (s = 0);
}
var r = cc.scaleTo(.2, s);
t ? r.easing(cc.easeBackOut()) : r.easing(cc.easeSineIn());
e.runAction(cc.sequence(r, cc.callFunc(function() {
a && a();
})));
};
s.createrSpriteAni = function(e, t, n, i, a, o, s, r, c) {
var l = new cc.Node("node_eff");
l.addComponent(cc.Sprite);
this.addSpriteAni(l, e, t, n, i, a, o, s, r, c);
return l;
};
s.getLocalTime = function(e) {
var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "/", n = new Date(1e3 * e), i = n.getFullYear() + t, a = (n.getMonth() + 1 < 10 ? "0" + (n.getMonth() + 1) : n.getMonth() + 1) + t, o = n.getDate();
o < 10 && (o = "0" + o);
o += " ";
var s = n.getHours();
s < 10 && (s = "0" + s);
s += ":";
var r = n.getMinutes();
r < 10 && (r = "0" + r);
r += ":";
var c = n.getSeconds();
c < 10 && (c = "0" + c);
return i + a + o + s + r + c;
}, s.showName = function(e, t) {
var n = e;
if (Global.checkNum(e) && 11 === e.length) {
n = e.substr(0, 3);
n += "******";
n += e.substr(9, e.length);
} else t && (n = Global.subStrOfChinese(e, 10, !0));
return n;
};
s.checkNum = function(e) {
return !!/^[0-9]+.?[0-9]*$/.test(e);
}, s.addSpriteAni = function(e, t, n, i, a, o, s, r, c, l) {
c || (c = 1);
null == l && (l = !0);
for (var h = function(e, t) {
if (t) {
return e < 10 ? "0" + e : e;
}
return e;
}, d = [], u = 0; u < i; u++) {
var g = n + h(u + c, l);
r && (g = n + r + h(u + c, l));
t._spriteFrames[g] && d.push(t._spriteFrames[g]);
}
var _ = e.addComponent(cc.Animation), f = cc.AnimationClip.createWithSpriteFrames(d, 30), v = "finished";
if (o) {
f.wrapMode = cc.WrapMode.Loop;
v = "lastframe";
}
f.speed = a;
_.addClip(f, n);
_.on(v, function e() {
_.off(v, e);
s && s();
});
_.play(n);
};
s.isEmptyObject = function(e) {
for (var t in e) return !1;
return !0;
};
s.getDeviceInfo = function() {
var e = {
osValue: "web"
};
if (cc.sys.isNative) {
e.frameSize = cc.view.getFrameSize();
e.osValue = cc.sys.os;
e.phoneBrand = cc.vv.PlatformApiMgr.getDeviceBrand();
e.phoneSystemVision = cc.vv.PlatformApiMgr.getDeviceOpSysVision();
e.phoneUuid = this.getDeviceId();
}
return e;
};
Global.setNodeScaleFixWin = function(e) {
var t = cc.director.getWinSize();
e.scaleX = t.width / e.width;
e.scaleY = t.height / e.height;
};
Global.setNodeScaleWithDesignSize = function(e) {
e.scaleX = cc.winSize.width / Global.designSize.width;
e.scaleY = cc.winSize.height / Global.designSize.height;
};
Global.unique5 = function(e) {
var t = new Set(e);
return [].concat(function(e) {
if (Array.isArray(e)) {
for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
return n;
}
return Array.from(e);
}(t));
};
Global.shakeNode = function(e, t, n, i) {
t = t || 16;
n = n || 1;
var a = .04, o = Math.floor(n / .16), s = cc.moveBy(a, cc.p(-t, 0)), r = cc.moveBy(a, cc.p(t, 0)), c = cc.moveBy(a, cc.p(t, 0)), l = cc.moveBy(a, cc.p(-t, 0)), h = cc.sequence(s, r, c, l), d = cc.moveBy(a, cc.p(0, t)), u = cc.moveBy(a, cc.p(0, -t)), g = cc.moveBy(a, cc.p(0, -t)), _ = cc.moveBy(a, cc.p(0, t)), f = cc.sequence(d, u, g, _);
e.runAction(cc.sequence(cc.scaleTo(a, 1.025), cc.repeat(cc.spawn(h, f), o), cc.scaleTo(a, 1), cc.callFunc(function() {
i && e.setPosition(i);
})));
};
Global.showAd = function() {
cc.vv.FloatTip.show("金币不足");
};
Global.getShortList = function() {
return [ "快点吧,我等的花都谢了", "你的牌打的太好了", "打一个来碰呀", "好歹让我吃一个", "来呀,互相伤害", "我有一百种办法胡你", "呵呵~", "还让不让我摸牌了", "你这样以后没朋友" ];
};
Global.getEmjoList = function() {
return [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
};
Global.isWXAppInstalled = function() {
if (s.isAndroid()) {
return jsb.reflection.callStaticMethod(Global.ANDROID_CLASS_NAME, "isWXAppInstalled", "()Z");
}
return s.isIOS(), !1;
};
Global.setAppidWithAppsecretForJS = function(e, t) {
if (s.isAndroid()) {
return jsb.reflection.callStaticMethod(Global.ANDROID_CLASS_NAME, "setAppidWithAppsecretForJS", "(Ljava/lang/String;Ljava/lang/String;)Z", e, t);
}
s.isIOS();
};
Global.wxRequestCallBack = null;
Global.wxRequestCallBackTarget = null;
Global.wxCode = "";
Global.setWXRequestCallBack = function(e, t) {
Global.wxRequestCallBack = e;
Global.wxRequestCallBackTarget = t;
};
Global.WXCode = function(e) {
Global.wxCode = e;
Global.wxRequestCallBack.call(Global.wxRequestCallBackTarget, e);
};
Global.onWxAuthorize = function(e, t) {
Global.wxRequestCallBack = e;
Global.wxRequestCallBackTarget = t;
if (Global.wxRequestCallBack) {
if (s.isAndroid()) {
return jsb.reflection.callStaticMethod(Global.ANDROID_CLASS_NAME, "onWxAuthorize", "()Z");
}
s.isIOS();
} else cc.warn("请先设置微信相应的回调");
};
s.onWXShareText = function(e, t, n) {
s.isAndroid() ? jsb.reflection.callStaticMethod(Global.ANDROID_CLASS_NAME, "onWXShareText", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", e, t, n) : s.isIOS();
};
s.onWXShareImage = function(e) {
if (s.isNative()) {
var t = jsb.fileUtils.getWritablePath() + "ScreenShoot/";
jsb.fileUtils.isDirectoryExist(t) || jsb.fileUtils.createDirectory(t);
var n = "ScreenShoot-" + new Date().valueOf() + ".png", i = t + n, a = cc.winSize, o = cc.RenderTexture.create(a.width, a.height, cc.Texture2D.PixelFormat.RGBA8888, 35056);
o.setPosition(cc.p(a.width / 2, a.height / 2));
cc.director.getScene()._sgNode.addChild(o);
o.setVisible(!1);
o.begin();
cc.director.getScene()._sgNode.visit();
o.end();
o.saveToFile("ScreenShoot/" + n, cc.ImageFormat.PNG, !0, function() {
o.removeFromParent();
s.isAndroid() ? jsb.reflection.callStaticMethod(Global.ANDROID_CLASS_NAME, "onWXShareImage", "(Ljava/lang/String;Ljava/lang/String;)V", e, i) : s.isIOS();
});
}
};
s.onWXShareLink = function(e, t, n, i, a) {
s.isAndroid() ? jsb.reflection.callStaticMethod(Global.ANDROID_CLASS_NAME, "onWXShareLink", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", e, t, n, i, a) : s.isIOS();
};
Global.GetGPSData = function(e) {
var t = e.split(","), n = {
c: MsgId.SELF_GPS_DATA
};
n.lng = t[0];
n.lat = t[1];
n.city = t[2];
cc.vv.NetManager.send(n);
};
cc._RF.pop();
}, {
GlobalVar: "GlobalVar"
} ],
GlobalVar: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "28737uRnZxDDq30n03V7+QR", "GlobalVar");
var i = cc.Class({
extends: cc.Component,
statics: {
loginServerAddress: "www.zonzu.net:9180",
localVersion: !0,
isReview: !1,
appId: 4,
resVersion: "v1.0.0.0",
appVersion: "1.0.0",
designSize: cc.size(1280, 720),
centerPos: cc.v2(640, 360),
language: 1,
openUpdate: !1,
openAPIModel: !1,
testModule: !1,
testIndex: 0,
isLandSpace: !0
}
});
i.WX_SHARE_SCENE = {
Secssion: 0,
Timeline: 1,
Favorite: 2
};
window.Global = i;
cc._RF.pop();
}, {} ],
HeadLoaderMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "61d6cuYos5K1qfTtW3JjgT1", "HeadLoaderMgr");
cc.Class({
extends: cc.Component,
statics: {
_loader_array: null,
_loader_dic: null,
_isLoading: !1,
addLoader: function(e, t, n, i, a) {
this._loader_array = this._loader_array || [];
this._loader_dic = this._loader_dic || {};
var o = null;
a || (o = this.checkLocalFile(e)) && (t = o);
var s = "$" + e + "$" + t;
if (!this._loader_dic[s]) {
this._loader_dic[s] = function(e, t) {
var n = new Object();
n.url = t;
n.filename = e;
n.times = 0;
n.observers = [];
n.push = function(e, t) {
this.observers.push({
spr: t,
cb: e
});
};
return n;
}(e, t);
o ? this._loader_array.unshift(s) : this._loader_array.push(s);
}
this._loader_dic[s].push(n, i);
this._isLoading || this.runLoader();
},
runLoader: function() {
if (this._loader_array.length <= 0) this._isLoading = !1; else {
this._isLoading = !0;
var a = this._loader_array.shift(), o = this._loader_dic[a];
cc.loader.load(o.url, function(e, t) {
if (e) {
o.times += 1;
o.times < 3 ? this._loader_array.push(a) : delete this._loader_dic[a];
this.runLoader();
} else {
var n = new cc.SpriteFrame(t, cc.Rect(0, 0, t.width, t.height));
for (var i in o.observers) {
o.observers[i].spr && (o.observers[i].spr.spriteFrame = n);
o.observers[i].cb && o.observers[i].cb(n);
}
delete this._loader_dic[a];
this.runLoader();
this.saveToLocalFile(o.filename, n);
}
}.bind(this));
}
},
checkLocalFile: function(e) {
if ("undefined" == typeof jsb) return !1;
var t = jsb.fileUtils.getWritablePath() + "loadImgs/" + e;
return !!jsb.fileUtils.isFileExist(t) && t;
},
saveToLocalFile: function(e, t) {
if ("undefined" != typeof jsb) {
var n = jsb.fileUtils.getWritablePath() + "loadImgs/", i = n + e;
jsb.fileUtils.isDirectoryExist(n) || jsb.fileUtils.createDirectory(n);
var a = new cc.Sprite();
a.spriteFrame = t;
var o = cc.size(Math.floor(a.width), Math.floor(a.height)), s = new cc.RenderTexture(o.width, o.height);
s.setPosition(cc.p(.5 * o.width, .5 * o.height));
a.visit();
s.end();
s.saveToFile(i, cc.IMAGE_FORMAT_JPG);
}
},
saveDataToLocalFile: function(e, t) {
if ("undefined" != typeof jsb) {
var n = jsb.fileUtils.getWritablePath() + "loadImgs/", i = n + e;
jsb.fileUtils.isDirectoryExist(n) || jsb.fileUtils.createDirectory(n);
"undefined" != typeof t ? jsb.fileUtils.writeDataToFile(new Uint8Array(t), i) ? cc.log("Remote write file succeed.") : AppLog.warn("Remote write file failed.") : AppLog.warn("Remote download file failed.");
}
}
}
});
cc._RF.pop();
}, {} ],
Http: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "e8703nRSPhBLYxIjY8zIhuS", "Http");
var l = cc.Class({
extends: cc.Component,
statics: {
_sessionId: 0,
_url: "192.168.0.158:80",
sendReq: function(e, t, n, i) {
var a = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : "GET", o = cc.loader.getXMLHttpRequest();
o.timeout = 5e3;
var s = "?";
for (var r in t) {
"?" != s && (s += "&");
s += r + "=" + t[r];
}
null == i && (i = l._url);
var c = i + e + encodeURI(s);
console.log("#######request url:" + c);
o.open(a, c, !0);
Global.isNative() && o.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
o.onreadystatechange = function() {
l.onReadyStateChanged(o, n);
};
o.send();
return o;
},
onReadyStateChanged: function(e, t) {
if (4 === e.readyState && 200 <= e.status && e.status < 300) {
console.log("http res(" + e.responseText.length + "): " + e.responseText);
try {
var n = JSON.parse(e.responseText);
if (t) t(!0, n); else {
console.log("HTTP is not set callback function!");
t(!1);
}
} catch (e) {
console.log("HTTP Error: " + e);
t(!1);
}
} else {
console.log("Http Error:  readyState: " + e.readyState + "  status: " + e.status);
t(!1);
}
}
}
});
t.exports = l;
cc._RF.pop();
}, {} ],
ImageLoader: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "d869aajTeRDAqB8CJ9d8mN8", "ImageLoader");
cc.Class({
extends: cc.Component,
properties: {
_spriteFrame: null,
_callback: null
},
onLoad: function() {
this.setupSpriteFrame();
},
setUserHeadUrl: function(e, t) {
this._callback = t;
if (e) {
var n, i, a = this;
n = e, i = function(e, t) {
a._spriteFrame = t;
a.setupSpriteFrame();
a._callback(t);
}, cc.loader.load({
url: n,
type: "jpg"
}, function(e, t) {
if (t) {
var n = new cc.SpriteFrame(t, cc.Rect(0, 0, t.width, t.height));
i(e, n);
}
});
}
},
setupSpriteFrame: function() {
if (this._spriteFrame && this.node) {
var e = this.node.getComponent(cc.Sprite);
e && (e.spriteFrame = this._spriteFrame);
}
}
});
cc._RF.pop();
}, {} ],
LoadingTip: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "5ee7d9cnTlKdptplZ2oUA8z", "LoadingTip");
cc.Class({
extends: cc.Component,
properties: {
node_loading: cc.Node,
lbl_tips: cc.Label,
_timeoutTimer_0: null,
_timeoutTimer_1: null,
_isLongShow: !1
},
onLoad: function() {
this.lbl_tips.node.active = !1;
this.node_loading.active = !1;
this.node.position = Global.centerPos;
this.node.active = !1;
cc.vv.LoadingTip = this;
},
start: function() {},
onEnable: function() {
this.node.x = cc.director.getWinSize().width / 2;
this.node.y = cc.director.getWinSize().height / 2;
},
show: function(e, t) {
var n = this;
if (!this._isLongShow) {
this._isLongShow = t;
this.node.active = !0;
if (e && "string" == typeof e) {
this.node_loading.active = !0;
this.lbl_tips.string = e;
this.lbl_tips.node.active = !0;
} else {
null == this._timeoutTimer_0 && (this._timeoutTimer_0 = setTimeout(function() {
n.node_loading.active = !0;
}, 2e3));
if (this._isLongShow) return;
if (this._timeoutTimer_1) {
clearTimeout(this._timeoutTimer_1);
this._timeoutTimer_1 = null;
}
this._timeoutTimer_1 = setTimeout(this.hide.bind(this), 2e4);
}
}
},
hide: function(e, t) {
var n = this, i = function() {
if (!n._isLongShow || t) {
n._isLongShow = !1;
n.node.active = !1;
n.lbl_tips.node.active = !1;
n.node_loading.active = !1;
if (n._timeoutTimer_0) {
clearTimeout(n._timeoutTimer_0);
n._timeoutTimer_0 = null;
}
if (n._timeoutTimer_1) {
clearTimeout(n._timeoutTimer_1);
n._timeoutTimer_1 = null;
}
}
};
e ? this.node.runAction(cc.sequence(cc.delayTime(e), cc.callFunc(i))) : i();
}
});
cc._RF.pop();
}, {} ],
LobbySet: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "5da1dsflgxB0aGvgcTyuGiv", "LobbySet");
cc.Class({
extends: cc.Component,
properties: {
_lobbySetLayer: null
},
start: function() {
Global.registerEvent(EventId.BIND_PHONE, this.onRcvBindPhone, this);
},
showLobbySet: function() {
var n = this;
if (null === this._lobbySetLayer) cc.loader.loadRes("common/prefab/lobby_set", cc.Prefab, function(e, t) {
if (null === e) {
n._lobbySetLayer = cc.instantiate(t);
n._lobbySetLayer.parent = n.node;
n._lobbySetLayer.zIndex = 1;
n._lobbySetLayer.x = n.node.width / 2 - n.node.x;
n._lobbySetLayer.y = n.node.height / 2 - n.node.y;
n.initUI();
n.initShow();
}
}); else {
this._lobbySetLayer.active = !0;
this.initShow();
}
},
initUI: function() {
var e = this._lobbySetLayer.getChildByName("btn_closeSet");
Global.btnClickEvent(e, this.onClose, this);
var t = cc.find("phone_bg/btn_bind", this._lobbySetLayer);
Global.btnClickEvent(t, this.onClickBindPhone, this);
var n = this._lobbySetLayer.getChildByName("btn_switch");
Global.btnClickEvent(n, this.onClickSwitch, this);
var i = this._lobbySetLayer.getChildByName("btn_quitGame");
Global.btnClickEvent(i, this.onClickQuitGame, this);
this.slider_volum = this._lobbySetLayer.getChildByName("slider_volum");
this.slider_volum.on("slide", this.onSliderVolum, this);
this.progressBar_volum = this.slider_volum.getChildByName("progressBar_volum");
var a = this._lobbySetLayer.getChildByName("btn_effect");
Global.btnClickEvent(a, this.setEffct, this);
this.btn_effect_mask = this._lobbySetLayer.getChildByName("btn_effect_mask");
var o = this._lobbySetLayer.getChildByName("btn_music");
Global.btnClickEvent(o, this.setMusic, this);
this.btn_music_mask = this._lobbySetLayer.getChildByName("btn_music_mask");
var s = this._lobbySetLayer.getChildByName("btn_help");
Global.btnClickEvent(s, this.onClickHelp, this);
var r = this._lobbySetLayer.getChildByName("btn_protol");
Global.btnClickEvent(r, this.onClickProtol, this);
var c = this._lobbySetLayer.getChildByName("btn_clean");
Global.btnClickEvent(c, this.onClickClean, this);
this.panel_bind_phone = this._lobbySetLayer.getChildByName("panel_bind_phone");
var l = cc.find("bg_bind_phone/btn_close", this.panel_bind_phone);
Global.btnClickEvent(l, this.onClickBindPhone, this);
this.input_phoneNumStr = cc.find("bg_bind_phone/input_phoneNum", this.panel_bind_phone).getComponent(cc.EditBox);
this.input_codeStr = cc.find("bg_bind_phone/input_code", this.panel_bind_phone).getComponent(cc.EditBox);
this.btn_getCode = cc.find("bg_bind_phone/btn_getCode", this.panel_bind_phone);
Global.btnClickEvent(this.btn_getCode, this.onClickGetCode, this);
this.spr_countDown = this.btn_getCode.getChildByName("spr_countDown");
this.number_countDown = this.spr_countDown.getChildByName("number_countDown").getComponent(cc.Label);
var h = cc.find("bg_bind_phone/btn_confirm", this.panel_bind_phone);
Global.btnClickEvent(h, this.onClickConfirm, this);
},
initShow: function() {
var e = this._lobbySetLayer.getChildByName("node_userinfo"), t = cc.find("UserHead/radio_mask/spr_head", e);
Global.setHead(t, cc.vv.UserManager.userIcon);
e.getChildByName("text_name").getComponent(cc.Label).string = cc.vv.UserManager.nickName;
e.getChildByName("text_id").getComponent(cc.Label).string = "ID: " + cc.vv.UserManager.uid;
cc.find("phone_bg/text_num", this._lobbySetLayer).getComponent(cc.Label).string = cc.vv.UserManager.mobile;
cc.find("phone_bg/btn_bind", this._lobbySetLayer).active = !cc.vv.UserManager.mobile;
this._audioVolue = Number(cc.sys.localStorage.getItem("_audioVolue"));
null == this._audioVolue && (this._audioVolue = 1);
this.slider_volum.getComponent(cc.Slider).progress = this._audioVolue;
this.progressBar_volum.getComponent(cc.ProgressBar).progress = this._audioVolue;
this._effectIsOpen = parseInt(cc.sys.localStorage.getItem("_effectIsOpen"));
null == this._effectIsOpen && (this._effectIsOpen = 1);
this.setOperate(this._effectIsOpen, this.btn_effect_mask);
cc.vv.AudioManager.setEffVolume(this._effectIsOpen ? this._audioVolue : 0);
this._musicIsOpen = parseInt(cc.sys.localStorage.getItem("_musicIsOpen"));
null == this._musicIsOpen && (this._musicIsOpen = 1);
this.setOperate(this._musicIsOpen, this.btn_music_mask);
cc.vv.AudioManager.setBgmVolume(this._musicIsOpen ? this._audioVolue : 0);
this.panel_bind_phone.active = !1;
},
onClose: function() {
this._lobbySetLayer.active = !1;
},
onClickBindPhone: function() {
this.panel_bind_phone.active = !this.panel_bind_phone.active;
if (this.panel_bind_phone.active) {
this.input_phoneNumStr.string = "";
this.input_codeStr.string = "";
this.btn_getCode.getComponent(cc.Button).interactable = !0;
this.spr_countDown.active = !1;
this.number_countDown.string = "";
}
},
onClickGetCode: function() {
var e = this.input_phoneNumStr.string, t = parseInt(e);
if (11 == e.length && t) {
var n = {
c: MsgId.GER_PHONE_CODE
};
n.mobile = t;
cc.vv.NetManager.send(n);
this.btn_getCode.getComponent(cc.Button).interactable = !1;
this.spr_countDown.active = !0;
var i = 90;
this.number_countDown.string = i;
var a = this;
a.btn_getCode.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1), cc.callFunc(function() {
a.number_countDown.string = --i;
if (0 == i) {
a.btn_getCode.getComponent(cc.Button).interactable = !0;
a.spr_countDown.active = !1;
a.btn_getCode.stopAllActions();
}
}))));
} else cc.vv.FloatTip.show("手机号输入错误");
},
onClickConfirm: function() {
var e = this.input_phoneNumStr.string, t = parseInt(e), n = this.input_codeStr.string;
if (11 == e.length && t && 6 == n.length) {
var i = {
c: MsgId.BIND_PHONE
};
i.mobile = t;
i.code = n;
cc.vv.NetManager.send(i);
}
},
onRcvBindPhone: function(e) {
200 === e.code && this.onClose();
},
onClickSwitch: function() {
cc.vv.NetManager.send({
c: MsgId.LOGIN_OUT
});
cc.vv.NetManager.close();
Global.noAutoLogin = !0;
cc.vv.SceneMgr.enterScene("login");
},
onClickQuitGame: function() {
var e = cc.vv.Language.request_quit;
cc.vv.AlertView.show(e, function() {
cc.game.end();
}, function() {});
},
onSliderVolum: function(e) {
this._audioVolue = Math.floor(100 * e.detail.progress) / 100;
this.slider_volum.getComponent(cc.Slider).progress = this._audioVolue;
this.progressBar_volum.getComponent(cc.ProgressBar).progress = this._audioVolue;
cc.sys.localStorage.setItem("_audioVolue", this._audioVolue);
this._effectIsOpen && cc.vv.AudioManager.setEffVolume(this._audioVolue);
this._musicIsOpen && cc.vv.AudioManager.setBgmVolume(this._audioVolue);
},
setEffct: function() {
this._effectIsOpen = 0 == this._effectIsOpen ? 1 : 0;
this.setOperate(this._effectIsOpen, this.btn_effect_mask);
cc.sys.localStorage.setItem("_effectIsOpen", this._effectIsOpen);
cc.vv.AudioManager.setEffVolume(this._effectIsOpen ? this._audioVolue : 0);
},
setMusic: function() {
this._musicIsOpen = 0 == this._musicIsOpen ? 1 : 0;
this.setOperate(this._musicIsOpen, this.btn_music_mask);
cc.sys.localStorage.setItem("_musicIsOpen", this._musicIsOpen);
cc.vv.AudioManager.setBgmVolume(this._musicIsOpen ? this._audioVolue : 0);
},
setOperate: function(e, t) {
t.x = 0 == e ? 55 : 140;
},
onClickHelp: function() {},
onClickProtol: function() {},
onClickClean: function() {},
onDestroy: function() {
cc.vv.NetManager.unregisterMsg(MsgId.BIND_PHONE, this.onRcvBindPhone, !1, this);
this._lobbySetLayer && cc.loader.releaseRes("common/prefab/lobby_set", cc.Prefab);
}
});
cc._RF.pop();
}, {} ],
Lobby: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "cce2fkSN6hEsrT0otSSB/TE", "Lobby");
cc.Class({
extends: cc.Component,
properties: {
_effectIsOpen: 1,
_musicIsOpen: 1,
_audioVolue: 1,
_numList: [],
_inputIndex: 0,
_numLength: 6,
numAtlas: cc.SpriteAtlas
},
onLoad: function() {
cc.vv.gameData && cc.vv.gameData.clear();
this.node.parent.name = "lobby";
Global.autoAdaptDevices(!1);
var e = cc.find("head_bg/UserHead/radio_mask/spr_head", this.node);
Global.setHead(e, cc.vv.UserManager.userIcon);
cc.find("gps/label_city", this.node).getComponent(cc.Label).string = cc.vv.UserManager.GpsCity;
var t = cc.find("bg_dialogue/mask/text_dialogue", this.node);
t.x = 120;
t.runAction(cc.repeatForever(cc.sequence(cc.moveTo(6, cc.v2(-300, t.y)), cc.callFunc(function() {
t.x = 120;
}))));
var n = cc.find("right_list/scrollview/view/content/item", this.node);
Global.btnClickEvent(n, this.onClickCreateRoom, this);
cc.find("head_bg/UserHead/name", this.node).getComponent(cc.Label).string = cc.vv.UserManager.nickName;
cc.find("head_bg/id", this.node).getComponent(cc.Label).string = cc.vv.UserManager.uid;
cc.find("money_bg/gold_num", this.node).getComponent(cc.Label).string = cc.vv.UserManager.coin;
cc.find("room_bg/roomcard_num", this.node).getComponent(cc.Label).string = cc.vv.UserManager.roomcard;
var i = this.node.getChildByName("notHaveClub_btn");
Global.btnClickEvent(i, this.onToClubLobby, this);
var a = this.node.getChildByName("haveClub_btn");
Global.btnClickEvent(a, this.onClub, this);
var o = this.node.getChildByName("moreClub_btn");
Global.btnClickEvent(o, this.onToClubLobby, this);
i.active = 0 == cc.vv.UserManager.clubs.length;
a.active = 0 < cc.vv.UserManager.clubs.length;
o.active = 0 < cc.vv.UserManager.clubs.length;
if (0 < cc.vv.UserManager.clubs.length) {
var s = a.getChildByName("info");
this.initClub(s);
}
var r = cc.find("dt_xmt/share_btn", this.node);
Global.btnClickEvent(r, this.onClickShare, this);
this.panel_share = this.node.getChildByName("panel_share");
this.panel_share.active = !1;
var c = cc.find("share_bg/btn_shareToSession", this.panel_share);
Global.btnClickEvent(c, this.onClickShareToSession, this);
var l = cc.find("share_bg/btn_shareToTimeline", this.panel_share);
Global.btnClickEvent(l, this.onClickShareToTimeline, this);
var h = cc.find("dt_xmt/history_btn", this.node);
Global.btnClickEvent(h, this.onClickHistory, this);
this.initJoinGame();
this.CreateRoomJS = this.node.getComponent("CreateRoom");
this.node.addComponent("GameRecord");
this.GameRecordJS = this.node.getComponent("GameRecord");
this.node.addComponent("LobbySet");
this.LobbySetJS = this.node.getComponent("LobbySet");
var d = cc.find("dt_xmt/setting_btn", this.node);
Global.btnClickEvent(d, this.onClickSet, this);
Global.playBgm(Global.SOUNDS.bgm_hall);
Global.registerEvent(EventId.SELF_GPS_DATA, this.onRecvSelfGpsData, this);
},
onClickHistory: function() {
this.GameRecordJS.showGameRecord();
},
onClickCreateRoom: function() {
this.CreateRoomJS.showCreateRoom(!1);
},
onClickSet: function() {
this.LobbySetJS.showLobbySet();
},
initJoinGame: function() {
var e = this.node.getChildByName("btn_join_game");
Global.btnClickEvent(e, this.onClickJoinGame, this);
this.panel_join_game = this.node.getChildByName("panel_join_game");
this.panel_join_game.active = !1;
var t = cc.find("bg/btn_close", this.panel_join_game);
Global.btnClickEvent(t, this.onCloseJoinClub, this);
for (var n = 0; n < 10; ++n) {
var i = cc.find("bg/btn_number" + n, this.panel_join_game);
i._index = n;
Global.btnClickEvent(i, this.inputNum, this);
}
var a = cc.find("bg/btn_delete", this.panel_join_game);
Global.btnClickEvent(a, this.onDelete, this);
var o = cc.find("bg/btn_reset", this.panel_join_game);
Global.btnClickEvent(o, this.onReset, this);
for (var s = 0; s < this._numLength; ++s) {
var r = cc.find("bg/num" + s, this.panel_join_game).getChildByName("num");
r.active = !1;
this._numList.push(r);
}
},
onClickJoinGame: function() {
this.panel_join_game.active = !0;
this.onReset();
},
onCloseJoinClub: function() {
this.panel_join_game.active = !1;
},
inputNum: function(e) {
if (this._inputIndex < this._numLength) {
var t = e.target._index;
this._numList[this._inputIndex].active = !0;
this._numList[this._inputIndex].getComponent(cc.Sprite).spriteFrame = this.numAtlas.getSpriteFrame("hallClub-img-member-img-img_" + t);
this._numList[this._inputIndex]._index = t;
++this._inputIndex;
if (this._inputIndex >= this._numLength) {
for (var n = "", i = 0; i < this._numLength; ++i) n += this._numList[i]._index;
var a = {
c: MsgId.GAME_JOINROOM
};
a.deskId = n;
cc.vv.NetManager.send(a);
}
}
},
onReset: function() {
for (var e = this._inputIndex = 0; e < this._numList.length; ++e) {
this._numList[e].active = !1;
this._numList[e]._index = -1;
}
},
onDelete: function() {
--this._inputIndex;
this._inputIndex < 0 && (this._inputIndex = 0);
if (0 <= this._inputIndex) {
this._numList[this._inputIndex].active = !1;
this._numList[this._inputIndex]._index = -1;
}
},
onRecvSelfGpsData: function(e) {
cc.find("gps/label_city", this.node).getComponent(cc.Label).string = e.detail.city;
},
initClub: function(e) {
var t = cc.find("users_bg/curr_num", e), n = cc.find("users_bg/total_num", e), i = cc.find("users_bg/tabel_num", e);
t.getComponent(cc.Label).string = cc.vv.UserManager.clubs[0].onlineNum;
n.getComponent(cc.Label).string = "/" + cc.vv.UserManager.clubs[0].count;
i.getComponent(cc.Label).string = cc.vv.UserManager.clubs[0].gamedeskNum;
e.getChildByName("club_name").getComponent(cc.Label).string = cc.vv.UserManager.clubs[0].name;
},
onClub: function() {
0 < cc.vv.UserManager.clubs.length && (cc.vv.UserManager.currClubId = cc.vv.UserManager.clubs[0].clubid);
cc.vv.SceneMgr.enterScene(0 < cc.vv.UserManager.clubs.length ? "club" : "club_lobby");
},
onToClubLobby: function() {
cc.vv.SceneMgr.enterScene("club_lobby");
},
onClickShare: function() {
this.panel_share.active = !this.panel_share.active;
},
onClickShareToSession: function() {
this.onShareToWx(Global.ShareSceneType.WXSceneSession);
},
onClickShareToTimeline: function() {
this.onShareToWx(Global.ShareSceneType.WXSceneTimeline);
},
onShareToWx: function(e) {
Global.onWXShareLink(e, "闲去游戏邀请", "点击进入闲去游戏下载", Global.iconUrl, Global.shareLink);
},
start: function() {},
onDestroy: function() {}
});
cc._RF.pop();
}, {} ],
Md5: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "cf119bz6SlOELlpweyrZmfc", "Md5");
t.exports = function(e) {
function t(e, t, n) {
return e & t | ~e & n;
}
function n(e, t, n) {
return n & e | ~n & t;
}
function i(e, t, n) {
return e ^ t ^ n;
}
function a(e, t, n) {
return t ^ (e | ~n);
}
function o(e, t) {
return e[t + 3] << 24 | e[t + 2] << 16 | e[t + 1] << 8 | e[t];
}
if (!e instanceof Uint8Array) {
(function(e) {
try {
console.log(e);
} catch (e) {}
})("input data type mismatch only support Uint8Array");
return null;
}
for (var s = [], r = 0; r < e.byteLength; r++) s.push(e[r]);
var c = s.length;
s.push(128);
var l = s.length % 64;
if (56 < l) {
for (r = 0; r < 64 - l; r++) s.push(0);
l = s.length % 64;
}
for (r = 0; r < 56 - l; r++) s.push(0);
s = s.concat(function(e) {
for (var t = [], n = 0; n < 8; n++) {
t.push(255 & e);
e >>>= 8;
}
return t;
}(8 * c));
var h = 1732584193, d = 4023233417, u = 2562383102, g = 271733878, _ = 0, f = 0, v = 0, p = 0;
function m(e, t) {
return 4294967295 & e + t;
}
var b = function(e, t, n, i) {
var a, o, s = p;
p = v;
f = m(v = f, (a = m(_, m(e, m(t, n)))) << (o = i) & 4294967295 | a >>> 32 - o);
_ = s;
};
for (r = 0; r < s.length / 64; r++) {
_ = h;
var C = 64 * r;
b(t(f = d, v = u, p = g), 3614090360, o(s, C), 7);
b(t(f, v, p), 3905402710, o(s, C + 4), 12);
b(t(f, v, p), 606105819, o(s, C + 8), 17);
b(t(f, v, p), 3250441966, o(s, C + 12), 22);
b(t(f, v, p), 4118548399, o(s, C + 16), 7);
b(t(f, v, p), 1200080426, o(s, C + 20), 12);
b(t(f, v, p), 2821735955, o(s, C + 24), 17);
b(t(f, v, p), 4249261313, o(s, C + 28), 22);
b(t(f, v, p), 1770035416, o(s, C + 32), 7);
b(t(f, v, p), 2336552879, o(s, C + 36), 12);
b(t(f, v, p), 4294925233, o(s, C + 40), 17);
b(t(f, v, p), 2304563134, o(s, C + 44), 22);
b(t(f, v, p), 1804603682, o(s, C + 48), 7);
b(t(f, v, p), 4254626195, o(s, C + 52), 12);
b(t(f, v, p), 2792965006, o(s, C + 56), 17);
b(t(f, v, p), 1236535329, o(s, C + 60), 22);
b(n(f, v, p), 4129170786, o(s, C + 4), 5);
b(n(f, v, p), 3225465664, o(s, C + 24), 9);
b(n(f, v, p), 643717713, o(s, C + 44), 14);
b(n(f, v, p), 3921069994, o(s, C), 20);
b(n(f, v, p), 3593408605, o(s, C + 20), 5);
b(n(f, v, p), 38016083, o(s, C + 40), 9);
b(n(f, v, p), 3634488961, o(s, C + 60), 14);
b(n(f, v, p), 3889429448, o(s, C + 16), 20);
b(n(f, v, p), 568446438, o(s, C + 36), 5);
b(n(f, v, p), 3275163606, o(s, C + 56), 9);
b(n(f, v, p), 4107603335, o(s, C + 12), 14);
b(n(f, v, p), 1163531501, o(s, C + 32), 20);
b(n(f, v, p), 2850285829, o(s, C + 52), 5);
b(n(f, v, p), 4243563512, o(s, C + 8), 9);
b(n(f, v, p), 1735328473, o(s, C + 28), 14);
b(n(f, v, p), 2368359562, o(s, C + 48), 20);
b(i(f, v, p), 4294588738, o(s, C + 20), 4);
b(i(f, v, p), 2272392833, o(s, C + 32), 11);
b(i(f, v, p), 1839030562, o(s, C + 44), 16);
b(i(f, v, p), 4259657740, o(s, C + 56), 23);
b(i(f, v, p), 2763975236, o(s, C + 4), 4);
b(i(f, v, p), 1272893353, o(s, C + 16), 11);
b(i(f, v, p), 4139469664, o(s, C + 28), 16);
b(i(f, v, p), 3200236656, o(s, C + 40), 23);
b(i(f, v, p), 681279174, o(s, C + 52), 4);
b(i(f, v, p), 3936430074, o(s, C), 11);
b(i(f, v, p), 3572445317, o(s, C + 12), 16);
b(i(f, v, p), 76029189, o(s, C + 24), 23);
b(i(f, v, p), 3654602809, o(s, C + 36), 4);
b(i(f, v, p), 3873151461, o(s, C + 48), 11);
b(i(f, v, p), 530742520, o(s, C + 60), 16);
b(i(f, v, p), 3299628645, o(s, C + 8), 23);
b(a(f, v, p), 4096336452, o(s, C), 6);
b(a(f, v, p), 1126891415, o(s, C + 28), 10);
b(a(f, v, p), 2878612391, o(s, C + 56), 15);
b(a(f, v, p), 4237533241, o(s, C + 20), 21);
b(a(f, v, p), 1700485571, o(s, C + 48), 6);
b(a(f, v, p), 2399980690, o(s, C + 12), 10);
b(a(f, v, p), 4293915773, o(s, C + 40), 15);
b(a(f, v, p), 2240044497, o(s, C + 4), 21);
b(a(f, v, p), 1873313359, o(s, C + 32), 6);
b(a(f, v, p), 4264355552, o(s, C + 60), 10);
b(a(f, v, p), 2734768916, o(s, C + 24), 15);
b(a(f, v, p), 1309151649, o(s, C + 52), 21);
b(a(f, v, p), 4149444226, o(s, C + 16), 6);
b(a(f, v, p), 3174756917, o(s, C + 44), 10);
b(a(f, v, p), 718787259, o(s, C + 8), 15);
b(a(f, v, p), 3951481745, o(s, C + 36), 21);
h = m(h, _);
d = m(d, f);
u = m(u, v);
g = m(g, p);
}
return function(e, t, n, i) {
for (var a, o, s, r = "", c = 0, l = 0, h = 3; 0 <= h; h--) {
c = 255 & (l = arguments[h]);
c <<= 8;
c |= 255 & (l >>>= 8);
c <<= 8;
c |= 255 & (l >>>= 8);
c <<= 8;
r += (o = ((a = c |= l >>>= 8) >>> 24).toString(16), s = (16777215 & a).toString(16), 
"00".substr(0, 2 - o.length) + o + "000000".substr(0, 6 - s.length) + s);
}
return r;
}(g, u, d, h).toLowerCase();
};
cc._RF.pop();
}, {} ],
MsgIdDef: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "c8460wa37hDmJVmIyKt6G6R", "MsgIdDef");
var i = cc.Class({
extends: cc.Component,
statics: {}
});
(window.MsgId = i).HEARTBEAT = 11, i.LOGIN = 1;
i.LOGIN_USERID = 2;
i.RELOGIN_USERID = 3;
i.LOGIN_OUT = 12, i.SYNC_COIN = 29, i.GAME_FIELDS_LIST = 30;
i.BIND_INVITE_CODE = 28;
i.PURCHASE_AGENT_LIST = 50;
i.PURCHASE_GOODS_LIST = 51;
i.FEEDBACK_COMMIT = 52;
i.MESSAGE_SYSTEM = 53;
i.MODIFY_INFO = 54;
i.IDENTITY_PERSONAL = 55;
i.TOTAL_RANK_LIST = 56;
i.HALL_SPEAKER_LIST = 59;
i.EMAIL_LIST = 60;
i.EMAIL_READ = 61;
i.PERSIONAL_INFO = 62;
i.EMAIL_RECEIVE = 63;
i.COMMIT_REPORT = 64;
i.AC_RESERVE_COIN = 72;
i.AC_RESERVE_TAKE_LIMIT = 73;
i.BIND_ACCOUNT = 74;
i.GET_BOUNS = 75;
i.GET_ONLINE_BOUNS_STATUS = 76;
i.GET_TASK_LIST = 77;
i.RECEIVE_REWARD = 78;
i.TODAY_RANK_LIST = 79;
i.ACTIVITY_LIST = 80;
i.ACTIVITY_GET_FIVE_STAR = 81;
i.ACT_COMMIT_FIVE_STAR = 82;
i.ACT_INVITE_GIFT_LIST = 83;
i.MODIFY_NICKNAME = 84;
i.SEND_CHAT = 85;
i.GET_CHAT_LIST = 86;
i.BIND_ACCOUNT_WX = 87;
i.BIG_CHARGE_ANGENT = 88;
i.BIG_CHARGE_BACKLIST = 89;
i.BIG_CHARGE_ORDER = 90;
i.BIG_CHARGE_REBACKWARD = 91;
i.BIG_CHARGE_REWARD_CORD = 92;
i.AGENT_REWARD_DATA = 93;
i.AGENT_REWARD_REBACKWARD = 94;
i.HALL_VERSOIN = 96;
i.AGENT_REWARD_STATIC = 97;
i.BANK_LOGIN = 100;
i.BANK_HALL_INFO = 101;
i.BANK_SAVE_COIN = 102;
i.BANK_TAKE_COIN = 103;
i.BANK_RECORD_LIST = 104;
i.BANK_MODIFY_PW = 105;
i.BANK_EXIT = 106;
i.BANK_TAKE_INGAME = 107;
i.NICKNAME_INCLUCE_ILLEGAL_CHARACTER = 1073;
i.NICKNAME_HAD_USED = 1074;
i.RECONNECT = 68;
i.PURCHASE_GET_ORDER = 70;
i.PURCHASE_CHECK_ORDER = 71;
i.PURCHASE_RECHARGE_SUC = 1035;
i.REWARD_ONLINE = 1036;
i.TASK_FINISH_NOTICE = 1037;
i.POP_FIVE_STAR_NOTICE = 1038;
i.MONEY_CHANGED = 1010;
i.GAME_REMOTE_LOGIN = 1017;
i.GAME_NEED_RESTART = 801;
i.GAME_FIELDS_LIST_ROOMLIST = 34;
i.GAME_CREATEROOM = 31;
i.GAME_JOINROOM = 32;
i.GAME_LEVELROOM = 40;
i.GAME_ENTER_MATCH = 43;
i.RELIEF_FUND = 99;
i.ENTER_CASINO = 120;
i.EXIT_CASINO = 121;
i.NOTIFY_SYS_MAINTENANCE = 100049;
i.NOTIFY_SYS_KICK_HALL = 100050;
i.NOTIFY_SYS_KICK_LOGIN = 100054;
i.GLOBAL_SPEAKER_NOTIFY = 100055;
i.SEND_CHAT_NOTICE = 100056;
i.PLAYER_LEAVE = 1016;
i.SYNC_PLAYER_INFO = 100057;
i.GAME_RECONNECT_DESKINFO = 99e3;
i.GAME_ENTER_BACKGROUND = 9900;
i.SCORE_LOG = 27;
i.MODIFY_PSW = 26;
i.GAME_LIST = 100059;
i.JACKTPOT_HALL = 121202;
i.JACKPOT_GAME = 121203;
i.NOTIFY_KICK = 100906;
i.REQ_REDPACK = 7100;
i.OPEN_REDPACK = 7101;
i.REQ_LUCKRAIN = 7102;
i.REQ_GROWUPDATA = 130;
i.REQ_LUCKBOX = 131;
i.REQ_LUCKBOX_REWARD = 132;
i.REQ_AGENT_INFO = 135;
i.REQ_TRANSFER = 142;
i.REQ_MODIFY_CHARGE_PSW = 136;
i.REQ_WITHDRAWAL = 137;
i.REQ_WITHDRAWAL_RECORD = 138;
i.REQ_AGENTLIST = 139;
i.REQ_TRANSFER_RECORD = 140;
i.REQ_FAV_CHANGE = 150;
i.RESET_PSW = 143;
i.GAME_SITDOWN = 901;
i.GAME_SITDOWN_NOTICE = 100901;
i.GAME_STANDUP = 52;
i.GAME_STANDUP_NOTICE = 100908;
i.GAME_BET = 37;
i.GAME_BET_NOTICE = 100505;
i.NOTIFY_TIGER_START = 100500;
i.NOTIFY_TIGER_START_BET = 100501;
i.NOTIFY_TIGER_STOP_BET = 100502;
i.NOTIFY_TIGER_OPEN_CARD = 100503;
i.NOTIFY_TIGER_OVER_GAME = 100504;
i.TABLE_LIST = 54;
i.CHANGE_TABLE = 55;
i.ROOM_LIST = 56;
i.HISTORY_LIST = 57;
i.CHAT = 112;
i.CHAT_NOTICE = 100112;
i.GET_PLAYINFO = 113;
i.GET_EXCHANGE = 133;
i.DS_CONTROL = 114;
i.DS_CONTROL_NOTIFY = 100510;
i.DS_PLAYERLIST = 122;
i.DS_OPEN_REDPACKET = 115;
i.DS_SHOW_REDPACKET = 123;
i.ROOM_LEAVE = 63;
i.NN_ROOM_LIST = 64;
i.ENVELOPEGET = 152;
i.ENVELOPEGETNOTES = 153;
i.ENVELOPEINFO = 154;
i.GETBANKANDCOIN = 155;
i.BANKCASH = 156;
i.BANKDEBITS = 157;
i.ALTERBANKPASSWD = 158;
i.BANK_RECORD = 159;
i.SHOP_INFO = 160;
i.BUY_GOODS = 161;
i.WATCH_AD = 162;
i.CREATECULB = 8801;
i.JOINCULB = 8802;
i.AGREECULB = 8803;
i.GETCLUBEONLINEUSERS = 8804;
i.ADDGAME = 8805;
i.MODIFGAME = 8806;
i.ENTERCLUB = 8807;
i.GETCLUBLIST = 8808;
i.CLUBNOTICE = 8809;
i.ALLAGREE = 8810;
i.REJECTJOINCLUB = 8811;
i.SEATDOWN = 8812;
i.READY = 35;
i.NOTICE_JOINCLUB = 18803;
i.NOTICE_ADDNEWTABLE = 18804;
i.NOTICE_TABLEINFO = 18805;
i.NOTICE_READY = 2e3;
i.NOTICE_PLAYER_ENTER = 1003;
i.NOTICE_PLAYER_EXIT = 1016;
i.SENDCARD = 1006;
i.OUTCARD = 1401;
i.MOPAI = 1402;
i.PENG = 1403;
i.GANG = 1404;
i.HU = 1405;
i.GUO = 1407;
i.CANCELTUOGUAN = 1408;
i.CHI = 1409;
i.NOTIFY_SHOW_ACTION = 101400;
i.NOTIFY_OUTCARD = 101401;
i.NOTIFY_MOPAI = 101402;
i.NOTIFY_PENG = 101403;
i.NOTIFY_GANG = 101404;
i.NOTIFY_HU = 101405;
i.NOTIFY_OUTCARD_ERROR = 101406;
i.NOTIFY_HZ_LIUJU = 101407;
i.NOTIFY_NOTIFY_GUO = 101408;
i.NOTIFY_TUOGUAN_SUCEESS = 101409;
i.NOTIFY_HZ_PAO = 101411;
i.NOTIFY_HZ_KAN = 101412;
i.NOTIFY_HZ_TILONG = 101413;
i.NOTIFY_CHI = 101410;
i.NOTIFY_GAME_OVER = 101415;
i.NOTIFY_DELETE_TABLE = 18808;
i.DEL_HANDCARD = 101416;
i.CHAT = 112;
i.CHAT_NOTIFY = 2006;
i.OFFLINE_NOTIFY = 2009;
i.SELF_GPS_DATA = 163;
i.PLAYER_DISTANCE_DATA = 8813;
i.GPS_TIPS_NOTIFY = 18809;
i.GAME_RECORD = 165;
i.ROUND_RECORD = 166;
i.APPLY_DISMISS = 65;
i.AGREE_DISMISS = 66;
i.REFUSE_DISMISS = 67;
i.APPLY_DISMISS_NOTIFY = 1019;
i.AGREE_DISMISS_NOTIFY = 1020;
i.REFUSE_DISMISS_NOTIFY = 1021;
i.SUCCESS_DISMISS_NOTIFY = 1023;
i.GER_PHONE_CODE = 164;
i.BIND_PHONE = 124;
cc._RF.pop();
}, {} ],
NetErrorCode: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "f89ecZOFulJJq94nw9XQp0U", "NetErrorCode");
var i;
function a(e, t, n) {
t in e ? Object.defineProperty(e, t, {
value: n,
enumerable: !0,
configurable: !0,
writable: !0
}) : e[t] = n;
return e;
}
e("GlobalVar").code = (a(i = {
201: "已注册",
202: "未注册",
203: "err_id_psw",
204: "该账号已被其他用户注册",
205: "两次密码不一致",
206: "账号包含敏感词",
207: "昵称包含敏感词",
213: "err_psw",
208: "login_fail_again",
400: "call_back_error",
401: "数据库错误",
402: "permission_denied",
403: "认证失败",
404: "重连索引过期",
405: "login_fail_again",
406: "login_frequently",
407: "acc_online",
408: "解析protocbuf错误",
409: "user_already_exists",
410: "operate_err",
411: "已经存在角色",
412: "acc_banned",
422: "account_forbid",
423: "in_table",
427: "red_packet_limit",
430: "login_err",
436: "distance_less200",
437: "forbid_same_ip",
500: "login_fail_again",
501: "物品不足",
502: "该用户已准备",
503: "游戏未开始",
504: "跟注错误",
505: "比牌失败",
506: "已经加入",
507: "已经加入",
508: "不能跟自己比牌",
509: "用户已退出",
510: "口令错误",
511: "游戏已经开始",
512: "游戏已经结束",
513: "房间人数已满",
514: "未设置底注",
515: "未在桌子上",
516: "看牌错误",
517: "加入错误",
518: "离开",
519: "wait_exit",
520: "创建游戏信息有误",
606: "error_operate",
610: "coins_lack",
611: "您已经是庄家了",
612: "coins_lack",
613: "band_aren",
619: "该房间正在结算，请稍后",
700: "room_id_non_existent",
710: "enter_game",
720: "房卡不足",
803: "system_maintenance_tips",
804: "transfer_failed",
805: "已经弃牌",
806: "跟注失败",
807: "下注金额错误",
898: "operate_limit",
899: "庄家不能下注",
900: "庄已存在",
901: "没选庄",
902: "没下注",
903: "没准备",
904: "牌数据错误",
905: "出牌不在手牌中",
906: "不能执行此操作",
907: "没开启中途加入不能准备",
908: "没坐下",
909: "wait_next_round",
910: "下注方位错误",
911: "龙虎方位不能同时下注",
912: "field_limit",
913: "房间不允许中途加入",
914: "用户未准备",
915: "未找到该座位用户",
916: "倍数超范围",
917: "底注超范围",
918: "离场金币错误",
919: "入场金币错误",
920: "类型错误",
921: "玩家不在房间内",
922: "have_sit_down",
923: "房间人数已满",
924: "此座位已经有人",
925: "不是房主",
926: "有人没准备",
927: "玩家人数不足",
928: "服务器房间数不够",
929: "体验币不足",
930: "权限不足，无法创建!",
936: "金币不足，无法创建房间!",
940: "微信登录失败",
8928: "出牌操作错误",
9929: "玩家已退出",
9930: "摊牌异常",
9931: "非房主不能执行该操作",
1e3: "房间数据异常",
1404: "未找到该商品",
1405: "下单失败，请稍后再试",
1406: "您不能同时下注2个方位",
1407: "自己不能举报自己哟",
1408: "请补充完资料后再提交",
1409: "操作过于频繁，请歇一会再来",
1450: "操作失败，请稍后再试",
1051: "本轮投注额已满",
1052: "请勿重复提交",
1057: "您是庄家，不能下注哟",
1065: "只能在空闲时间内下庄哦",
1066: "当前档位金币不足",
1067: "此房间不允许中途加入哦",
1068: "绑定账号验证信息失败",
1069: "绑定账号获取用户信息失败",
1070: "此账号已经绑定过，不能重复绑定",
1071: "系统已存在此FB账号",
1072: "此任务还未完成",
1073: "包含非法字，请重新修改",
1074: "昵称已被使用",
1075: "发送频率过于频繁，请稍后",
1076: "没有发送权限",
1077: "金币不足，无法上庄，请充值！",
1080: "剩余金币须大于50万才能下注",
1081: "wait_next_round",
1082: "此账号已经绑定过微信，不能重复绑定",
1083: "绑定微信验证失败",
1084: "绑定微信获取信息失败",
1085: "系统已存在此微信账号",
1387: "剩余金币须大于50万才能下注",
1089: "该任务已关闭",
1090: "not_down_banker",
1091: "庄家只能在空闲时间内退出",
10005: "正在努力加载中...",
10001: "subgame_is_over",
209: "param_nil",
210: "illegal_parameter",
211: "invalid_token",
416: "lock_5_second",
417: "lock_10_second",
418: "lock_20_second",
419: "lock_600_second",
420: "system_maintenance_tips",
421: "sub_account_prohibits",
433: "亲友圈ID不存在",
950: "account_exist",
951: "email_exist",
952: "invalid_promoter_code",
953: "email_failed_to_send",
954: "invalid_pin",
955: "account_not_exits",
956: "commission_not_enough",
957: "password_error",
958: "transfer_failure",
959: "available_to_upline_and_downline",
960: "account_too_short",
961: "account_must_filled",
962: "password_must_filled",
963: "promoter_code_error",
214: "need_update",
425: "captcha_timeout",
426: "limit_red"
}, "9929", "table_not_sit"), a(i, "428", "bind_err"), a(i, "429", "bind_mobile_already"), 
a(i, "434", "该玩法已存在!"), a(i, "964", "envelope_not_enough"), a(i, "965", "envelope_already_get"), 
a(i, "811", "bank_coin_not_enough"), a(i, "812", "bank_passwd_error"), i);
cc._RF.pop();
}, {
GlobalVar: "GlobalVar"
} ],
NetManager: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "cf88bwpkb1Blb7NwHCu7Dl2", "NetManager");
var s = null;
cc.Class({
extends: cc.Component,
statics: {
_address: "",
_hearBeatTimeout: 5e3,
_hearBeatInterval: 5e3,
_lastReplyInterval: 50,
_curReplyInterval: 0,
_ws: null,
_hearBeatIntervalIdx: null,
_nextAutoConnectDelay: 0,
_autoConnectCount: 0,
_autoConnectCountMax: 5,
_curtime: 0,
_fnDisconnect: null,
_handlers: {},
_handlersHigh: {},
_Http: e("Http"),
_msgPack: e("msgpack.min"),
_idx: 0,
_isClose: !1,
pingSpeed: 0,
pingTime: 0,
sendPingNum: 0,
_webSocketMgr: null,
init: function() {
s = this;
new Date();
this._webSocketMgr = e("WebsocketMgr");
this._webSocketMgr.init(this.handleResponeData.bind(this));
this.registerMsg(MsgId.HEARTBEAT, this.pong.bind(this));
},
registerMsg: function(e, t, n, i) {
if (null != e && null != e) if (null != t && null != t) {
var a = {
_fn: t,
_tgt: n
}, o = String(e);
if (i && "boolean" == typeof i) {
this._handlersHigh[o] = this._handlersHigh[o] || [];
for (var s = 0; s < this._handlersHigh[o].length; s++) {
var r = this._handlersHigh[o][s]._tgt;
if (this._handlersHigh[o][s]._fn === t && n === r) {
cc.warn("The Highcmd:" + e + "==>fn has registered!");
return;
}
}
this._handlersHigh[o].push(a);
} else {
this._handlers[o] = this._handlers[o] || [];
for (var c = 0; c < this._handlers[o].length; c++) {
var l = this._handlers[o][c]._fn, h = this._handlers[o][c]._tgt;
if (l === t && n === h) {
cc.warn("The cmd:" + e + "==>fn has registered!");
return;
}
}
this._handlers[o].push(a);
}
} else AppLog.warn("fn must be not null and not undefined"); else AppLog.warn("cmd must be not null and not undefined");
},
findSameFuncAdrr: function(e, t) {
for (var n = 0, i = 0; i < e.length; ++i) t === e[i]._fn && ++n;
return n;
},
unregisterMsg: function(e, t) {
var n = 2 < arguments.length && void 0 !== arguments[2] && arguments[2], i = arguments[3];
if (null != e && null != e) {
var a = String(e);
if (n && "boolean" == typeof n) if (t && "function" == typeof t && this._handlersHigh[a]) for (var o = this.findSameFuncAdrr(this._handlersHigh[a], t), s = 0; s < this._handlersHigh[a].length; s++) {
if (this._handlersHigh[a][s]._fn === t) {
if (!(1 < o)) {
AppLog.log("unregisterHighMsg: ", e, "=>function");
this._handlersHigh[a].splice(s, 1);
break;
}
if (null == i) AppLog.err("请传入需要注销的消息的target"); else {
if (this._handlersHigh[a][s]._tgt === i) {
AppLog.log("unregisterHighMsg: ", e, "=>function");
this._handlersHigh[a].splice(s, 1);
break;
}
}
}
} else {
AppLog.log("unregisterMsg: ", e);
delete this._handlersHigh[a];
} else if (t && "function" == typeof t && this._handlers[a]) {
var r = this.findSameFuncAdrr(this._handlers[a], t);
for (s = 0; s < this._handlers[a].length; s++) {
if (this._handlers[a][s]._fn === t) {
if (!(1 < r)) {
AppLog.log("unregisterHighMsg: ", e, "=>function");
this._handlers[a].splice(s, 1);
break;
}
if (null == i) AppLog.err("请传入需要注销的消息的target"); else {
if (this._handlers[a][s]._tgt === i) {
AppLog.log("unregisterHighMsg: ", e, "=>function");
this._handlers[a].splice(s, 1);
break;
}
}
}
}
} else {
AppLog.log("unregisterMsg: ", e);
delete this._handlers[a];
}
}
},
dispatchNetMsg: function(e) {
"string" == typeof e && (e = JSON.parse(e));
this.handleMsg(e);
AppLog.log("客户端主动分发网络消息", JSON.stringify(e));
},
handleMsg: function(e) {
var t = e.c;
if (t) {
var n = String(t), i = this._handlersHigh[n];
if (i) for (var a = i.length - 1; 0 <= a; a--) {
if ((s = i[a])._tgt) {
if (s._fn.bind(s._tgt)(e)) break;
} else if (s._fn(e)) break;
}
var o = this._handlers[n];
if (!o) {
i || AppLog.warn("Received msg cmd:" + t + " has no handlers");
return;
}
for (a = o.length - 1; 0 <= a; a--) {
var s;
if ((s = o[a])._tgt) {
if (s._fn.bind(s._tgt)(e)) break;
} else if (s._fn(e)) break;
}
e.c != MsgId.HEARTBEAT && cc.vv.LoadingTip && cc.vv.LoadingTip.hide(.5);
if (e.code && 200 != e.code && 2e4 != e.code && !this.handleCommonErrorCode(e.code)) {
203 === e.code && Global.dispatchEvent(EventId.RELOGIN);
if (214 === e.code) cc.vv.AlertView.showTips(cc.vv.Language[Global.code[e.code.toString()]], function() {
Global.dispatchEvent(EventId.STOP_ACTION);
cc.vv.NetManager.close();
Global.isNative() && cc.vv.SceneMgr.enterScene("hotupdate");
}.bind(this)); else if (cc.vv.Language[Global.code[e.code.toString()]]) cc.vv.FloatTip.show(cc.vv.Language[Global.code[e.code.toString()]]); else {
var r = Global.code[e.code.toString()];
r ? cc.vv.FloatTip.show(r) : cc.vv.FloatTip.show("error code:" + e.code.toString());
}
}
} else AppLog.warn("Received msg is has not the cmd！");
},
handleCommonErrorCode: function(e) {
var t = this;
switch (e) {
case 415:
cc.vv.FloatTip.show(cc.vv.Language.reconnect);
cc.vv.GameManager.reqReLogin();
break;

case 500:
cc.vv.AlertView.show(cc.vv.Language.login_fail_again, function() {
cc.vv.GameManager.reqReLogin();
}, function() {
Global.dispatchEvent(EventId.STOP_ACTION);
cc.vv.SceneMgr.enterScene("login", function() {
t.close();
});
});
break;

case 801:
cc.vv.AlertView.showTips(cc.vv.Language.new_ver, function() {
cc.audioEngine.stopAll();
cc.game.restart();
});
break;

case 803:
this.no_need_reconnect = !0;
Global.dispatchEvent(EventId.STOP_ACTION);
if ("login" != cc.director.getScene().name) {
cc.vv.GameManager.goBackLoginScene();
cc.vv.AlertView.showTips(cc.vv.Language.system_maintenance_tips);
} else {
this.close();
cc.vv.AlertView.showTips(cc.vv.Language.system_maintenance_tips);
}
break;

case 804:
Global.showAd();
Global.dispatchEvent(EventId.SHOW_SHOP);
break;

case 211:
cc.vv.UserManager.setIsAutoLogin(!1);
Global.dispatchEvent(EventId.RELOGIN);
cc.vv.AlertView.showTips(cc.vv.Language.invalid_token, function() {
cc.vv.SceneMgr.enterScene("login", function() {
t.close();
});
});
break;

case 425:
case 203:
cc.vv.GameManager.clearLocalSaveAccout();
cc.vv.FloatTip.show(cc.vv.Language.err_id_psw);
break;

case 931:
cc.vv.GameManager.reqReLogin();
break;

default:
return !1;
}
return !0;
},
handleResponeData: function(e) {
var t = function(e) {
for (var t = new DataView(e), n = (t.getUint8(0), t.getUint8(1), new Uint8Array(e.byteLength - 8)), i = 0; i < n.length; i++) n[i] = t.getUint8(8 + i);
var a = s._msgPack.decode(n);
if (Global.localVersion) {
var o = JSON.stringify(a);
o = o.replace(/[\'\"\\\/\b\f\n\r\t]/g, "");
AppLog.log("Recieved: ", o);
}
s.handleMsg(JSON.parse(a));
n = t = null;
};
if (window.FileReader && e instanceof Blob) {
var n = new FileReader();
n.addEventListener("loadend", function() {
t(n.result);
});
n.readAsArrayBuffer(e);
} else {
AppLog.warn("Not supported FileReader by your browser or devices");
t(e);
}
},
connect: function(e, t) {
var n = "ws://", i = Global.isUserWSS();
i && (n = "wss://");
var a = "";
Global.isAndroid() && i ? (a = n + e + "/ws", cc.url.raw("resources/common/cert.pem")) : a = n + e + "/ws";
this._webSocketMgr.connect(a, !0, t);
AppLog.log("连接服务" + this._address + "中...");
cc.vv.LoadingTip.show(cc.vv.Language.network_connecting);
},
pong: function() {
this._webSocketMgr.setReceiveHeadMsg();
},
isConnect: function() {
return this._webSocketMgr.isConnect();
},
close: function() {
this._webSocketMgr.closeNetWork(!0);
},
getPingLevel: function() {
return -1 == this.pingSpeed ? 0 : this.pingSpeed < 50 ? 4 : this.pingSpeed < 150 ? 3 : this.pingSpeed < 300 ? 2 : this.pingSpeed < 500 ? 1 : 0;
},
sendHeartbeat: function() {
this.send({
c: MsgId.HEARTBEAT
}, !0);
},
send: function(e) {
1 < arguments.length && void 0 !== arguments[1] && arguments[1];
if (3 == this._webSocketMgr.getNetWorkState()) {
if (null != e && "string" == typeof e && null == (e = JSON.parse(e)).c) {
AppLog.warn("The msg msgDic is lost cmd");
return;
}
e.c_idx = this._idx++;
Global.playerData.uid && (e.uid = Global.playerData.uid);
if (Global.localVersion) {
var t = JSON.stringify(e);
t = t.replace(/[\'\\\/\b\f\n\r\t]/g, "");
AppLog.log("send:: ", t);
}
var n = this.pack(JSON.stringify(e)), i = this.generateHead(n), a = this.linkHeadBody(i, n);
this._webSocketMgr.sendMsg(a);
a = null;
} else AppLog.warn("The WebSocket is not connected!");
},
requestHttp: function(e, t, n, i) {
var a = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : "GET";
this._Http.sendReq(e, t, n, i, a);
},
pack: function(e) {
return this._msgPack.encode(e);
},
generateHead: function(e) {
var t = e.length, n = Global.jsToCByShort(t), i = Global.jsToCByInt(Math.floor(this._curtime / 1e3)), a = Global.jsToCByShort(e.c);
return "" + n + this.getCheckSum(i + a, t, e) + i;
},
linkHeadBody: function(e, t) {
for (var n = e.length, i = t.length, a = new Uint8Array(n + i), o = 0; o < n; o++) a[o] = e.charCodeAt(o);
for (o = 0; o < i; o++) a[n + o] = t[o];
return a;
},
getCheckSum: function(e, t, n) {
var i = "", a = e.length + t;
i = a < 128 ? Global.srcSum(e + n, a) : Global.srcSum(e + n, 128);
return Global.jsToCByShort(i);
},
getNetworkInterval: function() {
return this._lastReplyInterval;
},
getNetworkLevel: function() {
var e = 0;
this._lastReplyInterval <= 100 ? e = 3 : this._lastReplyInterval <= 500 ? e = 2 : this._lastReplyInterval <= 1e3 && (e = 1);
return e;
}
}
});
cc._RF.pop();
}, {
Http: "Http",
WebsocketMgr: "WebsocketMgr",
"msgpack.min": "msgpack.min"
} ],
PayMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "c3e43Zo3DVGQ7TtEvAaCxzg", "PayMgr");
cc.Class({
extends: cc.Component,
statics: {
init: function() {
this.registerAllMsg();
},
registerAllMsg: function() {
cc.vv.NetManager.registerMsg(MsgId.PURCHASE_CHECK_ORDER, this.onRcvMsgCheckOrder.bind(this));
},
sendCheckOrder: function(e) {
cc.vv.LoadingTip.hide(.1, !0);
var t = null;
if (Global.isAndroid()) {
if ("1" === e.result) {
var n = e.message, i = e.signature;
e.pid;
(t = {
c: MsgId.PURCHASE_CHECK_ORDER
}).orderid = "";
t.platform = 1;
t.data = n;
t.sign = i;
} else {
var a = e.errInfo;
cc.vv.FloatTip.show(a);
}
} else if (Global.isIOS()) {
var o = e.receipt, s = e.orderid;
(t = {
c: MsgId.PURCHASE_CHECK_ORDER
}).orderid = s;
t.platform = 2;
t.data = o;
t.sign = "";
}
t && cc.vv.NetManager.send(t);
},
doReplaceOrder: function() {
if (Global.isIOS()) {
cc.vv.PlatformApiMgr.addCallback(this.paySdkReplacementCallback.bind(this), "paySdkReplacementCallback");
cc.vv.PlatformApiMgr.SdkReplaceOrder("");
}
},
onRcvMsgCheckOrder: function(e) {
if (200 === e.code && Global.isIOS()) {
var t = {};
t.Flag = e.flag;
t.OrderId = e.orderid;
cc.vv.PlatformApiMgr.SdkDelOrderCache(JSON.stringify(t));
}
},
paySdkReplacementCallback: function(e) {
this.sendCheckOrder(e);
}
}
});
cc._RF.pop();
}, {} ],
PengHu_Action: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "68009LQcaZFBYxBxXkyLr7T", "PengHu_Action");
cc.Class({
extends: cc.Component,
properties: {
_paoNode: null,
_tiNode: null,
_chiNode: null,
_pengNode: null,
_huNode: null,
_weiNode: null,
_shaoNode: null
},
start: function() {
var e = this;
this._paoNode = cc.find("scene/action/pao", this.node);
this._tiNode = cc.find("scene/action/ti", this.node);
this._chiNode = cc.find("scene/action/chi", this.node);
this._pengNode = cc.find("scene/action/peng", this.node);
this._huNode = cc.find("scene/action/hu", this.node);
this._weiNode = cc.find("scene/action/wei", this.node);
this._shaoNode = cc.find("scene/action/shao", this.node);
this._huNode.getComponent(cc.Animation).on("finished", function() {
e._huNode.active = !1;
});
this.clearDesk();
Global.registerEvent(EventId.CLEARDESK, this.clearDesk, this);
Global.registerEvent(EventId.CHI_NOTIFY, this.recvAction, this);
Global.registerEvent(EventId.PENG_NOTIFY, this.recvAction, this);
Global.registerEvent(EventId.PAO_NOTIFY, this.recvAction, this);
Global.registerEvent(EventId.LONG_NOTIFY, this.recvAction, this);
Global.registerEvent(EventId.KAN_NOTIFY, this.recvAction, this);
Global.registerEvent(EventId.HU_NOTIFY, this.recvHuAction, this);
},
recvHuAction: function(e) {
-1 < (e = e.detail).hupaiType && this.showAction(e.seat, cc.vv.gameData.OPERATETYPE.HU);
},
recvAction: function(e) {
e = e.detail;
this.showAction(e.actionInfo.curaction.seat, e.actionInfo.curaction.type);
},
showAction: function(e, t) {
var n = cc.vv.gameData.getLocalChair(e) + 1;
2 === cc.vv.gameData.getPlayerNum() && 2 === n && (n = 3);
this._paoNode.active = t === cc.vv.gameData.OPERATETYPE.PAO;
this._tiNode.active = t === cc.vv.gameData.OPERATETYPE.LONG;
this._chiNode.active = t === cc.vv.gameData.OPERATETYPE.CHI;
this._pengNode.active = t === cc.vv.gameData.OPERATETYPE.PENG;
this._huNode.active = t === cc.vv.gameData.OPERATETYPE.HU;
this._weiNode.active = t === cc.vv.gameData.OPERATETYPE.WEI;
this._shaoNode.active = t === cc.vv.gameData.OPERATETYPE.SHE;
var i = cc.find("scene/action/player" + n, this.node), a = null;
t === cc.vv.gameData.OPERATETYPE.PAO ? a = this._paoNode : t === cc.vv.gameData.OPERATETYPE.LONG ? a = this._tiNode : t === cc.vv.gameData.OPERATETYPE.CHI ? a = this._chiNode : t === cc.vv.gameData.OPERATETYPE.PENG ? a = this._pengNode : t === cc.vv.gameData.OPERATETYPE.HU ? a = this._huNode : t === cc.vv.gameData.OPERATETYPE.WEI ? a = this._weiNode : t === cc.vv.gameData.OPERATETYPE.SHE && (a = this._shaoNode);
if (a) {
t !== cc.vv.gameData.OPERATETYPE.HU ? a.position = cc.v2(0, i.y) : a.position = cc.v2(i.x, i.y);
a.getComponent(cc.Animation).play("show");
}
},
clearDesk: function() {
this._paoNode.active = !1;
this._tiNode.active = !1;
this._chiNode.active = !1;
this._pengNode.active = !1;
this._huNode.active = !1;
this._weiNode.active = !1;
this._shaoNode.active = !1;
}
});
cc._RF.pop();
}, {} ],
PengHu_Card: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "a6cdeAVpn5LLJnxx63iBgT6", "PengHu_Card");
cc.Class({
extends: cc.Component,
properties: {
_value: 0,
_atlas: null
},
init: function(e) {
this._atlas = e;
},
createCard: function(e, t) {
var n = 2 < arguments.length && void 0 !== arguments[2] && arguments[2], i = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null, a = null;
i ? a = i : (a = new cc.Node()).addComponent(cc.Sprite);
var o = (this._value = e) % 100, s = "";
if (n) {
0 === t ? s = "hongheihu-imgs-cards-card_back_big" : 1 === t ? s = "hongheihu-imgs-cards-card_black_middle" : 2 === t && (s = "hongheihu-imgs-cards-card_black_small");
a.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(s);
} else {
0 === t ? s = 200 < e ? "hongheihu-imgs-cards-b_fp_card" : "hongheihu-imgs-cards-s_fp_card" : 1 === t ? s = 200 < e ? "hongheihu-imgs-cards-b_card" : "hongheihu-imgs-cards-s_card" : 2 === t && (s = 200 < e ? "hongheihu-imgs-cards-b_s_card" : "hongheihu-imgs-cards-s_s_card");
a.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(s + o);
}
a.cardValue = e;
a.active = !0;
return a;
},
changCardBg: function(e, t) {
e.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(t ? "hongheihu-imgs-cards-card_light" : "hongheihu-imgs-cards-card_light2");
},
start: function() {}
});
cc._RF.pop();
}, {} ],
PengHu_Chat: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "4bf43f6kYZEbKMPxsNSptFs", "PengHu_Chat");
cc.Class({
extends: cc.Component,
properties: {
_chatNode: null,
_isLoad: !1
},
start: function() {
Global.registerEvent(EventId.SHOW_CHAT, this.showChat, this);
},
showChat: function() {
var h = this;
if (!this._isLoad) if (null === this._chatNode) {
this._isLoad = !0;
cc.loader.loadRes("common/prefab/FaceChatLayer", cc.Prefab, function(e, t) {
if (null === e) {
h._chatNode = cc.instantiate(t);
h._chatNode.parent = h.node;
h._chatNode.x = -h.node.width / 2;
h._chatNode.y = -h.node.height / 2;
h._chatNode.zIndex = 3;
for (var n = 1; n < 13; ++n) {
var i = cc.find("img_bg/img_bg_bq/btn_bq_" + n, h._chatNode);
i._index = n - 1;
i.on(cc.Node.EventType.TOUCH_END, h.onSelectEmjo, h);
}
for (var a = cc.find("img_bg/img_bg_txt/scrollview/view/content", h._chatNode), o = Global.getShortList(), s = 0, r = 0; r < o.length; ++r) {
var c = null;
r < a.childrenCount ? c = a.children[r] : (c = cc.instantiate(a.children[0])).parent = a;
c._index = r;
c.y = a.children[0].y - c.height * r;
c.getComponent(cc.Label).string = o[r];
c.on(cc.Node.EventType.TOUCH_END, h.onSelectShort, h);
s += c.height;
}
a.height = s;
var l = cc.find("img_bg/btn_close", h._chatNode);
Global.btnClickEvent(l, h.onClose, h);
h._isLoad = !1;
}
});
} else this._chatNode.active = !0;
},
onClose: function() {
this._chatNode.active = !1;
},
onSelectShort: function(e) {
var t = e.target._index;
this.sendMsg(2, t);
},
onSelectEmjo: function(e) {
var t = e.target._index;
this.sendMsg(1, t);
},
sendMsg: function(e, t) {
var n = {
type: e,
index: t,
seat: cc.vv.gameData.getMySeatIndex()
}, i = {
c: MsgId.CHAT
};
i.chatInfo = n;
cc.vv.NetManager.send(i);
this.onClose();
},
onDestroy: function() {
this._chatNode && cc.loader.releaseRes("common/prefab/FaceChatLayer", cc.Prefab);
}
});
cc._RF.pop();
}, {} ],
PengHu_GameData: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "68da927ZGlOto8ruikUsnoS", "PengHu_GameData");
cc.Class({
extends: cc.Component,
properties: {
_deskInfo: null,
_seatIndex: -1,
_playerNum: 4,
_actionTime: .3
},
clear: function() {
this.unregisterMsg();
cc.vv.gameData = null;
},
getActionTime: function() {
return this._actionTime;
},
getLocalChair: function(e) {
var t = this._seatIndex;
-1 == t && (t = 0);
return (e - t + this._playerNum) % this._playerNum;
},
init: function(e) {
this.OPERATETYPE = {
GU0: 1,
PUT: 2,
MOPAI: 3,
CHI: 4,
PENG: 5,
KAN: 6,
LONG: 8,
SHE: 9,
PAO: 7,
HU: 10,
PENGSAN: 11,
KANSAN: 12,
PENGSI: 13,
KANSI: 14
}, this.registerMsg();
this._deskInfo = e;
1 === this._deskInfo.conf.speed && (this._actionTime = .15);
this._playerNum = this._deskInfo.conf.seat;
for (var t = 0; t < this._deskInfo.users.length; ++t) if (this._deskInfo.users[t].uid === cc.vv.UserManager.uid) {
this._seatIndex = this._deskInfo.users[t].seat;
break;
}
},
getPlayerNum: function() {
return this._playerNum;
},
registerMsg: function() {
cc.vv.NetManager.registerMsg(MsgId.GAME_LEVELROOM, this.onRcvNetExitRoom, this);
cc.vv.NetManager.registerMsg(MsgId.GAME_RECONNECT_DESKINFO, this.onRecvNetReconnectDeskinfo, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_KICK, this.onRcvNetKickNotice, this);
cc.vv.NetManager.registerMsg(MsgId.MONEY_CHANGED, this.onRcvNetMoneyChanged, this);
cc.vv.NetManager.registerMsg(MsgId.SENDCARD, this.onRcvHandCard, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_OUTCARD, this.onRcvOutCardNotify, this);
cc.vv.NetManager.registerMsg(MsgId.NOTICE_PLAYER_ENTER, this.onRcvPlayerComeNotice, this);
cc.vv.NetManager.registerMsg(MsgId.NOTICE_PLAYER_EXIT, this.onRcvPlayerExitNotice, this);
cc.vv.NetManager.registerMsg(MsgId.OUTCARD, this.onRcvOutCardReslut, this);
cc.vv.NetManager.registerMsg(MsgId.CHI, this.onRcvChiResult, this);
cc.vv.NetManager.registerMsg(MsgId.PENG, this.onRcvPengResult, this);
cc.vv.NetManager.registerMsg(MsgId.GUO, this.onRcvGuoResult, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HZ_PAO, this.onRcvPaoNotfiy, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HZ_KAN, this.onRcvKanNotfiy, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HZ_TILONG, this.onRcvLongNotfiy, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_CHI, this.onRcvChiNotfiy, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_PENG, this.onRcvPengNotfiy, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_NOTIFY_GUO, this.onRcvGuoNotfiy, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_MOPAI, this.onRcvMoPaiNotfiy, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_HU, this.onRcvHuNotfiy, this);
cc.vv.NetManager.registerMsg(MsgId.NOTIFY_GAME_OVER, this.onRcvGameOverNotfiy, this);
cc.vv.NetManager.registerMsg(MsgId.CHAT_NOTIFY, this.onRcvChatNotify, this);
cc.vv.NetManager.registerMsg(MsgId.DEL_HANDCARD, this.onRcvDelHandcardNotify, this);
cc.vv.NetManager.registerMsg(MsgId.NOTICE_READY, this.onRcvReadyNotice, this);
cc.vv.NetManager.registerMsg(MsgId.OFFLINE_NOTIFY, this.onRcvOfflineNotice, this);
cc.vv.NetManager.registerMsg(MsgId.PLAYER_DISTANCE_DATA, this.onRcvPlayersDistanceData, this);
cc.vv.NetManager.registerMsg(MsgId.GPS_TIPS_NOTIFY, this.onRcvGpsTipsNotify, this);
cc.vv.NetManager.registerMsg(MsgId.APPLY_DISMISS_NOTIFY, this.onRcvDismissNotify, this);
cc.vv.NetManager.registerMsg(MsgId.AGREE_DISMISS_NOTIFY, this.onRcvDismissNotify, this);
cc.vv.NetManager.registerMsg(MsgId.REFUSE_DISMISS_NOTIFY, this.onRcvDismissNotify, this);
cc.vv.NetManager.registerMsg(MsgId.SUCCESS_DISMISS_NOTIFY, this.onRcvDismissNotify, this);
},
unregisterMsg: function() {
cc.vv.NetManager.unregisterMsg(MsgId.GAME_LEVELROOM, this.onRcvNetExitRoom, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.GAME_RECONNECT_DESKINFO, this.onRecvNetReconnectDeskinfo, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_KICK, this.onRcvNetKickNotice, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.MONEY_CHANGED, this.onRcvNetMoneyChanged, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.SENDCARD, this.onRcvHandCard, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_OUTCARD, this.onRcvOutCardNotify, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_PLAYER_ENTER, this.onRcvPlayerComeNotice, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_PLAYER_EXIT, this.onRcvPlayerExitNotice, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.OUTCARD, this.onRcvOutCardReslut, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.CHI, this.onRcvChiResult, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.PENG, this.onRcvPengResult, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.GUO, this.onRcvPengResult, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HZ_PAO, this.onRcvPaoNotfiy, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HZ_KAN, this.onRcvKanNotfiy, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HZ_TILONG, this.onRcvLongNotfiy, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_CHI, this.onRcvChiNotfiy, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_PENG, this.onRcvPengNotfiy, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_NOTIFY_GUO, this.onRcvGuoNotfiy, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_MOPAI, this.onRcvMoPaiNotfiy, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_HU, this.onRcvHuNotfiy, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTIFY_GAME_OVER, this.onRcvGameOverNotfiy, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.CHAT_NOTIFY, this.onRcvChatNotify, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.DEL_HANDCARD, this.onRcvDelHandcardNotify, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_READY, this.onRcvReadyNotice, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.OFFLINE_NOTIFY, this.onRcvOfflineNotice, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.PLAYER_DISTANCE_DATA, this.onRcvPlayersDistanceData, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.GPS_TIPS_NOTIFY, this.onRcvGpsTipsNotify, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.APPLY_DISMISS_NOTIFY, this.onRcvDismissNotify, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.AGREE_DISMISS_NOTIFY, this.onRcvDismissNotify, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.REFUSE_DISMISS_NOTIFY, this.onRcvDismissNotify, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.SUCCESS_DISMISS_NOTIFY, this.onRcvDismissNotify, !1, this);
},
onRcvDismissNotify: function(e) {
200 == e.code && Global.dispatchEvent(EventId.DISMISS_NOTIFY, e);
},
onRcvPlayersDistanceData: function(e) {
200 == e.code && Global.dispatchEvent(EventId.PLAYER_DISTANCE_DATA, e);
},
onRcvGpsTipsNotify: function(e) {
200 == e.code && Global.dispatchEvent(EventId.GPS_TIPS_NOTIFY, e);
},
onRcvOfflineNotice: function(e) {
200 == e.code && Global.dispatchEvent(EventId.OFFLINE_NOTIFY, e);
},
onRcvReadyNotice: function(e) {
200 == e.code && Global.dispatchEvent(EventId.READY_NOTIFY, e);
},
onRcvDelHandcardNotify: function(e) {
200 === e.code && Global.dispatchEvent(EventId.DEL_HANDCARD_NOTIFY, e);
},
onRcvChatNotify: function(e) {
200 === e.code && Global.dispatchEvent(EventId.CHAT_NOTIFY, e);
},
getWanFa: function() {
var e = [], t = this._deskInfo.conf;
e.push(t.gamenum + "局 ");
e.push(t.seat + "人 ");
0 === t.param1 ? e.push("连中 ") : 1 === t.param1 ? e.push("中庄x2 ") : 2 === t.param1 && e.push("四首相乘 ");
e.push(t.score + "倍 ");
1 === t.speed && e.push("快速 ");
t.trustee && e.push("托管 ");
t.ipcheck && e.push("同IP禁止进入 ");
t.distance && e.push("距离相近200米禁止加入 ");
return e;
},
onRcvGameOverNotfiy: function(e) {
200 === e.code && Global.dispatchEvent(EventId.GAMEOVER, e);
},
sortCard: function(e) {
var t = e.slice(0);
t.sort(function(e, t) {
return e - t;
});
for (var n = [], i = -1, a = [], o = 0; o < t.length; ++o) if (i !== t[o]) {
if (2 < a.length) {
n.push(a);
for (var s = 1; s <= a.length; ++s) t[o - s] = -1;
}
a = [ t[o] ];
i = t[o];
} else a.push(t[o]);
for (var r = [], c = 0; c < t.length; ++c) -1 < t[c] && r.push(t[c]);
r.sort(function(e, t) {
return e % 100 - t % 100;
});
i = -1;
for (var l = 0; l < r.length; ++l) if (i !== r[l] % 100) {
n.length < 10 && (a = [ r[l] ]);
n.push(a);
i = r[l] % 100;
} else if (2 < a.length) {
n.length < 10 && (a = [ r[l] ]);
n.push(a);
} else a.push(r[l]);
return n;
},
onRcvHuNotfiy: function(e) {
200 === e.code && Global.dispatchEvent(EventId.HU_NOTIFY, e);
},
onRcvMoPaiNotfiy: function(e) {
200 === e.code && Global.dispatchEvent(EventId.MOPAI_NOTIFY, e);
},
onRcvPaoNotfiy: function(e) {
200 === e.code && Global.dispatchEvent(EventId.PAO_NOTIFY, e);
},
onRcvKanNotfiy: function(e) {
200 === e.code && Global.dispatchEvent(EventId.KAN_NOTIFY, e);
},
onRcvLongNotfiy: function(e) {
200 === e.code && Global.dispatchEvent(EventId.LONG_NOTIFY, e);
},
onRcvChiNotfiy: function(e) {
200 === e.code && Global.dispatchEvent(EventId.CHI_NOTIFY, e);
},
onRcvPengNotfiy: function(e) {
200 === e.code && Global.dispatchEvent(EventId.PENG_NOTIFY, e);
},
onRcvGuoNotfiy: function(e) {
200 === e.code && Global.dispatchEvent(EventId.GUO_NOTIFY, e);
},
onRcvChiResult: function(e) {
e.code;
},
onRcvPengResult: function(e) {
e.code;
},
onRcvGuoResult: function(e) {
e.code;
},
onRcvOutCardReslut: function(e) {
e.code;
},
onRcvOutCardNotify: function(e) {
200 === e.code && Global.dispatchEvent(EventId.OUTCARD_NOTIFY, e);
},
onRcvHandCard: function(e) {
200 === e.code && Global.dispatchEvent(EventId.HANDCARD, e);
},
onRecvNetReconnectDeskinfo: function(e) {
if (200 === e.code) {
this._deskInfo = e.deskInfo;
Global.dispatchEvent(EventId.GAME_RECONNECT_DESKINFO, e);
}
},
onRcvPlayerComeNotice: function(e) {
if (200 === e.code) {
this._deskInfo.users.push(e.user);
Global.dispatchEvent(EventId.PLAYER_ENTER, e.user);
}
},
onRcvPlayerLeaveNotice: function(e) {
if (200 === e.code) {
for (var t = this._deskInfo.users, n = 0; n < t.length; ++n) if (e.seat === t[n].seat) {
t.splice(n, 1);
break;
}
Global.dispatchEvent(EventId.PLAYER_EXIT, e.seat);
}
},
onRcvPlayerExitNotice: function(e) {
e.code;
},
onRcvNetKickNotice: function(e) {
e.code;
},
onRcvNetExitRoom: function(e) {
if (200 === e.code) {
cc.vv.UserManager.currClubId = this._deskInfo.conf.clubid;
this.clear();
cc.vv.gameData = null;
cc.vv.SceneMgr && (cc.vv.UserManager.currClubId ? cc.vv.SceneMgr.enterScene("club") : cc.vv.SceneMgr.enterScene("lobby"));
}
},
getMySeatIndex: function() {
return this._seatIndex;
},
getDeskInfo: function() {
return this._deskInfo;
},
getUserInfo: function(e) {
for (var t = 0; t < this._deskInfo.users.length; ++t) if (this._deskInfo.users[t].seat === e) return this._deskInfo.users[t];
return null;
},
getUsers: function() {
return this._deskInfo.users;
},
getRoomConf: function() {
return this._deskInfo.conf;
},
getUserSeatIndex: function(e) {
for (var t = -1, n = this.getUsers(), i = 0; i < n.length; ++i) {
if (cc.vv.gameData.getLocalChair(n[i].seat) === e) {
t = n[i].seat;
break;
}
}
return t;
},
exitGame: function() {
var e = {
c: MsgId.GAME_LEVELROOM
};
e.deskid = this._deskInfo.conf.deskId;
cc.vv.NetManager.send(e);
},
outCard: function(e) {
var t = {
c: MsgId.OUTCARD
};
t.card = e;
cc.vv.NetManager.send(t);
},
peng: function() {
var e = {
c: MsgId.PENG
};
cc.vv.NetManager.send(e);
},
pass: function() {
var e = {
c: MsgId.GUO
};
cc.vv.NetManager.send(e);
},
chi: function(e) {
var t = {
c: MsgId.CHI
};
t.chi = e;
cc.vv.NetManager.send(t);
},
start: function() {}
});
cc._RF.pop();
}, {} ],
PengHu_GameOver: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "3dfcc6ii/xACZdpXAWPNgzb", "PengHu_GameOver");
cc.Class({
extends: cc.Component,
properties: {
_gameOverNode: null,
_loseBgSpr: null,
_winBgSpr: null,
_show: !1
},
init: function(e) {
this._atlas = e;
},
start: function() {
Global.registerEvent(EventId.GAMEOVER, this.recvGameOver, this);
Global.registerEvent(EventId.SHOW_GAMEOVER, this.recvShowGameOver, this);
},
recvShowGameOver: function() {
this._show = !0;
this._gameOverNode && (this._gameOverNode.active = !0);
},
recvGameOver: function(h) {
var d = this;
h = h.detail;
cc.loader.loadRes("common/prefab/gameOverView", function(e, t) {
if (null === e) {
d._gameOverNode = cc.instantiate(t);
d._gameOverNode.active = d._show;
d._gameOverNode.zIndex = 1;
d._gameOverNode.parent = d.node.getChildByName("scene");
d._gameOverNode.x = d.node.width / 2;
d._gameOverNode.y = d.node.height / 2;
d._winBgSpr = cc.find("game_end_bg/player0/img_bg", d._gameOverNode).getComponent(cc.Sprite).spriteFrame;
d._loseBgSpr = cc.find("game_end_bg/player1/img_bg", d._gameOverNode).getComponent(cc.Sprite).spriteFrame;
var n = d._gameOverNode.getChildByName("btn_back");
Global.btnClickEvent(n, d.onBack, d);
var i = d._gameOverNode.getChildByName("btn_share");
Global.btnClickEvent(i, d.onShare, d);
d._gameOverNode.getChildByName("room_id").getComponent(cc.Label).string = cc.vv.gameData.getRoomConf().deskId;
d._gameOverNode.getChildByName("txt_end_time").getComponent(cc.Label).string = h.overTime;
var a = cc.find("game_end_bg/creator", d._gameOverNode), o = cc.find("radio_mask/spr_head", a);
Global.setHead(o, h.createUser.usericon);
a.getChildByName("name").getComponent(cc.Label).string = h.createUser.playername;
a.getChildByName("id").getComponent(cc.Label).string = "ID:" + h.createUser.uid;
var s = h.users.slice(0);
s.sort(function(e, t) {
return t.dianPaoCount - e.dianPaoCount;
});
var r = h.users.slice(0);
r.sort(function(e, t) {
return t.score - e.score;
});
for (var c = 0; c < 4; ++c) {
var l = cc.find("game_end_bg/player" + c, d._gameOverNode);
if (c < h.users.length) {
d.initPlayer(l, h.users[c], 0 < s[0].dianPaoCount ? s[0].uid : 0, r[0].uid);
l.active = !0;
} else l.active = !1;
2 === cc.vv.gameData.getPlayerNum() && (0 === c ? l.x = -180 : 1 === c && (l.x = 280));
}
}
});
},
onShare: function() {
Global.onWXShareImage(Global.ShareSceneType.WXSceneSession);
},
onBack: function() {
cc.vv.gameData && cc.vv.gameData.exitGame();
},
initPlayer: function(e, t, n, i) {
if (e) {
e.getChildByName("txt_name").getComponent(cc.Label).string = t.playername;
e.getChildByName("txt_id").getComponent(cc.Label).string = "ID:" + t.uid;
var a = e.getChildByName("img_bg");
a.getComponent(cc.Sprite).spriteFrame = 0 <= t.score ? this._winBgSpr : this._loseBgSpr;
a.getChildByName("title_hu_num").getComponent(cc.Sprite).spriteFrame = 0 < t.score ? this._atlas.getSpriteFrame("penghu_onwer-table-imgs-win_hu_num") : this._atlas.getSpriteFrame("penghu_onwer-table-imgs-lose_hu_num");
a.getChildByName("title_zhongzhuang_num").getComponent(cc.Sprite).spriteFrame = 0 < t.score ? this._atlas.getSpriteFrame("penghu_onwer-table-imgs-win_zhongzhuang_num") : this._atlas.getSpriteFrame("penghu_onwer-table-imgs-lose_zhongzhuang_num");
a.getChildByName("title_dianpao_num").getComponent(cc.Sprite).spriteFrame = 0 < t.score ? this._atlas.getSpriteFrame("penghu_onwer-table-imgs-win_dianpao_num") : this._atlas.getSpriteFrame("penghu_onwer-table-imgs-lose_dianpao_num");
a.getChildByName("hu_num").getComponent(cc.Label).string = t.huPaiCount;
a.getChildByName("zhongzhuang_num").getComponent(cc.Label).string = t.zhongZhangCount;
a.getChildByName("dianpao_num").getComponent(cc.Label).string = t.dianPaoCount;
var o = t.score + "";
o < 0 && (o = "/" + -o);
a.getChildByName("score").getComponent(cc.Label).string = o;
e.active = !0;
e.getChildByName("flag_dianpao").active = t.uid === n;
e.getChildByName("flag_dayingjia").active = t.uid === i;
var s = e.getChildByName("head"), r = cc.find("radio_mask/spr_head", s);
Global.setHead(r, t.usericon);
if (cc.vv.UserManager.uid === t.uid) {
cc.find("game_end_bg/win_title", this._gameOverNode).active = 0 <= t.score;
cc.find("game_end_bg/lose_title", this._gameOverNode).active = t.score < 0;
}
}
},
onDestroy: function() {
this._gameOverNode && cc.loader.releaseRes("common/prefab/gameOverView", cc.Prefab);
}
});
cc._RF.pop();
}, {} ],
PengHu_HandCard: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "e480bxsINNFKKU/qTjzjoee", "PengHu_HandCard");
cc.Class({
extends: cc.Component,
properties: {
_handcardNode: null,
_num: 0,
_cardBox: [],
_selectCard: null,
_outCardY: 0,
_startPosX: null,
_canOutCard: !1,
_cardBoXPos: null,
_handCards: [],
_handCardData: null,
_canTouch: !0,
_outCardLineNode: null
},
init: function(e, t) {
var n = null;
0 === e ? n = cc.find("scene/handleCardView", this.node) : 1 === e ? n = cc.find("scene/playback_handle/left_user", this.node) : 2 === e ? n = cc.find("scene/playback_handle/top_user", this.node) : 3 === e && (n = cc.find("scene/playback_handle/right_user", this.node));
var i = cc.find("scene/cardBox", this.node);
this._cardBoXPos = i.parent.convertToWorldSpaceAR(i.position);
this._cardBoXPos.x -= 8;
this._cardBoXPos.y += 24;
if (4 === (this._playerNum = t)) {
this._handcardNode = n;
this._chairId = e;
} else if (0 == e || 2 == e) {
this._handcardNode = n;
this._chairId = 0 < e ? 1 : 0;
}
this.initCardBox();
if (this._handcardNode) {
this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);
if (-1 < this._seatIndex) {
var a = cc.vv.gameData.getUserInfo(this._seatIndex);
if (a.handInCards && 0 < a.handInCards.length) for (var o = cc.vv.gameData.sortCard(a.handInCards), s = 0; s < o.length; ++s) this.showCard(o[s], o.length);
}
}
if (0 === this._chairId) {
var r = cc.find("scene/sp_out_tips_line", this.node);
this._outCardLineNode = r;
this._outCardLineNode.active = !1;
this._outCardY = this._handcardNode.convertToNodeSpaceAR(r.parent.convertToWorldSpaceAR(r.position)).y;
this.checkCanOutCard();
}
},
checkCanOutCard: function(e) {
if (0 === this._chairId) {
cc.vv.gameData.getMySeatIndex() === e ? this._canOutCard = !0 : this._canOutCard = !1;
this._outCardLineNode.active = this._canOutCard;
}
},
showCard: function(e, t) {
for (var n = 2 < arguments.length && void 0 !== arguments[2] && arguments[2], i = 0; i < e.length; ++i) {
var a = this.node.getComponent("PengHu_Card").createCard(e[i], 0 == this._chairId ? 1 : 2);
a.name = "card";
if (0 === this._chairId) {
a.y = (a.height - 22) * i + .5 * a.height - 25;
a.addComponent(cc.Button);
a.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
a.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
a.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
a.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
if (n) {
var o = new cc.Node();
o.addComponent(cc.Sprite);
this.node.getComponent("PengHu_Card").createCard(0, 1, !0, o);
o.parent = a;
o.name = "bg";
}
} else a.y = a.height * i + .5 * a.height;
0 === this._chairId ? a.x = .5 * this._handcardNode.parent.width - .5 * t * a.width + a.width * this._num - 20 : a.x = a.width * this._num;
3 === this._chairId && (a.x = -a.width * this._num);
a.parent = this._handcardNode;
a.zIndex = 4 - i;
a.cardBoxIndex = 4 * this._num + i;
a.cardValue = e[i];
this._num < this._cardBox.length && i < this._cardBox[this._num].length && (this._cardBox[this._num][i] = a);
}
++this._num;
},
onTouchCancel: function(e) {
this._canTouch && this.onTouchEnd(e);
},
onTouchStart: function(e) {
if (this._canTouch) {
this._selectCard = e.target;
this._selectCard.color = new cc.Color(200, 200, 200);
}
},
onTouchMove: function(e) {
if (this._canTouch) {
var t = e.getDelta();
if (this._selectCard) {
this._selectCard.x += t.x;
this._selectCard.y += t.y;
}
}
},
onTouchEnd: function(e) {
if (this._canTouch && this._selectCard) if (this._selectCard.y > this._outCardY) if (this._canOutCard) {
var t = this._selectCard.parent.convertToWorldSpaceAR(this._selectCard.position);
Global.dispatchEvent(EventId.OUTCARD, {
card: this._selectCard.cardValue,
pos: t
});
cc.vv.gameData.outCard(this._selectCard.cardValue);
this._canOutCard = !1;
this.showOutLine(this._canOutCard);
this._selectCard.removeFromParent();
this.clearSelectInCardBox();
this.resetCardPos(!0);
this._selectCard = null;
} else {
this._selectCard.color = new cc.Color(255, 255, 255);
this.resetCardPos(!0);
} else this.checkMoveCard();
},
resetBoxInsertFront: function(e) {
this.clearSelectInCardBox();
for (var t = this._cardBox.length - 1; 0 < t; --t) if (e < t) for (var n = 0; n < 4; ++n) this._cardBox[t][n] = this._cardBox[t - 1][n];
this._cardBox[e + 1][0] = this._selectCard;
this._cardBox[e + 1][1] = null;
this._cardBox[e + 1][2] = null;
this._cardBox[e + 1][3] = null;
},
clearSelectInCardBox: function() {
var e = this._selectCard.cardBoxIndex, t = parseInt(e / 4), n = e % 4;
this._cardBox[t][n] = null;
this.moveCard(t, n);
},
resetBoxAppendTop: function(e) {
this.clearSelectInCardBox();
for (var t = 0; t < 4; ++t) if (null === this._cardBox[e][t]) {
this._cardBox[e][t] = this._selectCard;
break;
}
},
checkMoveCard: function() {
for (var e = -2, t = this._selectCard.cardBoxIndex, n = parseInt(t / 4), i = t % 4, a = !1, o = 0; o < this._cardBox.length; ++o) {
var s = this._cardBox[o][0];
if (s && this._selectCard.x > s.x - .5 * s.width && this._selectCard.x <= s.x + .5 * s.width) {
a = !0;
if (s === this._selectCard) continue;
if (null === this._cardBox[o][3]) {
e = o;
0 == n && 0 === i && null === this._cardBox[n][1] && (e = 0);
null === this._cardBox[n][1] && n < o && (e = o - 1);
this.resetBoxAppendTop(e);
break;
}
e = -1;
break;
}
}
if (!a) {
var r = this._cardBox[0][0];
if (this._selectCard.x < r.x) {
if (this._num < 10) {
e = -1;
this.resetBoxInsertFront(e);
}
} else if (this._num < 10) {
this.clearSelectInCardBox();
for (var c = 0; c < this._cardBox.length; ++c) if (null === this._cardBox[c][0]) {
this._cardBox[c][0] = this._selectCard;
break;
}
}
}
this.resetCardPos(!0);
this._selectCard.color = new cc.Color(255, 255, 255);
this._selectCard = null;
},
resetCardPos: function() {
for (var e = this, t = 0 < arguments.length && void 0 !== arguments[0] && arguments[0], n = 0, i = 0; i < this._cardBox.length; ++i) this._cardBox[i][0] && ++n;
this._num = n;
for (var a = 0; a < this._cardBox.length; ++a) for (var o = 0; o < 4; ++o) {
null === this._cardBox[a][o] && o < 3 && (this._cardBox[a][o] = this._cardBox[a][o + 1]);
if (this._cardBox[a][o]) {
var s = cc.v2(.5 * this._handcardNode.parent.width - .5 * n * this._cardBox[a][o].width + a * this._cardBox[a][o].width - 20, (this._cardBox[a][o].height - 22) * o + .5 * this._cardBox[a][o].height - 25);
t ? this._cardBox[a][o].runAction(cc.moveTo(.1, s)) : this._cardBox[a][o].position = s;
this._cardBox[a][o].cardBoxIndex = 4 * a + o;
this._cardBox[a][o].zIndex = 4 - o;
}
}
if (t) {
this._canTouch = !1;
this.scheduleOnce(function() {
e._canTouch = !0;
}, .1);
}
},
recvChiCard: function(e) {
e = e.detail;
if (0 === this._chairId) {
if (e.actionInfo.nextaction.seat === cc.vv.gameData.getMySeatIndex() && e.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.PUT) {
this._canOutCard = !0;
this.showOutLine(this._canOutCard);
}
if (e.actionInfo.curaction.seat === cc.vv.gameData.getMySeatIndex()) {
var t = e.chiInfo.chiData.slice(0), n = e.actionInfo.curaction.card, i = t.indexOf(n);
if (0 <= i) {
t.splice(i, 1);
this.delHandCard(t[0]);
this.delHandCard(t[1]);
if (e.chiInfo.luoData) for (var a = 0; a < e.chiInfo.luoData.length; ++a) this.delHandCard(e.chiInfo.luoData[a]);
this.resetCardPos();
}
}
}
},
delHandCard: function(e) {
for (var t = -1, n = -1, i = 0; i < this._handcardNode.childrenCount; ++i) {
var a = this._handcardNode.children[i];
if (a.cardValue === e) {
var o = a.cardBoxIndex;
t = parseInt(o / 4);
n = o % 4;
this._cardBox[t][n] = null;
a.removeFromParent(!0);
break;
}
}
-1 < t && -1 < n && this.moveCard(t, n);
},
moveCard: function(e, t) {
if (t < 3) if (this._cardBox[e][t + 1]) {
for (var n = t; n < 3; ++n) {
this._cardBox[e][n] = this._cardBox[e][n + 1];
this._cardBox[e][n] && (this._cardBox[e][n].cardBoxIndex = 4 * e + n);
}
this._cardBox[e][3] = null;
} else if (0 === t) {
for (var i = e; i < this._cardBox.length - 1; ++i) for (var a = 0; a < 4; ++a) {
this._cardBox[i][a] = this._cardBox[i + 1][a];
this._cardBox[i][a] && (this._cardBox[i][a].cardBoxIndex = 4 * i + a);
}
this._cardBox[this._cardBox.length - 1][0] = null;
this._cardBox[this._cardBox.length - 1][1] = null;
this._cardBox[this._cardBox.length - 1][2] = null;
this._cardBox[this._cardBox.length - 1][3] = null;
}
},
onRecvHandCard: function(e) {
var d = this;
e = e.detail;
if (this._seatIndex === e.seat && e.handInCards) {
this.clearDesk();
this._handCardData = e;
this._handCards = e.handInCards.slice(0);
for (var t = e.handInCards.slice(0), n = 0; n < e.menzi.length; ++n) {
var i = e.menzi[n], a = 0;
i.type === cc.vv.gameData.OPERATETYPE.KAN ? a = 3 : i.type !== cc.vv.gameData.OPERATETYPE.LONG && i.type !== cc.vv.gameData.OPERATETYPE.SHE || (a = 4);
for (var o = 0; o < a; ++o) t.push(i.card);
}
for (var s = 0; s < 10; ++s) {
var r = parseInt(1e3 * cc.random0To1()) % 10, c = t[s];
t[s] = t[r];
t[r] = c;
}
this.showCard(t, t.length, !0);
for (var u = .5 * this._handcardNode.parent.width - .5 * t.length * this._handcardNode.children[0].width + 200, g = .5 * this._handcardNode.children[0].height - 20, l = function(e) {
var t = d._handcardNode.children[e];
t.position = t.parent.convertToNodeSpaceAR(d._cardBoXPos);
var n = t.getChildByName("bg");
t.opacity = 0;
var i = cc.v2(u + e % 10 * t.width, g + parseInt(e / 10) * (t.height - 22)), a = cc.delayTime(.05 * e), o = cc.callFunc(function() {
n.opacity = 200;
t.getComponent(cc.Sprite).enabled = !1;
}), s = cc.callFunc(function() {
t.getComponent(cc.Sprite).enabled = !0;
n.active = !1;
}), r = cc.scaleTo(.2, 0, 1), c = cc.scaleTo(.2, 1, 1), l = cc.spawn(cc.moveTo(.1, i), cc.fadeTo(.1, 255)), h = cc.sequence(a, o, l, r, s, c);
e === d._handcardNode.childrenCount - 1 && (h = cc.sequence(a, o, l, r, s, c, cc.callFunc(function() {
d.sortCard();
})));
t.runAction(h);
}, h = 0; h < this._handcardNode.childrenCount; ++h) l(h);
}
},
sortCard: function() {
this.checkCanOutCard(this._handCardData.bankerInfo.seat);
var e = this._canOutCard;
Global.dispatchEvent(EventId.SHOW_MENZI, this._handCardData);
this.clearDesk();
for (var t = cc.vv.gameData.sortCard(this._handCards), n = 0; n < t.length; ++n) this.showCard(t[n], t.length);
this._canOutCard = e;
this.showOutLine(this._canOutCard);
},
initCardBox: function() {
for (var e = 0; e < 10; ++e) {
this._cardBox.push([]);
for (var t = 0; t < 4; ++t) {
0 == t && this._cardBox[e].push([]);
this._cardBox[e][t] = null;
}
}
},
clearDesk: function() {
this._handCardData = null;
this._handcardNode && this._handcardNode.removeAllChildren(!0);
if (0 === this._chairId) for (var e = 0; e < 10; ++e) for (var t = 0; t < 4; ++t) this._cardBox[e][t] = null;
this._selectCard = null;
this._canOutCard = !1;
this._outCardLineNode && (this._outCardLineNode.active = !1);
this._num = 0;
},
start: function() {
Global.registerEvent(EventId.CLEARDESK, this.clearDesk, this);
Global.registerEvent(EventId.HANDCARD, this.onRecvHandCard, this);
Global.registerEvent(EventId.CHI_NOTIFY, this.recvChiCard, this);
Global.registerEvent(EventId.PLAYER_ENTER, this.recvPlayerEnter, this);
Global.registerEvent(EventId.PLAYER_EXIT, this.recvPlayerExit, this);
Global.registerEvent(EventId.KAN_NOTIFY, this.recvKanAndKanNotify, this);
Global.registerEvent(EventId.PENG_NOTIFY, this.recvKanAndKanNotify, this);
Global.registerEvent(EventId.PAO_NOTIFY, this.recvPaoAndLongNotify, this);
Global.registerEvent(EventId.LONG_NOTIFY, this.recvPaoAndLongNotify, this);
Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO, this.recvDeskInfoMsg, this);
Global.registerEvent(EventId.DEL_HANDCARD_NOTIFY, this.recvDelHandcardNotify, this);
this.recvDeskInfoMsg();
},
recvDelHandcardNotify: function(e) {
if ((e = e.detail).seat === this._seatIndex) {
this.delHandCard(e.card);
this.resetCardPos();
}
},
recvDeskInfoMsg: function() {
if (null !== this._handcardNode) {
for (var e = cc.vv.gameData.getDeskInfo(), t = 0; t < e.users.length; ++t) if (this._seatIndex === e.users[t].seat) {
var n = e.users[t].handInCards;
if (n.length !== this._handcardNode.childrenCount) {
this.clearDesk();
for (var i = cc.vv.gameData.sortCard(n), a = 0; a < i.length; ++a) this.showCard(i[a], i.length);
}
}
if (e.isReconnect && cc.vv.gameData.getMySeatIndex() === e.actionInfo.nextaction.seat && e.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.PUT) {
this._canOutCard = !0;
this.showOutLine(this._canOutCard);
}
}
},
recvPaoAndLongNotify: function(e) {
e = e.detail;
if (0 === this._chairId && e.actionInfo.nextaction.seat === cc.vv.gameData.getMySeatIndex()) {
this._canOutCard = !0;
this.showOutLine(this._canOutCard);
}
},
recvKanAndKanNotify: function(e) {
e = e.detail;
if (0 === this._chairId) {
if (e.actionInfo.curaction.seat === cc.vv.gameData.getMySeatIndex()) {
this.delHandCard(e.actionInfo.curaction.card);
this.delHandCard(e.actionInfo.curaction.card);
this.resetCardPos();
}
this._canOutCard = e.actionInfo.nextaction.seat === cc.vv.gameData.getMySeatIndex();
this.showOutLine(this._canOutCard);
}
},
showOutLine: function(e) {
this._outCardLineNode.active = e;
},
recvPlayerEnter: function(e) {
e = e.detail;
cc.vv.gameData.getLocalChair(e.seat) === this._chairId && (this._seatIndex = e.seat);
},
recvPlayerExit: function(e) {
(e = e.detail) === this._seatIndex && (this._seatIndex = -1);
}
});
cc._RF.pop();
}, {} ],
PengHu_MainScne: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "294549MerxAwoOn4dHagARN", "PengHu_MainScne");
cc.Class({
extends: cc.Component,
properties: {
cardsAtlas: cc.SpriteAtlas,
emjoAtlas: cc.SpriteAtlas,
tableAtlas: cc.SpriteAtlas,
_gameCount: 0
},
start: function() {
Global.autoAdaptDevices(!1);
var e = cc.vv.gameData.getRoomConf();
cc.find("scene/room_info/txt_room_id", this.node).getComponent(cc.Label).string = "游戏号:" + e.deskId;
this._gameCount = e.gamenum;
this.updateCount(cc.vv.gameData.getDeskInfo().round);
for (var t = "", n = cc.vv.gameData.getWanFa(), i = 0; i < n.length; ++i) {
t += n[i];
2 === i && (t += "\n");
}
cc.find("scene/room_info/txt_game_desc", this.node).getComponent(cc.Label).string = t;
this.node.addComponent("PengHu_Card").init(this.cardsAtlas);
var a = cc.find("scene/operate_btn_view/btn_msg", this.node);
Global.btnClickEvent(a, this.onShowMsg, this);
for (var o = 0; o < 4; ++o) {
this.node.addComponent("PengHu_ShowCard").init(o, e.seat);
this.node.addComponent("PengHu_Player").init(o, e.seat, this.emjoAtlas);
this.node.addComponent("PengHu_OutCard").init(o, e.seat);
this.node.addComponent("PengHu_OperatePai").init(o, e.seat);
this.node.addComponent("PengHu_HandCard").init(o, e.seat);
}
this.node.addComponent("PengHu_HandCard").init();
this.node.addComponent("PengHu_Operate");
this.node.addComponent("PengHu_Tips");
this.node.addComponent("PengHu_Action");
this.node.addComponent("PengHu_RemainCard");
this.node.addComponent("PengHu_RoundOver").init(this.tableAtlas);
this.node.addComponent("PengHu_GameOver").init(this.tableAtlas);
this.node.addComponent("PengHu_Sound");
this.node.addComponent("PengHu_Chat");
this.node.addComponent("PengHu_Setting");
Global.registerEvent(EventId.HANDCARD, this.onRecvHandCard, this);
},
onRecvHandCard: function(e) {
e = e.detail;
this.updateCount(e.round);
},
updateCount: function(e) {
cc.find("scene/room_info/txt_round_num", this.node).getComponent(cc.Label).string = "(" + e + "/" + this._gameCount + "局)";
},
onShowMsg: function() {
Global.dispatchEvent(EventId.SHOW_CHAT);
}
});
cc._RF.pop();
}, {} ],
PengHu_Menu: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "359512wCJBM+IXhlpn16Ux2", "PengHu_Menu");
cc.Class({
extends: cc.Component,
properties: {
_panelSettingNode: null,
_startPos: null,
_canClick: !0,
_clickNode: null,
_clickBtnSeat: -1,
_isPlaying: !1
},
start: function() {
this.registerMsg();
var e = cc.find("scene/operate_btn_view/ready_btn", this.node);
Global.btnClickEvent(e, this.onReady, this);
var t = cc.find("scene/operate_btn_view/btn_setting", this.node);
Global.btnClickEvent(t, this.onClickSetting, this);
this._panelSettingNode = cc.find("scene/panel_setting", this.node);
this._panelSettingNode.getComponent(cc.Widget).updateAlignment();
this._panelSettingNode.getComponent(cc.Widget).enabled = !1;
this._startPos = cc.v2(this._panelSettingNode.x, this._panelSettingNode.y);
this._clickNode = this._panelSettingNode.getChildByName("button");
Global.btnClickEvent(this._clickNode, this.onClose, this);
this._clickNode.active = !1;
var n = cc.find("btn_leave", this._panelSettingNode);
Global.btnClickEvent(n, this.onClickDismiss, this);
var i = this._panelSettingNode.getChildByName("btn_dismiss");
Global.btnClickEvent(i, this.onClickDismiss, this);
this.panel_dismiss = cc.find("scene/panel_dismiss", this.node);
this.panel_dismiss.zIndex = 4;
this.panel_dismiss.active = !1;
this.dismiss_small_bg = this.panel_dismiss.getChildByName("dismiss_small_bg");
this.dismiss_big_bg = this.panel_dismiss.getChildByName("dismiss_big_bg");
var a = cc.find("dismiss_small_bg/btn_cancel", this.panel_dismiss);
Global.btnClickEvent(a, this.onClickCancelDismiss, this);
var o = cc.find("dismiss_small_bg/btn_close_dismiss", this.panel_dismiss);
Global.btnClickEvent(o, this.onClickCancelDismiss, this);
var s = cc.find("dismiss_small_bg/btn_exit_to_hall", this.panel_dismiss);
Global.btnClickEvent(s, this.onClickExitToHall, this);
var r = cc.find("dismiss_small_bg/btn_define", this.panel_dismiss);
Global.btnClickEvent(r, this.onClickDefineDismiss, this);
var c = cc.find("dismiss_big_bg/btn_agree", this.panel_dismiss);
Global.btnClickEvent(c, this.onClickAgreeDismiss, this);
var l = cc.find("dismiss_big_bg/btn_refuse", this.panel_dismiss);
Global.btnClickEvent(l, this.onClickRefuseDismiss, this);
var h = this._panelSettingNode.getChildByName("btn_setting");
Global.btnClickEvent(h, this.onShowSetting, this);
var d = this._panelSettingNode.getChildByName("btn_close");
Global.btnClickEvent(d, this.onClose, this);
var u = cc.find("scene/operate_btn_view/btn_invite_wx", this.node);
Global.btnClickEvent(u, this.onClickInviteToWx, this);
var g = cc.find("scene/operate_btn_view/btn_copy_roomId", this.node);
Global.btnClickEvent(g, this.onClickCopyRoomIdToWx, this);
this.btn_gps = cc.find("scene/operate_btn_view/btn_gps", this.node);
this.setGpsBtnColour(1);
this.panel_gps = cc.find("scene/panel_gps", this.node);
this.onSetShowGps(!1);
this.panel_player = cc.find("scene/panel_player", this.node);
this.onClickClosePlayerInfo();
var _ = cc.find("spr_bg/btn_exit", this.panel_gps);
Global.btnClickEvent(_, this.onClickExitGame, this);
var f = cc.find("spr_bg/btn_continue", this.panel_gps);
Global.btnClickEvent(f, this.onClickContinueGame, this);
Global.registerEvent(EventId.CLOSE_ROUNDVIEW, this.recvCloseRoundView, this);
Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO, this.recvDeskInfoMsg, this);
Global.registerEvent(EventId.READY_NOTIFY, this.onRcvReadyNotice, this);
Global.registerEvent(EventId.HANDCARD, this.onRecvHandCard, this);
Global.registerEvent(EventId.PLAYER_DISTANCE_DATA, this.onRcvPlayersDistanceData, this);
Global.registerEvent(EventId.GPS_TIPS_NOTIFY, this.onRcvGpsTipsNotify, this);
Global.registerEvent(EventId.DISMISS_NOTIFY, this.onRcvDismissNotify, this);
this.recvDeskInfoMsg();
},
onRcvDismissNotify: function(e) {
this.panel_dismiss.active = !0;
if (MsgId.APPLY_DISMISS_NOTIFY == e.detail.c || MsgId.AGREE_DISMISS_NOTIFY == e.detail.c) {
var t = e.detail.dissolveInfo;
if (!t) return;
this.dismiss_small_bg.active = !1;
this.dismiss_big_bg.active = !0;
this.dismiss_big_bg.getChildByName("text_title").getComponent(cc.Label).string = "申请解散游戏";
var n = "玩家[" + t.startPlayername + "]申请解散游戏，等待其他玩家选择，超过[" + t.time + "]秒未做选择，则默认同意！";
this.dismiss_big_bg.getChildByName("text_tip").getComponent(cc.Label).string = n;
var i = !0, a = this.dismiss_big_bg.getChildByName("playerStateNode");
a.removeAllChildren();
for (var o = this.dismiss_big_bg.getChildByName("text_palyerStateTemplate"), s = 0, r = 0; r < t.agreeUsers.length; r++) if (t.startUid != t.agreeUsers[r].uid) {
var c = cc.instantiate(o);
c.active = !0;
c.parent = a;
c.x = 0;
c.y = s;
s -= 30;
if (1 == t.agreeUsers[r].isargee) {
c.getComponent(cc.Label).string = "【" + t.agreeUsers[r].playername + "】同意解散";
c.color = new cc.Color(0, 180, 0);
} else {
c.getComponent(cc.Label).string = "【" + t.agreeUsers[r].playername + "】等待选择";
c.color = new cc.Color(227, 80, 26);
cc.vv.UserManager.uid == t.agreeUsers[r].uid && (i = !1);
}
}
this.dismiss_big_bg.getChildByName("btn_agree").active = !i;
this.dismiss_big_bg.getChildByName("btn_refuse").active = !i;
if (MsgId.APPLY_DISMISS_NOTIFY == e.detail.c) {
var l = this.dismiss_big_bg.getChildByName("text_downCount");
l.getComponent(cc.Label).string = t.distimeoutIntervel;
l.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1), cc.callFunc(function() {
l.getComponent(cc.Label).string = --t.distimeoutIntervel;
0 == t.distimeoutIntervel && l.stopAllActions();
}))));
}
} else if (MsgId.REFUSE_DISMISS_NOTIFY == e.detail.c || MsgId.SUCCESS_DISMISS_NOTIFY == e.detail.c) {
if (!cc.vv.UserManager.currClubId && !this._isPlaying) {
this.onClickExitToHall();
return;
}
this.dismiss_small_bg.active = !0;
this.dismiss_big_bg.active = !1;
this.dismiss_big_bg.getChildByName("text_downCount").stopAllActions();
this.dismiss_small_bg.getChildByName("text_title").getComponent(cc.Label).string = "提示";
var h = "游戏解散成功";
MsgId.REFUSE_DISMISS_NOTIFY == e.detail.c && (h = "游戏解散失败！玩家[" + e.detail.playername + "]不同意解散");
this.dismiss_small_bg.getChildByName("text_tip").getComponent(cc.Label).string = h;
this.dismiss_small_bg.getChildByName("btn_cancel").active = !1;
this.dismiss_small_bg.getChildByName("btn_define").active = !1;
this.dismiss_small_bg.getChildByName("btn_close_dismiss").active = !(MsgId.SUCCESS_DISMISS_NOTIFY == e.detail.c && !cc.vv.UserManager.currClubId);
this.dismiss_small_bg.getChildByName("btn_exit_to_hall").active = MsgId.SUCCESS_DISMISS_NOTIFY == e.detail.c && !cc.vv.UserManager.currClubId;
}
},
onClickDismiss: function() {
var e = cc.vv.gameData.getRoomConf().createUserInfo.uid;
this.panel_dismiss.active = !0;
this.dismiss_small_bg.active = !0;
this.dismiss_big_bg.active = !1;
this.dismiss_small_bg.getChildByName("btn_cancel").active = !0;
this.dismiss_small_bg.getChildByName("btn_define").active = !0;
this.dismiss_small_bg.getChildByName("btn_close_dismiss").active = !1;
this.dismiss_small_bg.getChildByName("btn_exit_to_hall").active = !1;
if (this._isPlaying) {
this.dismiss_small_bg.getChildByName("text_title").getComponent(cc.Label).string = "解散游戏";
this.dismiss_small_bg.getChildByName("text_tip").getComponent(cc.Label).string = "您正在申请解散游戏操作，是否确认？";
} else if (e == cc.vv.UserManager.uid) {
this.dismiss_small_bg.getChildByName("text_title").getComponent(cc.Label).string = "解散游戏";
this.dismiss_small_bg.getChildByName("text_tip").getComponent(cc.Label).string = "解散游戏后返还豆，是否确定解散？";
} else {
this.dismiss_small_bg.getChildByName("text_title").getComponent(cc.Label).string = "返回大厅";
this.dismiss_small_bg.getChildByName("text_tip").getComponent(cc.Label).string = "您确定要离开游戏吗？";
}
},
onClickCancelDismiss: function() {
this.panel_dismiss.active = !1;
},
onClickExitToHall: function() {
cc.vv.gameData.getRoomConf().createUserInfo.uid == cc.vv.UserManager.uid ? cc.vv.FloatTip.show("游戏已解散") : cc.vv.FloatTip.show("游戏已被创建者解散");
cc.vv.gameData.onRcvNetExitRoom({
code: 200
});
},
onClickDefineDismiss: function() {
if (this._isPlaying) {
if (0 == cc.vv.gameData.getRoomConf().isdissolve) {
this.panel_dismiss.active = !1;
cc.vv.FloatTip.show("该房间不可解散");
return;
}
}
var e = cc.vv.gameData.getRoomConf().createUserInfo.uid;
this.panel_dismiss.active = !1;
if (this._isPlaying || e == cc.vv.UserManager.uid && !cc.vv.UserManager.currClubId) {
var t = {
c: MsgId.APPLY_DISMISS
};
cc.vv.NetManager.send(t);
} else this.onExit();
},
onClickAgreeDismiss: function() {
var e = {
c: MsgId.AGREE_DISMISS
};
cc.vv.NetManager.send(e);
},
onClickRefuseDismiss: function() {
var e = {
c: MsgId.REFUSE_DISMISS
};
cc.vv.NetManager.send(e);
},
setGpsBtnColour: function(e) {
cc.find("btn_ani/GPS_Green", this.btn_gps).active = 1 == e;
cc.find("btn_ani/GPS_Red", this.btn_gps).active = 3 == e;
cc.find("btn_ani/GPS_Yellow", this.btn_gps).active = 2 == e;
},
onClickGPS: function(e, t) {
this._clickBtnSeat = parseInt(t);
var n = {
c: MsgId.PLAYER_DISTANCE_DATA
};
cc.vv.NetManager.send(n);
},
onClickExitGame: function() {
this.onSetShowGps(!1);
this.onExit();
},
onClickContinueGame: function() {
this.onSetShowGps(!1);
},
onSetShowGps: function(e, t) {
if ((this.panel_gps.active = e) && t && t.locatingList) {
for (var n = this.panel_gps.getChildByName("spr_bg"), i = t.locatingList, a = cc.vv.gameData.getRoomConf().seat, o = 2; o <= 4; o++) n.getChildByName("node_" + o + "player").active = a == o;
var s = n.getChildByName("node_" + a + "player"), r = [];
for (o = 0; o < a; o++) r.push(!1);
for (o = 0; o < i.length; o++) {
var c = cc.vv.gameData.getLocalChair(i[o].seat);
r[c] = !0;
var l = s.getChildByName("ndoe_player" + c);
l.getChildByName("GPS_Green").active = 1 == i[o].headColour;
l.getChildByName("GPS_Red").active = 2 == i[o].headColour;
var h = cc.find("radio_mask/spr_head", l);
h.active = !0;
Global.setHead(h, i[o].usericon);
for (var d = i[o].data, u = [], g = 0; g < a - 1; g++) u.push(!1);
for (g = 0; g < d.length; g++) {
var _ = cc.vv.gameData.getLocalChair(d[g].seat);
if (c < _) {
u[_] = !0;
var f = s.getChildByName("ndoe_line" + c + _);
f.getChildByName("line_green").active = 1 == d[g].gpsColour;
f.getChildByName("line_red").active = 2 == d[g].gpsColour;
if (0 < d[g].locating) {
var v = Math.floor(10 * d[g].locating) / 10;
f.getChildByName("text_distance").getComponent(cc.Label).string = v + "米";
1 == d[g].gpsColour ? f.getChildByName("text_distance").color = cc.Color.GREEN : 2 == d[g].gpsColour ? f.getChildByName("text_distance").color = cc.Color.RED : f.getChildByName("text_distance").color = new cc.Color(134, 90, 46);
}
}
}
for (g = 0; g < a; g++) if (!u[g]) {
var p = g;
if (c < p) {
var m = s.getChildByName("ndoe_line" + c + p);
m.getChildByName("line_green").active = !1;
m.getChildByName("line_red").active = !1;
m.getChildByName("text_distance").getComponent(cc.Label).string = "未知距离";
m.getChildByName("text_distance").color = new cc.Color(134, 90, 46);
}
}
}
for (o = 0; o < a; o++) if (!r[o]) {
var b = o, C = s.getChildByName("ndoe_player" + b);
C.getChildByName("GPS_Green").active = !1;
C.getChildByName("GPS_Red").active = !1;
cc.find("radio_mask/spr_head", C).active = !1;
for (g = 0; g < a; g++) {
var E = g;
if (b < E) {
var N = s.getChildByName("ndoe_line" + b + E);
N.getChildByName("line_green").active = !1;
N.getChildByName("line_red").active = !1;
N.getChildByName("text_distance").getComponent(cc.Label).string = "未知距离";
N.getChildByName("text_distance").color = new cc.Color(134, 90, 46);
}
}
}
}
},
onRcvPlayersDistanceData: function(e) {
if (-1 == this._clickBtnSeat) this.onSetShowGps(!0, e.detail); else {
var t = this.uiSeatToLocalSeat(this._clickBtnSeat);
this.onShowPlayerInfo(t, e.detail);
}
},
uiSeatToLocalSeat: function(e) {
return [ [ -1, -1, -1, -1 ], [ -1, -1, -1, -1 ], [ 0, -1, 1, -1 ], [ 0, 1, -1, 2 ], [ 0, 1, 2, 3 ] ][cc.vv.gameData.getRoomConf().seat][e];
},
onClickClosePlayerInfo: function() {
this.panel_player.active = !1;
},
onShowPlayerInfo: function(e, t) {
this.panel_player.active = !0;
var n = this.panel_player.getChildByName("self_bg");
n.active = !1;
var i = this.panel_player.getChildByName("other_bg");
i.active = !1;
var a = 0 == e ? n : i;
if (t && t.locatingList) for (var o = t.locatingList, s = 0; s < o.length; s++) {
if (e == cc.vv.gameData.getLocalChair(o[s].seat)) {
var r = cc.find("head/radio_mask/spr_head", a);
Global.setHead(r, o[s].usericon);
cc.find("node_bean/txet_beanNum", a).getComponent(cc.Label).string = cc.vv.UserManager.coin;
cc.find("node_roomCard/txet_roomCardNum", a).getComponent(cc.Label).string = cc.vv.UserManager.roomcard;
a.getChildByName("txet_name").getComponent(cc.Label).string = "昵称：" + o[s].playername;
a.getChildByName("txet_ID").getComponent(cc.Label).string = "游戏ID：" + o[s].uid;
a.getChildByName("txet_IP").getComponent(cc.Label).string = "IP：" + o[s].ip;
a.getChildByName("txet_GPS").getComponent(cc.Label).string = o[s].isOpen ? "定位已开启" : "未开启定位";
for (var c = o[s].data, l = "", h = 0; h < c.length; h++) {
l += "距离 " + c[h].playername + " ";
if (0 < c[h].locating) {
l += Math.floor(10 * c[h].locating) / 10 + "米\n";
} else l += "未知距离\n";
}
a.getChildByName("txet_distance").getComponent(cc.Label).string = l;
a.active = !0;
}
}
},
onRcvGpsTipsNotify: function(e) {
this.setGpsBtnColour(e.detail.gpsColour);
},
onClickInviteToWx: function() {
var e = cc.vv.gameData.getRoomConf(), t = "碰胡";
t += "," + e.gamenum + "局";
t += "," + e.seat + "人场";
t += "," + [ "连中玩法", "中庄x2", "四首相乘" ][e.param1];
t += ",底分:" + e.score;
t += ",房间号:" + e.deskId;
Global.onWXShareLink(Global.ShareSceneType.WXSceneSession, "闲去房间邀请", t, Global.iconUrl, Global.shareLink);
},
onClickCopyRoomIdToWx: function() {
var e = cc.vv.gameData.getRoomConf().deskId;
Global.onWXShareText(Global.ShareSceneType.WXSceneSession, "房间ID", e);
},
onClose: function() {
this.showPanel(!1);
},
onShowSetting: function() {
Global.dispatchEvent(EventId.SHOW_SETTING);
},
onClickSetting: function() {
this._canClick && this.showPanel(!0);
},
showPanel: function(e) {
var t = this;
this._canClick = !1;
e || (this._clickNode.active = !1);
var n = cc.v2(this._startPos.x - this._panelSettingNode.width, this._startPos.y);
e || (n = cc.v2(this._startPos.x, this._startPos.y));
this._panelSettingNode.runAction(cc.sequence(cc.moveTo(.2, n), cc.callFunc(function() {
t._canClick = !0;
t._clickNode.active = e;
})));
},
recvDeskInfoMsg: function() {
var e = cc.vv.gameData.getUserInfo(cc.vv.gameData.getMySeatIndex());
if (e) {
this.showReady(0 === e.state);
this.showInviteWxCopyRoomId(2 != e.state);
}
var t = cc.vv.gameData.getDeskInfo();
if (t.dissolveInfo && t.dissolveInfo.iStart) {
MsgId.APPLY_DISMISS_NOTIFY;
var n = {
detail: {}
};
n.detail.c = MsgId.APPLY_DISMISS_NOTIFY;
n.detail.dissolveInfo = t.dissolveInfo;
this.onRcvDismissNotify(n);
}
},
recvCloseRoundView: function() {
this.showReady(!0);
},
onRcvReadyNotice: function(e) {
if ((e = e.detail).seat === cc.vv.gameData.getMySeatIndex()) {
this.showReady(!1);
Global.dispatchEvent(EventId.CLEARDESK);
}
},
onRecvHandCard: function(e) {
(e = e.detail).seat === cc.vv.gameData.getMySeatIndex() && this.showInviteWxCopyRoomId(!1);
},
onExit: function() {
cc.vv.gameData && cc.vv.gameData.exitGame();
},
onReady: function() {
cc.vv.NetManager.send({
c: MsgId.READY
});
Global.dispatchEvent(EventId.CLEARDESK);
},
onRcvReadyResult: function(e) {
200 === e.code && this.showReady(!1);
},
registerMsg: function() {
cc.vv.NetManager.registerMsg(MsgId.READY, this.onRcvReadyResult, this);
},
unregisterMsg: function() {
cc.vv.NetManager.unregisterMsg(MsgId.READY, this.onRcvReadyResult, !1, this);
},
showReady: function(e) {
cc.find("scene/operate_btn_view/ready_btn", this.node).active = e;
},
showInviteWxCopyRoomId: function(e) {
cc.find("scene/operate_btn_view/btn_invite_wx", this.node).active = e;
cc.find("scene/operate_btn_view/btn_copy_roomId", this.node).active = e;
this._isPlaying = !e;
},
onDestroy: function() {
this.unregisterMsg();
}
});
cc._RF.pop();
}, {} ],
PengHu_OperatePai: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "b5151k0+L5LurijZ5HPn6kG", "PengHu_OperatePai");
cc.Class({
extends: cc.Component,
properties: {
_operateCardNode: null,
_chairId: -1,
_seatIndex: -1,
_num: 0,
_playerNum: 0,
_startPos: null
},
init: function(e, t) {
this._playerNum = t;
var n = cc.find("scene/out_cards/operate_card" + e, this.node), i = cc.find("scene/out_cards/show_card" + e, this.node);
this._startPos = i.parent.convertToWorldSpaceAR(i.position);
if (4 === t) {
this._operateCardNode = n;
this._chairId = e;
} else if (0 == e || 2 == e) {
this._operateCardNode = n;
this._chairId = 0 < e ? 1 : 0;
}
if (this._operateCardNode) {
this._startPos = this._operateCardNode.convertToNodeSpaceAR(this._startPos);
this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);
}
},
showCard: function(e, t) {
for (var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0, i = 3 < arguments.length && void 0 !== arguments[3] && arguments[3], a = 0; a < e.length; ++a) {
var o = !1;
t === cc.vv.gameData.OPERATETYPE.KAN ? o = 0 !== this._chairId || 2 !== a : t !== cc.vv.gameData.OPERATETYPE.LONG && t !== cc.vv.gameData.OPERATETYPE.SHE || (o = 3 !== a);
var s = this.node.getComponent("PengHu_Card").createCard(e[a], i ? 1 : 2, o), r = cc.v2(0, 0);
r.y = 36 * a;
4 === cc.vv.gameData.getPlayerNum() && 1 == this._chairId ? r.x = -37 * this._num : r.x = 37 * this._num;
3 === this._chairId && (r.x = -37 * this._num);
if (i) {
var c = cc.v2(0, 0);
c.x = this._startPos.x + this._num * s.width;
var l = e.length * (s.height - 22) / 2;
c.y = this._startPos.y - l + a * (s.height - 22);
this.showCardAction(s, c, r);
} else s.position = cc.v2(r.x, r.y);
s.cardValue = e[a];
s.showBg = o;
s.index = a;
s.parent = this._operateCardNode;
s.source = n;
}
++this._num;
},
showCardAction: function(e, t, n) {
var i = this;
e.stopAllActions();
e.position = t;
e.scale = 1;
e.opacity = 255;
var a = cc.vv.gameData.getActionTime();
e.runAction(cc.sequence(cc.spawn(cc.moveTo(a, n).easing(cc.easeOut(3)), cc.scaleTo(a, .48), cc.fadeTo(a, 50)), cc.callFunc(function() {
i.node.getComponent("PengHu_Card").createCard(e.cardValue, 2, e.showBg, e);
e.scale = 1;
e.opacity = 255;
})));
},
recvHandCard: function(e) {
if ((e = e.detail).seat === this._seatIndex) for (var t = 0; t < e.menzi.length; ++t) {
var n = e.menzi[t], i = [];
n.type === cc.vv.gameData.OPERATETYPE.KAN || n.type === cc.vv.gameData.OPERATETYPE.PENG ? i = [ n.card, n.card, n.card ] : n.type === cc.vv.gameData.OPERATETYPE.LONG ? i = [ n.card, n.card, n.card, n.card ] : n.type === cc.vv.gameData.OPERATETYPE.SHE && (i = [ n.card, n.card, n.card, n.card ]);
this.showCard(i, n.type, 0, !0);
Global.dispatchEvent(EventId.SHOW_MENZI_SOUND, n.type);
}
},
recvChiCard: function(e) {
e = e.detail;
this._seatIndex === e.actionInfo.curaction.seat && this.showCard(e.chiInfo.chiData, e.actionInfo.curaction.type, 0, !0);
},
clearDesk: function() {
this._num = 0;
this._operateCardNode && this._operateCardNode.removeAllChildren();
},
start: function() {
Global.registerEvent(EventId.CLEARDESK, this.clearDesk, this);
Global.registerEvent(EventId.SHOW_MENZI, this.recvHandCard, this);
Global.registerEvent(EventId.CHI_NOTIFY, this.recvChiCard, this);
Global.registerEvent(EventId.PLAYER_ENTER, this.recvPlayerEnter, this);
Global.registerEvent(EventId.PLAYER_EXIT, this.recvPlayerExit, this);
Global.registerEvent(EventId.KAN_NOTIFY, this.recvKanNotify, this);
Global.registerEvent(EventId.PENG_NOTIFY, this.recvPengNotify, this);
Global.registerEvent(EventId.PAO_NOTIFY, this.recvPaoNotify, this);
Global.registerEvent(EventId.LONG_NOTIFY, this.recvLongNotify, this);
Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO, this.recvDeskInfoMsg, this);
Global.registerEvent(EventId.HANDCARD, this.recvHandCardMsg, this);
Global.registerEvent(EventId.HU_NOTIFY, this.recvOverRound, this);
this.recvDeskInfoMsg();
},
recvOverRound: function() {
if (this._operateCardNode) for (var e = 0; e < this._operateCardNode.childrenCount; ++e) {
var t = this._operateCardNode.children[e];
t.showBg && 2 == t.index && this.node.getComponent("PengHu_Card").createCard(t.cardValue, 2, !1, t);
}
},
recvHandCardMsg: function(e) {
e.detail.seat !== cc.vv.gameData.getMySeatIndex() && this.recvHandCard(e);
},
recvDeskInfoMsg: function() {
var e = cc.vv.gameData.getDeskInfo();
if (e.isReconnect) for (var t = 0; t < e.users.length; ++t) if (this._seatIndex === e.users[t].seat) {
var n = e.users[t].menzi;
if (this._operateCardNode.childrenCount !== n.length) {
this._num = 0;
this._operateCardNode.removeAllChildren();
for (var i = 0; i < n.length; ++i) {
var a = n[i], o = [], s = 0;
if (a.type === cc.vv.gameData.OPERATETYPE.KAN) o = [ a.card, a.card, a.card ]; else if (a.type === cc.vv.gameData.OPERATETYPE.LONG || a.type === cc.vv.gameData.OPERATETYPE.SHE || a.type === cc.vv.gameData.OPERATETYPE.PAO) o = [ a.card, a.card, a.card, a.card ]; else if (a.type === cc.vv.gameData.OPERATETYPE.PENG) {
o = 0 === a.source ? [ a.card, a.card, a.card ] : [ a.card, a.card ];
s = a.source;
} else o = a.data;
this.showCard(o, a.type, s);
}
break;
}
}
},
recvPaoNotify: function(e) {
if ((e = e.detail).actionInfo.curaction.seat === this._seatIndex) {
var t = e.actionInfo.curaction.card;
this.addCard(t, !1);
}
},
recvLongNotify: function(e) {
if ((e = e.detail).actionInfo.curaction.seat === this._seatIndex) {
var t = e.actionInfo.curaction.card;
this.addCard(t, !0);
}
},
addCard: function(e, t) {
for (var n = 0, i = 0, a = 0; a < this._operateCardNode.childrenCount; ++a) if (this._operateCardNode.children[a].cardValue == e) {
i = this._operateCardNode.children[a].x;
++n;
3 !== this._operateCardNode.children[a].index && this.node.getComponent("PengHu_Card").createCard(e, 2, t, this._operateCardNode.children[a]);
}
if (0 === n) for (var o = 0; o < 4; ++o) {
var s = this.node.getComponent("PengHu_Card").createCard(e, 2, o < 3 && t);
s.y = s.height * (n + o);
s.x = i;
s.cardValue = e;
s.parent = this._operateCardNode;
s.index = n + o;
} else for (var r = 0; r < 4 - n; ++r) {
var c = this.node.getComponent("PengHu_Card").createCard(e, 2, n < 3 && 0 == r && t);
c.y = c.height * (n + r);
c.x = i;
c.cardValue = e;
c.parent = this._operateCardNode;
c.index = n + r;
}
},
recvKanNotify: function(e) {
if ((e = e.detail).actionInfo.curaction.seat === this._seatIndex) {
var t = e.actionInfo.curaction.card;
this.showCard([ t, t, t ], cc.vv.gameData.OPERATETYPE.KAN, 0, !0);
}
},
recvPengNotify: function(e) {
if ((e = e.detail).actionInfo.curaction.seat === this._seatIndex) {
var t = e.actionInfo.curaction.card;
0 !== e.actionInfo.curaction.source ? this.showCard([ t, t ], e.actionInfo.curaction.type, 0, !0) : this.showCard([ t, t, t ], e.actionInfo.curaction.type, 0, !0);
}
},
recvPlayerEnter: function(e) {
e = e.detail;
cc.vv.gameData.getLocalChair(e.seat) === this._chairId && (this._seatIndex = e.seat);
},
recvPlayerExit: function(e) {
(e = e.detail) === this._seatIndex && (this._seatIndex = -1);
}
});
cc._RF.pop();
}, {} ],
PengHu_Operate: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "e46c6+htPpB8KlpgRba3faI", "PengHu_Operate");
cc.Class({
extends: cc.Component,
properties: {
_operateNode: null,
_selectChiNode: null,
_selectLuoNode: null,
_chiItemsList: [],
_luoItemsList: [],
_currActionCard: -1,
_chiData: null,
_chi: null
},
start: function() {
this.registerMsg();
this._operateNode = cc.find("scene/play_action_view", this.node);
this._operateNode.active = !1;
this._btnChi = cc.find("scene/play_action_view/img_bg/btn_chi", this.node);
Global.btnClickEvent(this._btnChi, this.onChi, this);
this._btnPeng = cc.find("scene/play_action_view/img_bg/btn_peng", this.node);
Global.btnClickEvent(this._btnPeng, this.onPeng, this);
this._btnHu = cc.find("scene/play_action_view/img_bg/btn_hu", this.node);
Global.btnClickEvent(this._btnHu, this.onHu, this);
this._btnGuo = cc.find("scene/play_action_view/img_bg/btn_guo", this.node);
Global.btnClickEvent(this._btnGuo, this.onGuo, this);
this.recvDeskInfoMsg();
},
clearDesk: function() {
this._operateNode && (this._operateNode.active = !1);
this._selectChiNode && (this._selectChiNode.active = !1);
this._selectLuoNode && (this._selectLuoNode.active = !1);
},
showSelectChi: function(a) {
var o = this;
if (null === this._selectChiNode) cc.loader.loadRes("common/prefab/chi", cc.Prefab, function(e, t) {
if (null === e) {
o._selectChiNode = cc.instantiate(t);
o._selectChiNode.parent = o.node;
o._selectChiNode.zIndex = 1;
var n = cc.find("img_bg/item", o._selectChiNode);
o._chiItemsList.push(n);
var i = cc.find("img_bg/btn_close", o._selectChiNode);
o._selectChiNode.active = !0;
Global.btnClickEvent(i, function() {
o.onCloseSelectChi();
o._operateNode.active = !0;
});
o._selectLuoNode = cc.instantiate(t);
o._selectLuoNode.parent = o.node;
o._selectLuoNode.zIndex = 2;
n = cc.find("img_bg/item", o._selectLuoNode);
o._luoItemsList.push(n);
i = cc.find("img_bg/btn_close", o._selectLuoNode);
o._selectLuoNode.active = !1;
Global.btnClickEvent(i, function() {
o._selectLuoNode.active = !1;
o._selectChiNode.active = !0;
o._chi = {
chiData: null,
luoData: [],
luoCount: 0
};
});
o.initChi(a);
}
}); else {
this.initChi(a);
this._selectChiNode.active = !0;
}
},
initLuoData: function(e) {
var t = 0;
this._selectLuoNode.active = !0;
for (var n = this._selectLuoNode.getChildByName("img_bg"), i = 0; i < e.length; ++i) {
var a = null;
if (i < this._luoItemsList.length) a = this._luoItemsList[i]; else {
(a = cc.instantiate(this._luoItemsList[0])).parent = this._luoItemsList[0].parent;
this._luoItemsList.push(a);
}
a.x = .5 * -e.length * a.width + a.width * i;
a.data = e[i];
Global.btnClickEvent(a, this.onSelectLuo, this);
t += a.width;
var o = e[i].slice(0);
o.unshift(this._currActionCard);
for (var s = 0; s < 3; ++s) {
var r = cc.find("img_bg/card" + s, a);
this.node.getComponent("PengHu_Card").createCard(o[s], 1, !1, r);
}
}
for (var c = e.length; c < this._luoItemsList.length; ++c) {
this._luoItemsList[c].active = !1;
this._luoItemsList[c].data = null;
}
n.width = t + 80;
cc.find("img_bg/btn_close", this._selectLuoNode).getComponent(cc.Widget).updateAlignment();
},
onSelectLuo: function(e) {
e.target.getComponent(cc.Button).interactable = !1;
e.target.opacity = 200;
this._chi.luoData.push(e.target.data);
if (this._chi.luoCount === this._chi.luoData.length) {
cc.vv.gameData.chi(this._chi);
this._selectLuoNode.active = !1;
}
},
initChi: function(e) {
for (var t = 0, n = this._selectChiNode.getChildByName("img_bg"), i = 0; i < e.length; ++i) {
var a = null;
if (i < this._chiItemsList.length) a = this._chiItemsList[i]; else {
(a = cc.instantiate(this._chiItemsList[0])).parent = this._chiItemsList[0].parent;
this._chiItemsList.push(a);
}
a.x = .5 * -e.length * a.width + a.width * i;
a.data = e[i];
a.getComponent(cc.Button).interactable = !0;
a.opacity = 255;
Global.btnClickEvent(a, this.onSelectChi, this);
t += a.width;
var o = e[i].chiData.slice(0);
o.unshift(this._currActionCard);
for (var s = 0; s < 3; ++s) {
var r = cc.find("img_bg/card" + s, a);
this.node.getComponent("PengHu_Card").createCard(o[s], 1, !1, r);
}
}
for (var c = e.length; c < this._chiItemsList.length; ++c) {
this._chiItemsList[c].active = !1;
this._chiItemsList[c].data = null;
}
n.width = t + 80;
cc.find("img_bg/btn_close", this._selectChiNode).getComponent(cc.Widget).updateAlignment();
},
onCloseSelectChi: function() {
this._selectChiNode && (this._selectChiNode.active = !1);
this._operateNode && (this._operateNode.active = !1);
this._selectLuoNode && (this._selectLuoNode.active = !1);
},
onSelectChi: function(e) {
var t = e.target.data;
if (t) if (t.luoData.length == t.luoCount) {
cc.vv.gameData.chi(t);
e.target.data = null;
this.onCloseSelectChi();
} else {
this._selectChiNode && (this._selectChiNode.active = !1);
null === this._chi.chiData && (this._chi.chiData = t.chiData);
this._chi.luoCount = t.luoCount;
this.initLuoData(t.luoData);
}
},
onHu: function() {},
onGuo: function(e) {
cc.vv.gameData.pass();
this.closeOperate();
},
closeOperate: function() {
this._operateNode.active = !1;
},
onChi: function(e) {
var t = e.target.data;
if (t) if (1 === t.length) {
cc.vv.gameData.chi(t[0]);
e.target.data = null;
} else {
this._chi = {
chiData: null,
luoData: [],
luoCount: t.luoCount
};
this.showSelectChi(t);
}
this.closeOperate();
},
onPeng: function(e) {
cc.vv.gameData.peng();
this.closeOperate();
},
disenableBtn: function() {
this._btnChi.getComponent(cc.Button).interactable = !1;
this._btnPeng.getComponent(cc.Button).interactable = !1;
this._btnGuo.getComponent(cc.Button).interactable = !1;
this._btnHu.getComponent(cc.Button).interactable = !1;
},
enableBtn: function(e) {
var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
e.getComponent(cc.Button).interactable = !0;
e.stopAllActions();
e.data = t;
},
recvActionNotify: function(e) {
0 < (e = e.detail).actionInfo.waitList.length ? this.showOperate(e) : this.onCloseSelectChi();
},
showOperate: function(e) {
this.disenableBtn();
this._currActionCard = e.actionInfo.curaction.card;
this._operateNode.active = !1;
if (e.actionInfo.waitList) for (var t = 0; t < e.actionInfo.waitList.length; ++t) if (e.actionInfo.waitList[t].seat === cc.vv.gameData.getMySeatIndex()) {
this._operateNode.active = !0;
e.actionInfo.waitList[t].type === cc.vv.gameData.OPERATETYPE.CHI ? this.enableBtn(this._btnChi, e.actionInfo.waitList[t].data) : e.actionInfo.waitList[t].type === cc.vv.gameData.OPERATETYPE.GU0 ? this.enableBtn(this._btnGuo) : e.actionInfo.waitList[t].type === cc.vv.gameData.OPERATETYPE.PENG && this.enableBtn(this._btnPeng);
}
},
registerMsg: function() {
Global.registerEvent(EventId.CLEARDESK, this.clearDesk, this);
Global.registerEvent(EventId.OUTCARD_NOTIFY, this.recvActionNotify, this);
Global.registerEvent(EventId.CHI_NOTIFY, this.onCloseSelectChi, this);
Global.registerEvent(EventId.PENG_NOTIFY, this.onCloseSelectChi, this);
Global.registerEvent(EventId.PAO_NOTIFY, this.onCloseSelectChi, this);
Global.registerEvent(EventId.KAN_NOTIFY, this.onCloseSelectChi, this);
Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO, this.recvDeskInfoMsg, this);
},
recvDeskInfoMsg: function() {
var e = cc.vv.gameData.getDeskInfo();
e.isReconnect && e.actionInfo.iswait && this.showOperate(e);
},
onDestroy: function() {
this._selectChiNode && cc.loader.releaseRes("common/prefab/chi", cc.Prefab);
}
});
cc._RF.pop();
}, {} ],
PengHu_OutCard: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "7f9d7uzJ95P8YGVA3iCqb3w", "PengHu_OutCard");
cc.Class({
extends: cc.Component,
properties: {
_outCardNode: null,
_chairId: -1,
_seatIndex: -1,
_playerNum: 0,
_startPos: null,
_angle: 0,
_cardsNum: 0,
_outCardValue: null
},
init: function(e, t) {
var n = cc.find("scene/out_cards/out_card" + e, this.node), i = cc.find("scene/out_cards/show_card" + e, this.node);
if (4 === (this._playerNum = t)) {
this._outCardNode = n;
this._chairId = e;
} else if (0 == e || 2 == e) {
this._outCardNode = n;
this._chairId = 0 < e ? 1 : 0;
}
if (this._outCardNode) {
var a = i.parent.convertToWorldSpaceAR(i.position);
this._startPos = this._outCardNode.convertToNodeSpaceAR(a);
this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId);
}
},
getEndPos: function(e) {
var t = cc.v2(0, 0), n = parseInt(e / 5), i = e % 5;
if (0 === this._chairId) {
t.x = 37 * i;
t.y = 36 * n;
} else if (4 === this._playerNum && 1 === this._chairId) {
t.y = 36 * n;
t.x = -37 * i;
} else if (2 === this._playerNum && 1 === this._chairId || 2 === this._chairId) {
t.x = 37 * i;
t.y = -36 * n;
} else if (3 === this._chairId) {
t.y = 36 * i;
t.x = -37 * n;
}
return t;
},
showCard: function(e) {
var t = 1 < arguments.length && void 0 !== arguments[1] && arguments[1], n = this.node.getComponent("PengHu_Card").createCard(e, t ? 0 : 2), i = this.getEndPos(this._cardsNum);
t ? this.showCardAction(n, cc.v2(this._startPos.x, this._startPos.y), cc.v2(i.x, i.y)) : n.position = i;
n.parent = this._outCardNode;
n.cardValue = e;
++this._cardsNum;
},
clearDesk: function() {
this._outCardValue = null;
this._cardsNum = 0;
this._outCardNode && this._outCardNode.removeAllChildren();
},
start: function() {
Global.registerEvent(EventId.CLEARDESK, this.clearDesk, this);
Global.registerEvent(EventId.PLAYER_ENTER, this.recvPlayerEnter, this);
Global.registerEvent(EventId.PLAYER_EXIT, this.recvPlayerExit, this);
Global.registerEvent(EventId.PENG_NOTIFY, this.recvPengNotify, this);
Global.registerEvent(EventId.OUTCARD_NOTIFY, this.recvOutCardNotify, this);
Global.registerEvent(EventId.GUO_NOTIFY, this.recvGuoNotify, this);
Global.registerEvent(EventId.MOPAI_NOTIFY, this.recvMoPaiNotify, this);
Global.registerEvent(EventId.CHI_NOTIFY, this.recvChiCard, this);
Global.registerEvent(EventId.PAO_NOTIFY, this.recvPaoNotify, this);
Global.registerEvent(EventId.LONG_NOTIFY, this.showOutCard, this);
Global.registerEvent(EventId.KAN_NOTIFY, this.showOutCard, this);
Global.registerEvent(EventId.HU_NOTIFY, this.showOutCard, this);
Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO, this.recvDeskInfoMsg, this);
this.recvDeskInfoMsg();
},
recvDeskInfoMsg: function() {
var e = cc.vv.gameData.getDeskInfo();
if (e.isReconnect) for (var t = 0; t < e.users.length; ++t) if (this._seatIndex === e.users[t].seat && e.users[t].qipai) {
var n = e.users[t].qipai;
if (this._outCardNode.childrenCount !== n.length) {
this._cardsNum = 0;
this._outCardNode.removeAllChildren();
for (var i = 0; i < n.length; ++i) this.showCard(n[i]);
break;
}
}
},
recvGuoNotify: function(e) {
e = e.detail;
this.showOutCard();
if (e.actionInfo.nextaction.type === cc.vv.gameData.OPERATETYPE.MOPAI && e.actionInfo.curaction.seat === this._seatIndex) {
var t = e.actionInfo.curaction.card;
this.putOutCard(t);
}
},
recvChiCard: function(e) {
e = e.detail;
this.showOutCard();
if (e.actionInfo.curaction.seat === this._seatIndex && e.luoData) for (var t = 0; t < e.luoData.length; ++t) this.showCard(e.luoData[t], !0);
},
recvMoPaiNotify: function(e) {
e = e.detail;
this.showOutCard();
},
recvOutCardNotify: function(e) {
e = e.detail;
this.showOutCard();
if (e.actionInfo.curaction.seat === this._seatIndex && 0 === e.actionInfo.iswait) if (0 === e.actionInfo.curaction.source) {
this.putOutCard(e.actionInfo.curaction.card);
this.showOutCard();
} else this.putOutCard(e.actionInfo.curaction.card);
},
putOutCard: function(e) {
this._outCardValue = [];
this._outCardValue.push(e);
},
recvPaoNotify: function(e) {
if ((e = e.detail).delQiPaiSeat === this._seatIndex) {
for (var t = e.delQiPaiCard, n = null, i = 0, a = 0; a < this._outCardNode.childrenCount; ++a) {
var o = this._outCardNode.children[a];
if (o.cardValue === t) n = o; else {
if (n) {
var s = this.getEndPos(i);
n.position = s;
}
++i;
}
}
if (n) {
this._cardsNum = i;
n.removeFromParent();
}
}
},
recvPengNotify: function(e) {
if ((e = e.detail).actionInfo.curaction.source === this._seatIndex) {
this.putOutCard(e.actionInfo.curaction.card);
this.showOutCard();
}
},
showOutCard: function() {
if (this._outCardValue) {
for (var e = 0; e < this._outCardValue.length; ++e) this.showCard(this._outCardValue[e], !0);
this._outCardValue = null;
}
},
recvPlayerEnter: function(e) {
e = e.detail;
cc.vv.gameData.getLocalChair(e.seat) === this._chairId && (this._seatIndex = e.seat);
},
showCardAction: function(e, t, n) {
var i = this;
e.position = t;
e.scale = 1;
var a = cc.vv.gameData.getActionTime();
e.opacity = 255;
e.runAction(cc.sequence(cc.spawn(cc.moveTo(a, n), cc.scaleTo(a, .48), cc.fadeTo(a, 50)), cc.callFunc(function() {
i.node.getComponent("PengHu_Card").createCard(e.cardValue, 2, e.showBg, e);
e.scale = 1;
e.rotation = 0;
e.opacity = 255;
})));
},
recvPlayerExit: function(e) {
(e = e.detail) === this._seatIndex && (this._seatIndex = -1);
}
});
cc._RF.pop();
}, {} ],
PengHu_Player: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "f00f3hElOBEMbj/gqKiKnJs", "PengHu_Player");
cc.Class({
extends: cc.Component,
properties: {
_playerNode: null,
_chairId: -1,
_seatIndex: -1,
_score: 0,
_emjoNode: null,
_chatNode: null,
_atlas: null
},
init: function(e, t, n) {
this._atlas = n;
var i = cc.find("scene/player" + e, this.node);
i.active = !1;
if (4 === t) {
this._playerNode = i;
this._chairId = e;
} else if (0 == e || 2 == e) {
this._playerNode = i;
this._chairId = 0 < e ? 1 : 0;
}
if (this._playerNode) {
this.registerMsg();
for (var a = cc.vv.gameData.getUsers(), o = 0; o < a.length; ++o) {
if (cc.vv.gameData.getLocalChair(a[o].seat) === this._chairId) {
this._seatIndex = a[o].seat;
this.initPlayerInfo(a[o]);
}
}
this._emjoNode = this._playerNode.getChildByName("emoj");
this._emjoNode.active = !1;
this._chatNode = this._playerNode.getChildByName("chat");
this._chatNode.active = !1;
this.recvDeskInfoMsg();
}
},
onRcvReadyNotice: function(e) {
(e = e.detail).seat === this._seatIndex && this.showReady(!0);
},
showReady: function(e) {
this._playerNode && (this._playerNode.getChildByName("ready").active = e);
},
registerMsg: function() {
cc.vv.NetManager.registerMsg(MsgId.NOTICE_PLAYER_ENTER, this.onRcvPlayerComeNotice, this);
cc.vv.NetManager.registerMsg(MsgId.NOTICE_PLAYER_EXIT, this.onRcvPlayerExitNotice, this);
Global.registerEvent(EventId.HANDCARD, this.onRecvHandCard, this);
Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO, this.recvDeskInfoMsg, this);
Global.registerEvent(EventId.CHAT_NOTIFY, this.onRcvChatNotify, this);
Global.registerEvent(EventId.READY_NOTIFY, this.onRcvReadyNotice, this);
Global.registerEvent(EventId.OFFLINE_NOTIFY, this.onRcvOfflineNotice, this);
Global.registerEvent(EventId.KAN_NOTIFY, this.updateScore, this);
Global.registerEvent(EventId.PENG_NOTIFY, this.updateScore, this);
Global.registerEvent(EventId.PAO_NOTIFY, this.updateScore, this);
Global.registerEvent(EventId.LONG_NOTIFY, this.updateScore, this);
Global.registerEvent(EventId.HANDCARD, this.updateScore, this);
Global.registerEvent(EventId.HU_NOTIFY, this.recvRoundOver, this);
},
onRcvOfflineNotice: function(e) {
(e = e.detail).seat === this._seatIndex && this.showOffline(1 === e.ofline);
},
recvRoundOver: function(e) {
e = e.detail;
for (var t = 0; t < e.users.length; ++t) if (e.users[t].seat === this._seatIndex) {
this._score = e.users[t].score;
this.setTotalScore(this._score);
this.setHuXi(e.users[t].roundScore);
break;
}
},
unregisterMsg: function() {
cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_PLAYER_ENTER, this.onRcvPlayerComeNotice, !1, this);
cc.vv.NetManager.unregisterMsg(MsgId.NOTICE_PLAYER_EXIT, this.onRcvPlayerExitNotice, !1, this);
},
onRcvChatNotify: function(e) {
var t = this;
if (200 === (e = e.detail).code && e.chatInfo.seat === this._seatIndex) if (1 === e.chatInfo.type) {
var n = Global.getEmjoList()[e.chatInfo.index];
this._emjoNode.stopAllActions();
this._emjoNode.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame("penghu_onwer-prime-imgs-bq-biaoqing_" + n);
this._emjoNode.active = !0;
for (var i = [], a = this._emjoNode.y = 0; a < 6; ++a) i.push(cc.moveTo(.3, a % 2 == 0 ? cc.v2(0, 5) : cc.v2(0, 0)));
i.push(cc.callFunc(function() {
t._emjoNode.active = !1;
}));
this._emjoNode.runAction(cc.sequence(i));
} else {
this._chatNode.active = !0;
this._chatNode.stopAllActions();
var o = Global.getShortList();
this._chatNode.getChildByName("label").getComponent(cc.Label).string = o[e.chatInfo.index];
this._chatNode.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function() {
t._chatNode.active = !1;
})));
}
},
updateScore: function(e) {
if (this._playerNode) for (var t = (e = e.detail).notyScoreChang, n = 0; n < t.length; ++n) t[n].seat === this._seatIndex && this.setHuXi(t[n].roundScore);
},
recvDeskInfoMsg: function() {
var e = cc.vv.gameData.getDeskInfo();
if (e.isReconnect) for (var t = 0; t < e.users.length; ++t) if (this._seatIndex === e.users[t].seat) {
this.initPlayerInfo(e.users[t]);
this.showZhuang(e.bankerInfo.seat === this._seatIndex);
}
},
onRecvHandCard: function(e) {
var t = e.detail.bankerInfo;
if (t.seat === this._seatIndex) {
this.showZhuang(!0);
var n = cc.find("sp_flag/count", this._playerNode);
n.active = 0 < t.count;
n.getComponent(cc.Label).string = t.count;
}
},
onRcvPlayerExitNotice: function(e) {
if (200 === e.code) {
if (cc.vv.gameData.getLocalChair(e.seat) === this._chairId) {
this._seatIndex = -1;
this._playerNode && (this._playerNode.active = !1);
}
}
},
onRcvPlayerComeNotice: function(e) {
if (200 === e.code) {
if (cc.vv.gameData.getLocalChair(e.user.seat) === this._chairId) {
this.initPlayerInfo(e.user);
this._seatIndex = e.user.seat;
}
}
},
initPlayerInfo: function(e) {
if (e) {
var t = cc.find("head/radio_mask/spr_head", this._playerNode);
Global.setHead(t, e.usericon);
cc.find("img_bg/txt_name", this._playerNode).getComponent(cc.Label).string = e.playername;
this.setTotalScore(e.score);
this.showOffline(1 === e.ofline);
this._playerNode.active = !0;
this.showZhuang(!1);
this.setHuXi(e.roundScore ? e.roundScore : 0);
this.showReady(1 === e.state);
}
},
showOffline: function(e) {
this._playerNode && (this._playerNode.getChildByName("img_off_line").active = e);
},
setHuXi: function(e) {
this._playerNode && (this._playerNode.getChildByName("txt_cur_score").getComponent(cc.Label).string = e + "胡");
},
setTotalScore: function(e) {
this._playerNode && (cc.find("img_bg/txt_total_score", this._playerNode).getComponent(cc.Label).string = "总胡:" + e);
},
showZhuang: function(e) {
this._playerNode && (this._playerNode.getChildByName("sp_flag").active = e);
},
recvSendCard: function() {
this.showReady(!1);
},
start: function() {
Global.registerEvent(EventId.CLEARDESK, this.clearDesk, this);
Global.registerEvent(EventId.HANDCARD, this.recvSendCard, this);
},
clearDesk: function() {
this.setHuXi(0);
this.showZhuang(!1);
},
onDestroy: function() {
this._playerNode && this.unregisterMsg();
}
});
cc._RF.pop();
}, {} ],
PengHu_RemainCard: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "7eba5gFSslPmK7W/zizNv67", "PengHu_RemainCard");
cc.Class({
extends: cc.Component,
properties: {
_handCardNodeList: []
},
start: function() {
for (var e = 1; e < 4; ++e) {
var t = cc.find("scene/playback_handle/player" + e, this.node);
this._handCardNodeList.push(t);
}
this._handCardNodeList.push(cc.find("scene/playback_handle/public", this.node));
Global.registerEvent(EventId.CLEARDESK, this.clearDesk, this);
Global.registerEvent(EventId.HU_NOTIFY, this.recvGameOver, this);
},
recvGameOver: function(e) {
for (var t = (e = e.detail).users, n = 0; n < t.length; ++n) {
var i = cc.vv.gameData.getLocalChair(t[n].seat);
if (0 !== i) {
1 === i && 2 === cc.vv.gameData.getPlayerNum() && (i = 2);
var a = cc.find("scene/playback_handle/player" + i, this.node);
this.showHandCard(t[n].handInCards, a);
}
}
for (var o = cc.find("scene/playback_handle/public", this.node), s = 0; s < e.diPai.length; ++s) {
var r = this.node.getComponent("PengHu_Card").createCard(e.diPai[s], 2);
r.y = -r.height * parseInt(s / 6);
r.x = r.width * parseInt(s % 6);
r.parent = o;
}
},
showHandCard: function(e, t) {
for (var n = cc.vv.gameData.sortCard(e), i = 0; i < n.length; ++i) for (var a = 0; a < n[i].length; ++a) {
var o = this.node.getComponent("PengHu_Card").createCard(n[i][a], 2);
o.y = o.height * a;
o.x = o.width * i;
o.parent = t;
}
},
clearDesk: function() {
for (var e = this._num = 0; e < this._handCardNodeList.length; ++e) this._handCardNodeList[e].removeAllChildren(!0);
}
});
cc._RF.pop();
}, {} ],
PengHu_RoundOver: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "57ce9Lnl9ZAv47SMH9dJQqk", "PengHu_RoundOver");
cc.Class({
extends: cc.Component,
properties: {
_overRoundNode: null,
_show: !1,
_isOver: !1,
_OverScoreNode: null,
_zhuang: -1
},
start: function() {
Global.registerEvent(EventId.HU_NOTIFY, this.recvRoundOver, this);
Global.registerEvent(EventId.CLEARDESK, this.clearDesk, this);
Global.registerEvent(EventId.GAMEOVER, this.recvGameOver, this);
Global.registerEvent(EventId.HANDCARD, this.onRecvHandCard, this);
Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO, this.recvDeskInfoMsg, this);
this._OverScoreNode = cc.find("scene/over_score", this.node);
this._OverScoreNode.active = !1;
},
onRecvHandCard: function(e) {
e = e.detail;
this._zhuang = e.bankerInfo.seat;
},
recvDeskInfoMsg: function() {
this._zhuang = cc.vv.gameData.getDeskInfo().bankerInfo.seat;
},
init: function(e) {
this._atlas = e;
},
createType: function(e) {
var t = new cc.Node(), n = t.addComponent(cc.Sprite), i = "";
e === cc.vv.gameData.OPERATETYPE.CHI ? i = "penghu_onwer-table-imgs-wz_chi" : e === cc.vv.gameData.OPERATETYPE.KAN ? i = "penghu_onwer-table-imgs-wz_kan" : e === cc.vv.gameData.OPERATETYPE.PAO ? i = "penghu_onwer-table-imgs-wz_pao" : e === cc.vv.gameData.OPERATETYPE.LONG ? i = "penghu_onwer-table-imgs-wz_tilong" : e === cc.vv.gameData.OPERATETYPE.SAO ? i = "penghu_onwer-table-imgs-wz_sao" : e === cc.vv.gameData.OPERATETYPE.PENG && (i = "penghu_onwer-table-imgs-wz_peng");
n.spriteFrame = this._atlas.getSpriteFrame(i);
return t;
},
recvGameOver: function() {
this._isOver = !0;
},
recvRoundOver: function(n) {
var i = this;
n = n.detail;
null === this._overRoundNode && cc.loader.loadRes("common/prefab/round_over_view", function(e, t) {
if (null === e) {
i._overRoundNode = cc.instantiate(t);
i._overRoundNode.parent = i.node.getChildByName("scene");
i._overRoundNode.zIndex = 3;
i._overRoundNode.active = !1;
i._overRoundNode.x = i.node.width / 2;
i._overRoundNode.y = i.node.height / 2;
i.initPlayerInfo(n.users, n.seat, n.hcard, n.source, n.hupaiType);
i.initRoomInfo(0 < n.seat);
i.scheduleOnce(function() {
i._overRoundNode.active = !0;
}, 2);
}
});
this._OverScoreNode.active = !0;
for (var e = 0; e < n.users.length; ++e) {
var t = cc.vv.gameData.getLocalChair(n.users[e].seat);
1 === t && 2 === cc.vv.gameData.getPlayerNum() && (t = 2);
var a = this._OverScoreNode.getChildByName("score" + t);
a.getComponent(cc.Label).string = n.users[e].roundScore + "胡";
a.color = 0 < n.users[e].roundScore ? new cc.Color(236, 187, 111) : new cc.Color(209, 114, 96);
}
this._OverScoreNode.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function() {
i._OverScoreNode.active = !1;
})));
},
initPlayerInfo: function(e, t, n, i, a) {
for (var o = 0; o < 4; ++o) if (o < e.length) {
var s = cc.vv.gameData.getLocalChair(e[o].seat), r = cc.find("sp_bg/player" + s, this._overRoundNode);
r.active = !0;
var c = cc.find("overUser/head", r);
c.getChildByName("name").getComponent(cc.Label).string = e[o].playername;
c.getChildByName("id").getComponent(cc.Label).string = "ID:" + e[o].uid;
var l = cc.find("radio_mask/spr_head", c);
Global.setHead(l, e[o].usericon);
var h = r.getChildByName("panel_cards"), d = null;
(i === e[o].seat || 0 === i && e[o].seat === t) && (d = n);
e[o].seat, this.initHandCard(e[o].handInCards, h, e[o].menzi, d, i);
var u = r.getChildByName("lbl_num");
u.getComponent(cc.Label).string = e[o].roundScore;
var g = r.getChildByName("img_signal");
g.active = e[o].roundScore < 0;
g.x = u.x - u.width - g.width;
r.getChildByName("wz_fangpao").active = 0 < a && 0 < i && e[o].seat === i;
r.getChildByName("wz_chouzhuang").active = a <= 0 && e[o].seat === t;
var _ = r.getChildByName("huflag_bg");
_.active = 0 < a && e[o].seat === t;
var f = _.getChildByName("huflag");
0 < a && this.showHuType(a, f);
} else cc.find("sp_bg/player" + o, this._overRoundNode).active = !1;
},
showHuType: function(e, t) {
var n = "";
1 === e ? n = "penghu_onwer-table-imgs-huflag_12" : 2 === e ? n = "penghu_onwer-table-imgs-huflag_0" : 3 === e || 14 === e || 15 === e ? n = "penghu_onwer-table-imgs-huflag_1" : 4 === e ? n = "penghu_onwer-table-imgs-huflag_5" : 5 === e ? n = "penghu_onwer-table-imgs-huflag_6" : 6 === e ? n = "penghu_onwer-table-imgs-huflag_13" : 7 === e ? n = "penghu_onwer-table-imgs-huflag_9" : 8 === e ? n = "penghu_onwer-table-imgs-huflag_8" : 9 === e ? n = "penghu_onwer-table-imgs-huflag_13" : 10 === e ? n = "penghu_onwer-table-imgs-huflag_7" : 11 === e ? n = "penghu_onwer-table-imgs-huflag_11" : 12 === e ? n = "penghu_onwer-table-imgs-huflag_3" : 13 === e ? n = "penghu_onwer-table-imgs-huflag_2" : 16 === e && (n = "penghu_onwer-table-imgs-huflag_4");
t.getComponent(cc.Sprite).spriteFrame = this._atlas.getSpriteFrame(n);
},
initRoomInfo: function(e) {
var t = cc.vv.gameData.getRoomConf();
cc.find("sp_bg/roomInfoNode/txt_room_id", this._overRoundNode).getComponent(cc.Label).string = "游戏号:" + t.deskId;
cc.find("sp_bg/roomInfoNode/txt_round_num", this._overRoundNode).getComponent(cc.Label).string = "(" + cc.vv.gameData.getDeskInfo().round + "/" + t.gamenum + "局)";
for (var n = cc.find("sp_bg/roomInfoNode/txt_game_desc", this._overRoundNode), i = "", a = cc.vv.gameData.getWanFa(), o = 0; o < a.length; ++o) i += a[o];
n.getComponent(cc.Label).string = i;
var s = this._overRoundNode.getChildByName("btn_comfirm");
Global.btnClickEvent(s, this.onClose, this);
},
onClose: function() {
this._overRoundNode.removeFromParent(!0);
this._overRoundNode = null;
this._show = !1;
this._isOver ? Global.dispatchEvent(EventId.SHOW_GAMEOVER) : Global.dispatchEvent(EventId.CLOSE_ROUNDVIEW);
},
initHandCard: function(e, t, n) {
for (var i = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null, a = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : null, o = cc.vv.gameData.sortCard(e), s = 0, r = 0; r < o.length; ++r) for (var c = 0; c < o[r].length; ++c) {
var l = this.node.getComponent("PengHu_Card").createCard(o[r][c], 1);
l.scale = .5;
l.y = (l.height - 28) * c * l.scale + 20;
l.x = l.width * r * l.scale + 20;
l.zIndex = 4 - c;
l.parent = t;
0 === c && (s = l.x + l.scale * l.width * .5);
}
for (var h = 0; h < n.length; ++h) {
var d = [], u = n[h], g = this.createType(u.type);
g.parent = t;
g.zIndex = 1;
u.type === cc.vv.gameData.OPERATETYPE.KAN ? d = [ u.card, u.card, u.card ] : u.type === cc.vv.gameData.OPERATETYPE.LONG || u.type === cc.vv.gameData.OPERATETYPE.SHE || u.type === cc.vv.gameData.OPERATETYPE.PAO ? d = [ u.card, u.card, u.card, u.card ] : u.type === cc.vv.gameData.OPERATETYPE.PENG ? d = 0 < u.source ? [ u.card, u.card, u.card ] : [ u.card, u.card ] : u.type === cc.vv.gameData.OPERATETYPE.CHI && (d = u.data);
for (var _ = 0, f = 0, v = 0; v < d.length; ++v) {
var p = this.node.getComponent("PengHu_Card").createCard(d[v], 0);
p.scale = .45;
p.x = s + p.width * p.scale;
p.y = 44;
p.parent = t;
s += p.width * p.scale;
if (1 === v) {
f = p.height * p.scale * .5 + 40;
3 === d.length ? _ = p.x : 4 === d.length ? _ = p.x + p.width * p.scale : 2 === d.length && (_ = p.x - p.width * p.scale);
}
}
g.x = _;
g.y = f;
s += 10;
}
if (i) {
var m = new cc.Node();
m.addComponent(cc.Sprite);
this.node.getComponent("PengHu_Card").changCardBg(m, 0 === a);
var b = this.node.getComponent("PengHu_Card").createCard(i, 0);
m.y = 43;
m.x = s + 60;
m.scale = .6;
(b.parent = m).parent = t;
}
},
clearDesk: function() {
this._num = 0;
if (this._overRoundNode) {
this._overRoundNode.removeFromParent(!0);
this._overRoundNode = null;
}
this._show = !1;
this._OverScoreNode.active = !1;
},
onDestroy: function() {
this._overRoundNode && cc.loader.releaseRes("common/prefab/round_over_view", cc.Prefab);
}
});
cc._RF.pop();
}, {} ],
PengHu_Setting: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "05b89ciqpdISZR9WQk46lm2", "PengHu_Setting");
cc.Class({
extends: cc.Component,
properties: {
_settingNode: null,
_btn_music: null,
_btn_effect: null,
_musicValue: 1,
_effectValue: 1,
_language: 0
},
start: function() {
this._musicValue = cc.sys.localStorage.getItem("music");
null === this._musicValue && (this._musicValue = 1);
this._effectValue = cc.sys.localStorage.getItem("effect");
null === this._effectValue && (this._effectValue = 1);
Global.registerEvent(EventId.SHOW_SETTING, this.showSetting, this);
},
showSetting: function() {
var o = this;
null === this._settingNode ? cc.loader.loadRes("common/prefab/SettingLayer", cc.Prefab, function(e, t) {
if (null === e) {
o._settingNode = cc.instantiate(t);
o._settingNode.parent = o.node;
o._settingNode.zIndex = 4;
o._settingNode.width = o.node.width;
o._settingNode.height = o.node.height;
var n = o._settingNode.getChildByName("btn_close");
Global.btnClickEvent(n, o.onClose, o);
var i = o._settingNode.getChildByName("btn_real_music"), a = o._settingNode.getChildByName("btn_real_effect");
cc.find("language/toggle1", o._settingNode).getComponent(cc.Toggle).isChecked = 0 == Global.language;
cc.find("language/toggle2", o._settingNode).getComponent(cc.Toggle).isChecked = 1 == Global.language;
o._btn_music = o._settingNode.getChildByName("btn_music");
o._btn_effect = o._settingNode.getChildByName("btn_effect");
Global.btnClickEvent(i, o.setMusic, o);
Global.btnClickEvent(a, o.setEffct, o);
o.showSettingAction();
o.setOperate(o._musicValue, o._btn_music);
o.setOperate(o._effectValue, o._btn_effect);
}
}) : this.showSettingAction();
},
setMusic: function() {
this._musicValue = 0 == this._musicValue ? 1 : 0;
this.setOperate(this._musicValue, this._btn_music);
cc.sys.localStorage.setItem("music", this._musicValue);
cc.vv.AudioManager.setBgmVolume(this._musicValue);
},
setOperate: function(e, t) {
t.x = 0 == e ? 47 : 163;
},
setEffct: function() {
this._effectValue = 0 == this._effectValue ? 1 : 0;
this.setOperate(this._effectValue, this._btn_effect);
cc.sys.localStorage.setItem("effect", this._effectValue);
cc.vv.AudioManager.setEffVolume(this._effectValue);
},
onClose: function() {
this._settingNode.active = !1;
cc.find("language/toggle1", this._settingNode).getComponent(cc.Toggle).isChecked ? this._language = 0 : this._language = 1;
cc.sys.localStorage.setItem("language", this._language);
Global.language = this._language;
},
showSettingAction: function() {
this._settingNode.active = !0;
this._settingNode.scale = 0;
this._settingNode.runAction(cc.scaleTo(.2, 1).easing(cc.easeBackOut()));
},
onDestroy: function() {
this._settingNode && cc.loader.releaseRes("common/prefab/SettingLayer", cc.Prefab);
}
});
cc._RF.pop();
}, {} ],
PengHu_ShowCard: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "e2e5cQYvR1LQ6itfD+otN6t", "PengHu_ShowCard");
cc.Class({
extends: cc.Component,
properties: {
_showCardNode: null,
_chairId: -1,
_seatIndex: -1,
_playerNum: 0,
_pos: null,
_cardBoXPos: null,
_cardValue: null,
_cardPos: null
},
init: function(e, t) {
var n = cc.find("scene/out_cards/show_card" + e, this.node);
n.active = !1;
var i = cc.find("scene/cardBox", this.node);
this._cardBoXPos = i.parent.convertToWorldSpaceAR(i.position);
this._pos = cc.v2(n.x, n.y);
if (4 === t) {
this._showCardNode = n;
this._chairId = e;
} else if (0 == e || 2 == e) {
this._showCardNode = n;
this._chairId = 0 < e ? 1 : 0;
}
this._showCardNode && (this._seatIndex = cc.vv.gameData.getUserSeatIndex(this._chairId));
},
showCard: function(e) {
this._showCardNode.scale = 1;
this._showCardNode.opacity = 255;
var t = this.node.getComponent("PengHu_Card").createCard(e, 0, 0 == e, this._showCardNode);
this._showCardNode.active = !0;
this._cardValue = e;
return t;
},
recvOutcardNotify: function(e) {
e = e.detail;
if (this._cardValue) 0 === e.actionInfo.iswait && this.clearDesk(); else if (e.actionInfo.curaction.seat === this._seatIndex && e.actionInfo.curaction.type === cc.vv.gameData.OPERATETYPE.PUT) {
this.showCard(e.actionInfo.curaction.card);
this.node.getComponent("PengHu_Card").changCardBg(this._showCardNode.getChildByName("card_light"), !1);
var t = cc.vv.gameData.getLocalChair(e.actionInfo.curaction.seat);
2 === cc.vv.gameData.getPlayerNum() && 1 === t && (t = 2);
var n = cc.find("scene/player" + t, this.node), i = n.position;
if (0 === this._chairId) {
i = this._cardPos ? cc.v2(this._cardPos.x, this._cardPos.y) : cc.v2(this._cardBoXPos.x, this._cardBoXPos.y);
this.showCardAction(i, 0 === e.actionInfo.iswait && 0 < e.actionInfo.source);
this._cardPos = null;
} else this.showCardAction(n.parent.convertToWorldSpaceAR(i), 0 === e.actionInfo.iswait && 0 < e.actionInfo.source);
}
},
recvChiCard: function(e) {
e = e.detail;
this.clearDesk();
},
recvMyOutCard: function(e) {
e = e.detail;
0 === this._chairId && (this._cardPos = e.pos);
},
recvMoPaiNotify: function(e) {
if ((e = e.detail).seat === this._seatIndex) {
this.showCard(e.card);
this.node.getComponent("PengHu_Card").changCardBg(this._showCardNode.getChildByName("card_light"), !0);
this.showCardAction(this._cardBoXPos);
} else this.clearDesk();
},
showCardAction: function(e) {
var t = this, n = this._showCardNode.parent.convertToNodeSpaceAR(e);
this._showCardNode.stopAllActions();
this._showCardNode.position = n;
this._showCardNode.scale = 0;
this._showCardNode.opacity = 50;
var i = cc.vv.gameData.getActionTime();
this._showCardNode.runAction(cc.sequence(cc.spawn(cc.moveTo(i, this._pos).easing(cc.easeOut(3)), cc.scaleTo(i, 1), cc.fadeTo(i, 255)), cc.callFunc(function() {
t._showCardNode.scale = 1;
t._showCardNode.opacity = 255;
})));
},
clearDesk: function() {
this._cardValue = null;
this._showCardNode && (this._showCardNode.active = !1);
},
start: function() {
Global.registerEvent(EventId.CLEARDESK, this.clearDesk, this);
Global.registerEvent(EventId.OUTCARD, this.recvMyOutCard, this);
Global.registerEvent(EventId.OUTCARD_NOTIFY, this.recvOutcardNotify, this);
Global.registerEvent(EventId.CHI_NOTIFY, this.recvChiCard, this);
Global.registerEvent(EventId.MOPAI_NOTIFY, this.recvMoPaiNotify, this);
Global.registerEvent(EventId.PLAYER_ENTER, this.recvPlayerEnter, this);
Global.registerEvent(EventId.PLAYER_EXIT, this.recvPlayerExit, this);
Global.registerEvent(EventId.KAN_NOTIFY, this.recvKanNotify, this);
Global.registerEvent(EventId.GUO_NOTIFY, this.recvGuoNotify, this);
Global.registerEvent(EventId.PENG_NOTIFY, this.recvPengNotify, this);
Global.registerEvent(EventId.PAO_NOTIFY, this.clearDesk, this);
Global.registerEvent(EventId.LONG_NOTIFY, this.clearDesk, this);
Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO, this.recvDeskInfoMsg, this);
Global.registerEvent(EventId.HU_NOTIFY, this.recvRoundOver, this);
this.recvDeskInfoMsg();
},
recvDeskInfoMsg: function() {
var e = cc.vv.gameData.getDeskInfo();
if (e.isReconnect) if (1 === e.smallState) {
if (e.actionInfo.curaction.type === cc.vv.gameData.OPERATETYPE.PUT || e.actionInfo.curaction.type === cc.vv.gameData.OPERATETYPE.MOPAI) {
this.clearDesk();
if (e.actionInfo.curaction.seat === this._seatIndex) {
this._showCardNode.stopAllActions();
this.showCard(e.actionInfo.curaction.card);
this.node.getComponent("PengHu_Card").changCardBg(this._showCardNode.getChildByName("card_light"), 0 === e.actionInfo.curaction.source);
}
}
} else this.clearDesk();
},
recvRoundOver: function(e) {
if (0 < (e = e.detail).hcard) if (0 < e.source) {
if (e.source === this._seatIndex) {
this.showCard(e.hcard);
this.node.getComponent("PengHu_Card").changCardBg(this._showCardNode.getChildByName("card_light"), !1);
}
} else if (e.seat === this._seatIndex) {
this.showCard(e.hcard);
this.node.getComponent("PengHu_Card").changCardBg(this._showCardNode.getChildByName("card_light"), !0);
}
},
recvGuoNotify: function(e) {
e = e.detail;
this._cardValue && this.clearDesk();
},
recvPengNotify: function(e) {
this.clearDesk();
},
recvKanNotify: function(e) {
(e = e.detail).actionInfo.curaction.seat === this._seatIndex && this.clearDesk();
},
recvPlayerEnter: function(e) {
e = e.detail;
cc.vv.gameData.getLocalChair(e.seat) === this._chairId && (this._seatIndex = e.seat);
},
recvPlayerExit: function(e) {
(e = e.detail) === this._seatIndex && (this._seatIndex = -1);
}
});
cc._RF.pop();
}, {} ],
PengHu_Sound: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "6852d/wrI5PAZcHRtp1RvDH", "PengHu_Sound");
cc.Class({
extends: cc.Component,
properties: {
_soundPath: "penghu/"
},
start: function() {
Global.registerEvent(EventId.MOPAI_NOTIFY, this.recvMoPaiNotify, this);
Global.registerEvent(EventId.OUTCARD_NOTIFY, this.recvOutCardNotify, this);
Global.registerEvent(EventId.CHI_NOTIFY, this.playOperate, this);
Global.registerEvent(EventId.PAO_NOTIFY, this.playOperate, this);
Global.registerEvent(EventId.LONG_NOTIFY, this.playOperate, this);
Global.registerEvent(EventId.KAN_NOTIFY, this.recvKanNotify, this);
Global.registerEvent(EventId.HU_NOTIFY, this.recvHuNotify, this);
Global.registerEvent(EventId.PENG_NOTIFY, this.recvPengNotify, this);
Global.registerEvent(EventId.HANDCARD, this.onRecvHandCard, this);
Global.registerEvent(EventId.CHAT_NOTIFY, this.onRcvChatNotify, this);
},
onRcvChatNotify: function(e) {
var t = (e = e.detail).chatInfo;
if (2 === t.type) {
var n = "chattext/" + this.getSex(t.seat) + "chat" + (t.index + 1);
cc.vv.AudioManager.playEff(this._soundPath, n, !0);
}
},
onRecvMenziSound: function(e) {
var t = e.detail;
this.playOperateType(cc.vv.gameData.getMySeatIndex(), t);
},
onRecvHandCard: function(e) {
var t = (e = e.detail).seat;
if (t === cc.vv.gameData.getMySeatIndex()) for (var n = 0; n < e.menzi.length; ++n) {
var i = e.menzi[n];
this.playOperateType(t, i.type);
}
},
playOperate: function(e) {
var t = (e = e.detail).actionInfo.curaction.type, n = e.actionInfo.curaction.seat;
n === cc.vv.gameData.getMySeatIndex() && this.playOperateType(n, t);
},
recvKanNotify: function(e) {
var t = (e = e.detail).actionInfo.curaction.seat;
t === cc.vv.gameData.getMySeatIndex() && this.playOperateType(t, e.kanType);
},
recvPengNotify: function(e) {
var t = (e = e.detail).actionInfo.curaction.seat;
t === cc.vv.gameData.getMySeatIndex() && this.playOperateType(t, e.pengType);
},
playOperateType: function(e, t) {
var n = "";
t === cc.vv.gameData.OPERATETYPE.PENG ? n = "peng" : t === cc.vv.gameData.OPERATETYPE.KAN ? n = "sao" : t === cc.vv.gameData.OPERATETYPE.CHI ? n = "chi" : t === cc.vv.gameData.OPERATETYPE.LONG ? n = "tilong" : t === cc.vv.gameData.OPERATETYPE.PAO ? n = "pao" : t === cc.vv.gameData.OPERATETYPE.PENGSAN ? n = "pengsanda" : t === cc.vv.gameData.OPERATETYPE.PENGSI ? n = "pengsiqing" : t === cc.vv.gameData.OPERATETYPE.KANSAN ? n = "saosanda" : t === cc.vv.gameData.OPERATETYPE.KANSI && (n = "saosiqing");
if (0 < n.length) {
var i = "effect/" + this.getLanguage() + this.getSex(e) + n;
cc.vv.AudioManager.playEff(this._soundPath, i, !0);
}
},
recvHuNotify: function(e) {
if (0 < (e = e.detail).hupaiType) {
var t = "effect/" + this.getLanguage() + this.getSex(e.seat) + "hu";
cc.vv.AudioManager.playEff(this._soundPath, t, !0);
cc.vv.gameData.getMySeatIndex() === e.seat ? cc.vv.AudioManager.playEff(this._soundPath, "win", !0) : cc.vv.AudioManager.playEff(this._soundPath, "loss", !0);
}
},
recvOutCardNotify: function(e) {
0 < (e = e.detail).actionInfo.curaction.source && e.actionInfo.curaction.seat === cc.vv.gameData.getMySeatIndex() && this.playCardSound(e.actionInfo.curaction.card, e.actionInfo.curaction.seat);
},
recvMoPaiNotify: function(e) {
(e = e.detail).seat === cc.vv.gameData.getMySeatIndex() && this.playCardSound(e.card, e.seat);
},
getSex: function(e) {
var t = cc.vv.gameData.getUserInfo(e);
if (t) return 1 === t.sex ? "nan/" : "nv/";
},
getLanguage: function() {
return 1 === Global.language ? "anxiang/" : "normal/";
},
playCardSound: function(e, t) {
var n = e % 100, i = 200 < e ? 16 + n : n, a = "card/" + this.getLanguage() + this.getSex(t) + i;
cc.vv.AudioManager.playEff(this._soundPath, a, !0);
}
});
cc._RF.pop();
}, {} ],
PengHu_Tips: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "3933aiFXkxKZYk5U4iKGKlc", "PengHu_Tips");
cc.Class({
extends: cc.Component,
properties: {
_cardBox: null,
_remaindCards: null
},
start: function() {
this._cardBox = cc.find("scene/cardBox", this.node);
this._cardBox.active = !1;
this._remaindCards = cc.find("scene/cardBox/panel_bg/txt_remain_card", this.node);
Global.registerEvent(EventId.CLEARDESK, this.clearDesk, this);
Global.registerEvent(EventId.HANDCARD, this.onRecvHandCard, this);
Global.registerEvent(EventId.CHI_NOTIFY, this.operateNotify, this);
Global.registerEvent(EventId.KAN_NOTIFY, this.operateNotify, this);
Global.registerEvent(EventId.PENG_NOTIFY, this.operateNotify, this);
Global.registerEvent(EventId.PAO_NOTIFY, this.operateNotify, this);
Global.registerEvent(EventId.LONG_NOTIFY, this.operateNotify, this);
Global.registerEvent(EventId.GUO_NOTIFY, this.operateNotify, this);
Global.registerEvent(EventId.MOPAI_NOTIFY, this.recvMoPaiNotify, this);
Global.registerEvent(EventId.GAME_RECONNECT_DESKINFO, this.recvDeskInfoMsg, this);
this.recvDeskInfoMsg();
},
recvDeskInfoMsg: function() {
var e = cc.vv.gameData.getDeskInfo();
if (e.isReconnect) if (1 === e.smallState) {
this.showDir(1 === e.actionInfo.iswait && 0 < e.actionInfo.curaction.seat ? e.actionInfo.curaction.seat : e.actionInfo.nextaction.seat);
this._cardBox.active = !0;
this.updateRemainCards(e.pulicCardsCnt);
} else this.clearDesk();
},
recvMoPaiNotify: function(e) {
e = e.detail;
this.showDir(e.seat);
this.updateRemainCards(e.pulicCardsCnt);
},
operateNotify: function(e) {
e = e.detail;
this.showDir(1 === e.actionInfo.iswait ? e.actionInfo.curaction.seat : e.actionInfo.nextaction.seat);
},
onRecvHandCard: function(e) {
e = e.detail;
this._cardBox.active = !0;
var t = e.bankerInfo;
this.showDir(t.seat);
e.cardcnt && this.updateRemainCards(e.cardcnt);
},
updateRemainCards: function(e) {
this._remaindCards.getComponent(cc.Label).string = e;
},
showDir: function(e) {
for (var t = cc.vv.gameData.getLocalChair(e), n = cc.vv.gameData.getPlayerNum(), i = 0; i < 4; ++i) {
var a = cc.find("panel_bg/arrow" + i, this._cardBox);
a.active = 2 === n ? 0 === t && 0 === i || 1 === t && 2 === i : t === i;
}
},
clearDesk: function() {
this._cardBox && (this._cardBox.active = !1);
}
});
cc._RF.pop();
}, {} ],
PlatformApi: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "92b32peJvBENoEZp4tchEkE", "PlatformApi");
cc.Class({
extends: cc.Component,
statics: {
_callbackDic: null,
_cbDataList: null,
_IOS_CLASS_NAME: "PlatformIosApi",
_AND_CLASS_NAME: "org/cocos2dx/javascript/PlatformAndroidApi",
init: function() {
setInterval(this.update.bind(this), 100);
},
getAppVersion: function() {
if (Global.isNative()) return this.callPlatformApi("getAppVersion", "()Ljava/lang/String;");
AppLog.warn("Browser call Function [getAppVersion]");
return "1.0.0";
},
getShareInstallInfo: function() {
if (Global.isNative()) return this.callPlatformApi("getShareInstallInfo", "()Ljava/lang/String;");
AppLog.warn("Browser call Function [getAppVersion]");
return "";
},
getTxtFromClipboard: function() {
if (Global.isNative()) return this.callPlatformApi("getTxtFromClipboard", "()Ljava/lang/String;");
g;
AppLog.warn("Browser call Function [getTxtFromClipboard]");
return "";
},
setTxtToClipboard: function(e) {
Global.isNative() ? this.callPlatformApi("setTxtToClipboard", "(Ljava/lang/String;)V", e) : AppLog.warn("Browser call Function [setTxtToClipboard]");
},
getOpenAppUrlDataStr: function() {
if (Global.isNative() && cc.sys.isMobile) return this.callPlatformApi("getOpenAppUrlDataString", "()Ljava/lang/String;");
cc.sys.isBrowser && AppLog.warn("Browser call Function [getOpenAppUrlDataStr]");
return null;
},
openGPSSetting: function() {
Global.isNative() ? this.callPlatformApi("openGPSSetting", "()V") : AppLog.warn("Browser call Function [openGPSSetting]");
},
isOpenGPS: function() {
if (Global.isNative()) return this.callPlatformApi("isOpenGPS", "()Z");
AppLog.warn("Browser call Function [isOpenGPS]");
return !1;
},
getBatteyLevel: function() {
if (Global.isNative()) return this.callPlatformApi("getBatteyLevel", "()F");
AppLog.warn("Browser call Function [getBatteyLevel]");
},
openURL: function(e) {
Global.isNative() ? this.callPlatformApi("openURL", "(Ljava/lang/String;)V", e) : cc.sys.openURL(e);
},
getPackageName: function() {
return Global.isNative() ? this.callPlatformApi("getAPPBundleId", "()Ljava/lang/String;") : "";
},
SdkLogin: function() {
Global.isNative() ? this.callPlatformApi("fbSdkLogin", "()V") : AppLog.warn("Browser call Function [SdkLogin]");
},
SdkLoginOut: function() {
Global.isNative() ? this.callPlatformApi("fbSdkLoginOut", "()V") : AppLog.warn("Browser call Function [SdkLoginOut]");
},
SdkShare: function(e) {
Global.isNative() ? this.callPlatformApi("fbSdkShare", "(Ljava/lang/String;)V", e) : AppLog.warn("Browser call Function [SdkShare]");
},
SdkPay: function(e) {
if (Global.isNative()) {
AppLog.log("--------sdk play platom");
this.callPlatformApi("SdkPay", "(Ljava/lang/String;)V", e);
} else AppLog.warn("Browser call Function [SdkPay]");
},
SdkDelOrderCache: function(e) {
Global.isNative() ? this.callPlatformApi("SdkPayResult", "(Ljava/lang/String;)V", e) : AppLog.warn("Browser call Function [SdkDelOrderCache]");
},
SdkReplaceOrder: function(e) {
Global.isNative() ? this.callPlatformApi("SdkPayReplacement", "(Ljava/lang/String;)V", e) : AppLog.warn("Browser call Function [SdkReplaceOrder]");
},
Copy: function(e) {
if (Global.isNative()) this.callPlatformApi("copy", "(Ljava/lang/String;)V", e); else {
AppLog.warn("Browser call Function [Copy]");
console.log("copy data:" + e);
}
},
Paste: function(e) {
Global.isNative() ? this.callPlatformApi("paste", "()V") : AppLog.warn("Browser call Function [Paste]");
},
OpenFB: function(e) {
if (Global.isNative()) return this.callPlatformApi("OpenFB", "(Ljava/lang/String;)Z", e);
AppLog.warn("Browser call Function [OpenFB]");
},
SaveToAlumb: function(e) {
if (Global.isNative()) return this.callPlatformApi("SaveToAlumb", "(Ljava/lang/String;)I", e);
AppLog.warn("Browser call Function [SaveToAlumb]");
},
isInstallWXApp: function() {
if (Global.isNative()) return this.callPlatformApi("installWXApp", "()I");
AppLog.warn("Browser call Function [installWXApp]");
},
openWXApp: function() {
if (Global.isNative()) return this.callPlatformApi("openWXApp", "()I");
AppLog.warn("Browser call Function [openWXApp]");
},
wxLogin: function() {
Global.isNative() ? this.callPlatformApi("wxLogin", "()V") : AppLog.warn("Browser call Function [wxLogin]");
},
consumeOwnedPurchase: function(e) {
Global.isNative() ? this.callPlatformApi("consumeOwnedPurchase", "(Ljava/lang/String;)V", e) : AppLog.warn("Browser call Function [installWXApp]");
},
wxShare: function(e) {
Global.isNative() ? this.callPlatformApi("wxShare", "(Ljava/lang/String;)V", e) : AppLog.warn("Browser call Function [wxShare]");
},
getDeviceId: function() {
return Global.isNative() ? this.callPlatformApi("getDeviceId", "()Ljava/lang/String;") : "0";
},
getDeviceBrand: function() {
return Global.isNative() ? this.callPlatformApi("getDeviceBrand", "()Ljava/lang/String;") : "web";
},
getDeviceOpSysVision: function() {
return Global.isNative() ? this.callPlatformApi("getDeviceOpSysVision", "()Ljava/lang/String;") : "web";
},
closeSplash: function() {
Global.isNative() && this.callPlatformApi("closeSpalsh", "()V");
},
deviceShock: function() {
Global.getShake() && Global.isNative() && this.callPlatformApi("phoneShock", "()V");
},
showRewardedVideo: function() {
Global.isNative() && this.callPlatformApi("showRewardedVideo", "()V");
},
showBannerAd: function() {
Global.isNative() && this.callPlatformApi("showBannerAd", "()V");
},
hideBannerAd: function() {
Global.isNative() && this.callPlatformApi("hideBannerAd", "()V");
},
addCallback: function(e, t) {
this._callbackDic = this._callbackDic || {};
this._callbackDic[t] = e;
},
delCallback: function(e) {
delete this._callbackDic[e];
},
trigerCallback: function(e) {
cc.log("CallBackData:" + JSON.stringify(e));
this.pushCallbackDataToList(e);
},
callPlatformApi: function(e, t, n) {
if (Global.isAndroid()) return n ? jsb.reflection.callStaticMethod(this._AND_CLASS_NAME, e, t, n) : jsb.reflection.callStaticMethod(this._AND_CLASS_NAME, e, t);
if (Global.isIOS()) return n ? jsb.reflection.callStaticMethod(this._IOS_CLASS_NAME, e + ":", n) : jsb.reflection.callStaticMethod(this._IOS_CLASS_NAME, e);
AppLog.warn("Web Api is not Exit function : " + e);
return "";
},
pushCallbackDataToList: function(e) {
this._cbDataList = this._cbDataList || [];
this._cbDataList.push(e);
},
update: function() {
if (null != this._cbDataList && 0 < this._cbDataList.length) {
var e = this._cbDataList.shift();
e.cbName ? this._callbackDic[e.cbName] ? this._callbackDic[e.cbName](e) : AppLog.warn("Has not add " + e.cbName + " in the cbDataDic!") : AppLog.err("The callback data (cbDataDic.cbName) is not exist!");
}
},
changScreen: function(e) {
var t = cc.view.getFrameSize();
if (!(e && t.width > t.height) && (e || !(t.width < t.height))) {
Global.isLandSpace = e;
cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "changeRootViewController:", e) : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "changedActivityOrientation", "(Z)V", e);
cc.view.setFrameSize(t.height, t.width);
e ? cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.FIXED_WIDTH) : cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.FIXED_HEIGHT);
cc.view.setOrientation(e ? cc.macro.ORIENTATION_LANDSCAPE : cc.macro.ORIENTATION_PORTRAIT);
}
}
}
});
cc._RF.pop();
}, {} ],
Poker: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "b3c47K28klN6qVyg5cHO+QV", "Poker");
var E = [ "plist_puke_back_big_2", "plist_puke_front_big", "bg_back", "poker-red_back", "poly_poker_bg" ], r = [ "3", "2", "1", "0" ];
cc.Class({
extends: cc.Component,
properties: {
spr_bg: cc.Sprite,
spr_value: cc.Sprite,
spr_color: cc.Sprite,
spr_color_big: cc.Sprite,
spr_joker: cc.Sprite,
pokerAtas: {
default: null,
type: cc.SpriteAtlas
},
_onClickCallback: null,
_isSelect: !1,
_colorValue: null,
_pokerValue: null,
_pokerIndex: null,
_bgIdx: null
},
onLoad: function() {
null == this._colorValue && null == this._pokerValue && this.showPokerBg(this._bgIdx);
},
start: function() {},
showPokerBg: function(e) {
var t = this;
t.spr_value.node.active = !1;
t.spr_color.node.active = !1;
t.spr_color_big.node.active = !1;
t.spr_joker.node.active = !1;
var n = t.getSpriteFrame(E[0]);
if (E[e]) {
t._bgIdx = e;
n = t.getSpriteFrame(E[e]);
}
t.spr_bg.spriteFrame = n;
},
show16Poker: function(e) {
this._pokerIndex = e;
var t = this.convert16PokertoDatavalue(e);
this.showPokerValue(t);
},
convert16PokertoDatavalue: function(e) {
var t = {};
t.color = 16 * (((240 & e) >> 4) - 1);
t.value = 15 & e;
return t;
},
getPokerIndex: function() {
return this._pokerIndex;
},
showPokerValue: function(e) {
if (this.isValidCard(e)) {
var t = e.color / 16;
this.setPoker(t, e.value);
}
},
setPoker: function(e, t) {
var n = this;
n._colorValue = e;
n._pokerValue = t;
n.spr_bg.spriteFrame = n.getSpriteFrame(E[1]);
if (4 === e) 14 === t ? n.showPokerJoker() : 15 === t && n.showPokerJoker(!0); else {
n._showJokerModel(!1);
if (n.spr_color_big) {
var i = "plist_puke_color_big_" + r[e];
n.spr_color_big.spriteFrame = n.getSpriteFrame(i);
}
var a = "plist_puke_color_xl_small_" + r[e];
n.spr_color.spriteFrame = n.getSpriteFrame(a);
var o = 0;
0 != e && 2 != e || (o = 1);
var s = "plist_puke_value_xl_" + o + "_" + t;
n.getSpriteFrame(s) ? n.spr_value.spriteFrame = n.getSpriteFrame(s) : cc.log("unvalid");
}
},
showPokerJoker: function(e) {
this._showJokerModel(!0);
var t = 0;
1 == e && (t = 1);
var n = "plist_puke_joker_big_" + t;
this.spr_joker.spriteFrame = this.getSpriteFrame(n);
},
setScale: function(e) {
this.node.scale = e;
},
_showJokerModel: function(e) {
var t = this;
t.spr_joker.node.active = e;
t.spr_color.node.active = !e;
t.spr_value.node.active = !e;
t.spr_color_big && (t.spr_color_big.node.active = !e);
},
isValidCard: function(e) {
return !!(e && 0 <= e.color && 0 < e.value);
},
isSelect: function() {
return this._isSelect;
},
setSelected: function(e) {
this._isSelect = !!e;
},
setClickCallback: function(e) {
this._onClickCallback = e;
this.spr_bg.getComponent("cc.Button").enabled = !0;
},
onPokerClicked: function(e, t) {
this._isSelect = !this._isSelect;
this._onClickCallback && this._onClickCallback(this, t);
},
doTurnAction: function(g, _, e, f) {
var v = this;
e || (e = 0);
f || (f = 1);
var p = v.node.scaleX, m = v.node.scaleY, b = p + e, C = m + e, t = null;
0 < e && (t = cc.scaleTo(.1, b, C));
var n = cc.callFunc(function() {
var e = new cc.Node("PokerBgSprie"), t = e.addComponent(cc.Sprite), n = v.getSpriteFrame(E[0]);
v.getSpriteFrame(E[v._bgIdx]) && (n = v.getSpriteFrame(E[v._bgIdx]));
t.spriteFrame = n;
e.scaleX = b;
e.scaleY = C;
e.parent = v.node.parent;
e.position = v.node.position;
var i = v.node.getContentSize();
e.setContentSize(cc.size(i.width, i.height));
var a = .3 * f, o = .6 * f;
v.node.scaleX = -b;
var s = cc.callFunc(function(e, t) {
e.removeFromParent();
}, e, 1), r = cc.sequence(cc.delayTime(a), cc.hide(), cc.delayTime(a), cc.hide(), s), c = cc.scaleTo(o, -b, C);
e.runAction(cc.spawn(r, c));
var l = cc.callFunc(function() {
p == b && m == C || v.node.runAction(cc.scaleTo(.1, p, m));
_ && _();
}), h = cc.callFunc(function() {
v.showPokerValue(g);
}), d = cc.sequence(cc.delayTime(a), cc.show(), h, cc.delayTime(a), cc.show(), l), u = cc.scaleTo(o, b, C);
v.node.runAction(cc.spawn(d, u));
});
t ? v.node.runAction(cc.sequence(t, n)) : v.node.runAction(n);
},
doTurnActionWithScaleXY: function(d, u, g, e, t) {
var _ = this;
e || (e = 0);
t || (t = 0);
var f = _.node.scaleX, v = _.node.scaleY, p = f + e, m = v + t, n = null;
(0 < e || 0 < t) && (n = cc.scaleTo(.1, p, m));
var i = cc.callFunc(function() {
var e = new cc.Node("PokerBgSprie"), t = e.addComponent(cc.Sprite), n = _.getSpriteFrame(E[0]);
_.getSpriteFrame(E[_._bgIdx]) && (n = _.getSpriteFrame(E[_._bgIdx]));
t.spriteFrame = n;
e.scaleX = p;
e.scaleY = m;
e.parent = _.node.parent;
e.position = _.node.position;
var i = _.node.getContentSize();
e.setContentSize(cc.size(i.width, i.height));
_.node.scaleX = -p;
var a = cc.callFunc(function(e, t) {
e.removeFromParent();
}, e, 1), o = cc.sequence(cc.delayTime(.15), cc.hide(), cc.delayTime(.15), cc.hide(), a), s = cc.scaleTo(.3, -p, v);
e.runAction(cc.spawn(o, s));
var r = cc.callFunc(function() {
f === p && v === m || _.node.runAction(cc.scaleTo(.1, p, m));
u && g && u.call(g);
}), c = cc.callFunc(function() {
_.showPokerValue(d);
}), l = cc.sequence(cc.delayTime(.15), cc.show(), c, cc.delayTime(.15), cc.show(), r), h = cc.scaleTo(.3, f, v);
_.node.runAction(cc.spawn(l, h));
});
n ? _.node.runAction(cc.sequence(n, i)) : _.node.runAction(i);
},
setShowPokerEvent: function(e) {
this._eventCall = e;
},
onShowEvent: function() {
this._eventCall && this._eventCall();
},
getSpriteFrame: function(e) {
return this.pokerAtas._spriteFrames[e];
}
});
cc._RF.pop();
}, {} ],
RollSpeak: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "1be0ez96EpLx7ZPm5TJdxxM", "RollSpeak");
cc.Class({
extends: cc.Component,
properties: {
spr_bg: cc.Node,
mask_node: cc.Node,
rich_roll: cc.RichText,
type: 3,
move_px: {
default: 4,
displayName: "每0.05秒移动的像素"
},
_cur_time: 0,
_enabled_update: !1,
_timeoutId: null,
_isShow: !1
},
onEnable: function() {
var e = this;
this.node.x = cc.director.getWinSize().width / 2;
this.node.y = cc.director.getWinSize().height + this.spr_bg.height / 2;
this.rich_roll.string = "";
this.spr_bg.active = !1;
Global.isNative() ? this._timeoutId = setTimeout(function() {
e._enabled_update = !0;
e.removeTimeout();
}, 1e3) : this._timeoutId = setTimeout(function() {
e._enabled_update = !0;
e.removeTimeout();
}, 3e3);
},
onDisable: function() {
this.removeTimeout();
},
show: function(e) {
this._isShow = e;
this.spr_bg.active = this._isShow;
},
update: function(e) {
if (cc.vv.SpeakerMgr) {
if (!this._enabled_update) return;
this._cur_time += e;
if (this.spr_bg.active) {
if (.05 < this._cur_time) {
this._cur_time -= .05;
this.rich_roll.node.x -= this.move_px;
this.rich_roll.node.x + this.rich_roll.node.width < -10 && this.startNextRoll();
}
} else if (2 < this._cur_time) {
this._cur_time -= 2;
this.startNextRoll();
}
}
},
startNextRoll: function() {
var e = cc.vv.SpeakerMgr.getNextFromList(this.type);
if (e) {
this.spr_bg.active = !0;
this.show(!0);
this.rich_roll.maxWidth = 0;
this.rich_roll.string = e.msg;
this._cur_time = 0;
this.move_px = e.speed;
this.rich_roll.node.x = this.mask_node.width + 10;
} else this.show(!1);
},
removeTimeout: function() {
if (this._timeoutId) {
clearTimeout(this._timeoutId);
this._timeoutId = null;
}
}
});
cc._RF.pop();
}, {} ],
SceneMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "94373Pjv+pEBJB7iV8EiU2R", "SceneMgr");
cc.Class({
extends: cc.Component,
statics: {
enterScene: function(e, t) {
cc.vv.FloatTip && cc.vv.FloatTip.clear();
if (cc.director.getScene().name !== e) {
var n = e;
"hall" === e && cc.vv.gameData && cc.vv.gameData.onExit();
cc.director.loadScene(e, function() {
"lobby" === n && cc.vv.gameData && cc.vv.gameData.clear();
t && t();
});
}
},
isInHallScene: function() {
return "hall" === cc.director.getScene().name;
},
isInLoginScene: function() {
return "login" === cc.director.getScene().name;
}
}
});
cc._RF.pop();
}, {} ],
ShaderUtils: [ function(o, e, t) {
"use strict";
cc._RF.push(e, "b064bNULp5Ew4iq+m3k7nFt", "ShaderUtils");
var n = {
shaderPrograms: {},
setShader: function(e, t) {
var n = this.shaderPrograms[t];
if (!n) {
n = new cc.GLProgram();
var i = o(cc.js.formatStr("%s.vert", t)), a = o(cc.js.formatStr("%s.frag", t));
if (cc.sys.isNative) n.initWithString(i, a); else {
n.initWithVertexShaderByteArray(i, a);
n.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
n.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
n.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
}
n.link();
n.updateUniforms();
this.shaderPrograms[t] = n;
}
e._sgNode.setShaderProgram(n);
},
removeShader: function(e) {
e._sgNode.setState(0);
}
};
e.exports = n;
cc._RF.pop();
}, {} ],
SpeakerMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "11118RgkgZNVYlBu+8B9qha", "SpeakerMgr");
var i = function(e) {
var t = new Object();
t.speed = e.speed || 4;
t.level = e.level || 100;
t.count = e.count || 1;
t.curCount = 0;
t.time = new Date().getTime();
t.msg = e.msg || "推送缺少msg字段";
t.playername = e.playername;
t.type = e.type;
return t;
};
cc.Class({
extends: cc.Component,
statics: {
_cache_count_limit: 10,
_game_list: null,
_system_list: null,
_all_list: null,
init: function() {
this.registerMsg();
},
insertToList: function(e) {
if (1 === e.type) {
this._system_list = this._system_list || [];
this._system_list.push(i(e));
} else if (2 === e.type) {
this._game_list = this._game_list || [];
this._game_list.push(i(e));
}
this._all_list = this._all_list || [];
this._all_list.push(i(e));
this.deleteOver(1 === e.type ? this._system_list : this._game_list);
this.sortList(1 === e.type ? this._system_list : this._game_list);
this.deleteOver(this._all_list);
this.sortList(this._all_list);
},
getNextFromList: function() {
var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 3, t = null;
if (1 === e) {
if (!this._system_list || this._system_list.length <= 0) return null;
t = this._system_list;
} else if (2 === e) {
if (!this._game_list || this._game_list.length <= 0) return null;
t = this._game_list;
} else {
if (!this._all_list || this._all_list.length <= 0) return null;
t = this._all_list;
}
var n = t[0];
n.count - n.curCount <= 1 && (n = t.shift());
n.curCount++;
3 !== e || (1 === n.type ? this.delMsg(this._system_list, n) : 2 === n.type && this.delMsg(this._game_list, n));
return n;
},
delMsg: function(e, t) {
for (var n = 0; n < e.length; ++n) if (e[n] === t) {
e.splice(n, 1);
break;
}
},
sortList: function(e) {
e.sort(function(e, t) {
return e.level == t.level ? e.time - t.time : e.level - t.level;
});
},
deleteOver: function(e) {
var t = e.length - this._cache_count_limit;
if (!(t <= 0)) {
e.sort(function(e, t) {
return e.level == t.level ? e.time - t.time : -(e.level - t.level);
});
e.splice(0, t);
}
},
clearList: function() {
this._game_list = null;
this._system_list = null;
this._all_list = null;
},
registerMsg: function() {
cc.vv.NetManager.registerMsg(MsgId.GLOBAL_SPEAKER_NOTIFY, this.onRcvNetSpeakerNotify, this);
},
onRcvNetSpeakerNotify: function(e) {
200 === e.code && this.insertToList(e.notices);
}
}
});
cc._RF.pop();
}, {} ],
SubGameUpdate: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "53ef5gqNj5Hg62KrXgltE3s", "SubGameUpdate");
var i = e("Md5");
cc.Class({
extends: cc.Component,
properties: {
_updating: !1,
_failCount: 0,
_canRetry: !1,
_checkListener: null,
_updateListener: null,
_storagePath: "",
_assManager: null,
_checkOver: !1,
_countdownSec: 0,
_overtimeCount: 0,
_manifestMap: null,
_status: -1,
_subGame: "",
_subGameMap: [],
_updateGameId: 0,
_failNum: 0,
_hallVer: "",
_downloadList: [],
_checkTime: 0,
_isDownloading: !1,
_isTry: !1,
_subGamesVer: null,
_sameGameList: null
},
onLoad: function() {
if (Global.isNative()) {
cc.vv.SubGameUpdateNode.on("check_subgame", this.onCheckSubGame, this);
cc.vv.SubGameUpdateNode.on("set_hall_ver", this.recvHallVer, this);
cc.vv.SubGameUpdateNode.on("request_subgame_status", this.requestSubGameStatus, this);
this._subGameMap = new Map();
this._sameGameList = new Map(), this._downloadList = [];
this.readHallLocalMainfest();
this.readAllSubLocalManifest();
}
},
requestSubGameStatus: function() {
cc.vv.SubGameUpdateNode.emit("subgame_status", this._subGameMap);
cc.vv.SubGameUpdateNode.emit("subgame_downloadList", this._downloadList);
},
readHallLocalMainfest: function() {
var e = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset/project.manifest";
if (jsb.fileUtils.isFileExist(e)) {
var t = jsb.fileUtils.getStringFromFile(e), n = JSON.parse(t);
this._subGamesVer = n.subGamesVer;
}
},
setSubGamesVer: function(e) {
null === this._subGamesVer && (this._subGamesVer = e);
},
isDownLoadSubGame: function(e) {
return !Global.isNative() || !!this._subGameMap.has(e.toString()) && "0" !== this._subGameMap.get(e.toString()).ver;
},
readAllSubLocalManifest: function() {
for (var e in cc.vv.GameItemCfg) {
this._sameGameList.has(cc.vv.GameItemCfg[e].name) || this._sameGameList.set(cc.vv.GameItemCfg[e].name, []);
var t = this._sameGameList.get(cc.vv.GameItemCfg[e].name), n = this.readSubLocalManifest(cc.vv.GameItemCfg[e].name), i = 0 === n.length;
this._subGamesVer && (i = this._subGamesVer[e.toString()] !== n);
AppLog.log("##########key:" + e + "  ver:" + n);
this._subGameMap.set(e.toString(), {
ver: 0 < n.length ? n : "0",
needUpdate: i,
pro: -1
});
t.push(e.toString());
}
},
recvHallVer: function(e) {
this._hallVer = e.detail;
e.detail !== Global.resVersion && cc.vv.SubGameUpdateNode.emit("need_update_hall");
},
readSubLocalManifest: function(e) {
var t = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset/" + e + "/project.manifest";
if (jsb.fileUtils.isFileExist(t)) {
var n = jsb.fileUtils.getStringFromFile(t);
return JSON.parse(n).version;
}
return "";
},
showAlreadyUpdate: function(e, t) {
var n = this._subGameMap.get(e.toString());
n.needUpdate = !1;
n.ver = t;
cc.vv.SubGameUpdateNode.emit("already_update_to_date", e);
},
onCheckSubGame: function(e) {
var t = e.detail;
if (t !== this._updateGameId) {
if (this._subGameMap.has(t.toString())) {
var n = this._subGameMap.get(t.toString()), i = n.ver;
if (this._subGamesVer[t.toString()] === i) {
if (!n.needUpdate) {
this.showAlreadyUpdate(t, i);
return;
}
} else {
n.pro = 0;
n.needUpdate = !0;
}
} else {
var a = this.readSubLocalManifest(cc.vv.GameItemCfg[t].name);
if (a === this._subGamesVer[t.toString()]) {
this.showAlreadyUpdate(t, a);
return;
}
}
for (var o = !1, s = 0; s < this._downloadList.length; ++s) this._downloadList[s] === t && (o = !0);
if (!o) {
cc.vv.FloatTip.show(cc.vv.Language[cc.vv.GameItemCfg[t].title] + cc.vv.Language.join_queue);
if (0 === this._downloadList.length) {
this._updateGameId = t;
this.init(cc.vv.GameItemCfg[t].name);
}
this._downloadList.push(t);
}
cc.vv.SubGameUpdateNode.emit("update_started", t);
} else cc.vv.SubGameUpdateNode.emit("update_started", t);
},
init: function(e) {
this._subGame = e;
this.initCheck(e);
},
initCheck: function(e) {
AppLog.log("##########gameName:" + e);
this.onDestroy();
this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset/" + e;
this._assManager = new jsb.AssetsManager("", this._storagePath, this.versionComHandle.bind(this));
var t = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset/" + e + "/project.manifest";
jsb.fileUtils.isFileExist(t) || (t = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset/manifest/" + e + "_project.manifest");
this.manifestUrl = t;
Global.retain(this._assManager);
this._assManager.setVerifyCallback(this.verifyCallback.bind(this));
Global.isAndroid() && this._assManager.setMaxConcurrentTask(2);
this.checkHotUpdate();
},
start: function() {},
update: function(e) {
if (0 < this._downloadList.length) {
this._checkTime += e;
if (3 <= this._checkTime) {
this._checkTime = 0;
this._isDownloading || (this._isTry = !0);
this._isDownloading = !1;
}
}
},
onDestroy: function() {
if (this._updateListener) {
cc.eventManager.removeListener(this._updateListener);
this._updateListener = null;
}
this._assManager && Global.release(this._assManager);
this._checkOver = !1;
this._updating = !1;
},
startCheckHotUpdate: function() {
this.checkHotUpdate() || AppLog.warn("检测更新失败");
},
checkHotUpdate: function() {
if (this._updating) AppLog.log("Checking or Updating ..."); else {
this._assManager.getState() === jsb.AssetsManager.State.UNINITED && this._assManager.loadLocalManifest(this.manifestUrl);
if (this._assManager.getLocalManifest() && this._assManager.getLocalManifest().isLoaded()) {
this._checkListener = new jsb.EventListenerAssetsManager(this._assManager, this.checkCallback.bind(this));
cc.eventManager.addListener(this._checkListener, 1);
this._assManager.checkUpdate();
return !0;
}
AppLog.warn("Failed to load local manifest ...");
this.showFailDlg();
}
},
startHotupdate: function() {
if (this._assManager && !this._updating) {
this._updateListener = new jsb.EventListenerAssetsManager(this._assManager, this.updateCallback.bind(this));
cc.eventManager.addListener(this._updateListener, 1);
this._assManager.getState() === jsb.AssetsManager.State.UNINITED && this._assManager.loadLocalManifest(this.manifestUrl);
this._failCount = 0;
this._assManager.update();
this._updating = !0;
}
},
setSubGameUpdateStatus: function(e) {
var t = this._subGameMap.get(this._updateGameId.toString());
t && (t.needUpdate = !e);
},
setSubGameVer: function(e) {
var t = this._subGameMap.get(this._updateGameId.toString());
if (t) {
t.ver = e;
t.needUpdate = !0;
this._subGamesVer[this._updateGameId.toString()] = e;
}
},
checkCallback: function(e) {
cc.log("Code: " + e.getEventCode());
var t = !(this._isDownloading = !0);
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
AppLog.warn("No local manifest file found, hot update skipped.");
t = !1;
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
AppLog.warn("Fail to download manifest file, hot update skipped.");
t = !1;
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
AppLog.warn("Already up to date with the latest remote version.");
this.setSubGameUpdateStatus(!0);
this._isTry || cc.vv.SubGameUpdateNode.emit("already_update_to_date", this._updateGameId);
t = !0;
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
AppLog.warn("New version found, please try to update.");
this.setSubGameUpdateStatus(!1);
this.startHotupdate();
return;

default:
return;
}
cc.eventManager.removeListener(this._checkListener);
this._checkListener = null;
this._updating = !1;
cc.log("-------------------finish: " + e.getEventCode());
if (t) this.enterNextStep(); else {
++this._failCount;
console.log("**************fail count:" + this._failCount);
if (this._failCount < 2) this.initCheck(this._subGame); else {
console.log("**************fail Show faildlg" + this._failCount);
this.showFailDlg();
}
}
},
showFailDlg: function() {
cc.eventManager.removeListener(this._updateListener);
this._updateListener = null;
cc.vv.AlertView.show(cc.vv.Language[cc.vv.GameItemCfg[this._updateGameId].title] + cc.vv.Language.download_fail, function() {
var e = jsb.fileUtils.getWritablePath() + "remote-asset/" + cc.vv.GameItemCfg[this._updateGameId].name;
jsb.fileUtils.removeFile(e);
});
cc.vv.SubGameUpdateNode.emit("subgame_update_fail", this._updateGameId);
this.downloadNextGame();
},
downloadNextGame: function() {
this._failCount = 0;
this._downloadList.shift();
this._checkOver = !1;
this._updating = !1;
this._canRetry = !1;
this._isTry = !1;
this._updateGameId = -1;
if (0 < this._downloadList.length) {
this._updateGameId = this._downloadList[0];
this._subGame = cc.vv.GameItemCfg[this._updateGameId].name;
AppLog.log("##########upateName:" + this._subGame);
this.initCheck(this._subGame);
}
},
enterNextStep: function() {
var e = this._subGameMap.get(this._updateGameId.toString());
if (e && !e.needUpdate) {
var t = !1, n = cc.vv.GameItemCfg[this._updateGameId].name, i = this._subGamesVer[this._updateGameId];
if (this._sameGameList.has(n)) {
var a = this._sameGameList.get(n);
if (a) for (var o = 0; o < a.length; ++o) {
var s = this._subGameMap.get(a[o]);
if (s) {
s.ver = i;
s.needUpdate = !1;
this._subGamesVer[a[o]] = i;
}
}
}
for (var r = 0; r < this._downloadList.length; ++r) {
var c = cc.vv.GameItemCfg[this._downloadList[r]].name;
if (c === n && this._downloadList[r] !== this._updateGameId) {
Global.appId !== Global.APPID.BigBang && cc.vv.FloatTip.show(cc.vv.Language[cc.vv.GameItemCfg[this._downloadList[r]].title] + cc.vv.Language.download_complete);
cc.vv.SubGameUpdateNode.emit("update_finish", this._downloadList[r]);
t = !0;
AppLog.log("########find same game:" + c + " gameId:" + this._downloadList[r]);
this._downloadList[r] = 0;
}
}
if (t) {
for (var l = [], h = 0; h < this._downloadList.length; ++h) 0 !== this._downloadList[h] && l.push(this._downloadList[h]);
this._downloadList = l.slice(0);
}
Global.appId !== Global.APPID.BigBang && cc.vv.FloatTip.show(cc.vv.Language[cc.vv.GameItemCfg[this._updateGameId].title] + cc.vv.Language.download_complete);
cc.vv.SubGameUpdateNode.emit("update_finish", this._updateGameId);
this.downloadNextGame();
}
},
updateCallback: function(e) {
var t = !1, n = !1;
this._isDownloading = !0;
e.getMessage();
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
AppLog.warn("No local manifest file found, hot update skipped.");
n = !0;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
var i = e.getDownloadedBytes() / e.getTotalBytes() * 100;
AppLog.log("########loadPercent:" + i);
i = isNaN(i) ? 0 : i;
var a = this._subGameMap.get(this._updateGameId.toString());
a && (a.pro = Global.S2P(i, 0));
cc.vv.SubGameUpdateNode.emit("update_subgame_pro", {
per: Global.S2P(i, 0),
gameId: this._updateGameId
});
e.getMessage();
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
AppLog.warn("Fail to download manifest file, hot update skipped.");
n = !0;
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
AppLog.warn("@@@@@@@@@updateCallback Already up to date with the latest remote version.");
t = !0;
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
AppLog.log("Update finished. " + e.getMessage());
cc.vv.SubGameUpdateNode.emit("update_subgame_status", {
txt: "更新完成!",
gameId: this._updateGameId
});
t = !0;
this._canRetry = !1;
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
AppLog.warn("Update failed. " + e.getMessage());
this._updating = !1;
this._canRetry = !0;
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
AppLog.warn("Asset update error: " + e.getAssetId() + ", " + e.getMessage());
n = !0;
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
AppLog.log(e.getMessage());
n = !0;
}
if (n) {
this.setSubGameUpdateStatus(!1);
this.showFailDlg();
}
if (t) {
cc.eventManager.removeListener(this._updateListener);
this._updateListener = null;
this.setSubGameUpdateStatus(!0);
this.enterNextStep();
}
if (this._canRetry) {
++this._failCount;
if (this._failCount < 2) {
this.setSubGameUpdateStatus(!1);
this._canRetry = !1;
this._assManager.downloadFailedAssets();
} else this.showFailDlg();
}
},
versionComHandle: function(e, t) {
AppLog.log("JS Custom Version Compare: version A is " + e + ", version B is " + t);
this.setSubGameVer(t);
return e !== t ? -1 : 0;
},
calMD5OfFile: function(e) {
return i(jsb.fileUtils.getDataFromFile(e));
},
verifyCallback: function(e, t) {
var n = t.compressed;
t.md5, t.path, t.size;
if (n) {
AppLog.log("-----------compressed------- ");
return !0;
}
return !0;
}
});
cc._RF.pop();
}, {
Md5: "Md5"
} ],
UserHead: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "33cadrZAUBJcq1j7gmRyYbG", "UserHead");
cc.Class({
extends: cc.Component,
properties: {
headAtlas: cc.SpriteAtlas,
sprHead: cc.Sprite
},
setHeadUrl: function(e) {
var t = this;
if (cc.js.isString(e)) {
0 <= e.indexOf("http") ? this.sprHead.getComponent("ImageLoader").setUserHeadUrl(e, function(e) {
t.sprHead.getComponent(cc.Sprite).spriteFrame = e;
}) : this.sprHead.getComponent(cc.Sprite).spriteFrame = this.headAtlas.getSpriteFrame(Global.getHeadId(e));
} else this.sprHead.getComponent(cc.Sprite).spriteFrame = this.headAtlas.getSpriteFrame(Global.getHeadId(e));
},
start: function() {}
});
cc._RF.pop();
}, {} ],
UserManager: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "a7772rp2E5D3IIknLMJZcjO", "UserManager");
cc.Class({
extends: cc.Component,
statics: {
gameServer: "",
token: "",
serverId: "",
subId: "",
uid: 0,
openid: 0,
coin: {
get: function() {
return this._coin ? this._coin : 0;
},
set: function(e) {
this._coin = e;
}
},
userIcon: "",
sex: 1,
agent: 0,
nickName: "",
inviteCode: "",
bindcode: "",
ip: "192.168.0.1",
memo: "",
onlinestate: 0,
syotime: 0,
lrwardstate: 0,
switch: null,
showActivity: !0,
lat: 0,
lng: 0,
unionid: "",
loginPopList: [],
loginPopIdx: 0,
bank_token: null,
bank_info: {},
rememberPsw: !1,
gameList: null,
isAutoLogin: !0,
notice: "",
luckRedvelopesNum: 0,
growup: null,
red_envelop: 0,
localFavList: null,
areaCode: null,
headSprite: null,
sigin: "",
mobile: "",
GpsCity: "",
clubs: [],
init: function() {
(Global.playerData = this).switch = [];
this.loginPopList = [ 1, 2 ];
this.loginPopIdx = 0;
cc.vv.NetManager.registerMsg(MsgId.GAME_LIST, this.recvGameList, this);
},
setHeadSprite: function(e) {
this.headSprite = e;
},
getHeadSprite: function() {
return this.headSprite;
},
initLoginServer: function(e) {
this.gameServer = e.net;
this.token = e.token;
this.serverId = e.server;
this.subId = e.subId;
this.uid = e.uid;
this.unionid = e.unionid;
},
recvGameList: function(e) {
if (200 === e.code) {
this.gameList = e.gamelist;
for (var t in this.gameList) {
this.gameList[t].sort(function(e, t) {
return t.ord - e.ord;
});
}
Global.dispatchEvent(EventId.UPDATE_GAME_LIST);
}
},
findGameType: function(e) {
var t = 0;
for (var n in this.gameList) {
var a = this.gameList[n];
for (i = 0; i < a.length; ++i) if (a[i].id == e) {
t = n;
break;
}
}
return parseInt(t);
},
initPlayerData: function(e) {
var t = e.playerInfo;
e.actlist;
this.uid = t.uid;
this.coin = t.coin;
this.userIcon = t.usericon;
this.sex = t.sex;
this.agent = t.agent;
this.nickName = t.playername;
this.memo = t.memo;
this.inviteCode = t.code;
this.bindcode = t.bindcode;
this.ip = t.ip;
this.onlinestate = t.onlinestate;
this.lrwardstate = t.lrwardstate;
this.upcoin = e.upcoin;
this.ispayer = t.ispayer;
this.account = t.account;
this.logincoin = t.logincoin;
this.switch = t.switch || [];
this.logintype = t.logintype;
this.isbindfb = t.isbindfb;
this.isbindwx = t.isbindwx;
this.spread = t.spread || 0;
this.gameList = e.gamelist;
this.luckRedvelopesNum = t.luckRedvelopesNum;
this.growup = e.growup;
this.red_envelope = t.red_envelope;
this.openid = t.openid;
this.sigin = e.sigin;
this.mobile = t.mobile || "";
this.roomcard = t.roomcard;
this.clubs = e.clubs;
this.GpsCity = t.city || "";
this.gameList.sort(function(e, t) {
return t.ord - e.ord;
});
"" === this.notice && void 0 !== e.notice && (this.notice = e.notice);
Global.saveLocal(Global.SAVE_KEY_LOGIN_TYPE, this.logintype);
Global.saveLocal(Global.SAVE_KEY_LAST_LOGIN_TYPE, this.logintype);
},
setBindMobile: function(e) {
this.mobile = e;
},
getBindMobile: function() {
return this.mobile;
},
getNotice: function() {
return this.notice;
},
clearNotice: function() {
this.notice = "";
},
getIsAutoLogin: function() {
return this.isAutoLogin;
},
setIsAutoLogin: function(e) {
this.isAutoLogin = e;
},
getGameList: function() {
return this.gameList;
},
getGameListById: function(e) {
var t = null;
for (var n in this.gameList) for (var i = this.gameList[n], a = 0; a < i.length; a++) if (Number(e) == Number(i[a].id)) {
t = i[a];
break;
}
return t;
},
setRemember: function(e) {
this.rememberPsw = e;
},
setNickName: function(e) {
this.nickName = e;
},
setLatLng: function(e, t) {
this.lat = e || 0;
this.lng = t || 0;
},
setApiData: function(e) {
this._apiData = e;
},
getApiGameId: function() {
if (this._apiData) return this._apiData.gameid;
},
getApiSign: function() {
if (this._apiData) return this._apiData.signstr;
},
setLoginType: function(e) {
this._apiLogin = e;
},
getLoginType: function() {
return this._apiLogin;
},
getGpsCity: function() {
return this.GpsCity;
}
}
});
cc._RF.pop();
}, {} ],
WebsocketMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "c92daGJIsxELqohGibyNUHQ", "WebsocketMgr");
var i = 1, a = 2, o = 3, s = 4, r = 5;
cc.Class({
extends: cc.Component,
statics: {
m_cDstIP: "",
m_pSocket: null,
m_eNetWorkState: 1,
m_vDelegates: [],
m_bReciveHeadMsg: !1,
m_nHeartbeatNum: -1,
m_nConnectNum: -1,
m_bIsSendHeard: !0,
m_vMessageCallBack: [],
m_nConnectCount: 0,
m_bIsHoldClose: !1,
m_nforgroundCount: -1,
m_nConnectGameServerNum: -1,
m_nConnectGameServerNum_1: -1,
m_conectCallback: null,
m_handleResponeDataCallBack: null,
_timeOut: 5e3,
socketIP: "ws://192.168.0.127:8080",
getSocketIP: function() {
return this.socketIP;
},
setAutoConnect: function(e) {
this.m_bIsAutoConnect = e;
},
forgroundConnect: function() {
cc.vv.GameManager && cc.vv.GameManager.onEnterFront();
},
applocationEnterForeground: function() {
console.log("applocationEnterForeground");
this.forgroundConnect();
},
applocationEnterBackground: function() {
cc.vv.NetManager.send({
c: MsgId.LOGIN_OUT
});
console.log("applocationEnterBackground");
this.closeNetWork(!0);
},
init: function(e) {
this.m_eNetWorkState = i;
this.m_bReciveHeadMsg = !1;
this.m_nHeartbeatNum = -1;
this.m_nConnectNum = -1;
this.m_handleResponeDataCallBack = e;
cc.game.on(cc.game.EVENT_SHOW, this.applocationEnterForeground, this);
cc.game.on(cc.game.EVENT_HIDE, this.applocationEnterBackground, this);
},
getConnectCount: function() {
return this.m_nConnectCount;
},
getNetWorkState: function() {
return this.m_eNetWorkState;
},
isConnect: function() {
return this.getNetWorkState() == o;
},
addDelegate: function(e) {
this.m_vDelegates.push(e);
},
removeDelegate: function(e) {
for (var t = 0; t < this.m_vDelegates.length; t++) if (this.m_vDelegates[t] == e) {
this.m_vDelegates.splice(t, 1);
break;
}
},
closeNetWork: function(e) {
this.m_cDstIP = "";
var t = this.getNetWorkState();
console.log("手动关闭 state : ", t);
this.m_bIsHoldClose = e;
if (this.m_pSocket) {
this.m_pSocket.onopen = function() {};
this.m_pSocket.onclose = function() {};
this.m_pSocket.onerror = function() {};
this.m_pSocket.onmessage = function() {};
this.m_pSocket.close();
}
this.onClose(null);
},
timeOutConnect: function() {
this.m_pSocket && this.closeNetWork(!1);
if (!this.m_bIsHoldClose) {
-1 != this.m_nConnectNum && clearTimeout(this.m_nConnectNum);
this.m_nConnectNum = setTimeout(function() {
cc.vv.GameManager.onEnterFront();
}, .1);
}
},
connect: function(e, t, n) {
this.m_conectCallback = n;
this.m_cDstIP = e;
this.m_bIsSendHeard = t;
return this.doConnect();
},
doConnect: function() {
var e = this;
if (this.getNetWorkState() == o || this.getNetWorkState() == a) {
cc.error("already connect to server. state = " + this.getNetWorkState());
return !1;
}
if (!(this.m_cDstIP && 0 < this.m_cDstIP.length)) {
cc.error("dstIP is null.");
return !1;
}
this.m_bIsHoldClose = !1;
console.log("connect to server. dstIP = " + this.m_cDstIP);
this.m_nConnectCount++;
this.m_eNetWorkState = a;
this.m_pSocket = new WebSocket(this.m_cDstIP);
this.m_pSocket.onopen = this.onOpen.bind(this);
this.m_pSocket.onclose = this.onClose.bind(this);
this.m_pSocket.onerror = this.onError.bind(this);
this.m_pSocket.onmessage = this.onMessage.bind(this);
-1 != this.m_nConnectGameServerNum_1 && clearTimeout(this.m_nConnectGameServerNum_1);
-1 != this.m_nConnectNum && clearTimeout(this.m_nConnectNum);
this.m_nConnectGameServerNum_1 = setTimeout(function() {
e.isConnect() || e.m_pSocket && e.closeNetWork(!1);
}, this._timeOut);
return !0;
},
onOpen: function(e) {
console.log(" open ");
-1 != this.m_nConnectGameServerNum_1 && clearTimeout(this.m_nConnectGameServerNum_1);
this.m_bIsOnConnectGameServer = !1;
this.m_nConnectCount = 0;
this.m_eNetWorkState = o;
this.m_conectCallback && this.m_conectCallback();
this.m_bIsSendHeard && this.doSendHeadBet();
},
onClose: function(e) {
console.log(" close ");
-1 != this.m_nConnectGameServerNum_1 && clearTimeout(this.m_nConnectGameServerNum_1);
this.m_pSocket = null;
this.m_eNetWorkState = r;
this.timeOutConnect();
},
onError: function(e) {
console.log(" error ");
-1 != this.m_nConnectGameServerNum_1 && clearTimeout(this.m_nConnectGameServerNum_1);
this.m_eNetWorkState = s;
},
onMessage: function(e) {
this.m_handleResponeDataCallBack(e.data);
},
sendMsg: function(e) {
if (this.isConnect()) {
this.m_pSocket.send(e);
return !0;
}
console.log("send msg error. state = " + this.getNetWorkState());
return !1;
},
setReceiveHeadMsg: function() {
this.m_bReciveHeadMsg = !0;
},
doSendHeadBet: function() {
var e = this;
if (this.isConnect()) {
this.m_bReciveHeadMsg = !1;
cc.vv.NetManager.sendHeartbeat();
console.log("send head msg.");
-1 != this.m_nHeartbeatNum && clearTimeout(this.m_nHeartbeatNum);
this.m_nHeartbeatNum = setTimeout(function() {
e.m_bReciveHeadMsg ? e.doSendHeadBet() : e.timeOutConnect();
}, this._timeOut);
} else {
cc.error("doSendHeadBet error. netWork state = " + this.getNetWorkState());
this.timeOutConnect();
}
}
}
});
cc._RF.pop();
}, {} ],
WifiMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "e3797EUrLtKzJ8scsA3vpe7", "WifiMgr");
cc.Class({
extends: cc.Component,
properties: {
wifiAtlas: cc.SpriteAtlas
},
start: function() {
var e = this;
this.updateWifiSign();
this.schedule(function() {
e.updateWifiSign();
}, 1);
},
updateWifiSign: function() {
var e = cc.vv.NetManager.getPingLevel();
this.node.getComponent(cc.Sprite).spriteFrame = this.wifiAtlas.getSpriteFrame("wifi_" + e);
}
});
cc._RF.pop();
}, {} ],
WxMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "4b7ceAy/GBH5KpGCRIG+KFG", "WxMgr");
cc.Class({
extends: cc.Component,
statics: {
init: function() {
this.registerAllMsg();
},
registerAllMsg: function() {},
isWXAppInstalled: function() {
var e = !1, t = cc.vv.PlatformApiMgr.isInstallWXApp();
1 == Number(t) && (e = !0);
return e;
},
wxLogin: function(e) {
this._loginResultCall = e;
cc.vv.PlatformApiMgr.addCallback(this.loginSdkCallback.bind(this), "loginSdkCallback");
cc.vv.PlatformApiMgr.wxLogin();
},
wxPay: function() {},
wxShareText: function(e, t, n) {
this._shareEndCall = n;
var i = {};
i.shareScene = e;
i.shareType = 1;
i.textMsg = t;
cc.vv.PlatformApiMgr.addCallback(this.shareResultCall.bind(this), "shareResultCall");
cc.vv.PlatformApiMgr.wxShare(JSON.stringify(i));
},
wxShareImg: function(e, t, n) {
this._shareEndCall = n;
var i = {};
i.shareScene = e;
i.shareType = 2;
i.imgPath = t;
cc.vv.PlatformApiMgr.addCallback(this.shareResultCall.bind(this), "shareResultCall");
cc.vv.PlatformApiMgr.wxShare(JSON.stringify(i));
},
wxShareWeb: function(e, t, n, i, a, o) {
this._shareEndCall = o;
var s = {};
s.shareScene = e;
s.shareType = 3;
s.linkUrl = a;
s.imgUrl = i;
s.title = t;
s.des = n;
cc.vv.PlatformApiMgr.addCallback(this.shareResultCall.bind(this), "shareResultCall");
cc.vv.PlatformApiMgr.wxShare(JSON.stringify(s));
},
openWxApp: function() {
return cc.vv.PlatformApiMgr.openWXApp();
},
shareResultCall: function(e) {
this._shareEndCall && this._shareEndCall(e);
},
loginSdkCallback: function(e) {
e.result, e.token, e.uid;
this._loginResultCall && this._loginResultCall(e);
},
getWXToken: function() {
var e = Global.getLocal("wxToken");
return e && 0 < e.length ? e : null;
},
saveWXToken: function(e) {
e && Global.saveLocal("wxToken", e);
},
delWXToken: function() {
this.saveWXToken("");
}
}
});
cc._RF.pop();
}, {} ],
gameAudioSwitch: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "fcfb7NNnERFJaA6vVrSa2H2", "gameAudioSwitch");
cc.Class({
extends: cc.Component,
properties: {
btn_audio: cc.Button,
frame_btn_state: {
default: [],
type: cc.SpriteFrame
},
frame_btn_en: {
default: [],
displayName: "英文图片数组",
type: cc.SpriteFrame
}
},
onLoad: function() {},
start: function() {
var e = cc.vv.AudioManager.getEffVolume();
this.setStateComm(this.btn_audio, e);
},
onClickAudio: function() {
var e = 0;
e = 0 == cc.vv.AudioManager.getEffVolume() ? 1 : 0;
cc.vv.AudioManager.setEffVolume(e);
cc.vv.AudioManager.setBgmVolume(e);
this.setStateComm(this.btn_audio, e);
},
setStateComm: function(e, t) {
if (e) {
var n = 0;
0 === t && (n = 1);
var i = e.getComponent(cc.Sprite);
if (i) {
var a = this.getSpriteRes(n);
a && (i.spriteFrame = a);
}
}
},
getSpriteRes: function(e) {
var t = this.frame_btn_state[e];
"en" === Global.language && this.frame_btn_en && (t = this.frame_btn_en[e]);
return t;
}
});
cc._RF.pop();
}, {} ],
"gray.frag": [ function(e, t, n) {
"use strict";
cc._RF.push(t, "11550r6TmRHrpJwGDq5UWWk", "gray.frag");
t.exports = "\n#ifdef GL_ES\nprecision lowp float;\n#endif\n\nvarying vec4 v_fragmentColor;\nvarying vec2 v_texCoord;\nvoid main()\n{\n    vec4 c = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\n    gl_FragColor.xyz = vec3(0.2126*c.r + 0.7152*c.g + 0.0722*c.b);\n    gl_FragColor.w = c.w;\n}\n";
cc._RF.pop();
}, {} ],
"gray.vert": [ function(e, t, n) {
"use strict";
cc._RF.push(t, "af259VJS8VB+YM2gTrr53DZ", "gray.vert");
t.exports = "\nattribute vec4 a_position;\nattribute vec2 a_texCoord;\nattribute vec4 a_color;\nvarying vec4 v_fragmentColor; \nvarying vec2 v_texCoord; \nvoid main() \n{ \n    gl_Position = CC_PMatrix * a_position;\n    v_fragmentColor = a_color; \n    v_texCoord = a_texCoord; \n}\n";
cc._RF.pop();
}, {} ],
hall_pre_loading: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "ec3d433jz1FEYbBuF2T2zzu", "hall_pre_loading");
cc.Class({
extends: cc.Component,
properties: {
lbl_precent: cc.Label,
pro_precent: cc.ProgressBar,
_pro: 0,
_light: null
},
onLoad: function() {
this.node.name = "hall_pre_loading";
this._light = this.pro_precent.node.getChildByName("light");
this._light && (this._light.active = !1);
},
start: function() {
this.initUI();
this.loadAtlas();
},
initUI: function() {
cc.find("common_bg", this.node);
},
loadAtlas: function() {
cc.loader.loadResDir("items", cc.SpriteFrame, this.loadProgress.bind(this), this.loadFinish.bind(this));
},
loadProgress: function(e, t, n) {
this._pro = Number(e / t);
isNaN(this._pro) && (this._pro = 0);
1 <= this._pro && (this._pro = 1);
this.pro_precent.progress = this._pro;
this.lbl_precent.string = Global.S2P(100 * this._pro, 0) + "%";
if (this._light) {
this._light.active = this._pro < 1;
this._light.x = -this.pro_precent.totalLength / 2 + this.pro_precent.totalLength * this._pro;
this._light.y = 0;
}
},
loadFinish: function(e, t) {
if (!e) {
Global.appId === Global.APPID.Poly && cc.vv.AppData.addItemsSpriteAtlas(t);
cc.vv.EventManager.emit(EventId.ENTER_HALL);
}
}
});
cc._RF.pop();
}, {} ],
hotupdate: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "12917XLxXRKlacdMHGtn3n3", "hotupdate");
var o = e("Md5");
cc.Class({
extends: cc.Component,
properties: {
progressBar: cc.ProgressBar,
lblTips: cc.Label,
_manifestUrl: null,
mainfest: cc.RawAsset,
_updating: !1,
_failCount: 0,
_canRetry: !1,
_checkListener: null,
_updateListener: null,
_storagePath: "",
_assManager: null,
_checkOver: !1,
_countdownSec: 0,
_overtimeCount: 0,
_light: null
},
onLoad: function() {
this.node.parent.name = "hotupdate";
if (Global.isNative()) {
this._manifestUrl = this.mainfest;
AppLog.log("#####################-------------------");
var e = cc.sys.localStorage.getItem("HotUpdateSearchPaths");
AppLog.log(JSON.stringify(e));
this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
this._assManager = new jsb.AssetsManager("", this._storagePath, this.versionComHandle.bind(this));
Global.retain(this._assManager);
this._assManager.setVerifyCallback(this.verifyCallback.bind(this));
Global.isAndroid() && this._assManager.setMaxConcurrentTask(2);
this._light = this.progressBar.node.getChildByName("light");
this._light && (this._light.active = !1);
this.progressBar.progress = 0;
this.node.runAction(cc.fadeIn(1));
}
},
start: function() {
if (Global.isNative()) {
this.lblTips.string = "版本检测中,请稍后...";
this.checkForceAppUpdate();
} else this.enterLoginScene();
},
update: function(e) {
this._countdownSec += e;
if (3 < this._countdownSec && !this._checkOver) {
this._countdownSec -= 3;
if (3 <= this._overtimeCount) {
this._checkOver = !0;
this.enterLoginScene();
} else {
this._overtimeCount++;
this.checkForceAppUpdate();
}
}
},
onDestroy: function() {
if (this._updateListener) {
cc.eventManager.removeListener(this._updateListener);
this._updateListener = null;
}
Global.release(this._assManager);
},
enterLoginScene: function() {
this._assManager.getLocalManifest() && (Global.resVersion = this._assManager.getLocalManifest().getVersion());
cc.vv.SceneMgr.enterScene("login", function() {}.bind(this));
},
checkForceAppUpdate: function() {
AppLog.log("检测App强制更新！");
var e = jsb.fileUtils.getStringFromFile(this._manifestUrl);
if (e) {
var t = JSON.parse(e);
cc.vv.SubGameUpdateNode.getComponent("SubGameUpdate").setSubGamesVer(t.subGamesVer);
AppLog.log("##############url:" + t.remoteVersionUrl);
cc.vv.NetManager.requestHttp("", {}, function(e, t) {
if (e) {
if (this._checkOver) {
AppLog.log("已经检测完成...");
return;
}
this._checkOver = !0;
var n = "string" == typeof t ? JSON.parse(t) : t;
if (Global.isIOS() && cc.vv.PlatformApiMgr.getAppVersion() == n.ios_review_version) {
AppLog.log("当前是提审版本！");
Global.isReview = !0;
this.enterLoginScene();
return;
}
var i = parseInt(cc.vv.PlatformApiMgr.getAppVersion().split(".").join("")), a = parseInt(n.android_app_version.split(".").join("")), o = n.force_update_android, s = n.androidAppUrl;
if (Global.isIOS()) {
a = parseInt(n.ios_app_version.split(".").join(""));
o = n.force_update_ios;
s = n.iosAppUrl;
}
AppLog.log("@@@@@@@@@@@@@localAppVersion: " + i);
AppLog.log("@@@@@@@@@remoteAppVersion: " + a);
AppLog.log("@@@@@@@@@@@@isNeedForceUpdate: " + o);
AppLog.log("@@@@@@@@@@@@@@app_update_url: " + s);
if (i < a) {
AppLog.log("需要更新App");
if (o) {
AppLog.log("需要强制更新App");
cc.vv.AlertView.show(cc.vv.Language.new_ver, function() {
cc.vv.PlatformApiMgr.openURL(s);
cc.game.end();
}.bind(this));
} else cc.vv.AlertView.show(cc.vv.Language.new_ver, function() {
cc.vv.PlatformApiMgr.openURL(s);
cc.game.end();
}.bind(this), null, !0, function() {
AppLog.log("非强制更新，检测热更新！");
this.startCheckHotUpdate();
}.bind(this));
} else {
AppLog.log("不需要更新App！");
this.startCheckHotUpdate();
}
} else this.startCheckHotUpdate();
}.bind(this), t.remoteVersionUrl);
} else {
AppLog.warn("加载本地version.manifest文件失败");
this.enterLoginScene();
}
},
startCheckHotUpdate: function() {
if (!this.checkHotUpdate()) {
AppLog.warn("检测更新失败");
this.enterLoginScene();
}
},
checkHotUpdate: function() {
if (this._updating) AppLog.log("Checking or Updating ..."); else {
this._assManager.getState() === jsb.AssetsManager.State.UNINITED && this._assManager.loadLocalManifest(this._manifestUrl);
if (this._assManager.getLocalManifest() && this._assManager.getLocalManifest().isLoaded()) {
this._checkListener = new jsb.EventListenerAssetsManager(this._assManager, this.checkCallback.bind(this));
cc.eventManager.addListener(this._checkListener, 1);
this._assManager.checkUpdate();
return !0;
}
AppLog.warn("Failed to load local manifest ...");
}
},
startHotupdate: function() {
if (this._assManager && !this._updating) {
this.lblTips.string = "资源更新中，请稍后...";
this._updateListener = new jsb.EventListenerAssetsManager(this._assManager, this.updateCallback.bind(this));
cc.eventManager.addListener(this._updateListener, 1);
this._assManager.getState() === jsb.AssetsManager.State.UNINITED && this._assManager.loadLocalManifest(this._manifestUrl);
this._failCount = 0;
this._assManager.update();
this._updating = !0;
}
},
checkCallback: function(e) {
cc.log("Code: " + e.getEventCode());
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
AppLog.warn("No local manifest file found, hot update skipped.");
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
AppLog.warn("Fail to download manifest file, hot update skipped.");
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
AppLog.warn("Already up to date with the latest remote version.");
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
this.startHotupdate();
AppLog.warn("New version found, please try to update.");
return;

default:
return;
}
cc.eventManager.removeListener(this._checkListener);
this._checkListener = null;
this._updating = !1;
this.enterLoginScene();
},
updateCallback: function(e) {
var t = !1, n = !1;
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
AppLog.warn("No local manifest file found, hot update skipped.");
n = !0;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
var i = Math.floor(e.getDownloadedBytes() / e.getTotalBytes() * 100);
if ((i = isNaN(i) ? 0 : i) <= 100) {
Global.appId === Global.APPID.BigBang ? this.lblTips.string = i + "%" : this.lblTips.string = i + "/100";
this.progressBar.progress = i / 100;
}
if (this._light) {
this._light.active = this._pro < 1;
this._light.x = -this.progressBar.totalLength / 2 + this.progressBar.totalLength * this.progressBar.progress;
this._light.y = 0;
}
var a = e.getMessage();
a && AppLog.log(e.getPercent() / 100 + "% : " + a);
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
AppLog.warn("Fail to download manifest file, hot update skipped.");
n = !0;
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
AppLog.warn("Already up to date with the latest remote version.");
n = !0;
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
AppLog.log("Update finished. " + e.getMessage());
t = !0;
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
AppLog.warn("Update failed. " + e.getMessage());
this._updating = !1;
this._canRetry = !0;
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
AppLog.warn("Asset update error: " + e.getAssetId() + ", " + e.getMessage());
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
AppLog.log(e.getMessage());
}
if (this._canRetry) {
console.log("#################download update failed files");
this._canRetry = !1;
this._assManager.downloadFailedAssets();
}
if (n) {
cc.eventManager.removeListener(this._updateListener);
this._updateListener = null;
this._updating = !1;
this.enterLoginScene();
}
if (t) {
cc.eventManager.removeListener(this._updateListener);
this._updateListener = null;
var o = jsb.fileUtils.getSearchPaths(), s = this._assManager.getLocalManifest().getSearchPaths();
AppLog.log(JSON.stringify(s));
Array.prototype.unshift(o, s);
cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(o));
jsb.fileUtils.setSearchPaths(o);
cc.audioEngine.stopAll();
cc.game.restart();
}
},
versionComHandle: function(e, t) {
AppLog.log("JS Custom Version Compare: version A is " + e + ", version B is " + t);
for (var n = e.split("."), i = t.split("."), a = 0; a < n.length; ++a) {
if (parseInt(n[a]) !== parseInt(i[a])) return -1;
}
return i.length > n.length ? -1 : 0;
},
verifyCallback: function(e, t) {
var n = t.compressed, i = (t.md5, t.path);
t.size;
if (n) {
AppLog.log("Verification passed : " + i);
return !0;
}
var a = jsb.fileUtils.getWritablePath() + "remote-asset_temp/" + i;
if (jsb.fileUtils.isFileExist(a)) {
return o(jsb.fileUtils.getDataFromFile(a)) === t.md5;
}
return !1;
}
});
cc._RF.pop();
}, {
Md5: "Md5"
} ],
lauch: [ function(d, e, t) {
"use strict";
cc._RF.push(e, "a926erjdRBMzZ52kpxBGxpF", "lauch");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
cc.director.setDisplayStats(!1);
d("AppLog");
d("GlobalVar");
d("MsgIdDef");
d("EventDef");
d("GlobalCfg");
d("GlobalFunc");
Global.autoAdaptDevices(!1);
cc.vv = {};
var e = d("AudioManager");
e.init();
cc.vv.AudioManager = e;
cc.vv.Language = d("ChineseCfg");
cc.vv.EventManager = d("EventManager");
var t = d("NetManager");
t.init();
cc.vv.NetManager = t;
var n = d("PlatformApi");
n.init();
cc.vv.PlatformApiMgr = n;
var i = d("FloatTip");
cc.vv.FloatTip = new i();
cc.vv.FloatTip.init("common/prefab/FloatTip");
var a = d("AlertViewMgr");
cc.vv.AlertView = new a();
var o = d("SceneMgr");
cc.vv.SceneMgr = o;
var s = new cc.Node();
s.addComponent("SubGameUpdate");
cc.vv.SubGameUpdateNode = s;
cc.game.addPersistRootNode(s);
var r = Number(cc.sys.localStorage.getItem("_audioVolue"));
null === r && (r = 1);
var c = parseInt(cc.sys.localStorage.getItem("_effectIsOpen"));
null === c && (c = 1);
cc.vv.AudioManager.setEffVolume(1 == c ? r : 0);
var l = parseInt(cc.sys.localStorage.getItem("_musicIsOpen"));
null === l && (l = 1);
cc.vv.AudioManager.setBgmVolume(1 == l ? r : 0);
var h = cc.sys.localStorage.getItem("language");
null === h && (h = 0);
Global.language = h;
cc.vv.WxMgr = d("WxMgr");
d("AssetManager").loadAllRes();
this.loadAlterView();
this.loadLoadingTip();
},
loadLoadingTip: function() {
cc.loader.loadRes("common/prefab/LoadingTip", cc.Prefab, function(e, t) {
(function(e, t) {
if (null == e) {
var n = cc.instantiate(t);
cc.game.addPersistRootNode(n);
} else AppLog.err("prefab(game_common/common/prefab/LoadingTip) load error");
})(e, t);
});
},
loadAlterView: function() {
cc.loader.loadRes("common/prefab/AlterView", cc.Prefab, function(e, t) {
n = t, null == e && cc.vv.AlertView.init(n);
var n;
});
},
start: function() {
var e = this, t = cc.find("Canvas");
Global.centerPos = cc.v2(t.width / 2, t.height / 2);
if (Global.isAndroid()) {
cc.vv.PlatformApiMgr.closeSplash();
e.loadNextScene();
} else setTimeout(function() {
e.loadNextScene();
}, 1500);
},
loadNextScene: function() {
this.node.runAction(cc.fadeOut(1));
Global.isNative() && Global.openUpdate ? cc.vv.SceneMgr.enterScene("hotupdate", this.onLoadHotupdateSceneFinish.bind(this)) : cc.vv.SceneMgr.enterScene("login", this.onLoadLoginSceneFinish.bind(this));
},
onLoadHotupdateSceneFinish: function() {
cc.log("onLoadHotupdateSceneFinish");
},
onLoadLoginSceneFinish: function() {
cc.log("onLoadLoginSceneFinish");
}
});
cc._RF.pop();
}, {
AlertViewMgr: "AlertViewMgr",
AppLog: "AppLog",
AssetManager: "AssetManager",
AudioManager: "AudioManager",
ChineseCfg: "ChineseCfg",
EventDef: "EventDef",
EventManager: "EventManager",
FloatTip: "FloatTip",
GlobalCfg: "GlobalCfg",
GlobalFunc: "GlobalFunc",
GlobalVar: "GlobalVar",
MsgIdDef: "MsgIdDef",
NetManager: "NetManager",
PlatformApi: "PlatformApi",
SceneMgr: "SceneMgr",
WxMgr: "WxMgr"
} ],
login: [ function(r, e, t) {
"use strict";
cc._RF.push(e, "27525iCX4lKSruZwKK1s4UV", "login");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this.node.parent.name = "login";
Global.autoAdaptDevices(!1);
cc.vv = cc.vv || {};
if (!cc.vv.GameManager) {
var e = r("GameManager");
e.init();
cc.vv.GameManager = e;
}
var t = r("UserManager");
t.init();
cc.vv.UserManager = t;
cc.vv.UserManager.clearNotice();
var n = r("SpeakerMgr");
n.init();
cc.vv.SpeakerMgr = n;
cc.find("ver", this.node).getComponent(cc.Label).string = Global.resVersion;
this._exit_btn = this.node.getChildByName("btn_exit");
Global.btnClickEvent(this._exit_btn, this.onExit, this);
cc.vv.gameData = null;
this._visitor_btn = this.node.getChildByName("visitor_login");
Global.btnClickEvent(this._visitor_btn, this.onVisitorLogin, this);
this._wechat_login = this.node.getChildByName("wechat_login");
Global.btnClickEvent(this._wechat_login, this.onWeChatLogin, this);
var i = this.node.getChildByName("phone_login");
Global.btnClickEvent(i, this.onClickBindPhone, this);
this.initBindPhoneUI();
if (Global.isAndroid()) {
var a = Global.setAppidWithAppsecretForJS("wx82256d3bda922e13", "b87d6ec883757e530cdf55794df03e92");
console.log(a + "@@@@@@@@");
} else Global.isIOS();
if (!Global.noAutoLogin) {
var o = cc.sys.localStorage.getItem("openid"), s = cc.sys.localStorage.getItem("passwd");
o && 0 < o.length && cc.vv.GameManager.reqLogin(o, s, 14, o, "", "");
}
},
initBindPhoneUI: function() {
this.panel_bind_phone = this.node.getChildByName("panel_bind_phone");
var e = cc.find("bg_bind_phone/btn_close", this.panel_bind_phone);
Global.btnClickEvent(e, this.onClickBindPhone, this);
this.input_phoneNumStr = cc.find("bg_bind_phone/input_phoneNum", this.panel_bind_phone).getComponent(cc.EditBox);
this.input_codeStr = cc.find("bg_bind_phone/input_code", this.panel_bind_phone).getComponent(cc.EditBox);
this.btn_getCode = cc.find("bg_bind_phone/btn_getCode", this.panel_bind_phone);
Global.btnClickEvent(this.btn_getCode, this.onClickGetCode, this);
this.spr_countDown = this.btn_getCode.getChildByName("spr_countDown");
this.number_countDown = this.spr_countDown.getChildByName("number_countDown").getComponent(cc.Label);
var t = cc.find("bg_bind_phone/btn_confirm", this.panel_bind_phone);
Global.btnClickEvent(t, this.onClickConfirm, this);
},
onClickBindPhone: function() {
this.panel_bind_phone.active = !this.panel_bind_phone.active;
if (this.panel_bind_phone.active) {
this.input_phoneNumStr.string = "";
this.input_codeStr.string = "";
this.btn_getCode.getComponent(cc.Button).interactable = !0;
this.spr_countDown.active = !1;
this.number_countDown.string = "";
}
},
onClickGetCode: function() {
var e = this.input_phoneNumStr.string, t = parseInt(e);
if (11 == e.length && t) {
var n = {
c: MsgId.GER_PHONE_CODE
};
n.mobile = t;
cc.vv.NetManager.send(n);
this.btn_getCode.getComponent(cc.Button).interactable = !1;
this.spr_countDown.active = !0;
var i = 90;
this.number_countDown.string = i;
var a = this;
a.btn_getCode.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1), cc.callFunc(function() {
a.number_countDown.string = --i;
if (0 == i) {
a.btn_getCode.getComponent(cc.Button).interactable = !0;
a.spr_countDown.active = !1;
a.btn_getCode.stopAllActions();
}
}))));
} else cc.vv.FloatTip.show("手机号输入错误");
},
onClickConfirm: function() {
var e = this.input_phoneNumStr.string;
parseInt(e), this.input_codeStr.string;
},
onPhoneLogin: function() {},
onWeChatLoginCallBack: function(e) {
console.log("code is  " + e);
var t = this;
t._nickname = "";
if (0 == t._nickname.length) {
var n = Global.getLocal("account", "");
t._nickname = n;
0 == t._nickname.length && (t._nickname = "G" + Global.random(1e4, 99999));
}
Global.saveLocal("account", t._nickname);
var i = Global.getLocal("guest_token_map", ""), a = 0 < i.length ? JSON.parse(i) : {}, o = a[t._nickname];
if (!o || o.length <= 0) {
o = new Date().getTime() + "_" + Global.random(1, 99999999);
a[t._nickname] = o;
Global.saveLocal("guest_token_map", JSON.stringify(a));
}
cc.vv.GameManager.reqLogin(e, "", 10, e, "", "");
Global.playEff(Global.SOUNDS.eff_click);
},
onWeChatLogin: function() {
if (Global.isNative()) {
var e = cc.sys.localStorage.getItem("openid"), t = cc.sys.localStorage.getItem("passwd");
if (e && 0 < e.length) cc.vv.GameManager.reqLogin(e, t, 14, e, "", ""); else {
if (!Global.isWXAppInstalled()) {
cc.warn("请先下载微信客户端，或web端暂不支持");
cc.vv.FloatTip.show("请先下载微信客户端，或web端暂不支持微信客户端");
return;
}
Global.onWxAuthorize(this.onWeChatLoginCallBack, this);
}
} else {
var n = "oJtfO5gD5B2WVXlfmXeSkP4fQsCk";
cc.sys.localStorage.setItem("openid", n);
cc.vv.GameManager.reqLogin(n, "Aa123456", 14, n, "", "");
}
},
onVisitorLogin: function() {
var e = this;
e._nickname = "";
if (0 == e._nickname.length) {
var t = Global.getLocal("account", "");
e._nickname = t;
0 == e._nickname.length && (e._nickname = "G" + Global.random(1e4, 99999));
}
Global.saveLocal("account", e._nickname);
var n = Global.getLocal("guest_token_map", ""), i = 0 < n.length ? JSON.parse(n) : {}, a = i[e._nickname];
if (!a || a.length <= 0) {
a = new Date().getTime() + "_" + Global.random(1, 99999999);
i[e._nickname] = a;
Global.saveLocal("guest_token_map", JSON.stringify(i));
}
cc.vv.GameManager.reqLogin(e._nickname, "", 11, "", "", "");
Global.playEff(Global.SOUNDS.eff_click);
},
onExit: function() {
var e = cc.vv.Language.request_quit;
cc.vv.AlertView.show(e, function() {
cc.game.end();
}, function() {});
},
start: function() {},
onDestroy: function() {}
});
cc._RF.pop();
}, {
GameManager: "GameManager",
SpeakerMgr: "SpeakerMgr",
UserManager: "UserManager"
} ],
"md5.min": [ function(e, s, t) {
"use strict";
cc._RF.push(s, "73110oizxxDD5d4nevld/CV", "md5.min");
var v = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
!function(e) {
function d(e, t) {
var n = (65535 & e) + (65535 & t);
return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
}
function r(e, t, n, i, a, o) {
return d((s = d(d(t, e), d(i, o))) << (r = a) | s >>> 32 - r, n);
var s, r;
}
function u(e, t, n, i, a, o, s) {
return r(t & n | ~t & i, e, t, a, o, s);
}
function g(e, t, n, i, a, o, s) {
return r(t & i | n & ~i, e, t, a, o, s);
}
function _(e, t, n, i, a, o, s) {
return r(t ^ n ^ i, e, t, a, o, s);
}
function f(e, t, n, i, a, o, s) {
return r(n ^ (t | ~i), e, t, a, o, s);
}
function c(e, t) {
e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;
var n, i, a, o, s, r = 1732584193, c = -271733879, l = -1732584194, h = 271733878;
for (n = 0; n < e.length; n += 16) c = f(c = f(c = f(c = f(c = _(c = _(c = _(c = _(c = g(c = g(c = g(c = g(c = u(c = u(c = u(c = u(a = c, l = u(o = l, h = u(s = h, r = u(i = r, c, l, h, e[n], 7, -680876936), c, l, e[n + 1], 12, -389564586), r, c, e[n + 2], 17, 606105819), h, r, e[n + 3], 22, -1044525330), l = u(l, h = u(h, r = u(r, c, l, h, e[n + 4], 7, -176418897), c, l, e[n + 5], 12, 1200080426), r, c, e[n + 6], 17, -1473231341), h, r, e[n + 7], 22, -45705983), l = u(l, h = u(h, r = u(r, c, l, h, e[n + 8], 7, 1770035416), c, l, e[n + 9], 12, -1958414417), r, c, e[n + 10], 17, -42063), h, r, e[n + 11], 22, -1990404162), l = u(l, h = u(h, r = u(r, c, l, h, e[n + 12], 7, 1804603682), c, l, e[n + 13], 12, -40341101), r, c, e[n + 14], 17, -1502002290), h, r, e[n + 15], 22, 1236535329), l = g(l, h = g(h, r = g(r, c, l, h, e[n + 1], 5, -165796510), c, l, e[n + 6], 9, -1069501632), r, c, e[n + 11], 14, 643717713), h, r, e[n], 20, -373897302), l = g(l, h = g(h, r = g(r, c, l, h, e[n + 5], 5, -701558691), c, l, e[n + 10], 9, 38016083), r, c, e[n + 15], 14, -660478335), h, r, e[n + 4], 20, -405537848), l = g(l, h = g(h, r = g(r, c, l, h, e[n + 9], 5, 568446438), c, l, e[n + 14], 9, -1019803690), r, c, e[n + 3], 14, -187363961), h, r, e[n + 8], 20, 1163531501), l = g(l, h = g(h, r = g(r, c, l, h, e[n + 13], 5, -1444681467), c, l, e[n + 2], 9, -51403784), r, c, e[n + 7], 14, 1735328473), h, r, e[n + 12], 20, -1926607734), l = _(l, h = _(h, r = _(r, c, l, h, e[n + 5], 4, -378558), c, l, e[n + 8], 11, -2022574463), r, c, e[n + 11], 16, 1839030562), h, r, e[n + 14], 23, -35309556), l = _(l, h = _(h, r = _(r, c, l, h, e[n + 1], 4, -1530992060), c, l, e[n + 4], 11, 1272893353), r, c, e[n + 7], 16, -155497632), h, r, e[n + 10], 23, -1094730640), l = _(l, h = _(h, r = _(r, c, l, h, e[n + 13], 4, 681279174), c, l, e[n], 11, -358537222), r, c, e[n + 3], 16, -722521979), h, r, e[n + 6], 23, 76029189), l = _(l, h = _(h, r = _(r, c, l, h, e[n + 9], 4, -640364487), c, l, e[n + 12], 11, -421815835), r, c, e[n + 15], 16, 530742520), h, r, e[n + 2], 23, -995338651), l = f(l, h = f(h, r = f(r, c, l, h, e[n], 6, -198630844), c, l, e[n + 7], 10, 1126891415), r, c, e[n + 14], 15, -1416354905), h, r, e[n + 5], 21, -57434055), l = f(l, h = f(h, r = f(r, c, l, h, e[n + 12], 6, 1700485571), c, l, e[n + 3], 10, -1894986606), r, c, e[n + 10], 15, -1051523), h, r, e[n + 1], 21, -2054922799), l = f(l, h = f(h, r = f(r, c, l, h, e[n + 8], 6, 1873313359), c, l, e[n + 15], 10, -30611744), r, c, e[n + 6], 15, -1560198380), h, r, e[n + 13], 21, 1309151649), l = f(l, h = f(h, r = f(r, c, l, h, e[n + 4], 6, -145523070), c, l, e[n + 11], 10, -1120210379), r, c, e[n + 2], 15, 718787259), h, r, e[n + 9], 21, -343485551), 
r = d(r, i), c = d(c, a), l = d(l, o), h = d(h, s);
return [ r, c, l, h ];
}
function l(e) {
var t, n = "", i = 32 * e.length;
for (t = 0; t < i; t += 8) n += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
return n;
}
function h(e) {
var t, n = [];
for (n[(e.length >> 2) - 1] = void 0, t = 0; t < n.length; t += 1) n[t] = 0;
var i = 8 * e.length;
for (t = 0; t < i; t += 8) n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
return n;
}
function i(e) {
var t, n, i = "";
for (n = 0; n < e.length; n += 1) t = e.charCodeAt(n), i += "0123456789abcdef".charAt(t >>> 4 & 15) + "0123456789abcdef".charAt(15 & t);
return i;
}
function n(e) {
return unescape(encodeURIComponent(e));
}
function a(e) {
return l(c(h(t = n(e)), 8 * t.length));
var t;
}
function o(e, t) {
return function(e, t) {
var n, i, a = h(e), o = [], s = [];
for (o[15] = s[15] = void 0, 16 < a.length && (a = c(a, 8 * e.length)), n = 0; n < 16; n += 1) o[n] = 909522486 ^ a[n], 
s[n] = 1549556828 ^ a[n];
return i = c(o.concat(h(t)), 512 + 8 * t.length), l(c(s.concat(i), 640));
}(n(e), n(t));
}
function t(e, t, n) {
return t ? n ? o(t, e) : i(o(t, e)) : n ? a(e) : i(a(e));
}
"function" == typeof define && define.amd ? define(function() {
return t;
}) : "object" == ("undefined" == typeof s ? "undefined" : v(s)) && s.exports ? s.exports = t : e.md5 = t;
}(void 0);
cc._RF.pop();
}, {} ],
"msgpack.min": [ function(d, t, i) {
(function(n) {
"use strict";
cc._RF.push(t, "f576cRIh65PKbdy/zzZGZ+u", "msgpack.min");
var P = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
!function(e) {
if ("object" == ("undefined" == typeof i ? "undefined" : P(i)) && "undefined" != typeof t) t.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
("undefined" != typeof window ? window : "undefined" != typeof n ? n : "undefined" != typeof self ? self : this).msgpack = e();
}
}(function() {
return function o(s, r, c) {
function l(n, e) {
if (!r[n]) {
if (!s[n]) {
var t = "function" == typeof d && d;
if (!e && t) return t(n, !0);
if (h) return h(n, !0);
var i = new Error("Cannot find module '" + n + "'");
throw i.code = "MODULE_NOT_FOUND", i;
}
var a = r[n] = {
exports: {}
};
s[n][0].call(a.exports, function(e) {
var t = s[n][1][e];
return l(t || e);
}, a, a.exports, o, s, r, c);
}
return r[n].exports;
}
for (var h = "function" == typeof d && d, e = 0; e < c.length; e++) l(c[e]);
return l;
}({
1: [ function(e, t, n) {
n.encode = e("./encode").encode, n.decode = e("./decode").decode, n.Encoder = e("./encoder").Encoder, 
n.Decoder = e("./decoder").Decoder, n.createCodec = e("./ext").createCodec, n.codec = e("./codec").codec;
}, {
"./codec": 10,
"./decode": 12,
"./decoder": 13,
"./encode": 15,
"./encoder": 16,
"./ext": 20
} ],
2: [ function(e, n, t) {
(function(e) {
function t(e) {
return e && e.isBuffer && e;
}
n.exports = t("undefined" != typeof e && e) || t(this.Buffer) || t("undefined" != typeof window && window.Buffer) || this.Buffer;
}).call(this, e("buffer").Buffer);
}, {
buffer: 29
} ],
3: [ function(e, t, n) {
n.copy = function(e, t, n, i) {
var a;
n || (n = 0), i || 0 === i || (i = this.length), t || (t = 0);
var o = i - n;
if (e === this && n < t && t < i) for (a = o - 1; 0 <= a; a--) e[a + t] = this[a + n]; else for (a = 0; a < o; a++) e[a + t] = this[a + n];
return o;
}, n.toString = function(e, t, n) {
var i = this, a = 0 | t;
n || (n = i.length);
for (var o = "", s = 0; a < n; ) (s = i[a++]) < 128 ? o += String.fromCharCode(s) : (192 == (224 & s) ? s = (31 & s) << 6 | 63 & i[a++] : 224 == (240 & s) ? s = (15 & s) << 12 | (63 & i[a++]) << 6 | 63 & i[a++] : 240 == (248 & s) && (s = (7 & s) << 18 | (63 & i[a++]) << 12 | (63 & i[a++]) << 6 | 63 & i[a++]), 
65536 <= s ? (s -= 65536, o += String.fromCharCode(55296 + (s >>> 10), 56320 + (1023 & s))) : o += String.fromCharCode(s));
return o;
}, n.write = function(e, t) {
for (var n = this, i = t || (t |= 0), a = e.length, o = 0, s = 0; s < a; ) (o = e.charCodeAt(s++)) < 128 ? n[i++] = o : (o < 2048 ? n[i++] = 192 | o >>> 6 : (o < 55296 || 57343 < o ? n[i++] = 224 | o >>> 12 : (o = 65536 + (o - 55296 << 10 | e.charCodeAt(s++) - 56320), 
n[i++] = 240 | o >>> 18, n[i++] = 128 | o >>> 12 & 63), n[i++] = 128 | o >>> 6 & 63), 
n[i++] = 128 | 63 & o);
return i - t;
};
}, {} ],
4: [ function(e, t, n) {
function i(e) {
return new Array(e);
}
var a = e("./bufferish");
(n = t.exports = i(0)).alloc = i, n.concat = a.concat, n.from = function(e) {
if (!a.isBuffer(e) && a.isView(e)) e = a.Uint8Array.from(e); else if (a.isArrayBuffer(e)) e = new Uint8Array(e); else {
if ("string" == typeof e) return a.from.call(n, e);
if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');
}
return Array.prototype.slice.call(e);
};
}, {
"./bufferish": 8
} ],
5: [ function(e, t, n) {
function i(e) {
return new o(e);
}
var a = e("./bufferish"), o = a.global;
(n = t.exports = a.hasBuffer ? i(0) : []).alloc = a.hasBuffer && o.alloc || i, n.concat = a.concat, 
n.from = function(e) {
if (!a.isBuffer(e) && a.isView(e)) e = a.Uint8Array.from(e); else if (a.isArrayBuffer(e)) e = new Uint8Array(e); else {
if ("string" == typeof e) return a.from.call(n, e);
if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');
}
return o.from && 1 !== o.from.length ? o.from(e) : new o(e);
};
}, {
"./bufferish": 8
} ],
6: [ function(e, t, n) {
function a(e, t, n, i) {
var a = l.isBuffer(this), o = l.isBuffer(e);
if (a && o) return this.copy(e, t, n, i);
if (h || a || o || !l.isView(this) || !l.isView(e)) return c.copy.call(this, e, t, n, i);
var s = n || null != i ? r.call(this, n, i) : this;
return e.set(s, t), s.length;
}
function r(e, t) {
var n = this.slice || !h && this.subarray;
if (n) return n.call(this, e, t);
var i = l.alloc.call(this, t - e);
return a.call(this, i, 0, e, t), i;
}
var i, c = e("./buffer-lite");
n.copy = a, n.slice = r, n.toString = function(e, t, n) {
return (!s && l.isBuffer(this) ? this.toString : c.toString).apply(this, arguments);
}, n.write = (i = "write", function() {
return (this[i] || c[i]).apply(this, arguments);
});
var l = e("./bufferish"), o = l.global, s = l.hasBuffer && "TYPED_ARRAY_SUPPORT" in o, h = s && !o.TYPED_ARRAY_SUPPORT;
}, {
"./buffer-lite": 3,
"./bufferish": 8
} ],
7: [ function(e, t, i) {
function n(e) {
return new Uint8Array(e);
}
var a = e("./bufferish");
(i = t.exports = a.hasArrayBuffer ? n(0) : []).alloc = n, i.concat = a.concat, i.from = function(e) {
if (a.isView(e)) {
var t = e.byteOffset, n = e.byteLength;
(e = e.buffer).byteLength !== n && (e.slice ? e = e.slice(t, t + n) : (e = new Uint8Array(e)).byteLength !== n && (e = Array.prototype.slice.call(e, t, t + n)));
} else {
if ("string" == typeof e) return a.from.call(i, e);
if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');
}
return new Uint8Array(e);
};
}, {
"./bufferish": 8
} ],
8: [ function(e, t, o) {
function s(e) {
return n(this).alloc(e);
}
function n(e) {
return d(e) ? _ : u(e) ? f : h(e) ? g : c ? _ : l ? f : g;
}
function i() {
return !1;
}
function a(t, n) {
return t = "[object " + t + "]", function(e) {
return null != e && {}.toString.call(n ? e[n] : e) === t;
};
}
var r = o.global = e("./buffer-global"), c = o.hasBuffer = r && !!r.isBuffer, l = o.hasArrayBuffer = "undefined" != typeof ArrayBuffer, h = o.isArray = e("isarray");
o.isArrayBuffer = l ? function(e) {
return e instanceof ArrayBuffer || p(e);
} : i;
var d = o.isBuffer = c ? r.isBuffer : i, u = o.isView = l ? ArrayBuffer.isView || a("ArrayBuffer", "buffer") : i;
o.alloc = s, o.concat = function(e, t) {
t || (t = 0, Array.prototype.forEach.call(e, function(e) {
t += e.length;
}));
var n = this !== o && this || e[0], i = s.call(n, t), a = 0;
return Array.prototype.forEach.call(e, function(e) {
a += v.copy.call(e, i, a);
}), i;
}, o.from = function(e) {
return "string" == typeof e ? function(e) {
var t = 3 * e.length, n = s.call(this, t), i = v.write.call(n, e);
return t !== i && (n = v.slice.call(n, 0, i)), n;
}.call(this, e) : n(this).from(e);
};
var g = o.Array = e("./bufferish-array"), _ = o.Buffer = e("./bufferish-buffer"), f = o.Uint8Array = e("./bufferish-uint8array"), v = o.prototype = e("./bufferish-proto"), p = a("ArrayBuffer");
}, {
"./buffer-global": 2,
"./bufferish-array": 4,
"./bufferish-buffer": 5,
"./bufferish-proto": 6,
"./bufferish-uint8array": 7,
isarray: 34
} ],
9: [ function(e, t, n) {
function i(e) {
return this instanceof i ? (this.options = e, void this.init()) : new i(e);
}
function a(e, t) {
return e && t ? function() {
return e.apply(this, arguments), t.apply(this, arguments);
} : e || t;
}
function o(e) {
return new i(e);
}
var s = e("isarray");
n.createCodec = o, n.install = function(e) {
for (var t in e) i.prototype[t] = a(i.prototype[t], e[t]);
}, n.filter = function(e) {
return s(e) ? function(t) {
function n(e, t) {
return t(e);
}
return t = t.slice(), function(e) {
return t.reduce(n, e);
};
}(e) : e;
};
var r = e("./bufferish");
i.prototype.init = function() {
var e = this.options;
return e && e.uint8array && (this.bufferish = r.Uint8Array), this;
}, n.preset = o({
preset: !0
});
}, {
"./bufferish": 8,
isarray: 34
} ],
10: [ function(e, t, n) {
e("./read-core"), e("./write-core"), n.codec = {
preset: e("./codec-base").preset
};
}, {
"./codec-base": 9,
"./read-core": 22,
"./write-core": 25
} ],
11: [ function(e, t, n) {
function i(e) {
if (!(this instanceof i)) return new i(e);
if (e && (this.options = e).codec) {
var t = this.codec = e.codec;
t.bufferish && (this.bufferish = t.bufferish);
}
}
n.DecodeBuffer = i;
var a = e("./read-core").preset;
e("./flex-buffer").FlexDecoder.mixin(i.prototype), i.prototype.codec = a, i.prototype.fetch = function() {
return this.codec.decode(this);
};
}, {
"./flex-buffer": 21,
"./read-core": 22
} ],
12: [ function(e, t, n) {
n.decode = function(e, t) {
var n = new i(t);
return n.write(e), n.read();
};
var i = e("./decode-buffer").DecodeBuffer;
}, {
"./decode-buffer": 11
} ],
13: [ function(e, t, n) {
function i(e) {
return this instanceof i ? void o.call(this, e) : new i(e);
}
n.Decoder = i;
var a = e("event-lite"), o = e("./decode-buffer").DecodeBuffer;
i.prototype = new o(), a.mixin(i.prototype), i.prototype.decode = function(e) {
arguments.length && this.write(e), this.flush();
}, i.prototype.push = function(e) {
this.emit("data", e);
}, i.prototype.end = function(e) {
this.decode(e), this.emit("end");
};
}, {
"./decode-buffer": 11,
"event-lite": 31
} ],
14: [ function(e, t, n) {
function i(e) {
if (!(this instanceof i)) return new i(e);
if (e && (this.options = e).codec) {
var t = this.codec = e.codec;
t.bufferish && (this.bufferish = t.bufferish);
}
}
n.EncodeBuffer = i;
var a = e("./write-core").preset;
e("./flex-buffer").FlexEncoder.mixin(i.prototype), i.prototype.codec = a, i.prototype.write = function(e) {
this.codec.encode(this, e);
};
}, {
"./flex-buffer": 21,
"./write-core": 25
} ],
15: [ function(e, t, n) {
n.encode = function(e, t) {
var n = new i(t);
return n.write(e), n.read();
};
var i = e("./encode-buffer").EncodeBuffer;
}, {
"./encode-buffer": 14
} ],
16: [ function(e, t, n) {
function i(e) {
return this instanceof i ? void o.call(this, e) : new i(e);
}
n.Encoder = i;
var a = e("event-lite"), o = e("./encode-buffer").EncodeBuffer;
i.prototype = new o(), a.mixin(i.prototype), i.prototype.encode = function(e) {
this.write(e), this.emit("data", this.read());
}, i.prototype.end = function(e) {
arguments.length && this.encode(e), this.flush(), this.emit("end");
};
}, {
"./encode-buffer": 14,
"event-lite": 31
} ],
17: [ function(e, t, n) {
n.ExtBuffer = function e(t, n) {
return this instanceof e ? (this.buffer = i.from(t), void (this.type = n)) : new e(t, n);
};
var i = e("./bufferish");
}, {
"./bufferish": 8
} ],
18: [ function(t, e, n) {
function i(e) {
return r || (r = t("./encode").encode), r(e);
}
function a(e) {
return e.valueOf();
}
function o(e) {
(e = RegExp.prototype.toString.call(e).split("/")).shift();
var t = [ e.pop() ];
return t.unshift(e.join("/")), t;
}
function s(e) {
var t = {};
for (var n in d) t[n] = e[n];
return t;
}
n.setExtPackers = function(e) {
e.addExtPacker(14, Error, [ s, i ]), e.addExtPacker(1, EvalError, [ s, i ]), e.addExtPacker(2, RangeError, [ s, i ]), 
e.addExtPacker(3, ReferenceError, [ s, i ]), e.addExtPacker(4, SyntaxError, [ s, i ]), 
e.addExtPacker(5, TypeError, [ s, i ]), e.addExtPacker(6, URIError, [ s, i ]), e.addExtPacker(10, RegExp, [ o, i ]), 
e.addExtPacker(11, Boolean, [ a, i ]), e.addExtPacker(12, String, [ a, i ]), e.addExtPacker(13, Date, [ Number, i ]), 
e.addExtPacker(15, Number, [ a, i ]), "undefined" != typeof Uint8Array && (e.addExtPacker(17, Int8Array, h), 
e.addExtPacker(18, Uint8Array, h), e.addExtPacker(19, Int16Array, h), e.addExtPacker(20, Uint16Array, h), 
e.addExtPacker(21, Int32Array, h), e.addExtPacker(22, Uint32Array, h), e.addExtPacker(23, Float32Array, h), 
"undefined" != typeof Float64Array && e.addExtPacker(24, Float64Array, h), "undefined" != typeof Uint8ClampedArray && e.addExtPacker(25, Uint8ClampedArray, h), 
e.addExtPacker(26, ArrayBuffer, h), e.addExtPacker(29, DataView, h)), c.hasBuffer && e.addExtPacker(27, l, c.from);
};
var r, c = t("./bufferish"), l = c.global, h = c.Uint8Array.from, d = {
name: 1,
message: 1,
stack: 1,
columnNumber: 1,
fileName: 1,
lineNumber: 1
};
}, {
"./bufferish": 8,
"./encode": 15
} ],
19: [ function(t, e, n) {
function i(e) {
return c || (c = t("./decode").decode), c(e);
}
function a(e) {
return RegExp.apply(null, e);
}
function o(i) {
return function(e) {
var t = new i();
for (var n in d) t[n] = e[n];
return t;
};
}
function s(t) {
return function(e) {
return new t(e);
};
}
function r(e) {
return new Uint8Array(e).buffer;
}
n.setExtUnpackers = function(e) {
e.addExtUnpacker(14, [ i, o(Error) ]), e.addExtUnpacker(1, [ i, o(EvalError) ]), 
e.addExtUnpacker(2, [ i, o(RangeError) ]), e.addExtUnpacker(3, [ i, o(ReferenceError) ]), 
e.addExtUnpacker(4, [ i, o(SyntaxError) ]), e.addExtUnpacker(5, [ i, o(TypeError) ]), 
e.addExtUnpacker(6, [ i, o(URIError) ]), e.addExtUnpacker(10, [ i, a ]), e.addExtUnpacker(11, [ i, s(Boolean) ]), 
e.addExtUnpacker(12, [ i, s(String) ]), e.addExtUnpacker(13, [ i, s(Date) ]), e.addExtUnpacker(15, [ i, s(Number) ]), 
"undefined" != typeof Uint8Array && (e.addExtUnpacker(17, s(Int8Array)), e.addExtUnpacker(18, s(Uint8Array)), 
e.addExtUnpacker(19, [ r, s(Int16Array) ]), e.addExtUnpacker(20, [ r, s(Uint16Array) ]), 
e.addExtUnpacker(21, [ r, s(Int32Array) ]), e.addExtUnpacker(22, [ r, s(Uint32Array) ]), 
e.addExtUnpacker(23, [ r, s(Float32Array) ]), "undefined" != typeof Float64Array && e.addExtUnpacker(24, [ r, s(Float64Array) ]), 
"undefined" != typeof Uint8ClampedArray && e.addExtUnpacker(25, s(Uint8ClampedArray)), 
e.addExtUnpacker(26, r), e.addExtUnpacker(29, [ r, s(DataView) ])), l.hasBuffer && e.addExtUnpacker(27, s(h));
};
var c, l = t("./bufferish"), h = l.global, d = {
name: 1,
message: 1,
stack: 1,
columnNumber: 1,
fileName: 1,
lineNumber: 1
};
}, {
"./bufferish": 8,
"./decode": 12
} ],
20: [ function(e, t, n) {
e("./read-core"), e("./write-core"), n.createCodec = e("./codec-base").createCodec;
}, {
"./codec-base": 9,
"./read-core": 22,
"./write-core": 25
} ],
21: [ function(e, t, n) {
function i() {
if (!(this instanceof i)) return new i();
}
function a() {
if (!(this instanceof a)) return new a();
}
function o() {
throw new Error("method not implemented: write()");
}
function s() {
throw new Error("method not implemented: fetch()");
}
function r() {
return this.buffers && this.buffers.length ? (this.flush(), this.pull()) : this.fetch();
}
function c(e) {
(this.buffers || (this.buffers = [])).push(e);
}
function l() {
return (this.buffers || (this.buffers = [])).shift();
}
function h(n) {
return function(e) {
for (var t in n) e[t] = n[t];
return e;
};
}
n.FlexDecoder = i, n.FlexEncoder = a;
var d = e("./bufferish"), u = "BUFFER_SHORTAGE";
i.mixin = h({
bufferish: d,
write: function(e) {
var t = this.offset ? d.prototype.slice.call(this.buffer, this.offset) : this.buffer;
this.buffer = t ? e ? this.bufferish.concat([ t, e ]) : t : e, this.offset = 0;
},
fetch: s,
flush: function() {
for (;this.offset < this.buffer.length; ) {
var e, t = this.offset;
try {
e = this.fetch();
} catch (e) {
if (e && e.message != u) throw e;
this.offset = t;
break;
}
this.push(e);
}
},
push: c,
pull: l,
read: r,
reserve: function(e) {
var t = this.offset, n = t + e;
if (n > this.buffer.length) throw new Error(u);
return this.offset = n, t;
},
offset: 0
}), i.mixin(i.prototype), a.mixin = h({
bufferish: d,
write: o,
fetch: function() {
var e = this.start;
if (e < this.offset) {
var t = this.start = this.offset;
return d.prototype.slice.call(this.buffer, e, t);
}
},
flush: function() {
for (;this.start < this.offset; ) {
var e = this.fetch();
e && this.push(e);
}
},
push: c,
pull: function() {
var e = this.buffers || (this.buffers = []), t = 1 < e.length ? this.bufferish.concat(e) : e[0];
return e.length = 0, t;
},
read: r,
reserve: function(e) {
var t = 0 | e;
if (this.buffer) {
var n = this.buffer.length, i = 0 | this.offset, a = i + t;
if (a < n) return this.offset = a, i;
this.flush(), e = Math.max(e, Math.min(2 * n, this.maxBufferSize));
}
return e = Math.max(e, this.minBufferSize), this.buffer = this.bufferish.alloc(e), 
this.start = 0, this.offset = t, 0;
},
send: function(e) {
var t = e.length;
if (t > this.minBufferSize) this.flush(), this.push(e); else {
var n = this.reserve(t);
d.prototype.copy.call(e, this.buffer, n);
}
},
maxBufferSize: 65536,
minBufferSize: 2048,
offset: 0,
start: 0
}), a.mixin(a.prototype);
}, {
"./bufferish": 8
} ],
22: [ function(e, t, n) {
function i() {
var e, i, t = this.options;
return this.decode = (e = t, i = r.getReadToken(e), function(e) {
var t = s(e), n = i[t];
if (!n) throw new Error("Invalid type: " + (t ? "0x" + t.toString(16) : t));
return n(e);
}), t && t.preset && o.setExtUnpackers(this), this;
}
var a = e("./ext-buffer").ExtBuffer, o = e("./ext-unpacker"), s = e("./read-format").readUint8, r = e("./read-token"), c = e("./codec-base");
c.install({
addExtUnpacker: function(e, t) {
(this.extUnpackers || (this.extUnpackers = []))[e] = c.filter(t);
},
getExtUnpacker: function(t) {
return (this.extUnpackers || (this.extUnpackers = []))[t] || function(e) {
return new a(e, t);
};
},
init: i
}), n.preset = i.call(c.preset);
}, {
"./codec-base": 9,
"./ext-buffer": 17,
"./ext-unpacker": 19,
"./read-format": 23,
"./read-token": 24
} ],
23: [ function(e, t, n) {
function i(e, t) {
var n, i = {}, a = new Array(t), o = new Array(t), s = e.codec.decode;
for (n = 0; n < t; n++) a[n] = s(e), o[n] = s(e);
for (n = 0; n < t; n++) i[a[n]] = o[n];
return i;
}
function a(e, t) {
var n, i = new Map(), a = new Array(t), o = new Array(t), s = e.codec.decode;
for (n = 0; n < t; n++) a[n] = s(e), o[n] = s(e);
for (n = 0; n < t; n++) i.set(a[n], o[n]);
return i;
}
function o(e, t) {
for (var n = new Array(t), i = e.codec.decode, a = 0; a < t; a++) n[a] = i(e);
return n;
}
function s(e, t) {
var n = e.reserve(t), i = n + t;
return M.toString.call(e.buffer, "utf-8", n, i);
}
function r(e, t) {
var n = e.reserve(t), i = n + t, a = M.slice.call(e.buffer, n, i);
return R.from(a);
}
function c(e, t) {
var n = e.reserve(t), i = n + t, a = M.slice.call(e.buffer, n, i);
return R.Uint8Array.from(a).buffer;
}
function l(e, t) {
var n = e.reserve(t + 1), i = e.buffer[n++], a = n + t, o = e.codec.getExtUnpacker(i);
if (!o) throw new Error("Invalid ext type: " + (i ? "0x" + i.toString(16) : i));
return o(M.slice.call(e.buffer, n, a));
}
function h(e) {
var t = e.reserve(1);
return e.buffer[t];
}
function d(e) {
var t = e.reserve(1), n = e.buffer[t];
return 128 & n ? n - 256 : n;
}
function u(e) {
var t = e.reserve(2), n = e.buffer;
return n[t++] << 8 | n[t];
}
function g(e) {
var t = e.reserve(2), n = e.buffer, i = n[t++] << 8 | n[t];
return 32768 & i ? i - 65536 : i;
}
function _(e) {
var t = e.reserve(4), n = e.buffer;
return 16777216 * n[t++] + (n[t++] << 16) + (n[t++] << 8) + n[t];
}
function f(e) {
var t = e.reserve(4), n = e.buffer;
return n[t++] << 24 | n[t++] << 16 | n[t++] << 8 | n[t];
}
function v(n, i) {
return function(e) {
var t = e.reserve(n);
return i.call(e.buffer, t, w);
};
}
function p(e) {
return new S(this, e).toNumber();
}
function m(e) {
return new A(this, e).toNumber();
}
function b(e) {
return new S(this, e);
}
function C(e) {
return new A(this, e);
}
function E(e) {
return I.read(this, e, !1, 23, 4);
}
function N(e) {
return I.read(this, e, !1, 52, 8);
}
var I = e("ieee754"), y = e("int64-buffer"), S = y.Uint64BE, A = y.Int64BE;
n.getReadFormat = function(e) {
var t = R.hasArrayBuffer && e && e.binarraybuffer, n = e && e.int64;
return {
map: L && e && e.usemap ? a : i,
array: o,
str: s,
bin: t ? c : r,
ext: l,
uint8: h,
uint16: u,
uint32: _,
uint64: v(8, n ? b : p),
int8: d,
int16: g,
int32: f,
int64: v(8, n ? C : m),
float32: v(4, E),
float64: v(8, N)
};
}, n.readUint8 = h;
var R = e("./bufferish"), M = e("./bufferish-proto"), L = "undefined" != typeof Map, w = !0;
}, {
"./bufferish": 8,
"./bufferish-proto": 6,
ieee754: 32,
"int64-buffer": 33
} ],
24: [ function(e, t, n) {
function i(e) {
var t, n = new Array(256);
for (t = 0; t <= 127; t++) n[t] = a(t);
for (t = 128; t <= 143; t++) n[t] = s(t - 128, e.map);
for (t = 144; t <= 159; t++) n[t] = s(t - 144, e.array);
for (t = 160; t <= 191; t++) n[t] = s(t - 160, e.str);
for (n[192] = a(null), n[193] = null, n[194] = a(!1), n[195] = a(!0), n[196] = o(e.uint8, e.bin), 
n[197] = o(e.uint16, e.bin), n[198] = o(e.uint32, e.bin), n[199] = o(e.uint8, e.ext), 
n[200] = o(e.uint16, e.ext), n[201] = o(e.uint32, e.ext), n[202] = e.float32, n[203] = e.float64, 
n[204] = e.uint8, n[205] = e.uint16, n[206] = e.uint32, n[207] = e.uint64, n[208] = e.int8, 
n[209] = e.int16, n[210] = e.int32, n[211] = e.int64, n[212] = s(1, e.ext), n[213] = s(2, e.ext), 
n[214] = s(4, e.ext), n[215] = s(8, e.ext), n[216] = s(16, e.ext), n[217] = o(e.uint8, e.str), 
n[218] = o(e.uint16, e.str), n[219] = o(e.uint32, e.str), n[220] = o(e.uint16, e.array), 
n[221] = o(e.uint32, e.array), n[222] = o(e.uint16, e.map), n[223] = o(e.uint32, e.map), 
t = 224; t <= 255; t++) n[t] = a(t - 256);
return n;
}
function a(e) {
return function() {
return e;
};
}
function o(n, i) {
return function(e) {
var t = n(e);
return i(e, t);
};
}
function s(t, n) {
return function(e) {
return n(e, t);
};
}
var r = e("./read-format");
n.getReadToken = function(e) {
var t = r.getReadFormat(e);
return e && e.useraw ? function(e) {
var t, n = i(e).slice();
for (n[217] = n[196], n[218] = n[197], n[219] = n[198], t = 160; t <= 191; t++) n[t] = s(t - 160, e.bin);
return n;
}(t) : i(t);
};
}, {
"./read-format": 23
} ],
25: [ function(e, t, n) {
function i() {
var e, i, t = this.options;
return this.encode = (e = t, i = s.getWriteType(e), function(e, t) {
var n = i["undefined" == typeof t ? "undefined" : P(t)];
if (!n) throw new Error('Unsupported type "' + ("undefined" == typeof t ? "undefined" : P(t)) + '": ' + t);
n(e, t);
}), t && t.preset && a.setExtPackers(this), this;
}
var o = e("./ext-buffer").ExtBuffer, a = e("./ext-packer"), s = e("./write-type"), r = e("./codec-base");
r.install({
addExtPacker: function(t, e, n) {
function i(e) {
return n && (e = n(e)), new o(e, t);
}
n = r.filter(n);
var a = e.name;
a && "Object" !== a ? (this.extPackers || (this.extPackers = {}))[a] = i : (this.extEncoderList || (this.extEncoderList = [])).unshift([ e, i ]);
},
getExtPacker: function(e) {
var t = this.extPackers || (this.extPackers = {}), n = e.constructor, i = n && n.name && t[n.name];
if (i) return i;
for (var a = this.extEncoderList || (this.extEncoderList = []), o = a.length, s = 0; s < o; s++) {
var r = a[s];
if (n === r[0]) return r[1];
}
},
init: i
}), n.preset = i.call(r.preset);
}, {
"./codec-base": 9,
"./ext-buffer": 17,
"./ext-packer": 18,
"./write-type": 27
} ],
26: [ function(e, t, n) {
function i() {
var e = v.slice();
return e[196] = a(196), e[197] = o(197), e[198] = s(198), e[199] = a(199), e[200] = o(200), 
e[201] = s(201), e[202] = r(202, 4, C.writeFloatBE || h, !0), e[203] = r(203, 8, C.writeDoubleBE || d, !0), 
e[204] = a(204), e[205] = o(205), e[206] = s(206), e[207] = r(207, 8, c), e[208] = a(208), 
e[209] = o(209), e[210] = s(210), e[211] = r(211, 8, l), e[217] = a(217), e[218] = o(218), 
e[219] = s(219), e[220] = o(220), e[221] = s(221), e[222] = o(222), e[223] = s(223), 
e;
}
function a(a) {
return function(e, t) {
var n = e.reserve(2), i = e.buffer;
i[n++] = a, i[n] = t;
};
}
function o(a) {
return function(e, t) {
var n = e.reserve(3), i = e.buffer;
i[n++] = a, i[n++] = t >>> 8, i[n] = t;
};
}
function s(a) {
return function(e, t) {
var n = e.reserve(5), i = e.buffer;
i[n++] = a, i[n++] = t >>> 24, i[n++] = t >>> 16, i[n++] = t >>> 8, i[n] = t;
};
}
function r(i, a, o, s) {
return function(e, t) {
var n = e.reserve(a + 1);
e.buffer[n++] = i, o.call(e.buffer, t, n, s);
};
}
function c(e, t) {
new _(this, t, e);
}
function l(e, t) {
new f(this, t, e);
}
function h(e, t) {
u.write(this, e, t, !1, 23, 4);
}
function d(e, t) {
u.write(this, e, t, !1, 52, 8);
}
var u = e("ieee754"), g = e("int64-buffer"), _ = g.Uint64BE, f = g.Int64BE, v = e("./write-uint8").uint8, p = e("./bufferish"), m = p.global, b = p.hasBuffer && "TYPED_ARRAY_SUPPORT" in m && !m.TYPED_ARRAY_SUPPORT, C = p.hasBuffer && m.prototype || {};
n.getWriteToken = function(e) {
return e && e.uint8array ? ((n = i())[202] = r(202, 4, h), n[203] = r(203, 8, d), 
n) : b || p.hasBuffer && e && e.safe ? ((t = v.slice())[196] = r(196, 1, m.prototype.writeUInt8), 
t[197] = r(197, 2, m.prototype.writeUInt16BE), t[198] = r(198, 4, m.prototype.writeUInt32BE), 
t[199] = r(199, 1, m.prototype.writeUInt8), t[200] = r(200, 2, m.prototype.writeUInt16BE), 
t[201] = r(201, 4, m.prototype.writeUInt32BE), t[202] = r(202, 4, m.prototype.writeFloatBE), 
t[203] = r(203, 8, m.prototype.writeDoubleBE), t[204] = r(204, 1, m.prototype.writeUInt8), 
t[205] = r(205, 2, m.prototype.writeUInt16BE), t[206] = r(206, 4, m.prototype.writeUInt32BE), 
t[207] = r(207, 8, c), t[208] = r(208, 1, m.prototype.writeInt8), t[209] = r(209, 2, m.prototype.writeInt16BE), 
t[210] = r(210, 4, m.prototype.writeInt32BE), t[211] = r(211, 8, l), t[217] = r(217, 1, m.prototype.writeUInt8), 
t[218] = r(218, 2, m.prototype.writeUInt16BE), t[219] = r(219, 4, m.prototype.writeUInt32BE), 
t[220] = r(220, 2, m.prototype.writeUInt16BE), t[221] = r(221, 4, m.prototype.writeUInt32BE), 
t[222] = r(222, 2, m.prototype.writeUInt16BE), t[223] = r(223, 4, m.prototype.writeUInt32BE), 
t) : i();
var t, n;
};
}, {
"./bufferish": 8,
"./write-uint8": 28,
ieee754: 32,
"int64-buffer": 33
} ],
27: [ function(e, t, n) {
var p = e("isarray"), i = e("int64-buffer"), m = i.Uint64BE, b = i.Int64BE, a = e("./bufferish"), d = e("./bufferish-proto"), r = e("./write-token"), C = e("./write-uint8").uint8, E = e("./ext-buffer").ExtBuffer, c = "undefined" != typeof Uint8Array, l = "undefined" != typeof Map, N = [];
N[1] = 212, N[2] = 213, N[4] = 214, N[8] = 215, N[16] = 216, n.getWriteType = function(e) {
function o(e, t) {
if (null === t) return u(e, t);
if (_(t)) return f(e, t);
if (p(t)) return function(e, t) {
var n = t.length;
g[n < 16 ? 144 + n : n <= 65535 ? 220 : 221](e, n);
for (var i = e.codec.encode, a = 0; a < n; a++) i(e, t[a]);
}(e, t);
if (m.isUint64BE(t)) return n = e, i = t, void g[207](n, i.toArray());
var n, i, a, o;
if (b.isInt64BE(t)) return a = e, o = t, void g[211](a, o.toArray());
var s, r, c, l, h, d = e.codec.getExtPacker(t);
return d && (t = d(t)), t instanceof E ? (s = e, c = (r = t).buffer, l = c.length, 
h = N[l] || (l < 255 ? 199 : l <= 65535 ? 200 : 201), void (g[h](s, l), C[r.type](s), 
s.send(c))) : void v(e, t);
}
function u(e, t) {
g[192](e, t);
}
function n(e, t) {
var n = t.length;
g[n < 255 ? 196 : n <= 65535 ? 197 : 198](e, n), e.send(t);
}
function s(t, n) {
var e = Object.keys(n), i = e.length;
g[i < 16 ? 128 + i : i <= 65535 ? 222 : 223](t, i);
var a = t.codec.encode;
e.forEach(function(e) {
a(t, e), a(t, n[e]);
});
}
var h, g = r.getWriteToken(e), t = e && e.useraw, i = c && e && e.binarraybuffer, _ = i ? a.isArrayBuffer : a.isBuffer, f = i ? function(e, t) {
n(e, new Uint8Array(t));
} : n, v = l && e && e.usemap ? function(i, e) {
if (!(e instanceof Map)) return s(i, e);
var t = e.size;
g[t < 16 ? 128 + t : t <= 65535 ? 222 : 223](i, t);
var a = i.codec.encode;
e.forEach(function(e, t, n) {
a(i, t), a(i, e);
});
} : s;
return {
boolean: function(e, t) {
g[t ? 195 : 194](e, t);
},
function: u,
number: function(e, t) {
var n = 0 | t;
return t !== n ? void g[203](e, t) : void g[-32 <= n && n <= 127 ? 255 & n : 0 <= n ? n <= 255 ? 204 : n <= 65535 ? 205 : 206 : -128 <= n ? 208 : -32768 <= n ? 209 : 210](e, n);
},
object: t ? function(e, t) {
return _(t) ? (n = e, a = (i = t).length, void (g[a < 32 ? 160 + a : a <= 65535 ? 218 : 219](n, a), 
n.send(i))) : void o(e, t);
var n, i, a;
} : o,
string: (h = t ? function(e) {
return e < 32 ? 1 : e <= 65535 ? 3 : 5;
} : function(e) {
return e < 32 ? 1 : e <= 255 ? 2 : e <= 65535 ? 3 : 5;
}, function(e, t) {
var n = t.length, i = 5 + 3 * n;
e.offset = e.reserve(i);
var a = e.buffer, o = h(n), s = e.offset + o;
n = d.write.call(a, t, s);
var r = h(n);
if (o !== r) {
var c = s + r - o, l = s + n;
d.copy.call(a, a, c, s, l);
}
g[1 === r ? 160 + n : r <= 3 ? 215 + r : 219](e, n), e.offset += n;
}),
symbol: u,
undefined: u
};
};
}, {
"./bufferish": 8,
"./bufferish-proto": 6,
"./ext-buffer": 17,
"./write-token": 26,
"./write-uint8": 28,
"int64-buffer": 33,
isarray: 34
} ],
28: [ function(e, t, n) {
function i(n) {
return function(e) {
var t = e.reserve(1);
e.buffer[t] = n;
};
}
for (var a = n.uint8 = new Array(256), o = 0; o <= 255; o++) a[o] = i(o);
}, {} ],
29: [ function(t, e, P) {
(function(e) {
function n() {
return d.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function r(e, t) {
if (n() < t) throw new RangeError("Invalid typed array length");
return d.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = d.prototype : (null === e && (e = new d(t)), 
e.length = t), e;
}
function d(e, t, n) {
if (!(d.TYPED_ARRAY_SUPPORT || this instanceof d)) return new d(e, t, n);
if ("number" == typeof e) {
if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
return a(this, e);
}
return i(this, e, t, n);
}
function i(e, t, n, i) {
if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function(e, t, n, i) {
if (t.byteLength, n < 0 || t.byteLength < n) throw new RangeError("'offset' is out of bounds");
if (t.byteLength < n + (i || 0)) throw new RangeError("'length' is out of bounds");
return t = void 0 === n && void 0 === i ? new Uint8Array(t) : void 0 === i ? new Uint8Array(t, n) : new Uint8Array(t, n, i), 
d.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = d.prototype : e = o(e, t), e;
}(e, t, n, i) : "string" == typeof t ? function(e, t, n) {
if ("string" == typeof n && "" !== n || (n = "utf8"), !d.isEncoding(n)) throw new TypeError('"encoding" must be a valid string encoding');
var i = 0 | l(t, n), a = (e = r(e, i)).write(t, n);
return a !== i && (e = e.slice(0, a)), e;
}(e, t, n) : function(e, t) {
if (d.isBuffer(t)) {
var n = 0 | s(t.length);
return 0 === (e = r(e, n)).length || t.copy(e, 0, 0, n), e;
}
if (t) {
if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || (i = t.length) != i ? r(e, 0) : o(e, t);
if ("Buffer" === t.type && G(t.data)) return o(e, t.data);
}
var i;
throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}(e, t);
}
function c(e) {
if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
if (e < 0) throw new RangeError('"size" argument must not be negative');
}
function a(e, t) {
if (c(t), e = r(e, t < 0 ? 0 : 0 | s(t)), !d.TYPED_ARRAY_SUPPORT) for (var n = 0; n < t; ++n) e[n] = 0;
return e;
}
function o(e, t) {
var n = t.length < 0 ? 0 : 0 | s(t.length);
e = r(e, n);
for (var i = 0; i < n; i += 1) e[i] = 255 & t[i];
return e;
}
function s(e) {
if (e >= n()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + n().toString(16) + " bytes");
return 0 | e;
}
function l(e, t) {
if (d.isBuffer(e)) return e.length;
if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
"string" != typeof e && (e = "" + e);
var n = e.length;
if (0 === n) return 0;
for (var i = !1; ;) switch (t) {
case "ascii":
case "latin1":
case "binary":
return n;

case "utf8":
case "utf-8":
case void 0:
return M(e).length;

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return 2 * n;

case "hex":
return n >>> 1;

case "base64":
return L(e).length;

default:
if (i) return M(e).length;
t = ("" + t).toLowerCase(), i = !0;
}
}
function h(e, t, n) {
var i = e[t];
e[t] = e[n], e[n] = i;
}
function u(e, t, n, i, a) {
if (0 === e.length) return -1;
if ("string" == typeof n ? (i = n, n = 0) : 2147483647 < n ? n = 2147483647 : n < -2147483648 && (n = -2147483648), 
n = +n, isNaN(n) && (n = a ? 0 : e.length - 1), n < 0 && (n = e.length + n), n >= e.length) {
if (a) return -1;
n = e.length - 1;
} else if (n < 0) {
if (!a) return -1;
n = 0;
}
if ("string" == typeof t && (t = d.from(t, i)), d.isBuffer(t)) return 0 === t.length ? -1 : g(e, t, n, i, a);
if ("number" == typeof t) return t &= 255, d.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? a ? Uint8Array.prototype.indexOf.call(e, t, n) : Uint8Array.prototype.lastIndexOf.call(e, t, n) : g(e, [ t ], n, i, a);
throw new TypeError("val must be string, number or Buffer");
}
function g(e, t, n, i, a) {
function o(e, t) {
return 1 === r ? e[t] : e.readUInt16BE(t * r);
}
var s, r = 1, c = e.length, l = t.length;
if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
if (e.length < 2 || t.length < 2) return -1;
c /= r = 2, l /= 2, n /= 2;
}
if (a) {
var h = -1;
for (s = n; s < c; s++) if (o(e, s) === o(t, -1 === h ? 0 : s - h)) {
if (-1 === h && (h = s), s - h + 1 === l) return h * r;
} else -1 !== h && (s -= s - h), h = -1;
} else for (c < n + l && (n = c - l), s = n; 0 <= s; s--) {
for (var d = !0, u = 0; u < l; u++) if (o(e, s + u) !== o(t, u)) {
d = !1;
break;
}
if (d) return s;
}
return -1;
}
function f(e, t, n, i) {
n = Number(n) || 0;
var a = e.length - n;
i ? a < (i = Number(i)) && (i = a) : i = a;
var o = t.length;
if (o % 2 != 0) throw new TypeError("Invalid hex string");
o / 2 < i && (i = o / 2);
for (var s = 0; s < i; ++s) {
var r = parseInt(t.substr(2 * s, 2), 16);
if (isNaN(r)) return s;
e[n + s] = r;
}
return s;
}
function v(e, t, n, i) {
return w(function(e) {
for (var t = [], n = 0; n < e.length; ++n) t.push(255 & e.charCodeAt(n));
return t;
}(t), e, n, i);
}
function _(e, t, n) {
n = Math.min(e.length, n);
for (var i = [], a = t; a < n; ) {
var o = e[a], s = null, r = 239 < o ? 4 : 223 < o ? 3 : 191 < o ? 2 : 1;
if (a + r <= n) {
var c, l, h, d;
switch (r) {
case 1:
o < 128 && (s = o);
break;

case 2:
128 == (192 & (c = e[a + 1])) && (127 < (d = (31 & o) << 6 | 63 & c) && (s = d));
break;

case 3:
c = e[a + 1], l = e[a + 2], 128 == (192 & c) && 128 == (192 & l) && (2047 < (d = (15 & o) << 12 | (63 & c) << 6 | 63 & l) && (d < 55296 || 57343 < d) && (s = d));
break;

case 4:
c = e[a + 1], l = e[a + 2], h = e[a + 3], 128 == (192 & c) && 128 == (192 & l) && 128 == (192 & h) && (65535 < (d = (15 & o) << 18 | (63 & c) << 12 | (63 & l) << 6 | 63 & h) && d < 1114112 && (s = d));
}
}
null === s ? (s = 65533, r = 1) : 65535 < s && (s -= 65536, i.push(s >>> 10 & 1023 | 55296), 
s = 56320 | 1023 & s), i.push(s), a += r;
}
return function(e) {
var t = e.length;
if (t <= k) return String.fromCharCode.apply(String, e);
for (var n = "", i = 0; i < t; ) n += String.fromCharCode.apply(String, e.slice(i, i += k));
return n;
}(i);
}
function p(e, t, n) {
var i = "";
n = Math.min(e.length, n);
for (var a = t; a < n; ++a) i += String.fromCharCode(127 & e[a]);
return i;
}
function m(e, t, n) {
var i = "";
n = Math.min(e.length, n);
for (var a = t; a < n; ++a) i += String.fromCharCode(e[a]);
return i;
}
function b(e, t, n) {
var i, a = e.length;
(!t || t < 0) && (t = 0), (!n || n < 0 || a < n) && (n = a);
for (var o = "", s = t; s < n; ++s) o += (i = e[s]) < 16 ? "0" + i.toString(16) : i.toString(16);
return o;
}
function C(e, t, n) {
for (var i = e.slice(t, n), a = "", o = 0; o < i.length; o += 2) a += String.fromCharCode(i[o] + 256 * i[o + 1]);
return a;
}
function E(e, t, n) {
if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
if (n < e + t) throw new RangeError("Trying to access beyond buffer length");
}
function N(e, t, n, i, a, o) {
if (!d.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
if (a < t || t < o) throw new RangeError('"value" argument is out of bounds');
if (n + i > e.length) throw new RangeError("Index out of range");
}
function I(e, t, n, i) {
t < 0 && (t = 65535 + t + 1);
for (var a = 0, o = Math.min(e.length - n, 2); a < o; ++a) e[n + a] = (t & 255 << 8 * (i ? a : 1 - a)) >>> 8 * (i ? a : 1 - a);
}
function y(e, t, n, i) {
t < 0 && (t = 4294967295 + t + 1);
for (var a = 0, o = Math.min(e.length - n, 4); a < o; ++a) e[n + a] = t >>> 8 * (i ? a : 3 - a) & 255;
}
function S(e, t, n, i, a, o) {
if (n + i > e.length) throw new RangeError("Index out of range");
if (n < 0) throw new RangeError("Index out of range");
}
function A(e, t, n, i, a) {
return a || S(e, 0, n, 4), O.write(e, t, n, i, 23, 4), n + 4;
}
function R(e, t, n, i, a) {
return a || S(e, 0, n, 8), O.write(e, t, n, i, 52, 8), n + 8;
}
function M(e, t) {
t = t || 1 / 0;
for (var n, i = e.length, a = null, o = [], s = 0; s < i; ++s) {
if (55295 < (n = e.charCodeAt(s)) && n < 57344) {
if (!a) {
if (56319 < n) {
-1 < (t -= 3) && o.push(239, 191, 189);
continue;
}
if (s + 1 === i) {
-1 < (t -= 3) && o.push(239, 191, 189);
continue;
}
a = n;
continue;
}
if (n < 56320) {
-1 < (t -= 3) && o.push(239, 191, 189), a = n;
continue;
}
n = 65536 + (a - 55296 << 10 | n - 56320);
} else a && -1 < (t -= 3) && o.push(239, 191, 189);
if (a = null, n < 128) {
if ((t -= 1) < 0) break;
o.push(n);
} else if (n < 2048) {
if ((t -= 2) < 0) break;
o.push(n >> 6 | 192, 63 & n | 128);
} else if (n < 65536) {
if ((t -= 3) < 0) break;
o.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128);
} else {
if (!(n < 1114112)) throw new Error("Invalid code point");
if ((t -= 4) < 0) break;
o.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128);
}
}
return o;
}
function L(e) {
return T.toByteArray(function(e) {
if ((e = (t = e, t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "")).replace(D, "")).length < 2) return "";
for (var t; e.length % 4 != 0; ) e += "=";
return e;
}(e));
}
function w(e, t, n, i) {
for (var a = 0; a < i && !(a + n >= t.length || a >= e.length); ++a) t[a + n] = e[a];
return a;
}
var T = t("base64-js"), O = t("ieee754"), G = t("isarray");
P.Buffer = d, P.SlowBuffer = function(e) {
return +e != e && (e = 0), d.alloc(+e);
}, P.INSPECT_MAX_BYTES = 50, d.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function() {
try {
var e = new Uint8Array(1);
return e.__proto__ = {
__proto__: Uint8Array.prototype,
foo: function() {
return 42;
}
}, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength;
} catch (e) {
return !1;
}
}(), P.kMaxLength = n(), d.poolSize = 8192, d._augment = function(e) {
return e.__proto__ = d.prototype, e;
}, d.from = function(e, t, n) {
return i(null, e, t, n);
}, d.TYPED_ARRAY_SUPPORT && (d.prototype.__proto__ = Uint8Array.prototype, d.__proto__ = Uint8Array, 
"undefined" != typeof Symbol && Symbol.species && d[Symbol.species] === d && Object.defineProperty(d, Symbol.species, {
value: null,
configurable: !0
})), d.alloc = function(e, t, n) {
return i = null, o = t, s = n, c(a = e), a <= 0 ? r(i, a) : void 0 !== o ? "string" == typeof s ? r(i, a).fill(o, s) : r(i, a).fill(o) : r(i, a);
var i, a, o, s;
}, d.allocUnsafe = function(e) {
return a(null, e);
}, d.allocUnsafeSlow = function(e) {
return a(null, e);
}, d.isBuffer = function(e) {
return !(null == e || !e._isBuffer);
}, d.compare = function(e, t) {
if (!d.isBuffer(e) || !d.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
if (e === t) return 0;
for (var n = e.length, i = t.length, a = 0, o = Math.min(n, i); a < o; ++a) if (e[a] !== t[a]) {
n = e[a], i = t[a];
break;
}
return n < i ? -1 : i < n ? 1 : 0;
}, d.isEncoding = function(e) {
switch (String(e).toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "latin1":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return !0;

default:
return !1;
}
}, d.concat = function(e, t) {
if (!G(e)) throw new TypeError('"list" argument must be an Array of Buffers');
if (0 === e.length) return d.alloc(0);
var n;
if (void 0 === t) for (n = t = 0; n < e.length; ++n) t += e[n].length;
var i = d.allocUnsafe(t), a = 0;
for (n = 0; n < e.length; ++n) {
var o = e[n];
if (!d.isBuffer(o)) throw new TypeError('"list" argument must be an Array of Buffers');
o.copy(i, a), a += o.length;
}
return i;
}, d.byteLength = l, d.prototype._isBuffer = !0, d.prototype.swap16 = function() {
var e = this.length;
if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
for (var t = 0; t < e; t += 2) h(this, t, t + 1);
return this;
}, d.prototype.swap32 = function() {
var e = this.length;
if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
for (var t = 0; t < e; t += 4) h(this, t, t + 3), h(this, t + 1, t + 2);
return this;
}, d.prototype.swap64 = function() {
var e = this.length;
if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
for (var t = 0; t < e; t += 8) h(this, t, t + 7), h(this, t + 1, t + 6), h(this, t + 2, t + 5), 
h(this, t + 3, t + 4);
return this;
}, d.prototype.toString = function() {
var e = 0 | this.length;
return 0 === e ? "" : 0 === arguments.length ? _(this, 0, e) : function(e, t, n) {
var i, a, o, s = !1;
if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
if ((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";
if ((n >>>= 0) <= (t >>>= 0)) return "";
for (e || (e = "utf8"); ;) switch (e) {
case "hex":
return b(this, t, n);

case "utf8":
case "utf-8":
return _(this, t, n);

case "ascii":
return p(this, t, n);

case "latin1":
case "binary":
return m(this, t, n);

case "base64":
return i = this, o = n, 0 === (a = t) && o === i.length ? T.fromByteArray(i) : T.fromByteArray(i.slice(a, o));

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return C(this, t, n);

default:
if (s) throw new TypeError("Unknown encoding: " + e);
e = (e + "").toLowerCase(), s = !0;
}
}.apply(this, arguments);
}, d.prototype.equals = function(e) {
if (!d.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
return this === e || 0 === d.compare(this, e);
}, d.prototype.inspect = function() {
var e = "", t = P.INSPECT_MAX_BYTES;
return 0 < this.length && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), 
this.length > t && (e += " ... ")), "<Buffer " + e + ">";
}, d.prototype.compare = function(e, t, n, i, a) {
if (!d.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
if (void 0 === t && (t = 0), void 0 === n && (n = e ? e.length : 0), void 0 === i && (i = 0), 
void 0 === a && (a = this.length), t < 0 || n > e.length || i < 0 || a > this.length) throw new RangeError("out of range index");
if (a <= i && n <= t) return 0;
if (a <= i) return -1;
if (n <= t) return 1;
if (this === e) return 0;
for (var o = (a >>>= 0) - (i >>>= 0), s = (n >>>= 0) - (t >>>= 0), r = Math.min(o, s), c = this.slice(i, a), l = e.slice(t, n), h = 0; h < r; ++h) if (c[h] !== l[h]) {
o = c[h], s = l[h];
break;
}
return o < s ? -1 : s < o ? 1 : 0;
}, d.prototype.includes = function(e, t, n) {
return -1 !== this.indexOf(e, t, n);
}, d.prototype.indexOf = function(e, t, n) {
return u(this, e, t, n, !0);
}, d.prototype.lastIndexOf = function(e, t, n) {
return u(this, e, t, n, !1);
}, d.prototype.write = function(e, t, n, i) {
if (void 0 === t) i = "utf8", n = this.length, t = 0; else if (void 0 === n && "string" == typeof t) i = t, 
n = this.length, t = 0; else {
if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
t |= 0, isFinite(n) ? (n |= 0, void 0 === i && (i = "utf8")) : (i = n, n = void 0);
}
var a, o, s, r, c, l, h, d, u, g = this.length - t;
if ((void 0 === n || g < n) && (n = g), 0 < e.length && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
i || (i = "utf8");
for (var _ = !1; ;) switch (i) {
case "hex":
return f(this, e, t, n);

case "utf8":
case "utf-8":
return d = t, u = n, w(M(e, (h = this).length - d), h, d, u);

case "ascii":
return v(this, e, t, n);

case "latin1":
case "binary":
return v(this, e, t, n);

case "base64":
return r = this, c = t, l = n, w(L(e), r, c, l);

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return o = t, s = n, w(function(e, t) {
for (var n, i, a, o = [], s = 0; s < e.length && !((t -= 2) < 0); ++s) n = e.charCodeAt(s), 
i = n >> 8, a = n % 256, o.push(a), o.push(i);
return o;
}(e, (a = this).length - o), a, o, s);

default:
if (_) throw new TypeError("Unknown encoding: " + i);
i = ("" + i).toLowerCase(), _ = !0;
}
}, d.prototype.toJSON = function() {
return {
type: "Buffer",
data: Array.prototype.slice.call(this._arr || this, 0)
};
};
var k = 4096;
d.prototype.slice = function(e, t) {
var n, i = this.length;
(e = ~~e) < 0 ? (e += i) < 0 && (e = 0) : i < e && (e = i), (t = void 0 === t ? i : ~~t) < 0 ? (t += i) < 0 && (t = 0) : i < t && (t = i), 
t < e && (t = e);
if (d.TYPED_ARRAY_SUPPORT) (n = this.subarray(e, t)).__proto__ = d.prototype; else {
var a = t - e;
n = new d(a, void 0);
for (var o = 0; o < a; ++o) n[o] = this[o + e];
}
return n;
}, d.prototype.readUIntLE = function(e, t, n) {
e |= 0, t |= 0, n || E(e, t, this.length);
for (var i = this[e], a = 1, o = 0; ++o < t && (a *= 256); ) i += this[e + o] * a;
return i;
}, d.prototype.readUIntBE = function(e, t, n) {
e |= 0, t |= 0, n || E(e, t, this.length);
for (var i = this[e + --t], a = 1; 0 < t && (a *= 256); ) i += this[e + --t] * a;
return i;
}, d.prototype.readUInt8 = function(e, t) {
return t || E(e, 1, this.length), this[e];
}, d.prototype.readUInt16LE = function(e, t) {
return t || E(e, 2, this.length), this[e] | this[e + 1] << 8;
}, d.prototype.readUInt16BE = function(e, t) {
return t || E(e, 2, this.length), this[e] << 8 | this[e + 1];
}, d.prototype.readUInt32LE = function(e, t) {
return t || E(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
}, d.prototype.readUInt32BE = function(e, t) {
return t || E(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
}, d.prototype.readIntLE = function(e, t, n) {
e |= 0, t |= 0, n || E(e, t, this.length);
for (var i = this[e], a = 1, o = 0; ++o < t && (a *= 256); ) i += this[e + o] * a;
return (a *= 128) <= i && (i -= Math.pow(2, 8 * t)), i;
}, d.prototype.readIntBE = function(e, t, n) {
e |= 0, t |= 0, n || E(e, t, this.length);
for (var i = t, a = 1, o = this[e + --i]; 0 < i && (a *= 256); ) o += this[e + --i] * a;
return (a *= 128) <= o && (o -= Math.pow(2, 8 * t)), o;
}, d.prototype.readInt8 = function(e, t) {
return t || E(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
}, d.prototype.readInt16LE = function(e, t) {
t || E(e, 2, this.length);
var n = this[e] | this[e + 1] << 8;
return 32768 & n ? 4294901760 | n : n;
}, d.prototype.readInt16BE = function(e, t) {
t || E(e, 2, this.length);
var n = this[e + 1] | this[e] << 8;
return 32768 & n ? 4294901760 | n : n;
}, d.prototype.readInt32LE = function(e, t) {
return t || E(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
}, d.prototype.readInt32BE = function(e, t) {
return t || E(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
}, d.prototype.readFloatLE = function(e, t) {
return t || E(e, 4, this.length), O.read(this, e, !0, 23, 4);
}, d.prototype.readFloatBE = function(e, t) {
return t || E(e, 4, this.length), O.read(this, e, !1, 23, 4);
}, d.prototype.readDoubleLE = function(e, t) {
return t || E(e, 8, this.length), O.read(this, e, !0, 52, 8);
}, d.prototype.readDoubleBE = function(e, t) {
return t || E(e, 8, this.length), O.read(this, e, !1, 52, 8);
}, d.prototype.writeUIntLE = function(e, t, n, i) {
if (e = +e, t |= 0, n |= 0, !i) {
N(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
}
var a = 1, o = 0;
for (this[t] = 255 & e; ++o < n && (a *= 256); ) this[t + o] = e / a & 255;
return t + n;
}, d.prototype.writeUIntBE = function(e, t, n, i) {
if (e = +e, t |= 0, n |= 0, !i) {
N(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
}
var a = n - 1, o = 1;
for (this[t + a] = 255 & e; 0 <= --a && (o *= 256); ) this[t + a] = e / o & 255;
return t + n;
}, d.prototype.writeUInt8 = function(e, t, n) {
return e = +e, t |= 0, n || N(this, e, t, 1, 255, 0), d.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), 
this[t] = 255 & e, t + 1;
}, d.prototype.writeUInt16LE = function(e, t, n) {
return e = +e, t |= 0, n || N(this, e, t, 2, 65535, 0), d.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, 
this[t + 1] = e >>> 8) : I(this, e, t, !0), t + 2;
}, d.prototype.writeUInt16BE = function(e, t, n) {
return e = +e, t |= 0, n || N(this, e, t, 2, 65535, 0), d.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, 
this[t + 1] = 255 & e) : I(this, e, t, !1), t + 2;
}, d.prototype.writeUInt32LE = function(e, t, n) {
return e = +e, t |= 0, n || N(this, e, t, 4, 4294967295, 0), d.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, 
this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : y(this, e, t, !0), 
t + 4;
}, d.prototype.writeUInt32BE = function(e, t, n) {
return e = +e, t |= 0, n || N(this, e, t, 4, 4294967295, 0), d.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, 
this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : y(this, e, t, !1), 
t + 4;
}, d.prototype.writeIntLE = function(e, t, n, i) {
if (e = +e, t |= 0, !i) {
var a = Math.pow(2, 8 * n - 1);
N(this, e, t, n, a - 1, -a);
}
var o = 0, s = 1, r = 0;
for (this[t] = 255 & e; ++o < n && (s *= 256); ) e < 0 && 0 === r && 0 !== this[t + o - 1] && (r = 1), 
this[t + o] = (e / s >> 0) - r & 255;
return t + n;
}, d.prototype.writeIntBE = function(e, t, n, i) {
if (e = +e, t |= 0, !i) {
var a = Math.pow(2, 8 * n - 1);
N(this, e, t, n, a - 1, -a);
}
var o = n - 1, s = 1, r = 0;
for (this[t + o] = 255 & e; 0 <= --o && (s *= 256); ) e < 0 && 0 === r && 0 !== this[t + o + 1] && (r = 1), 
this[t + o] = (e / s >> 0) - r & 255;
return t + n;
}, d.prototype.writeInt8 = function(e, t, n) {
return e = +e, t |= 0, n || N(this, e, t, 1, 127, -128), d.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), 
e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1;
}, d.prototype.writeInt16LE = function(e, t, n) {
return e = +e, t |= 0, n || N(this, e, t, 2, 32767, -32768), d.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, 
this[t + 1] = e >>> 8) : I(this, e, t, !0), t + 2;
}, d.prototype.writeInt16BE = function(e, t, n) {
return e = +e, t |= 0, n || N(this, e, t, 2, 32767, -32768), d.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, 
this[t + 1] = 255 & e) : I(this, e, t, !1), t + 2;
}, d.prototype.writeInt32LE = function(e, t, n) {
return e = +e, t |= 0, n || N(this, e, t, 4, 2147483647, -2147483648), d.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, 
this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : y(this, e, t, !0), 
t + 4;
}, d.prototype.writeInt32BE = function(e, t, n) {
return e = +e, t |= 0, n || N(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), 
d.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, 
this[t + 3] = 255 & e) : y(this, e, t, !1), t + 4;
}, d.prototype.writeFloatLE = function(e, t, n) {
return A(this, e, t, !0, n);
}, d.prototype.writeFloatBE = function(e, t, n) {
return A(this, e, t, !1, n);
}, d.prototype.writeDoubleLE = function(e, t, n) {
return R(this, e, t, !0, n);
}, d.prototype.writeDoubleBE = function(e, t, n) {
return R(this, e, t, !1, n);
}, d.prototype.copy = function(e, t, n, i) {
if (n || (n = 0), i || 0 === i || (i = this.length), t >= e.length && (t = e.length), 
t || (t = 0), 0 < i && i < n && (i = n), i === n) return 0;
if (0 === e.length || 0 === this.length) return 0;
if (t < 0) throw new RangeError("targetStart out of bounds");
if (n < 0 || n >= this.length) throw new RangeError("sourceStart out of bounds");
if (i < 0) throw new RangeError("sourceEnd out of bounds");
i > this.length && (i = this.length), e.length - t < i - n && (i = e.length - t + n);
var a, o = i - n;
if (this === e && n < t && t < i) for (a = o - 1; 0 <= a; --a) e[a + t] = this[a + n]; else if (o < 1e3 || !d.TYPED_ARRAY_SUPPORT) for (a = 0; a < o; ++a) e[a + t] = this[a + n]; else Uint8Array.prototype.set.call(e, this.subarray(n, n + o), t);
return o;
}, d.prototype.fill = function(e, t, n, i) {
if ("string" == typeof e) {
if ("string" == typeof t ? (i = t, t = 0, n = this.length) : "string" == typeof n && (i = n, 
n = this.length), 1 === e.length) {
var a = e.charCodeAt(0);
a < 256 && (e = a);
}
if (void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
if ("string" == typeof i && !d.isEncoding(i)) throw new TypeError("Unknown encoding: " + i);
} else "number" == typeof e && (e &= 255);
if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
if (n <= t) return this;
t >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0);
var o;
if ("number" == typeof e) for (o = t; o < n; ++o) this[o] = e; else {
var s = d.isBuffer(e) ? e : M(new d(e, i).toString()), r = s.length;
for (o = 0; o < n - t; ++o) this[o + t] = s[o % r];
}
return this;
};
var D = /[^+\/0-9A-Za-z-_]/g;
}).call(this, "undefined" != typeof n ? n : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"base64-js": 30,
ieee754: 32,
isarray: 34
} ],
30: [ function(e, t, n) {
function l(e) {
var t = e.length;
if (0 < t % 4) throw new Error("Invalid string. Length must be a multiple of 4");
return "=" === e[t - 2] ? 2 : "=" === e[t - 1] ? 1 : 0;
}
function c(e, t, n) {
for (var i, a = [], o = t; o < n; o += 3) i = (e[o] << 16) + (e[o + 1] << 8) + e[o + 2], 
a.push(h[(s = i) >> 18 & 63] + h[s >> 12 & 63] + h[s >> 6 & 63] + h[63 & s]);
var s;
return a.join("");
}
n.byteLength = function(e) {
return 3 * e.length / 4 - l(e);
}, n.toByteArray = function(e) {
var t, n, i, a, o, s, r = e.length;
o = l(e), s = new u(3 * r / 4 - o), i = 0 < o ? r - 4 : r;
var c = 0;
for (n = t = 0; t < i; t += 4, n += 3) a = d[e.charCodeAt(t)] << 18 | d[e.charCodeAt(t + 1)] << 12 | d[e.charCodeAt(t + 2)] << 6 | d[e.charCodeAt(t + 3)], 
s[c++] = a >> 16 & 255, s[c++] = a >> 8 & 255, s[c++] = 255 & a;
return 2 === o ? (a = d[e.charCodeAt(t)] << 2 | d[e.charCodeAt(t + 1)] >> 4, s[c++] = 255 & a) : 1 === o && (a = d[e.charCodeAt(t)] << 10 | d[e.charCodeAt(t + 1)] << 4 | d[e.charCodeAt(t + 2)] >> 2, 
s[c++] = a >> 8 & 255, s[c++] = 255 & a), s;
}, n.fromByteArray = function(e) {
for (var t, n = e.length, i = n % 3, a = "", o = [], s = 0, r = n - i; s < r; s += 16383) o.push(c(e, s, r < s + 16383 ? r : s + 16383));
return 1 === i ? (t = e[n - 1], a += h[t >> 2], a += h[t << 4 & 63], a += "==") : 2 === i && (t = (e[n - 2] << 8) + e[n - 1], 
a += h[t >> 10], a += h[t >> 4 & 63], a += h[t << 2 & 63], a += "="), o.push(a), 
o.join("");
};
for (var h = [], d = [], u = "undefined" != typeof Uint8Array ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, o = i.length; a < o; ++a) h[a] = i[a], 
d[i.charCodeAt(a)] = a;
d["-".charCodeAt(0)] = 62, d["_".charCodeAt(0)] = 63;
}, {} ],
31: [ function(e, i, t) {
!function(e) {
function t(e) {
for (var t in n) e[t] = n[t];
return e;
}
function a(e, t) {
var n;
if (arguments.length) {
if (t) {
if (n = s(this, e, !0)) {
if (!(n = n.filter(function(e) {
return e !== t && e.originalListener !== t;
})).length) return a.call(this, e);
this[o][e] = n;
}
} else if ((n = this[o]) && (delete n[e], !Object.keys(n).length)) return a.call(this);
} else delete this[o];
return this;
}
function s(e, t, n) {
if (!n || e[o]) {
var i = e[o] || (e[o] = {});
return i[t] || (i[t] = []);
}
}
"undefined" != typeof i && (i.exports = e);
var o = "listeners", n = {
on: function(e, t) {
return s(this, e).push(t), this;
},
once: function(e, t) {
function n() {
a.call(i, e, n), t.apply(this, arguments);
}
var i = this;
return n.originalListener = t, s(i, e).push(n), i;
},
off: a,
emit: function(e, t) {
var n = this, i = s(n, e, !0);
if (!i) return !1;
var a = arguments.length;
if (1 === a) i.forEach(function(e) {
e.call(n);
}); else if (2 === a) i.forEach(function(e) {
e.call(n, t);
}); else {
var o = Array.prototype.slice.call(arguments, 1);
i.forEach(function(e) {
e.apply(n, o);
});
}
return !!i.length;
}
};
t(e.prototype), e.mixin = t;
}(function e() {
if (!(this instanceof e)) return new e();
});
}, {} ],
32: [ function(e, t, n) {
n.read = function(e, t, n, i, a) {
var o, s, r = 8 * a - i - 1, c = (1 << r) - 1, l = c >> 1, h = -7, d = n ? a - 1 : 0, u = n ? -1 : 1, g = e[t + d];
for (d += u, o = g & (1 << -h) - 1, g >>= -h, h += r; 0 < h; o = 256 * o + e[t + d], 
d += u, h -= 8) ;
for (s = o & (1 << -h) - 1, o >>= -h, h += i; 0 < h; s = 256 * s + e[t + d], d += u, 
h -= 8) ;
if (0 === o) o = 1 - l; else {
if (o === c) return s ? NaN : 1 / 0 * (g ? -1 : 1);
s += Math.pow(2, i), o -= l;
}
return (g ? -1 : 1) * s * Math.pow(2, o - i);
}, n.write = function(e, t, n, i, a, o) {
var s, r, c, l = 8 * o - a - 1, h = (1 << l) - 1, d = h >> 1, u = 23 === a ? Math.pow(2, -24) - Math.pow(2, -77) : 0, g = i ? 0 : o - 1, _ = i ? 1 : -1, f = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (r = isNaN(t) ? 1 : 0, s = h) : (s = Math.floor(Math.log(t) / Math.LN2), 
t * (c = Math.pow(2, -s)) < 1 && (s--, c *= 2), 2 <= (t += 1 <= s + d ? u / c : u * Math.pow(2, 1 - d)) * c && (s++, 
c /= 2), h <= s + d ? (r = 0, s = h) : 1 <= s + d ? (r = (t * c - 1) * Math.pow(2, a), 
s += d) : (r = t * Math.pow(2, d - 1) * Math.pow(2, a), s = 0)); 8 <= a; e[n + g] = 255 & r, 
g += _, r /= 256, a -= 8) ;
for (s = s << a | r, l += a; 0 < l; e[n + g] = 255 & s, g += _, s /= 256, l -= 8) ;
e[n + g - _] |= 128 * f;
};
}, {} ],
33: [ function(e, t, n) {
(function(a) {
!function(m) {
function e(e, t, c) {
function a(e, t, n, i) {
return this instanceof a ? function(e, t, n, i, a) {
if (O && G && (t instanceof G && (t = new O(t)), i instanceof G && (i = new O(i))), 
!(t || n || i || L)) return void (e.buffer = y(k, 0));
if (!N(t, n)) {
var o = L || Array;
a = n, i = t, n = 0, t = new o(8);
}
e.buffer = t, e.offset = n |= 0, w !== ("undefined" == typeof i ? "undefined" : P(i)) && ("string" == typeof i ? function(e, t, n, i) {
var a = 0, o = n.length, s = 0, r = 0;
"-" === n[0] && a++;
for (var c = a; a < o; ) {
var l = parseInt(n[a++], i);
if (!(0 <= l)) break;
r = r * i + l, s = s * i + Math.floor(r / D), r %= D;
}
c && (s = ~s, r ? r = D - r : s++), h(e, t + d, s), h(e, t + u, r);
}(t, n, i, a || 10) : N(i, a) ? I(t, n, i, a) : "number" == typeof a ? (h(t, n + d, i), 
h(t, n + u, a)) : 0 < i ? g(t, n, i) : i < 0 ? _(t, n, i) : I(t, n, k, 0));
}(this, e, t, n, i) : new a(e, t, n, i);
}
function n() {
var e = this.buffer, t = this.offset, n = l(e, t + d), i = l(e, t + u);
return c || (n |= 0), n ? n * D + i : i;
}
function h(e, t, n) {
e[t + r] = 255 & n, n >>= 8, e[t + s] = 255 & n, n >>= 8, e[t + o] = 255 & n, n >>= 8, 
e[t + i] = 255 & n;
}
function l(e, t) {
return 16777216 * e[t + i] + (e[t + o] << 16) + (e[t + s] << 8) + e[t + r];
}
var d = t ? 0 : 4, u = t ? 4 : 0, i = t ? 0 : 3, o = t ? 1 : 2, s = t ? 2 : 1, r = t ? 3 : 0, g = t ? S : R, _ = t ? A : M, f = a.prototype, v = "is" + e, p = "_" + v;
return f.buffer = void 0, f.offset = 0, f[p] = !0, f.toNumber = n, f.toString = function(e) {
var t = this.buffer, n = this.offset, i = l(t, n + d), a = l(t, n + u), o = "", s = !c && 2147483648 & i;
for (s && (i = ~i, a = D - a), e = e || 10; ;) {
var r = i % e * D + a;
if (i = Math.floor(i / e), a = Math.floor(r / e), o = (r % e).toString(e) + o, !i && !a) break;
}
return s && (o = "-" + o), o;
}, f.toJSON = n, f.toArray = b, T && (f.toBuffer = C), O && (f.toArrayBuffer = E), 
a[v] = function(e) {
return !(!e || !e[p]);
}, m[e] = a;
}
function b(e) {
var t = this.buffer, n = this.offset;
return L = null, !1 !== e && 0 === n && 8 === t.length && i(t) ? t : y(t, n);
}
function C(e) {
var t = this.buffer, n = this.offset;
if (L = T, !1 !== e && 0 === n && 8 === t.length && a.isBuffer(t)) return t;
var i = new T(8);
return I(i, 0, t, n), i;
}
function E(e) {
var t = this.buffer, n = this.offset, i = t.buffer;
if (L = O, !1 !== e && 0 === n && i instanceof G && 8 === i.byteLength) return i;
var a = new O(8);
return I(a, 0, t, n), a.buffer;
}
function N(e, t) {
var n = e && e.length;
return t |= 0, n && t + 8 <= n && "string" != typeof e[t];
}
function I(e, t, n, i) {
t |= 0, i |= 0;
for (var a = 0; a < 8; a++) e[t++] = 255 & n[i++];
}
function y(e, t) {
return Array.prototype.slice.call(e, t, t + 8);
}
function S(e, t, n) {
for (var i = t + 8; t < i; ) e[--i] = 255 & n, n /= 256;
}
function A(e, t, n) {
var i = t + 8;
for (n++; t < i; ) e[--i] = 255 & -n ^ 255, n /= 256;
}
function R(e, t, n) {
for (var i = t + 8; t < i; ) e[t++] = 255 & n, n /= 256;
}
function M(e, t, n) {
var i = t + 8;
for (n++; t < i; ) e[t++] = 255 & -n ^ 255, n /= 256;
}
var L, w = "undefined", T = w !== ("undefined" == typeof a ? "undefined" : P(a)) && a, O = w !== ("undefined" == typeof Uint8Array ? "undefined" : P(Uint8Array)) && Uint8Array, G = w !== ("undefined" == typeof ArrayBuffer ? "undefined" : P(ArrayBuffer)) && ArrayBuffer, k = [ 0, 0, 0, 0, 0, 0, 0, 0 ], i = Array.isArray || function(e) {
return !!e && "[object Array]" == Object.prototype.toString.call(e);
}, D = 4294967296;
e("Uint64BE", !0, !0), e("Int64BE", !0, !1), e("Uint64LE", !1, !0), e("Int64LE", !1, !1);
}("object" == ("undefined" == typeof n ? "undefined" : P(n)) && "string" != typeof n.nodeName ? n : this || {});
}).call(this, e("buffer").Buffer);
}, {
buffer: 29
} ],
34: [ function(e, t, n) {
var i = {}.toString;
t.exports = Array.isArray || function(e) {
return "[object Array]" == i.call(e);
};
}, {} ]
}, {}, [ 1 ])(1);
});
cc._RF.pop();
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {} ],
showQRcode: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "dd5f98RPT9Cn4acj7idS9Ub", "showQRcode");
cc.Class({
extends: cc.Component,
properties: {
node_qrcode: cc.Node,
spr_icon: cc.Sprite
},
start: function() {},
showQRCode: function(e, t) {
this.makeQRCode(e, this.node_qrcode);
var n = !1;
t && (n = !0);
this.spr_icon && (this.spr_icon.node.active = n);
},
makeQRCode: function(e, t) {
var n = new QRCode(-1, QRErrorCorrectLevel.H);
n.addData(e);
n.make();
var i = t.getComponent(cc.Graphics);
i.fillColor = cc.Color.BLACK;
for (var a = t.width / n.getModuleCount(), o = t.height / n.getModuleCount(), s = 0; s < n.getModuleCount(); s++) for (var r = 0; r < n.getModuleCount(); r++) {
if (n.isDark(s, r)) {
var c = Math.ceil((r + 1) * a) - Math.floor(r * a), l = Math.ceil((s + 1) * a) - Math.floor(s * a);
i.rect(Math.round(r * a), Math.round(s * o), c, l);
i.fill();
}
c = Math.ceil((r + 1) * a) - Math.floor(r * a);
}
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "AlertView", "AlertViewMgr", "ClickEffListener", "FloatTip", "LoadingTip", "Poker", "WifiMgr", "gray.frag", "gray.vert", "RollSpeak", "UserHead", "showQRcode", "ImageLoader", "SubGameUpdate", "hall_pre_loading", "hotupdate", "ChineseCfg", "md5.min", "msgpack.min", "AnimationFrameEvent", "GameCommUtil", "GameEventId", "gameAudioSwitch", "AniFrameEvent", "AppLog", "AssetManager", "AudioManager", "EventDef", "EventManager", "GameManager", "GlobalCfg", "GlobalFunc", "HeadLoaderMgr", "Http", "Md5", "MsgIdDef", "NetErrorCode", "NetManager", "PayMgr", "PlatformApi", "SceneMgr", "ShaderUtils", "SpeakerMgr", "UserManager", "WebsocketMgr", "WxMgr", "Club", "ClubLobby", "ClubMessage", "CreateRoom", "GameRecord", "GlobalVar", "Lobby", "LobbySet", "lauch", "login", "PengHu_Action", "PengHu_Card", "PengHu_Chat", "PengHu_GameData", "PengHu_GameOver", "PengHu_HandCard", "PengHu_MainScne", "PengHu_Menu", "PengHu_Operate", "PengHu_OperatePai", "PengHu_OutCard", "PengHu_Player", "PengHu_RemainCard", "PengHu_RoundOver", "PengHu_Setting", "PengHu_ShowCard", "PengHu_Sound", "PengHu_Tips" ]);