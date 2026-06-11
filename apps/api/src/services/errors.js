/**
 * Base Application Error class. All custom operational errors inherit from this.
 */
export class AppError extends Error {
  /**
   * @param {string} message - Descriptive error message
   * @param {number} statusCode - Target HTTP status code
   * @param {string} code - Constant code string representing error type
   * @param {Object} [details={}] - Optional extra details or metadata
   */
  constructor(
    message,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    details = {},
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error class (400 Bad Request) representing form/parameter validation failures.
 */
export class ValidationError extends AppError {
  /**
   * @param {string} [message="Input validation failed"]
   * @param {Object} [details={}] - Field-level error dictionary
   */
  constructor(message = "Input validation failed", details = {}) {
    super(message, 400, "VALIDATION_FAILED", details);
  }
}

/**
 * Authentication / Authorization Error class (401 Unauthorized or 403 Forbidden).
 */
export class AuthError extends AppError {
  /**
   * @param {string} [message="Unauthorized access"]
   * @param {string} [code="UNAUTHORIZED"] - 'UNAUTHORIZED' (401) or 'FORBIDDEN' (403)
   */
  constructor(message = "Unauthorized access", code = "UNAUTHORIZED") {
    super(message, code === "FORBIDDEN" ? 403 : 401, code);
  }
}

/**
 * Not Found Error class (404 Not Found) representing resource omission.
 */
export class NotFoundError extends AppError {
  /**
   * @param {string} [message="Resource not found"]
   * @param {string} [code="NOT_FOUND"]
   */
  constructor(message = "Resource not found", code = "NOT_FOUND") {
    super(message, 404, code);
  }
}

/**
 * Conflict Error class (409 Conflict) representing state conflicts (e.g. duplicates).
 */
export class ConflictError extends AppError {
  /**
   * @param {string} [message="Resource state conflict"]
   * @param {string} [code="CONFLICT"]
   */
  constructor(message = "Resource state conflict", code = "CONFLICT") {
    super(message, 409, code);
  }
}

/**
 * Rate Limit Error class (429 Too Many Requests) representing rate limiter blocks.
 */
export class RateLimitError extends AppError {
  /**
   * @param {string} [message="Too many requests. Please try again later."]
   */
  constructor(message = "Too many requests. Please try again later.") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
  }
}

/**
 * External Downstream Error class (502 Bad Gateway / 503 Service Unavailable) representing external failures (Stripe, Cloudinary, etc.).
 */
export class ExternalError extends AppError {
  /**
   * @param {string} [message="Downstream service failure"]
   * @param {Object} [details={}] - External error response details
   */
  constructor(message = "Downstream service failure", details = {}) {
    super(message, 502, "EXTERNAL_SERVICE_FAILURE", details);
  }
}
