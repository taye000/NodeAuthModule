import nodemailer from "nodemailer";

export const mailer = async (code: any, email: any) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_SMTP_KEY!,
    },
  });
  let mailOptions = {
    from: "taylorgitari@gmail.com",
    to: email,
    subject: "account recovery code",
    html: `<!DOCTYPE>
    <html>
    <body>
    <p>Your authentication code is : </p><b>${code}</b>
    </body>
    </html>
`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    return {
        error: false,
        info,
    };
  } catch (error: any) {
    console.log("Error sending mail", error.message);
  }
};

