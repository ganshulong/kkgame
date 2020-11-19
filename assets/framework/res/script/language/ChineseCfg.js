// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

module.exports = {
    account: "账号",
    password: "密码",
    rember_psw: "记住密码",
    forgot_psw: "忘记密码>>>",
    login: "登 录",
    hint: "提示语",
    input_acc_psw: "请输入账号和密码",
    err_id_psw: "账号或密码错误",
    acc_banned: "该账号已被封禁",
    login_afer_secord: "请在%s秒后登录",                 // 使用cc.js.formatStr 格式化
    acc_forbidden_area: "该账号禁止在该区域登录",
    acc_online: "当前账号已在线",
    plyerId:"账号",
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
    amber_dragon: '赤龙驹',
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
    total_win_lines: "您赢了 %s 条线!",           // 使用cc.js.formatStr 格式化
    win_per_line: "您赢了 %s 在线 %s ",
    total_wincoin: "您共赢了 %s ",
    dollball_wincoin: "您额外赢得 %s ",
    total_line_num:"押注%s线",
    bet_per_line:"每条线押注%s",
    you_bet_per_line:"您每条线下注 %s",
    you_total_line_num:"您下注了%s条线",
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
    shz_help_9: "5000倍\n" +
    "+27次小玛丽\n" +
    "2000",
    shz_help_10: "进入小玛丽游戏后不能代替任何标志",
    shz_help_11: "全盘人物",
    shz_help_12: "全盘武器",
    shz_help_13: "小玛丽游戏",
    shz_help_14: "中",
    shz_help_15: "五个连线，可玩  小玛丽游戏   3次",
    shz_help_16: "四个连线，可玩  小玛丽游戏   2次",
    shz_help_17: "三个连线，可玩  小玛丽游戏   1次",
    shz_help_18: "外围灯停止的图案与中间滚动图案相同时，可得该图案对应倍率\n" +
    "的奖励。",
    shz_help_19: "1.中间滚出4个图案的同时，可额外获得500 倍。",
    shz_help_20: "2.当中间滚出3个图案的同时，可额外获得20 倍。",
    shz_help_21: "比倍游戏",
    shz_help_22: "玩家点击比倍，进入猜骰子游戏，通过点击“加减”调整押注的分值，玩家可选择界面 “小、和、大”进行押注，押注完毕，点击“开奖”，庄家给出骰子结果。\n" +
    "大2 倍（对子4倍），和6倍，小2 倍（对子4倍），若玩家猜中游戏结果则获得对应倍数奖励，猜错则分数归0且游戏结束退出比倍游戏。",
    ynxj_help_1: "3个SCATTER元素从左至右出现在滚轴上，即可获得10 次免费游戏SCATTER出现在滚轴2-4列",
    ynxj_help_2: "WILD可代替除BONUS及SCATTER外任何元素WILD出现在滚轴2-5列",
    ynxj_help_3: "3个及以上BONUS出现在任意位置，即触发BONUS游戏“幻姬转轮”",
    ynxj_help_4: "幻姬转轮",
    ynxj_help_5: "任意3 列出现BONUS即可触发幻姬转轮\n" +
    "幻姬转轮可赢取50，20，10，5，2或1倍的红利奖励，屏幕上所展示的红利奖励已乘以免\n" +
    "费游戏开始前所选择的总投注",

    fruit_slot_help_1: "WILD图标可代替非特殊的8个\n" +
    "图标，特殊图标：BOUNDS/SCA",
    fruit_slot_help_2: "3连线进入转盘小游戏\n" +
    "4连线进入杯子小游戏\n" +
    "一条线以上，BOUNS图标连续成",
    fruit_slot_help_3: "5-JACKPOT*8%\n" +
    "4-JACKPOT*5%\n" +
    "3-JACKPOT*3%\n" +
    "滚动任意位置出现三个及以上",
    fruit_slot_help_4: "5-15次免费游戏\n" +
    "4-10次免费游戏\n" +
    "3-5次免费游戏\n" +
    "滚动任意位置出现三个及以上的",


    win_score: "得分",
    special_prize: "特殊奖励",
    round_result: "本轮开奖结果",
    pre_betrecord: "赛事记录",
    last_result:"上局结果",
    user_tick_notice:"您已被强制下线，如有疑问请联系管理员",
    not_only_zhuang:"需押注庄闲和以外的区域",
    subgame_is_over:'小游戏已结束',
    BAL:'余额',
    xnxj_bi_bei_tip:"BONUS红利奖励=奖励倍数x总投注额",
    fruit_class_max:"最大到2倍",
    fruit_class_min:"最小到0.01",
    round_not_over:"本轮还未结束",
    chips:"筹码",
    you_win:"赢：%s",
    unenoughToTrip:"不够下注翻倍区域",
    bet_succ:"下注成功",
    go_back_login:"请重新登陆！",
    hall_share_tips:"每次分享可获得幸运红包，分享越多，获得越多！",
    get_luckypack_tips:"你已经获得红包  去点击红包开启吧",
    no_luckypack_tips:"没有红包可以拆开！",
    share_success:"分享成功",
    un_availd:"功能暂未开放",
    how_to_get_luckpack:"分享就有机会可获得红包",
    t_BET:"下注",
    t_WIN:"赢得",
    t_BAL:"余额",
    t_MIN:"最小",
    t_MAX:"最大",
    red_packet_limit:"无法领取，请完成相应的对局次数再来领取！",
    reset_red_packet:'换桌或退出将重置红包任务（同一类型牌桌除外）',



    horse_rule: "1、街机赛马是一款赛跑类押注游戏，总共有6匹马参赛，最先冲过终点的前两名马匹获胜。\n\n\
2、每次游戏开始时，给15个押注项分配15个不同的赔率，玩家自由押注。\n\n\
3、根据游戏开奖结果，对应赔率对玩家进行奖励派奖。\n\n\
4、参赛的马匹：奔雷、沙驰王子、威势之宝、疾风、碧科、赤龙驹。",
    eps_play: "1、玩家进入游戏之后，可以选择筹码进行下注。\n\n\
2、玩家有一定的时间在各个俱乐部下注，每个俱乐部对应的倍率都会显示在押注面板上。\n\n\
3、玩家下注完毕以后请点击“确定”。\n\n\
4、押注某个俱乐部后，会根据倍率获得相应的奖励。",
    eps_special: "独中一元：正常开奖后，还会随机开讲一个。\n\n\
梅开二度：同一俱乐部的任意2个颜色都中奖。\n\n\
帽子戏法：任意俱乐部的3个颜色全部中奖。\n\n\
大四喜：同一颜色的4个俱乐部全部中奖。",


    birds_play: "1、玩家进入游戏之后，可以选择筹码进行下注。\n" + "\n" + "\n" + "2、玩家有30秒的时间进行各个动物的下注，每\n" +
    "个动物对应的赔率都显示在押注面板上。\n" + "\n" + "\n" + "3、每个动物分别对应着飞禽和走兽两种动物类型。\n" + "\n" + "\n" +
    "4、玩家押中某个动物时，会根据倍率获得相应的奖励。",

    special_rule: "1、游戏除了提供玩家8种动物的押分之外，还提供了\n" + "金鲨/银鲨的押分，可以通过对其进行押分，获得更高\n" + "的收益。\n" + "\n" + "\n" +
    "2、金鲨、银鲨还可以拉启彩金，当玩家拉启彩金时，\n" + "根据彩金倍数获得一定数量的彩金奖。",
    game_in_progress: "游戏正在进行中，请耐心等待下一轮开始。",


    fruit_help: "1.操作简单，玩法丰富，选择想要押注的物品后，选择“开始”即可进行游戏。lucky将激活随机送灯，送灯个数可能为2个、1个，也可能不送灯（送灯即为中奖）\n" +
    "\n" +
    "2.赔率说明：\t\t\t\t\t\t\t\t\t\t\n" +
    "大BAR:1赔120，中BAR:1赔50，小BAR：1赔25，大77:1赔40，小77:1赔3，大双星：1赔30，小双星：1赔3，大西瓜：1赔20，小西瓜：1赔3，大铃铛：1赔20，小铃铛：1赔3，大橘子：1赔10，小橘子，大苹果：1赔5，小苹果：1赔3\n" +
    "\n" +
    "3.比大小：\t\t\t\t\t\t\t\t\t\t\n" +
    "压中后可进入比倍模式，猜大小前可选择左箭头或者右箭头来调整押注金币数可选择“1-7:”或者“8-14”两按钮，只要猜对奖金即*2\t",
    pjl_help_1: "免费旋转中，WILD可以获得多倍奖励\n" +
    "第5列:2~10倍\n" +
    "第4列:2~5倍\n" +
    "第3列:1~3倍\n" +
    "第2列:1~3倍\n",
    pjl_help_2: "潘金莲wild玩法是由freespin触发的免费旋转游戏，wild财神会出现在滚轴第2~5列任意位置，免费游戏过程中，中奖线上出现WILD，即可获得2~10倍奖励，免费游戏期间不会再触发潘金莲玩法，第1,、2、3列同时中WILD即可触发财神天降，获得10次免费游戏机会",
    pjl_help_3: "WILD可代替除SC\n" +
        "ATTER外任何元\n" +
        "素WILD只出现在\n" +
        "2~5列",
    pjl_help_4: "3个SCATTER元素\n" +
        "连续出现将触发免\n" +
        "费游戏SCATTER\n" +
        "只出现在1~3列",
    roulette_help: "一、游戏采用标准的欧洲轮盘游戏规则，目标是预测小球将落在轮盘的哪个格子上面。\n" +
    "二、玩家可以选择单一下注或者混合下注\n" +
    "三、下注及赔付规则\n" +
    "1.直接押注号码：点击下注区域内任意一个格子的中间来对格子上所标明的数字下注，赔付为1:35。\n" +
    "2.两码押注：点击下注区域内相邻的两个格子中间的分界线来对格子上标明的两个数字进行下注，1:17\n" +
    "3.三码押注：点击下注区域每列格子最下边的线来对这一行的三个数字进行下注，赔付为1:11\n" +
    "4.四码押注：点击下注区域内四个格子的交汇点可以对这四个格子内的数字同时下注，赔付为1:8\n" +
    "5.六码押注：点击下注区域内两列格子最下边的交汇点可以对这两列格子内的六个数字同时下注，赔付为1:5\n" +
    "6.十二码押注01：点击下注区域内每行最右边的“2 to 1”，可以对这一列的12数字同时下注（不包括0），赔付为1:2\n" +
    "7.十二码押注02：点击下注区域内的“1st 12”，点击“2st12”点击“3st12”，赔付为1:2.\n" +
    "8.十八码押注：点击“1st18”，点击“19st36”，赔付都为1:1.\n" +
    "9.红黑押注：点击标有红色矩形的格子，点击标有黑色矩形的格子，赔付为1:1\n" +
    "10.奇偶数押注：点击标有“EVEN”对所有的偶数下注，点击标有“ODD”对所有的奇数下注，赔付为1:1.\n",

    JLBD_ITEM_1:"3个Scatter元素连续出现将触发免费游戏\n\
Scatter只出现在1~3列",
    JLBD_ITEM_2:"Wild可代替Scatter外任何元素\n\
Wild只出现在2~5列",

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
    psw_empty:"密码不能为空",
    account_empty:"账号不能为空",
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
    wait_try_again:"登录失败，请稍后重试!",
    lines_selected: "您下注了",
    lines_nums: "条线",
    each_line_bet: "您每条线下注 ",
    gain_free_games: "得到 %s 次免费游戏",
    extra_win: "您额外赢了 %s",
    lines_bet: "赔付线",

    forestpayrty777_help_rule: "1、玩家可选择自己喜欢的动物(颜色)进行押注每个押注有上限，也可以选择庄闲和押注。\n\n" +
    "2、每轮有30秒时间，供玩家下注和思考。\n\n" +
    "3、玩家押注结束之后，等待开奖结果，中奖会得到大量奖励。\n\n" +
    "4、点击\"续押\"可延续上把的押注情况，金币不足的情况不能续押。\n\n" +
    "5、点击\"清零\"可清除本次押注选择，返回玩家金币。",

    forestpayrty777_help_special: "1、在开奖的过程中会不定时有彩金 大三元 大四喜等特殊奖励\n" +
    "2、彩金：押注可拉彩金。根据押注比例获得彩金，多押多得。\n" +
    "3、大三元：同一种动物的3种颜色全部中奖。\n" +
    "4、大四喜：同一种颜色的4种动物全部中奖。\n",

    bcbm777_help_rule: "1、奔驰宝马是一款简单易上手的游戏，一共有4种车标(奔驰、宝马、奥迪，大众)，每种车标有3种颜色(红、绿、黄)，一共12个押注选项。\n\n" +
    "2、每次游戏开始时，每次12种车标分配12个赔率，玩家有30秒的时间，自由选择押注任意一种颜色的车标。\n\n" +
    "3、根据游戏开奖结果，玩家中奖，则会根据中奖车标的对应赔率对玩家进行奖励派奖。\n\n",

    bcbm777_help_special: "1、大三元：同一种车标的三种颜色全部中奖。\n\n" +
    "2、大四喜：同一种颜色的四种车标全部中奖。\n\n" +
    "3、彩金：彩金根据房间内各位玩家的总押注权重进行分配奖励。\n\n",

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

    haiwangbuyu:"海王捕鱼",
    haiwangbuyu918:"海王捕鱼",
    wukongnaohai:"悟空闹海",
    jinchanbuyu:"金蟾捕鱼",
    likuibuyu:"李逵捕鱼",
    yaoqianshubuyu:"摇钱树捕鱼",
    caishendao:"财神到",
    feizhouconglin:"非洲丛林",
    weidadelanse:"伟大的蓝色",
    haitunjiao:"海豚礁",
    yindan:"银弹",
    huangjinshu:"黄金树",
    baijiale:"百家乐",
    pilihou:"霹雳猴",
    xiyouzhengba:"西游争霸",
    benchibaoma:"奔驰宝马",
    longhudou:"龙虎斗",
    heibao:"黑豹",
    ivan:"不休的国王",
    magicaldragon:"神秘之龙",
    feiqinzoushou:"飞禽走兽",
    zhuanpan:"俄罗斯转盘",
    twentyone:"21点",
    yunvxinjing:"玉女心经",
    shuiguoslots:"水果Slots",
    falaobaozang:"法老的宝藏",
    azitaike:"阿兹泰克",
    jinglianhua:"金莲花",
    gaosugonglu:"高速公路",
    jilebaodian:"极乐宝典",
    panjinlian:"潘金莲",
    xiaoribenpangzi:"小日本胖子",
    shuihuzhuan:"水浒传",
    sanguoyanyi:"三国演义",
    jiangjinxiong:"奖金熊",
    saima:"赛马",
    yingchaoliansai:"英超联赛",
    fengshenbang:"封神榜",
    senlinwuhui:"森林舞会",
    shuiguoji:"经典水果机",
    baoziwang:"豹子王",
    huluoji:"葫芦鸡",
    yuxiahao:"鱼虾蚝",
    fuguixiongmao:"富贵熊猫",
    jinlianyinye:"金莲淫液",
    xingganmeinv:"性感美女",
    luobinhan:"罗宾汉",
    roulet36:"轮盘",

    zhanWM918:"斩五门",
    football:"足球嘉年华",
    thaiamazing:"泰国神游",
    easter:"复活节",
    newyear:"拜年",
    steamtower:"蒸汽塔",
    victory:"胜利",
    longhudou1:"龙虎斗1",
    longhudou2:"龙虎斗2",
    longhudou3:"龙虎斗3",
    dragon5:"五龙",
    jixing:"吉星",
    western_pasture:"西部牧场",
    rally:"拉力赛",
    traffic_light:"红绿灯",
    garden:"花园",
    prosperity:"发大财",
    cherryLove:"樱桃的爱",
    ranch_story:"农场故事",
    stoneage:"石器时代",
    blazing_star:"闪亮之星",
    ice_land:"冰雪世界",
    indiamyth:"印度神话",
    magician:"魔法师",
    circus:"马戏团",
    airplane:"飞机",
    fame:"名利场",
    baccarat918:"百家乐",
    baijiale1:"百家乐1",
    baijiale2:"百家乐2",
    baijiale3:"百家乐3",
    ocean:"海洋天堂",
    singlepick:"单挑",
    bcbm918:"奔驰宝马",
    sicbo918:"豹子王",
    three_poker918:"三卡扑克",
    hold_em_918:"赌城",
    bull918:"牛牛",
    roulet73:"73轮盘",
    roulet24:"24轮盘",
    roulet12:"12轮盘",
    aladdin:"阿拉丁",
    zwbs:"西游争霸之战无不胜",
    halloween:"万圣节",
    brave_legend:"勇敢传说",
    fairy_garden:"精灵花园",
    african_safari:"狂野非洲",
    golden_dragon:"金龙赐福",
    wufumen:"五福门",
    Cleopatra:"埃及艳后",
    wangcai:"旺财",
    wolfer:"猎狼者",
    alice:"爱丽丝",
    captain9:"船长9线",
    casino_war:"赌城战争",
    crazy_money:"狂热金钱",
    felicitous:"招财进宝",
    ireland_lucky:"爱尔兰运气",
    laura:"劳拉",
    money_frog:"金钱蛙",
    moto_race:"赛摩托",
    top_gun:"壮志凌云",
    year_by_year:"年年有余",
    swk:"孙悟空",
    pirate_ship:"海盗船",
    sea_captain:"船长",
    sea_world:"海洋世界",
    huang_di_lai_le:"皇帝来了",
    treasure_islang:"珍宝岛",
    witch:"万圣节惊喜",
    colabottle:"可乐瓶",
    spartan:"斯巴达",
    dashennaohai:"大圣闹海",
    likuipiyu:"李逵劈鱼",
    fishstar:"捕鱼之星",
    dashennaohaiwanpao:"大圣闹海万炮版",
    likuipiyuwanpao:"李逵劈鱼万炮版",
    fishstarwanpao:"捕鱼之星万炮版",
    haiwangbuyuwanpao:"海王捕鱼万炮版",
    ternado:"龙卷风",
    Slot_Motorcycle:"极限赛车",
    Season: "季节问候",
    water:"海豚",
    xuemei:"学妹",
    orient:"东方快车",
    CoyoteCash:"野狼现金",
    yemei:"野妹",
    captain20:"船长",
    Matsuri:"飨宴",
    saintseiay:"圣斗士星矢",
    fashion:"时尚世界",
    Trex:"霸王龙",
    GreatChina:"中华之最",
    line9:"九线拉王",


    enter_game:"正在进入房间!请稍等!",
    error_operate: "错误操作...",
    coming_soon:"敬请期待!",
    add_score_succ:"成功加了%s分",
    check_version_updates:"检测版本更新中...",
    wait_next_round_tip: "游戏正在进行中，请耐心等待下一轮开始。",  //俄罗斯轮盘提示信息
    err_psw:"密码错误",
    network_connecting:"网络连接中...",
    free_win:"在免费游戏中获得",
    account_forbid:"账号禁止在该区域登录",
    // extra_win:"你额外中了%s",

	register_id:"(最多12位，不区分大小写)",
	register_password:"(最少8位数，区分大小写)",
	register_email:"用于重置密码使用",
	promoter_code:"必须填写",
	register_tips1:"注册成功",
	register_tips2:"账号已存在",
	register_tips3:"邀请码不正确",
	register_tips4:"填写不正确",
	send_captcha:"发送验证码",
	resend_captcha:"%s秒",
	email_address:"注册账号时绑定的邮箱",
	register_help:"1.账号最多为12位数，最少为6位数。\n2.注册账号需绑定邀请码才能注册成功。\n3.注册成功后会生成自己的邀请码。",
	password_tips1:"初始密码：123456，请及时修改密码。",
	password_tips2:"初始密码：123456",
	transfer_successful:"转账成功",
	transfer_failed:"余额不足",
	transfer_null:"转账金额不能为空",
	commission_history:"历史总收益：%s",
    invert_code:"我的邀请码：%s",
    successful_withdrawal:"提现成功!",
    account_exist:"用户名已经存在",
    email_exist:"Email已经存在",
    invalid_promoter_code:"邀请码不存在",
    invalid_pin:"找回密码重设,验证码不存在或错误",
    email_failed_to_send:"邮件发送失败",
    account_not_exits:"账号不存在",
    commission_not_enough:"当前没有可提现收益",
    password_error:"支付密码错误",
    transfer_failure:"转账失败",
    available_to_upline_and_downline:"必须是直接上下级关系才能转账",
    account_too_short:"用户名必须为6位或以上字符",
    account_must_filled:"用户名必须填写",
    password_must_filled:"密码必须填写",
    promoter_code_error:"邀请码错误",
    no_record:"没有记录",
    need_update:'有新版本需要更新',
    wait_exit:"该局游戏正在进行中",
    captcha_timeout:"验证码不存在或错误",
    limit_red:'限红5000',
    charge_success:"下单成功",
    charge_fail:"下单失败",
    table_not_sit:"该桌子已满",
    control_success:"成功",
    not_connect:"断开连接，点击重新登录",
    in_table:"已经在桌子上",
    operate_err:"操作错误",
    operate_limit:"操作太频繁!",
    bind_err:"绑定错误",
    bind_mobile_already:"该手机号已注册",
    login_err:"登录异常!",
    field_limit:"该区域已达上限!",
    banker_min_coin:"上庄最少需要%s",
    not_down_banker:"申请成功!",
    nn:"抢庄牛牛",
    have_sit_down:"玩家已坐下",
    envelope_not_enough:"红包余额不足",
    envelope_already_get:"红包当日已兑换",
    bank_coin_not_enough:"银行存款不足",
    bank_passwd_error:"银行密码错误",
    gold:"金币",
    dollar:"价格:%s美元",
    show_ad:"金币不足，您可以观看完整广告来获得金币奖励，您是否观看?",
    email:"邮箱",
    email_tips: "提示：邮箱账号是您找回密码的凭证。",
    email_empty:"邮箱不能为空",
    room_id_non_existent:"房号不存在",
    distance_less200:"距离其他玩家小于200米",
    forbid_same_ip:"禁止同ip进入",
    club_freeze:"亲友圈已冻结",
    put_max_card:"请出最大的牌",
    put_min_card:"请包含最小的牌",
    not_desk_info:"当前未加入过游戏",
    coin_not_enough:"金币不足",
    club_state_is_dorbid:"抱歉，您暂时被群主暂停娱乐了",
    club_is_haved:"该亲友圈名已存在",
    permission_denied:"权限不足",
    player_not_exits:"该用户不存在",
    player_not_exits_in_club:"该用户不在本亲友圈",
    score_power:"疲劳值不足",
    water_line_less:"水线值不能低于当前值",
    no_can_create_club:"没有创建亲友圈的权限",
};

