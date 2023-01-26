declare namespace Express {
  interface Request {
    user: any;
    userId?: any;
    session?: any;
  }
  interface Response {
    user: any;
    userId: any;
    session: any;
  }
}
