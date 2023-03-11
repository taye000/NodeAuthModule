import { Client } from "africastalking-ts";

const client = new Client({
  apiKey: process.env.AFRICASTALKING_APIKEY!,
  username: process.env.AFRICASTALKING_USERNAME!,
});

export const sms = async (code: any, phoneNumber: any) => {
  client
    .sendSms({
      to: [phoneNumber],
      message: code,
    })
    .then((response) => console.log("sms sent", response))
    .catch((error) => console.error("error sending sms", error.message));
};
