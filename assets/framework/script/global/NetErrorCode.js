/*
** 服务器错误码配置
*/

var codeCfg= require('GlobalVar');

codeCfg.code = {
    '201':'已注册',
    '202':'未注册',
    '203':'err_id_psw',
    '204':'该账号已被其他用户注册',
    '205':'两次密码不一致',
    '206':'账号包含敏感词',
    '207':'昵称包含敏感词',
    '213':"err_psw",
    '208':'login_fail_again',
    '400':'call_back_error',
    '401':'数据库错误',
    '402':'permission_denied',
    '403':'认证失败',
    '404':'重连索引过期',
    '405':'login_fail_again',
    '406':'login_frequently',
    '407':'acc_online',
    '408':'解析protocbuf错误',
    '409':'user_already_exists',
    '410':'operate_err',
    '411':'已经存在角色',
    '412':'acc_banned',
    '422':'account_forbid',
    '423':'in_table',
    '427':'red_packet_limit',
    '430':'login_err',
    '436':"distance_less200",
    '437':"forbid_same_ip",
    '500':'login_fail_again',
    '501':'物品不足',
    '502':'该用户已准备',
    '503':'游戏未开始',
    '504':'跟注错误',
    '505':'比牌失败',
    '506':'已经加入',
    '507':'已经加入',
    '508':'不能跟自己比牌',
    '509':'用户已退出',
    '510':'口令错误',
    '511':'游戏已经开始',
    '512':'游戏已经结束',
    '513':'房间人数已满',
    '514':'未设置底注',
    '515':'未在桌子上',
    '516':'看牌错误',
    '517':'加入错误',
    '518':'离开',
    '519':'wait_exit',
    '520':'创建游戏信息有误',

    '606':'error_operate',
    '610':'coins_lack',
    '611':'您已经是庄家了',
    '612':'coins_lack',
    '613':'band_aren',
    '619':"该房间正在结算，请稍后",

    '700':"room_id_non_existent",

    '710':'enter_game',
    '720':'房卡不足',
	'803':'system_maintenance_tips',
	'804':'transfer_failed',
	'805':'已经弃牌',
	'806':'跟注失败',
	'807':'下注金额错误',

    '898':'operate_limit',
    '899':'庄家不能下注',
	'900':'庄已存在',
	'901':'没选庄',
	'902':'没下注',
	'903':'没准备',
	'904':'牌数据错误',
	'905':'出牌不在手牌中',
	'906':'不能执行此操作',
    '907':'没开启中途加入不能准备',
	'908':'没坐下',
	'909':'wait_next_round',
    '910':'下注方位错误',
	'911':'龙虎方位不能同时下注',
	'912':'field_limit',
	'913':'房间不允许中途加入',
	'914':'用户未准备',
    '915':'未找到该座位用户',
	'916':'倍数超范围',
	'917':'底注超范围',
	'918':'离场金币错误',
	'919':'入场金币错误',
	'920':'类型错误',
	'921':'玩家不在房间内',
    '922':'have_sit_down',
	'923':'房间人数已满',
	'924':'此座位已经有人',
	'925':'不是房主',
	'926':'有人没准备',
	'927':'玩家人数不足',
	'928':'服务器房间数不够',
    '929':'体验币不足',
    '930':'权限不足，无法创建!',
	'936':'金币不足，无法创建房间!',
    '940':'微信登录失败',
	'8928':'出牌操作错误',
	'9929':'玩家已退出',
	'9930':'摊牌异常',
	'9931':'非房主不能执行该操作',
	'1000':'房间数据异常',
	'1404':'未找到该商品',
	'1405':'下单失败，请稍后再试',
	'1406':'您不能同时下注2个方位',
	'1407':'自己不能举报自己哟',
	'1408':'请补充完资料后再提交',
	'1409':'操作过于频繁，请歇一会再来',
	'1450':'操作失败，请稍后再试',
    '1051':'本轮投注额已满',
    '1052':'请勿重复提交',
    '1057':'您是庄家，不能下注哟',
    '1065':'只能在空闲时间内下庄哦',
    '1066':'当前档位金币不足',
    '1067':'此房间不允许中途加入哦',
    '1068':'绑定账号验证信息失败',
    '1069':'绑定账号获取用户信息失败',
    '1070':'此账号已经绑定过，不能重复绑定',
    '1071':'系统已存在此FB账号',
    '1072':'此任务还未完成',
    '1073':'包含非法字，请重新修改',
    '1074':'昵称已被使用',
    '1075':'发送频率过于频繁，请稍后',
    '1076':'没有发送权限',
    '1077':'金币不足，无法上庄，请充值！',
    '1080':'剩余金币须大于50万才能下注',
    '1081':'wait_next_round',
    '1082':'此账号已经绑定过微信，不能重复绑定',
    '1083':'绑定微信验证失败',
    '1084':'绑定微信获取信息失败',
    '1085':'系统已存在此微信账号',
    '1387':'剩余金币须大于50万才能下注',
    '1089':'该任务已关闭',
    '1090':'not_down_banker',
    '1091':'庄家只能在空闲时间内退出',
    '10005':'正在努力加载中...',
    '10001':'subgame_is_over',
    '209':'param_nil',
    '210':'illegal_parameter',
    '211':'invalid_token',
    '416':'lock_5_second',
    '417':'lock_10_second',
    '418':'lock_20_second',
    '419':'lock_600_second',
    '420':'system_maintenance_tips',
    '421':'sub_account_prohibits',
    '433':'亲友圈ID不存在',
    '950':'account_exist',
    '951':'email_exist',
    '952':'invalid_promoter_code',
    '953':'email_failed_to_send',
    '954':'invalid_pin',
    '955':'account_not_exits',
    '956':'commission_not_enough',
    '957':'password_error',
    '958':'transfer_failure',
    '959':'available_to_upline_and_downline',
    '960':'account_too_short',
    '961':'account_must_filled',
    '962':'password_must_filled',
    '963':'promoter_code_error',
    '214':'need_update',
    '425':'captcha_timeout',
    '426':'limit_red',
    '9929':'table_not_sit',
    '428':"bind_err",           // 绑定错误
    '429':'bind_mobile_already',  // 该手机号已被注册
    '434':"该玩法已存在!",
    '964':'envelope_not_enough',
    '965':'envelope_already_get',
    '811':'bank_coin_not_enough',
    '812':'bank_passwd_error',
    '440':"club_freeze",
    '441':"put_max_card",
    '442':"put_min_card",
    '443':"not_desk_info",


}