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
const operations_1 = require("./operations");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let args = process.argv.slice(2);
        switch (args[0]) {
            case "deals": {
                yield operations_1.getActiveDeals(150, "active");
                yield operations_1.showActiveDeals();
                break;
            }
            case "bots": {
                let params = {
                    scope: "enabled"
                };
                yield operations_1.getActiveBots(params);
                break;
            }
            case "botinfo": {
                let id = parseInt(args[1]);
                yield operations_1.getBotInfo(id);
                break;
            }
            case "botupdate": {
                let filename = args[1];
                let bot_params = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, "..", filename), 'utf8'));
                yield operations_1.updateBot(bot_params);
                break;
            }
            case "botenable": {
                let id = parseInt(args[1]);
                yield operations_1.botEnable(id);
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
    });
}
run();
//# sourceMappingURL=index.js.map