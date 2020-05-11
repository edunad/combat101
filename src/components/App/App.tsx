'use strict';

import * as React from 'react';
import { OverlayService } from '../../services/OverlayService';
import { EncounterService } from '../../services/EncounterService';
import { SchemasService } from '../../services/SchemasService';
import { PlayerElement } from '../PlayerElement/PlayerElement';
import { Player } from '../../models/Player';
import { Navbar } from '../Navbar/Navbar';

/**
 * The AppState interface
 * @interface
 */
interface AppState {
    isLoaded: boolean;
}

/**
 * App component
 * @class
 */
export class App extends React.Component<any, AppState>  {
    /**
     * Initializes the App class
     * @param {any} props
     *
     * @constructor
     */
    constructor(props: any) {
        super(props);

        this.state = {
            isLoaded: false
        };
    }

    /**
     * Called on component mounted
     *
     * @returns {void}
     */
    public componentDidMount(): void {
        OverlayService.initialize();
        SchemasService.initialize();
        EncounterService.initialize();

        this.setState({isLoaded: true});
    }

    /**
     * Called on component unmout
     *
     * @returns {void}
     */
    public componentWillUnmount(): void {
        EncounterService.onDestroy();
    }

    public fakePlayer(): Player {
        let ply: Player = new Player({
            job: SchemasService.getJobFromScheme('ARC'),
            name: 'Bromvlieg'
        });

        ply.updateData({
            damage_blocked: 100,
            dps: 342,
            damage_blocked_perc: '50%',
            damage_perc: '100%',
            damage_total: 10000,
            deaths: 0,
            hps: 0,
            max_heal: 1000,
            max_heal_perc: '100%',
            threat: '0',
            threat_delta: 0
        });

        return ply;
    }

    public renderApp(): any {
        if(!this.state.isLoaded) return;
        return (
            <>
                <Navbar/>
                <div className='player-list'>
                    <PlayerElement index={1} player={this.fakePlayer()} />
                </div>
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