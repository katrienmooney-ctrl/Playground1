import { useState, useContext } from 'react';
import { TransactionContext } from '../App';
import { CsvUpload } from '../components/transactions/CsvUpload';
import { ManualEntryForm } from '../components/transactions/ManualEntryForm';
import { TransactionTable } from '../components/transactions/TransactionTable';
import type { Transaction } from '../types';

export function TransactionsPage() {
  const { transactions, addTransactions, updateCategory, deleteTransaction, clearAll } = useContext(TransactionContext);
  const [tab, setTab] = useState<'table' | 'csv' | 'manual'>('table');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  function handleImport(txns: Transaction[]) {
    addTransactions(txns);
    setTab('table');
  }

  function handleAddManual(t: Transaction) {
    addTransactions([t]);
    setTab('table');
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 text-sm mt-1">{transactions.length} total transactions</p>
        </div>
        {transactions.length > 0 && (
          showClearConfirm ? (
            <div className="flex gap-2 items-center">
              <span className="text-sm text-red-600">Delete all?</span>
              <button onClick={() => { clearAll(); setShowClearConfirm(false); }} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Yes, delete</button>
              <button onClick={() => setShowClearConfirm(false)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setShowClearConfirm(true)} className="px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
              Clear All
            </button>
          )
        )}
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(['table', 'csv', 'manual'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              tab === t ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'table' ? '📋 All Transactions' : t === 'csv' ? '📁 Import CSV' : '✏️ Add Manually'}
          </button>
        ))}
      </div>

      {tab === 'table' && (
        <TransactionTable
          transactions={transactions}
          onUpdateCategory={updateCategory}
          onDelete={deleteTransaction}
        />
      )}
      {tab === 'csv' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Import from CSV</h2>
          <CsvUpload existingTransactions={transactions} onImport={handleImport} />
        </div>
      )}
      {tab === 'manual' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
          <h2 className="font-semibold text-gray-800 mb-4">Add Transaction Manually</h2>
          <ManualEntryForm onAdd={handleAddManual} />
        </div>
      )}
    </div>
  );
}
