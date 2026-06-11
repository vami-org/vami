import logger from "../config/logger.js";
import { AppError } from "../services/errors.js";

/**
 * Global Express error handling middleware.
 * Formats operational errors into the standard JSON response format.
 *
 * @param {Error} err - Caught error object
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export default function errorHandler(err, req, res, _next) {
  const timestamp = new Date().toISOString();
  const requestId = req.id || "unknown";

  let statusCode = 500;
  let code = "INTERNAL_SERVER_ERROR";
  let message = "An internal server error occurred";
  let details = {};

  if (err instanceof AppError || (err.statusCode && err.code)) {
    // Known operational application error
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details || {};

    // Log warnings for client errors
    logger.warn({
      msg: `Client Error [${code}]: ${message}`,
      requestId,
      statusCode,
      details,
    });
  } else {
    // Unhandled system error: log full stack trace
    logger.error({
      msg: `Unhandled System Error: ${err.message}`,
      requestId,
      error: {
        message: err.message,
        stack: err.stack,
      },
    });

    // In non-production environments, show details for easier developer debugging
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.NODE_ENV !== "test"
    ) {
      message = err.message;
      details = { stack: err.stack };
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
      requestId,
      timestamp,
    },
  });
}
