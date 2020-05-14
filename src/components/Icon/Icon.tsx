'use strict';

import * as React from 'react';

interface IconProps {
    icon: string;
    active?: boolean;
    onClick?: () => void;
}

export class Icon extends React.Component<IconProps> {
    constructor(props: IconProps) {
        super(props);
    }

    /**
     * React render method
     *
     * @returns {any}
     */
    public render(): any {
        let icon: string = `./assets/icons/ui/${this.props.icon}.png`;
        let isButton: boolean = this.props.onClick != null;

        return(
            <img
                className={`icon ${this.props.active ? 'active' : ''} ${isButton ? 'button': ''}`}
                onClick={this.props?.onClick}
                src={icon}
            />
        );
    }
}