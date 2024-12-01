// auth.test.js
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Auth API", () => {
  beforeAll(async () => {
    // remove the test user from the database
    await User.deleteOne({ email: "testuser@example.com" });
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  it("should login a user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "testpassword",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});
