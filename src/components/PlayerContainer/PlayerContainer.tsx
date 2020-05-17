'use strict';

import * as React from 'react';
import FlipMove from 'react-flip-move';
import { HookSubscription } from '@edunad/hooks';

import { Player } from '../../models/Player';
import { Encounter } from '../../models/Encounter';
import { EncounterService } from '../../services/EncounterService';
import { PlayerElement } from '../PlayerElement/PlayerElement';
import { EncounterSortPlugin } from '../../interfaces/Sort/EncounterSortPlugin';
import { SettingsService } from '../../services/SettingsService';
import { OverlayService } from '../../services/OverlayService';

interface PlayerContainerState {
    currentEncounter: Encounter;
    currentSortPlugin: EncounterSortPlugin;
    isMinified: boolean;
}

export class PlayerContainer extends React.Component<any, PlayerContainerState> {
    private onEncounterUpdate: HookSubscription;
    private onSortUpdate: HookSubscription;
    private onMinifyUpdate: HookSubscription;

    constructor(props: any) {
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
        this.onEncounterUpdate = EncounterService.onEncounterUpdate.add('player-encounterUpdate', (data: Encounter) => {
            this.setState({
                currentEncounter: data
            });
        });

        this.onSortUpdate = EncounterService.onSortUpdate.add('player-sortUpdate', (data: EncounterSortPlugin) => {
            this.setState({
                currentSortPlugin: data
            });
        });

        this.onMinifyUpdate = SettingsService.onMinifyChange.add('player-minifyUpdate', (data: boolean) => {
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

    private visibleInRows(ply: Player, plys: Player[]): [number, boolean] {
        let bounds: DOMRect = window['app-container'].getBoundingClientRect();
        if(bounds == null || ply == null) return [plys.length, true];

        let playerElementSize: number = 20; // In pixels
        let currentSize: number = 20;
        let visibleRows: number = 0;
        let isVisible: boolean = false;

        for(visibleRows = 0; visibleRows < plys.length; visibleRows++) {
            if(plys[visibleRows] == null) continue;
            if(currentSize >= bounds.height) break;

            currentSize += playerElementSize;
            if(plys[visibleRows] === ply) {
                isVisible = true;
            }
        }

        return [visibleRows, isVisible];
    }

    private renderPlayer(ply: Player): any {
        return (
            <PlayerElement index={ply.getPosition() + 1}
                key={ply.getName()}
                sorting={this.state.currentSortPlugin}
                player={ply}
                minified={this.state.isMinified}
            />
        );
    }

    private renderPlayers(plys: Player[]): any {
        if(plys == null || plys.length <= 0) return;

        let localPly: Player = OverlayService.localPlayer;
        let playerVisible: [number, boolean] = this.visibleInRows(localPly, plys);

        // Make sure the player is ALWAYS visible, even if doing an awful job :3
        return plys.map((ply: Player, index: number) => {
            let totalIndx: number = playerVisible[0];
            if(index >= totalIndx) return;

            // Player not visible and the index is on the last row
            if(!playerVisible[1] && index == (totalIndx - 1)) {
                return this.renderPlayer(localPly);
            } else {
                return this.renderPlayer(ply);
            }
        });
    }

    private renderPlayerList(players: Player[]): any {
        return (
            <FlipMove enterAnimation={false} leaveAnimation={false}>
                {this.renderPlayers(players)}
            </FlipMove>
        )
    }

    public render(): any {
        let players: Player[] = null;
        let encounter: Encounter = this.state.currentEncounter;
        if(encounter != null) players = encounter.getPlayers();

        return(
            <div className='player-list' id='player-list-container'>
                {players != null && players.length > 0 ? this.renderPlayerList(players) : null}
            </div>
        );
    }
}