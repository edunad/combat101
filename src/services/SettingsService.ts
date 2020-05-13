import { Hook } from '@edunad/hooks';

export class SettingsService {
    public static onEditModeUpdate: Hook<boolean> = new Hook<boolean>();
    private static editMode: boolean = false;

    public static toggleEditMode(): void {
        this.editMode = !this.editMode;
        this.onEditModeUpdate.emit(this.editMode);
    }

    public static isEditing(): boolean {
        return this.editMode;
    }
}