import { Player } from '../../models/Player';

export interface EncounterSortPlugin {
    getNumberString(ply: Player): string;
    getBarPercent(ply: Player): string;

    sort(ply: Player[]): Player[];

    // INTERNALLY IMPLEMENTED //
    getID?(): string;
    getGroupID?(): string;
    getTitle?(): string;
    getIcon?(): string;
}