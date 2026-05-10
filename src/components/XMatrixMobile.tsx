import { useState } from 'react';
import { QuadrantPanel } from './QuadrantPanel';
import { CorrelationMatrix } from './CorrelationMatrix';
import type { HoshinData, QuadrantId, HoshinItem } from '../types';
import { QUADRANT_META, ADJACENT_PAIRS } from '../types';

interface Props {
  data: HoshinData;
  onAdd: (q: QuadrantId, text: string, owner?: string) => void;
  onUpdate: (q: QuadrantId, id: string, u: Partial<Pick<HoshinItem, 'text' | 'owner'>>) => void;
  onRemove: (q: QuadrantId, id: string) => void;
  onCycleCorrelation: (q1: QuadrantId, id1: string, q2: QuadrantId, id2: string) => void;
}

type Tab = QuadrantId | 'correlations';

const TABS: { id: Tab; label: string }[] = [
  { id: 'breakthrough', label: 'Goals' },
  { id: 'annual', label: 'Annual' },
  { id: 'initiatives', label: 'Initiatives' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'correlations', label: 'Links' },
];

export function XMatrixMobile({ data, onAdd, onUpdate, onRemove, onCycleCorrelation }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('breakthrough');

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {activeTab !== 'correlations' ? (
          <div className="h-full">
            <QuadrantPanel
              quadrant={activeTab as QuadrantId}
              items={data[activeTab as QuadrantId]}
              onAdd={onAdd}
              onUpdate={onUpdate}
              onRemove={onRemove}
              position="north"
            />
          </div>
        ) : (
          <div className="p-3 space-y-3">
            <h3 className="text-sm font-bold text-slate-300">Correlation Matrices</h3>
            <p className="text-xs text-slate-500">
              Click cells to cycle: empty → weak (outline) → strong (filled) → empty
            </p>
            {ADJACENT_PAIRS.map(([a, b]) => (
              <div
                key={`${a}-${b}`}
                className="bg-slate-800/60 rounded-lg border border-slate-700/50 p-2"
              >
                <p className="text-xs font-medium text-slate-400 mb-1">
                  <span style={{ color: QUADRANT_META[a].color }}>{QUADRANT_META[a].label}</span>
                  {' ↔ '}
                  <span style={{ color: QUADRANT_META[b].color }}>{QUADRANT_META[b].label}</span>
                </p>
                <CorrelationMatrix
                  quadrantA={a}
                  quadrantB={b}
                  itemsA={data[a]}
                  itemsB={data[b]}
                  correlations={data.correlations}
                  onCycle={onCycleCorrelation}
                  position="top-left"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom tab bar */}
      <nav className="shrink-0 flex bg-slate-800 border-t border-slate-700 no-print">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const color =
            tab.id !== 'correlations'
              ? QUADRANT_META[tab.id as QuadrantId].color
              : '#94a3b8';
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-white' : 'text-slate-500'
              }`}
              style={isActive ? { borderTop: `2px solid ${color}`, color } : {}}
            >
              {tab.label}
              {tab.id !== 'correlations' && (
                <span className="block text-[10px] opacity-60">
                  ({data[tab.id as QuadrantId].length})
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
