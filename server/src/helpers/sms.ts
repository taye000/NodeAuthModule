import { Client } from "africastalking-ts";

const client = new Client({
  apiKey: process.env.AFRICASTALKING_APIKEY!,
  username: process.env.AFRICASTALKING_USERNAME!,
});

export const sms = async (code: any) => {
  client
    .sendSms({
      to: ["+254712069869"],
      message: code,
    })
    .then((response) => console.log("sms sent", response))
    .catch((error) => console.error("error sending sms", error.message));
};
