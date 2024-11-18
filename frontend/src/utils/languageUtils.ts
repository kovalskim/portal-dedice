import { vocative } from 'czech-vocative';

export const firstNameInVokativ = (firstName: string | undefined) => {
  if (!firstName) return '';
  const name = vocative(firstName);
  return name.charAt(0).toUpperCase() + name.slice(1);
};
