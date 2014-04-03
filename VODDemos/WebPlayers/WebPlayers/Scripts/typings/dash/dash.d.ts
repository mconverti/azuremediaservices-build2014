// Type definitions for dash
// Project: https://github.com/Dash-Industry-Forum/dash.js
// Definitions by: Mariano Vazquez <https://github.com/nanovazquez/>
// Definitions: TBD

/**
 * Class definition for the Dash MediaPlayer object
 */
declare class MediaPlayer {
    constructor(context: Dash.di.Context);
    public startup(): void;
    public attachView(videoElement: Element): void;
    public reset(): void;
    public attachSource(url: string): void;
    public getVideoModel(): MediaPlayer.models.VideoModel;
    public addEventListener(type: string, listener: (ev: Event) => any, useCapture?: boolean): void;
    public setAutoPlay(value: boolean): void;
}

declare module MediaPlayer.models {
    interface VideoModel {
        getCurrentTime(): number;
        setCurrentTime(currentTime: number): void;
        play(): void;
        pause(): void;
        listen(type: string, callback: (e: Event) => void): void;
        unlisten(type: string, callback: (e: Event) => void): void;
    }
}

declare module Dash.di {
    /**
     * Interface of the DI Context object
     */
    interface Context {
    }

    /**
     * Interface of the DashContext object
     */
    class DashContext implements Context {
    }
}