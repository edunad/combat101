import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';
import { Player } from '../models/Player';
import { SortPlugin } from '../models/SortDecorator';

@SortPlugin({
    id: 'TOTALDMG',
    title: 'Total Damage',
    smallTitle: 'DMG+',
    groupTitle: 'Damage'
})
export class TOTALDMG implements EncounterSortPlugin {
    public getNumberString(ply: Player): string {
        return `${this.getTotalDamage(ply)} (${this.getDPS(ply)}, ${this.getTotalDamage(ply, true)})`;
    }

    public sort(ply: Player[]): Player[] {
        return ply.sort((a: Player, b: Player) => this.getTotalDamage(b) - this.getTotalDamage(a));
    }

    public getBarPercent(ply: Player): string {
        return this.getTotalDamage(ply, true);
    }

    private getDPS(ply: Player): number {
        return ply.getDataNumber('encdps');
    }

    private getTotalDamage(ply: Player, percent: boolean = false): any {
        return percent ? ply.getDataString('damage%') : ply.getDataNumber('damage');
    }
}