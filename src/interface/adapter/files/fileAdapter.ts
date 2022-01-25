export interface FileAdapter {
    save(filePath: string) : string;
    readStream(filePath: string, options?: any, onRead?: Function, onEnd?: Function) : Promise<void>;
    get();
}