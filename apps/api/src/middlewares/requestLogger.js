import logger from "../config/logger.js";

/**
 * Express middleware logging incoming requests and measuring processing time durations.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export default function requestLogger(req, res, next) {
  const startTime = process.hrtime();
  const requestId = req.id || "unknown";

  // Log incoming request details
  logger.info({
    msg: `Incoming Request: ${req.method} ${req.originalUrl || req.url}`,
    requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.headers["x-forwarded-for"] || "unknown",
    userAgent: req.headers["user-agent"] || null,
  });

  // Log outgoing response details upon dispatch completion
  res.on("finish", () => {
    const diff = process.hrtime(startTime);
    const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

    logger.info({
      msg: `Request Completed: ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${durationMs}ms)`,
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs: parseFloat(durationMs),
    });
  });

  next();
}
