"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var mongoose_1 = require("mongoose");
var telegraf_1 = require("telegraf");
var node_cron_1 = __importDefault(require("node-cron"));
require("dotenv").config();
// dotenv.config();
var BOT_TOKEN = process.env.BOT_TOKEN || "839609997:AAF8U9Mzbz47mM-RdInZ1oghk361w1YEIaw";
var Currencies;
(function (Currencies) {
    Currencies[Currencies["usd"] = 0] = "usd";
    Currencies[Currencies["euro"] = 1] = "euro";
    Currencies[Currencies["rub"] = 2] = "rub";
})(Currencies || (Currencies = {}));
var group_id = process.env.GROUP_ID || '-567259948';
// console.log(BOT_TOKEN);
var bot = new telegraf_1.Telegraf(BOT_TOKEN);
function getRate() {
    return __awaiter(this, void 0, void 0, function () {
        var data, result, prices, diffPercent, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("https://cbu.uz/uz/arkhiv-kursov-valyut/json/")];
                case 1:
                    data = (_a.sent()).data;
                    result = {
                        usd: data[Currencies.usd],
                        euro: data[Currencies.euro],
                        rub: data[Currencies.rub],
                    };
                    prices = {
                        usd: parseFloat(result.usd.Rate),
                        euro: parseFloat(result.euro.Rate),
                        rub: parseFloat(result.rub.Rate),
                        oldUsd: parseFloat(result.usd.Rate) - parseFloat(result.usd.Diff),
                        oldEuro: parseFloat(result.euro.Rate) - parseFloat(result.euro.Diff),
                        oldRub: parseFloat(result.rub.Rate) - parseFloat(result.rub.Diff),
                    };
                    diffPercent = {
                        usd: (((prices.usd - prices.oldUsd) / prices.oldUsd) * 100).toPrecision(3) +
                            "%",
                        euro: (((prices.euro - prices.oldEuro) / prices.oldEuro) * 100).toPrecision(3) + "%",
                        rub: (((prices.rub - prices.oldRub) / prices.oldRub) * 100).toPrecision(3) +
                            "%",
                    };
                    return [2 /*return*/, { prices: prices, diffPercent: diffPercent }];
                case 2:
                    e_1 = _a.sent();
                    throw new mongoose_1.Error("Catch error");
                case 3: return [2 /*return*/];
            }
        });
    });
}
node_cron_1.default.schedule("00 00 09 * * * ", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, prices, diffPercent, res;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getRate()];
            case 1:
                _a = _b.sent(), prices = _a.prices, diffPercent = _a.diffPercent;
                res = "\n  1.\uD83D\uDCB5 USD: " + prices.usd + " \n      Diff(" + diffPercent.usd + ") \n  2.\uD83D\uDCB6 EURO: " + prices.euro + "\n      Diff(" + diffPercent.euro + ")\n  3.\uD83D\uDCB4 RUB: " + prices.rub + "\n      Diff(" + diffPercent.rub + ")\n      ";
                bot.telegram.sendMessage(group_id, "<code>" + res + "</code>", { parse_mode: 'HTML' });
                return [2 /*return*/];
        }
    });
}); });
bot.start(function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, prices, diffPercent, res;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getRate()];
            case 1:
                _a = _b.sent(), prices = _a.prices, diffPercent = _a.diffPercent;
                res = "\n  1.\uD83D\uDCB5 USD: " + prices.usd + " \n      Diff(" + diffPercent.usd + ") \n  2.\uD83D\uDCB6 EURO: " + prices.euro + "\n      Diff(" + diffPercent.euro + ")\n  3.\uD83D\uDCB4 RUB: " + prices.rub + "\n      Diff(" + diffPercent.rub + ")\n      ";
                ctx.replyWithHTML("<code> " + res + " </code>");
                return [2 /*return*/];
        }
    });
}); });
bot.help(function (ctx) { return ctx.reply("Send me a sticker"); });
bot.on("sticker", function (ctx) { return ctx.reply("👍"); });
bot.hears("hi", function (ctx) { return ctx.reply("Hey there"); });
bot.launch();
