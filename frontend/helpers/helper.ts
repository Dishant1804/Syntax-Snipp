
export const truncateDescription = (description: string): string => {
  const words = description.split(' ');
  if (words.length > 18) {
    return words.slice(0, 18).join(' ') + '...';
  }
  return description;
};

export const truncateTitle = (title: string): string => {
  const words = title.split(' ');
  if (words.length > 18) {
    return words.slice(0, 18).join(' ') + '...';
  }
  return title;
};