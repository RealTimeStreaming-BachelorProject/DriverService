import { Redis as RedisClient } from "ioredis";
import Redis from "ioredis";
import logger from "../util/logger";

export const createRedisClient = (db: number | string): RedisClient => {
  const port = process.env["REDIS_PORT"]
    ? parseInt(process.env["REDIS_PORT"])
    : 6379;
  const host = process.env["REDIS_HOST"] ?? "127.0.0.1";
  const client: RedisClient = new Redis({
    port,
    host,
    db,
  } as Redis.RedisOptions);
  
  client.on("error", function (error) {
    logger.error(error);
  });
  return client;
};

export enum RedisDB {
  Coordinates = 0,
  Packages = 1,
}
