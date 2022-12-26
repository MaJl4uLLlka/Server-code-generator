export const fillPlaceholders = (text: string, data: object): string => {
  if (!text) return '(empty)';

  return text.replace(/{{(.*?)}}/g, (match, property) => {
    return property.split('.').reduce((previous, current) => {
      return previous[current] || previous[current]?.toString() || '';
    }, data);
  });
};
