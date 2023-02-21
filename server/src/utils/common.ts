import { randomBytes } from "crypto";

export const randomCode = async (length: number = 6) => {
  try {
    const bytes = await randomBytes(Math.ceil(length / 2));
    const code = bytes.toString("hex").slice(0, length);
    return code;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
