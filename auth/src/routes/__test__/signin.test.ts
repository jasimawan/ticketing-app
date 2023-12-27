import request from "supertest";
import app from "../../app";

it("fails when email that doesn't exists is supplied", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "test" })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "test" })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "test123" })
    .expect(400);
});

it("response with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "test" })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "test" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
