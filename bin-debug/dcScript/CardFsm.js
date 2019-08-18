var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CardFsm = (function () {
    function CardFsm() {
        this._userCards = [];
        this._logs = '';
    }
    Object.defineProperty(CardFsm.prototype, "userCards", {
        get: function () {
            return this._userCards;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardFsm.prototype, "logs", {
        get: function () {
            return this._logs;
        },
        enumerable: true,
        configurable: true
    });
    CardFsm.prototype.setlogs = function (log) {
        this._logs += "\n" + log;
    };
    /**单例 */
    CardFsm.getInstance = function () {
        if (this.CardFsm == null)
            this.CardFsm = new CardFsm();
        return this.CardFsm;
    };
    /**清空牌库数据 */
    CardFsm.prototype.clearUserCard = function () {
        this._userCards = [];
    };
    /**添加牌库数据 */
    CardFsm.prototype.addUserCards = function (arr) {
        if (this._userCards.length == 0) {
            this._userCards = arr;
        }
        else {
            var _loop_1 = function (card) {
                arr.forEach(function (val, idx, arr) {
                    if (val.type == card.type) {
                        card.count++;
                        arr.splice(idx, 1);
                    }
                });
            };
            //1.已有的卡牌添加数量
            for (var _i = 0, _a = this._userCards; _i < _a.length; _i++) {
                var card = _a[_i];
                _loop_1(card);
            }
            //2.没有的卡牌加入数组
            for (var _b = 0, arr_1 = arr; _b < arr_1.length; _b++) {
                var val = arr_1[_b];
                for (var _c = 0, _d = this._userCards; _c < _d.length; _c++) {
                    var card = _d[_c];
                    if (card.type != val.type) {
                        this._userCards.push(val);
                    }
                }
            }
        }
        this.setUnique(this._userCards);
    };
    /**数组去重 */
    CardFsm.prototype.setUnique = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    };
    return CardFsm;
}());
__reflect(CardFsm.prototype, "CardFsm");
//# sourceMappingURL=CardFsm.js.map