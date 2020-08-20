const { createTerminus } = require("@godaddy/terminus");
const mongoose = require("mongoose");

const { logger, loggerSync } = require("./logger");

const signals = ["SIGTERM", "SIGINT"];

const healthCheck = () => {
  return Promise.resolve();
};

const readyCheck = () => {
  return new Promise((resolve, reject) => {
    const { readyState } = mongoose.connection;
    // ERR_CONNECTING_TO_MONGO
    if (readyState === 0 || readyState === 3) {
      return reject(new Error("Mongoose has disconnected"));
    }
    // CONNECTING_TO_MONGO
    if (readyState === 2) {
      return reject(new Error("Mongoose is connecting"));
    }
    return resolve();
  });
};

const registerGracefulHandler = (server) => {
  const beforeShutdown = () => {
    // delay shutdown to ensure the pod is removed from loadbalancer upstreams
    return new Promise((resolve) => {
      setTimeout(resolve, 1 * 1000);
    });
  };

  const onSignal = async () => {
    await mongoose.disconnect();
  };

  const onShutdown = () => {
    return new Promise((resolve) => {
      logger.flush();
      loggerSync.info("flushed in-memory logs");
      loggerSync.info("exiting");
      resolve();
    });
  };

  const options = {
    healthChecks: {
      "/health": healthCheck,
      "/ready": readyCheck,
      verbatim: true,
    },
    caseInsensitive: true,

    // cleanup options
    timeout: 60 * 1000,
    signals,
    beforeShutdown,
    onSignal,
    onShutdown,

    logger: loggerSync.error.bind(logger),
  };

  createTerminus(server, options);
};

const initiateGracefulShutdown = () => {
  loggerSync.warn("initating graceful shutdown");
  process.kill(process.pid, "SIGTERM");
};

module.exports = { registerGracefulHandler, initiateGracefulShutdown };
