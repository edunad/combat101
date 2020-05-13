import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';
import { Player } from '../models/Player';
import { SortPlugin } from '../models/SortDecorator';

@SortPlugin({
    id: 'TOTALDMG',
    groupId: 'DMG',
    icon: 'sword',
    title: 'Total Damage'
})
export class TOTALDMG implements EncounterSortPlugin {
    public getNumberString(ply: Player): string {
        return `${ply.getTotalDamage()} (${ply.getDPS()}, ${ply.getTotalDamage(true)})`;
    }

    public sort(ply: Player[]): Player[] {
        return ply.sort((a: Player, b: Player) => b.getTotalDamage() - a.getTotalDamage());
    }

    public getBarPercent(ply: Player): string {
        return ply.getTotalDamage(true);
    }
}