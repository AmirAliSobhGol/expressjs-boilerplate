const mongoose = require("mongoose");

const { logger } = require("./logger");
const { initiateGracefulShutdown } = require("./graceful-shutdown");

const MONGO_URL = process.env.MONGO_URL || "mongodb://admin:password@localhost:27017/?authSoruce=admin";

const connectToMongo = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
    });
    logger.info("connected to mongo");
    const conn = mongoose.connection;
    conn.on("disconnected", () => {
      logger.error("disconnected from mongo");
    });
    conn.on("error", (err) => {
      logger.error(err);
    });
    conn.on("connected", () => {
      logger.info("connected to mongo");
    });
    conn.on("reconnectFailed", () => {
      logger.error("mongoose has reached maximum retried connections");
      initiateGracefulShutdown();
    });
  } catch (err) {
    logger.error(`unable to connect to mongo on initial connection. ${err.message}`);
    initiateGracefulShutdown();
  }
};

module.exports = connectToMongo;
