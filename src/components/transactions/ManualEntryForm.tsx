import { useState } from 'react';
import type { Transaction, Category } from '../../types';
import { ALL_CATEGORIES } from '../../types';
import { categorize } from '../../utils/categorize';

interface Props {
  onAdd: (transaction: Transaction) => void;
}

export function ManualEntryForm({ onAdd }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Other');
  const [success, setSuccess] = useState(false);

  function handleDescriptionBlur() {
    if (description.trim()) {
      setCategory(categorize(description));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!date || !description.trim() || isNaN(amt) || amt <= 0) return;

    onAdd({
      id: crypto.randomUUID(),
      date,
      description: description.trim(),
      amount: amt,
      category,
      source: 'manual',
    });

    setDescription('');
    setAmount('');
    setCategory('Other');
    setDate(today);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          onBlur={handleDescriptionBlur}
          placeholder="e.g. Starbucks coffee"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ALL_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Add Transaction
      </button>
      {success && (
        <p className="text-green-600 text-sm text-center">Transaction added successfully!</p>
      )}
    </form>
  );
}
