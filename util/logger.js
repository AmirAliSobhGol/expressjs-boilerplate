const pino = require("pino");
const { getRequestId } = require("./request-id.js");

const isProduction = process.env.NODE_ENV === "production";
const logLevel = process.env.LOG_LEVEL || (isProduction ? "warn" : "info");

const options = {
  level: logLevel,
};

const destination = isProduction
  ? pino.destination({
      minLength: 8192,
      sync: false,
    })
  : null;

const logger = pino(options, destination);
const loggerSync = pino(options);
const loggerWithId = pino(
  {
    ...options,
    mixin() {
      return { requestId: getRequestId() };
    },
  },
  destination
);

// asynchronously flush every 1 seconds to keep the buffer empty
// in periods of low activity
setInterval(function flushLog() {
  logger.flush();
}, 1 * 1000).unref();

module.exports = { logger, loggerWithId, loggerSync };
