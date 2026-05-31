import { useState } from 'react'
import axios from 'axios'

const PLAYSTYLES = [
  { id: 'allrounder', icon: '⚖️', label: 'All-Rounder',  desc: 'Equilíbrio entre tudo' },
  { id: 'clearspeed', icon: '⚡', label: 'Clear Speed',  desc: 'Farm rápido de mapas' },
  { id: 'bossing',    icon: '💀', label: 'Bossing',      desc: 'Matar bosses difíceis' },
  { id: 'hardcore',   icon: '🛡', label: 'Hardcore',     desc: 'Sobrevivência acima de tudo' },
]

const CLASSES = ['', 'Witch', 'Ranger', 'Monk', 'Warrior', 'Sorceress', 'Mercenary']

const COR_SCORE = s => s >= 70 ? 'text-green-400' : s >= 40 ? 'text-yellow-400' : 'text-red-400'
const BG_SCORE  = s => s >= 70 ? 'bg-green-500'  : s >= 40 ? 'bg-yellow-500'  : 'bg-red-500'

export default function Recomendar() {
  const [playstyle, setPlaystyle] = useState('allrounder')
  const [classe, setClasse] = useState('')
  const [resultado, setResultado] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [buscou, setBuscou] = useState(false)

  function buscar() {
    setCarregando(true)
    setBuscou(true)
    const params = { playstyle }
    if (classe) params.classe = classe
    axios.get('http://127.0.0.1:8000/recomendar', { params })
      .then(r => setResultado(r.data))
      .finally(() => setCarregando(false))
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Recomendar Build</h2>
        <p className="text-sm text-gray-400">Encontre a build ideal para o seu estilo de jogo</p>
      </div>

      {/* Playstyle */}
      <div>
        <p className="text-sm text-gray-400 mb-3">Como você quer jogar?</p>
        <div className="grid grid-cols-4 gap-3">
          {PLAYSTYLES.map(p => (
            <button
              key={p.id}
              onClick={() => setPlaystyle(p.id)}
              className={`rounded-xl p-4 border text-left transition-all ${
                playstyle === p.id
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-2">{p.icon}</div>
              <div className="font-medium text-white text-sm">{p.label}</div>
              <div className="text-xs text-gray-400 mt-1">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Classe + botão */}
      <div className="flex gap-3 items-end">
        <div>
          <p className="text-sm text-gray-400 mb-2">Classe preferida</p>
          <select
            value={classe}
            onChange={e => setClasse(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
          >
            {CLASSES.map(c => <option key={c} value={c}>{c || 'Qualquer classe'}</option>)}
          </select>
        </div>

        <button
          onClick={buscar}
          className="px-8 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors"
        >
          {carregando ? 'Analisando...' : 'Recomendar →'}
        </button>
      </div>

      {/* Resultados */}
      {buscou && !carregando && resultado.length === 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl px-5 py-8 text-center text-gray-400">
          Nenhuma build encontrada com esses filtros.
        </div>
      )}

      <div className="space-y-4">
        {resultado.map((r, i) => (
          <div
            key={i}
            className={`rounded-xl border p-5 transition-all ${
              i === 0
                ? 'border-red-500 bg-red-500/5'
                : 'border-gray-700 bg-gray-800'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                {i === 0 && (
                  <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-medium mb-2 inline-block">
                    ⭐ Melhor match
                  </span>
                )}
                <h3 className="text-white font-bold text-lg">{r.nome}</h3>
                <p className="text-gray-400 text-sm mt-0.5">
                  {r.classe} · {r.ascendancy} · {r.main_skill}
                </p>
              </div>

              <div className="text-right">
                <div className={`text-3xl font-bold ${COR_SCORE(r.score)}`}>{r.score}</div>
                <div className="text-xs text-gray-500">score</div>
                <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden mt-1">
                  <div className={`h-full rounded-full ${BG_SCORE(r.score)}`} style={{ width: `${r.score}%` }} />
                </div>
              </div>
            </div>

            {r.motivos.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {r.motivos.map((m, j) => (
                  <span key={j} className="text-xs bg-green-900 text-green-300 border border-green-700 px-3 py-0.5 rounded-full">
                    ✓ {m}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-4 text-sm text-gray-400">
              <span>Popularidade: <strong className="text-white">{r.popularidade}</strong></span>
              {r.hc_viable && <span className="text-green-400 font-medium">🛡 HC Viable</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}