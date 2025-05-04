export const getEventDuration = (start?: string, end?: string): string => {
    if (!start || !end) return 'Durée non disponible';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationMs = endDate.getTime() - startDate.getTime();
  
    if (durationMs <= 0) return 'Durée invalide';
  
    const totalMinutes = Math.floor(durationMs / 1000 / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return `${hours > 0 ? `${hours}h` : ''}${minutes > 0 ? ` ${minutes}min` : ''}`.trim();
  };
  