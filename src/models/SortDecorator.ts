'use strict';

import { SortConfiguration } from '../interfaces/Sort/SortConfiguration';
import { PluginService } from '../services/PluginService';

export function SortPlugin(configuration: SortConfiguration): (constructor: any) => any {
    // tslint:disable-next-line:callable-types only-arrow-functions
    return function <T extends { new(...args: any[]): {} }>(constructor: T): any {
        return class extends constructor {
            public sortConfig: SortConfiguration;

            constructor(...params: any[]) {
                super(...params);

                this.sortConfig = configuration;
                if (this.sortConfig.id == null)
                    throw Error(`[SortPlugin] Misconfiguration on parser, missing 'id'`);

                PluginService.registerPlugin(this, configuration.id);
            }

            public getGroupTitle(): string {
                return this.sortConfig.groupTitle;
            }

            public getID(): string {
                return this.sortConfig.id;
            }

            public getTitle(): string {
                return this.sortConfig.title;
            }
        };
    };
};