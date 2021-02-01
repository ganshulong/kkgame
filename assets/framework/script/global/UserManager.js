// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    statics: {
        //=========首次登陆下发的数据=====
        gameServer:'',  //服务端下发的游服地址
        token:'',       //首次登陆的token
        serverId:'',    //服务器id
        subId:'',

        //==============================
        uid: 0,         //用户id
        openid: 0,      //用户openid（第三方id）
        coin: {
            get () {
                return this._coin?this._coin:0;
            },
            set (value) {
                this._coin = value;
            }
        },        //金币
        userIcon: '',   //头像地址
        sex: 1,         //1男2女
        agent:0,        //代理等级
        nickName:'',    //昵称
        inviteCode:'', //自己的邀请码
        bindcode: '', //绑定的邀请码
        ip: '192.168.0.1', //玩家的ip
        memo: '', //备注
        onlinestate:0,      // 在线奖励领取状态
        syotime:0,          // 倒计时
        lrwardstate:0,      // 每日奖励领取
        switch:null,        // 运营开关
        showActivity:true, // 弹出活动页面
        //GPS信息
        lat:0, //纬度
        lng:0, //经度
        unionid:'',     //微信才有的唯一id,用来微信冷登录

        loginPopList: [],
        loginPopIdx: 0,

        bank_token:null, //银行token
        bank_info: {}, //银行信息
        rememberPsw:false,
        gameList:[],  // 游戏列表
        isAutoLogin:true,  // 自动登录
        notice:"",      // 公告
        luckRedvelopesNum:0,    //幸运红包的个数
        growup:null,    //成长星级
        red_envelop:0,      // bigbang红包
        localFavList:null,  //本地的喜爱列表
        areaCode:null,      //http服务器下发的区域代码
        headSprite:null,    // 获取我的头像
        sigin:"",           // 兑换key
        mobile:"",          // 绑定手机号
        GpsCity:"",          // 玩家定位区域定位区域
        noityList:[],
        clubs:[],
        daojuList:[],
        supervip:0,
        serverInfo:"",      //客服

        //初始化
        init: function () {
             //用Global来取用户数据
            Global.playerData = this;
            this.switch = [];
            this.loginPopList = [1,2];
            this.loginPopIdx = 0;
            cc.vv.NetManager.registerMsg(MsgId.GAME_LIST,this.recvGameList,this);

            
        },

        // 保存网络头像
        setHeadSprite(spr){
            this.headSprite = spr;
        },

        getHeadSprite(){
            return this.headSprite;
        },

        //初始化登陆服务器下发的数据
        initLoginServer: function (loginServerData) {
            this.gameServer = loginServerData.net;
            this.token = loginServerData.token;
            this.serverId = loginServerData.server;
            this.subId = loginServerData.subId;
            this.uid = loginServerData.uid;
            this.unionid = loginServerData.unionid;


        },

        recvGameList(msg)
        {
            if(msg.code === 200)
            {
                this.gameList = msg.gamelist;
                for(let k in this.gameList){
                    let list = this.gameList[k];
                    list.sort((a,b)=>{
                        return b.ord-a.ord;
                    });
                }
                Global.dispatchEvent(EventId.UPDATE_GAME_LIST);
            }
        },

        findGameType(gameId){
            let type = 0;
            for(let k in this.gameList){
                let list = this.gameList[k];
                for(i=0;i<list.length;++i){
                    if(list[i].id == gameId){
                        type = k;
                        break;
                    }
                }
            }
            return parseInt(type);
        },

        //初始化玩家数据
        initPlayerData: function (serverData) {
            var playerData = serverData.playerInfo
            var act = serverData.actlist
            this.uid = playerData.uid
            this.coin = playerData.coin
            this.userIcon = playerData.usericon 
            this.sex = playerData.sex
            this.agent = playerData.agent
            this.nickName = playerData.playername
            this.memo = playerData.memo;
            this.inviteCode = playerData.code
            this.bindcode = playerData.bindcode;
            this.ip = playerData.ip;
            this.onlinestate = playerData.onlinestate;
            this.lrwardstate = playerData.lrwardstate;
            this.upcoin = serverData.upcoin;                // 修改昵称需要金币数量
            this.ispayer = playerData.ispayer;
            this.account = playerData.account;
            this.logincoin = playerData.logincoin;
            this.switch = playerData.switch || [];
            this.logintype = playerData.logintype; //登录方式：游客/微信/fb/账号
            this.isbindfb = playerData.isbindfb;
            this.isbindwx = playerData.isbindwx;
            this.spread = playerData.spread || 0;    //推广总代级别0，1，2，3
            this.gameList = serverData.gamelist;
            this.luckRedvelopesNum = playerData.luckRedvelopesNum
            this.growup = serverData.growup
            this.red_envelope = playerData.red_envelope;
            this.openid = playerData.openid;
            this.sigin = serverData.sigin;
            this.mobile = playerData.mobile || "";
            this.roomcard =  playerData.roomcard;
            this.clubs = serverData.clubs;
            this.GpsCity = playerData.city || "";
            this.noityList = serverData.noityList || [];
            this.daojuList = serverData.daojuList || [];
            this.supervip = playerData.supervip;
            this.serverInfo = serverData.serverInfo;

            for (var i = 0; i < this.gameList.length; i++) {
                this.gameList[i].id -= 1;
            }

            Global.saveLocal(Global.SAVE_KEY_LOGIN_TYPE, this.logintype);
            Global.saveLocal(Global.SAVE_KEY_LAST_LOGIN_TYPE, this.logintype);
        },

        // 绑定手机号
        setBindMobile(mobile){
            this.mobile = mobile;
        },

        getBindMobile(){
            return this.mobile;
        },

        getIsAutoLogin()
        {
            return this.isAutoLogin;
        },

        setIsAutoLogin(value)
        {
            this.isAutoLogin = value;
        },

        // 获取游戏列表
        getGameList(){
            return this.gameList;
        },

        // 获取游戏列表中某个游戏数据
        getGameListById(gameId){
            let res = null
            for(let bigType in this.gameList){
                let bigDatas = this.gameList[bigType]
                for(let i = 0; i < bigDatas.length; i++){
                    if(Number(gameId) == Number(bigDatas[i].id)){
                        res = bigDatas[i]
                        break
                    }
                }
            }
            return res
        },

        // 设置记住密码
        setRemember(value)
        {
            this.rememberPsw = value;
        },

        setNickName(name)
        {
          this.nickName = name;
        },



        //设置经纬度
        setLatLng: function (lat, lng) {
            this.lat = lat || 0;
            this.lng = lng || 0;
        },

        //Api登陆暂存的参数
        //data.gameid:游戏id
        //data.token:玩家token
        //data.signstr:验签数据
        setApiData:function(data){
            this._apiData = data
        },
        //api游戏id
        getApiGameId:function(){
            if(this._apiData){
                return this._apiData['gameid']
            }
            
        },
        //api签名数据
        getApiSign:function(){
            if(this._apiData){
                return this._apiData['signstr']
            }
        },
        //Api登陆暂存的登陆方式
        setLoginType:function(val){
            this._apiLogin = val
        },
        getLoginType(){
            return this._apiLogin
        },

        getCurClubInfo(){
            let info = null;
            if (this.currClubId) {
                for(let i=0;i<this.clubs.length;++i){
                    if(this.currClubId === this.clubs[i].clubid){
                        info = this.clubs[i];
                    }
                }
            }
            return info;
        },

        setClubFreezeState(clubID, state){
            for(let i=0;i<this.clubs.length;++i){
                if(clubID === this.clubs[i].clubid){
                    this.clubs[i].state = state;
                    return;
                }
            }
        },

        dismissExitCurClub(){
            if (this.currClubId) {
                for(let i=0;i<this.clubs.length;++i){
                    if(this.currClubId === this.clubs[i].clubid){
                        this.clubs.splice(i,1);
                        return;
                    }
                }
            }
        },

        setClubMode(clubID, mode){
            for(let i=0;i<this.clubs.length;++i){
                if(clubID === this.clubs[i].clubid){
                    this.clubs[i].mode = mode;
                    return;
                }
            }
        },

        setClubFuFen(clubID, mode){
            for(let i=0;i<this.clubs.length;++i){
                if(clubID === this.clubs[i].clubid){
                    this.clubs[i].fufen = mode;
                    return;
                }
            }
        },

        setClubExitApplyState(clubID, state){
            for(let i=0;i<this.clubs.length;++i){
                if(clubID === this.clubs[i].clubid){
                    this.clubs[i].exitHave = state;
                    return;
                }
            }
        },
    },
});
