import { format, createLogger, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(format.colorize({ all: true })),
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    new transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    new transports.File({ filename: "./logs/combined.log" }),
    new transports.Console({
      format: format.simple(),
    }),
  ],
});

export default logger;
