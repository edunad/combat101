export interface PlayerData {
    dps: number;
    damage_perc: string;
    damage_total: number;

    deaths: number;

    max_heal_perc: string;
    max_heal: number;
    hps: number;

    damage_blocked: number;
    damage_blocked_perc: string;

    threat: string;
    threat_delta:number;
}