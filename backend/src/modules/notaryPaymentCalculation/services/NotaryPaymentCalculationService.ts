export class NotaryPaymentCalculationService {
  getNotaryPaymentCalculation(estateTotalValue: number): {
    total: number;
    fee: number;
    vat: number;
  } {
    const intervals = [
      { limit: 500000, rate: 0.02 },
      { limit: 1000000, rate: 0.009 },
      { limit: 3000000, rate: 0.005 },
      { limit: 30000000, rate: 0.001 },
      { limit: 100000000, rate: 0.0005 },
    ];

    let reward = 0;
    let previousLimit = 0;

    for (const interval of intervals) {
      if (estateTotalValue <= previousLimit) break;

      const amountInInterval =
        Math.min(estateTotalValue, interval.limit) - previousLimit;
      reward += amountInInterval * interval.rate;
      previousLimit = interval.limit;
    }

    const roundToTwo = (num: number) => Math.round(num * 100) / 100;

    const fee = roundToTwo(Math.max(reward, 2000));
    const vat = roundToTwo(fee * 0.21);
    const total = roundToTwo(fee + vat);
    return { total, fee, vat };
  }
}
