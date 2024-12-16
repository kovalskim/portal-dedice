import { Transporter } from 'nodemailer';

import {
  buildButton,
  buildHeading,
  buildLayout,
  buildLink,
  buildText,
  getEmailBody,
} from '@backend/services/EmailService/templateBuilder';
import { toVocative } from '@shared/utils/languageUtils';

export class EmailService {
  private transporter: Transporter;

  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  async sendVerificationEmail(email: string, token: string) {
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

    await this.sendEmail(email, subject, htmlContent);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const subject: string = 'Zapomenuté heslo';

    const resetLink = `${process.env.APP_URL}/auth/new-password?token=${token}`;

    const bodies = await Promise.all([
      buildHeading('Zapomenuté heslo'),
      buildText(
        `Na základě Vašeho požadavku Vám zasíláme odkaz pro změnu hesla k účtu: ${email}`,
      ),
      buildText('Nové heslo si můžete nastavit kliknutím na tlačítko níže:'),
      buildButton('Nastavit nové heslo', encodeURI(resetLink)),
      buildText('Nebo zkopírujte a vložte tuto URL do svého prohlížeče:'),
      buildLink(resetLink, encodeURI(resetLink)),
      buildText(
        'Tento odkaz je z důvodu zabezpečení Vašeho účtu platný pouze 1 hodinu od odeslání požadavku o změnu hesla.',
      ),
      buildText(
        'Tento e-mail byl automaticky vygenerován na základě vyplnění žádosti o změnu hesla. Pokud jste o změnu hesla nezažádali, pravděpodobně se jedná o omyl. V takovém případě tento e-mail ignorujte.',
      ),
    ]);

    const layout = await buildLayout(...bodies);
    const htmlContent = getEmailBody(layout);

    await this.sendEmail(email, subject, htmlContent);
  }

  async sendNewMessageNotification(
    email: string,
    firstname: string,
    sender: string,
    text: string,
    proceedingId: number,
    proceedingNumber: string,
  ) {
    const subject: string = `Nová zpráva v chatu - dědické řízení ${proceedingNumber}`;

    const bodies = await Promise.all([
      buildHeading(`Dobrý den, ${toVocative(firstname)},`),
      buildText(`Máte novou zprávu od uživatele ${sender}:`),
      buildText(text),
      buildButton(
        'Zobrazit zprávu v aplikaci',
        encodeURI(`${process.env.APP_URL}/proceedings/${proceedingId}/chat`),
      ),
    ]);

    const layout = await buildLayout(...bodies);
    const htmlContent = getEmailBody(layout);

    await this.sendEmail(email, subject, htmlContent);
  }

  async sendEmailToParticipant(
    title: string,
    message: string,
    proceedingId: number,
    proceedingNumber: string,
    email: string,
  ) {
    const subject: string = `Hromadná zpráva z Portálu dědice - dědické řízení ${proceedingNumber}`;
    const portalLink = `${process.env.APP_URL}/proceedings/${proceedingId}/overview`;

    const bodies = await Promise.all([
      buildHeading(title),
      buildText(message),
      buildText('Do Portálu dědice se můžete přihlásit níže:'),
      buildButton('Přihlásit se do Portálu dědice', encodeURI(portalLink)),
    ]);

    const layout = await buildLayout(...bodies);
    const htmlContent = getEmailBody(layout);

    await this.sendEmail(email, subject, htmlContent);
  }

  async sendParticipantInvitationEmail(
    email: string,
    firstname: string,
    lastname: string,
    token: string,
  ) {
    const subject = 'Pozvánka do Portálu dědice';

    const invitationLink = `${process.env.APP_URL}/proceedings?invitation_token=${token}`;

    const bodies = await Promise.all([
      buildHeading(`Dobrý den, ${toVocative(firstname)}`),
      buildText('Byl/a jste pozván/a k účasti v dědickém řízení.'),
      buildButton('Přijmout pozvánku', encodeURI(invitationLink)),
      buildText('Nebo zkopírujte a vložte tuto URL do svého prohlížeče:'),
      buildLink(invitationLink, encodeURI(invitationLink)),
      buildText(
        'Tento e-mail byl automaticky vygenerován. Pokud tuto pozvánku nepoznáváte, pravděpodobně se jedná o omyl. V takovém případě tento e-mail ignorujte.',
      ),
    ]);

    const layout = await buildLayout(...bodies);
    const htmlContent = getEmailBody(layout);

    await this.sendEmail(email, subject, htmlContent);
  }

  async sendBulkEmail(
    title: string,
    message: string,
    proceedingId: number,
    proceedingNumber: string,
    receivers: string[],
  ) {
    // send email to all receivers
    for (const receiver of receivers) {
      await this.sendEmailToParticipant(
        title,
        message,
        proceedingId,
        proceedingNumber,
        receiver,
      );
    }
  }

  private async sendEmail(to: string, subject: string, htmlContent: string) {
    const mailOptions = {
      from: `Portál dědice <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
