const { StatusCodes } = require('http-status-codes');
const ApiError = require("../utils/apiError");
const buildJoiSchema = require("../schemas/joiSchema");

function validateSchema(bodySchemaDef = null, querySchemaDef = null, paramsSchemaDef = null) {
  return (req, res, next) => {
    const isUpdate = req.method === "PUT" || req.method === "PATCH";
    const errors = [];

    if (bodySchemaDef) {
      const schema = buildJoiSchema(bodySchemaDef, isUpdate);
      const { error } = schema.validate(req.body);
      if (error) {
        errors.push(...error.details.map((e) => `Body: ${e.message.replace(/["]/g, "")}`));
      }
    }

    if (querySchemaDef) {
      const schema = buildJoiSchema(querySchemaDef);
      const { error } = schema.validate(req.query);
      if (error) {
        errors.push(...error.details.map((e) => `Query: ${e.message.replace(/["]/g, "")}`));
      }
    }

    if (paramsSchemaDef) {
      const schema = buildJoiSchema(paramsSchemaDef);
      const { error } = schema.validate(req.params);
      if (error) {
        errors.push(...error.details.map((e) => `Params: ${e.message.replace(/["]/g, "")}`));
      }
    }

    if (errors.length > 0) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, errors.join(", ")));
    }

    next();
  };
}

module.exports = validateSchema;
