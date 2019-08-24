class Dc {
    /**抽卡随机数 */
    private RANDNUM: number = 0;
    /**抽卡次数 */
    private DRAWNUM: number = 0;
    /**全局补偿值 */
    private OFFSET: number = 0;

    /**全部配置 */
    public static _CFG_: Array<any>;
    /**全部卡牌配置 */
    public static _CARDS_: Array<any>;

    /**根卡池名单 */
    private MAINTYPES: Array<string>;
    /**当前卡池名单 */
    private CURTYPES: Array<string>;

    /**输出结果卡池 */
    private resCardPool: Array<StdCard> = [];
    /**当前目标卡池 */
    private curCardPool: Array<StdCard> = [];

    /**抽中卡片 */
    private selectCard: StdCard;
    /**抽中名义概率 */
    private selectPR: number = 1;
    /**接受自动分配的卡牌 */
    private doormat: Array<StdCard> = [];

    /**读取配置表 */
    public initCfg(): void {
        Dc._CFG_ = RES.getRes("dcconfig_json");
        Dc._CARDS_ = Dc._CFG_["cards"];
        this.MAINTYPES = this.CURTYPES = Dc._CFG_["mainpool_type"];
        this.initCardFsm();
    }

    /**重置目标卡池 */
    public resetCurPool(): void {
        this.CURTYPES = this.MAINTYPES; //重读根名单
        this.curCardPool = [];
        this.selectCard = null;
    }

    /**初始化卡库数据 */
    public initCardFsm(): void {
        let initArr: Array<StdCard> = [];
        this.loadCfgToPool(initArr, this.MAINTYPES);
        this.getInstancePool(initArr);
        CardFsm.getInstance().clearUserCard();
        CardFsm.getInstance().addUserCards(initArr);
    }

    /**通过type读取卡牌配置 */
    public findCfgByType(type: string): void {
        for (let i: number = 0; i < Dc._CARDS_.length; i++) {
            if (Dc._CARDS_[i].type === type) return Dc._CARDS_[i];
        }
        throw Error('缺少卡牌' + type + '的配置！')
    }

    /**牌池装载配置池 */
    public loadCfgToPool(pool: Array<any>, types: Array<string>): Array<any> {
        for (let i: number = 0; i < types.length; i++) {
            let c_config = this.findCfgByType(types[i]);
            pool.push(c_config);
        }
        return pool;
    }

    /**配置池实例化 */
    public getInstancePool(cardpool: Array<any>): Array<StdCard> {
        for (let card of cardpool) {
            let instance: StdCard = new StdCard(card.type, card.awardPool, card.PR, card.PR_Offset, card.isRare);
            let index = cardpool.indexOf(card);
            if (instance.PR == 0)
                this.doormat.push(instance);
            if (index > -1)
                cardpool.splice(index, 1, instance);
        }
        return cardpool;
    }

    /**读取次级牌库配置 */
    private loadSecByCfg(card?: StdCard): Array<StdCard> {
        if (card) this.CURTYPES = card.awardPool;
        this.curCardPool = [];
        this.loadCfgToPool(this.curCardPool, this.CURTYPES);
        return this.getInstancePool(this.curCardPool);
    }

    /**创建卡片 */
    public createCard(): void {
        this.loadSecByCfg(this.selectCard);
        this.distributePR(this.curCardPool);
        // egret.log("_____NEWPOOL HAD BEEN CREATED______", this.curCardPool);
    }

    /**抽卡递归 */
    public drawCard(isSeria?: boolean): StdCard {
        this.createCard();
        this.RANDNUM = Math.random();
        for (let card of this.curCardPool) {
            let finalPR_Line = card.PR_Line + card.PR_Offset * this.OFFSET;
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
                        let log: string = "【" + this.DRAWNUM + "】" + "抽中卡片: " + '' + this.selectCard.type + '\n' + "抽中名义概率:" + '' + (this.selectPR * 100).toFixed(2) + "%";
                        egret.log("【" + this.DRAWNUM + "】" + "抽中卡片:" + this.selectCard.type);
                        egret.log("抽中名义概率:" + (this.selectPR * 100).toFixed(2) + "%");
                        CardFsm.getInstance().setlogs(log);
                        // this.showCard();
                    }
                    this.resetCurPool();
                    this.selectPR = 1;
                    return;
                } else {
                    return this.drawCard(isSeria);
                }
            }
        }
    }

    /**分布概率界限 */
    public distributePR(cardpool: Array<StdCard>): void {
        if (!this.doormat) throw Error('卡池中所有卡牌均为手动配置概率，可能会导致计算错误，请至少有一个自动分配');
        let acc: number = 0; //累加值
        //全部自动分配
        if (this.doormat.length == cardpool.length) {
            for (let card of cardpool) {
                card.PR = 1 / cardpool.length;
                acc += card.PR;
                card.PR_Line = acc;
            }
            this.doormat = [];
            return;
        }
        //只有一个自动分配
        if (this.doormat.length == 1) {
            for (let card of cardpool) {
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
            let expool: Array<StdCard> = cardpool.filter(el => !~this.doormat.indexOf(el)); //不自动分配的牌组
            for (let card of expool) {
                acc += card.PR;
                card.PR_Line = acc;
            }
            if (acc >= 1) throw Error('卡池中分配的基础概率超过100%');
            let doormatPR = (1 - acc) / this.doormat.length;
            for (let i: number = 0; i < this.doormat.length; i++) {
                this.doormat[i].PR = doormatPR;
                acc += doormatPR
                this.doormat[i].PR_Line = acc;
            }
            this.doormat = [];
            return;
        }
    }

    /**载入输出结果卡池 */
    public loadInResPool(cur: Array<StdCard>): Array<StdCard> {
        cur.forEach((val, idx, arr) => {
            if (val.count == 1)
                this.resCardPool.push(val);
        })
        return this.resCardPool;
    }

    /**连抽 */
    public serialDraw(num: number): void {
        let count = Math.floor(num);
        if (count < 1 || !count) return;
        for (let i: number = 0; i < count; i++) {
            this.drawCard(true);
        }
        CardFsm.getInstance().setlogs("-----" + "开始" + num + "连抽" + "-----");
        this.showCard();
        this.OnReset();
    }

    /**显示抽卡情况 */
    private showCard(): void {
        for (let type of this.MAINTYPES) {
            for (let card of CardFsm.getInstance().userCards) {
                if (card.type === type) {
                    let ratio = (card.count / this.DRAWNUM * 100).toFixed(2);
                    let log: string = '' + card.type + ":" + '' + card.count + "占比:" + '' + ratio + "%";
                    egret.log(card.type + ":" + card.count, "占比:" + ratio + "%");
                    CardFsm.getInstance().setlogs(log);
                }
            }
        }
    }

    /**记录结果输出 */
    private recordFsm(): void {
        CardFsm.getInstance().addUserCards(this.resCardPool);
        this.resCardPool = [];
    }

    /**显示拥有的牌库 */
    public watchMyCards(): void {
        let cards = CardFsm.getInstance().userCards;
        for (let card of cards) {
            let log = card.type + ':' + card.count;
            egret.log(log);
            CardFsm.getInstance().setlogs(log);
        }
    }

    /**重置抽卡 */
    public OnReset(): void {
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
    }
}