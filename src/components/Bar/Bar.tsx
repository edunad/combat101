'use strict';

import * as React from 'react';

interface BarProps {
    percent: number;
    color: string;
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
        return(
            <div className='bar' style={{width: this.props.percent, backgroundColor: this.props.color}}/>
        );
    }
}