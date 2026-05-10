import { useCallback, useSyncExternalStore } from 'react';
import { v4 as uuid } from 'uuid';
import type { HoshinData, QuadrantId, CorrelationStrength, HoshinItem } from './types';
import { correlationKey } from './types';

const STORAGE_KEY = 'hoshin-kanri-data';

function createDefaultData(): HoshinData {
  return {
    title: 'Hoshin Kanri X-Matrix',
    breakthrough: [],
    annual: [],
    initiatives: [],
    metrics: [],
    correlations: {},
  };
}

function loadData(): HoshinData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as HoshinData;
  } catch { /* ignore */ }
  return createDefaultData();
}

let data = loadData();
const listeners = new Set<() => void>();

function emit() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  listeners.forEach((l) => l());
}

function getSnapshot(): HoshinData {
  return data;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useHoshinStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot);

  const setTitle = useCallback((title: string) => {
    data = { ...data, title };
    emit();
  }, []);

  const addItem = useCallback((quadrant: QuadrantId, text: string, owner?: string) => {
    const item: HoshinItem = { id: uuid(), text, owner };
    data = { ...data, [quadrant]: [...data[quadrant], item] };
    emit();
  }, []);

  const updateItem = useCallback(
    (quadrant: QuadrantId, id: string, updates: Partial<Pick<HoshinItem, 'text' | 'owner'>>) => {
      data = {
        ...data,
        [quadrant]: data[quadrant].map((item) =>
          item.id === id ? { ...item, ...updates } : item,
        ),
      };
      emit();
    },
    [],
  );

  const removeItem = useCallback((quadrant: QuadrantId, id: string) => {
    data = {
      ...data,
      [quadrant]: data[quadrant].filter((item) => item.id !== id),
      correlations: Object.fromEntries(
        Object.entries(data.correlations).filter(
          ([key]) => !key.includes(id),
        ),
      ),
    };
    emit();
  }, []);

  const setCorrelation = useCallback(
    (q1: QuadrantId, id1: string, q2: QuadrantId, id2: string, strength: CorrelationStrength) => {
      const key = correlationKey(q1, id1, q2, id2);
      const newCorrelations = { ...data.correlations };
      if (strength === 'none') {
        delete newCorrelations[key];
      } else {
        newCorrelations[key] = strength;
      }
      data = { ...data, correlations: newCorrelations };
      emit();
    },
    [],
  );

  const cycleCorrelation = useCallback(
    (q1: QuadrantId, id1: string, q2: QuadrantId, id2: string) => {
      const key = correlationKey(q1, id1, q2, id2);
      const current = data.correlations[key] || 'none';
      const next: CorrelationStrength =
        current === 'none' ? 'weak' : current === 'weak' ? 'strong' : 'none';
      const newCorrelations = { ...data.correlations };
      if (next === 'none') {
        delete newCorrelations[key];
      } else {
        newCorrelations[key] = next;
      }
      data = { ...data, correlations: newCorrelations };
      emit();
    },
    [],
  );

  const importData = useCallback((newData: HoshinData) => {
    data = newData;
    emit();
  }, []);

  const resetData = useCallback(() => {
    data = createDefaultData();
    emit();
  }, []);

  return {
    state,
    setTitle,
    addItem,
    updateItem,
    removeItem,
    setCorrelation,
    cycleCorrelation,
    importData,
    resetData,
  };
}
