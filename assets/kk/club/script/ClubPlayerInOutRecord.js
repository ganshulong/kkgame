
cc.Class({
    extends: cc.Component,

    properties: {
        _layer:null,
        _applyList:[],
    },

    // onLoad () {},

    start () {
        cc.vv.NetManager.registerMsg(MsgId.CLUB_PLAYER_IN_OUT_RECORD, this.onRcvClubPlayerInOutRecord, this);
    },

    showLayer(){
        if(this._layer === null){
            cc.loader.loadRes("common/prefab/club_playerInOutRecord",cc.Prefab,(err,prefab)=>{
                if(err === null){
                    this._layer = cc.instantiate(prefab);
                    // this._layer.scaleX = this.node.width / this._layer.width;
                    // this._layer.scaleY = this.node.height / this._layer.height;
                    this._layer.parent = this.node;
                    this._layer.zIndex = 1;
                    this._layer.x = this.node.width/2 - this.node.x;
                    this._layer.y = this.node.height/2 - this.node.y;

                    this.initUI();
                    this.initShow();
                }
            })
        }
        else{
            this._layer.active = true;
            this.initShow();
        }
    },

    initUI(){
        let closeBtn = this._layer.getChildByName("btn_close");
        Global.btnClickEvent(closeBtn,this.onClose,this);

        this.content = cc.find("panel_list/scrollView/content",this._layer);
        this.contentItem = cc.find("panel_list/scrollView/contentItem",this._layer);
        this.contentItem.active = false;
    },

    initShow(){
        this.content.removeAllChildren();

        var req = { 'c': MsgId.CLUB_PLAYER_IN_OUT_RECORD};
        req.clubid = cc.vv.UserManager.currClubId;
        cc.vv.NetManager.send(req);
    },

    onRcvClubPlayerInOutRecord(msg){
        if (200 == msg.code) {
            for(let i = 0; i < msg.records.length; ++i){
                let item =  cc.instantiate(this.contentItem);
                item.parent = this.content;
                item.y = - this.contentItem.height * i;

                let bg_memberItem = item.getChildByName("bg_memberItem");
                bg_memberItem.getChildByName("text_info").getComponent(cc.RichText).string = msg.records[i].msg;
                bg_memberItem.getChildByName("text_time").getComponent(cc.Label).string = msg.records[i].time;
                item.active = true;
            }
            this.content.height = this.contentItem.height * msg.records.length;
        }
    },

    onClose(){
        this._layer.active = false;
    },

    onDestroy(){
        cc.vv.NetManager.unregisterMsg(MsgId.CLUB_PLAYER_IN_OUT_RECORD, this.onRcvClubPlayerInOutRecord, this);
        if(this._layer){
            cc.loader.releaseRes("common/prefab/club_playerInOutRecord",cc.Prefab);
        }
    },
    // update (dt) {},
});
