import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER || '',
    pass: process.env.GMAIL_PASS || '',
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.APP_URL}/auth/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Ověření emailové adresy',
    html: `
      <h1>Ověření emailové adresy</h1>
      <p>Pro verifikaci emailové adresy klikněte na odkaz níže:</p>
      <a href="${encodeURI(
        verificationLink,
      )}" style="color: blue; text-decoration: underline;">Verify Email</a>
      <p>Nebo zkopírujte a vložte toto URL do svého prohlížeče:</p>
      <p><a href="${encodeURI(verificationLink)}">${verificationLink}</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });
};
