import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: (userId?: string) => string[];
}

jest.mock("../nats-wrapper");

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (userId?: string) => {
  const id = userId || new mongoose.Types.ObjectId().toHexString();
  const token = jwt.sign(
    {
      id,
      email: "test@test.com",
    },
    process.env.JWT_KEY!
  );
  const base64 = Buffer.from(JSON.stringify({ jwt: token })).toString("base64");

  return [`session=${base64}`];
};
