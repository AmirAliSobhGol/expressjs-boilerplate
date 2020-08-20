const express = require("express");
const cookieParser = require("cookie-parser");
const httpLogger = require("morgan");
const helmet = require("helmet");

const { requestIdMiddleware } = require("./util/request-id");
const errorHandlerMiddleware = require("./util/error-handler");
const {
  httpRequestDurationBeforeMiddleware,
  httpRequestDurationAfterMiddleware,
  registerMetricEndpoint,
} = require("./util/http-metrics");
require("./util/mongoose")();

const { userRouter } = require("./components/users");

const isProduction = process.env.NODE_ENV === "production";

const app = express();

app.use(httpRequestDurationBeforeMiddleware);
app.use(requestIdMiddleware);

if (!isProduction) {
  // disable access log in production, it is handled by reverse proxy.
  app.use(httpLogger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

registerMetricEndpoint(app);
app.use("/", userRouter);

app.use((req, res, next) => {
  if (!req.route) {
    res.status(404);
  }
  next();
});

app.use(errorHandlerMiddleware);

app.use(httpRequestDurationAfterMiddleware);

module.exports = app;
