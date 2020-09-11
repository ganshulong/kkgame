
cc.Class({
    extends: cc.Component,

    properties: {
        _layer: null,
    },

    init(path) {
        cc.loader.loadRes(path, cc.Prefab, (err,prefab) => {
            if (err === null)
                this._layer = cc.instantiate(prefab);
                this._layer.position = Global.centerPos;

                let btnClose = this._layer.getChildByName("btnClose");
                Global.btnClickEvent(btnClose,this.onClickClose,this);

                let btn_exChange = this._layer.getChildByName("btn_exChange");
                Global.btnClickEvent(btn_exChange,this.onClickExChange,this);
        })
    },

    show(){
        if (this._layer.parent) {
            this._layer.removeFromParent();
        }
        this._layer.parent = cc.director.getScene();
        this._layer.active = true;
    },

    onClickClose(){
        this._layer.removeFromParent();
        this._layer.active = false;
    },

    onClickExChange(){
        let req = {c: MsgId.EXCHANGE_COIN};
        cc.vv.NetManager.send(req);

        this._layer.removeFromParent();
        this._layer.active = false;
    },
});
