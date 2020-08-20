const faker = require("faker");
const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../../app.js");

describe("User Service", () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("Add new User", () => {
    it("When data is valid, then it should create user", async () => {
      const { status } = await request(app)
        .post("/user")
        .send({ name: faker.name.findName(), email: faker.internet.email() });
      expect(status).toBe(201);
    });
    it("When data is valid, then it should not create duplicate user", async () => {
      const email = faker.internet.email();
      const { status } = await request(app).post("/user").send({ name: faker.name.findName(), email });
      expect(status).toBe(201);

      const { status: duplicateStatus } = await request(app).post("/user").send({ name: faker.name.findName(), email });
      expect(duplicateStatus).toBe(409);
    });
    it("When data is invalid, then it should return err", async () => {
      const { status } = await request(app).post("/user").send({ email: faker.lorem.text() });
      expect(status).toBe(400);
    });
  });
});
