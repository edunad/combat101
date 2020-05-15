import { Hook } from '@edunad/hooks';
import { Menu } from '../enums/Menu';
import { Settings } from '../interfaces/Settings';
import { PluginService } from './PluginService';

const SAVE_VERSION: string = '1.0.0';

export class SettingsService {
    public static MINIFIED_WIDTH: number = 160;

    public static onResizeModeUpdate: Hook<boolean> = new Hook<boolean>();
    public static onMenuChange: Hook<Menu> = new Hook<Menu>();
    public static onMinifyChange: Hook<boolean> = new Hook<boolean>();
    public static onSettingsChange: Hook<Settings> = new Hook<Settings>();
    public static onOrientationChange: Hook<boolean> = new Hook<boolean>();

    private static resizeMode: boolean = false;
    private static currentMenu: Menu = Menu.DEFAULT;

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

    public static toggleOrientation(): void {
        this.setOrientationInverted(!this.isOrientationInverted());
    }

    public static setOrientationInverted(inverted: boolean): void {
        if(this.settings.orientationInverted == inverted) return;
        this.settings.orientationInverted = inverted;
        this.save();

        this.onOrientationChange.emit(inverted);
    }

    public static isOrientationInverted(): boolean {
        return this.settings.orientationInverted;
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
        return (parseFloat(this.settings.width.replace('px', '')) <= this.MINIFIED_WIDTH);
    }

    public static getCurrentMenu(): Menu {
        return this.currentMenu;
    }

    public static setMenu(menu: Menu): void {
        if(this.currentMenu === menu) return;

        this.currentMenu = menu;
        this.onMenuChange.emit(menu);
    }

    public static updateAppWidth(): void {
        let oldMinify: boolean = this.isMinified();
        SettingsService.getSettings().width = window['app-element'].style.width;

        if(this.isMinified() != oldMinify) {
            this.onMinifyChange.emit(!oldMinify);
        }
    }

    public static storeInPersist(key: string, value: any): void {
        let data: any = this.getPersist();
        if (data == null) data = {};

        data[key] = value;
        localStorage.setItem(`persistData_${SAVE_VERSION}`, JSON.stringify(data));
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
            orientationInverted: false,

            selectedSortID: PluginService.getPluginByIndex(0).getID()
        }
    }

    private static getPersist(): any {
        try {
            let rawData: string =  localStorage.getItem(`persistData_${SAVE_VERSION}`);
            if (rawData == undefined || rawData === '') return null;
            return JSON.parse(rawData);
        } catch (err) {
            console.warn('[SettingsService] Malformed data, clearing..');

            localStorage.removeItem(`persistData_${SAVE_VERSION}`);
            return null;
        }
    }
}