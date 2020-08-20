const { ValidationError, NotFoundError, DuplicateError } = require("../../util/common-errors");
const { validateUser } = require("./validator");
const UserModel = require("./model");

const createUser = async (data) => {
  const valid = validateUser(data);
  if (!valid) {
    throw new ValidationError("Bad Data", validateUser.errors);
  }
  const user = new UserModel(data);
  try {
    await user.save();
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new DuplicateError("Duplicate Data");
    }
    throw err;
  }
};

const getUser = async (email) => {
  const user = await UserModel.findOne({ email }, "name email");
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

module.exports = { createUser, getUser };
