# DrawCard 随机叉树输出系统

从根本上说，DrawCard是一个概率叉树输出系统，使用者可利用配置表自行组成一个树状库，该系统将在这个树状库中，根据设定的概率走向不同分支，直至树状底部并输出结果。除此之外，系统会记录你所有走过的分支，保存入库。

[TOC]



## 适用范围

系统的可控随机性特别适用于游戏领域的开发。最经典的应用就是<u>概率池抽卡</u>玩法。RPG游戏的精英怪物</u>生成规则。博彩游戏中的<u>剧本牌</u>。更多系统功能等待策划者的拓展。

## 更新详情

DrawCard v1.0

更新日志

【特性】支持所有卡牌独立配置

【特性】结果概率输出统计，可查看结果库

## 使用说明

1. 打开卡牌配置表进行卡牌配置（配置路径：\DrawCardSystem\resource\config\dcconfig.json），具体配置方法详见下文**配置说明**；
2. 运行系统；
3. 演示Demo按钮讲解：

 ① 点击Draw单抽，显示当前抽卡次数、抽中卡牌名称（类型）与抽中当前卡牌的名义概率；![1566651645999](DrawCard%E6%A6%82%E7%8E%87%E5%8F%89%E6%A0%91%E7%B3%BB%E7%BB%9F.assets/1566651645999.png)

 ② 点击连抽输入框，输入连抽次数后，会进行卡牌连抽，显示根牌池的数量与各自数量及占比；![1566651729237](DrawCard%E6%A6%82%E7%8E%87%E5%8F%89%E6%A0%91%E7%B3%BB%E7%BB%9F.assets/1566651729237.png)

 ③ 点击Reset重置数据，会清空当前所有牌库数据，重置概率补偿值，不包括配置数据；

 ④ 点击Watch查看当前抽中的卡牌，会显示根牌池数量、抽中卡牌名称及其数量；

![1566652556598](DrawCard%E6%A6%82%E7%8E%87%E5%8F%89%E6%A0%91%E7%B3%BB%E7%BB%9F.assets/1566652556598.png)

## 配置说明

配置表分为两大内容**根牌池名单 "mainpool_type"**与**卡牌信息 "cards"**。

### 根牌池名单（mainpool_type）

```json
"mainpool_type": 
[
        "UR",
        "SSR",
        "SR",
        "R",
        "N"
],
```

必填项，为叉树主干部分，叉树的初始化创建的依赖。名单内容需要与卡牌信息中的type匹配，如不匹配系统会提示：缺少卡牌' XXX '的配置！

### 卡牌信息（cards)

```json
"cards": 
[
        {
            "type": "UR",
            "awardPool": [
                "西雅图",
                "腓特烈大帝",
                "加斯特涅"
            ],
            "PR": 0.035,
            "PR_Offset": 0.0003,
            "isRare": true
        },
        {
            "type": "SSR",
            "awardPool": [
                "胡德",
                "俾斯麦",
                "圣地亚哥",
                "厌战"
            ],
            "PR": 0.07,
            "PR_Offset": 0.0006,
            "isRare": true
        }
 ]
```

**type：**卡牌名称（类型）。卡牌的唯一标识，被根牌池名单（mainpool_type）与奖励池（awardPool）的内容所识别。演示Demo输出log的表现形式，后期项目开发请增加id将唯一标识与表现区分开。

**awardPool：**奖励池。卡牌的分支名单，系统选中该卡牌后会读取该项的名单，如果内容为空，则停止读取输出卡牌的类型。名单内容需要与卡牌信息中的type匹配，如不匹配系统会提示：缺少卡牌' XXX '的配置！

**PR：**名义概率。系统会按照此项设定的概率对卡牌进行概率读取，要注意的是，如果设定的概率与同辈卡池设定的概率超过100%，系统会提示：卡池中分配的基础概率超过100%。**如设定的概率为0，会被系统自动分配概率。**

**PR_Offset与isRare：**概率补偿机制（PR_Offset设定为0则当前卡牌不会启用该机制）。这是一种保底机制（或惩罚机制），需配合isRare对此机制进行控制。数据重置之前，每抽中isRare为false的卡牌会增加概率补偿值1点，一旦抽中isRare为true的卡牌会把这个概率补偿值归零。每次抽取概率补偿值都会乘以PR_Offset得出最终概率对当前卡牌进行概率扩充（或减少）。也就是说：**实际概率 = 名义概率 + 概率补偿值**。

**其他配置注意事项：**同辈卡池中，请不要全部手动配置名义概率（PR），至少留一种卡牌类型设定概率为0，这样可能会导致概率分配的计算错误。

## 逻辑原理

1. 系统会根据根牌池名单在卡牌信息进行搜寻，并创建出根牌池。目标牌池选中根牌池。
2. 系统会根据目标牌池中的每张卡牌所设定的概率进行概率区间分配。
3. 创建一个0到1的随机数，根据这个随机数落所在的概率区间选中卡牌。
4. 选中卡牌的奖励池如果存在名单，根据名单创建出牌池。目标牌池选中牌池，并循环回步骤2。如果选中卡牌的奖励池为空，记录所走的分支，存入输出名单。



![1566659717633](DrawCard%E6%A6%82%E7%8E%87%E5%8F%89%E6%A0%91%E7%B3%BB%E7%BB%9F.assets/1566659717633.png)
