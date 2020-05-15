import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';
import { Player } from '../models/Player';
import { SortPlugin } from '../models/SortDecorator';

@SortPlugin({
    id: 'HPS',
    title: 'Heal per second',
    smallTitle: 'HP/s',
    groupTitle: 'Health'
})
export class HPS implements EncounterSortPlugin {
    public getNumberString(ply: Player): string {
        return `${this.getHPS(ply)}`;
    }

    public sort(ply: Player[]): Player[] {
        return ply.sort((a: Player, b: Player) => this.getHPS(b) - this.getHPS(a));
    }

    public getBarPercent(ply: Player): string {
        return ply.getDataString('hps_perc');
    }

    private getHPS(ply: Player): number {
        return ply.getDataNumber('ENCHPS');
    }
}