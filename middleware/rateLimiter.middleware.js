const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');
const { StatusCodes } = require('http-status-codes');


const authLimiter = (windowms = 15 * 60 * 1000, maxTime = 100) => rateLimit({
    windowMs: windowms,
    max: maxTime,
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