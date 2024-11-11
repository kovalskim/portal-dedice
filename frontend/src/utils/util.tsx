export const insertIdToUrl = (url: string, id: number) => {
  return url.replace(':id', String(id));
};
