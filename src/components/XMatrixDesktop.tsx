import { QuadrantPanel } from './QuadrantPanel';
import { CorrelationMatrix } from './CorrelationMatrix';
import type { HoshinData, QuadrantId, HoshinItem } from '../types';

interface Props {
  data: HoshinData;
  onAdd: (q: QuadrantId, text: string, owner?: string) => void;
  onUpdate: (q: QuadrantId, id: string, u: Partial<Pick<HoshinItem, 'text' | 'owner'>>) => void;
  onRemove: (q: QuadrantId, id: string) => void;
  onCycleCorrelation: (q1: QuadrantId, id1: string, q2: QuadrantId, id2: string) => void;
}

export function XMatrixDesktop({ data, onAdd, onUpdate, onRemove, onCycleCorrelation }: Props) {
  return (
    <div className="w-full h-full grid grid-cols-[1fr_1.8fr_1fr] grid-rows-[1fr_1.8fr_1fr] gap-1 p-2">
      {/* Top-left corner: Annual ↔ Initiatives correlation */}
      <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 overflow-hidden">
        <CorrelationMatrix
          quadrantA="annual"
          quadrantB="initiatives"
          itemsA={data.annual}
          itemsB={data.initiatives}
          correlations={data.correlations}
          onCycle={onCycleCorrelation}
          position="top-left"
        />
      </div>

      {/* Top center: Initiatives (North) */}
      <div className="bg-slate-800/80 rounded-lg border border-slate-700/50 overflow-hidden">
        <QuadrantPanel
          quadrant="initiatives"
          items={data.initiatives}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onRemove={onRemove}
          position="north"
        />
      </div>

      {/* Top-right corner: Initiatives ↔ Metrics correlation */}
      <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 overflow-hidden">
        <CorrelationMatrix
          quadrantA="initiatives"
          quadrantB="metrics"
          itemsA={data.initiatives}
          itemsB={data.metrics}
          correlations={data.correlations}
          onCycle={onCycleCorrelation}
          position="top-right"
        />
      </div>

      {/* Middle-left: Annual Objectives (West) */}
      <div className="bg-slate-800/80 rounded-lg border border-slate-700/50 overflow-hidden">
        <QuadrantPanel
          quadrant="annual"
          items={data.annual}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onRemove={onRemove}
          position="west"
        />
      </div>

      {/* Center: X graphic */}
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[300px] max-h-[300px] opacity-20">
          <line x1="10" y1="10" x2="190" y2="190" stroke="white" strokeWidth="1.5" />
          <line x1="190" y1="10" x2="10" y2="190" stroke="white" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="white" strokeWidth="1" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-300 font-bold text-lg">X-Matrix</p>
            <p className="text-slate-500 text-xs mt-1">Click items in corners to set correlations</p>
          </div>
        </div>
      </div>

      {/* Middle-right: Metrics (East) */}
      <div className="bg-slate-800/80 rounded-lg border border-slate-700/50 overflow-hidden">
        <QuadrantPanel
          quadrant="metrics"
          items={data.metrics}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onRemove={onRemove}
          position="east"
        />
      </div>

      {/* Bottom-left corner: Breakthrough ↔ Annual correlation */}
      <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 overflow-hidden">
        <CorrelationMatrix
          quadrantA="breakthrough"
          quadrantB="annual"
          itemsA={data.breakthrough}
          itemsB={data.annual}
          correlations={data.correlations}
          onCycle={onCycleCorrelation}
          position="bottom-left"
        />
      </div>

      {/* Bottom center: Breakthrough Objectives (South) */}
      <div className="bg-slate-800/80 rounded-lg border border-slate-700/50 overflow-hidden">
        <QuadrantPanel
          quadrant="breakthrough"
          items={data.breakthrough}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onRemove={onRemove}
          position="south"
        />
      </div>

      {/* Bottom-right corner: Metrics ↔ Breakthrough correlation */}
      <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 overflow-hidden">
        <CorrelationMatrix
          quadrantA="metrics"
          quadrantB="breakthrough"
          itemsA={data.metrics}
          itemsB={data.breakthrough}
          correlations={data.correlations}
          onCycle={onCycleCorrelation}
          position="bottom-right"
        />
      </div>
    </div>
  );
}
