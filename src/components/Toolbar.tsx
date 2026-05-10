import { useRef } from 'react';
import type { HoshinData } from '../types';

interface Props {
  title: string;
  onTitleChange: (title: string) => void;
  data: HoshinData;
  onImport: (data: HoshinData) => void;
  onReset: () => void;
}

export function Toolbar({ title, onTitleChange, data, onImport, onReset }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hoshin-kanri-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as HoshinData;
        if (parsed.breakthrough && parsed.annual && parsed.initiatives && parsed.metrics) {
          onImport(parsed);
        } else {
          alert('Invalid Hoshin Kanri data file.');
        }
      } catch {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePrint = () => window.print();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      onReset();
    }
  };

  return (
    <header className="shrink-0 flex items-center gap-2 px-3 py-2 bg-slate-800 border-b border-slate-700 no-print flex-wrap">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <svg viewBox="0 0 64 64" className="w-7 h-7 shrink-0">
          <rect width="64" height="64" rx="8" fill="#1e293b" />
          <line x1="8" y1="8" x2="56" y2="56" stroke="#38bdf8" strokeWidth="3" />
          <line x1="56" y1="8" x2="8" y2="56" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="32" cy="32" r="12" fill="none" stroke="#f472b6" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="4" fill="#f472b6" />
        </svg>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-transparent text-white font-bold text-sm sm:text-base outline-none flex-1 min-w-0 border-b border-transparent hover:border-slate-600 focus:border-sky-400 transition-colors px-1"
        />
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleExport}
          className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
          title="Export as JSON"
        >
          Export
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
          title="Import JSON file"
        >
          Import
        </button>
        <button
          onClick={handlePrint}
          className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
          title="Print"
        >
          Print
        </button>
        <button
          onClick={handleReset}
          className="px-2 py-1 text-xs rounded bg-red-900/40 text-red-400 hover:bg-red-900/70 hover:text-red-300 transition-colors"
          title="Reset all data"
        >
          Reset
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </header>
  );
}
