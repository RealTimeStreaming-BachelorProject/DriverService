import { RedisClient } from "redis";
import redis from "redis";
import logger from "../util/logger";

export const createRedisClient = (db: number | string): RedisClient => {
  const client: RedisClient = redis.createClient({
    host: process.env["REDIS_HOST"] ?? "127.0.0.1",
    port: process.env["REDIS_PORT"]
      ? parseInt(process.env["REDIS_PORT"])
      : 6379,
    db: db,
  });
  client.on("error", function (error) {
    logger.error(error);
  });
  return client;
};
