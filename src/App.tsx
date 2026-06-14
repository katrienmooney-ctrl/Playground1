import { createContext, useState } from 'react';
import type { Page, Transaction, BudgetLimits, Category } from './types';
import { useTransactions } from './hooks/useTransactions';
import { useBudgets } from './hooks/useBudgets';
import { getAvailableMonths } from './utils/budgetCalc';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BreakdownPage } from './pages/BreakdownPage';
import { TotalsPage } from './pages/TotalsPage';
import { TipsPage } from './pages/TipsPage';
import { CalculatorPage } from './pages/CalculatorPage';

interface TransactionContextType {
  transactions: Transaction[];
  addTransactions: (txns: Transaction[]) => void;
  updateCategory: (id: string, category: Category) => void;
  deleteTransaction: (id: string) => void;
  clearAll: () => void;
}

interface BudgetContextType {
  budgets: BudgetLimits;
  setBudget: (category: Category, amount: number) => void;
}

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  addTransactions: () => {},
  updateCategory: () => {},
  deleteTransaction: () => {},
  clearAll: () => {},
});

export const BudgetContext = createContext<BudgetContextType>({
  budgets: {},
  setBudget: () => {},
});

function App() {
  const txState = useTransactions();
  const budgetState = useBudgets();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const availableMonths = getAvailableMonths(txState.transactions);

  return (
    <TransactionContext.Provider value={txState}>
      <BudgetContext.Provider value={budgetState}>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          <Sidebar activePage={activePage} onNavigate={setActivePage} />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              availableMonths={availableMonths}
            />
            <main className="flex-1 overflow-y-auto p-6">
              {activePage === 'dashboard' && <DashboardPage selectedMonth={selectedMonth} />}
              {activePage === 'transactions' && <TransactionsPage />}
              {activePage === 'breakdown' && <BreakdownPage selectedMonth={selectedMonth} />}
              {activePage === 'totals' && <TotalsPage />}
              {activePage === 'tips' && <TipsPage selectedMonth={selectedMonth} />}
              {activePage === 'calculator' && <CalculatorPage />}
            </main>
          </div>
        </div>
      </BudgetContext.Provider>
    </TransactionContext.Provider>
  );
}

export default App;
