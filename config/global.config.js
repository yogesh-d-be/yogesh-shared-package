require('dotenv').config();
const {getEnvSchema} = require('../schemas/envSchema');



exports.validateEnv = (customKeys = []) => {
  const envSchema = getEnvSchema(
    customKeys.map(({ key, description }) => [key, description])
  );

  const { error, value } = envSchema.validate(process.env, {
    allUnknown: true,
    abortEarly: false
  });

  if (error) {
    console.error(
      '❌ Environment validation error:',
      error.details.map((e) => e.message).join(', ')
    );
    process.exit(1);
  }

  const config = {};

  for (const { key, target = null } of customKeys) {
    const upperKey = key.toUpperCase();
    const lowerKey = key.toLowerCase();

    if (target) {
      config[target] = config[target] || {};
      config[target][lowerKey] = value[upperKey];
    } else {
      config[lowerKey] = value[upperKey];
    }
  }

  return config;
};

