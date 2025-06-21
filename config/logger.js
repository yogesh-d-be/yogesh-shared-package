const path = require('path');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

winston.addColors({
  info: 'green',
  error: 'red',
  warn: 'yellow',
  debug: 'blue'
});

// Error formatter
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    return Object.assign({}, info, {
      message: info.message,
      stack: info.stack,
    });
  }
  return info;
});

// Log format
const getLogFormat = () =>
  winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    enumerateErrorFormat(),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
        : `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  );

// Main logger factory
const createLogger = ({
  isDev = process.env.NODE_ENV !== 'production',
  logDirectory = path.join(process.cwd(), 'logs'),
  options = { logInfo: true, logError: true },
}) => {
  const logOptions = {
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
  };

  const logFiles = {
    info: path.join(logDirectory, 'app-%DATE%.log'),
    error: path.join(logDirectory, 'error-%DATE%.log'),
  };

  const transports = [];

  if (options.logInfo) {
    transports.push(
      new DailyRotateFile({
        filename: logFiles.info,
        level: 'info',
        ...logOptions,
      })
    );
  }

  if (options.logError) {
    transports.push(
      new DailyRotateFile({
        filename: logFiles.error,
        level: 'error',
        ...logOptions,
      })
    );
  }

  // if (isDev) {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          getLogFormat()
        ),
      })
    );
  // }

  return winston.createLogger({
    level: isDev ? 'debug' : 'info',
    format: getLogFormat(),
    transports,
    exitOnError: false,
  });
};

module.exports = createLogger;
