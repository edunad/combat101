import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';
import { Player } from '../models/Player';
import { SortPlugin } from '../models/SortDecorator';

@SortPlugin({
    id: 'TOTALHP',
    icon: 'heal',
    title: 'Total Healing',
    groupId: 'HP'
})
export class TOTALHP implements EncounterSortPlugin {
    public getNumberString(ply: Player): string {
        return `${ply.getTotalHeal()} (${ply.getHPS()}, ${ply.getTotalHeal(true)})`;
    }

    public sort(ply: Player[]): Player[] {
        return ply.sort((a: Player, b: Player) => b.getTotalHeal() - a.getTotalHeal());
    }

    public getBarPercent(ply: Player): string {
        return ply.getTotalHeal(true);
    }
}