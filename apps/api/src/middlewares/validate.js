import { ValidationError } from "../services/errors.js";

/**
 * Express middleware builder wrapping Zod validations.
 * Parsed request properties are replaced with validated objects.
 *
 * @param {import('zod').ZodSchema} schema - Zod validation schema definition
 * @returns {import('express').RequestHandler}
 */
export default function validate(schema) {
  return (req, res, next) => {
    try {
      const payload = {};
      if (schema.shape.body) payload.body = req.body;
      if (schema.shape.query) payload.query = req.query;
      if (schema.shape.params) payload.params = req.params;

      const validated = schema.parse(payload);

      // Mutate request parameters to hold clean parsed variables
      if (validated.body !== undefined) req.body = validated.body;
      if (validated.query !== undefined) req.query = validated.query;
      if (validated.params !== undefined) req.params = validated.params;

      next();
    } catch (error) {
      if (error.errors) {
        const details = {};
        error.errors.forEach((err) => {
          // Flatten paths: e.g. ["body", "email"] -> "email"
          const key = err.path.slice(1).join(".") || err.path[0];
          details[key] = err.message;
        });
        return next(new ValidationError("Input validation failed", details));
      }
      next(error);
    }
  };
}
