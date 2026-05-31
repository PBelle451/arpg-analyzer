import { useState } from 'react'
import Meta from './pages/Meta'
import Builds from './pages/Builds'
import Tendencias from './pages/Tendencias'
import Recomendar from './pages/Recomendar'

const abas = [
  { id: 'Meta',       icon: '📊' },
  { id: 'Builds',     icon: '⚔️' },
  { id: 'Tendências', icon: '📈' },
  { id: 'Recomendar', icon: '🎯' },
]

export default function App() {
  const [aba, setAba] = useState('Meta')

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100" style={{ fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-red-500">⚡ ARPGMeta</span>
          <span className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded-full">LIVE</span>
        </div>
        <span className="text-sm text-gray-400">Path of Exile 2 — Settlers League</span>
      </header>

      {/* Nav */}
      <nav className="border-b border-gray-800 bg-gray-900 px-8 flex gap-1">
        {abas.map(a => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            className={`px-5 py-3 text-sm flex items-center gap-2 border-b-2 transition-colors ${
              aba === a.id
                ? 'border-red-500 text-red-400 font-medium'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {a.icon} {a.id}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-8 py-8">
        {aba === 'Meta'       && <Meta />}
        {aba === 'Builds'     && <Builds />}
        {aba === 'Tendências' && <Tendencias />}
        {aba === 'Recomendar' && <Recomendar />}
      </main>
    </div>
  )
}