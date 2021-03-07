import fetch from "node-fetch";
import { EXPRESS_PORT } from "../app";
/**
 * This file contains helpersfor talking to the coordinator service.
 */

export const registerLoadBalancer = async () => {
  if (process.env["USE_LOADBALANCER"] === "TRUE") {
    const endpoint = process.env["LOADBALANCER_URL"] + "/register-service";
    return new Promise<void>(async (resolve) => {
      try {
        await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            port: EXPRESS_PORT,
          }),
        });
        resolve();
      } catch (error) {
        console.log(`👮🏻‍♂️🚫 Loadbalancer Service was not found. Exiting...`);
        // process.exit(0);
      }
    });
  }
};

export const registerDriverService = async () => {
  if (process.env["USE_COORDINATOR"] === "FALSE") return;
  const endpoint = process.env["COORDINATOR_URL"] + "/register";
  return new Promise<void>(async (resolve) => {
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          port: EXPRESS_PORT,
        }),
      });
      resolve();
    } catch (error) {
      console.log(`👮🏻‍♂️🚫 Coordinator Service was not found. Exiting...`);
      process.exit(0);
    }
  });
};
