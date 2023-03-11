import { Application } from "express";

export const configureRoutes = (app: Application) => {
  app.use("/api/users", require("./api/users"));
};
