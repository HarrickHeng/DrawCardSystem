var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Dc = (function () {
    function Dc() {
        /**抽卡随机数 */
        this.RANDNUM = 0;
        /**抽卡次数 */
        this.DRAWNUM = 0;
        /**全局补偿值 */
        this.OFFSET = 0;
        /**输出结果卡池 */
        this.resCardPool = [];
        /**当前目标卡池 */
        this.curCardPool = [];
        /**抽中名义概率 */
        this.selectPR = 1;
        /**接受自动分配的卡牌 */
        this.doormat = [];
    }
    /**读取配置表 */
    Dc.prototype.initCfg = function () {
        Dc._CFG_ = RES.getRes("dcconfig_json");
        Dc._CARDS_ = Dc._CFG_["cards"];
        this.MAINTYPES = this.CURTYPES = Dc._CFG_["mainpool_type"];
        this.initCardFsm();
    };
    /**重置目标卡池 */
    Dc.prototype.resetCurPool = function () {
        this.CURTYPES = this.MAINTYPES; //重读根名单
        this.curCardPool = [];
        this.selectCard = null;
    };
    /**初始化卡库数据 */
    Dc.prototype.initCardFsm = function () {
        var initArr = [];
        this.loadCfgToPool(initArr, this.MAINTYPES);
        this.getInstancePool(initArr);
        CardFsm.getInstance().clearUserCard();
        CardFsm.getInstance().addUserCards(initArr);
    };
    /**通过type读取卡牌配置 */
    Dc.prototype.findCfgByType = function (type) {
        for (var i = 0; i < Dc._CARDS_.length; i++) {
            if (Dc._CARDS_[i].type === type)
                return Dc._CARDS_[i];
        }
        throw Error('缺少卡牌' + type + '的配置！');
    };
    /**牌池装载配置池 */
    Dc.prototype.loadCfgToPool = function (pool, types) {
        for (var i = 0; i < types.length; i++) {
            var c_config = this.findCfgByType(types[i]);
            pool.push(c_config);
        }
        return pool;
    };
    /**配置池实例化 */
    Dc.prototype.getInstancePool = function (cardpool) {
        for (var _i = 0, cardpool_1 = cardpool; _i < cardpool_1.length; _i++) {
            var card = cardpool_1[_i];
            var instance = new StdCard(card.type, card.awardPool, card.PR, card.PR_Offset, card.isRare);
            var index = cardpool.indexOf(card);
            if (instance.PR == 0)
                this.doormat.push(instance);
            if (index > -1)
                cardpool.splice(index, 1, instance);
        }
        return cardpool;
    };
    /**读取次级牌库配置 */
    Dc.prototype.loadSecByCfg = function (card) {
        if (card)
            this.CURTYPES = card.awardPool;
        this.curCardPool = [];
        this.loadCfgToPool(this.curCardPool, this.CURTYPES);
        return this.getInstancePool(this.curCardPool);
    };
    /**创建卡片 */
    Dc.prototype.createCard = function () {
        this.loadSecByCfg(this.selectCard);
        this.distributePR(this.curCardPool);
        // egret.log("_____NEWPOOL HAD BEEN CREATED______", this.curCardPool);
    };
    /**抽卡递归 */
    Dc.prototype.drawCard = function (isSeria) {
        this.createCard();
        this.RANDNUM = Math.random();
        for (var _i = 0, _a = this.curCardPool; _i < _a.length; _i++) {
            var card = _a[_i];
            var finalPR_Line = card.PR_Line + card.PR_Offset * this.OFFSET;
            if (this.RANDNUM <= finalPR_Line) {
                card.count++;
                this.loadInResPool(this.curCardPool);
                this.selectCard = card;
                this.selectPR = this.selectPR * card.PR;
                this.OFFSET = card.isRare ? 0 : this.OFFSET + 1;
                if (card.awardPool.length == 0) {
                    this.DRAWNUM++;
                    this.recordFsm();
                    if (!isSeria) {
                        var log = "【" + this.DRAWNUM + "】" + "抽中卡片: " + '' + this.selectCard.type + '\n' + "抽中名义概率:" + '' + (this.selectPR * 100).toFixed(2) + "%";
                        egret.log("【" + this.DRAWNUM + "】" + "抽中卡片:" + this.selectCard.type);
                        egret.log("抽中名义概率:" + (this.selectPR * 100).toFixed(2) + "%");
                        CardFsm.getInstance().setlogs(log);
                        // this.showCard();
                    }
                    this.resetCurPool();
                    this.selectPR = 1;
                    return;
                }
                else {
                    return this.drawCard(isSeria);
                }
            }
        }
    };
    /**分布概率界限 */
    Dc.prototype.distributePR = function (cardpool) {
        var _this = this;
        if (!this.doormat)
            throw Error('卡池中所有卡牌均为手动配置概率，可能会导致计算错误，请至少有一个自动分配');
        var acc = 0; //累加值
        //全部自动分配
        if (this.doormat.length == cardpool.length) {
            for (var _i = 0, cardpool_2 = cardpool; _i < cardpool_2.length; _i++) {
                var card = cardpool_2[_i];
                card.PR = 1 / cardpool.length;
                acc += card.PR;
                card.PR_Line = acc;
            }
            this.doormat = [];
            return;
        }
        //只有一个自动分配
        if (this.doormat.length == 1) {
            for (var _a = 0, cardpool_3 = cardpool; _a < cardpool_3.length; _a++) {
                var card = cardpool_3[_a];
                if (card.type !== this.doormat[0].type) {
                    acc += card.PR;
                    card.PR_Line = acc;
                    continue;
                }
                if (acc < 1) {
                    this.doormat[0].PR = 1 - acc;
                    this.doormat[0].PR_Line = 1;
                    continue;
                }
                throw Error('卡池中分配的基础概率超过100%');
            }
            this.doormat = [];
            return;
        }
        //多个自动分配
        if (this.doormat.length > 1) {
            var expool = cardpool.filter(function (el) { return !~_this.doormat.indexOf(el); }); //不自动分配的牌组
            for (var _b = 0, expool_1 = expool; _b < expool_1.length; _b++) {
                var card = expool_1[_b];
                acc += card.PR;
                card.PR_Line = acc;
            }
            if (acc >= 1)
                throw Error('卡池中分配的基础概率超过100%');
            var doormatPR = (1 - acc) / this.doormat.length;
            for (var i = 0; i < this.doormat.length; i++) {
                this.doormat[i].PR = doormatPR;
                acc += doormatPR;
                this.doormat[i].PR_Line = acc;
            }
            this.doormat = [];
            return;
        }
    };
    /**载入输出结果卡池 */
    Dc.prototype.loadInResPool = function (cur) {
        var _this = this;
        cur.forEach(function (val, idx, arr) {
            if (val.count == 1)
                _this.resCardPool.push(val);
        });
        return this.resCardPool;
    };
    /**连抽 */
    Dc.prototype.serialDraw = function (num) {
        var count = Math.floor(num);
        if (count < 1 || !count)
            return;
        for (var i = 0; i < count; i++) {
            this.drawCard(true);
        }
        CardFsm.getInstance().setlogs("-----" + "开始" + num + "连抽" + "-----");
        this.showCard();
        this.OnReset();
    };
    /**显示抽卡情况 */
    Dc.prototype.showCard = function () {
        for (var _i = 0, _a = this.MAINTYPES; _i < _a.length; _i++) {
            var type = _a[_i];
            for (var _b = 0, _c = CardFsm.getInstance().userCards; _b < _c.length; _b++) {
                var card = _c[_b];
                if (card.type === type) {
                    var ratio = (card.count / this.DRAWNUM * 100).toFixed(2);
                    var log = '' + card.type + ":" + '' + card.count + "占比:" + '' + ratio + "%";
                    egret.log(card.type + ":" + card.count, "占比:" + ratio + "%");
                    CardFsm.getInstance().setlogs(log);
                }
            }
        }
    };
    /**记录结果输出 */
    Dc.prototype.recordFsm = function () {
        CardFsm.getInstance().addUserCards(this.resCardPool);
        this.resCardPool = [];
    };
    /**显示拥有的牌库 */
    Dc.prototype.watchMyCards = function () {
        var cards = CardFsm.getInstance().userCards;
        for (var _i = 0, cards_1 = cards; _i < cards_1.length; _i++) {
            var card = cards_1[_i];
            var log = card.type + ':' + card.count;
            egret.log(log);
            CardFsm.getInstance().setlogs(log);
        }
    };
    /**重置抽卡 */
    Dc.prototype.OnReset = function () {
        this.initCardFsm();
        this.DRAWNUM = 0;
        this.RANDNUM = 0;
        this.OFFSET = 0;
        this.selectPR = 1;
        this.selectCard = null;
        this.curCardPool = [];
        this.resCardPool = [];
        egret.log("-----数据已清空-----");
        CardFsm.getInstance().setlogs("-----数据已清空-----");
    };
    return Dc;
}());
__reflect(Dc.prototype, "Dc");
//# sourceMappingURL=Dc.js.map