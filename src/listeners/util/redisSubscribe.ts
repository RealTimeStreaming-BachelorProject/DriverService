import { RedisClient } from "redis";

const redis = require("redis");

export const onKeyChange = (key: string, callback: (key: string, value: any) => void) => {
  const readClient: RedisClient = redis.createClient();
  const subClient: RedisClient = redis.createClient();

  subClient.config("set", "notify-keyspace-events", "KEA");
  subClient.subscribe("__keyevent@0__:set", key);
  subClient.on("message", (channel, _key) => {
    readClient.get(_key, (error, value) => {
        if (error) {
            // Handle read error
        }
        callback(_key, value);
    });
  });
};
