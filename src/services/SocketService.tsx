import { Hook } from '@edunad/hooks';
import { SocketStatus } from '../enums/SocketStatus';
import { SocketMessage } from '../interfaces/SocketMessage';

const RECONNECT_TIMEOUT: number = 1000;
const RECONNECT_RETRY: number = 10;
const DEBUG_SERVICE: boolean = true;

// TODO: Requires ACTWebSocket Plugin
// https://github.com/ZCube/ACTWebSocket
export class SocketService {
    public static socketStatus: SocketStatus = SocketStatus.OFFLINE;

    public static onMessage: Hook<SocketMessage> = new Hook<SocketMessage>();
    public static onStatusChange: Hook<SocketStatus> = new Hook<SocketStatus>();

    private static socket: WebSocket;
    private static socketURI: string;
    private static retryCount: number = RECONNECT_RETRY;
    private static retryTimeout: any;

    public static initialize(): void {
        this.socketURI = this.getSocketURI();
        if(this.socketURI === 'ws://:10501') {
            this.socketURI = 'ws://localhost:10501'
        }

        this.registerListeners();
    }

    public static connect(): void {
        if(this.socket != null) return;

        this.socket = new WebSocket(`${this.socketURI}/MiniParse`);
        this.socket.onmessage = this.onSocketMessage;
        this.socket.onclose = this.onSocketClose;
        this.socket.onerror = this.onSocketError;
        this.socket.onopen = this.onSocketOpen;
    }

    public static sendMessage(data: string | any): void {
        if(!this.isConnected()) return;
        this.socket.send(typeof data === typeof '' ? data : JSON.stringify(data));
    }

    public static isConnected(): boolean {
        return this.socket != null && this.socketStatus == SocketStatus.ONLINE;
    }

    private static onSocketOpen(): void {
        this.setStatus(SocketStatus.ONLINE);
        this.retryCount = RECONNECT_RETRY;

        this.onDebug('Connected to socket!');
    }

    private static onSocketError($event: any): void {
        console.error($event);
        this.socket.close(); // Close the connection
    }

    private static onSocketClose(): void {
        this.setStatus(SocketStatus.OFFLINE);
        this.retryConnection();
    }

    private static retryConnection(): void {
        if(this.retryCount <= 0) return this.onDebug('Failed to reconnect to socket');
        this.retryCount--;

        this.onDebug(`Retrying connection.. {${this.retryCount}/${RECONNECT_RETRY}}`);

        if(this.retryTimeout) clearTimeout(this.retryTimeout);
        this.retryTimeout = setTimeout(() => {
            this.connect();
        }, RECONNECT_TIMEOUT);
    }

    private static parseMessage($event: any): any {
        if($event == null || $event.data == null) return null;

        try {
            return JSON.parse($event.data);
        } catch {
            return null;
        }
    }

    private static onSocketMessage($event: any): void {
        let message: any = this.parseMessage($event);
        this.onDebug(message);
        /*this.onSocketMessage.emit({
            id: '10'
        });*/
    }

    private static setStatus(status: SocketStatus): void {
        if(this.socketStatus == status) return;

        this.socketStatus = status;
        this.onStatusChange.emit(status);
    }

    private static registerListeners(): void {
        window.addEventListener('message', ($event: any) => {
            console.debug($event);
        });
    }

    private static getSocketURI(): string {
        let o: RegExpExecArray = /[?&]HOST_PORT=(wss?:\/\/[^&\/]+)/.exec(location.search);
        return o && o[1];
    }

    /**
     * Print a debug message of the service if enabled
     *
     * @param {string} text - the debug message
     * @returns {void}
     */
    private static onDebug(text: string): void {
        if (!DEBUG_SERVICE) return;
        console.debug(`[SocketService] ${text}`);
    }
}