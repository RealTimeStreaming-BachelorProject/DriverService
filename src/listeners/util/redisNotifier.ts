import { RedisClient } from "redis";
const redis = require("redis");

export interface Subscriber {
  userId: string;
  onChange: (value: any) => void;
}

export interface Subscribers {
  [key: string]: Subscriber[];
}

const subscribers: Subscribers = {};

export const startListening = () => {
  const readClient: RedisClient = redis.createClient();
  const subClient: RedisClient = redis.createClient();

  subClient.config("set", "notify-keyspace-events", "KEA");
  subClient.subscribe("__keyevent@0__:set");
  subClient.on("message", (channel, key) => {
    readClient.get(key, (error, value) => {
      if (error) {
        // Handle read error
      }
      notifySubscribers(key, value);
    });
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
