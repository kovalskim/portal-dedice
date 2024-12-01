import { vocative } from 'czech-vocative';

export const toVocative = (name: string | undefined) => {
  if (!name) return '';
  const nameInVocative = vocative(name);
  return nameInVocative.charAt(0).toUpperCase() + nameInVocative.slice(1);
};
