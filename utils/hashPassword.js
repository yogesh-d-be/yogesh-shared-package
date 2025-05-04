const bcrypt = require('bcryptjs');
const ApiError = require('./apiError');

const createPasswordUtils = (saltRounds = 12) => {
  if (typeof saltRounds !== 'number' || saltRounds < 4) {
    throw new Error('saltRounds must be a number >= 4');
  }

  const hashPassword = async (plainPassword) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      return await bcrypt.hash(plainPassword, salt);
    } catch (err) {
      throw new ApiError('Error hashing password: ' + err.message);
    }
  };

  const verifyPassword = async (plainPassword, hashedPassword) => {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (err) {
      throw new ApiError('Error verifying password: ' + err.message);
    }
  };

  return {
    hashPassword,
    verifyPassword,
  };
};

module.exports = createPasswordUtils;
