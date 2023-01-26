import { connection, connect, set, ConnectOptions } from "mongoose";
import { config } from "./config";

export const connectDB = async () => {
  set("strictQuery", false);
  connect(config.mongoDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .catch((err) => console.log(err.message));

  const db = connection;

  db.on("error", () => console.error("error connecting to db"));
  db.once("open", () => console.log("Connected to DB"));
};
