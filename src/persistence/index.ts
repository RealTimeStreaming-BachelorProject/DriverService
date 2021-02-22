import { Redis as RedisClient, Cluster } from "ioredis";
import Redis from "ioredis";
import logger from "../util/logger";

let redisNodes: any;

if (process.env.REDIS_CLUSTER_NODES) {
  redisNodes = JSON.parse(process.env.REDIS_CLUSTER_NODES);
} else {
  redisNodes = [
    {
      port: 6379,
      host: "127.0.0.1",
    },
    {
      port: 6380,
      host: "127.0.0.1",
    },
    {
      port: 6381,
      host: "127.0.0.1",
    },
    {
      port: 6382,
      host: "127.0.0.1",
    },
    {
      port: 6383,
      host: "127.0.0.1",
    },
    {
      port: 6384,
      host: "127.0.0.1",
    },
  ];
}

export const cluster = new Redis.Cluster(redisNodes, {
  scaleReads: "slave", // sending write queries to master and read queries to slave
  redisOptions: {
    password: "bitnami"
  }
});

cluster.on("error", function (error) {
  logger.error(error);
});

export enum RedisDB {
  Coordinates = 0,
  Packages = 1,
}
