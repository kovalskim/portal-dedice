import * as fs from 'fs/promises';
import mjml2html from 'mjml';
import path from 'path';

export function getEmailBody(mjml: string): string {
  const { html } = mjml2html(mjml);
  return html;
}

export async function buildLayout(...bodies: string[]): Promise<string> {
  const layoutPath = path.join(__dirname, 'template/_layout.mjml');
  const layout = await fs.readFile(layoutPath, 'utf-8');
  return layout.replace(/<%=\s*body\s*%>/, bodies.join(''));
}

export async function buildHeading(content: string): Promise<string> {
  const headingPath = path.join(__dirname, 'template/heading.mjml');
  const heading = await fs.readFile(headingPath, 'utf-8');
  return heading.replace(/<%=\s*content\s*%>/, content);
}

export async function buildText(content: string): Promise<string> {
  const textPath = path.join(__dirname, 'template/text.mjml');

  const text = await fs.readFile(textPath, 'utf-8');
  return text.replace(/<%=\s*content\s*%>/, content);
}

export async function buildButton(
  title: string,
  href: string,
): Promise<string> {
  const buttonPath = path.join(__dirname, 'template/button.mjml');
  const button = await fs.readFile(buttonPath, 'utf-8');
  return button
    .replace(/<%=\s*title\s*%>/, title)
    .replace(/<%=\s*href\s*%>/, href);
}

export async function buildLink(title: string, href: string): Promise<string> {
  const linkPath = path.join(__dirname, 'template/link.mjml');
  const link = await fs.readFile(linkPath, 'utf-8');
  return link
    .replace(/<%=\s*title\s*%>/, title)
    .replace(/<%=\s*href\s*%>/, href);
}
