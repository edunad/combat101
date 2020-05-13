import { PlayerData } from '../interfaces/Player/PlayerData';
import { PlayerProfile } from '../interfaces/Player/PlayerProfile';
import { PlayerJob } from '../interfaces/Player/PlayerJob';

export class Player {
    private profile: PlayerProfile;
    private data: PlayerData;

    constructor(profile: PlayerProfile) {
        this.profile = profile;
    }

    public isLocalPlayer(): boolean {
       return this.profile.name === 'YOU';
    }

    public updateData(data: PlayerData): void {
        this.data = data;
    }

    public getName(): string {
        return this.profile.name;
    }

    public getJob(): PlayerJob {
        return this.profile.job;
    }

    public getDPS(): number {
        if(Number.isNaN(this.data.dps)) return 0;
        return parseFloat(this.data.dps.toString());
    }

    public getDTAKEN(): number {
        if(Number.isNaN(this.data.damage_blocked)) return 0;
        return this.data.damage_blocked;
    }

    public getHPS(): number {
        if(Number.isNaN(this.data.hps)) return 0;
        return this.data.hps;
    }

    public getTotalDamageBlocked(percent: boolean = false): any {
        return percent ? this.data.damage_blocked_perc : this.data.damage_blocked;
    }

    public getTotalHeal(percent: boolean = false): any {
        return percent ? this.data.max_heal_perc : this.data.max_heal;
    }

    public getZoneDPSPercent(): string {
        return this.data.dps_perc;
    }

    public getZoneHPSPercent(): string {
        return this.data.hps_perc;
    }

    public getTotalDamage(percent: boolean = false): any {
        return percent ? this.data.damage_perc : this.data.damage_total;
    }

    public getIcon(): string {
        return `./assets/icons/jobs/${this.profile.job.id}.png`;
    }

    public setZoneHPSPercent(percent: number): void {
        this.data.hps_perc = `${percent}%`;
    }

    public setZoneDPSPercent(percent: number): void {
        this.data.dps_perc = `${percent}%`;
    }
}