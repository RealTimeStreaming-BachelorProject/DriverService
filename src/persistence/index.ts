import { RedisClient } from "redis";
import redis from "redis";
import logger from "../util/logger";

export const createRedisClient = (db: number | string): RedisClient => {
  const port = process.env["REDIS_PORT"]
    ? parseInt(process.env["REDIS_PORT"])
    : 6379;
  const host = process.env["REDIS_HOST"] ?? "127.0.0.1";
  const client: RedisClient = redis.createClient(port, host, {
    db: db,
  });
  client.on("error", function (error) {
    logger.error(error);
  });
  return client;
};

export enum RedisDB {
  Coordinates = 0,
  Packages = 1
}
