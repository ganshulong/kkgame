/*
** 全局配置
** 主要是定义各种资源
*/

var GlobalMgr = require('GlobalVar');

GlobalMgr.ChatType = {
	TXT: 0,
	EMOJI: 1,
	VOICE: 2,
	TXT_EFF: 3,
};

GlobalMgr.LoginType = {
	Guest:11,	//游客登录

	WX:2,		//微信登录
	FB:13,		//fb登录
	ACCOUNT: 14, //账号登录
	REGISTER: 12, //注册
	TOKEN:6,	//token登录
	APILOGIN:7,	//Api调用登陆
	
}

GlobalMgr.PLATFORM_ID = {
    Google:1,
    HuaWei:2,
}

//产品id定义
GlobalMgr.APPID = {
	BigBang:1,
	Poly:4,

}

//登陆扩展参数
GlobalMgr.LoginExData = {
	loginAction:1, //标识是登陆界面登陆
	reloginAction:2,//标识是断线重连
}

GlobalMgr.ERROR_CODE = {
	NORMAL: 200,
},

//全局常量定义
GlobalMgr.CONST_NUM = {
	HIGHT_ZORDER : 100,	//像提示框，loading框这些层级需要提高
},

//声音资源配置
//common表示共用，不考虑切换语言
GlobalMgr.SOUNDS = Global.SOUNDS || {};
GlobalMgr.SOUNDS.bgm_hall = {path: '' , filename:'music_bg0', common: true};               //大厅背景音乐
GlobalMgr.SOUNDS.eff_click = {path: '' , filename:'effect_btn', common: true};             //按钮音效
GlobalMgr.SOUNDS.eff_ui_pop = {path: '' , filename:'effect_return', common: true};               //ui弹窗音效
GlobalMgr.SOUNDS.eff_ui_close = {path: '' , filename:'effect_close', common: true};           //ui关闭音效



//播放背景音乐
GlobalMgr.playBgm = function (bgm_cfg, cb, loop) {
	if (bgm_cfg == null || bgm_cfg == undefined) {
		AppLog.warn('bgm_cfg is null or undefined');
		return;
	}

	if (typeof(bgm_cfg) == 'string') {
		cc.vv.AudioManager.playBgm(bgm_cfg, false, cb);
	}
	else {
		if (bgm_cfg.rmax) bgm_cfg = Global.randomEffCfg(bgm_cfg, bgm_cfg.rmin || 0, bgm_cfg.rmax); //随机音效
		var filename = bgm_cfg.filename;
		cc.vv.AudioManager.playBgm(bgm_cfg.path, filename, bgm_cfg.common, false, cb, loop);
	}
};

//播放音效
//sex 性别
//idx 序列（以下划线添加到filename后面）
GlobalMgr.playEff = function (eff_cfg, sex, idx) {
	if (eff_cfg == null || eff_cfg == undefined) {
		AppLog.warn('eff_cfg is null or undefined');
		return;
	}
	var audioID = null
	if (typeof(eff_cfg) == 'string') {
		audioID = cc.vv.AudioManager.playEff(eff_cfg, false);
	}
	else {
		if (eff_cfg.rmax) eff_cfg = Global.randomEffCfg(eff_cfg, eff_cfg.rmin || 0, eff_cfg.rmax); //随机音效

		var filename = eff_cfg.filename;
		if (idx != null) filename = filename + '_' + idx;//音效索引
		if (sex != null && sex != undefined ) {
			if (sex == 1) 
				filename += '_B';
			else 
				filename += '_G';
		}
		audioID = cc.vv.AudioManager.playEff(eff_cfg.path, filename, eff_cfg.common);
	}
	return audioID
};

//重组随机资源名称
GlobalMgr.randomEffCfg = function (eff_cfg, start, end) {
	var eff_cfg_cp = JSON.parse(JSON.stringify(eff_cfg)); //相当于深拷贝
	var idx = Global.random(start, end);
	eff_cfg_cp.filename += ('_' + idx);
	return eff_cfg_cp;
};



/*key定义*/
GlobalMgr.SAVE_KEY_REQ_LOGIN = 'SAVE_KEY_REQ_LOGIN';
GlobalMgr.SAVE_KEY_ACCOUNT_PW = 'SAVE_KEY_ACCOUNT_PW';
GlobalMgr.SAVE_KEY_IS_REMEMBER = 'SAVE_KEY_IS_REMEMBER';
GlobalMgr.SAVE_KEY_LOGIN_TYPE  = 'SAVE_KEY_LOGIN_TYPE'; //登录方式
GlobalMgr.SAVE_KEY_LAST_LOGIN_TYPE  = 'SAVE_KEY_LAST_LOGIN_TYPE'; //上次登录方式
GlobalMgr.SAVE_PLAYER_TOKEN  = 'SAVE_PLAYER_TOKEN'; 			  //上次登录方式
GlobalMgr.SAVE_LANGUAGE  = 'SAVE_LANGUAGE'; 					  //保存语言
