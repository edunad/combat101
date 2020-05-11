import { EncounterData } from '../interfaces/Encounter/EncounterData';
import { Player } from './Player';
import { EncounterSort } from '../enums/EncounterSort';

export class Encounter {
    private data: EncounterData;
    private players: Player[];
    private currentSortMode: EncounterSort = EncounterSort.SORT_BY_DPS; // TODO: Move this to settings or whatever

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
        this.sortPlayers(this.currentSortMode)
    }

    public sortPlayers(sortMode: EncounterSort): void {
        switch(sortMode) {
            case EncounterSort.SORT_BY_DPS:
                this.players.sort((a: Player, b: Player) => a.getDPS() > b.getDPS() ? 1 : -1);
                break;
            case EncounterSort.SORT_BY_TOTAL_DAMAGE:
                this.players.sort((a: Player, b: Player) => a.getTotalDamage() > b.getTotalDamage() ? 1 : -1);
                break;
            case EncounterSort.SORT_BY_DEFENSE:
                break;
            case EncounterSort.SORT_BY_HEAL:
                break;
        }
    }
}