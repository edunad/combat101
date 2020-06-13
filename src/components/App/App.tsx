'use strict';

import * as React from 'react';
import { HookSubscription } from '@edunad/hooks';

import { OverlayService } from '../../services/OverlayService';
import { EncounterService } from '../../services/EncounterService';
import { SchemasService } from '../../services/SchemasService';
import { PluginService } from '../../services/PluginService';
import { SettingsService } from '../../services/SettingsService';

import { Navbar } from '../Navbar/Navbar';
import { PlayerContainer } from '../PlayerContainer/PlayerContainer';
import { ResizeHandler } from '../ResizeHandler/ResizeHandler';
import { SettingsContainer } from '../SettingsContainer/SettingsContainer';
import { Menu } from '../../enums/Menu';

declare var __PRODUCTION__: boolean;

/**
 * The AppState interface
 * @interface
 */
interface AppState {
    isLoaded: boolean;
    isResizing: boolean;
    orientationInverted: boolean;

    currentMenu: Menu;
};

/**
 * App component
 * @class
 */
export class App extends React.Component<any, AppState>  {
    private onMenuChange: HookSubscription;
    private onResizeModeUpdate: HookSubscription;
    private onOrientationChange: HookSubscription;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoaded: false,
            isResizing: false,
            orientationInverted: false,

            currentMenu: Menu.DEFAULT
        }
    }

    public componentDidMount(): void {
        this.subscribeObservables();

        OverlayService.initialize();
        PluginService.initialize(() => {
            let debug: boolean = localStorage.getItem('DEBUG_MODE') != null && localStorage.getItem('DEBUG_MODE') === 'true';
            if(!__PRODUCTION__ || debug) OverlayService.loadMockData(0, 1000);

            SettingsService.initialize();
            SchemasService.initialize();
            EncounterService.initialize();

            this.setState({
                isLoaded: true,

                isResizing: SettingsService.isResizing(),
                currentMenu: SettingsService.getCurrentMenu(),
                orientationInverted: SettingsService.isOrientationInverted()
            });
        });
    }

    public componentWillUnmount(): void {
        EncounterService.onDestroy();
        this.unsubscribeObservables();
    }

    private subscribeObservables(): void {
        this.onMenuChange = SettingsService.onMenuChange.add('menuUpdate', (data: Menu) => {
            this.setState({
                currentMenu: data
            });
        });

        this.onResizeModeUpdate = SettingsService.onResizeModeUpdate.add('resizeModeUpdate', (data: boolean) => {
            this.setState({
                isResizing: data
            });
        });

        this.onOrientationChange = SettingsService.onOrientationChange.add('orientationUpdate', (data: boolean) => {
            this.setState({
                orientationInverted: data
            });
        });
    }

    private unsubscribeObservables(): void {
        this.onMenuChange.destroy();
        this.onResizeModeUpdate.destroy();
        this.onOrientationChange.destroy();
    }

    private renderMenu(): any {
        switch(this.state.currentMenu) {
            case Menu.SETTINGS:
                return <SettingsContainer/>;
            case Menu.DEFAULT:
            default:
                return <PlayerContainer/>;
        }
    }

    private onResize(): void {
        this.setState(this.state); // Force a update :P

        SettingsService.getSettings().height = window['app-element'].style.height;
        SettingsService.save();
    }

    private renderApp(): any {
        if(!this.state.isLoaded) return;

        return (
            <>
                <Navbar
                    currentMenu={this.state.currentMenu}
                    isResizing={this.state.isResizing}
                />

                {this.renderMenu()}

                <ResizeHandler
                    vertical={false}
                    enabled={this.state.isResizing}
                    onResize={this.onResize.bind(this)}
                />

                <ResizeHandler
                    vertical={true}
                    enabled={this.state.isResizing}
                    onResize={this.onResize.bind(this)}
                    inverted={this.state.orientationInverted}
                />
            </>
        );
    }

    /**
     * React render method
     *
     * @returns {any}
     */
    public render(): any {
        let classes: string = `app-container ${this.state.isResizing ? 'resizing' : ''} ${this.state.orientationInverted ? 'inverted' : ''}`;
        return (
            <div className={classes}>
                {this.renderApp()}
            </div>
        );
    }
}