import { Express } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import expressRateLimit from "express-rate-limit";
import hpp from "hpp";
import cookieSession from "cookie-session";

const xss = require("xss-clean");

export const configureMiddleware = (app: Express) => {
  //initialize express
  app.use(express.json());

  //mongodb sanitize
  app.use(mongoSanitize());

  //cookie parser
  app.use(cookieParser());

  //form parser middleware
  app.use(express.urlencoded({ extended: true }));

  //enable cors
  app.use(cors());

  //cookie session
  app.use(
    cookieSession({
      signed: true,
      secure: false,
      keys: ["key1", "key2"],
      maxAge: 24 * 60 * 60 * 1000, //24 hours
    })
  );

  //prevent xss attacks
  app.use(xss());

  //prevent http param polution
  app.use(hpp());

  app.use(
    expressRateLimit({
      windowMs: 10 * 60 * 1000, //10 minutes
      max: 100, //limit each ip address to 100 requests per windowMs
    })
  );
};
