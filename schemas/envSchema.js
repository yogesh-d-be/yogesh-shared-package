const Joi = require('joi');
const ApiError = require('../utils/apiError');

const envSchemaCreate = (data = []) => {
    if(!Array.isArray(data)) throw new ApiError(400, 'Data must be send as an array');
    let obj = {}
    for(const [key, description] of data){
        obj[key.toUpperCase()] = Joi.string().required().description(description);
    }

    return obj;
}

const baseSchema = {
    APP_NAME: Joi.string().required(),
    NODE_ENV: Joi.string().valid('development', 'production').required(),

    MONGODB_URI: Joi.string().uri().required(),
}

exports.getEnvSchema = (values = []) => Joi.object({
    ...baseSchema,
    ...envSchemaCreate(values)
    // HASHING_SECRET: Joi.string().required().des,
    
    // WINDOWMS: Joi.string().required().description("window ms required"),
    // MAX: Joi.string().required().description("window max required"),
}).unknown(true);