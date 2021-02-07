import { RedisClient } from "redis";
const redis = require("redis");

export const createRedisClient = (): RedisClient => {
  const client: RedisClient = redis.createClient();
  client.on("error", function(error) {
    console.error(error);
  });
  return client;
}