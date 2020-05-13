'use strict';

declare global {
    interface Math {
        getRandom(min: number, max: number): number;
        clamp(value: number, min: number, max: number): number;
    }
}

(Math as any).getRandom = (min: number, max: number): number => {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
};

(Math as any).clamp = (value: number, min: number, max: number): number => {
    if (isNaN(value)) value = min;

    if (value < min) value = min;
    if (value > max) value = max;
    return value;
};

export {};