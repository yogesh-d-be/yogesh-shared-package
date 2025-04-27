const Joi = require('joi');

exports.envSchema = Joi.object({
    APP_NAME: Joi.string().required(),
    NODE_ENV: Joi.string().valid('development', 'production').required(),

    MONGODB_URI: Joi.string().uri().required(),

    HASHING_SECRET: Joi.string().uri().required(),

    WINDOWMS: Joi.string().required().description("window ms required"),
    MAX: Joi.string().required().description("window max required"),
}).unknown(true);