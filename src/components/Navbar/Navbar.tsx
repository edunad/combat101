'use strict';

import * as React from 'react';
import { HookSubscription } from '@edunad/hooks';

import { Encounter } from '../../models/Encounter';
import { EncounterSortPlugin } from '../../interfaces/Sort/EncounterSortPlugin';
import { Icon } from '../Icon/Icon';
import { SettingsService } from '../../services/SettingsService';
import { Menu } from '../../enums/Menu';
import { EncounterService } from '../../services/EncounterService';
import { SchemasService } from '../../services/SchemasService';

interface NavbarProps {
    currentMenu: Menu;
    isResizing: boolean;
};

interface NavbarState {
    currentEncounter: Encounter;
    currentSortPlugin: EncounterSortPlugin;
    isMinified: boolean;
}

export class Navbar extends React.Component<NavbarProps, NavbarState> {
    private onEncounterUpdate: HookSubscription;
    private onSortUpdate: HookSubscription;
    private onMinifyUpdate: HookSubscription;

    constructor(props: NavbarProps) {
        super(props);

        this.state = {
            currentEncounter: null,
            currentSortPlugin: null,
            isMinified: false
        };
    }

    public componentDidMount(): void {
        this.setState({
            currentEncounter: EncounterService.getCurrentEncounter(),
            currentSortPlugin: EncounterService.getCurrentSortPlugin(),
            isMinified: SettingsService.isMinified()
        });

        this.subscribeObservables();
    }

    public componentWillUnmount(): void {
        this.unsubscribeObservables();
    }

    private subscribeObservables(): void {
        this.onEncounterUpdate = EncounterService.onEncounterUpdate.add('navbar-encounterUpdate', (data: Encounter) => {
            this.setState({
                currentEncounter: data
            });
        });

        this.onSortUpdate = EncounterService.onSortUpdate.add('navbar-sortUpdate', (data: EncounterSortPlugin) => {
            this.setState({
                currentSortPlugin: data
            });
        });

        this.onMinifyUpdate = SettingsService.onMinifyChange.add('navbar-minifyUpdate', (data: boolean) => {
            this.setState({
                isMinified: data
            });
        });
    }

    private unsubscribeObservables(): void {
        this.onEncounterUpdate.destroy();
        this.onSortUpdate.destroy();
        this.onMinifyUpdate.destroy();
    }

    private getTime(): string {
        if(this.state.currentEncounter == null) return '00:00';
        return this.state.currentEncounter.getTime();
    }

    private getPluginTitle(): string {
        if(this.state.currentSortPlugin == null) return 'Unknown';
        return this.state.currentSortPlugin.getTitle();
    }

    private toggleResize(): void {
        SettingsService.toggleResizeMode();
        SettingsService.setMenu(Menu.DEFAULT);
    }

    private toggleSettings(): void {
        let menu: Menu = SettingsService.getCurrentMenu();
        if(menu === Menu.SETTINGS) {
            SettingsService.setMenu(Menu.DEFAULT);
        } else {
            SettingsService.setMenu(Menu.SETTINGS);
        }
    }

    private drawSettings(): any {
        if(this.state.currentSortPlugin == null) return null;

        return (<>
                <Icon
                    icon={'resize'}
                    onClick={this.toggleResize}
                    active={this.props.isResizing}
                />
                <Icon
                    icon={SchemasService.getIconFromGroup(this.state.currentSortPlugin.getGroupTitle())}
                    onClick={this.toggleSettings.bind(this)}
                    active={this.props.currentMenu == Menu.SETTINGS}
                />
            </>
        );
    }

    public getTitle(): string {
        if(this.state.isMinified) {
            return `${this.getPluginTitle()}`
        } else {
            return `${this.getTime()} - ${this.getPluginTitle()}`
        }
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
                    <div className='navbar-title'>{this.getTitle()}</div>
                    <div className='navbar-tools'>{this.drawSettings()}</div>
                </div>
            </>
        );
    }
};