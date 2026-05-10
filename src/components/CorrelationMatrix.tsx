import type { QuadrantId, HoshinItem, CorrelationStrength } from '../types';
import { correlationKey, QUADRANT_META } from '../types';

interface Props {
  quadrantA: QuadrantId;
  quadrantB: QuadrantId;
  itemsA: HoshinItem[];
  itemsB: HoshinItem[];
  correlations: Record<string, CorrelationStrength>;
  onCycle: (q1: QuadrantId, id1: string, q2: QuadrantId, id2: string) => void;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function CorrelationMatrix({
  quadrantA,
  quadrantB,
  itemsA,
  itemsB,
  correlations,
  onCycle,
  position,
}: Props) {
  if (itemsA.length === 0 || itemsB.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-xs p-2 text-center">
        Add items to both
        <br />
        quadrants to see
        <br />
        correlations
      </div>
    );
  }

  const colorA = QUADRANT_META[quadrantA].color;
  const colorB = QUADRANT_META[quadrantB].color;

  const isTopRow = position === 'top-left' || position === 'top-right';

  const rowItems = isTopRow ? itemsA : itemsB;
  const colItems = isTopRow ? itemsB : itemsA;
  const rowColor = isTopRow ? colorA : colorB;
  const colColor = isTopRow ? colorB : colorA;
  const rowQuadrant = isTopRow ? quadrantA : quadrantB;
  const colQuadrant = isTopRow ? quadrantB : quadrantA;

  return (
    <div className="flex flex-col h-full p-1 overflow-auto">
      <div className="flex-1 min-h-0">
        <table className="w-full h-full border-collapse text-[10px]">
          <thead>
            <tr>
              <th className="w-6"></th>
              {colItems.map((item, i) => (
                <th
                  key={item.id}
                  className="p-0.5 text-center font-normal truncate max-w-[40px]"
                  style={{ color: colColor }}
                  title={item.text}
                >
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowItems.map((rowItem, ri) => (
              <tr key={rowItem.id}>
                <td
                  className="p-0.5 font-medium truncate max-w-[40px]"
                  style={{ color: rowColor }}
                  title={rowItem.text}
                >
                  {ri + 1}
                </td>
                {colItems.map((colItem) => {
                  const key = correlationKey(rowQuadrant, rowItem.id, colQuadrant, colItem.id);
                  const strength = correlations[key] || 'none';
                  return (
                    <td
                      key={colItem.id}
                      className="text-center cursor-pointer hover:bg-slate-600/30 rounded transition-colors p-0.5"
                      onClick={() => onCycle(rowQuadrant, rowItem.id, colQuadrant, colItem.id)}
                      title={`${rowItem.text} ↔ ${colItem.text}: ${strength}`}
                    >
                      {strength === 'strong' && (
                        <span className="inline-block w-3 h-3 rounded-full bg-white"></span>
                      )}
                      {strength === 'weak' && (
                        <span className="inline-block w-3 h-3 rounded-full border-2 border-white/60"></span>
                      )}
                      {strength === 'none' && (
                        <span className="inline-block w-3 h-3 rounded-full border border-slate-600"></span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
