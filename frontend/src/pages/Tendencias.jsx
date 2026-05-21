import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Tendencias() {
  const [tendencias, setTendencias] = useState([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/meta/tendencias')
      .then(r => {
        if (r.data.erro) setErro(r.data.erro)
        else if (r.data.aviso) setErro(r.data.aviso)
        else setTendencias(r.data)
      })
  }, [])

  const cor = dir => dir === 'subindo' ? '#27ae60' : dir === 'caindo' ? '#c0392b' : '#888'
  const seta = dir => dir === 'subindo' ? '↑' : dir === 'caindo' ? '↓' : '→'

  return (
    <div>
      <h2>Tendências do Meta</h2>

      {erro && <p style={{ color: '#c0392b' }}>{erro}</p>}

      {tendencias.map((t, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid #eee' }}>
          <span style={{ width: 120, fontWeight: 'bold' }}>{t.classe}</span>
          <span style={{ width: 60, color: '#888', fontSize: 13 }}>Antes: {t.ontem}%</span>
          <span style={{ width: 60, fontSize: 13 }}>Agora: {t.hoje}%</span>
          <div style={{ background: '#eee', borderRadius: 4, flex: 1, height: 12 }}>
            <div style={{ background: cor(t.direcao), borderRadius: 4, height: 12, width: `${t.hoje}%` }} />
          </div>
          <span style={{ color: cor(t.direcao), fontWeight: 'bold', fontSize: 18 }}>{seta(t.direcao)}</span>
          <span style={{ color: cor(t.direcao), width: 60, textAlign: 'right', fontWeight: 'bold' }}>
            {t.variacao > 0 ? '+' : ''}{t.variacao}%
          </span>
        </div>
      ))}
    </div>
  )
}