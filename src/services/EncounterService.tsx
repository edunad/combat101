import { HookSubscription, Hook } from '@edunad/hooks';

import { OverlayService } from './OverlayService';
import { Encounter } from '../models/Encounter';
import { Player } from '../models/Player';

export class EncounterService {
    public static onEncounterUpdate: Hook<Encounter> = new Hook<Encounter>();

    private static onOverlayCombatUpdate: HookSubscription;
    private static currentEncounter: Encounter;

    public static initialize(): void {
        this.currentEncounter = null;
        this.bindObservables();
    }

    public static onDestroy(): void {
        this.unbindObservables();
    }

    private static bindObservables(): void {
        this.onOverlayCombatUpdate = OverlayService.onOverlayCombatUpdate.add('overlayReader', (data: [Encounter, Player[]]) => {
            this.parseData(data);
        });
    }

    private static parseData(data: [Encounter, Player[]]): void {
        if(data == null) return;

        let encounter: Encounter = data[0];
        if(encounter == null) return;

        encounter.setPlayers(data[1]);
        this.currentEncounter = encounter;
        this.onEncounterUpdate.emit(this.currentEncounter);
    }

    private static unbindObservables(): void {
        this.onOverlayCombatUpdate.destroy();
    }
}