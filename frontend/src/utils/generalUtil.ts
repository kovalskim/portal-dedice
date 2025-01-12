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
    ' Kč'
  );
};

export const getFileNameWithoutExtension = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return fileName;
  }
  return fileName.slice(0, lastDotIndex);
};

export const getImageDimensions = (
  file: File,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = URL.createObjectURL(file);
  });
};

export const sanitizeHtml = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const elements = doc.body.querySelectorAll('*');

  elements.forEach((el) => el.removeAttribute('style'));

  return doc.body.innerHTML;
};
