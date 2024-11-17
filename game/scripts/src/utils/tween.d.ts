declare interface TweenInstance {
    set(clock: number): boolean;
    reset(): boolean;
    update(dt: number): boolean;
}

declare interface Tween {
    New(this: void, duration: number, subject: object, target: object, easing: string): TweenInstance;
}

declare global {
    var Tween: Tween;
    interface GameRules {
        Tween: Tween;
    }
}

export {};
