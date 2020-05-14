import { PlayerJob } from '../interfaces/Player/PlayerJob';

import * as default_schema from '../settings/color_schemas/default.json';
import * as groups from '../settings/groups.json';

export class SchemasService {
    public static schema: any;
    public static initialize(): void {
        this.schema = default_schema;
    }

    public static getJobFromScheme(id: string): PlayerJob {
        let schemaData: any = this.schema[id];
        if(schemaData == null) {
            id = 'DEFAULT';
            schemaData = this.schema['DEFAULT'];
        }

        return {
            color: schemaData.color,
            id: id,
            name: schemaData.name
        }
    }

    public static getIconFromGroup(id: string): string {
        let group: any = groups[id];
        if(group == null || group['icon'] == null) return 'DEFAULT';
        return group['icon'];
    }
}