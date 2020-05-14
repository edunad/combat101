import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';
import { Player } from '../models/Player';
import { SortPlugin } from '../models/SortDecorator';

@SortPlugin({
    id: 'DTAKEN',
    title: 'Damage Taken',

    groupTitle: 'Defense'
})
export class DTAKEN implements EncounterSortPlugin {
    public getNumberString(ply: Player): string {
        return `${this.getTotalDamageTaken(ply)} (${this.getTotalDamageTaken(ply, true)})`;
    }

    public sort(ply: Player[]): Player[] {
        return ply.sort((a: Player, b: Player) => this.getDMGBLCK(b) - this.getDMGBLCK(a));
    }

    public getBarPercent(ply: Player): string {
        return this.getTotalDamageTaken(ply, true);
    }

    private getTotalDamageTaken(ply: Player, percent: boolean = false): any {
        return percent ? ply.getDataString('BlockPct') : this.getDMGBLCK(ply); // TODO: FIX
    }

    private getDMGBLCK(ply: Player): number {
        return ply.getDataNumber('damageShield');
    }
}