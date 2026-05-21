import { useEffect, useState } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const CORES = ['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad']

export default function Meta() {
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/meta').then(r => setMeta(r.data))
  }, [])

  if (!meta) return <p>Carregando...</p>

  const pizza = Object.entries(meta.distribuicao_classes).map(([name, value]) => ({ name, value }))

  return (
    <div>
      <h2>Meta Atual</h2>

      <div style={{ display: 'flex', gap: 40, marginBottom: 32 }}>
        <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 16, minWidth: 160 }}>
          <p style={{ color: '#888', margin: 0 }}>Total de Builds</p>
          <p style={{ fontSize: 32, fontWeight: 'bold', margin: 0 }}>{meta.total_builds}</p>
        </div>
        <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 16, minWidth: 160 }}>
          <p style={{ color: '#888', margin: 0 }}>Classes no Meta</p>
          <p style={{ fontSize: 32, fontWeight: 'bold', margin: 0 }}>{meta.classes_no_meta}</p>
        </div>
        <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 16, minWidth: 160 }}>
          <p style={{ color: '#888', margin: 0 }}>HC Viable</p>
          <p style={{ fontSize: 32, fontWeight: 'bold', margin: 0 }}>{meta.hc_viable_pct}%</p>
        </div>
      </div>

      <h3>Distribuição por Classe</h3>
      <PieChart width={400} height={300}>
        <Pie data={pizza} dataKey="value" nameKey="name" outerRadius={100} label={({ name, value }) => `${name} ${value}%`}>
          {pizza.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>

      <h3>Top Skills</h3>
      {meta.top_skills.map((b, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ width: 20, color: '#888' }}>{i + 1}</span>
          <span style={{ width: 200 }}>{b.nome}</span>
          <span style={{ width: 80, color: '#888' }}>{b.classe}</span>
          <div style={{ background: '#eee', borderRadius: 4, flex: 1, height: 16 }}>
            <div style={{ background: '#c0392b', borderRadius: 4, height: 16, width: `${(b.popularidade / meta.top_skills[0].popularidade) * 100}%` }} />
          </div>
          <span style={{ width: 40, textAlign: 'right' }}>{b.popularidade}</span>
        </div>
      ))}
    </div>
  )
}