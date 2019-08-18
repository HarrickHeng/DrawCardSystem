class CardFsm {
    private static CardFsm: CardFsm;
    private _userCards: Array<StdCard> = [];
    private _logs: string = '';

    public get userCards(): Array<StdCard> {
        return this._userCards;
    }

    public get logs(): string {
        return this._logs;
    }

    public setlogs(log: string) {
        this._logs += "\n" + log;
    }

    /**单例 */
    public static getInstance(): CardFsm {
        if (this.CardFsm == null)
            this.CardFsm = new CardFsm();
        return this.CardFsm;
    }

    /**清空牌库数据 */
    public clearUserCard(): void {
        this._userCards = [];
    }

    /**添加牌库数据 */
    public addUserCards(arr: Array<StdCard>): void {
        if (this._userCards.length == 0) {
            this._userCards = arr;
        } else {
            //1.已有的卡牌添加数量
            for (let card of this._userCards) {
                arr.forEach((val, idx, arr) => {
                    if (val.type == card.type) {
                        card.count++;
                        arr.splice(idx, 1);
                    }
                });
            }
            //2.没有的卡牌加入数组
            for (let val of arr) {
                for (let card of this._userCards) {
                    if (card.type != val.type) {
                        this._userCards.push(val);
                    }
                }
            }
        }
        this.setUnique(this._userCards);
    }

    /**数组去重 */
    public setUnique(arr) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    }
}