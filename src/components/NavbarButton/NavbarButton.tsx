'use strict';

import * as React from 'react';

interface NavbarProps {
    icon: string;
    active: boolean;
    onClick: () => void;
}

export class NavbarButton extends React.Component<NavbarProps> {
    constructor(props: NavbarProps) {
        super(props);
    }

    /**
     * React render method
     *
     * @returns {any}
     */
    public render(): any {
        let icon: string = `./assets/icons/ui/${this.props.icon}.png`;

        return(
            <img
                className={`navbar-button ${this.props.active ? 'active' : ''}`}
                onClick={this.props.onClick}
                src={icon}
            />
        );
    }
}