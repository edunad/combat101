'use strict';

import * as React from 'react';


/**
 * App component
 * @class
 */
export class App extends React.Component<any, void>  {
    /**
     * Initializes the App class
     * @param {any} props
     *
     * @constructor
     */
    constructor(props: any) {
        super(props);
    }

    /**
     * Called on component mounted
     *
     * @returns {void}
     */
    public componentDidMount(): void {
        this.bindObservables();
    }

    /**
     * Called on component unmout
     *
     * @returns {void}
     */
    public componentWillUnmount(): void {
        this.unbindObservables();
    }

    /**
     * Bind UserService observables
     *
     * @returns {void}
     */
    private bindObservables(): void {

    }

    /**
     * Unbind UserService observables
     *
     * @returns {void}
     */
    private unbindObservables(): void {

    }

    /**
     * React render method
     *
     * @returns {any}
     */
    public render(): any {
        return (
            <>
            </>
        );
    }
}