'use strict';

import * as React from 'react';
import { HookSubscription } from '@edunad/hooks';

import { EncounterSortPlugin } from '../../interfaces/Sort/EncounterSortPlugin';
import { PluginService } from '../../services/PluginService';
import { Icon } from '../Icon/Icon';
import { SchemasService } from '../../services/SchemasService';
import { EncounterService } from '../../services/EncounterService';
import { SettingsService } from '../../services/SettingsService';

interface SettingsState {
    currentSortPlugin: EncounterSortPlugin;
    isMinified: boolean;
}

export class SettingsContainer extends React.Component<any, SettingsState> {
    private onSortUpdate: HookSubscription;
    private onMinifyChange: HookSubscription;

    constructor(props: any) {
        super(props);

        this.state = {
            currentSortPlugin: null,
            isMinified: false
        };
    }

    public componentDidMount(): void {
        this.setState({
            currentSortPlugin: EncounterService.getCurrentSortPlugin(),
            isMinified: SettingsService.isMinified()
        });

        this.subscribeObservables();
    }

    public componentWillUnmount(): void {
        this.unsubscribeObservables();
    }

    private subscribeObservables(): void {
        this.onSortUpdate = EncounterService.onSortUpdate.add('settings-sortUpdate', (data: EncounterSortPlugin) => {
            this.setState({
                currentSortPlugin: data
            });
        });

        this.onMinifyChange = SettingsService.onMinifyChange.add('settings-minifyUpdate', (data: boolean) => {
            this.setState({
                isMinified: data
            });
        });
    }

    private unsubscribeObservables(): void {
        this.onSortUpdate.destroy();
        this.onMinifyChange.destroy();
    }

    private onSortClick(plugin: EncounterSortPlugin): void {
        EncounterService.setPluginSortMode(plugin);
    }

    private buildGroupItems(plugins: EncounterSortPlugin[]): any {
        return plugins.map((plugin: EncounterSortPlugin) => {
            let isActive: boolean = plugin === this.state.currentSortPlugin;

            return(
                <div key={plugin.getID()} className='settings-container-item'>
                    {this.state.isMinified ? null : <div className='settings-container-item-icon'/>}
                    <div
                        onClick={this.onSortClick.bind(this, plugin)}
                        className={`settings-container-item-title ${isActive ? 'active': ''}`}>
                            {plugin.getTitle()}
                    </div>
                </div>
            );
        });
    }

    private buildSettingsGroups(): any {
        let groups: { [id: string]: EncounterSortPlugin[] } = PluginService.getGroups();

        return Object.keys(groups).map((title: string) => {
            let plugins: EncounterSortPlugin[] = groups[title];

            return (
                <div key={title}>
                    <div className='settings-container-group'>
                        <div className='settings-container-group-icon'>
                            <Icon
                                active={true}
                                icon={SchemasService.getIconFromGroup(title)}
                            />
                        </div>
                        <div className='settings-container-group-title'>{title}</div>
                    </div>
                    <div style={{overflow: 'hidden'}}>
                        {this.buildGroupItems(plugins)}
                    </div>
                </div>
            )
        });
    }

    public render(): any {
        return(
            <div className='settings-container'>
                {this.buildSettingsGroups()}
            </div>
        );
    }
}