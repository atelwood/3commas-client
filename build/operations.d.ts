import { IBotParams, IBotUpdateParams } from "./interfaces";
declare function getActiveBots(params: IBotParams): Promise<void>;
declare function updateBot(params: IBotUpdateParams): Promise<void>;
declare function getBotInfo(id: number): Promise<void>;
declare function botEnable(id: number): Promise<void>;
declare function getActiveDeals(limit?: number, scope?: string): Promise<void>;
declare const showActiveDeals: () => Promise<void>;
export { getActiveDeals, showActiveDeals, getActiveBots, updateBot, getBotInfo, botEnable };
