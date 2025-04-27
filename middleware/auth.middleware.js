const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token with provided data.
 * @param {Object} data - Payload data for the token.
 * @param {string} secret - Secret key for signing the token.
 * @param {string} expiresIn - Expiry duration for the token.
 * @returns {string} - Signed JWT token.
 */
const generateToken = async (data, secret, expiresIn) => {
    return jwt.sign(
        { id: data._id, role: data.role },
        secret,
        { expiresIn }
    );
};

/**
 * Generates an access token.
 * @param {Object} data - Payload data for the token.
 * @returns {Promise<string>} - Access token.
 */
const generateAccessToken = (data, config) => generateToken(data, accessTokenKey, accessTokenExpiry);

/**
 * Generates a refresh token.
 * @param {Object} data - Payload data for the token.
 * @returns {Promise<string>} - Refresh token.
 */
const generateRefreshToken = (data, config) => generateToken(data, refreshTokenKey, refreshTokenExpiry);

/**
 * Middleware to verify an access token and authorize roles.
 * @param {Object} options - Options for the middleware, including the allowed roles and model.
 * @returns {Function} Middleware function.
 */
const verifyAccessToken = (options) => async (req, res, next) => {
    const { allowedRoles, model, accessTokenKey, accessTokenExpiry } = options;

    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Access denied, no token provided", requireLogin: true });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, accessTokenKey);

        // Ensure the role is valid
        if (!decoded.role || ![allowedRoles].flat().includes(decoded.role)) {
            return res.status(403).json({ message: "Access denied, insufficient permissions" });
        }

        // Verify admin or user existence in DB
        const user = await model.findById(decoded.id).lean().select('_id role');
        if (!user) {
            return res.status(401).json({ message: "Access denied, invalid token" });
        }

        req.user = decoded;  // Store user info in the request object
        next();
    } catch (error) {
        return res.status(401).json({ message: error.name === "TokenExpiredError" ? "Token expired" : "Invalid token", requireLogin: true });
    }
};

// Package exports
module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken
};
