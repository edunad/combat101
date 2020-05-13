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

    public static initialize(): void {
        this.registerListeners();
    }

    public static getAPI(): any {
        return (window as any).OverlayPluginApi;
    }

    public static loadMockData(): void {
        this.onOverlayCombatUpdate.emit(this.parseCombatData(Mock));

        setInterval(() => {
            let key: string = Object.keys(Mock.Combatant)[Math.getRandom(0, Object.keys(Mock.Combatant).length - 1)];
            let ply: any = Mock.Combatant[key];
            ply['dps'] = Math.getRandom(1, 10000).toString();

            this.onOverlayCombatUpdate.emit(this.parseCombatData(Mock));
        }, 1000);
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
            Object.keys(combData).forEach((id: string) => {
                let plyData: any = combData[id];
                if(plyData == null) return;

                let job: string = plyData['Job'];
                if(job == null) return;

                let ply: Player = new Player({
                    name: id,
                    job: SchemasService.getJobFromScheme(job.toUpperCase())
                });

                ply.updateData({
                    dps: parseFloat(plyData['dps']),
                    dps_perc: '0%',

                    damage_perc: plyData['damage%'],
                    damage_total: parseFloat(plyData['damage']),

                    damage_blocked: parseFloat(plyData['damageShield']), // TODO: Verify
                    damage_blocked_perc: plyData['BlockPct'], // TODO: Verify

                    deaths: parseInt(plyData['deaths'], 10),

                    max_heal_perc: plyData['healed%'],
                    max_heal: parseFloat(plyData['healed']),

                    hps: parseFloat(plyData['ENCHPS']),
                    hps_perc: '0%',

                    threat: plyData['threatstr'],
                    threat_delta:plyData['threatdelta'],
                });

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