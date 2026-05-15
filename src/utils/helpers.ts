export const isPriceFilled = (price: string) => {
  if (!price) return false;
  const clean = price.replace('R$', '').trim();
  return clean !== '' && clean !== '0,00' && clean !== '0';
};

export const isRestaurantOpen = (hours: string) => {
  if (!hours) return false;
  try {
    const parts = hours.split(' às ');
    if (parts.length !== 2) return false;
    const [startPart, endPart] = parts;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = startPart.split(':').map(Number);
    const [endH, endM] = endPart.split(':').map(Number);

    const startTime = startH * 60 + startM;
    const endTime = endH * 60 + endM;

    if (endTime < startTime) {
      return currentTime >= startTime || currentTime <= endTime;
    }
    return currentTime >= startTime && currentTime <= endTime;
  } catch (e) {
    return false;
  }
};

export const getStatus = (hours: string) => {
  const open = isRestaurantOpen(hours);
  return {
    isOpen: open,
    label: open ? 'Aberto' : 'Fechado',
    color: open ? '#25D366' : '#FF5252',
  };
};
