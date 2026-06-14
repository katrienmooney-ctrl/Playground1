import { useState, useContext } from 'react';
import { CategoryContext } from '../App';
import { ALL_CATEGORIES } from '../types';
import { CUSTOM_COLOR_PALETTE } from '../constants/categories';

export function CategoriesPage() {
  const { allCategories, getCategoryColor, addCategory, deleteCategory, isBuiltIn } = useContext(CategoryContext);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(CUSTOM_COLOR_PALETTE[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const customCategories = allCategories.filter(c => !isBuiltIn(c));

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError('Category name is required.'); return; }
    if (allCategories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setError('A category with that name already exists.');
      return;
    }
    addCategory(trimmed, selectedColor);
    setName('');
    setSelectedColor(CUSTOM_COLOR_PALETTE[0]);
    setError('');
    setSuccess(`"${trimmed}" added successfully.`);
    setTimeout(() => setSuccess(''), 2500);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage spending categories. Add custom ones to track niche spending areas.
        </p>
      </div>

      {/* Add new category */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Add New Category</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Pet Care"
              maxLength={40}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {CUSTOM_COLOR_PALETTE.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    selectedColor === color ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedColor }} />
              <span className="text-xs text-gray-500">Selected: {selectedColor}</span>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add Category
          </button>
        </form>
      </div>

      {/* Custom categories */}
      {customCategories.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Custom Categories</h2>
          <div className="space-y-2">
            {customCategories.map(cat => (
              <div key={cat} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getCategoryColor(cat) }} />
                  <span className="text-sm text-gray-800">{cat}</span>
                </div>
                <button
                  onClick={() => deleteCategory(cat)}
                  className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Built-in categories (read-only reference) */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-3">Built-in Categories</h2>
        <p className="text-xs text-gray-400 mb-3">These categories cannot be removed.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALL_CATEGORIES.map(cat => (
            <div key={cat} className="flex items-center gap-2 py-1">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getCategoryColor(cat) }} />
              <span className="text-sm text-gray-700">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
