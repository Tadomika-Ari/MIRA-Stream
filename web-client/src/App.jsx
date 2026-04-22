import { useEffect, useState, useRef } from 'react'
import './App.css'
import { Navigate, useNavigate } from 'react-router-dom'

const folderIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-12 w-12 text-amber-300">
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4l2 2h7A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const fileIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-12 w-12 text-sky-300">
    <path d="M7 3.75h7l4 4v12.5A1.75 1.75 0 0 1 16.25 22h-9.5A1.75 1.75 0 0 1 5 20.25V5.5A1.75 1.75 0 0 1 6.75 3.75Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 3.75V8h4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

function App() {
  const [explorerItems, setExplorerItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const items = [
    { label: 'Ce connecter' },
    { label: 'Github' },
  ]

  const sectionRef = useRef(null)

  const loadExplorerItems = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await fetch('http://localhost:8000/')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      setExplorerItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erreur requête:', err)
      setExplorerItems([])
      setError("Impossible de charger le dossier.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExplorerItems()
  }, [])

  const handleScroll = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const renderIcon = (type) => (type === 'dir' ? folderIcon : fileIcon)

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <a href="/" className="text-xl font-semibold tracking-wide text-white">
          MIRA Stream
        </a>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-5 text-sm">
            {items.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={handleScroll}
                  className="text-zinc-200 transition hover:text-white"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-6xl flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            Bienvenue sur Mira Stream
          </h1>

          <button
            type="button"
            onClick={() => navigate('/conn')}
            className="mt-6 rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 text-sm transition hover:bg-zinc-700"
          >
            Ce connecter au serveur
          </button>
        </section>

        <section ref={sectionRef} className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8">
          <p className="text-center text-zinc-300">
            Ton header est maintenant rendu par un composant React local, sans librairie externe.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={loadExplorerItems}
              className="rounded-md border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm transition hover:bg-zinc-700"
            >
              Tester API
            </button>
          </div>
        </section>
        <section className="mx-auto w-full max-w-6xl px-4 pb-20">
          <div className="mx-auto w-full max-w-xl rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <p className="mb-3 text-sm font-semibold text-zinc-100">Explorateur</p>

            {loading ? (
              <p className="py-10 text-center text-sm text-zinc-300">Chargement du dossier...</p>
            ) : error ? (
              <p className="py-10 text-center text-sm text-zinc-300">{error}</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 text-sm text-zinc-200 sm:grid-cols-3">
                {explorerItems.map((item) => (
                  <li
                    key={item.name}
                    className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-3 text-center transition hover:bg-white/10"
                  >
                    {renderIcon(item.type)}
                    <span className="mt-2 text-xs">{item.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
