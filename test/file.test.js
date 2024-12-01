// File test - testing the file controller
const request = require("supertest");
const app = require("../src/app");

describe("File Controller", () => {
  it("should upload a file", async () => {
    const response = await request(app).post("/api/files/upload").send({
      file: "test.txt",
    });
  });

  it("should get user files", async () => {
    const response = await request(app).get("/api/files/get");
  });

  it("should update file details", async () => {
    const response = await request(app).put("/api/files/put");
  });

  it("should delete file", async () => {
    const response = await request(app).delete("/api/files/:id");
  });
});

module.exports = {
  test: "test",
};
