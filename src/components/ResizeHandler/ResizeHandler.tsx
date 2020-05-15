'use strict';

import * as React from 'react';
import { SettingsService } from '../../services/SettingsService';

interface ResizeProps {
    enabled: boolean;
    vertical: boolean;

    onResize: () => void;
}

interface ResizeState {
    isDragging: boolean;
}

const MINIFIED_WIDTH: number = 160;
const MIN_WIDTH: number = 110;
const MAX_WIDTH: number = 400;

export class ResizeHandler extends React.Component<ResizeProps, ResizeState> {
    private dragStartHeight: number;
    private dragStartPosY: number;
    private dragStartWidth: number;
    private dragStartPosX: number;

    private oldSizeValue: number;

    constructor(props: ResizeProps) {
        super(props);

        this.state = {
            isDragging: false
        };
    }

    public componentDidMount(): void {
        this.registerListeners();
    }

    private startDrag($event: any): void {
        let currentHeight: DOMRect = window['app-element'].getBoundingClientRect();

        this.dragStartPosY = $event.clientY;
        this.dragStartHeight = currentHeight.height;

        this.dragStartPosX = $event.clientX;
        this.dragStartWidth = currentHeight.width;

        this.setState({
            isDragging: true
        });
    }

    private moveDrag($event: any, minSize: number, maxSize: number, gridSize: number = null): void {
        let newSize: number = null;
        let vertical: boolean = this.props.vertical;

        if(vertical) {
            let startMouseY: number = this.dragStartPosY;
            let mousePosY: number = $event.clientY;

            newSize = (this.dragStartHeight + (mousePosY - startMouseY));
        } else {
            let startMouseX: number = this.dragStartPosX;
            let mousePosX: number = $event.clientX;

            newSize = (this.dragStartWidth + (mousePosX - startMouseX));
        }

        let grid: number = newSize;
        if(gridSize != null) grid = gridSize * Math.round(newSize / gridSize);

        let clampedValue: number = Math.clamp(grid, minSize, maxSize);
        if(!vertical) SettingsService.setMinifiedMode(clampedValue <= MINIFIED_WIDTH);

        if(clampedValue !== this.oldSizeValue){
            this.oldSizeValue = clampedValue;
            if(gridSize != null) this.props.onResize();
        }

        window['app-element'].style[vertical ? 'height' : 'width'] = `${clampedValue}px`;
    }

    private stopDrag(): void {
        this.setState({isDragging: false});
    }

    private registerListeners(): void {
        document.addEventListener('mouseup', ($event: any) => {
            if(!this.state.isDragging) return;

            this.stopDrag();
            this.props.onResize();
        }, { passive: true });

        document.addEventListener('mousemove', ($event: any) => {
            if(!this.state.isDragging) return;

            if(this.props.vertical){
                this.moveDrag($event, 42, 220, 20);
            } else {
                this.moveDrag($event, MIN_WIDTH, MAX_WIDTH);
            }
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
                className={`resize-handler ${this.props.vertical ? '' : 'vertical'}`}
                onMouseDown={this.startDrag.bind(this)}/>
        );
    }
}