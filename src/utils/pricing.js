export const calculatePrice = (room, checkIn, checkOut) => {
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  let totalPrice = 0;

  for (let i = 0; i < nights; i++) {
    const currentDate = new Date(checkIn);
    currentDate.setDate(currentDate.getDate() + i);
    
    // Check if weekend
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    
    // Check seasonal pricing
    let dayPrice = room.pricing.basePrice;
    
    if (isWeekend && room.pricing.weekendPrice) {
      dayPrice = room.pricing.weekendPrice;
    }
    
    // Check seasonal rates
    if (room.pricing.seasonalPricing) {
      const seasonalRate = room.pricing.seasonalPricing.find(season => {
        const startDate = new Date(season.startDate);
        const endDate = new Date(season.endDate);
        return currentDate >= startDate && currentDate <= endDate;
      });
      
      if (seasonalRate) {
        dayPrice = seasonalRate.price;
      }
    }
    
    totalPrice += dayPrice;
  }

  return totalPrice;
};

export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
};