import { Hook } from '@edunad/hooks';
import { Menu } from '../enums/Menu';
import { Settings } from '../interfaces/Settings';
import { PluginService } from './PluginService';

export class SettingsService {
    public static onResizeModeUpdate: Hook<boolean> = new Hook<boolean>();
    public static onMenuChange: Hook<Menu> = new Hook<Menu>();
    public static onMinifyChange: Hook<boolean> = new Hook<boolean>();
    public static onSettingsChange: Hook<Settings> = new Hook<Settings>();

    private static resizeMode: boolean = false;
    private static currentMenu: Menu = Menu.DEFAULT;
    private static minifiedMode: boolean = false;

    private static settings: Settings;

    public static initialize(): void {
        let rawSettings: Settings = this.getPersistVar('settings');

        if(rawSettings == null) {
            this.settings = this.defaultSettings();
            this.storeInPersist('settings', this.settings);
        } else {
            this.settings = rawSettings;
        }
    }

    public static save(): void {
        this.storeInPersist('settings', this.settings);
    }

    public static getSettings(): Settings {
        return this.settings;
    }

    public static toggleResizeMode(): void {
        this.setResizeMode(!this.isResizing());
    }

    public static setResizeMode(resize: boolean): void {
        if(this.resizeMode == resize) return;

        this.resizeMode = resize;
        this.onResizeModeUpdate.emit(this.resizeMode);
    }

    public static isResizing(): boolean {
        return this.resizeMode;
    }

    public static isMinified(): boolean {
        return this.minifiedMode;
    }

    public static getCurrentMenu(): Menu {
        return this.currentMenu;
    }

    public static setMenu(menu: Menu): void {
        if(this.currentMenu === menu) return;

        this.currentMenu = menu;
        this.onMenuChange.emit(menu);
    }

    public static setMinifiedMode(minified: boolean): void {
        if(minified === this.minifiedMode) return;

        this.minifiedMode = minified;
        this.onMinifyChange.emit(minified);
    }

    public static storeInPersist(key: string, value: any): void {
        let data: any = this.getPersist();
        if (data == null) data = {};

        data[key] = value;
        localStorage.setItem('persistData', JSON.stringify(data));
    }

    public static getPersistVar(key: string): any {
        let data: any = this.getPersist();
        if (data == null || data[key] == null) return null;
        return data[key];
    }

    private static defaultSettings(): Settings {
        return {
            width: '245px',
            height: '100px',

            selectedSortID: PluginService.getPluginByIndex(0).getID()
        }
    }

    private static getPersist(): any {
        try {
            let rawData: string =  localStorage.getItem('persistData');
            if (rawData == undefined || rawData === '') return null;
            return JSON.parse(rawData);
        } catch (err) {
            console.warn('[PersistData] Malformed data, clearing..');

            localStorage.removeItem('persistData');
            return null;
        }
    }
}