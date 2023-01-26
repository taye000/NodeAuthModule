import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  mongoDbUri: process.env.MONGODBURI!,
  PORT: process.env.PORT!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_SECRET_EXPIRY: 3600000, //expires in 1 hour
};
