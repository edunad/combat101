'use strict';

import * as React from 'react';

import { Encounter } from '../../models/Encounter';
import { EncounterSortPlugin } from '../../interfaces/Sort/EncounterSortPlugin';
import { PluginService } from '../../services/PluginService';
import { EncounterService } from '../../services/EncounterService';
import { NavbarButton } from '../NavbarButton/NavbarButton';
import { SettingsService } from '../../services/SettingsService';

interface NavbarProps {
    currentSortPlugin: EncounterSortPlugin;
    currentEncounter: Encounter;

    isEditing: boolean;
}

export class Navbar extends React.Component<NavbarProps> {
    constructor(props: NavbarProps) {
        super(props);
    }

    private getTime(): string {
        if(this.props.currentEncounter == null) return '00:00';
        return this.props.currentEncounter.getTime();
    }

    private getZoneID(): string {
        if(this.props.currentEncounter == null) return 'Unknown';
        return this.props.currentEncounter.getID();
    }

    private getPluginTitle(): string {
        if(this.props.currentSortPlugin == null) return 'Unknown';
        return this.props.currentSortPlugin.getTitle();
    }

    private onSortClick(plugin: EncounterSortPlugin): void {
        EncounterService.setPluginSortMode(plugin.getID());
    }

    private drawGroups(plugins: EncounterSortPlugin[]): any {
        return plugins.map((plugin: EncounterSortPlugin) => {
            return (
                <NavbarButton
                    key={plugin.getID()}
                    active={plugin === this.props.currentSortPlugin}
                    icon={plugin.getIcon()}
                    onClick={this.onSortClick.bind(this, plugin)}
                />
            );
        });
    }

    private drawTools(): any {
        let groups: { [id: string]: EncounterSortPlugin[]; } = PluginService.getGroups();

        return Object.keys(groups).map((groupID: string) => {
            let group: EncounterSortPlugin[] = groups[groupID];
            if(group == null) return;

            return (
                <div className='navbar-sub-group' key={groupID}>
                    {this.drawGroups(group)}
                </div>
            );
        });
    }

    private toggleSettings(): void {
        SettingsService.toggleEditMode();
    }

    private drawSettings(): any {
        return (
            <NavbarButton
                active={this.props.isEditing}
                icon={'icon-config'}
                onClick={this.toggleSettings}
            />
        );
    }

    /**
     * React render method
     *
     * @returns {any}
     */
    public render(): any {
        return(
            <>
                <div className='navbar-container'>
                    <div className='navbar-title'>[{this.getTime()}] - {this.getZoneID()}</div>
                    <div className='navbar-mode'>{this.getPluginTitle()}</div>
                </div>

                <div className='navbar-sub-container'>
                    <div className='navbar-sub-splitter'/>
                    <div className='navbar-sub-toolbar-reverse'>
                        {this.drawTools()}
                    </div>
                    <div className='navbar-sub-toolbar'>
                        {this.drawSettings()}
                    </div>
                </div>
            </>
        );
    }
}