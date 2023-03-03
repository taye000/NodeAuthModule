import express from "express";
import { createServer } from "http";
import { connectDB } from "./config";
import { config } from "./config/config";
import { configureMiddleware } from "./middleware";
import { configureRoutes } from "./routes";

const Main = async () => {
  //connect to db
  await connectDB();

  //initialize express
  const app = express();

  //configure express middleware
  configureMiddleware(app);

  //set up routes
  configureRoutes(app);

  //start server
  const httpServer = createServer(app);
  httpServer.listen(config.PORT || 5000, () => {
    console.log(`Server started at port ${config.PORT}`, httpServer.address());
  });
};

Main();
