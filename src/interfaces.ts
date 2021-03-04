export interface IBotParams {
    limit?: number;
    offset?: number;
    account_id?: number;
    scope: "enabled" | "disabled";
    strategy?: "long" | "short";
}
export interface IBotUpdateParams {
    bot_id: number;
    name?: string;
    type?: string;
    pairs: string;
    max_active_deals?: number;
    base_order_volume: number;
    base_order_volume_type?: string;
    take_profit: number;
    safety_order_volume: number;
    safety_order_volume_type?: string;
    martingale_volume_coefficient: number;
    martingale_step_coefficient: number;
    max_safety_orders: number;
    active_safety_orders_count: number;
    stop_loss_percentage?: number;
    cooldown?: number;
    trailing_enabled?: boolean;
    trailing_deviation?: number;
    btc_price_limit?: number;
    safety_order_step_percentage: number;
    take_profit_type: string;
    strategy_list: Array<any>;
}