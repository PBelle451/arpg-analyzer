import { useState } from 'react'
import Meta from './pages/Meta'
import Builds from './pages/Builds'
import Tendencias from './pages/Tendencias'
import Recomendar from './pages/Recomendar'

const abas = ['Meta', 'Builds', 'Tendências', 'Recomendar']

export default function App() {
  const [aba, setAba] = useState('Meta')

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ color: '#c0392b' }}>⚔️ ARPG Build Analyzer</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {abas.map(a => (
          <button
            key={a}
            onClick={() => setAba(a)}
            style={{
              padding: '8px 20px',
              background: aba === a ? '#c0392b' : '#eee',
              color: aba === a ? 'white' : 'black',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: aba === a ? 'bold' : 'normal'
            }}
          >
            {a}
          </button>
        ))}
      </div>

      {aba === 'Meta'       && <Meta />}
      {aba === 'Builds'     && <Builds />}
      {aba === 'Tendências' && <Tendencias />}
      {aba === 'Recomendar' && <Recomendar />}
    </div>
  )
}