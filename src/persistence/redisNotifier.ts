import { Redis as RedisClient } from "ioredis";
import logger from "../util/logger";
import { createRedisClient, RedisDB } from ".";

export interface Subscriber {
  userId: string;
  onChange: (value: any) => void;
}

export interface Subscribers {
  [key: string]: Subscriber[];
}

const subscribers: Subscribers = {};

export const startListening = () => {
  const subClient: RedisClient = createRedisClient(RedisDB.Coordinates);

  // patternsubscribe (all events)
  subClient.psubscribe("*", (error, _) => {
    if (error !== null)
      logger.error(error);
  });
  subClient.on("pmessage", (_, channel, message) => {
    notifySubscribers(channel, message);
  });
};

const notifySubscribers = (key: string, value: any) => {
  const relevantSubscribers = subscribers[key];
  if (!relevantSubscribers) return;
  relevantSubscribers.forEach((sub) => {
    sub.onChange(value);
  });
};

export const addSubscriber = (key: string, subscriber: Subscriber) => {
  if (key in subscribers) {
    subscribers[key].push(subscriber);
  } else {
    subscribers[key] = [subscriber];
  }
};

/**
 * Takes a userId and removes ALL subscriptions from that user
 */
export const removeSubscriber = (userId: string) => {
  Object.keys(subscribers).forEach((key) => {
    subscribers[key] = subscribers[key].filter((sub) => sub.userId !== userId);
  });
};
