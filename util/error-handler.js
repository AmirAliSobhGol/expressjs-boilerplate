const { logger } = require("./logger");

const isProduction = process.env.NODE_ENV === "production";

const errorHandlerMiddleware = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.status || 500);
  const response = {
    status: error.status,
    message: error.message,
    stack: error.stack,
    errors: error.errors,
  };
  if (!isProduction) {
    res.json(response);
  } else if (error.status >= 500) {
    logger.error(response);
    res.json({ message: "Something went wrong" });
  } else {
    res.json({ message: error.message, errors: error.errors });
  }
  return next();
};

module.exports = errorHandlerMiddleware;
