'use strict';

import * as React from 'react';

import { OverlayService } from '../../services/OverlayService';
import { EncounterService } from '../../services/EncounterService';
import { SchemasService } from '../../services/SchemasService';

import { Navbar } from '../Navbar/Navbar';
import { PlayerContainer } from '../PlayerContainer/PlayerContainer';
import { PluginService } from '../../services/PluginService';
import { HookSubscription } from '@edunad/hooks';
import { Encounter } from '../../models/Encounter';
import { EncounterSortPlugin } from '../../interfaces/Sort/EncounterSortPlugin';
import { SettingsService } from '../../services/SettingsService';


/**
 * The AppState interface
 * @interface
 */
interface AppState {
    isLoaded: boolean;

    isDragging: boolean;

    dragStartPosY: number;
    dragStartHeight: number;

    currentEncounter: Encounter;
    currentSortPlugin: EncounterSortPlugin;

    editMode: boolean;
}

/**
 * App component
 * @class
 */
export class App extends React.Component<any, AppState>  {
    private onEncounterUpdate: HookSubscription;
    private onModeUpdate: HookSubscription;
    private onEditModeUpdate: HookSubscription;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoaded: false,
            isDragging: false,

            dragStartPosY: 0,
            dragStartHeight: 0,

            currentEncounter: null,
            currentSortPlugin: null,

            editMode: false
        };
    }

    /**
     * Called on component mounted
     *
     * @returns {void}
     */
    public componentDidMount(): void {
        this.registerListeners();
        this.subscribeObservables();

        PluginService.initialize(() => {
            OverlayService.initialize();
            SchemasService.initialize();
            EncounterService.initialize();

            //OverlayService.loadMockData();

            this.setState({
                isLoaded: true,
                currentEncounter: EncounterService.getCurrentEncounter(),
                currentSortPlugin: EncounterService.getCurrentSortPlugin(),
                editMode: SettingsService.isEditing()
            });
        });
    }

    /**
     * Called on component unmout
     *
     * @returns {void}
     */
    public componentWillUnmount(): void {
        EncounterService.onDestroy();
        this.unsubscribeObservables();
    }

    private subscribeObservables(): void {
        this.onEncounterUpdate = EncounterService.onEncounterUpdate.add('encounterUpdate', (data: Encounter) => {
            this.setState({
                currentEncounter: data
            });
        });

        this.onModeUpdate = EncounterService.onSortUpdate.add('modeUpdate', (data: EncounterSortPlugin) => {
            this.setState({
                currentSortPlugin: data
            });
        });

        this.onEditModeUpdate = SettingsService.onEditModeUpdate.add('editModeUpdate', (data: boolean) => {
            this.setState({
                editMode: data
            });
        });
    }

    private unsubscribeObservables(): void {
        this.onModeUpdate.destroy();
        this.onEncounterUpdate.destroy();
        this.onEditModeUpdate.destroy();
    }

    private startDrag($event: any): void {
        let element: HTMLElement = document.getElementById('app-container');
        if(element == null) return;

        let currentHeight: DOMRect = element.getBoundingClientRect();
        this.setState({isDragging: true, dragStartPosY: $event.clientY, dragStartHeight: currentHeight.height});
    }

    private moveDrag($event: any): void {
        let element: HTMLElement = document.getElementById('app-container');
        if(element == null) return;

        let startMouseY: number = this.state.dragStartPosY;
        let mouseY: number = $event.clientY;
        let newSize: number = (this.state.dragStartHeight + (mouseY - startMouseY));
        let gridSize: number = 21;
        let grid: number = gridSize * Math.round(newSize / gridSize);

        element.style.height = `${Math.clamp(grid, 63, 234)}px`;
    }

    private stopDrag(): void {
        this.setState({isDragging: false});
    }

    private registerListeners(): void {
        document.addEventListener('mouseup', ($event: any) => {
            if(!this.state.isDragging) return;
            this.stopDrag();
        }, { passive: true });

        document.addEventListener('mousemove', ($event: any) => {
            if(!this.state.isDragging) return;
            this.moveDrag($event);
        }, { passive: true });
    }

    private renderResizeHandler(): any {
        if(!this.state.editMode) return;
        return (
            <div
                className='resize-handler'
                onMouseDown={this.startDrag.bind(this)}
            />
        );
    }

    private renderApp(): any {
        if(!this.state.isLoaded) return;

        return (
            <>
                <Navbar
                    currentSortPlugin={this.state.currentSortPlugin}
                    currentEncounter={this.state.currentEncounter}
                    isEditing={this.state.editMode}
                />

                <PlayerContainer
                    currentSortPlugin={this.state.currentSortPlugin}
                    currentEncounter={this.state.currentEncounter}
                    isDragging={this.state.isDragging}
                    isEditing={this.state.editMode}
                />

                {this.renderResizeHandler()}
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