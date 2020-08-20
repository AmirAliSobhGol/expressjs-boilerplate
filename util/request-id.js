const { AsyncLocalStorage } = require("async_hooks");
const { v4: uuid } = require("uuid");

const asyncLocalStorage = new AsyncLocalStorage();

const requestIdMiddleware = (req, res, next) => {
  asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set("requestId", req.get("X-Request-ID") || uuid());
    next();
  });
};

const getRequestId = () => asyncLocalStorage.getStore().get("requestId");

module.exports = { requestIdMiddleware, getRequestId };
