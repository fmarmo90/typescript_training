export abstract class CacheAdapter {
    abstract get(id: string) : void;
    abstract save(id: string, data: object, ttl: number) : void;
}