export interface PlayerData {
    // DAMAGE PER SECOND
    dps: number;
    dps_perc: string;
    // ------------

    // TOTAL DAMAGE
    damage_perc: string;
    damage_total: number;
    // ------------

    deaths: number;

    // TOTAL HEAl
    max_heal_perc: string;
    max_heal: number;
    // ------------

    // HEAl PER SECOND
    hps: number;
    hps_perc: string;
    // ------------

    // TOTAL DAMAGE BLOCKED
    damage_blocked: number;
    damage_blocked_perc: string;
    // ------------

    // OTHER
    threat: string;
    threat_delta:number;
    // ------------
}