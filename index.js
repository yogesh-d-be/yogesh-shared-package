const { globalConfig } = require("./config/global.config");
const logger = require("./config/logger");
const responseLogger = require('./config/morgan');

const authentication = require('./middleware/auth.middleware');
const errorCatcher = require('./middleware/error.middleware');
const loggerMiddleware = require("./middleware/logger.middleware");
const { authLimiter } = require("./middleware/rateLimiter.middleware");

const { envSchema } = require("./schemas/envSchema");
const joiSchema = require("./schemas/joiSchema");

const ApiError = require("./utils/apiError");
const apiResponse = require('./utils/apiResponse');
const catchAsync = require("./utils/catchAsync");
const { createModel } = require("./utils/createModel");
const  securePassword = require("./utils/hashPassword");
const joiValidation = require('./utils/joiValidation');


module.exports = {
    config:{
        globalConfig,
        logger,
        responseLogger
    },
    middleware:{
        authentication,
        errorCatcher,
        loggerMiddleware,
        authLimiter
    },
    schema:{
        envSchema,
        joiSchema
    },
    utils:{
        customError:ApiError,
        apiResponse,
        asyncTransactionHandler: catchAsync,
        createMongooseModel: createModel,
        securePassword,
        joiValidation
    }
}