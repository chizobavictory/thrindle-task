import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "chizoba.victory1@gmail.com",
    pass: process.env.GMAIL_PASS || "vpttyopdahrrbede",
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if (to.length < 5 || subject.length < 1 || html.length < 1) {
      const errorMessage =
        to.length < 5 ? "recipient(to) not specified" : subject.length < 1 ? "subject not specified" : "html template not specified";
      throw new Error(errorMessage);
    }
    const response = await transport.sendMail({
      from: process.env.FROM_ADMIN_EMAIL || "chizoba.victory1@gmail.com",
      to,
      subject,
      html,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
