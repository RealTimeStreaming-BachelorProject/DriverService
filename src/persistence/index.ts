import { RedisClient } from "redis";

const redis = require("redis");
const client: RedisClient = redis.createClient();
 
client.on("error", function(error) {
  console.error(error);
});
 
// client.set("key", "value", redis.print);
// client.get("key", redis.print);

export default client;