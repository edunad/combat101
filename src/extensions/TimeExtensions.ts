'use strict';

export class Time {
    public static msToTime(ms: number): string {
        let pads: any = (n, z = 2) => ('00' + n).slice(-z);
        return pads(ms / 3.6e6 | 0) + ':' + pads((ms % 3.6e6) / 6e4 | 0) + ':' + pads((ms % 6e4) / 1000 | 0);
    }

    public static minutesToMs(min: number): number {
        return min * 60000;
    }
}