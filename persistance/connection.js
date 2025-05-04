const mongoose = require("mongoose");
const logger = require("../config/logger");

const defaultOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 50,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

const createMongooseConnection = (uri, name = "default", options = {}) => {
  mongoose.set("strictQuery", true);
  const mergedOptions = { ...defaultOptions, ...options };

  const connection = mongoose.createConnection(uri, mergedOptions);

  connection.on("connected", () => {
    logger.info(`MongoDB connected [${name}]`);
  });

  connection.on("error", (err) => {
    logger.error(`MongoDB connection error [${name}]:`, err);
  });

  connection.on("disconnected", () => {
    logger.warn(`MongoDB disconnected [${name}]`);
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await connection.close();
    logger.info(`MongoDB [${name}] disconnected through app termination`);
    process.exit(0);
  });

  return connection;
};

module.exports = createMongooseConnection;
