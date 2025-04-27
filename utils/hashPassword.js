const argon2 = require('argon2');
const { globalConfig } = require('../config/globalConfig');
const ApiError = require('./apiError');

// Your secret pepper (from environment variables or secure config)
const PEPPER = globalConfig.password.hashPassword || 'SuperSecretPepper';

const hashPassword = async (plainPassword) => {
  try {
    // Combine password with pepper
    const pepperedPassword = plainPassword + PEPPER;

    // Hash the peppered password
    const hash = await argon2.hash(pepperedPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,   // 64 MB
      timeCost: 3,           // 3 terations
      parallelism: 2,        // 2 threads
    });

    return hash;
  } catch (err) {
    throw new ApiError('Error hashing password: ' + err.message);
  }
};

const verifyPassword = async (plainPassword, storedHash) => {
  try {
    const pepperedPassword = plainPassword + PEPPER;

    // Verify password
    return await argon2.verify(storedHash, pepperedPassword);
  } catch (err) {i
    return false;
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
};
