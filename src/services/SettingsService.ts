import { Hook } from '@edunad/hooks';
import { Menu } from '../enums/Menu';

export class SettingsService {
    public static onResizeModeUpdate: Hook<boolean> = new Hook<boolean>();
    public static onMenuChange: Hook<Menu> = new Hook<Menu>();
    public static onMinifyChange: Hook<boolean> = new Hook<boolean>();

    private static resizeMode: boolean = false;
    private static currentMenu: Menu = Menu.DEFAULT;
    private static minifiedMode: boolean = false;

    public static toggleResizeMode(): void {
        this.resizeMode = !this.resizeMode;
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
}