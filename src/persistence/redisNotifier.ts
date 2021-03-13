import logger from "../helpers/logger";
import { cluster } from "./index";

export interface Subscriber {
  userId: string;
  onChange: (value: any) => void;
}

export interface Subscribers {
  [key: string]: Subscriber[];
}

const subscribers: Subscribers = {};

export const coordinateListening = () => {
  // patternsubscribe (all events)
  cluster.psubscribe("driver-*", (error, _) => {
    if (error !== null) logger.error(error);
  });
  // When clients publishes messages
  cluster.on("pmessage", (pattern, channel, message) => {
    if (pattern.startsWith("driver-")) {
      notifySubscribers(channel, message);
    }
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
