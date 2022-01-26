export default interface CacheAdapter {
    get(id: string);
    save(id: string, data: object, ttl: number);
}