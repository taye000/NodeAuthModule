import { JwtPayload } from "jsonwebtoken";

export interface IUser {
  id?: string;
  name: string;
  email: string;
  phoneNumber: number;
  password: string;
  photo?: string;
  account_type?: string;
  is_admin?: boolean;
  is_active?: string;
  otp?: string;
  passwordReset?: {
    is_changed: boolean;
  };
}

export interface UserPayload extends JwtPayload {
  email: string;
  phoneNumber?: string;
  name?: string;
  is_active?: boolean;
}
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
