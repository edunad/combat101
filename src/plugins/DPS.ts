import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';
import { Player } from '../models/Player';
import { SortPlugin } from '../models/SortDecorator';

@SortPlugin({
    id: 'DPS',
    title: 'Damage per second',

    groupTitle: 'Damage'
})
export class DPS implements EncounterSortPlugin {
    public getNumberString(ply: Player): string {
        return `${this.getDPS(ply)}`;
    }

    public sort(ply: Player[]): Player[] {
        return ply.sort((a: Player, b: Player) => this.getDPS(b) - this.getDPS(a));
    }

    public getBarPercent(ply: Player): string {
        return ply.getDataString('dps_perc');
    }

    private getDPS(ply: Player): number {
        return ply.getDataNumber('dps');
    }
}