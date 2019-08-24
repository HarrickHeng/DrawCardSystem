//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private result: Array<string>;
    private sorryTxt: Array<string>;
    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        this.result = await RES.getResAsync("description_json");
        this.sorryTxt = await RES.getResAsync("sorrytxt_json");
        this.startAnimation(this.result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;
    private reportLabel: egret.TextField;
    private reportSc: eui.Scroller;
    private reportGrp: eui.Group;
    private dc: Dc = new Dc();

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        let topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);

        let icon: egret.Bitmap = this.createBitmapByName("logo_png");
        this.addChild(icon);
        icon.width = 150;
        icon.height = 130;
        icon.x = 10;
        icon.y = 55;

        let line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        this.addChild(line);

        let colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "抽卡模拟器 V1.0";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        this.addChild(colorLabel);

        this.reportGrp = new eui.Group();
        this.reportGrp.includeInLayout = true;

        this.reportLabel = new egret.TextField();
        this.reportLabel.textColor = 0xffffff;
        this.reportLabel.textAlign = "center";
        this.reportLabel.x = 100;
        this.reportLabel.size = 25;
        this.reportGrp.addChild(this.reportLabel);

        this.reportSc = new eui.Scroller();
        this.reportSc.bounces = true;
        this.reportSc.touchEnabled = true;
        this.reportSc.viewport = this.reportGrp;
        this.reportSc.viewport.scrollV = 0;
        this.reportSc.width = stageW;
        this.reportSc.height = stageH - 200;
        this.reportSc.y = 205;
        this.reportSc.height = 750;
        this.reportSc.addChild(this.reportGrp);
        this.addChild(this.reportSc);

        let textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;

        let button = new eui.Button();
        button.label = "Draw";
        button.horizontalCenter = 10;
        button.verticalCenter = 495;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDcDrawCard, this);

        let resetBtn = new eui.Button();
        resetBtn.label = "Reset";
        resetBtn.horizontalCenter = 115;
        resetBtn.verticalCenter = 495;
        this.addChild(resetBtn);
        resetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDcReset, this);

        let watchBtn = new eui.Button();
        watchBtn.label = "Watch";
        watchBtn.horizontalCenter = 220;
        watchBtn.verticalCenter = 495;
        this.addChild(watchBtn);
        watchBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWatch, this);

        this.tf = new egret.TextField();
        this.tf.type = egret.TextFieldType.INPUT;
        this.tf.background = true;
        this.tf.backgroundColor = 0xB0C4DE;
        this.tf.textColor = 0xffffff;
        this.tf.multiline = true;
        this.tf.width = 220;
        this.tf.height = 50;
        this.tf.text = "点击输入连抽次数";
        this.tf.textAlign = egret.HorizontalAlign.CENTER;
        this.tf.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.tf.size = 23;
        this.tf.x = 45;
        this.tf.y = 1037;
        this.addChild(this.tf);
        this.tf.addEventListener(egret.Event.FOCUS_IN, this.onfocusIn, this);
        this.tf.addEventListener(egret.Event.FOCUS_OUT, this.onfocusOut, this);

        this.dc.initCfg();
    }

    private tf: egret.TextField;

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    private textflowArr;
    private parser: egret.HtmlTextParser;
    private parser_2: egret.HtmlTextParser;
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
        this.parser = new egret.HtmlTextParser();
        this.textflowArr = result.map(text => this.parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= this.textflowArr.length) {
                count = 0;
            }
            let textFlow = this.textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };
        change();
    }

    /**
     * 点击按钮
     * Click the button
     */

    private showlogs(): void {
        if (this.reportLabel.height > this.reportSc.height) {
            this.reportSc.viewport.scrollV = this.reportLabel.height - this.reportSc.height / 2;
        }
        this.reportLabel.text = CardFsm.getInstance().logs;
    }

    private onDcDrawCard(e: egret.TouchEvent) {
        this.dc.drawCard();
        this.showlogs();
    }

    private onDcReset(e: egret.TouchEvent) {
        this.dc.OnReset();
        this.showlogs();
    }

    private onWatch() {
        this.dc.watchMyCards();
        this.showlogs();
    }

    private onfocusIn(e: egret.Event) {
        e.target.text = '';
    }

    private maxAngry: number = 10;
    private angry: number = 0;
    private onfocusOut(e: egret.Event) {
        let rule = /^[\u4e00-\u9fa5_a-zA-Z]+$/;
        if (this.angry < this.maxAngry) {
            //没气炸
            this.dc.serialDraw(e.target.text);
            if (e.target.text == '') {
                e.target.text = '点击输入连抽次数';
            } else if (rule.test(e.target.text)) {
                this.angry++;
                if (this.angry < 5)
                    e.target.text = '请勿输入无效内容';
                else if (this.angry < 6)
                    e.target.text = '别填乱七八糟的东西啊，混蛋！';
                else if (this.angry < 7)
                    e.target.text = 'WDNMD！你还真继续乱填啊？';
                else if (this.angry < 8)
                    e.target.text = '没完了是吧？';
                else if (this.angry < 9)
                    e.target.text = '秋梨膏，再乱搞我就要崩溃了';
                else if (this.angry < 10)
                    e.target.text = '？？？？？';
                else if (this.angry >= this.maxAngry)
                    this.banSerialDraw(e);
            } else {
                e.target.text = `开始${e.target.text}连抽`;
            }
        } else {
            //气炸了
            if (e.target.text == 'sorry' || e.target.text == '对不起') {
                this.angry = 0;
                let tmp = [];
                this.textflowArr = [];
                tmp.push(this.result.map(text => this.parser.parse(text)));
                this.textflowArr = tmp[0];
                e.target.backgroundColor = 0xB0C4DE;
                e.target.text = '好吧，下不为例！'; 0
            } else {
                e.target.text = '输入框已被禁用';
            }
        }
        this.showlogs();
    }

    private banSerialDraw(e: egret.Event): void {
        let tmp = [];
        this.textflowArr = [];
        tmp.push(this.sorryTxt.map(text => this.parser.parse(text)));
        this.textflowArr = tmp[0];
        e.target.text = '输入框已被禁用';
        e.target.backgroundColor = 0xDC143C;
    }
}
