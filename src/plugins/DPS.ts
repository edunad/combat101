import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';
import { Player } from '../models/Player';
import { SortPlugin } from '../models/SortDecorator';

@SortPlugin({
    id: 'DPS',
    groupId: 'DMG',
    icon: 'sword_s',
    title: 'Damage per second'
})
export class DPS implements EncounterSortPlugin {
    public getNumberString(ply: Player): string {
        return `${ply.getDPS()}`;
    }

    public sort(ply: Player[]): Player[] {
        return ply.sort((a: Player, b: Player) => b.getDPS() - a.getDPS());
    }

    public getBarPercent(ply: Player): string {
        return ply.getZoneDPSPercent();
    }
}