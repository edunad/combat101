'use strict';

import * as React from 'react';

/**
 * UserPanel component
 * @class
 */
export class Navbar extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    /**
     * React render method
     *
     * @returns {any}
     */
    public render(): any {
        return(
            <div className='navbar-container'>
                Damage: Current fight
            </div>
        );
    }
}