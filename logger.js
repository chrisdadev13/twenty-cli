import chalk from "chalk";
import winston from "winston";
import { format } from "winston";

// Custom log levels, extending default levels
const levels = {
  ...winston.config.npm.levels,
  success: 4,
};

// Custom console format for colored output
const consoleFormat = format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    const prefix = (() => {
      switch (level) {
        case "error":
          return chalk.red("✖");
        case "warn":
          return chalk.yellow("⚠");
        case "info":
          return chalk.blue("ℹ");
        case "debug":
          return chalk.gray("🔍");
        case "success":
          return chalk.green("✔");
        default:
          return "•";
      }
    })();

    const meta = Object.keys(metadata).length
      ? chalk.gray(JSON.stringify(metadata))
      : "";

    const time = chalk.gray(new Date(timestamp).toLocaleTimeString());

    const coloredMessage = (() => {
      switch (level) {
        case "error":
          return chalk.red(message);
        case "warn":
          return chalk.yellow(message);
        case "info":
          return chalk.blue(message);
        case "debug":
          return chalk.gray(message);
        case "success":
          return chalk.green(message);
        default:
          return message;
      }
    })();

    return `${prefix} ${time} ${coloredMessage} ${meta}`;
  },
);

// Create logger with console transport only
export const logger = winston.createLogger({
  levels,
  level: "success", // Set default level to 'success'
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: format.combine(format.timestamp(), consoleFormat),
    }),
  ],
});
