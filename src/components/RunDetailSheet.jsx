import { useEffect, useState } from 'react'

export default function RunDetailSheet({ open, onClose, runRef, backendUrl }) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDetails = async () => {
      if (!open || !runRef) return
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ entity: runRef.entity, project: runRef.project, run: runRef.name })
        const res = await fetch(`${backendUrl}/api/wandb/run?${params.toString()}`)
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        const json = await res.json()
        setData(json)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [open, runRef, backendUrl])

  return (
    <div className={`fixed inset-0 z-40 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      {/* sheet */}
      <div className={`absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto transition-transform ${open ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="text-white font-semibold">Run Details</div>
            <button onClick={onClose} className="text-slate-300 hover:text-white">Close</button>
          </div>
          {loading && <div className="text-slate-300 mt-4">Loading...</div>}
          {error && <div className="text-rose-400 mt-4">{error}</div>}
          {data && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Info label="Name" value={data.run.displayName || data.run.name} />
                <Info label="State" value={data.run.state} />
                <Info label="Created" value={new Date(data.run.createdAt).toLocaleString()} />
                <Info label="Updated" value={new Date(data.run.updatedAt).toLocaleString()} />
              </div>
              {data.run.tags && data.run.tags.length > 0 && (
                <div>
                  <div className="text-xs text-slate-400 mb-1">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {data.run.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-200">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {data.summary && Object.keys(data.summary).length > 0 && (
                <div>
                  <div className="text-xs text-slate-400 mb-1">Summary Metrics</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(data.summary).slice(0, 12).map(([k,v]) => (
                      <div key={k} className="bg-slate-800/60 border border-slate-700 rounded p-2">
                        <div className="text-[10px] text-slate-400 truncate">{k}</div>
                        <div className="text-sm text-slate-100 font-mono truncate">{typeof v === 'number' ? v.toFixed(6) : String(v)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <a
                className="inline-block mt-2 text-sm text-blue-300 hover:text-blue-200 underline"
                href={`https://wandb.ai/${runRef.entity}/${runRef.project}/runs/${data.run.name}`}
                target="_blank"
                rel="noreferrer"
              >
                Open in W&B
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded p-2">
      <div className="text-[10px] text-slate-400">{label}</div>
      <div className="text-slate-100 text-sm truncate">{value || '-'}</div>
    </div>
  )
}
