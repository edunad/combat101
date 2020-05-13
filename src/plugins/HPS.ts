import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';
import { Player } from '../models/Player';
import { SortPlugin } from '../models/SortDecorator';

@SortPlugin({
    id: 'HPS',
    icon: 'heal_s',
    title: 'Heal per second',
    groupId: 'HP'
})
export class HPS implements EncounterSortPlugin {
    public getNumberString(ply: Player): string {
        return `${ply.getHPS()}`;
    }

    public sort(ply: Player[]): Player[] {
        return ply.sort((a: Player, b: Player) => b.getHPS() - a.getHPS());
    }

    public getBarPercent(ply: Player): string {
        return ply.getZoneHPSPercent();
    }
}