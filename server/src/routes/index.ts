import { Application } from "express";

export const configureRoutes = (app: Application) => {
  app.use("/users", require("./api/users"));
  app.use("/users", require("./api/auth"));
};
