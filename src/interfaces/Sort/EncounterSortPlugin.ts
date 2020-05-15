import { Player } from '../../models/Player';

export interface EncounterSortPlugin {
    getNumberString(ply: Player): string;
    getBarPercent(ply: Player): string;

    sort(ply: Player[]): Player[];

    // INTERNALLY IMPLEMENTED //
    getID?(): string;
    getTitle?(): string;
    getGroupTitle?(): string;
    getSmallTitle?(): string;
}