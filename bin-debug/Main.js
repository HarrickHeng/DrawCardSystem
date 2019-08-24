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
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dc = new Dc();
        _this.maxAngry = 10;
        _this.angry = 0;
        return _this;
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, userInfo;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _c.sent();
                        this.createGameScene();
                        _a = this;
                        return [4 /*yield*/, RES.getResAsync("description_json")];
                    case 2:
                        _a.result = _c.sent();
                        _b = this;
                        return [4 /*yield*/, RES.getResAsync("sorrytxt_json")];
                    case 3:
                        _b.sorryTxt = _c.sent();
                        this.startAnimation(this.result);
                        return [4 /*yield*/, platform.login()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, platform.getUserInfo()];
                    case 5:
                        userInfo = _c.sent();
                        console.log(userInfo);
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadTheme()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 3:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    /**
     * 创建场景界面
     * Create scene interface
     */
    Main.prototype.createGameScene = function () {
        var sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);
        var icon = this.createBitmapByName("logo_png");
        this.addChild(icon);
        icon.width = 150;
        icon.height = 130;
        icon.x = 10;
        icon.y = 55;
        var line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        this.addChild(line);
        var colorLabel = new egret.TextField();
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
        var textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
        var button = new eui.Button();
        button.label = "Draw";
        button.horizontalCenter = 10;
        button.verticalCenter = 495;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDcDrawCard, this);
        var resetBtn = new eui.Button();
        resetBtn.label = "Reset";
        resetBtn.horizontalCenter = 115;
        resetBtn.verticalCenter = 495;
        this.addChild(resetBtn);
        resetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDcReset, this);
        var watchBtn = new eui.Button();
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
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    Main.prototype.startAnimation = function (result) {
        var _this = this;
        this.parser = new egret.HtmlTextParser();
        this.textflowArr = result.map(function (text) { return _this.parser.parse(text); });
        var textfield = this.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= _this.textflowArr.length) {
                count = 0;
            }
            var textFlow = _this.textflowArr[count];
            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, _this);
        };
        change();
    };
    /**
     * 点击按钮
     * Click the button
     */
    Main.prototype.showlogs = function () {
        if (this.reportLabel.height > this.reportSc.height) {
            this.reportSc.viewport.scrollV = this.reportLabel.height - this.reportSc.height / 2;
        }
        this.reportLabel.text = CardFsm.getInstance().logs;
    };
    Main.prototype.onDcDrawCard = function (e) {
        this.dc.drawCard();
        this.showlogs();
    };
    Main.prototype.onDcReset = function (e) {
        this.dc.OnReset();
        this.showlogs();
    };
    Main.prototype.onWatch = function () {
        this.dc.watchMyCards();
        this.showlogs();
    };
    Main.prototype.onfocusIn = function (e) {
        e.target.text = '';
    };
    Main.prototype.onfocusOut = function (e) {
        var _this = this;
        var rule = /^[\u4e00-\u9fa5_a-zA-Z]+$/;
        if (this.angry < this.maxAngry) {
            //没气炸
            this.dc.serialDraw(e.target.text);
            if (e.target.text == '') {
                e.target.text = '点击输入连抽次数';
            }
            else if (rule.test(e.target.text)) {
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
            }
            else {
                e.target.text = "\u5F00\u59CB" + e.target.text + "\u8FDE\u62BD";
            }
        }
        else {
            //气炸了
            if (e.target.text == 'sorry' || e.target.text == '对不起') {
                this.angry = 0;
                var tmp = [];
                this.textflowArr = [];
                tmp.push(this.result.map(function (text) { return _this.parser.parse(text); }));
                this.textflowArr = tmp[0];
                e.target.backgroundColor = 0xB0C4DE;
                e.target.text = '好吧，下不为例！';
                0;
            }
            else {
                e.target.text = '输入框已被禁用';
            }
        }
        this.showlogs();
    };
    Main.prototype.banSerialDraw = function (e) {
        var _this = this;
        var tmp = [];
        this.textflowArr = [];
        tmp.push(this.sorryTxt.map(function (text) { return _this.parser.parse(text); }));
        this.textflowArr = tmp[0];
        e.target.text = '输入框已被禁用';
        e.target.backgroundColor = 0xDC143C;
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map