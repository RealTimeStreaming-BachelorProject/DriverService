import Redis from "ioredis";
import logger from "../helpers/logger";
require("dotenv").config();

let PORT: any;
let HOST: any;

if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
  PORT = process.env.REDIS_PORT;
  HOST = process.env.REDIS_HOST;
} else {
  console.log("No Redis defined in environment variables. Shutting down ...");
  process.exit(0);
}

export const redis_sub = new Redis(PORT, HOST);
export const redis_pub = new Redis(PORT, HOST);

[redis_sub, redis_pub].forEach((redis) => {
  redis.on("error", function (error) {
    logger.error(error);
  });
});
