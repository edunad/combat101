import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';
import { Player } from '../models/Player';
import { SortPlugin } from '../models/SortDecorator';

@SortPlugin({
    id: 'TOTALHP',
    title: 'Total Healing',

    smallTitle: 'HP+',
    groupTitle: 'Health'
})
export class TOTALHP implements EncounterSortPlugin {
    public getNumberString(ply: Player): string {
        return `${this.getTotalHeal(ply)} (${this.getHPS(ply)}, ${this.getTotalHeal(ply, true)})`;
    }

    public sort(ply: Player[]): Player[] {
        return ply.sort((a: Player, b: Player) => this.getTotalHeal(b) - this.getTotalHeal(a));
    }

    public getBarPercent(ply: Player): string {
        return this.getTotalHeal(ply, true);
    }

    private getHPS(ply: Player): number {
        return ply.getDataNumber('ENCHPS');
    }

    private getTotalHeal(ply: Player, percent: boolean = false): any {
        return percent ? ply.getDataString('healed%') : ply.getDataNumber('healed');
    }
}