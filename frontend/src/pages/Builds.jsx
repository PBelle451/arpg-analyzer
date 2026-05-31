import { useEffect, useState } from 'react'
import axios from 'axios'

const CLASSES = ['', 'Witch', 'Ranger', 'Monk', 'Warrior', 'Sorceress', 'Mercenary']

const COR_CLASSE = {
  Witch:     'bg-purple-900 text-purple-300',
  Ranger:    'bg-green-900 text-green-300',
  Monk:      'bg-blue-900 text-blue-300',
  Warrior:   'bg-yellow-900 text-yellow-300',
  Sorceress: 'bg-cyan-900 text-cyan-300',
  Mercenary: 'bg-pink-900 text-pink-300',
}

export default function Builds() {
  const [builds, setBuilds] = useState([])
  const [classe, setClasse] = useState('')
  const [hc, setHc] = useState('')
  const [carregando, setCarregando] = useState(false)

  function carregar() {
    setCarregando(true)
    const params = {}
    if (classe) params.classe = classe
    if (hc !== '') params.hc_viable = hc
    axios.get('http://127.0.0.1:8000/builds', { params })
      .then(r => setBuilds(r.data))
      .finally(() => setCarregando(false))
  }

  useEffect(() => { carregar() }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Builds</h2>
        <p className="text-sm text-gray-400">Todas as builds coletadas com filtros</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-3">
        <select
          value={classe}
          onChange={e => setClasse(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
        >
          {CLASSES.map(c => <option key={c} value={c}>{c || 'Todas as classes'}</option>)}
        </select>

        <select
          value={hc}
          onChange={e => setHc(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
        >
          <option value=''>HC e não-HC</option>
          <option value='true'>Só HC Viable</option>
          <option value='false'>Só não-HC</option>
        </select>

        <button
          onClick={carregar}
          className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {carregando ? 'Buscando...' : 'Filtrar'}
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3">#</th>
              <th className="text-left px-5 py-3">Build</th>
              <th className="text-left px-5 py-3">Classe</th>
              <th className="text-left px-5 py-3">Skill</th>
              <th className="text-right px-5 py-3">Popularidade</th>
              <th className="text-center px-5 py-3">HC</th>
            </tr>
          </thead>
          <tbody>
            {builds.map((b, i) => (
              <tr key={b.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                <td className="px-5 py-3 text-gray-500">{i + 1}</td>
                <td className="px-5 py-3">
                  <p className="font-medium text-white">{b.nome}</p>
                  <p className="text-xs text-gray-500">{b.ascendancy}</p>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COR_CLASSE[b.classe] || 'bg-gray-700 text-gray-300'}`}>
                    {b.classe}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-300">{b.main_skill}</td>
                <td className="px-5 py-3 text-right">
                  <span className="font-bold text-white">{b.popularidade}</span>
                </td>
                <td className="px-5 py-3 text-center">
                  {b.hc_viable
                    ? <span className="text-green-400 text-base">🛡</span>
                    : <span className="text-gray-600">—</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}