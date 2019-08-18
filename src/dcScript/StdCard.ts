class StdCard {
    private _type: string;               //类型(唯一标识)
    private _count: number = 0;         //数量
    private _awardPool: Array<any>;    //子奖池
    private _PR: number;              //基础概率
    private _PR_Line: number;        //概率界限
    private _PR_Offset: number = 0; //概率补偿值
    private _isRare: boolean;      //是否重置全局补偿值

    constructor(type: string, awardPool: Array<any>, PR: number, PR_Offset: number, isRare: boolean) {
        this._type = type;
        this._awardPool = awardPool;
        this._PR = PR;
        this._PR_Offset = PR_Offset;
        this._isRare = isRare;
    }

    /**类型(唯一标识) */
    public get type(): string {
        return this._type;
    }

    /**设置数量 */
    public set count(num: number) {
        this._count = num;
    }
    public get count(): number {
        return this._count;
    }

    /**设置奖池 */
    public set awardPool(arr: Array<any>) {
        this._awardPool = arr;
    }
    public get awardPool(): Array<any> {
        return this._awardPool;
    }

    /**设置基础概率 */
    public set PR(num: number) {
        this._PR = num;
    }
    public get PR(): number {
        return this._PR;
    }

    /**设置概率界限 */
    public set PR_Line(num: number) {
        this._PR_Line = num;
    }
    public get PR_Line(): number {
        return this._PR_Line;
    }

    /**设置概率补偿值 */
    public set PR_Offset(num: number) {
        this._PR_Offset = num;
    }
    public get PR_Offset(): number {
        return this._PR_Offset;
    }

    /**是否重置全局补偿值 */
    public set isRare(b: boolean) {
        this._isRare = b;
    }
    public get isRare(): boolean {
        return this._isRare;
    }
}