import { PlayerData } from '../interfaces/Player/PlayerData';
import { PlayerProfile } from '../interfaces/Player/PlayerProfile';
import { PlayerJob } from '../interfaces/Player/PlayerJob';

export class Player {
    private profile: PlayerProfile;
    private data: any;

    constructor(profile: PlayerProfile) {
        this.profile = profile;
    }

    public isLocalPlayer(): boolean {
       return this.profile.name === 'YOU';
    }

    public updateData(data: any): void {
        this.data = data;
    }

    public updateSingleData(dataId: string, data: any): void {
        this.data[dataId] = data;
    }

    public getName(): string {
        return this.profile.name;
    }

    public getJob(): PlayerJob {
        return this.profile.job;
    }

    public getDataString(id: string): string {
        return this.data[id];
    }

    public getDataNumber(id: string): number {
        let data: number = parseFloat(this.data[id]);
        if(Number.isNaN(data)) data = 0;

        return data;
    }

    public getIcon(): string {
        return `./assets/icons/jobs/${this.profile.job.id}.png`;
    }
}