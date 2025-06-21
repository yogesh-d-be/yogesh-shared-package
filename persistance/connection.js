const mongoose = require("mongoose");
const retry = require("async-retry");
const createLogger = require("../config/logger");

const defaultOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 50,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  retryReads: true,
  w: "majority",
};

const logger = createLogger({ isDev: process.env.NODE_ENV !== "production" });

const connectionStates = new Map();

const createMongooseConnection = async (uri, name = "default", options = {}) => {
  if (!uri || typeof uri !== "string") {
    throw new Error(`Invalid MongoDB URI provided for connection [${name}]`);
  }

  mongoose.set("strictQuery", true);
  const mergedOptions = { ...defaultOptions, ...options };

  // Reuse active connection if already exists
  if (connectionStates.has(name)) {
    const existing = connectionStates.get(name);
    if (existing.readyState === 1) {
      logger.warn(`⚠️ Reusing existing MongoDB connection [${name}]`);
      return existing;
    }
  }

  try {
    const connection = await retry(
      async (bail, attempt) => {
        try {
          logger.info(`🔌 Connecting to MongoDB [${name}], attempt ${attempt}`);
          const conn = mongoose.createConnection(uri, mergedOptions);

          await new Promise((resolve, reject) => {
            conn.once("open", resolve);
            conn.once("error", reject);
          });

          return conn;
        } catch (err) {
          logger.error(`❌ Connection attempt ${attempt} failed [${name}]: ${err.message}`);
          throw err;
        }
      },
      {
        retries: 5,
        minTimeout: 1000,
        maxTimeout: 5000,
        onRetry: (err, attempt) =>
          logger.warn(`Retrying MongoDB [${name}], attempt ${attempt}...`),
      }
    );

    connection.on("connected", () => {
      logger.info(`✅🚀 MongoDB connected [${name}]`);
      connectionStates.set(name, connection);
    });

    connection.on("error", (err) => {
      logger.error(`💥 MongoDB error [${name}]:`, {
        message: err.message,
        code: err.code,
        name: err.name,
        stack: err.stack,
      });

      if (
        err.name === "MongoServerSelectionError" &&
        err.message.includes("bad auth")
      ) {
        logger.fatal("❗ Authentication failed. Exiting...");
        process.exit(1);
      }
    });

    connection.on("disconnected", () => {
      logger.warn(`⚠️ MongoDB disconnected [${name}]`);
      connectionStates.delete(name);
    });

    connection.on("reconnected", () => {
      logger.info(`🔄 MongoDB reconnected [${name}]`);
      connectionStates.set(name, connection);
    });

    connection.on("close", () => {
      logger.info(`🔒 MongoDB connection closed [${name}]`);
      connectionStates.delete(name);
    });

    // Health monitor
    setInterval(() => {
      if (connection.readyState !== 1) {
        logger.warn(
          `⚠️ Health check: MongoDB connection [${name}] not in ready state (${connection.readyState})`
        );
      }
    }, 30000);

    // Graceful shutdown
    const shutdownHandler = async (signal) => {
      try {
        logger.info(`🔌 Received ${signal}, closing MongoDB connection [${name}]...`);
        await connection.close();
        logger.info(`✅ MongoDB [${name}] closed gracefully`);
        process.exit(0);
      } catch (err) {
        logger.error(`❌ Error during shutdown of MongoDB [${name}]`, err);
        process.exit(1);
      }
    };

    ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
      process.once(signal, shutdownHandler)
    );

    // Global error handlers
    process.on("unhandledRejection", (reason, p) => {
      logger.error("Unhandled Promise Rejection:", reason);
    });

    process.on("uncaughtException", (err) => {
      logger.fatal("Uncaught Exception:", err);
      process.exit(1);
    });

    return connection;
  } catch (err) {
    logger.error(`🚨 Failed to connect MongoDB [${name}]:`, {
      message: err.message,
      stack: err.stack,
      uri: maskSensitiveData(uri),
    });
    const finalError = new Error(
      `Failed to establish MongoDB connection [${name}] after retries`
    );
    finalError.originalError = err;
    finalError.connectionName = name;
    throw finalError;
  }
};

// Utility: hide credentials in logs
function maskSensitiveData(uri) {
  try {
    const url = new URL(uri);
    if (url.password) url.password = "*****";
    return url.toString();
  } catch {
    return uri;
  }
}

// Public helper: Get current active connections
createMongooseConnection.getActiveConnections = () => {
  return Array.from(connectionStates.entries()).map(([name, conn]) => ({
    name,
    state: conn.readyState,
    dbName: conn.name,
    host: conn.host,
    port: conn.port,
  }));
};

// Public helper: Close all active connections
createMongooseConnection.closeAll = async () => {
  const result = [];
  for (const [name, conn] of connectionStates.entries()) {
    try {
      await conn.close();
      result.push({ name, status: "closed" });
    } catch (e) {
      result.push({ name, status: "error", error: e.message });
    }
  }
  return result;
};

module.exports = createMongooseConnection;
