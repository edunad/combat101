'use strict';

import * as React from 'react';

import { Player } from '../../models/Player';


interface PlayerProps {
    index: number;
    player: Player;
}

/**
 * UserPanel component
 * @class
 */
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

        return(
            <div className='player-container'>
                <img className='player-icon' src={user.getIcon()}/>
                <div className='player-info-container'>
                    <div className='player-info'>{this.props.index}. {user.getName()}</div>
                    <div className='player-numbers'>{user.getTotalDamage()} ({user.getTotalDamage()}, {user.getTotalDamage(true)})</div>
                </div>
            </div>
        );
    }
}