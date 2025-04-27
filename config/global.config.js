require('dotenv').config();
const {envSchema} = require('../schemas/envSchema');

const {error, value} = envSchema.validate(process.env,{
    allUnknown: true,
    abortEarly: false
});

if (error) {
    console.error('Environment variable validation error:', error.details);
    process.exit(1);
  } else {
    console.log('Environment variables loaded and validated successfully');
  }


exports.globalConfig = {
    app:{
        name: value.APP_NAME,
        env: value.NODE_ENV,
    },
    mongodb:{
        uri: value.MONGODB_URI
    },
    password:{
        hashPassword:value.HASHING_SECRET
    },
    limiter:{
        windowms: value.WINDOWMS,
        max: value.MAX
    }
}