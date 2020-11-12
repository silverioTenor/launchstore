import nodemailer from 'nodemailer';

const mailer = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "80f9d4949ab184",
    pass: "9d092ab0ee6654"
  }
});

export default mailer;