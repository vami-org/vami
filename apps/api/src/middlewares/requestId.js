import crypto from "crypto";

/**
 * Express middleware attaching a unique tracking ID to each incoming request.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export default function requestId(req, res, next) {
  // Read request id from header if supplied, otherwise generate a native random UUID
  const reqId =
    req.headers["x-request-id"] ||
    `req_${crypto.randomUUID().replace(/-/g, "")}`;

  req.id = reqId;
  res.setHeader("X-Request-Id", reqId);

  next();
}
