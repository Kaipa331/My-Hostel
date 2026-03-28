export const calculateFees = (monthlyRent: number) => {
  const bookingFee = Math.round(monthlyRent * 0.05); // 5%
  const depositAmount = Math.round(monthlyRent * 0.50); // 50%
  const totalInitialPayment = bookingFee + depositAmount;
  
  return {
    monthlyRent,
    bookingFee,
    depositAmount,
    totalInitialPayment
  };
};
