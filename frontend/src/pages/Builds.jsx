import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Builds() {
  const [builds, setBuilds] = useState([])
  const [classe, setClasse] = useState('')
  const [hc, setHc] = useState('')

  function carregar() {
    const params = {}
    if (classe) params.classe = classe
    if (hc !== '') params.hc_viable = hc
    axios.get('http://127.0.0.1:8000/builds', { params }).then(r => setBuilds(r.data))
  }

  useEffect(() => { carregar() }, [])

  return (
    <div>
      <h2>Builds</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <select value={classe} onChange={e => setClasse(e.target.value)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd' }}>
          <option value=''>Todas as classes</option>
          {['Witch', 'Ranger', 'Monk', 'Warrior', 'Sorceress', 'Mercenary'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={hc} onChange={e => setHc(e.target.value)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd' }}>
          <option value=''>HC e não-HC</option>
          <option value='true'>Só HC Viable</option>
          <option value='false'>Só não-HC</option>
        </select>

        <button onClick={carregar} style={{ padding: '6px 16px', background: '#c0392b', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Filtrar
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Nome</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Classe</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Ascendancy</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Skill</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>Popularidade</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>HC</th>
          </tr>
        </thead>
        <tbody>
          {builds.map(b => (
            <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{b.nome}</td>
              <td style={{ padding: '10px' }}>{b.classe}</td>
              <td style={{ padding: '10px', color: '#888' }}>{b.ascendancy}</td>
              <td style={{ padding: '10px' }}>{b.main_skill}</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>{b.popularidade}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>{b.hc_viable ? '🛡' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}