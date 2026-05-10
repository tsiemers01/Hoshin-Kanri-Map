import { Toolbar } from './components/Toolbar';
import { XMatrixDesktop } from './components/XMatrixDesktop';
import { XMatrixMobile } from './components/XMatrixMobile';
import { useHoshinStore } from './store';
import { useIsMobile } from './hooks/useMediaQuery';

function App() {
  const {
    state,
    setTitle,
    addItem,
    updateItem,
    removeItem,
    cycleCorrelation,
    importData,
    resetData,
  } = useHoshinStore();

  const isMobile = useIsMobile();

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white">
      <Toolbar
        title={state.title}
        onTitleChange={setTitle}
        data={state}
        onImport={importData}
        onReset={resetData}
      />
      <main className="flex-1 min-h-0">
        {isMobile ? (
          <XMatrixMobile
            data={state}
            onAdd={addItem}
            onUpdate={updateItem}
            onRemove={removeItem}
            onCycleCorrelation={cycleCorrelation}
          />
        ) : (
          <XMatrixDesktop
            data={state}
            onAdd={addItem}
            onUpdate={updateItem}
            onRemove={removeItem}
            onCycleCorrelation={cycleCorrelation}
          />
        )}
      </main>
    </div>
  );
}

export default App;
