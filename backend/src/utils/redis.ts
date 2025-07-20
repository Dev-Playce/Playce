import Redis from "ioredis";

export const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'playce-redis',
    port: Number(process.env.REDIS_PORT) || 6379,
});

redisClient.on('ready', () => {
    console.log('✅ Redis 연결 성공');
});

redisClient.on('error', (err) => {
    console.error('❌ Redis 연결 오류:', err);
});

const DEFAULT_TTL_SECONDS = 60 * 1;

/**
 * Redis에서 캐시 값 조회 (JSON 파싱 포함)
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`❌ Redis getCache 실패 (key: ${key})`, error);
        return null;
    }
};

/**
 * Redis에 캐시 저장 (JSON 직렬화 + TTL 설정)
 */
export const setCache = async (
    key: string,
    value: any,
    ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<void> => {
    try {
        await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch (error) {
        console.error(`❌ Redis setCache 실패 (key: ${key})`, error);
    }
};

/**
 * Redis 캐시 무효화 (삭제)
 */
export const deleteCache = async (key: string): Promise<void> => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error(`❌ Redis deleteCache 실패 (key: ${key})`, error);
    }
};

export const deleteCacheByPattern = async (pattern: string): Promise<void> => {
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(...keys);
        }
    } catch (error) {
        console.error(`❌ Redis deleteCacheByPattern 실패 (pattern: ${pattern})`, error);
    }
};