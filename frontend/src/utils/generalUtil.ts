import { format } from 'date-fns';

export const insertIdToUrl = (url: string, id: number | string) => {
  return url.replace(':id', String(id));
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDatetime = (date: Date) => {
  return format(date, 'dd/MM HH:mm');
};

export const formatTimestamp = (date: Date): string => {
  return format(date, 'dd.MM.yyyy HH:mm:ss');
};

export const formatPrice = (price: number) => {
  return (
    new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 }).format(price) +
    '\u00A0Kč'
  );
};

export const toBoolean = (str?: string): boolean => {
  if (str === undefined) return false;
  return str.toLowerCase() === 'true';
};

export const sanitizeHtml = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const elements = doc.body.querySelectorAll('*');

  elements.forEach((el) => el.removeAttribute('style'));

  return doc.body.innerHTML;
};

export const getNextOrderValue = (prevOrder: 'asc' | 'desc' | 'default') => {
  if (prevOrder === 'asc') {
    return 'desc';
  } else if (prevOrder === 'desc') {
    return 'default';
  } else {
    return 'asc';
  }
};
