import '../extensions/MathExtension';

import { Hook } from '@edunad/hooks';
import { OverlayState } from '../interfaces/Overlay/OverlayState';
import { OverlayLog } from '../interfaces/Overlay/OverlayLog';
import { Player } from '../models/Player';
import { Encounter } from '../models/Encounter';
import { SchemasService } from './SchemasService';

import * as Mock from '../mocks/dummy.json';

const DEBUG_SERVICE: boolean = true;

export class OverlayService {
    public static overlayState: OverlayState;

    public static onOverlayState: Hook<OverlayState> = new Hook<OverlayState>();
    public static onOverlayEcho: Hook<string> = new Hook<string>();
    public static onOverlayLogLine: Hook<OverlayLog> = new Hook<OverlayLog>();

    public static onOverlayDataUpdate: Hook<any> = new Hook<any>();
    public static onOverlayCombatUpdate: Hook<[Encounter, Player[]]> = new Hook<[Encounter, Player[]]>();

    public static localPlayer: Player;

    public static initialize(): void {
        this.registerListeners();
    }

    public static getAPI(): any {
        return (window as any).OverlayPluginApi;
    }

    public static loadMockData(maxPlys: number = 0, interval: number = 1000): void {
        let mockData: any = JSON.parse(JSON.stringify(Mock)); // Quick clone
        if(maxPlys > 0) mockData.Combatant = this.splitMockData(mockData.Combatant, maxPlys);


        // Emit initial data
        setTimeout(() => {
            this.onOverlayCombatUpdate.emit(this.parseCombatData(mockData));

            if(interval > 0){
                setInterval(() => {
                    let key: string = Object.keys(mockData.Combatant)[Math.getRandom(0, Object.keys(mockData.Combatant).length - 1)];
                    let ply: any = mockData.Combatant[key];

                    ply['encdps'] = Math.getRandom(0, 10000);
                    ply['ENCHPS'] = Math.getRandom(0, 10000);

                    this.onOverlayCombatUpdate.emit(this.parseCombatData(mockData));
                }, interval);
            }
        }, 1000);
    }

    private static splitMockData(mock: any, maxPlys: number): any {
        let newMock: any = {};
        for(let i: number = 0; i < maxPlys; i++) {
            let key: string = Object.keys(mock)[i];
            newMock[key] = mock[key];
        }

        return newMock;
    }

    private static getZonePercentage(combatRawData: any, ply: Player, dataId: string): number {
        let totalZonePercentage: number = combatRawData.map(pl => parseFloat(pl[dataId])).reduce((a:number, b:number) => {
            if(Number.isNaN(a)) a = 0;
            if(Number.isNaN(b)) b = 0;

            return a + b
        });

        return Math.floor((ply.getDataNumber(dataId) * 100) / totalZonePercentage);
    }

    private static parseCombatData(data: any): [Encounter, Player[]] {
        if(data == null) return;

        let encounter: Encounter = null;
        let encData: any = data['Encounter'];

        if(encData != null) {
            encounter = new Encounter({
                name: encData['CurrentZoneName'],
                duration: encData['duration']
            });
        }

        let plys: Player[] = [];
        let combData: any = data['Combatant'];

        if(combData != null) {
            let combatRawData: any = Object.values(combData);

            Object.keys(combData).forEach((id: string, indx: number) => {
                if(id === 'Limit Break') return; // Ignore 'Limit Break'

                let rawData: any = combData[id];
                if(rawData == null) return;

                let job: string = rawData['Job'];
                if(job == null) return;

                let ply: Player = new Player({
                    name: id,
                    job: SchemasService.getJobFromScheme(job.toUpperCase())
                });

                ply.updateData(rawData);
                if(ply.isLocalPlayer()) this.localPlayer = ply; // For quick access

                /* Inject extra data */
                ply.updateSingleData('dps_perc', this.getZonePercentage(combatRawData, ply, 'encdps') + '%');
                ply.updateSingleData('hps_perc', this.getZonePercentage(combatRawData, ply, 'ENCHPS') + '%');
                ply.updateSingleData('damageTaken_perc', this.getZonePercentage(combatRawData, ply, 'damagetaken') + '%');

                plys.push(ply);
            });
        }

        return [encounter, plys];
    }

    public static registerListeners(): void {
        // Overlay state when AREA / Combatent changes
        document.addEventListener('onOverlayDataUpdate', ($event: any) => {
            if($event == null) return;

            let data: any = $event.detail;
            if(data == null) return;

            if(data.type == 'CombatData') {
                this.onOverlayCombatUpdate.emit(this.parseCombatData(data));
            }else {
                this.onOverlayDataUpdate.emit(data);
            }
        });

        // Overlay state update (if window is locked or not)
        document.addEventListener('onOverlayStateUpdate', ($event: any) => {
            if($event == null || $event.detail == null) return;
            this.overlayState = {
                locked: $event.detail.isLocked
            };

            this.onOverlayState.emit(this.overlayState);
        });

        document.addEventListener('onBroadcastMessageReceive', ($event: any) => {
            if($event == null) return;
            console.debug('onBroadcastMessageReceive', $event);
        });

        document.addEventListener('onRecvMessage', ($event: any) => {
            if($event == null) return;
            console.debug('onRecvMessage', $event);
        });

        document.addEventListener('onLogLine', ($event: any) => {
            if($event == null) return;

            let detail: any = $event.detail;
            if(detail == null) return;

            let code: number = detail.opcode;
            if(code != null) {
                if(code !== 56) {
                    this.onOverlayLogLine.emit({type: code, timestamp: detail.timestamp, payload: detail.payload});
                } else {
                    this.onOverlayEcho.emit(detail.payload[3]);
                }
            } else {
                this.onOverlayEcho.emit(detail.message);
            }
        });
    }

    /**
     * Print a debug message of the service if enabled
     *
     * @param {string} text - the debug message
     * @returns {void}
     */
    private static onDebug(text: string): void {
        if (!DEBUG_SERVICE) return;
        console.debug(`[OverlayService] ${text}`);
    }
}