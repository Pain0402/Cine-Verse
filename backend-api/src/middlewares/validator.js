const { z } = require("zod");
const jsend = require("../utils/jsend");
const ApiError = require("../api-error");

/**
 * Validates the request object using the provided zod validator.
 * @param {z.AnyZodObject} validator
 */
function validateRequest(validator) {
  return (req, res, next) => {
    try {
      let input = { ...req.params };

      if (req.method === "GET" || req.method === "DELETE") {
        input = { ...input, ...req.query };
      }

      if (req.method === "POST" || req.method === "PUT") {
        input = {
          ...input,
          ...(req.body || {}),
        };
      }
      validator.parse(input);

      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        return jsend.fail(res, firstError.message, 400);
      }
      return next(new ApiError(500, "Internal Server Error from validator."));
    }
  };
}

module.exports = {
  validateRequest,
};
