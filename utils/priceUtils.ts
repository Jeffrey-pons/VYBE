export const extractPriceLabel = (conditions: string | undefined): string => {
  if (!conditions) return 'Réserve ta place';

  const lower = conditions.toLowerCase().trim();

  if (
    lower.includes('libre') ||  
    lower.includes('gratuite') ||  
    lower.includes('gratuit') ||  
    lower.match(/^gratuit[\s.,;!?)]*$/m) || 
    lower === 'gratuit' || 
    lower.includes('entrée libre')  
  ) {

    if (lower.includes('sur inscription') || lower.includes('inscription')) {
      return 'Sur inscription';
    }
    return 'Événement Gratuit';
  }


  if (
    lower.includes('inscription') || 
    lower.includes('inscrit') || 
    lower.includes('entrée gratuite sur inscription') || 
    lower.includes('sur inscription') 
  ) {
    return 'Sur inscription';
  }


  const pricePattern = /([^\d]|^)(\d{1,3}[.,]?\d{0,2})[ ]?€([^\w]|$)/g; 
  const rawMatches = [...conditions.matchAll(pricePattern)];
  const prices = rawMatches.map(match => parseFloat(match[2].replace(',', '.'))).filter(p => p < 1000);
  
  if (prices.length > 0) {
    const minPrice = Math.min(...prices);
    if (minPrice === 0) return 'Événement Gratuit';  
    return `À partir de ${minPrice}€`; 
  }

  return 'Réserve ta place';
};
