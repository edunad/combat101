import { HookSubscription, Hook } from '@edunad/hooks';

import { OverlayService } from './OverlayService';
import { PluginService } from './PluginService';

import { Encounter } from '../models/Encounter';
import { Player } from '../models/Player';
import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';

export class EncounterService {
    public static onEncounterUpdate: Hook<Encounter> = new Hook<Encounter>();
    public static onSortUpdate: Hook<EncounterSortPlugin> = new Hook<EncounterSortPlugin>();

    private static onOverlayCombatUpdate: HookSubscription;
    private static currentEncounter: Encounter;
    private static currentSortPlugin: EncounterSortPlugin;

    public static initialize(): void {
        this.currentEncounter = null;
        this.currentSortPlugin = Object.values(PluginService.getPlugins())[0]; // Todo: Load from save

        this.bindObservables();
    }

    public static onDestroy(): void {
        this.unbindObservables();
    }

    public static setPluginSortMode(id: string): void {
        this.currentSortPlugin = PluginService.getPlugin(id);

        this.updateEncounter();
        this.onSortUpdate.emit(this.currentSortPlugin);
    }

    public static calculateEncounterDPS(): Player[] {
        if(this.currentEncounter == null) return null;

        let plys: Player[] = this.currentEncounter.getPlayers();
        if(plys == null) return null;

        let totalDPSZoneDamage: number = plys.map(pl => pl.getDPS()).reduce((a:number, b:number) => a + b);
        plys.forEach((ply: Player) => {
            ply.setZoneDPSPercent((ply.getDPS() * 100) / totalDPSZoneDamage);
        });
    }

    public static calculateEncounterHPS(): Player[] {
        if(this.currentEncounter == null) return null;

        let plys: Player[] = this.currentEncounter.getPlayers();
        if(plys == null) return null;

        let totalHPSZoneDamage: number = plys.map(pl => pl.getHPS()).reduce((a:number, b:number) => a + b);
        plys.forEach((ply: Player) => {
            ply.setZoneHPSPercent((ply.getHPS() * 100) / totalHPSZoneDamage);
        });
    }

    public static getCurrentEncounter(): Encounter {
        return this.currentEncounter;
    }

    public static getCurrentSortPlugin(): EncounterSortPlugin {
        return this.currentSortPlugin;
    }

    public static getLocalPlayer(): [Player, number] {
        let found: [Player, number] = null;

        if(this.currentEncounter == null) return found;
        this.currentEncounter.getPlayers().forEach((ply: Player, indx: number) => {
            if(ply.isLocalPlayer()) found = [ply, indx];
        });

        return found;
    }

    private static updateEncounter(): void {
        if(this.currentEncounter == null) return;

        this.currentEncounter.sortPlayers(this.currentSortPlugin);
        this.onEncounterUpdate.emit(this.currentEncounter);
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
        encounter.sortPlayers(this.currentSortPlugin);

        this.currentEncounter = encounter;

         // Extra calculations
        this.calculateEncounterDPS();
        this.calculateEncounterHPS();
        // ------

        this.onEncounterUpdate.emit(this.currentEncounter);
    }

    private static unbindObservables(): void {
        this.onOverlayCombatUpdate.destroy();
    }
}