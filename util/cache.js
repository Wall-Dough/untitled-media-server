// const EXPIRY = 1000 * 60 * 1;
const EXPIRY = 1000;

class BaseCache {
    constructor(accessor) {
        this.items = {};
        this.accessor = accessor;
    }
    add(key, value) {
        console.log('Added ' + key);
        this.items[key] = {
            value: value,
            time: new Date().getTime()
        };
    }
    get(key) {
        if (this.items[key] == undefined) {
            if (!this.accessor) {
                return undefined;
            }
            this.add(key, accessor(key));
        }
        return this.items[key].value;
    }
    clean() {
        const now = new Date().getTime();
        Object.keys(this.items).forEach((key) => {
            const timeSince = now - this.items[key].time;
            if (timeSince >= EXPIRY) {
                delete this.items[key];
            }
        });
    }
    clear() {
        this.items = {};
    }
}

const cacheCache = new BaseCache();

class Cache extends BaseCache {
    constructor(cacheName) {
        cacheCache.add(cacheName, this); 
    }

}