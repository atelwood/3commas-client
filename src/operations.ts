// @ts-ignore
import threeCommasAPI from "3commas-api-node"
import fs from "fs"
import path from "path"
import {IBotParams, IBotUpdateParams} from "./interfaces";

require("dotenv").config()

const api = new threeCommasAPI({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET
})

async function getActiveBots(params:IBotParams){
    let data = await api.getBots(params);
    console.log(data);
}
async function updateBot(params:IBotUpdateParams){
    let data = await api.botUpdate(params);
    console.log(data);
}

async function getBotInfo(id:number){
    let data = await api.botShow(id);
    fs.writeFileSync(path.resolve(__dirname, "..", "bots", id+".json"), JSON.stringify(data), "utf8");
    console.log(data);
}
async function botEnable(id:number){
    let result = await api.botEnable(id);
    console.log(result);
}

async function getActiveDeals(limit = 120, scope = "active") {
    let data = await api.getDeals({
        limit,
        scope
    })
    fs.writeFileSync(path.resolve(__dirname, "..", "deals", "deals.txt"), JSON.stringify(data), "utf8");
}

const showActiveDeals = async () => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "deals", "deals.txt"), 'utf8'));
    if (!data) {
        console.error("empty or missing deals.txt")
        process.exit();
    }
    let profit = 0;
    let volume = 0;
    let profitPercentage = 0;
    let count = data.length;
    let deals_negative: Array<any> = [];
    let deals_positive: Array<any> = [];
    data.forEach((d: any) => {
        //console.log(d.pair);
        let current_profit = parseInt(d.actual_usd_profit);
        if (!isNaN(current_profit))
            profit += current_profit;
        let _volume = parseInt(d.bought_volume);
        if (!isNaN(_volume))
            volume += _volume;

        profitPercentage = parseInt(d.actual_profit_percentage);
        if (profitPercentage > 0) {
            deals_positive.push({id: d.id, profitPercentage});
        } else {
            if (profitPercentage < -20)
                deals_negative.push({id: d.id, profitPercentage});
        }
    })
    console.log("---------------")
    console.log("STATS")
    console.log("---------------")
    console.log("Active deals: " + count);
    console.log("Total volume: " + new Intl.NumberFormat().format(volume)+ "$");
    console.log("Total profit: " + new Intl.NumberFormat().format(profit) + "$");

    let closing_deals: any = [];
    let negative_deals: any = [];
    for (const deal of deals_positive) {
        api.getDeal(deal.id)
            .then((deal: any) => {
                closing_deals.push(`${deal.id} \t ${deal.bot_name.substring(20, 0).padEnd(20, " ")} \t ${deal.pair} \t ${deal.usd_final_profit}$`);
            })
            .catch((err: any) => {
                console.error(err);
            })
    }

    for (const _deal of deals_negative) {
        await api.getDeal(_deal.id)
            .then((deal: any) => {
                //if (_deal.profitPercentage < -10)
                negative_deals.push(`${deal.id} \t ${deal.bot_name.substring(20, 0).padEnd(20, " ")} \t ${deal.pair} \t ${deal.usd_final_profit}$`);

            })
            .catch((err: any) => {
                console.error(err);
            })
    }

    console.log("\nPay attention to these deals");
    negative_deals.forEach((deal: any) => console.log(deal))
    console.log("\nDeals about to close");
    closing_deals.forEach((deal: any) => console.log(deal))
}



export {
    getActiveDeals,
    showActiveDeals,
    getActiveBots,
    updateBot,
    getBotInfo,
    botEnable
}