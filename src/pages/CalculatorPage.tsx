import { InvestmentCalculator } from '../components/calculator/InvestmentCalculator';

export function CalculatorPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Investment Calculator</h1>
        <p className="text-gray-500 text-sm mt-1">
          See how much your monthly savings can grow over time with compound interest
        </p>
      </div>
      <InvestmentCalculator />
    </div>
  );
}
