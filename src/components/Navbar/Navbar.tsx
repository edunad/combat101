'use strict';

import * as React from 'react';

import { Encounter } from '../../models/Encounter';
import { EncounterSortPlugin } from '../../interfaces/Sort/EncounterSortPlugin';
import { PluginService } from '../../services/PluginService';
import { EncounterService } from '../../services/EncounterService';

interface NavbarProps {
    currentSortPlugin: EncounterSortPlugin;
    currentEncounter: Encounter;
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
            let icon: string = `./assets/icons/ui/${plugin.getIcon()}.png`;

            return (
                <img
                    key={plugin.getID()}
                    className={`navbar-sub-tool ${plugin === this.props.currentSortPlugin ? 'active' : ''}`}
                    onClick={this.onSortClick.bind(this, plugin)}
                    src={icon}
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
                    <div className='navbar-sub-toolbar'>
                        {this.drawTools()}
                    </div>
                </div>
            </>
        );
    }
}