import { createContext, useCallback, useContext, useState } from 'react';
import type { Page, Transaction, BudgetLimits, CategoryRule } from './types';
import { ALL_CATEGORIES } from './types';
import { useTransactions } from './hooks/useTransactions';
import { useBudgets } from './hooks/useBudgets';
import { useCategories } from './hooks/useCategories';
import { useCategoryRules } from './hooks/useCategoryRules';
import { getAvailableMonths } from './utils/budgetCalc';
import { CATEGORY_COLORS, CUSTOM_COLOR_PALETTE } from './constants/categories';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BreakdownPage } from './pages/BreakdownPage';
import { TotalsPage } from './pages/TotalsPage';
import { TipsPage } from './pages/TipsPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { CategoriesPage } from './pages/CategoriesPage';

export interface TransactionContextType {
  transactions: Transaction[];
  addTransactions: (txns: Transaction[]) => void;
  updateCategory: (id: string, category: string) => void;
  updateCategoryByDescription: (descriptionRaw: string, category: string) => void;
  deleteTransaction: (id: string) => void;
  clearAll: () => void;
}

interface BudgetContextType {
  budgets: BudgetLimits;
  setBudget: (category: string, amount: number) => void;
}

export interface CategoryContextType {
  allCategories: string[];
  getCategoryColor: (cat: string) => string;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (name: string) => void;
  isBuiltIn: (name: string) => boolean;
}

export interface CategoryRulesContextType {
  rules: CategoryRule[];
  addRule: (descriptionRaw: string, category: string) => void;
  applyRule: (description: string) => string | null;
  deleteRule: (descriptionNorm: string) => void;
}

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  addTransactions: () => {},
  updateCategory: () => {},
  updateCategoryByDescription: () => {},
  deleteTransaction: () => {},
  clearAll: () => {},
});

export const BudgetContext = createContext<BudgetContextType>({
  budgets: {},
  setBudget: () => {},
});

export const CategoryContext = createContext<CategoryContextType>({
  allCategories: ALL_CATEGORIES,
  getCategoryColor: () => '#94a3b8',
  addCategory: () => {},
  deleteCategory: () => {},
  isBuiltIn: () => true,
});

export const CategoryRulesContext = createContext<CategoryRulesContextType>({
  rules: [],
  addRule: () => {},
  applyRule: () => null,
  deleteRule: () => {},
});

export function useCategoryContext() {
  return useContext(CategoryContext);
}

function App() {
  const txState = useTransactions();
  const budgetState = useBudgets();
  const { customCategories, addCategory, deleteCategory } = useCategories();
  const rulesState = useCategoryRules();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const allCategories = [...ALL_CATEGORIES, ...customCategories.map(c => c.name)];

  const getCategoryColor = useCallback((cat: string): string => {
    if (cat in CATEGORY_COLORS) return CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS];
    const custom = customCategories.find(c => c.name === cat);
    if (custom) return custom.color;
    const idx = Array.from(cat).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % CUSTOM_COLOR_PALETTE.length;
    return CUSTOM_COLOR_PALETTE[idx];
  }, [customCategories]);

  const isBuiltIn = useCallback((name: string) => ALL_CATEGORIES.includes(name), []);

  const availableMonths = getAvailableMonths(txState.transactions);

  return (
    <TransactionContext.Provider value={txState}>
      <BudgetContext.Provider value={budgetState}>
        <CategoryContext.Provider value={{ allCategories, getCategoryColor, addCategory, deleteCategory, isBuiltIn }}>
          <CategoryRulesContext.Provider value={rulesState}>
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
                  {activePage === 'transactions' && <TransactionsPage selectedMonth={selectedMonth} />}
                  {activePage === 'breakdown' && <BreakdownPage selectedMonth={selectedMonth} />}
                  {activePage === 'totals' && <TotalsPage />}
                  {activePage === 'tips' && <TipsPage selectedMonth={selectedMonth} />}
                  {activePage === 'calculator' && <CalculatorPage />}
                  {activePage === 'categories' && <CategoriesPage />}
                </main>
              </div>
            </div>
          </CategoryRulesContext.Provider>
        </CategoryContext.Provider>
      </BudgetContext.Provider>
    </TransactionContext.Provider>
  );
}

export default App;
