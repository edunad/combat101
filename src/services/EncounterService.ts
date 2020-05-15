import { HookSubscription, Hook } from '@edunad/hooks';

import { OverlayService } from './OverlayService';
import { PluginService } from './PluginService';

import { Encounter } from '../models/Encounter';
import { Player } from '../models/Player';
import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';
import { SettingsService } from './SettingsService';

export class EncounterService {
    public static onEncounterUpdate: Hook<Encounter> = new Hook<Encounter>();
    public static onSortUpdate: Hook<EncounterSortPlugin> = new Hook<EncounterSortPlugin>();

    private static onOverlayCombatUpdate: HookSubscription;
    private static currentEncounter: Encounter;
    private static currentSortPlugin: EncounterSortPlugin;

    public static initialize(): void {
        let savedID: string = SettingsService.getSettings().selectedSortID;
        let plugin: EncounterSortPlugin = PluginService.getPlugin(savedID);

        if(plugin == null) plugin = PluginService.getPluginByIndex(0);
        this.currentSortPlugin = plugin;

        this.saveCurrentSort();
        this.bindObservables();
    }

    public static onDestroy(): void {
        this.unbindObservables();
    }

    public static setPluginSortMode(plugin: EncounterSortPlugin): void {
        if(plugin == null || plugin === this.currentSortPlugin) return;

        this.currentSortPlugin = plugin;

        this.updateEncounter();
        this.saveCurrentSort();
        this.onSortUpdate.emit(this.currentSortPlugin);
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

    private static saveCurrentSort(): void {
        SettingsService.getSettings().selectedSortID = this.currentSortPlugin.getID();
        SettingsService.save();
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
        this.onEncounterUpdate.emit(this.currentEncounter);
    }

    private static unbindObservables(): void {
        this.onOverlayCombatUpdate.destroy();
    }
}