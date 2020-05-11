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
        if(this.data.dps.toString() === '∞') return 0;
        return this.data.dps;
    }

    public getTotalDamage(percent: boolean = false): any {
        return percent ? this.data.damage_perc : this.data.damage_total;
    }

    public getHPS(): number {
        return this.data.hps;
    }

    public getIcon(): string {
        return `./assets/icons/${this.profile.job.id}.png`;
    }
}