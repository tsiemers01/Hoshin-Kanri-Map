import { useState } from 'react';
import type { QuadrantId, HoshinItem } from '../types';
import { QUADRANT_META } from '../types';

interface Props {
  quadrant: QuadrantId;
  items: HoshinItem[];
  onAdd: (quadrant: QuadrantId, text: string, owner?: string) => void;
  onUpdate: (quadrant: QuadrantId, id: string, updates: Partial<Pick<HoshinItem, 'text' | 'owner'>>) => void;
  onRemove: (quadrant: QuadrantId, id: string) => void;
  position: 'south' | 'west' | 'north' | 'east';
}

export function QuadrantPanel({ quadrant, items, onAdd, onUpdate, onRemove }: Props) {
  const [newText, setNewText] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [showForm, setShowForm] = useState(false);

  const meta = QUADRANT_META[quadrant];

  const handleAdd = () => {
    if (!newText.trim()) return;
    onAdd(quadrant, newText.trim(), newOwner.trim() || undefined);
    setNewText('');
    setNewOwner('');
    setShowForm(false);
  };

  const startEdit = (item: HoshinItem) => {
    setEditingId(item.id);
    setEditText(item.text);
    setEditOwner(item.owner || '');
  };

  const saveEdit = () => {
    if (!editingId || !editText.trim()) return;
    onUpdate(quadrant, editingId, {
      text: editText.trim(),
      owner: editOwner.trim() || undefined,
    });
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-between px-3 py-2 rounded-t-lg"
        style={{ backgroundColor: meta.color + '22', borderBottom: `2px solid ${meta.color}` }}
      >
        <div className="min-w-0">
          <h3 className="text-sm font-bold truncate" style={{ color: meta.color }}>
            {meta.label}
          </h3>
          <p className="text-[10px] text-slate-400 truncate">{meta.subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="ml-2 shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white hover:brightness-110 transition text-sm font-bold"
          style={{ backgroundColor: meta.color }}
          title="Add item"
        >
          +
        </button>
      </div>

      {showForm && (
        <div className="p-2 bg-slate-800/50 border-b border-slate-700 space-y-1">
          <input
            type="text"
            placeholder="Description..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="w-full px-2 py-1 text-xs bg-slate-700 rounded text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-sky-400"
            autoFocus
          />
          <div className="flex gap-1">
            <input
              type="text"
              placeholder="Owner (optional)"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 px-2 py-1 text-xs bg-slate-700 rounded text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-sky-400"
            />
            <button
              onClick={handleAdd}
              className="px-2 py-1 text-xs rounded text-white font-medium"
              style={{ backgroundColor: meta.color }}
            >
              Add
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-2 py-1 text-xs rounded text-slate-300 bg-slate-700 hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-1 space-y-0.5">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group flex items-start gap-1.5 px-2 py-1.5 rounded hover:bg-slate-700/50 transition-colors"
          >
            {editingId === item.id ? (
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  className="w-full px-2 py-1 text-xs bg-slate-700 rounded text-white outline-none focus:ring-1 focus:ring-sky-400"
                  autoFocus
                />
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={editOwner}
                    placeholder="Owner"
                    onChange={(e) => setEditOwner(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    className="flex-1 px-2 py-1 text-xs bg-slate-700 rounded text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-sky-400"
                  />
                  <button onClick={saveEdit} className="px-2 py-0.5 text-xs rounded bg-sky-600 text-white">
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-2 py-0.5 text-xs rounded bg-slate-600 text-white">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                  style={{ backgroundColor: meta.color }}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-200 leading-snug">{item.text}</p>
                  {item.owner && (
                    <p className="text-[10px] text-slate-400 mt-0.5">Owner: {item.owner}</p>
                  )}
                </div>
                <div className="shrink-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(item)}
                    className="w-5 h-5 rounded text-slate-400 hover:text-white hover:bg-slate-600 flex items-center justify-center text-[10px]"
                    title="Edit"
                  >
                    &#9998;
                  </button>
                  <button
                    onClick={() => onRemove(quadrant, item.id)}
                    className="w-5 h-5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-600 flex items-center justify-center text-[10px]"
                    title="Delete"
                  >
                    &#10005;
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-slate-500 text-center py-4 italic">
            No items yet. Click + to add.
          </p>
        )}
      </div>
    </div>
  );
}
