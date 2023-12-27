import request from "supertest";
import app from "../../app";

it("returns 201 on successful sign up", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "test" })
    .expect(201);
});

it("returns 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test", password: "test" })
    .expect(400);
});

it("returns 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "t" })
    .expect(400);
});

it("returns 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com" })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({ password: "test" })
    .expect(400);
});

it("disallows duplicates emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "test" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "test" })
    .expect(400);
});

it("sets a cookie after successful sign up", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "test" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
