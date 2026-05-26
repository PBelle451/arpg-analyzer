import { useState } from 'react'
import axios from 'axios'

const PLAYSTYLES = [
  { id: 'allrounder', label: '⚖️ All-Rounder', desc: 'Equilíbrio entre tudo' },
  { id: 'clearspeed', label: '⚡ Clear Speed', desc: 'Farm rápido de mapas' },
  { id: 'bossing',    label: '💀 Bossing',     desc: 'Matar bosses difíceis' },
  { id: 'hardcore',   label: '🛡 Hardcore',    desc: 'Sobrevivência acima de tudo' },
]

const CLASSES = ['', 'Witch', 'Ranger', 'Monk', 'Warrior', 'Sorceress', 'Mercenary']

export default function Recomendar() {
  const [playstyle, setPlaystyle] = useState('allrounder')
  const [classe, setClasse] = useState('')
  const [resultado, setResultado] = useState([])
  const [carregando, setCarregando] = useState(false)

  function buscar() {
    setCarregando(true)
    const params = { playstyle }
    if (classe) params.classe = classe
    axios.get('http://127.0.0.1:8000/recomendar', { params })
      .then(r => setResultado(r.data))
      .finally(() => setCarregando(false))
  }

  const corScore = s => s >= 70 ? '#27ae60' : s >= 40 ? '#f39c12' : '#c0392b'

  return (
    <div>
      <h2>Recomendar Build</h2>

      <h3 style={{ color: '#888', fontWeight: 'normal' }}>Como você quer jogar?</h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {PLAYSTYLES.map(p => (
          <div
            key={p.id}
            onClick={() => setPlaystyle(p.id)}
            style={{
              border: `2px solid ${playstyle === p.id ? '#c0392b' : '#ddd'}`,
              borderRadius: 8,
              padding: '12px 16px',
              cursor: 'pointer',
              background: playstyle === p.id ? '#fff5f5' : 'white',
              minWidth: 130,
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{p.label}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{p.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <select
          value={classe}
          onChange={e => setClasse(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: 14 }}
        >
          {CLASSES.map(c => (
            <option key={c} value={c}>{c || 'Qualquer classe'}</option>
          ))}
        </select>

        <button
          onClick={buscar}
          style={{
            padding: '8px 24px',
            background: '#c0392b',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: 14,
          }}
        >
          {carregando ? 'Buscando...' : 'Recomendar →'}
        </button>
      </div>

      {resultado.map((r, i) => (
        <div
          key={i}
          style={{
            border: `1px solid ${i === 0 ? '#c0392b' : '#eee'}`,
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            background: i === 0 ? '#fff5f5' : 'white',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              {i === 0 && (
                <span style={{ background: '#c0392b', color: 'white', fontSize: 11, padding: '2px 8px', borderRadius: 10, marginBottom: 6, display: 'inline-block' }}>
                  Melhor match
                </span>
              )}
              <div style={{ fontWeight: 'bold', fontSize: 16 }}>{r.nome}</div>
              <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
                {r.classe} · {r.ascendancy} · {r.main_skill}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: corScore(r.score) }}>{r.score}</div>
              <div style={{ fontSize: 11, color: '#888' }}>score</div>
            </div>
          </div>

          {r.motivos.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {r.motivos.map((m, j) => (
                <span key={j} style={{ background: '#e8f5e9', color: '#27ae60', fontSize: 12, padding: '3px 10px', borderRadius: 10 }}>
                  ✓ {m}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 13, color: '#888' }}>
            <span>Popularidade: <strong style={{ color: '#333' }}>{r.popularidade}</strong></span>
            {r.hc_viable && <span style={{ color: '#27ae60' }}>🛡 HC Viable</span>}
          </div>
        </div>
      ))}
    </div>
  )
}