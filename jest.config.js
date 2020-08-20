// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  coverageDirectory: "coverage",

  coveragePathIgnorePatterns: ["/node_modules/"],

  coverageProvider: "v8",

  preset: "@shelf/jest-mongodb",

  testEnvironment: "node",
};