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


/**
 * The AppState interface
 * @interface
 */
interface AppState {
    isLoaded: boolean;
    isResizing: boolean;

    currentMenu: Menu;
};

/**
 * App component
 * @class
 */
export class App extends React.Component<any, AppState>  {
    private onMenuChange: HookSubscription;
    private onResizeModeUpdate: HookSubscription;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoaded: false,
            isResizing: false,
            currentMenu: Menu.DEFAULT
        }
    }

    public componentDidMount(): void {
        this.subscribeObservables();

        PluginService.initialize(() => {
            OverlayService.initialize();
            SchemasService.initialize();
            EncounterService.initialize();

            // Uncomment for mock data testing
            //OverlayService.loadMockData(0, 0);

            this.setState({
                isLoaded: true,
                isResizing: SettingsService.isResizing(),
                currentMenu: SettingsService.getCurrentMenu()
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
    }

    private unsubscribeObservables(): void {
        this.onMenuChange.destroy();
        this.onResizeModeUpdate.destroy();
    }

    private playerContainerRoute(): any {
        return (
            <PlayerContainer
                isResizing={this.state.isResizing}
            />
        );
    }

    private settingsRoute(): any {
        return (
            <SettingsContainer/>
        );
    }

    private renderMenu(): any{
        switch(this.state.currentMenu) {
            case Menu.SETTINGS:
                return this.settingsRoute();
            case Menu.DEFAULT:
            default:
                return this.playerContainerRoute();
        }
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

                <ResizeHandler enabled={this.state.isResizing}>
                    --------------------------------------------------
                </ResizeHandler>
            </>
        );
    }

    /**
     * React render method
     *
     * @returns {any}
     */
    public render(): any {
        return (
            <div className='app-container' >
                {this.renderApp()}
            </div>
        );
    }
}