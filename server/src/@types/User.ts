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
  passwordReset?: {
    is_changed: boolean;
    code?: string;
  };
  passwordResetToken?: string;
}
