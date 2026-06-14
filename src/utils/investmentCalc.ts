import type { YearlyProjection } from '../types';

export function calculateProjections(
  monthlyContribution: number,
  annualRatePercent: number,
  years: number,
): YearlyProjection[] {
  const r = annualRatePercent / 100;
  const results: YearlyProjection[] = [];

  for (let y = 1; y <= years; y++) {
    const n = 12 * y;
    let fv: number;
    if (r === 0) {
      fv = monthlyContribution * n;
    } else {
      const monthlyRate = r / 12;
      fv = monthlyContribution * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate);
    }
    const contributed = monthlyContribution * n;
    results.push({
      year: y,
      futureValue: fv,
      totalContributed: contributed,
      totalInterest: fv - contributed,
    });
  }

  return results;
}
