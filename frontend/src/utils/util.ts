import { format } from 'date-fns';

export const insertIdToUrl = (url: string, id: number) => {
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
