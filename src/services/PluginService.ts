import { EncounterSortPlugin } from '../interfaces/Sort/EncounterSortPlugin';

declare var __PLUGINS__: string[];
const DEBUG_SERVICE: boolean = true;

export class PluginService {
    private static plugins: { [id: string]: EncounterSortPlugin; } = {};
    private static pluginGroups: { [id: string]: EncounterSortPlugin[]; } = {};

    public static initialize(onLoaded: () => void): void {
        if(__PLUGINS__ == null) throw new Error('[PluginService] Missing __PLUGINS__ on enviroment.. was it correctly built?');

        let pluginCount: number = __PLUGINS__.length;
        let loaded: () => void = () => {
            pluginCount--;
            if(pluginCount <= 0) return onLoaded();
        }

        // Load plugins
        __PLUGINS__.forEach((plugin: string) => {
            import(`../${plugin.replace('./src/','')}`).then((plg: any) => {
                // tslint:disable-next-line:no-unused-expression
                new plg[Object.keys(plg)[0]]();
                loaded();
            });
        });
    }

    public static registerPlugin(plugin: any, id: string): void {
        this.plugins[id] = plugin;
        this.onDebug(`Registered plugin ${id}`);

        // Place plugin on the correct group
        let groupId: string = this.getPluginGroupID(plugin);
        if(this.pluginGroups[groupId] == null) this.pluginGroups[groupId] = [plugin];
        else this.pluginGroups[groupId].push(plugin);
    }

    public static getPlugins(): { [id: string]: EncounterSortPlugin; } {
        return this.plugins;
    }

    public static getPlugin(id: string): EncounterSortPlugin {
        return this.plugins[id];
    }

    public static getPluginByIndex(index: number): EncounterSortPlugin {
        return this.getPlugin(Object.keys(this.plugins)[index]);
    }

    public static getGroups(): { [id: string]: EncounterSortPlugin[]; } {
        return this.pluginGroups;
    }

    private static getPluginGroupID(plugin: EncounterSortPlugin): string {
        let groupId: string = plugin.getGroupID();
        if(groupId == null) groupId = plugin.getID();

        return groupId;
    }

    /**
     * Print a debug message of the service if enabled
     *
     * @param {string} text - the debug message
     * @returns {void}
     */
    private static onDebug(text: string): void {
        if (!DEBUG_SERVICE) return;
        console.debug(`[PluginService] ${text}`);
    }
}