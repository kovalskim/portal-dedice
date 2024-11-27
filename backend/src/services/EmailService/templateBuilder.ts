import * as fs from 'fs/promises';
import mjml2html from 'mjml';

export function getEmailBody(mjml: string): string {
  const { html } = mjml2html(mjml);
  return html;
}

export async function buildLayout(...bodies: string[]): Promise<string> {
  const layout = await fs.readFile(
    'src/services/emailService/template/_layout.mjml',
    'utf-8',
  );
  return layout.replace(/<%=\s*body\s*%>/, bodies.join(''));
}

export async function buildHeading(content: string): Promise<string> {
  const heading = await fs.readFile(
    'src/services/emailService/template/heading.mjml',
    'utf-8',
  );
  return heading.replace(/<%=\s*content\s*%>/, content);
}

export async function buildText(content: string): Promise<string> {
  const text = await fs.readFile(
    'src/services/emailService/template/text.mjml',
    'utf-8',
  );
  return text.replace(/<%=\s*content\s*%>/, content);
}

export async function buildButton(
  title: string,
  href: string,
): Promise<string> {
  const button = await fs.readFile(
    'src/services/emailService/template/button.mjml',
    'utf-8',
  );
  return button
    .replace(/<%=\s*title\s*%>/, title)
    .replace(/<%=\s*href\s*%>/, href);
}

export async function buildLink(title: string, href: string): Promise<string> {
  const link = await fs.readFile(
    'src/services/emailService/template/link.mjml',
    'utf-8',
  );
  return link
    .replace(/<%=\s*title\s*%>/, title)
    .replace(/<%=\s*href\s*%>/, href);
}
