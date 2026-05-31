import { useEffect, useState } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'

const CORES = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6']

function Card({ label, value, sub }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

export default function Meta() {
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/meta').then(r => setMeta(r.data))
  }, [])

  if (!meta) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500 animate-pulse">Carregando meta...</p>
    </div>
  )

  const pizza = Object.entries(meta.distribuicao_classes).map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Meta Atual</h2>
        <p className="text-sm text-gray-400">Distribuição do meta baseada nas builds coletadas</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-4">
        <Card label="Total de Builds" value={meta.total_builds} sub="no banco de dados" />
        <Card label="Classes no Meta" value={meta.classes_no_meta} sub="classes ativas" />
        <Card label="HC Viable" value={`${meta.hc_viable_pct}%`} sub="das builds" />
      </div>

      {/* Gráfico + Top Skills */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Distribuição por Classe</h3>
          <PieChart width={300} height={260}>
            <Pie
              data={pizza}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label={({ name, value }) => `${name} ${value}%`}
              labelLine={false}
            >
              {pizza.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
              itemStyle={{ color: '#e5e7eb' }}
            />
          </PieChart>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Top Skills</h3>
          <div className="space-y-3">
            {meta.top_skills.map((b, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-200">{b.nome}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{b.classe}</span>
                    <span className="text-white font-medium">{b.popularidade}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{ width: `${(b.popularidade / meta.top_skills[0].popularidade) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}