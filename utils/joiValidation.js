const { StatusCodes } = require('http-status-codes');
const ApiError = require("./apiError");

exports.validateData = (schema, data, allowUnknown = false) => {
    if (data?.upsert) {
      return data.upsert;
    }
  
    const { error, value } = schema.validate(data, {
      abortEarly: false,  // collect all errors
      allowUnknown,       // allow extra keys if needed
      stripUnknown: true, // auto remove unknown fields
    });
  
    if (error) {
      const formattedErrors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));
  
      console.error("Validation Error:", JSON.stringify(formattedErrors, null, 2));
  
      const err = new Error("Validation failed");
      err.name = "ValidationError";
      err.details = formattedErrors;
     return next(new ApiError(StatusCodes.BAD_REQUESTS, `Vaildation Error: ${err}`))
    }
  
    return value;
  };
  