const validator = require("../../util/validator.js");

const validateUser = validator.compile({
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "User",
  description: "user creation schema",
  required: ["name", "email"],
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 2,
      maxLength: 255,
    },
    email: {
      type: "string",
      format: "email",
    },
  },
});

module.exports = { validateUser };
