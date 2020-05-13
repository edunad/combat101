'use strict';

import * as React from 'react';
import * as Color from 'color';

import { Player } from '../../models/Player';
import { Bar } from '../Bar/Bar';
import { EncounterSortPlugin } from '../../interfaces/Sort/EncounterSortPlugin';

interface PlayerProps {
    index: number;
    player: Player;
    sorting: EncounterSortPlugin;
}

export class PlayerElement extends React.Component<PlayerProps> {
    constructor(props: PlayerProps) {
        super(props);
    }

    /**
     * React render method
     *
     * @returns {any}
     */
    public render(): any {
        let user: Player = this.props.player;
        let color: Color = new Color(user.getJob().color);

        let numbers: string = this.props.sorting.getNumberString(user);
        let percent: string = this.props.sorting.getBarPercent(user);

        return(
            <div className='player-container'>
                <img className='player-icon' src={user.getIcon()}/>
                <div className={`player-info-container ${user.isLocalPlayer() ? 'you' : ''}`}>
                    <div className='player-background'/>
                    <Bar color={color} percent={percent}/>

                    <div className='player-info'>{this.props.index}. {user.getName()}</div>
                    <div className='player-numbers'>{numbers}</div>
                </div>
            </div>
        );
    }
}