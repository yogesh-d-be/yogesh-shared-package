const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
// const config = require('./config');
const loggerConfig = require('../config/logger.config');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    // Object.assign(info, { message: info.stack });
    return Object.assign({}, info, {
      message: info.message,
      stack: info.stack,
    });
  }
 
  return info;
});

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  enumerateErrorFormat(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    // return ` ${timestamp} [${level.toUpperCase()}]: ${message}`;
    return stack
    ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
    : `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

const logger = winston.createLogger({
  level: loggerConfig.isDev ? 'debug' : 'info', // log level
  format: logFormat,
  transports: [
    // new DailyRotateFile({
    //   filename: loggerConfig.logFiles.info,
    //   level: 'info',
    //   ...loggerConfig.logOptions
    // }),
    new DailyRotateFile({
      filename: loggerConfig.logFiles.error,
      level: 'error',
      ...loggerConfig.logOptions
    })
  ],
  exitOnError: true //Winston not to crash the application if an error occurs inside Winston itself 
});


// console logging in development mode
// if (loggerConfig.isDev) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat)
    })
  );
// }

module.exports = logger;