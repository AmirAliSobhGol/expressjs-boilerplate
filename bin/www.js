#!/usr/bin/env node

/**
 * Module dependencies.
 */

const http = require("http");

const { logger } = require("../util/logger");
const app = require("../app");
const { registerGracefulHandler } = require("../util/graceful-shutdown");

const server = http.createServer(app);

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const port = normalizePort(process.env.PORT || "3000");

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind}`);
};

app.set("port", port);

if (process.env.NODE_ENV === "production") {
  registerGracefulHandler(server);
}

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
