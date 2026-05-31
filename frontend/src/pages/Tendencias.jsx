import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Tendencias() {
  const [tendencias, setTendencias] = useState([])
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/meta/tendencias')
      .then(r => {
        if (r.data.erro || r.data.aviso) setAviso(r.data.erro || r.data.aviso)
        else setTendencias(r.data)
      })
  }, [])

  const cor = dir => dir === 'subindo' ? 'text-green-400' : dir === 'caindo' ? 'text-red-400' : 'text-gray-400'
  const bg  = dir => dir === 'subindo' ? 'bg-green-500' : dir === 'caindo' ? 'bg-red-500' : 'bg-gray-500'
  const seta = dir => dir === 'subindo' ? '↑' : dir === 'caindo' ? '↓' : '→'
  const badge = dir => dir === 'subindo'
    ? 'bg-green-900 text-green-300'
    : dir === 'caindo'
    ? 'bg-red-900 text-red-300'
    : 'bg-gray-700 text-gray-400'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Tendências do Meta</h2>
        <p className="text-sm text-gray-400">Comparação entre os dois últimos snapshots</p>
      </div>

      {aviso && (
        <div className="bg-yellow-900 border border-yellow-700 text-yellow-300 rounded-xl px-5 py-4 text-sm">
          ⚠️ {aviso}
        </div>
      )}

      <div className="space-y-4">
        {tendencias.map((t, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold text-lg">{t.classe}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge(t.direcao)}`}>
                  {seta(t.direcao)} {t.direcao}
                </span>
              </div>
              <span className={`text-2xl font-bold ${cor(t.direcao)}`}>
                {t.variacao > 0 ? '+' : ''}{t.variacao}%
              </span>
            </div>

            {/* Barra de progresso */}
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all ${bg(t.direcao)}`}
                style={{ width: `${Math.min(t.hoje, 100)}%` }}
              />
            </div>

            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-gray-500">Antes: </span>
                <span className="text-gray-300 font-medium">{t.ontem}%</span>
              </div>
              <div>
                <span className="text-gray-500">Agora: </span>
                <span className="text-white font-medium">{t.hoje}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}