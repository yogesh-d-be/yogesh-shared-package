const mongoose = require('mongoose');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('../utils/logger');
const ApiError = require('../utils/apiError');
const { globalConfig } = require('../config/global.config');


const errorConverter = (err, req, res, next) => {
  let error = err;

  // Convert mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map(e => e.message);
    error = new ApiError(StatusCodes.BAD_REQUEST, `Validation Error: ${messages.join(', ')}`);
  }

  // CastError (invalid ObjectId)
  else if (err instanceof mongoose.Error.CastError) {
    error = new ApiError(StatusCodes.BAD_REQUEST, `Invalid value for ${err.path}: ${err.value}`);
  }

  // Duplicate key error
  else if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(StatusCodes.CONFLICT, `Duplicate field: ${field}`);
  }

  // Not already ApiError
  else if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || ReasonPhrases[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};


const errorHandler = (err, req, res, next) => {

  const isProduction = globalConfig.app.env === "production";
  
    let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    let message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;
  
    logger.error(`${req.method} ${req.originalUrl} - ${statusCode} - ${message}`);

    const response = {
      status: 'error',
      statusCode,
      message: isProduction && !err.isOperational ? ReasonPhrases.INTERNAL_SERVER_ERROR : message,
      ...(isProduction ? {} : {stack: err.stack})
    }

    res.status(statusCode).json(response);
  };
  
  module.exports = {
    errorConverter,
    errorHandler,
  };