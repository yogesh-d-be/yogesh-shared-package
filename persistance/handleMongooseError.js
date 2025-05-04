const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ApiError = require("../utils/apiError");

const handleMongooseError = (err, doc, next) => {
  // Handle validation errors
  if (err.name === "ValidationError") {
    const errorMessages = Object.values(err.errors || {}).map((e) => {
      return `${e.path.charAt(0).toUpperCase() + e.path.slice(1)} is required`;
    });
    const message = errorMessages.length > 0 ? errorMessages.join(", ") : ReasonPhrases.BAD_REQUEST;
    return next(new ApiError(StatusCodes.BAD_REQUEST, message));
  }

  // Handle duplicate key errors
  if (err.code && err.code === 11000 && err.keyValue) {
    const fieldName = Object.keys(err.keyValue)[0];
    const fieldValue = err.keyValue[fieldName];
    const message = `The ${fieldName} '${fieldValue}' already exists`;
    return next(new ApiError(StatusCodes.CONFLICT, message));
  }

  // Let other errors pass through
  return next(err);
};

module.exports = handleMongooseError;
