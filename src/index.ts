import {botEnable, getActiveBots, getActiveDeals, getBotInfo, showActiveDeals, updateBot} from "./operations"
import {IBotParams, IBotUpdateParams} from "./interfaces";
import fs from "fs";
import path from "path";
import yargs from "yargs";

async function run() {
    let args = process.argv.slice(2);

    switch (args[0]) {
        case "deals": {
            await getActiveDeals(150, "active");
            await showActiveDeals();
            break;
        }
        case "bots": {
            let params = {
                scope: "enabled"
            }
            await getActiveBots(<IBotParams>params);
            break;
        }
        case "botinfo": {
            let id = parseInt(args[1]);
            await getBotInfo(id);
            break;
        }
        case "botupdate": {
            let filename = args[1];
            let bot_params = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", filename), 'utf8'));
            await updateBot(bot_params);
            break;
        }
        case "botenable": {
            let id = parseInt(args[1]);
            await botEnable(id);
            break;
        }
        default:
            console.log("3Commas Client");
            console.log("--------------");
            console.log("deals              \t-- list of current active deals");
            console.log("bots               \t-- list of current active bots");
            console.log("botinfo id         \t-- get info on a bot, requires id");
            console.log("botupdate filename \t-- update a bot, requires a valid json-file in the bots subfolder");
            console.log("botenable id       \t-- enable a disabled bot, requires id");
            break;
    }


}

run();