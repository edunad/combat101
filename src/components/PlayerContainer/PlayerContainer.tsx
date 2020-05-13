'use strict';

import * as React from 'react';
import FlipMove from 'react-flip-move';

import { Player } from '../../models/Player';
import { Encounter } from '../../models/Encounter';
import { EncounterService } from '../../services/EncounterService';
import { PlayerElement } from '../PlayerElement/PlayerElement';
import { EncounterSortPlugin } from '../../interfaces/Sort/EncounterSortPlugin';


interface PlayerContainerProps {
    isDragging: boolean;
    currentEncounter: Encounter;
    currentSortPlugin: EncounterSortPlugin;
}

const MAX_PLAYERS: number = 10;
export class PlayerContainer extends React.Component<PlayerContainerProps> {
    constructor(props: PlayerContainerProps) {
        super(props);
    }

    private isPlayerVisibile(target: Player, plys: Player[]): [boolean, number] {
        let element: HTMLElement = document.getElementById('player-list-container');
        if(element == null) return [false, 0];

        let bounds: DOMRect = element.getBoundingClientRect();
        let playerElementSize: number = 22; // In pixels
        let currentSize: number = 0;
        let canSee: boolean = false;
        let visibleRows: number = 0;

        for(visibleRows = 0; visibleRows < MAX_PLAYERS; visibleRows++) {
            if(currentSize >= bounds.height) break;
            currentSize += playerElementSize;

            if(plys[visibleRows] == null) continue;
            if(plys[visibleRows] === target) {
                canSee = true;
                break;
            }
        }

        return [canSee, visibleRows];
    }

    private renderPlayer(index: number, ply: Player): any {
        return (
            <PlayerElement index={index}
                key={ply.getName()}
                sorting={this.props.currentSortPlugin}
                player={ply}
            />
        );
    }

    private renderPlayers(plys: Player[]): any {
        let localPly: [Player, number] = EncounterService.getLocalPlayer();
        let canSeePlayer: [boolean, number] = null;
        if(localPly != null) canSeePlayer = this.isPlayerVisibile(localPly[0], plys);

        // Make sure the player is ALWAYS visible, even if doing an awful job :3
        return plys.map((ply: Player, index: number) => {
            if(canSeePlayer != null && !canSeePlayer[0] && index >= (canSeePlayer[1] - 1)) {
                if(index == (canSeePlayer[1] - 1)){
                   return this.renderPlayer(localPly[1] + 1, localPly[0]);
                }
            } else {
                return this.renderPlayer(index + 1, ply);
            }
        });
    }

    private renderNoData(): any {
        return (
            <div style={{backgroundColor: '#000', textAlign: 'center'}}>-- NO DATA --</div>
        );
    }

    public render(): any {
        let encounter: Encounter = this.props.currentEncounter;
        if(encounter == null) return this.renderNoData();

        let players: Player[] = encounter.getPlayers();
        if(players == null || players.length <= 0) return this.renderNoData();

        return(
            <div className={`player-list ${this.props.isDragging ? 'dragging': ''}`} id='player-list-container'>
                <FlipMove enterAnimation={false} leaveAnimation={false}>
                    {this.renderPlayers(players)}
                </FlipMove>
            </div>
        );
    }
}