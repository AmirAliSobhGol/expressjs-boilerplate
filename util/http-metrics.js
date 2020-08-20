const prometheus = require("prom-client");

prometheus.collectDefaultMetrics();

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  // buckets for response time from 5ms to 500ms
  buckets: [5, 15, 50, 100, 150, 200, 250, 300, 400, 500],
});

const httpRequestDurationBeforeMiddleware = (req, res, next) => {
  res.locals.startEpoch = Date.now();
  next();
};

const httpRequestDurationAfterMiddleware = (req, res, next) => {
  const responseTimeInMs = Date.now() - res.locals.startEpoch;
  const path = req.route ? req.route.path : "/404";

  httpRequestDurationMicroseconds.labels(req.method, path, res.statusCode).observe(responseTimeInMs);

  next();
};

const registerMetricEndpoint = (app) => {
  app.get("/metrics", (req, res, next) => {
    res.set("Content-Type", prometheus.register.contentType);
    res.end(prometheus.register.metrics());
    next();
  });
};

module.exports = {
  httpRequestDurationBeforeMiddleware,
  httpRequestDurationAfterMiddleware,
  registerMetricEndpoint,
};
