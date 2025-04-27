const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');
const {globalConfig} = require('../config/global.config');
const { StatusCodes } = require('http-status-codes');


const authLimiter = rateLimit({
    windowMs: globalConfig.limiter.windowms,
    max: globalConfig.limiter.max,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        const clientIP = req.ip;
        logger.warn(`Rate limit exceeded by IP: ${clientIP} on ${req.originalUrl}`);

        res.status(StatusCodes.TOO_MANY_REQUESTS).json({ //429
            status: false,
            message: 'Too many requests, please try again later'
        })
        
    }
});

module.exports = {
    authLimiter
}