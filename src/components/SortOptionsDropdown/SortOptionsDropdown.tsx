'use strict';

import * as React from 'react';

import { EncounterSortPlugin } from '../../interfaces/Sort/EncounterSortPlugin';
import { PluginService } from '../../services/PluginService';

interface SortOptionsDropdownProps {
    currentSortPlugin: EncounterSortPlugin;
}

export class SortOptionsDropdown extends React.Component<SortOptionsDropdownProps> {
    constructor(props: SortOptionsDropdownProps) {
        super(props);
    }


    private onPluginChange($event: any): void {
        let value: string = $event.value;
        console.warn(value);
    }

    private renderOptions(): any {
        let plugins: { [id: string]: EncounterSortPlugin; } = PluginService.getPlugins();
        if(plugins == null) return null;

        Object.keys(plugins).map((key: string) => {
            let plugin: EncounterSortPlugin = plugins[key];
            return <option
                    key={plugin.getID()}
                    value={plugin.getID()}
                    selected={plugin === this.props.currentSortPlugin}>
                        {plugin.getTitle()}
                    </option>;
        });
    }

    public render(): any {
        return(
            <select className='dropdown-style'>
                {this.renderOptions()}
            </select>
        );
    }
}