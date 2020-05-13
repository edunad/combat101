import { EncounterData } from '../interfaces/Encounter/EncounterData';
import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';

import { Player } from './Player';

export class Encounter {
    private data: EncounterData;
    private players: Player[];

    constructor(data: EncounterData) {
        this.data = data;
        this.players = [];
    }

    public getID(): string{
        return this.data.name;
    }

    public updateTime(duration: string): void {
        this.data.duration = duration;
    }

    public getTime(): string {
        return this.data.duration;
    }

    public removePlayer(id: string): void {
        delete this.players[id];
    }

    public setPlayers(plys: Player[]): void {
        this.players = plys;
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public sortPlayers(sortPlugin: EncounterSortPlugin): void {
        if(sortPlugin == null) return;
        sortPlugin.sort(this.players);
    }
}