'use strict';

import * as React from 'react';

interface ResizeProps {
    enabled: boolean;
}

interface ResizeState {
    isDragging: boolean;

    dragStartPosY: number;
    dragStartHeight: number;
}

export class ResizeHandler extends React.Component<ResizeProps, ResizeState> {
    constructor(props: ResizeProps) {
        super(props);

        this.state = {
            dragStartHeight: 0,
            dragStartPosY: 0,

            isDragging: false
        };
    }

    public componentDidMount(): void {
        this.registerListeners();
    }

    private startDrag($event: any): void {
        let element: HTMLElement = document.getElementById('app-container');
        if(element == null) return;

        let currentHeight: DOMRect = element.getBoundingClientRect();
        this.setState({isDragging: true, dragStartPosY: $event.clientY, dragStartHeight: currentHeight.height});
    }

    private moveDrag($event: any): void {
        let element: HTMLElement = document.getElementById('app-container');
        if(element == null) return;

        let startMouseY: number = this.state.dragStartPosY;
        let mouseY: number = $event.clientY;
        let newSize: number = (this.state.dragStartHeight + (mouseY - startMouseY));
        let gridSize: number = 20;
        let grid: number = gridSize * Math.round(newSize / gridSize);

        element.style.height = `${Math.clamp(grid, 42, 240)}px`;
    }

    private stopDrag(): void {
        this.setState({isDragging: false});
    }

    private registerListeners(): void {
        document.addEventListener('mouseup', ($event: any) => {
            if(!this.state.isDragging) return;
            this.stopDrag();
        }, { passive: true });

        document.addEventListener('mousemove', ($event: any) => {
            if(!this.state.isDragging) return;
            this.moveDrag($event);
        }, { passive: true });
    }


    /**
     * React render method
     *
     * @returns {any}
     */
    public render(): any {
        if(!this.props.enabled) return null;
        return(
            <div
                className='resize-handler'
                onMouseDown={this.startDrag.bind(this)}>
                    <div className='resize-handler-content'>
                        {this.props.children}
                    </div>
                </div>
        );
    }
}