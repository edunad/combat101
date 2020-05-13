'use strict';

import * as React from 'react';
import * as Color  from 'color';

interface BarProps {
    percent: string;
    color: Color;
}

export class Bar extends React.Component<BarProps> {
    constructor(props: BarProps) {
        super(props);
    }

    /**
     * React render method
     *
     * @returns {any}
     */
    public render(): any {
        let color: Color = this.props.color;
        let darkColor: Color = color.darken(0.5);
        let darkerColor: Color = color.darken(0.8);
        let lightColor: Color = color.lighten(0.3);

        let background: string = `linear-gradient(90deg, ${color.hex()} 0%, ${darkColor.hex()} 60%, ${darkerColor.hex()} 100%)`;
        let border: string = `solid 1px ${lightColor.hex()}`;

        return(
            <div className='bar-container'>
                <div className='bar' style={{
                    width: this.props.percent,
                    background: background,
                    borderTop: border,
                    borderBottom: border
                }}/>
            </div>
        );
    }
}