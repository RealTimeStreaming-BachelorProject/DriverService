import { RedisClient } from "redis";
import redis from "redis";

export const createRedisClient = (db: number | string): RedisClient => {
  const client: RedisClient = redis.createClient({
    db: db,
  });
  client.on("error", function (error) {
    console.error(error);
  });
  return client;
};
