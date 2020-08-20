const express = require("express");
const createError = require("http-errors");

const { ValidationError, NotFoundError, DuplicateError } = require("../../util/common-errors");
const { createUser, getUser } = require("./controller");

const router = express.Router();

router.get("/user", async (req, res, next) => {
  const { email } = req.query;
  if (!email) {
    return next(createError(404));
  }
  try {
    const user = await getUser(email);
    res.status(200);
    res.json({ data: user });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return next(createError(404));
    }
    return next(createError(500));
  }
  return next();
});

router.post("/user", async (req, res, next) => {
  try {
    await createUser(req.body);
    res.status(201);
    res.json({ message: "success" });
  } catch (err) {
    if (err instanceof ValidationError) {
      return next(createError(400, "Invalid data", { errors: err.errors }));
    }
    if (err instanceof DuplicateError) {
      return next(createError(409));
    }
    return next(createError(500));
  }
  return next();
});

module.exports = router;
