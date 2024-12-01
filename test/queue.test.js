// Queue test - testing the queue controller
const request = require("supertest");
const app = require("../src/app");

describe("Queue Controller", () => {
  it("get all queue jobs", async () => {
    const response = await request(app).get("/api/queue/jobs");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("get a queue job", async () => {
    const response = await request(app).get("/api/queue/jobs/:id");
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it("delete a queue job", async () => {
    const response = await request(app).delete("/api/queue/jobs/:id");
    expect(response.status).toBe(200);
  });
});
