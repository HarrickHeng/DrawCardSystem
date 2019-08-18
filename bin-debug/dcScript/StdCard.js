var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var StdCard = (function () {
    function StdCard(type, awardPool, PR, PR_Offset, isRare) {
        this._count = 0; //数量
        this._PR_Offset = 0; //概率补偿值
        this._type = type;
        this._awardPool = awardPool;
        this._PR = PR;
        this._PR_Offset = PR_Offset;
        this._isRare = isRare;
    }
    Object.defineProperty(StdCard.prototype, "type", {
        /**类型(唯一标识) */
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StdCard.prototype, "count", {
        get: function () {
            return this._count;
        },
        /**设置数量 */
        set: function (num) {
            this._count = num;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StdCard.prototype, "awardPool", {
        get: function () {
            return this._awardPool;
        },
        /**设置奖池 */
        set: function (arr) {
            this._awardPool = arr;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StdCard.prototype, "PR", {
        get: function () {
            return this._PR;
        },
        /**设置基础概率 */
        set: function (num) {
            this._PR = num;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StdCard.prototype, "PR_Line", {
        get: function () {
            return this._PR_Line;
        },
        /**设置概率界限 */
        set: function (num) {
            this._PR_Line = num;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StdCard.prototype, "PR_Offset", {
        get: function () {
            return this._PR_Offset;
        },
        /**设置概率补偿值 */
        set: function (num) {
            this._PR_Offset = num;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StdCard.prototype, "isRare", {
        get: function () {
            return this._isRare;
        },
        /**是否重置全局补偿值 */
        set: function (b) {
            this._isRare = b;
        },
        enumerable: true,
        configurable: true
    });
    return StdCard;
}());
__reflect(StdCard.prototype, "StdCard");
//# sourceMappingURL=StdCard.js.map