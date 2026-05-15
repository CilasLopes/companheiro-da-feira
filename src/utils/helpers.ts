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

export const getNextConfirmedDay = (confirmedDays: string[] | Record<string, boolean> | any, fairSchedules: any[] = []) => {
  if (!confirmedDays) return null;

  const dayMap: Record<string, number> = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6,
    'Domingo': 0, 'Segunda-feira': 1, 'Terça-feira': 2, 'Quarta-feira': 3, 'Quinta-feira': 4, 'Sexta-feira': 5, 'Sábado': 6
  };

  const now = new Date();
  const currentDay = now.getDay();

  let daysToCheck: string[] = [];

  // Se for um objeto de IDs (como no ProducerPanel)
  if (typeof confirmedDays === 'object' && !Array.isArray(confirmedDays)) {
    daysToCheck = fairSchedules
      .filter(s => confirmedDays[s.id])
      .map(s => s.day);
  } else if (Array.isArray(confirmedDays)) {
    daysToCheck = confirmedDays;
  }

  if (daysToCheck.length === 0) return null;

  // Encontra o dia mais próximo (incluindo hoje)
  const sorted = daysToCheck.sort((a, b) => {
    const d1 = (dayMap[a] - currentDay + 7) % 7;
    const d2 = (dayMap[b] - currentDay + 7) % 7;
    return d1 - d2;
  });

  return sorted[0];
};
