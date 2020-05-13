import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';
import { Player } from '../models/Player';
import { SortPlugin } from '../models/SortDecorator';

@SortPlugin({
    id: 'DTAKEN',
    icon: 'shield',
    title: 'Damage Taken'
})
export class DTAKEN implements EncounterSortPlugin {
    public getNumberString(ply: Player): string {
        return `${ply.getTotalDamageBlocked()} (${ply.getTotalDamageBlocked(true)})`;
    }

    public sort(ply: Player[]): Player[] {
        return ply.sort((a: Player, b: Player) => b.getDTAKEN() - a.getDTAKEN());
    }

    public getBarPercent(ply: Player): string {
        return ply.getTotalDamageBlocked(true);
    }
}