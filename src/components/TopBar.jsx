import { useEffect, useState } from 'react'

export default function TopBar({ onChange, values, onRefresh }) {
  const [entity, setEntity] = useState(values.entity || '')
  const [project, setProject] = useState(values.project || '')
  const [limit, setLimit] = useState(values.limit || 25)

  useEffect(() => {
    setEntity(values.entity || '')
    setProject(values.project || '')
    setLimit(values.limit || 25)
  }, [values])

  const apply = () => {
    const v = { entity: entity.trim(), project: project.trim(), limit: Number(limit) || 25 }
    localStorage.setItem('wandb_settings', JSON.stringify(v))
    onChange && onChange(v)
  }

  return (
    <div className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-slate-800">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
        <div className="flex-1">
          <div className="text-white font-semibold">W&B Monitor</div>
          <div className="text-xs text-blue-200/70">Quickly check fine-tune progress</div>
        </div>
        <button
          onClick={onRefresh}
          className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>
      <div className="max-w-3xl mx-auto px-4 pb-3 grid grid-cols-3 gap-2">
        <input
          className="col-span-1 bg-slate-800 text-white rounded-md px-3 py-2 text-sm placeholder:text-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Entity"
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
        />
        <input
          className="col-span-1 bg-slate-800 text-white rounded-md px-3 py-2 text-sm placeholder:text-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />
        <div className="col-span-1 flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={200}
            className="w-full bg-slate-800 text-white rounded-md px-3 py-2 text-sm placeholder:text-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
          <button
            onClick={apply}
            className="whitespace-nowrap px-3 py-2 text-sm rounded-md bg-slate-700 text-white hover:bg-slate-600 transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
