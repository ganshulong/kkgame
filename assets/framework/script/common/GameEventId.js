// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let EventId = require("EventDef");
EventId.SHOW_SCORE_LOG = "show_score_log";           // 显示上下分记录
EventId.SHOW_MODIFY_PSW = "show_modify_psw";         // 显示修改密码
EventId.ENTER_HALL = "enter_hall";
EventId.ENTER_GAME_EVENT = 'enter_game_event';        // 进入某个游戏
EventId.ENTER_LOGIN_SUCCESS = 'enter_login_success';  // 成功登录
EventId.STOP_ACTION = "stop_action";                  // 停止动画
EventId.LOGOUT = "logout";                            // 登出
EventId.UPDATE_GAME_LIST = "update_game_list";        // 更新列表
EventId.UPATE_COINS = "upate_coins";                  // 更新金币
EventId.EXIT_GAME = "exit_game";                      // 退出游戏
EventId.SHOW_BIGBANG = "show_bigbang";                // 显示Bigbang动画
EventId.HIDE_BIGBANG = "hide_bigbang";                // 隐藏Bigbang动画
EventId.RECHARGE_SUCC = "recharge_succ";              // 上下分成功
EventId.SPECIAL_ACTION_FINISH = "special_action_finish";   // 特殊动画，主要指停止后，结算前播放动画
EventId.LOAD_ITEM_FINISH = "load_Items_finish";       // 加载item完成
EventId.SHOW_ALL_GAMEITEM = "show_all_gameitem";       // 显示所有游戏图标
EventId.SHOW_RANDJACKPOT = "show_randjackpot";         // 显示randjackpot动画
EventId.HIDE_RANDJACKPOT = "hide_randjackpot";          // 隐藏randjackpot动画
EventId.RELOGIN = "game_relogin";                       // 重新登录
EventId.PAUSE_PLAY_BIGWIN = "pause_play_bigwin";        // 暂停播放bigwin
EventId.PLAY_BIGWIN = "play_bigwin";                    // 播放bigwin
EventId.SET_SHAKE = "set_shake";                        // 开关震动
EventId.UPDATE_REDPACK = "UPDATE_REDPACK"               // 更新红包
EventId.HALL_EFF_SHOWCOINS = "HALL_EFF_SHOWCOINS"       // 开红包金币显示
EventId.HALL_EFF_SHOWLUCKPACK = "HALL_EFF_SHOWLUCKPACK"       // 显示幸运红包动画节点
EventId.HALL_EFF_OPENLUCKBOX = "HALL_EFF_OPENLUCKBOX"       // 显示开宝箱界面
EventId.HALL_EFF_SHOWLUCKRAIN = "HALL_EFF_SHOWLUCKRAIN" //显示红包雨
EventId.HALL_FAV_GAME_CHANGE = "HALL_FAV_GAME_CHANGE"   //喜爱的gameid发生变化
EventId.SHOW_RED_HEART_ANI = "SHOW_RED_HEART_ANI"  ;             //播放喜爱动画
EventId.SHOW_SETTING = "show_setting"                    // 显示设置页面
EventId.REGISTER_ACCOUNT = "register_account"  ;          // 注册事件
EventId.ENTER_FRONT = "enter_front"  ;                    // 切换到前台
EventId.SHOW_SHOP = "show_shop"  ;                        // 显示商城
EventId.UPDATE_CLUBS = "update_clubs" ;                   // 更新俱乐部列表
EventId.GAME_CREATEROOM = "game_createroom" ;             // 创建房间
EventId.CLEARDESK = "clear_desk";                         // 清理桌面
EventId.HANDCARD = "handcard";                            // 手牌
EventId.OUTCARD = "outcard";                              // 自己出牌
EventId.OUTCARD_NOTIFY = "outcard_notify";                // 出牌通知
EventId.PAO_NOTIFY = "pao_notify";                        // 跑通知
EventId.KAN_NOTIFY = "kan_notify";                        // 坎通知
EventId.LONG_NOTIFY = "long_notify";                      // 龙通知
EventId.PENG_NOTIFY = "peng_notify";                      // 碰通知
EventId.GUO_NOTIFY = "guo_notify";                        // 过通知
EventId.CHI_NOTIFY = "chi_notify";                        // 吃通知
EventId.MOPAI_NOTIFY = "mopai_notify";                    // 摸牌通知
EventId.PLAYER_ENTER = "player_enter";                    // 玩家进来
EventId.PLAYER_EXIT = "player_exit";                      // 玩家离开
EventId.HU_NOTIFY = "hu_notify";                          // 摸牌通知
EventId.CLOSE_ROUNDVIEW = "close_roundview";              // 关闭小结算
EventId.SHOW_ROUND_VIEW = "show_round_view";              // 显示小结算
EventId.GAMEOVER = "gameover";                            // 大结算
EventId.SHOW_GAMEOVER = "show_gameover";                  // 显示大结算
EventId.GAME_RECONNECT_DESKINFO = "game_reconnect_deskinfo"; // 断线重连数据
EventId.HIDE_SHOWCARD = "hide_showcard";                  // 隐藏出牌
EventId.SHOW_MENZI = "show_menzi";                        // 显示门子
EventId.SHOW_MENZI_SOUND = "show_menzi_sound";            // 显示门子
EventId.SHOW_CHAT = "show_chat";                          // 显示聊天框
EventId.CHAT_NOTIFY = "chat_notify";                      // 聊天通知
EventId.DEL_HANDCARD_NOTIFY = "del_handcard_notify";      // 删除手牌通知
EventId.READY_NOTIFY = "ready_notify";                    // 准备通知
EventId.OFFLINE_NOTIFY  = "offline_notify";               // 掉线通知
EventId.SELF_GPS_DATA = "sele_gps_data";	  			  // 获得gps数据	
EventId.PLAYER_DISTANCE_DATA = "player_distance_data";	  // 玩家距离数据	

