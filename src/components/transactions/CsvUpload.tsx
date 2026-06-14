import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import type { Transaction } from '../../types';
import { parseCSV } from '../../utils/csvParser';

interface Props {
  existingTransactions: Transaction[];
  onImport: (transactions: Transaction[]) => void;
}

export function CsvUpload({ existingTransactions, onImport }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [preview, setPreview] = useState<{ count: number; skipped: number } | null>(null);
  const [pending, setPending] = useState<Transaction[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    setStatus(null);
    setPending(null);
    setPreview(null);
    const result = await parseCSV(file, existingTransactions);
    if (result.error) {
      setStatus({ type: 'error', message: result.error });
      return;
    }
    if (result.transactions.length === 0) {
      setStatus({ type: 'error', message: `No valid expense transactions found. ${result.skipped} rows skipped.` });
      return;
    }
    setPending(result.transactions);
    setPreview({ count: result.transactions.length, skipped: result.skipped });
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }

  function confirmImport() {
    if (!pending) return;
    onImport(pending);
    setStatus({ type: 'success', message: `Imported ${pending.length} transactions successfully.` });
    setPending(null);
    setPreview(null);
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <div className="text-4xl mb-2">📁</div>
        <p className="text-gray-600 font-medium">Drop a CSV file here or click to browse</p>
        <p className="text-sm text-gray-400 mt-1">
          Accepts: Date, Description, Amount columns (most bank export formats)
        </p>
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
      </div>

      {preview && pending && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-blue-800 font-medium">Ready to import {preview.count} transactions</p>
            {preview.skipped > 0 && (
              <p className="text-blue-600 text-sm">{preview.skipped} rows skipped (credits, duplicates, or invalid)</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setPending(null); setPreview(null); }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={confirmImport}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Import
            </button>
          </div>
        </div>
      )}

      {status && (
        <div className={`rounded-lg p-3 text-sm ${
          status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {status.message}
        </div>
      )}
    </div>
  );
}
