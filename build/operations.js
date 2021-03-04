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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.botEnable = exports.getBotInfo = exports.updateBot = exports.getActiveBots = exports.showActiveDeals = exports.getActiveDeals = void 0;
// @ts-ignore
const _3commas_api_node_1 = __importDefault(require("3commas-api-node"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
require("dotenv").config();
const api = new _3commas_api_node_1.default({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET
});
function getActiveBots(params) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield api.getBots(params);
        console.log(data);
    });
}
exports.getActiveBots = getActiveBots;
function updateBot(params) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield api.botUpdate(params);
        console.log(data);
    });
}
exports.updateBot = updateBot;
function getBotInfo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield api.botShow(id);
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, "..", "bots", id + ".json"), JSON.stringify(data), "utf8");
        console.log(data);
    });
}
exports.getBotInfo = getBotInfo;
function botEnable(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield api.botEnable(id);
        console.log(result);
    });
}
exports.botEnable = botEnable;
function getActiveDeals(limit = 120, scope = "active") {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield api.getDeals({
            limit,
            scope
        });
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, "..", "deals", "deals.txt"), JSON.stringify(data), "utf8");
    });
}
exports.getActiveDeals = getActiveDeals;
const showActiveDeals = () => __awaiter(void 0, void 0, void 0, function* () {
    let data = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, "..", "deals", "deals.txt"), 'utf8'));
    if (!data) {
        console.error("empty or missing deals.txt");
        process.exit();
    }
    let profit = 0;
    let volume = 0;
    let profitPercentage = 0;
    let count = data.length;
    let deals_negative = [];
    let deals_positive = [];
    data.forEach((d) => {
        //console.log(d.pair);
        let current_profit = parseInt(d.actual_usd_profit);
        if (!isNaN(current_profit))
            profit += current_profit;
        let _volume = parseInt(d.bought_volume);
        if (!isNaN(_volume))
            volume += _volume;
        profitPercentage = parseInt(d.actual_profit_percentage);
        if (profitPercentage > 0) {
            deals_positive.push({ id: d.id, profitPercentage });
        }
        else {
            if (profitPercentage < -20)
                deals_negative.push({ id: d.id, profitPercentage });
        }
    });
    console.log("---------------");
    console.log("STATS");
    console.log("---------------");
    console.log("Active deals: " + count);
    console.log("Total volume: " + new Intl.NumberFormat().format(volume) + "$");
    console.log("Total profit: " + new Intl.NumberFormat().format(profit) + "$");
    let closing_deals = [];
    let negative_deals = [];
    for (const deal of deals_positive) {
        api.getDeal(deal.id)
            .then((deal) => {
            closing_deals.push(`${deal.id} \t ${deal.bot_name.substring(20, 0).padEnd(20, " ")} \t ${deal.pair} \t ${deal.usd_final_profit}$`);
        })
            .catch((err) => {
            console.error(err);
        });
    }
    for (const _deal of deals_negative) {
        yield api.getDeal(_deal.id)
            .then((deal) => {
            //if (_deal.profitPercentage < -10)
            negative_deals.push(`${deal.id} \t ${deal.bot_name.substring(20, 0).padEnd(20, " ")} \t ${deal.pair} \t ${deal.usd_final_profit}$`);
        })
            .catch((err) => {
            console.error(err);
        });
    }
    console.log("\nPay attention to these deals");
    negative_deals.forEach((deal) => console.log(deal));
    console.log("\nDeals about to close");
    closing_deals.forEach((deal) => console.log(deal));
});
exports.showActiveDeals = showActiveDeals;
//# sourceMappingURL=operations.js.map