export default function RunCard({ run, onOpen }) {
  const statusColor = {
    running: 'bg-emerald-500/20 text-emerald-300',
    finished: 'bg-blue-500/20 text-blue-300',
    failed: 'bg-rose-500/20 text-rose-300',
    crashed: 'bg-rose-500/20 text-rose-300',
    queued: 'bg-amber-500/20 text-amber-300',
  }

  const state = (run.state || '').toLowerCase()
  const badge = statusColor[state] || 'bg-slate-500/20 text-slate-300'

  return (
    <button
      onClick={() => onOpen && onOpen(run)}
      className="w-full text-left bg-slate-800/60 border border-slate-700 rounded-xl p-4 hover:bg-slate-800 transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white font-semibold truncate max-w-[220px]">{run.displayName || run.name}</div>
          <div className="text-xs text-slate-400 mt-1 truncate max-w-[220px]">{run.id}</div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${badge}`}>{run.state}</div>
      </div>
      {run.metrics && Object.keys(run.metrics).length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {Object.entries(run.metrics).slice(0,6).map(([k,v]) => (
            <div key={k} className="bg-slate-900/50 border border-slate-700 rounded p-2">
              <div className="text-[10px] text-slate-400 truncate">{k}</div>
              <div className="text-sm text-slate-100 font-mono truncate">{typeof v === 'number' ? v.toFixed(4) : String(v)}</div>
            </div>
          ))}
        </div>
      )}
      {run.tags && run.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {run.tags.slice(0,5).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-200">{t}</span>
          ))}
        </div>
      )}
    </button>
  )
}
