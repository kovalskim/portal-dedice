import nodemailer from 'nodemailer';

import {
  buildButton,
  buildHeading,
  buildLayout,
  buildLink,
  buildText,
  getEmailBody,
} from '@backend/services/emailService/templateBuilder';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER || '',
    pass: process.env.GMAIL_PASS || '',
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string,
) => {
  const mailOptions = {
    from: `Portál dědice <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const subject: string = 'Ověření emailové adresy';

  const verificationLink = `${process.env.APP_URL}/auth/verify-email?token=${token}`;

  const bodies = await Promise.all([
    buildHeading('Ověření emailové adresy'),
    buildText('Pro verifikaci emailové adresy klikněte na odkaz níže:'),
    buildButton('Ověřit e-mailovou adresu', encodeURI(verificationLink)),
    buildText('Nebo zkopírujte a vložte toto URL do svého prohlížeče:'),
    buildLink(verificationLink, encodeURI(verificationLink)),
  ]);

  const layout = await buildLayout(...bodies);
  const htmlContent = getEmailBody(layout);

  await sendEmail(email, subject, htmlContent);
};
