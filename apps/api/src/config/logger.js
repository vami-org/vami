import pino from "pino";
import env from "./env.js";

/**
 * High-performance structured JSON logger using Pino.
 */
const logger = pino({
  level: env.LOG_LEVEL,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
