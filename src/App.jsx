import { useEffect, useMemo, useState } from 'react'
import TopBar from './components/TopBar'
import RunCard from './components/RunCard'
import RunDetailSheet from './components/RunDetailSheet'

function App() {
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wandb_settings')) || { entity: '', project: '', limit: 25 }
    } catch {
      return { entity: '', project: '', limit: 25 }
    }
  })
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  const backendUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])

  const fetchRuns = async (opts) => {
    const { entity, project, limit } = opts || settings
    if (!entity || !project) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ entity, project, limit: String(limit || 25) })
      const res = await fetch(`${backendUrl}/api/wandb/runs?${params.toString()}`)
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      const json = await res.json()
      const enriched = (json.runs || []).map((r) => ({ ...r, entity, project }))
      setRuns(enriched)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Auto-load if settings exist
    if (settings.entity && settings.project) {
      fetchRuns(settings)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <TopBar
        values={settings}
        onChange={(v) => {
          setSettings(v)
          fetchRuns(v)
        }}
        onRefresh={() => fetchRuns(settings)}
      />

      <div className="max-w-3xl mx-auto px-4 py-4">
        {!settings.entity || !settings.project ? (
          <div className="text-center text-slate-300 mt-16">
            Enter your workspace and project to fetch runs.
          </div>
        ) : (
          <div>
            {loading && <div className="text-slate-300">Loading runs...</div>}
            {error && <div className="text-rose-400">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {runs.map((run) => (
                <RunCard key={run.id} run={run} onOpen={(r) => setSelected(r)} />)
              )}
            </div>
            {!loading && runs.length === 0 && (
              <div className="text-slate-400 mt-6">No runs found.</div>
            )}
          </div>
        )}
      </div>

      <RunDetailSheet open={!!selected} onClose={() => setSelected(null)} runRef={selected} backendUrl={backendUrl} />
    </div>
  )
}

export default App
